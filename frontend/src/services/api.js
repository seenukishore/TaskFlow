import axios from 'axios'

const BACKEND_URL = 'https://taskflow-3szu.onrender.com'

const api = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true  // Important - cookies send pannuvom
})

// Request interceptor - still send Bearer token as fallback
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        // Try cookie-based refresh
        const res = await axios.post(
          `${BACKEND_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        )

        if (res.data.access_token) {
          localStorage.setItem('access_token', res.data.access_token)
          localStorage.setItem('refresh_token', res.data.refresh_token)
          original.headers.Authorization = `Bearer ${res.data.access_token}`
        }

        return api(original)
      } catch {
        localStorage.clear()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api