import { apiService } from './api.service'

export const roleRequestsService = {
  getAll: async () => {
    return await apiService.get('/api/role-requests')
  },

  getPending: async () => {
    return await apiService.get('/api/role-requests/pending')
  },

  create: async (data) => {
    return await apiService.post('/api/role-requests', data)
  },

  approve: async (id) => {
    return await apiService.patch(`/api/role-requests/${id}/approve`)
  },

  reject: async (id, reason) => {
    return await apiService.patch(`/api/role-requests/${id}/reject`, { reason })
  }
}
