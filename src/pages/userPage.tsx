import { useMemo, useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import AddPatientDialog from "@/components/userManagement/addUserDialog"
import EditPatientDialog from "@/components/userManagement/editUserDialog"
import DetailPatientDialog from "@/components/userManagement/detailUserDialog"
import DeletePatientDialog from "@/components/userManagement/deleteUserDialog"
import { userService, type User, type UserCreate, type UserUpdate } from "@/services/userService"
import type { PatientFormValues } from "@/components/userManagement/userFields"
import DataTable from "@/components/datatable"

type UIPatient = {
  id: string
  name: string
  nik: string
  birthDate: string
  gender: "L" | "P"
  phone: string
  address: string
}

function mapUserToUI(u: User): UIPatient {
  const gender = (u.gender || "").toUpperCase()
  return {
    id: u.id,
    name: u.fullName || u.email,
    nik: u.nik || "-",
    birthDate: "-",
    gender: gender === "MALE" || gender === "L" ? "L" : "P",
    phone: u.phone || "-",
    address: "-",
  }
}

function UserPage() {
  const [patients, setPatients] = useState<UIPatient[]>([])
  const [query, setQuery] = useState("")
  const [detailPatient, setDetailPatient] = useState<UIPatient | null>(null)
  const [editPatient, setEditPatient] = useState<UIPatient | null>(null)
  const [deletePatient, setDeletePatient] = useState<UIPatient | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, male: 0, female: 0, recentAdded: 0 })
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      try {
        const response = await userService.getAll({ page, limit: pageSize })
        if (response.success && response.data) {
          const list = response.data.map(mapUserToUI)
          setPatients(list)
          const male = list.filter(p => p.gender === "L").length
          const female = list.filter(p => p.gender === "P").length
          const total = response.pagination?.totalUsers ?? list.length
          setTotalItems(total)
          setStats({ total, male, female, recentAdded: 0 })
        }
      } catch (error) {
        console.error("Error loading users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [page, pageSize])

  const filtered = useMemo(() => {
    if (!query.trim()) return patients
    const q = query.trim().toLowerCase()
    return patients.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.nik.toLowerCase().includes(q) ||
      p.phone.toLowerCase().includes(q)
    )
  }, [patients, query])

  const handleAddPatient = async (values: PatientFormValues) => {
    try {
      const payload: UserCreate = {
        email: values.email!,
        password: values.password!,
        fullName: values.name,
        phone: values.phone,
        nik: values.nik,
        gender: values.gender === 'L' ? 'MALE' : 'FEMALE',
      }
      const response = await userService.create(payload)
      if (response.success && response.data) {
        const created = mapUserToUI(response.data)
        setPatients(prev => [created, ...prev])
        const male = (created.gender === 'L' ? 1 : 0) + prevCount(patients, 'L')
        const female = (created.gender === 'P' ? 1 : 0) + prevCount(patients, 'P')
        setStats({ total: patients.length + 1, male, female, recentAdded: 0 })
      }
    } catch (error) {
      console.error("Error adding user:", error)
    }
  }

  function prevCount(list: UIPatient[], g: 'L' | 'P') { return list.filter(p => p.gender === g).length }

  const handleUpdatePatient = async (values: PatientFormValues & { id: string }) => {
    if (!values.id) return
    try {
      const payload: UserUpdate = {
        id: values.id,
        email: values.email,
        fullName: values.name,
        phone: values.phone,
        nik: values.nik,
        gender: values.gender === 'L' ? 'MALE' : 'FEMALE',
        ...(values.password ? { password: values.password } : {}),
      }
      const response = await userService.update(values.id, payload)
      if (response.success && response.data) {
        const updated = mapUserToUI(response.data)
        setPatients(prev => prev.map(p => p.id === values.id ? updated : p))
      }
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const handleDeletePatient = async (id: string) => {
    try {
      const response = await userService.delete(id)
      if (response.success) {
        setPatients(prev => prev.filter(p => p.id !== id))
        if (detailPatient?.id === id) setDetailPatient(null)
        if (editPatient?.id === id) setEditPatient(null)
        setDeletePatient(null)
        const male = prevCount(patients.filter(p => p.id !== id), 'L')
        const female = prevCount(patients.filter(p => p.id !== id), 'P')
        setStats({ total: patients.length - 1, male, female, recentAdded: 0 })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
  }

  const columns = [
    {
      key: 'name', header: 'Nama', render: (p: UIPatient) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
            {p.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-foreground">{p.name}</span>
        </div>
      )
    },
    {
      key: 'nik', header: 'NIK', render: (p: UIPatient) => (
        <span className="font-mono text-sm bg-muted px-2 py-1 rounded-md">{p.nik}</span>
      )
    },
    {
      key: 'gender', header: 'Gender', render: (p: UIPatient) => (
        <Badge
          variant="secondary"
          className={`${p.gender === "L"
              ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700"
              : "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 border-pink-200 dark:border-pink-700"
            }`}
        >
          {p.gender === "L" ? "Laki-laki" : "Perempuan"}
        </Badge>
      )
    },
    {
      key: 'phone', header: 'Telepon', render: (p: UIPatient) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">📞</span>
          <span className="font-mono text-sm">{p.phone}</span>
        </div>
      )
    },
    {
      key: 'address', header: 'Alamat', render: (p: UIPatient) => (
        <div className="flex items-center gap-2 max-w-[280px]">
          <span className="text-lg">📍</span>
          <span className="truncate text-sm text-muted-foreground">{p.address}</span>
        </div>
      )
    },
    {
      key: 'actions', header: 'Aksi', render: (p: UIPatient) => (
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDetailPatient(p)}
                  className="h-8 w-8 p-0 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  👁️
                </Button>
              </TooltipTrigger>
              <TooltipContent>Lihat detail pasien</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditPatient(p)}
                  className="h-8 w-8 p-0 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                >
                  ✏️
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit data pasien</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletePatient(p)}
                  className="h-8 w-8 p-0 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  🗑️
                </Button>
              </TooltipTrigger>
              <TooltipContent>Hapus pasien</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )
    },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Total Pasien</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Semua pasien terdaftar</p>
              </div>
              <div className="h-12 w-12 bg-blue-500 dark:bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">Laki-laki</p>
                <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">{stats.male}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">Pasien pria</p>
              </div>
              <div className="h-12 w-12 bg-indigo-500 dark:bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">👨</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-800 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-700 dark:text-pink-300 mb-1">Perempuan</p>
                <p className="text-3xl font-bold text-pink-900 dark:text-pink-100">{stats.female}</p>
                <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">Pasien wanita</p>
              </div>
              <div className="h-12 w-12 bg-pink-500 dark:bg-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">👩</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Baru (7 hari)</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.recentAdded}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Pasien baru</p>
              </div>
              <div className="h-12 w-12 bg-green-500 dark:bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">🆕</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="shadow-lg border-0 dark:border-gray-800">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manajemen Pengguna</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Kelola data pengguna: tambah, lihat, ubah, hapus. Total: {patients.length} pengguna
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Input
                  placeholder="Cari nama/NIK/telepon/alamat..."
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="h-11 pl-10 pr-4 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  🔍
                </div>
              </div>
              <AddPatientDialog onAdd={handleAddPatient} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Memuat data pasien...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filtered}
              page={page}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </CardContent>
      </Card>

      <DetailPatientDialog
        patient={detailPatient}
        open={!!detailPatient}
        onOpenChange={(open: boolean) => !open && setDetailPatient(null)}
      />
      <EditPatientDialog
        patient={editPatient}
        open={!!editPatient}
        onOpenChange={(open: boolean) => !open && setEditPatient(null)}
        onSave={handleUpdatePatient}
      />
      <DeletePatientDialog
        patient={deletePatient}
        open={!!deletePatient}
        onOpenChange={(open: boolean) => !open && setDeletePatient(null)}
        onConfirm={handleDeletePatient}
      />
    </div>
  )
}

export default UserPage


