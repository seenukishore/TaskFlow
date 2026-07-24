import api from './api'
import axios from 'axios'

const BACKEND_URL = 'https://taskflow-3szu.onrender.com'

export const authService = {
  register: async (data) => {
    const res = await api.post('/auth/register', data)
    if (res.data.access_token) {
      localStorage.setItem('access_token', res.data.access_token)
      localStorage.setItem('refresh_token', res.data.refresh_token)
    }
    return res.data
  },

  login: async (data) => {
    const res = await api.post('/auth/login', data)
    if (res.data.access_token) {
      localStorage.setItem('access_token', res.data.access_token)
      localStorage.setItem('refresh_token', res.data.refresh_token)
    }
    return res.data
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.clear()
      window.location.href = '/login'
    }
  },

  getMe: async () => {
    const res = await api.get('/users/me')
    return res.data
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token')
  }
}