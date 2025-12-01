import { apiService } from './api.service'

// Backend uses /api/cham-cong prefix
const BASE_PATH = '/api/cham-cong'

export const attendanceService = {
  getAll: async () => {
    return await apiService.get(BASE_PATH)
  },

  getByEmployee: async (employeeId) => {
    return await apiService.get(`${BASE_PATH}/nhan-vien/${employeeId}`)
  },

  // Get attendance by month
  getByMonth: async (employeeId, year, month) => {
    return await apiService.get(`${BASE_PATH}/nhan-vien/${employeeId}/month`, {
      params: { year, month }
    })
  },

  // Alternative endpoint for monthly attendance
  getMonthlyAttendance: async (employeeId, year, month) => {
    return await apiService.get(`${BASE_PATH}/nhan-vien/${employeeId}/month`, {
      params: { year, month }
    })
  },

  checkIn: async (employeeId, date) => {
    return await apiService.post(`${BASE_PATH}/check-in`, null, {
      params: { nhanvienId: employeeId, ngayCham: date }
    })
  },

  // GPS-based check-in
  gpsCheckIn: async (employeeId, latitude, longitude, address) => {
    return await apiService.post(`${BASE_PATH}/gps`, {
      nhanvienId: employeeId,
      latitude,
      longitude,
      diaChiCheckin: address
    })
  },

  checkOut: async (attendanceId) => {
    return await apiService.patch(`${BASE_PATH}/${attendanceId}/check-out`)
  },

  // Get today's attendance status
  getStatus: async (employeeId) => {
    return await apiService.get(`${BASE_PATH}/status/${employeeId}`)
  },

  // Alias for getStatus
  getTodayStatus: async (employeeId) => {
    return await apiService.get(`${BASE_PATH}/status/${employeeId}`)
  },

  // Get working days count
  getWorkingDays: async (employeeId, year, month) => {
    return await apiService.get(`${BASE_PATH}/nhan-vien/${employeeId}/working-days`, {
      params: { year, month }
    })
  },

  // Get total working hours
  getTotalHours: async (employeeId, year, month) => {
    return await apiService.get(`${BASE_PATH}/nhan-vien/${employeeId}/total-hours`, {
      params: { year, month }
    })
  },

  // Get statistics (late/early counts)
  getStatistics: async (employeeId, year, month) => {
    return await apiService.get(`${BASE_PATH}/nhan-vien/${employeeId}/statistics`, {
      params: { year, month }
    })
  },

  // Get by date range
  getByDateRange: async (startDate, endDate) => {
    return await apiService.get(`${BASE_PATH}/date-range`, {
      params: { startDate, endDate }
    })
  },

  create: async (data) => {
    return await apiService.post(BASE_PATH, data)
  },

  update: async (id, data) => {
    return await apiService.put(`${BASE_PATH}/${id}`, data)
  },

  delete: async (id) => {
    return await apiService.delete(`${BASE_PATH}/${id}`)
  }
}
