export type User = {
  id: string
  email: string
  fullName: string
  phone?: string | null
  nik?: string | null
  gender?: string | null
  role?: string
  isActive?: boolean
  createdAt?: string
}

export type UserCreate = {
  email: string
  password: string
  fullName: string
  phone?: string
  nik?: string
  gender?: 'MALE' | 'FEMALE' | 'L' | 'P'
  role?: string
  isActive?: boolean
}

export type UserUpdate = Partial<Omit<UserCreate, 'password'>> & {
  id: string
  password?: string
}

