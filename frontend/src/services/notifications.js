import api from './api'

export const notificationsService = {
  getNotifications: async (params = {}) => {
    const res = await api.get('/notifications/', { params })
    return res.data
  },

  markAsRead: async (notificationId) => {
    const res = await api.put(`/notifications/${notificationId}/read`)
    return res.data
  },

  markAllRead: async () => {
    const res = await api.put('/notifications/mark-all-read')
    return res.data
  },

  deleteNotification: async (notificationId) => {
    const res = await api.delete(`/notifications/${notificationId}`)
    return res.data
  }
}