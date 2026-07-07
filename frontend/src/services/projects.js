import api from './api'

export const projectsService = {
  getProjects: async (orgId, params = {}) => {
    const res = await api.get(`/organizations/${orgId}/projects/`, { params })
    return res.data
  },

  getProject: async (orgId, projectId) => {
    const res = await api.get(`/organizations/${orgId}/projects/${projectId}`)
    return res.data
  },

  createProject: async (orgId, data) => {
    const res = await api.post(`/organizations/${orgId}/projects/`, data)
    return res.data
  },

  updateProject: async (orgId, projectId, data) => {
    const res = await api.put(`/organizations/${orgId}/projects/${projectId}`, data)
    return res.data
  },

  deleteProject: async (orgId, projectId) => {
    const res = await api.delete(`/organizations/${orgId}/projects/${projectId}`)
    return res.data
  }
}

export const organizationsService = {
  getOrganizations: async () => {
    const res = await api.get('/organizations/')
    return res.data
  },

  createOrganization: async (data) => {
    const res = await api.post('/organizations/', data)
    return res.data
  },

  getOrganization: async (orgId) => {
    const res = await api.get(`/organizations/${orgId}`)
    return res.data
  },

  addMember: async (orgId, data) => {
    const res = await api.post(`/organizations/${orgId}/members`, data)
    return res.data
  },

  createTeam: async (orgId, data) => {
    const res = await api.post(`/organizations/${orgId}/teams`, data)
    return res.data
  },

  getTeams: async (orgId) => {
    const res = await api.get(`/organizations/${orgId}/teams`)
    return res.data
  }
}
export const analyticsService = {
  getAnalytics: async (orgId) => {
    const res = await api.get(`/analytics/${orgId}`)
    return res.data
  }
}