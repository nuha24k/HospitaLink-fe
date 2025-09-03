import api from './apiService'

type WebLoginResponse = {
  success: boolean
  message: string
  data?: {
    token: string
    user: unknown
    loginMethod: string
    platform: string
  }
}

export const authService = {
  async loginWeb(payload: { email: string; password: string }): Promise<{ success: boolean; token?: string; user?: unknown; message?: string }> {
    try {
      const res = await api.post<WebLoginResponse>('/auth/web/login', payload)
      if (res.data.success && res.data.data?.token) {
        const { token, user } = res.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        return { success: true, token, user }
      }
      return { success: false, message: res.data.message }
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any
      const message: string = error?.response?.data?.message || 'Login gagal'
      return { success: false, message }
    }
  },

  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  },
}

export default authService


