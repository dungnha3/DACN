import { apiService } from '@/shared/services/api.service'

// User API for project module
export const userApi = {
  // Search users by email or username
  searchUsers: async (query) => {
    try {
      // Try multiple endpoints for user search
      // First try: /api/users/search
      try {
        const response = await apiService.get(`/api/users/search?q=${encodeURIComponent(query)}`)
        return response
      } catch (err) {
        // Fallback: /users endpoint with filter
        const users = await apiService.get('/users')
        // Client-side filtering if backend doesn't support search
        return users.filter(user => 
          user.email?.toLowerCase().includes(query.toLowerCase()) ||
          user.username?.toLowerCase().includes(query.toLowerCase()) ||
          user.hoTen?.toLowerCase().includes(query.toLowerCase())
        )
      }
    } catch (error) {
      throw error
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await apiService.get(`/api/users/${userId}`)
      return response
    } catch (error) {
      throw error;
    }
  },

  // Get all users (for dropdown, etc.)
  getAllUsers: async () => {
    try {
      const response = await apiService.get('/users')
      return response
    } catch (error) {
      throw error;
    }
  }
}
