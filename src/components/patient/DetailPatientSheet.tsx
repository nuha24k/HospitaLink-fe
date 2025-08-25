import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type Patient = {
  id: string
  name: string
  nik: string
  birthDate: string
  gender: "L" | "P"
  phone: string
  address: string
}

export default function DetailPatientSheet({
  patient,
  open,
  onOpenChange,
}: {
  patient: Patient | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!patient) return null
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl w-full">
        <SheetHeader>
          <SheetTitle>Detail Pasien</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <DetailRow label="Nama" value={patient.name} />
          <DetailRow label="NIK" value={patient.nik} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailRow label="Tanggal Lahir" value={patient.birthDate} />
            <div className="space-y-1">
              <Label className="text-muted-foreground">Gender</Label>
              <div className="text-sm">
                <Badge variant="secondary">{patient.gender === "L" ? "Laki-laki" : "Perempuan"}</Badge>
              </div>
            </div>
          </div>
          <DetailRow label="Telepon" value={patient.phone} />
          <DetailRow label="Alamat" value={patient.address} />
          <div className="pt-2">
            <SheetClose asChild>
              <Button variant="outline">Tutup</Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-muted-foreground">{label}</Label>
      <div className="text-sm">{value || "-"}</div>
    </div>
  )
}


