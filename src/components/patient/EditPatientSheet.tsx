import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Form } from "@/components/ui/form"
import { FieldText, FieldDate, FieldSelectGender, type PatientFormValues } from "./PatientFields"

type Patient = PatientFormValues & { id: string }

export default function EditPatientSheet({
  patient,
  open,
  onOpenChange,
  onSave,
}: {
  patient: Patient | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (values: Patient) => void
}) {
  const form = useForm<PatientFormValues>({
    values: patient
      ? {
          id: patient.id,
          name: patient.name,
          nik: patient.nik,
          birthDate: patient.birthDate,
          gender: patient.gender,
          phone: patient.phone,
          address: patient.address,
        }
      : undefined,
  })

  if (!patient) return null

  const handleSubmit = (values: PatientFormValues) => {
    onSave({ ...(values as Patient), id: patient.id })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl w-full">
        <SheetHeader>
          <SheetTitle>Edit Pasien</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
              <FieldText name="name" label="Nama" form={form} required />
              <FieldText name="nik" label="NIK" form={form} required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldDate name="birthDate" label="Tanggal Lahir" form={form} required />
                <FieldSelectGender name="gender" label="Gender" form={form} />
              </div>
              <FieldText name="phone" label="Telepon" form={form} required />
              <FieldText name="address" label="Alamat" form={form} required />

              <SheetFooter className="pt-2">
                <SheetClose asChild>
                  <Button type="button" variant="outline">Batal</Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button type="submit">Simpan Perubahan</Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}


