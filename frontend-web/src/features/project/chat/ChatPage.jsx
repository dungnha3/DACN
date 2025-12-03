import { useState, useEffect } from 'react'
import { chatRoomApi } from './api/chatRoomApi'
import websocketService from './services/websocketService'
import ConversationList from './components/ConversationList'
import ChatRoom from './components/ChatRoom'
import { colors, spacing } from '@/shared/styles/theme'

export default function ChatPage() {
  const [chatRooms, setChatRooms] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [wsConnected, setWsConnected] = useState(false)

  // Load chat rooms when component mounts
  useEffect(() => {
    loadChatRooms()
    connectWebSocket()

    return () => {
      websocketService.disconnect()
    }
  }, [])

  const loadChatRooms = async () => {
    try {
      setLoading(true)
      const rooms = await chatRoomApi.getMyChatRooms()
      setChatRooms(rooms)

      // Auto select first room if available
      if (rooms.length > 0 && !selectedRoomId) {
        setSelectedRoomId(rooms[0].roomId)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const connectWebSocket = () => {
    websocketService.connect(
      () => {
        setWsConnected(true)
      },
      (error) => {
        setWsConnected(false)
      }
    )
  }

  const handleSelectRoom = (roomId) => {
    setSelectedRoomId(roomId)
  }

  const handleRoomCreated = (newRoom) => {
    // Add new room to list and select it
    setChatRooms([newRoom, ...chatRooms])
    setSelectedRoomId(newRoom.roomId)
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Đang tải cuộc trò chuyện...</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Sidebar - Danh sách cuộc trò chuyện */}
      <div style={styles.sidebar}>
        <ConversationList
          rooms={chatRooms}
          selectedRoomId={selectedRoomId}
          onSelectRoom={handleSelectRoom}
          onRoomCreated={handleRoomCreated}
        />
      </div>

      {/* Main Chat Area */}
      <div style={styles.mainArea}>
        {selectedRoomId ? (
          <ChatRoom
            roomId={selectedRoomId}
            wsConnected={wsConnected}
          />
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💬</div>
            <div style={styles.emptyTitle}>Chọn một cuộc trò chuyện để bắt đầu</div>
            <div style={styles.emptyText}>
              Chọn cuộc trò chuyện từ danh sách bên trái hoặc tạo một cuộc trò chuyện mới
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    height: '100%',
    backgroundColor: colors.white,
    overflow: 'hidden'
  },
  sidebar: {
    width: '320px',
    flexShrink: 0,
    borderRight: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden'
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: colors.background
  },
  loadingText: {
    fontSize: '16px',
    color: colors.textSecondary
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: spacing['6xl']
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: spacing.xl
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md
  },
  emptyText: {
    fontSize: '14px',
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: '400px'
  }
}
