import { create } from 'zustand'
import { authService } from '../services/auth'

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authService.login({ email, password })
      const user = await authService.getMe()
      set({ user, isAuthenticated: true, isLoading: false })
      return data
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Login failed', isLoading: false })
      throw err
    }
  },

  register: async (email, full_name, password) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authService.register({ email, full_name, password })
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      const user = await authService.getMe()
      set({ user, isAuthenticated: true, isLoading: false })
      return data
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Register failed', isLoading: false })
      throw err
    }
  },

  logout: () => {
    authService.logout()
    set({ user: null, isAuthenticated: false })
  },

  fetchUser: async () => {
    try {
      const user = await authService.getMe()
      set({ user, isAuthenticated: true })
    } catch {
      set({ user: null, isAuthenticated: false })
    }
  },

  clearError: () => set({ error: null })
}))

export default useAuthStore