import api from './apiService'
import type { User, UserCreate, UserUpdate } from '@/types/userType'

type ApiListResponse = {
  success: boolean
  message: string
  data?: {
    users: User[]
    pagination?: {
      currentPage: number
      totalPages: number
      totalUsers: number
      limit: number
    }
  }
}

type ApiItemResponse = {
  success: boolean
  message: string
  data?: { user: User }
}

export const userService = {
  async getAll(params?: { page?: number; limit?: number }): Promise<{ success: boolean; data?: User[]; pagination?: { currentPage: number; totalPages: number; totalUsers: number; limit: number } }> {
    try {
      const { page = 1, limit = 10 } = params || {}
      const res = await api.get<ApiListResponse>(`/admin/users`, { params: { page, limit } })
      if (res.data.success) {
        return { success: true, data: res.data.data?.users || [], pagination: res.data.data?.pagination }
      }
      return { success: false }
    } catch (err) {
      console.error('userService.getAll error:', err)
      return { success: false }
    }
  },

  async getById(id: string): Promise<{ success: boolean; data?: User }> {
    try {
      const res = await api.get<ApiItemResponse>(`/admin/users/${id}`)
      if (res.data.success) {
        return { success: true, data: res.data.data?.user }
      }
      return { success: false }
    } catch (err) {
      console.error('userService.getById error:', err)
      return { success: false }
    }
  },

  async create(payload: UserCreate): Promise<{ success: boolean; data?: User }> {
    try {
      const res = await api.post<ApiItemResponse>(`/admin/users`, payload)
      if (res.data.success) {
        return { success: true, data: res.data.data?.user }
      }
      return { success: false }
    } catch (err) {
      console.error('userService.create error:', err)
      return { success: false }
    }
  },

  async update(id: string, payload: UserUpdate): Promise<{ success: boolean; data?: User }> {
    try {
      const res = await api.put<ApiItemResponse>(`/admin/users/${id}`, payload)
      if (res.data.success) {
        return { success: true, data: res.data.data?.user }
      }
      return { success: false }
    } catch (err) {
      console.error('userService.update error:', err)
      return { success: false }
    }
  },

  async delete(id: string): Promise<{ success: boolean }> {
    try {
      const res = await api.delete<ApiItemResponse>(`/admin/users/${id}`)
      return { success: !!res.data.success }
    } catch (err) {
      console.error('userService.delete error:', err)
      return { success: false }
    }
  },
}

export type { User, UserCreate, UserUpdate }

