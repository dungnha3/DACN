import { apiService } from './api.service'

export const notificationService = {
  // Get all notifications for current user
  getMyNotifications: async (page = 0, size = 20) => {
    try {
      // Use ThongBaoController endpoint
      // CRITICAL FIX: Use sortBy=thongbaoId to avoid duplicate column error in SQL Server
      // The repository already hardcodes 'ORDER BY ngayTao', so we must NOT sort by ngayTao in Pageable
      const response = await apiService.get(`/api/thong-bao/page?page=${page}&size=${size}&sortBy=thongbaoId&sortDir=desc`)
      
      // Check if response is a Page object (has content field) or a List
      const items = response.content || response || []
      
      // Map Vietnamese DTO fields to English fields expected by UI
      return items.map(item => ({
        notificationId: item.thongbaoId,
        title: item.tieuDe,
        content: item.noiDung,
        type: item.loai,
        isRead: item.trangThai === 'DA_DOC' || !!item.ngayDoc,
        createdAt: item.ngayTao,
        link: item.urlLienKet
      }))
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      // Use ThongBaoController endpoint
      const response = await apiService.get('/api/thong-bao/unread-count')
      return response ? response.unreadCount : 0
    } catch (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await apiService.put(`/api/thong-bao/${notificationId}/read`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      const response = await apiService.put('/api/thong-bao/mark-all-read')
      return response
    } catch (error) {
      throw error
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await apiService.delete(`/api/thong-bao/${notificationId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
