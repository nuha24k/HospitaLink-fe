import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Form } from "@/components/ui/form"
import { FieldText, FieldDate, FieldSelectGender, type PatientFormValues } from "./PatientFields"

export default function AddPatientSheet({ onAdd }: { onAdd: (values: PatientFormValues) => void }) {
  const form = useForm<PatientFormValues>({
    defaultValues: {
      name: "",
      nik: "",
      birthDate: "",
      gender: "L",
      phone: "",
      address: "",
    },
  })

  const handleSubmit = (values: PatientFormValues) => {
    onAdd(values)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Tambah Pasien</Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-xl w-full">
        <SheetHeader>
          <SheetTitle>Tambah Pasien</SheetTitle>
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
                  <Button type="submit">Simpan</Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}


