import { apiService } from './api.service'

export const leaveService = {
  getAll: async () => {
    return await apiService.get('/nghi-phep')
  },

  getByEmployee: async (employeeId) => {
    return await apiService.get(`/nghi-phep/nhan-vien/${employeeId}`)
  },

  getPending: async () => {
    return await apiService.get('/nghi-phep/pending')
  },

  create: async (data) => {
    return await apiService.post('/nghi-phep', data)
  },

  update: async (id, data) => {
    return await apiService.put(`/nghi-phep/${id}`, data)
  },

  delete: async (id) => {
    return await apiService.delete(`/nghi-phep/${id}`)
  },

  approve: async (id, note) => {
    return await apiService.patch(`/nghi-phep/${id}/approve`, { ghiChu: note })
  },

  reject: async (id, note) => {
    return await apiService.patch(`/nghi-phep/${id}/reject`, { ghiChu: note })
  }
}
