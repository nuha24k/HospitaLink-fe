import { useForm } from "react-hook-form"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export type PatientFormValues = {
  id?: string
  name: string
  nik: string
  birthDate: string
  gender: "L" | "P"
  phone: string
  address: string
}

export function FieldText({
  name,
  label,
  form,
  required,
}: {
  name: keyof PatientFormValues
  label: string
  form: ReturnType<typeof useForm<PatientFormValues>>
  required?: boolean
}) {
  return (
    <FormField
      control={form.control}
      name={name as any}
      rules={{ required: required ? "Wajib diisi" : false }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function FieldDate({
  name,
  label,
  form,
  required,
}: {
  name: keyof PatientFormValues
  label: string
  form: ReturnType<typeof useForm<PatientFormValues>>
  required?: boolean
}) {
  return (
    <FormField
      control={form.control}
      name={name as any}
      rules={{ required: required ? "Wajib diisi" : false }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type="date" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function FieldSelectGender({
  name,
  label,
  form,
}: {
  name: keyof PatientFormValues
  label: string
  form: ReturnType<typeof useForm<PatientFormValues>>
}) {
  return (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  className="h-4 w-4"
                  value="L"
                  checked={field.value === "L"}
                  onChange={() => field.onChange("L")}
                />
                <span className="text-sm">Laki-laki</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  className="h-4 w-4"
                  value="P"
                  checked={field.value === "P"}
                  onChange={() => field.onChange("P")}
                />
                <span className="text-sm">Perempuan</span>
              </label>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  )
}


