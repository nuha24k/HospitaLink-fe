import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import AddPatientSheet from "@/components/patient/AddPatientSheet"
import EditPatientSheet from "@/components/patient/EditPatientSheet"
import DetailPatientSheet from "@/components/patient/DetailPatientSheet"

type Patient = {
  id: string
  name: string
  nik: string
  birthDate: string
  gender: "L" | "P"
  phone: string
  address: string
}

const initialData: Patient[] = [
  {
    id: crypto.randomUUID(),
    name: "Budi Santoso",
    nik: "3173xxxxxxxx001",
    birthDate: "1990-05-20",
    gender: "L",
    phone: "081234567890",
    address: "Jl. Merdeka No. 1, Jakarta",
  },
  {
    id: crypto.randomUUID(),
    name: "Siti Aminah",
    nik: "3173xxxxxxxx002",
    birthDate: "1992-08-11",
    gender: "P",
    phone: "081298765432",
    address: "Jl. Sudirman No. 12, Bandung",
  },
]

function PatientPage() {
  const [patients, setPatients] = useState<Patient[]>(initialData)
  const [query, setQuery] = useState("")
  const [detailPatient, setDetailPatient] = useState<Patient | null>(null)
  const [editPatient, setEditPatient] = useState<Patient | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter((p) =>
      [p.name, p.nik, p.phone, p.address].some((v) => v.toLowerCase().includes(q))
    )
  }, [patients, query])

  const onDelete = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id))
    if (detailPatient?.id === id) setDetailPatient(null)
    if (editPatient?.id === id) setEditPatient(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Manajemen Pasien</CardTitle>
            <CardDescription>Kelola data pasien: tambah, lihat, ubah, hapus.</CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Cari nama/NIK/telepon/alamat..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <AddPatientSheet
              onAdd={(values) => {
                const newPatient: Patient = { id: crypto.randomUUID(), ...values }
                setPatients((prev) => [newPatient, ...prev])
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>NIK</TableHead>
                <TableHead>Tgl Lahir</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead className="w-[180px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.nik}</TableCell>
                  <TableCell>{p.birthDate}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.gender === "L" ? "Laki-laki" : "Perempuan"}</Badge>
                  </TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell className="max-w-[280px] truncate">{p.address}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <div className="flex gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="secondary" onClick={() => setDetailPatient(p)}>Detail</Button>
                          </TooltipTrigger>
                          <TooltipContent>Lihat detail pasien</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" onClick={() => setEditPatient(p)}>Edit</Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit data pasien</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="destructive" onClick={() => onDelete(p.id)}>Hapus</Button>
                          </TooltipTrigger>
                          <TooltipContent>Hapus pasien</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Tidak ada data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DetailPatientSheet
        patient={detailPatient}
        open={!!detailPatient}
        onOpenChange={(open) => !open && setDetailPatient(null)}
      />
      <EditPatientSheet
        patient={editPatient as unknown as {
          id: string
          name: string
          nik: string
          birthDate: string
          gender: "L" | "P"
          phone: string
          address: string
        } | null}
        open={!!editPatient}
        onOpenChange={(open) => !open && setEditPatient(null)}
        onSave={(values) => {
          setPatients((prev) => prev.map((p) => (p.id === values.id ? { ...p, ...values } : p)))
        }}
      />
    </div>
  )
}
export default PatientPage


