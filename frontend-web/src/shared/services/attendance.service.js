import { apiService } from './api.service'

export const attendanceService = {
  getAll: async () => {
    return await apiService.get('/cham-cong')
  },

  getByEmployee: async (employeeId) => {
    return await apiService.get(`/cham-cong/nhan-vien/${employeeId}`)
  },

  getByMonth: async (employeeId, year, month) => {
    return await apiService.get(`/cham-cong/nhan-vien/${employeeId}/thang/${month}/nam/${year}`)
  },

  checkIn: async (employeeId, date) => {
    return await apiService.post('/cham-cong/check-in', {
      nhanvienId: employeeId,
      ngayCham: date
    })
  },

  checkOut: async (attendanceId) => {
    return await apiService.patch(`/cham-cong/${attendanceId}/check-out`)
  },

  getStatus: async (employeeId) => {
    return await apiService.get(`/cham-cong/nhan-vien/${employeeId}/status`)
  },

  create: async (data) => {
    return await apiService.post('/cham-cong', data)
  },

  delete: async (id) => {
    return await apiService.delete(`/cham-cong/${id}`)
  }
}
