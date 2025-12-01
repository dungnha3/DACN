import { apiService } from './api.service'

export const reviewService = {
  // Get all reviews (HR/Admin)
  getAll: async () => {
    return await apiService.get('/api/danh-gia')
  },

  // Get paginated reviews
  getPaginated: async (page = 0, size = 10) => {
    return await apiService.get('/api/danh-gia/page', {
      params: { page, size }
    })
  },

  // Get reviews for a specific employee
  getByEmployee: async (employeeId) => {
    return await apiService.get(`/api/danh-gia/nhan-vien/${employeeId}`)
  },

  // Get review by ID
  getById: async (id) => {
    return await apiService.get(`/api/danh-gia/${id}`)
  },

  // Create new review (Manager/HR)
  create: async (data) => {
    return await apiService.post('/api/danh-gia', data)
  },

  // Update review
  update: async (id, data) => {
    return await apiService.put(`/api/danh-gia/${id}`, data)
  },

  // Delete review
  delete: async (id) => {
    return await apiService.delete(`/api/danh-gia/${id}`)
  },

  // Get pending reviews
  getPending: async () => {
    return await apiService.get('/api/danh-gia/pending')
  },

  // Submit review for approval
  submit: async (id) => {
    return await apiService.patch(`/api/danh-gia/${id}/submit`)
  },

  // Approve review
  approve: async (id) => {
    return await apiService.patch(`/api/danh-gia/${id}/approve`)
  },

  // Reject review
  reject: async (id) => {
    return await apiService.patch(`/api/danh-gia/${id}/reject`)
  }
}
