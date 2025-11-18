import { useState, useEffect, useRef } from 'react'
import { styles } from './ChatPage.styles'
import { chatRoomApi, messageApi } from './api/chatApi'
import websocketService from './services/websocketService'

export default function ChatPage() {
  const [chatRooms, setChatRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [wsConnected, setWsConnected] = useState(false)
  const messagesEndRef = useRef(null)

  // Load chat rooms when component mounts
  useEffect(() => {
    loadChatRooms()
    connectWebSocket()

    return () => {
      // Cleanup on unmount
      websocketService.disconnect()
    }
  }, [])

  // Load messages when room changes
  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.roomId)
      subscribeToRoom(selectedRoom.roomId)
    }

    return () => {
      if (selectedRoom) {
        websocketService.unsubscribeFromRoom(selectedRoom.roomId)
      }
    }
  }, [selectedRoom])

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Connect to WebSocket
  const connectWebSocket = () => {
    websocketService.connect(
      () => {
        console.log('WebSocket connected')
        setWsConnected(true)
      },
      (error) => {
        console.error('WebSocket connection error:', error)
        setWsConnected(false)
      }
    )
  }

  // Subscribe to room for real-time messages
  const subscribeToRoom = (roomId) => {
    websocketService.subscribeToRoom(roomId, (wsMessage) => {
      console.log('Received WebSocket message:', wsMessage)
      
      // Handle different message types
      if (wsMessage.type === 'CHAT_MESSAGE') {
        // Add new message to list
        const newMessage = {
          messageId: wsMessage.messageId,
          content: wsMessage.content,
          sender: {
            userId: wsMessage.userId,
            username: wsMessage.username
          },
          sentAt: wsMessage.timestamp,
          messageType: 'TEXT'
        }
        setMessages(prev => [...prev, newMessage])
      } else if (wsMessage.type === 'MESSAGE_DELETED') {
        // Remove deleted message
        setMessages(prev => prev.filter(m => m.messageId !== wsMessage.messageId))
      } else if (wsMessage.type === 'MESSAGE_EDITED') {
        // Update edited message
        setMessages(prev => prev.map(m => 
          m.messageId === wsMessage.messageId 
            ? { ...m, content: wsMessage.content, isEdited: true }
            : m
        ))
      }
    })
  }

  // Load chat rooms
  const loadChatRooms = async () => {
    setLoading(true)
    try {
      const rooms = await chatRoomApi.getMyChatRooms()
      setChatRooms(rooms)
      
      // Auto select first room
      if (rooms.length > 0 && !selectedRoom) {
        setSelectedRoom(rooms[0])
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load messages for a room
  const loadMessages = async (roomId) => {
    try {
      const response = await messageApi.getMessages(roomId, 0, 50)
      // API returns Page object with content array
      const messageList = response.content || []
      setMessages(messageList)
    } catch (error) {
      console.error('Error loading messages:', error)
      setMessages([])
    }
  }

  // Send message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedRoom) return

    try {
      const messageData = {
        content: messageInput.trim(),
        messageType: 'TEXT'
      }

      // Send via REST API
      const sentMessage = await messageApi.sendMessage(selectedRoom.roomId, messageData)
      
      // Message will be received via WebSocket, but add it optimistically
      // setMessages(prev => [...prev, sentMessage])
      
      setMessageInput('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Không thể gửi tin nhắn. Vui lòng thử lại.')
    }
  }

  // Handle room selection
  const handleSelectRoom = (room) => {
    setSelectedRoom(room)
    setMessages([])
  }

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  // Get current user from messages to determine isOwn
  const getCurrentUserId = () => {
    // Get from localStorage or context
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        return user.userId
      } catch (e) {
        return null
      }
    }
    return null
  }

  const currentUserId = getCurrentUserId()

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Trò chuyện</h1>
        <p style={styles.subtitle}>Nhắn tin với đồng nghiệp và nhóm dự án</p>
      </div>

      <div style={styles.pageContent}>
        <div style={styles.chatContainer}>
          {/* Left Column - Chat List */}
          <div style={styles.chatSidebar}>
            <div style={styles.chatSidebarHeader}>
              <div style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center'
              }}>
                <svg 
                  style={{
                    position: 'absolute',
                    left: '14px',
                    width: '18px',
                    height: '18px',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#7b809a" 
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm cuộc trò chuyện..." 
                  style={styles.chatSearchInput}
                />
              </div>
            </div>
            
            <div style={styles.chatContactList}>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                  Đang tải...
                </div>
              ) : chatRooms.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                  Chưa có cuộc trò chuyện nào
                </div>
              ) : (
                chatRooms.map((room) => (
                  <div 
                    key={room.roomId}
                    style={{
                      ...styles.chatContactItem,
                      ...(selectedRoom?.roomId === room.roomId ? styles.chatContactItemActive : {})
                    }}
                    onClick={() => handleSelectRoom(room)}
                  >
                    <div style={styles.chatContactAvatar}>
                      <span style={styles.chatContactAvatarIcon}>
                        {room.roomType === 'PROJECT' ? '💼' : room.name?.charAt(0) || '👥'}
                      </span>
                    </div>
                    <div style={styles.chatContactInfo}>
                      <div style={styles.chatContactHeader}>
                        <div style={styles.chatContactName}>{room.name}</div>
                        {room.lastMessageAt && (
                          <div style={styles.chatContactTime}>
                            {formatTime(room.lastMessageAt)}
                          </div>
                        )}
                      </div>
                      <div style={styles.chatContactMessage}>
                        {room.roomType === 'PROJECT' && `📁 ${room.projectName}`}
                        {room.memberCount && ` • ${room.memberCount} thành viên`}
                      </div>
                    </div>
                    {room.unreadCount > 0 && (
                      <div style={styles.chatUnreadBadge}>{room.unreadCount}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Chat Window */}
          <div style={styles.chatWindow}>
            {/* Chat Header */}
            <div style={styles.chatWindowHeader}>
              <div style={styles.chatWindowHeaderLeft}>
                <div style={styles.chatWindowAvatar}>
                  {selectedRoom?.roomType === 'PROJECT' ? '💼' : selectedRoom?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <div style={styles.chatWindowName}>
                    {selectedRoom?.name || 'Chọn cuộc trò chuyện'}
                  </div>
                  <div style={styles.chatWindowStatus}>
                    {wsConnected ? '🟢 Đã kết nối' : '⚫ Mất kết nối'}
                    {selectedRoom?.memberCount && ` • ${selectedRoom.memberCount} thành viên`}
                  </div>
                </div>
              </div>
              <div style={styles.chatWindowActions}>
                <button style={styles.chatActionButton} title="Tìm kiếm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
                <button style={styles.chatActionButton} title="Gọi điện">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div style={styles.chatMessagesArea}>
              {!selectedRoom ? (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  color: '#64748b',
                  fontSize: '16px'
                }}>
                  Chọn một cuộc trò chuyện để bắt đầu
                </div>
              ) : messages.length === 0 ? (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  color: '#64748b',
                  fontSize: '16px'
                }}>
                  Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                </div>
              ) : (
                <>
                  <div style={styles.chatDateDivider}>
                    <span style={styles.chatDateText}>Hôm nay</span>
                  </div>
                  {messages.map((message) => {
                    const isOwn = message.sender?.userId === currentUserId
                    return (
                      <div 
                        key={message.messageId}
                        style={{
                          ...styles.chatMessageRow,
                          ...(isOwn ? styles.chatMessageRowOwn : {})
                        }}
                      >
                        {!isOwn && (
                          <div style={styles.chatMessageAvatar}>
                            {message.sender?.username?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                        <div style={styles.chatMessageGroup}>
                          {!isOwn && (
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                              {message.sender?.username}
                            </div>
                          )}
                          <div style={{
                            ...styles.chatMessageBubble,
                            ...(isOwn ? styles.chatMessageBubbleOwn : {})
                          }}>
                            {message.content}
                            {message.isEdited && (
                              <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '8px' }}>
                                (đã chỉnh sửa)
                              </span>
                            )}
                          </div>
                          <div style={{
                            ...styles.chatMessageTime,
                            ...(isOwn ? styles.chatMessageTimeOwn : {})
                          }}>
                            {formatTime(message.sentAt)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div style={styles.chatInputArea}>
              <div style={styles.chatInputToolbar}>
                <button style={styles.chatToolButton} title="Đính kèm file">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                </button>
                <button style={styles.chatToolButton} title="Hình ảnh">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </button>
                <button style={styles.chatToolButton} title="Emoji">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                </button>
              </div>
              <div style={styles.chatInputWrapper}>
                <input 
                  type="text"
                  placeholder={selectedRoom ? `Nhắn tin tới ${selectedRoom.name}...` : 'Chọn cuộc trò chuyện...'}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  style={styles.chatMessageInput}
                  disabled={!selectedRoom || !wsConnected}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <button 
                  style={{
                    ...styles.chatSendButton,
                    opacity: !selectedRoom || !wsConnected ? 0.5 : 1,
                    cursor: !selectedRoom || !wsConnected ? 'not-allowed' : 'pointer'
                  }}
                  onClick={handleSendMessage}
                  disabled={!selectedRoom || !wsConnected}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
