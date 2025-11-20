import { apiService } from './api.service'

export const usersService = {
  getAll: async () => {
    return await apiService.get('/api/users')
  },

  getById: async (id) => {
    return await apiService.get(`/api/users/${id}`)
  },

  create: async (data) => {
    return await apiService.post('/api/users', data)
  },

  update: async (id, data) => {
    return await apiService.put(`/api/users/${id}`, data)
  },

  delete: async (id) => {
    return await apiService.delete(`/api/users/${id}`)
  },

  activate: async (id) => {
    return await apiService.patch(`/api/users/${id}/activate`)
  },

  deactivate: async (id) => {
    return await apiService.patch(`/api/users/${id}/deactivate`)
  }
}
