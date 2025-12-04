import { apiService } from './api.service'
import { API_ENDPOINTS } from '@/config/api.config'

export const payrollService = {
  getByMonth: async (month, year) => {
    return await apiService.get(API_ENDPOINTS.HR.PAYROLL_BY_MONTH, {
      params: { thang: month, nam: year }
    })
  },

  getByEmployee: async (employeeId, month, year) => {
    return await apiService.get(`${API_ENDPOINTS.HR.PAYROLL_BY_EMPLOYEE(employeeId)}/period`, {
      params: { thang: month, nam: year }
    })
  },

  getByEmployeeAll: async (employeeId) => {
    return await apiService.get(API_ENDPOINTS.HR.PAYROLL_BY_EMPLOYEE(employeeId))
  },

  calculate: async (data) => {
    return await apiService.post(API_ENDPOINTS.HR.PAYROLL_CALCULATE, data)
  },

  markAsPaid: async (id) => {
    return await apiService.patch(`${API_ENDPOINTS.HR.PAYROLL_BY_ID(id)}/mark-paid`)
  }
}

