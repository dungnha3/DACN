import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { chatRoomApi } from '../api/chatRoomApi'
import { messageApi } from '../api/messageApi'
import { meetingApi } from '../api/meetingApi'
import websocketService from '../services/websocketService'
import MessageBubble from './MessageBubble'
import FileUploadModal from './FileUploadModal'
import RoomSettingsModal from './RoomSettingsModal'
import CreateMeetingModal from './CreateMeetingModal'
import VideoMeeting from './VideoMeeting'
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
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [activeMeetings, setActiveMeetings] = useState([])
  const [showVideoMeeting, setShowVideoMeeting] = useState(false)
  const [currentMeeting, setCurrentMeeting] = useState(null)
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

      // Transform messages to include senderName and senderId for compatibility
      const transformedMessages = messagesData.map(msg => ({
        ...msg,
        senderName: msg.sender?.username,
        senderId: msg.sender?.userId
      }))

      setRoomInfo(roomData)
      setMessages(transformedMessages)
      setLoading(false)

      // Load active meetings
      loadActiveMeetings()
    } catch (error) {
      setLoading(false)
    }
  }

  const loadActiveMeetings = async () => {
    try {
      const meetings = await meetingApi.getMeetingsByRoom(roomId)
      // Filter only active/in-progress meetings
      const active = meetings.filter(m => m.status === 'IN_PROGRESS' || m.status === 'SCHEDULED')
      setActiveMeetings(active)
    } catch (error) {
      console.log('Could not load meetings:', error)
      setActiveMeetings([])
    }
  }

  const handleJoinMeeting = async (meeting) => {
    try {
      // Call API to join meeting first
      await meetingApi.joinMeeting(meeting.meetingId)
    } catch (err) {
      console.log('Could not join meeting via API:', err)
    }
    setCurrentMeeting(meeting)
    setShowVideoMeeting(true)
  }

  const subscribeToRoom = () => {
    websocketService.subscribeToRoom(roomId, (wsMessage) => {
      if (wsMessage.type === 'CHAT_MESSAGE') {
        // wsMessage.data contains full MessDTO from backend
        const messageData = wsMessage.data

        if (!messageData) {
          console.error('Message data is missing from WebSocket message')
          return
        }

        // Transform message to include senderName and senderId for compatibility
        const message = {
          ...messageData,
          senderName: messageData.sender?.username || wsMessage.username,
          senderId: messageData.sender?.userId || wsMessage.userId
        }

        setMessages(prev => [...prev, message])
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
            style={styles.meetingBtn}
            onClick={() => setShowMeetingModal(true)}
            title="Cuộc họp"
          >
            📹
          </button>
          <button
            style={styles.moreBtn}
            onClick={() => setShowSettings(true)}
            title="Cài đặt nhóm"
          >
            ⋮
          </button>
        </div>
      </div>

      {/* Active Meeting Banner */}
      {activeMeetings.length > 0 && (
        <div style={styles.activeMeetingBanner}>
          <div style={styles.activeMeetingInfo}>
            <span style={styles.activeMeetingIcon}>🔴</span>
            <span style={styles.activeMeetingText}>
              <strong>{activeMeetings[0].title || 'Cuộc họp'}</strong> đang diễn ra
            </span>
            {activeMeetings[0].createdByName && (
              <span style={styles.activeMeetingHost}>
                bởi {activeMeetings[0].createdByName}
              </span>
            )}
          </div>
          <button
            style={styles.joinMeetingBtn}
            onClick={() => handleJoinMeeting(activeMeetings[0])}
          >
            🎥 Tham gia
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div style={styles.messagesArea}>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageBubble
              key={message.messageId || index}
              message={message}
              isOwn={message.sender?.userId === user?.userId || message.senderId === user?.userId}
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

      {/* Meeting Modal */}
      <CreateMeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        roomId={roomId}
        roomInfo={roomInfo}
        onMeetingCreated={(meeting) => {
          console.log('Meeting created:', meeting)
          loadActiveMeetings() // Reload active meetings
        }}
      />

      {/* Video Meeting */}
      {showVideoMeeting && currentMeeting && (
        <VideoMeeting
          meetingId={currentMeeting.meetingId}
          meetingTitle={currentMeeting.title}
          roomInfo={roomInfo}
          onClose={() => {
            setShowVideoMeeting(false)
            setCurrentMeeting(null)
            loadActiveMeetings() // Refresh meetings list
          }}
        />
      )}
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
  meetingBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: colors.white,
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
    transition: 'all 0.2s'
  },
  activeMeetingBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing.md} ${spacing.xl}`,
    backgroundColor: '#fef3c7',
    borderBottom: '1px solid #fcd34d',
    animation: 'pulse 2s infinite'
  },
  activeMeetingInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md
  },
  activeMeetingIcon: {
    fontSize: '12px',
    animation: 'blink 1s infinite'
  },
  activeMeetingText: {
    fontSize: typography.sm,
    color: '#92400e'
  },
  activeMeetingHost: {
    fontSize: typography.xs,
    color: '#b45309'
  },
  joinMeetingBtn: {
    padding: `${spacing.sm} ${spacing.lg}`,
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: typography.sm,
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
    transition: 'all 0.2s'
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
