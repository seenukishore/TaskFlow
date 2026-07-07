import api from './api'

export const tasksService = {
  getTasks: async (orgId, projectId, params = {}) => {
    const res = await api.get(
      `/organizations/${orgId}/projects/${projectId}/tasks/`,
      { params }
    )
    return res.data
  },

  getTask: async (orgId, projectId, taskId) => {
    const res = await api.get(
      `/organizations/${orgId}/projects/${projectId}/tasks/${taskId}`
    )
    return res.data
  },

  createTask: async (orgId, projectId, data) => {
    const res = await api.post(
      `/organizations/${orgId}/projects/${projectId}/tasks/`,
      data
    )
    return res.data
  },

  updateTask: async (orgId, projectId, taskId, data) => {
    const res = await api.put(
      `/organizations/${orgId}/projects/${projectId}/tasks/${taskId}`,
      data
    )
    return res.data
  },

  deleteTask: async (orgId, projectId, taskId) => {
    const res = await api.delete(
      `/organizations/${orgId}/projects/${projectId}/tasks/${taskId}`
    )
    return res.data
  },

  getComments: async (orgId, projectId, taskId) => {
    const res = await api.get(
      `/organizations/${orgId}/projects/${projectId}/tasks/${taskId}/comments/`
    )
    return res.data
  },

  createComment: async (orgId, projectId, taskId, data) => {
    const res = await api.post(
      `/organizations/${orgId}/projects/${projectId}/tasks/${taskId}/comments/`,
      data
    )
    return res.data
  }
}