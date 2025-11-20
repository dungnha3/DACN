import { apiService } from './api.service'

export const payrollService = {
  getByMonth: async (month, year) => {
    return await apiService.get(`/bang-luong/thang/${month}/nam/${year}`)
  },

  getByEmployee: async (employeeId, month, year) => {
    return await apiService.get(`/bang-luong/nhan-vien/${employeeId}/period`, {
      params: { month, year }
    })
  },

  calculate: async (data) => {
    return await apiService.post('/bang-luong/tinh-luong', data)
  },

  markAsPaid: async (id) => {
    return await apiService.patch(`/bang-luong/${id}/da-thanh-toan`)
  }
}
