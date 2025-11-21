import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { chatRoomApi } from '../api/chatRoomApi'
import { messageApi } from '../api/messageApi'
import websocketService from '../services/websocketService'
import MessageBubble from './MessageBubble'
import FileUploadModal from './FileUploadModal'
import RoomSettingsModal from './RoomSettingsModal'
import { colors, typography, spacing } from '@/shared/styles/theme'

export default function ChatRoom({ roomId, wsConnected }) {
  const { user } = useAuth()
  const [roomInfo, setRoomInfo] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showFileModal, setShowFileModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (roomId) {
      loadRoomData()
      subscribeToRoom()
    }

    return () => {
      if (roomId) {
        websocketService.unsubscribeFromRoom(roomId)
      }
    }
  }, [roomId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadRoomData = async () => {
    try {
      setLoading(true)
      const [roomData, messagesData] = await Promise.all([
        chatRoomApi.getById(roomId),
        messageApi.getMessages(roomId)
      ])
      
      setRoomInfo(roomData)
      setMessages(messagesData)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const subscribeToRoom = () => {
    websocketService.subscribeToRoom(roomId, (wsMessage) => {
      if (wsMessage.type === 'CHAT_MESSAGE') {
        setMessages(prev => [...prev, wsMessage.data])
        scrollToBottom()
      }
    })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)
      await messageApi.sendMessage(roomId, newMessage)
      setNewMessage('')
      setSending(false)
    } catch (error) {
      setSending(false)
      alert('Không thể gửi tin nhắn')
    }
  }

  const getRoomTitle = () => {
    if (!roomInfo) return 'Đang tải...'
    
    if (roomInfo.type === 'DIRECT' && roomInfo.members?.length === 2) {
      const otherMember = roomInfo.members.find(m => m.userId !== user?.userId)
      return otherMember?.username || 'Unknown User'
    }
    
    return roomInfo.name || 'Cuộc trò chuyện'
  }

  const getRoomSubtitle = () => {
    if (!roomInfo) return ''
    
    if (roomInfo.type === 'PROJECT') {
      return `Dự án: ${roomInfo.project?.name || 'N/A'}`
    }
    
    if (roomInfo.type === 'GROUP') {
      return `${roomInfo.members?.length || 0} thành viên`
    }
    
    return 'Chat trực tiếp'
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Đang tải tin nhắn...</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.roomTitle}>{getRoomTitle()}</div>
          <div style={styles.roomSubtitle}>{getRoomSubtitle()}</div>
        </div>
        <div style={styles.headerRight}>
          {wsConnected && (
            <span style={styles.onlineIndicator} title="Đang kết nối">🟢</span>
          )}
          <button 
            style={styles.moreBtn}
            onClick={() => setShowSettings(true)}
            title="Cài đặt nhóm"
          >
            ⋮
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div style={styles.messagesArea}>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageBubble
              key={message.messageId || index}
              message={message}
              isOwn={message.senderId === user?.userId}
            />
          ))
        ) : (
          <div style={styles.emptyMessages}>
            <div style={styles.emptyIcon}>💬</div>
            <div style={styles.emptyText}>Chưa có tin nhắn nào</div>
            <div style={styles.emptySubtext}>Hãy bắt đầu cuộc trò chuyện!</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={styles.inputArea}>
        <button 
          style={styles.attachBtn} 
          title="Đính kèm file"
          onClick={() => setShowFileModal(true)}
        >
          📎
        </button>
        <form onSubmit={handleSendMessage} style={styles.inputForm}>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={styles.input}
            disabled={sending}
          />
          <button
            type="submit"
            style={{
              ...styles.sendBtn,
              ...(sending || !newMessage.trim() ? styles.sendBtnDisabled : {})
            }}
            disabled={sending || !newMessage.trim()}
          >
            ✈️
          </button>
        </form>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={showFileModal}
        onClose={() => setShowFileModal(false)}
        roomId={roomId}
        onSuccess={() => {
          setShowFileModal(false)
          loadRoomData() // Reload to show new file message
        }}
      />

      {/* Room Settings Modal */}
      <RoomSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        roomId={roomId}
        roomInfo={roomInfo}
      />
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: colors.white
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  loadingText: {
    fontSize: typography.base,
    color: colors.textSecondary
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
    flexShrink: 0
  },
  headerLeft: {
    flex: 1
  },
  roomTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs
  },
  roomSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md
  },
  onlineIndicator: {
    fontSize: '12px'
  },
  moreBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: 'transparent',
    color: colors.textSecondary,
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  messagesArea: {
    flex: 1,
    overflow: 'auto',
    padding: spacing.xl,
    backgroundColor: colors.background
  },
  emptyMessages: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: spacing['6xl']
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: spacing.lg
  },
  emptyText: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm
  },
  emptySubtext: {
    fontSize: typography.sm,
    color: colors.textSecondary
  },
  inputArea: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderTop: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
    flexShrink: 0
  },
  attachBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    background: colors.background,
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputForm: {
    flex: 1,
    display: 'flex',
    gap: spacing.md
  },
  input: {
    flex: 1,
    padding: spacing.md,
    border: `1px solid ${colors.border}`,
    borderRadius: spacing.xl,
    fontSize: typography.base,
    outline: 'none'
  },
  sendBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    background: colors.primary,
    color: colors.white,
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  sendBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
}
