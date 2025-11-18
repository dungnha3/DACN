import { apiService } from '@/shared/services/api.service'

// Chat Room APIs
export const chatRoomApi = {
  // Lấy danh sách phòng chat của user
  getMyChatRooms: () => {
    return apiService.get('/api/chat/rooms')
  },

  // Tạo phòng chat mới
  createChatRoom: (roomData) => {
    return apiService.post('/api/chat/rooms', roomData)
  },

  // Lấy thông tin phòng chat theo ID
  getChatRoomById: (roomId) => {
    return apiService.get(`/api/chat/rooms/${roomId}`)
  },

  // Tìm hoặc tạo chat 1-1 với user khác
  createDirectChat: (userId) => {
    return apiService.post(`/api/chat/rooms/direct/${userId}`)
  },

  // Thêm thành viên vào phòng chat
  addMember: (roomId, userId) => {
    return apiService.post(`/api/chat/rooms/${roomId}/members/${userId}`)
  },

  // Xóa thành viên khỏi phòng chat
  removeMember: (roomId, userId) => {
    return apiService.delete(`/api/chat/rooms/${roomId}/members/${userId}`)
  },

  // Rời khỏi phòng chat
  leaveRoom: (roomId) => {
    return apiService.delete(`/api/chat/rooms/${roomId}/leave`)
  },

  // Thay đổi quyền thành viên
  changeMemberRole: (roomId, userId, role) => {
    return apiService.put(`/api/chat/rooms/${roomId}/members/${userId}/role?role=${role}`)
  },

  // Cập nhật thông tin phòng chat
  updateRoomSettings: (roomId, settings) => {
    return apiService.put(`/api/chat/rooms/${roomId}/settings`, settings)
  },

  // Lấy danh sách thành viên trong phòng
  getRoomMembers: (roomId) => {
    return apiService.get(`/api/chat/rooms/${roomId}/members`)
  },

  // Lấy project chat room theo projectId
  getProjectChatRoom: (projectId) => {
    return apiService.get(`/api/chat/rooms/project/${projectId}`)
  }
}

// Message APIs
export const messageApi = {
  // Gửi tin nhắn
  sendMessage: (roomId, messageData) => {
    return apiService.post(`/api/chat/rooms/${roomId}/messages`, messageData)
  },

  // Lấy danh sách tin nhắn (có phân trang)
  getMessages: (roomId, page = 0, size = 50) => {
    return apiService.get(`/api/chat/rooms/${roomId}/messages?page=${page}&size=${size}`)
  },

  // Đánh dấu tin nhắn đã xem
  markMessageAsSeen: (messageId) => {
    return apiService.put(`/api/chat/messages/${messageId}/seen`)
  },

  // Sửa tin nhắn
  editMessage: (messageId, content) => {
    return apiService.put(`/api/chat/messages/${messageId}`, { content })
  },

  // Xóa tin nhắn
  deleteMessage: (messageId) => {
    return apiService.delete(`/api/chat/messages/${messageId}`)
  },

  // Tìm kiếm tin nhắn
  searchMessages: (roomId, keyword, page = 0, size = 20) => {
    return apiService.get(`/api/chat/rooms/${roomId}/search?keyword=${keyword}&page=${page}&size=${size}`)
  },

  // Tìm kiếm tin nhắn theo người gửi
  searchMessagesBySender: (roomId, senderKeyword) => {
    return apiService.get(`/api/chat/rooms/${roomId}/search/sender?senderKeyword=${senderKeyword}`)
  },

  // Tìm kiếm tin nhắn theo khoảng thời gian
  searchMessagesByDateRange: (roomId, startDate, endDate) => {
    return apiService.get(`/api/chat/rooms/${roomId}/search/date?startDate=${startDate}&endDate=${endDate}`)
  },

  // Tìm kiếm tin nhắn theo loại
  searchMessagesByType: (roomId, messageType) => {
    return apiService.get(`/api/chat/rooms/${roomId}/search/type?messageType=${messageType}`)
  }
}
