import { apiService } from './api.service'

export const notificationService = {
  // Get all notifications for current user
  getMyNotifications: async (page = 0, size = 20) => {
    try {
      const response = await apiService.get(`/api/notifications?page=${page}&size=${size}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await apiService.get('/api/notifications/unread/count')
      return response
    } catch (error) {
      throw error
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await apiService.put(`/api/notifications/${notificationId}/read`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      const response = await apiService.put('/api/notifications/read-all')
      return response
    } catch (error) {
      throw error
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await apiService.delete(`/api/notifications/${notificationId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
