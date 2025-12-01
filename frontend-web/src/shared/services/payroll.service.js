import { apiService } from './api.service'

export const payrollService = {
  // Get all payrolls
  getAll: async () => {
    return await apiService.get('/bang-luong')
  },

  // Get payroll by period (month/year)
  getByMonth: async (month, year) => {
    return await apiService.get('/bang-luong/period', {
      params: { thang: month, nam: year }
    })
  },

  // Get payroll for a specific employee and period
  getByEmployee: async (employeeId, month, year) => {
    return await apiService.get(`/bang-luong/nhan-vien/${employeeId}/period`, {
      params: { thang: month, nam: year }
    })
  },

  // Get all payrolls for an employee
  getByEmployeeAll: async (employeeId) => {
    return await apiService.get(`/bang-luong/nhan-vien/${employeeId}`)
  },

  // Get paginated payrolls
  getPaginated: async (page = 0, size = 10, sortBy = 'thang', sortDir = 'desc') => {
    return await apiService.get('/bang-luong/page', {
      params: { page, size, sortBy, sortDir }
    })
  },

  // Create payroll
  create: async (data) => {
    return await apiService.post('/bang-luong', data)
  },

  // Auto calculate salary for an employee
  calculateAuto: async (employeeId, month, year) => {
    return await apiService.post(`/bang-luong/tinh-tu-dong/${employeeId}`, null, {
      params: { thang: month, nam: year }
    })
  },

  // Auto calculate salary for all employees
  calculateAutoAll: async (month, year) => {
    return await apiService.post('/bang-luong/tinh-tu-dong-tat-ca', null, {
      params: { thang: month, nam: year }
    })
  },

  // Mark as paid
  markAsPaid: async (id) => {
    return await apiService.patch(`/bang-luong/${id}/mark-paid`)
  },

  // Cancel payroll
  cancel: async (id) => {
    return await apiService.patch(`/bang-luong/${id}/cancel`)
  },

  // Get total salary by period
  getTotalByPeriod: async (month, year) => {
    return await apiService.get('/bang-luong/total/period', {
      params: { thang: month, nam: year }
    })
  }
}
