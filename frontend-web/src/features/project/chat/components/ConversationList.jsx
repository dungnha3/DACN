import { useState } from 'react'
import CreateGroupModal from './CreateGroupModal'
import { colors, typography, spacing } from '@/shared/styles/theme'

export default function ConversationList({ rooms = [], selectedRoomId, onSelectRoom, onRoomCreated }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredRooms = rooms.filter(room =>
    room.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoomName = (room) => {
    if (room.type === 'DIRECT' && room.members?.length === 2) {
      // For direct chat, show other user's name
      const otherMember = room.members.find(m => m.userId !== room.currentUserId)
      return otherMember?.username || 'Unknown User'
    }
    return room.name || 'Cuộc trò chuyện'
  }

  const getRoomAvatar = (room) => {
    if (room.type === 'PROJECT') return '🏭'
    if (room.type === 'GROUP') return '👥'
    return '👤'
  }

  const getLastMessageTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    // Less than 1 minute
    if (diff < 60000) return 'Vừa xong'
    // Less than 1 hour
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút`
    // Less than 24 hours
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ`
    // Show date
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Trò chuyện</h2>
        <button
          style={styles.newChatBtn}
          title="Tạo nhóm chat mới"
          onClick={() => setShowCreateModal(true)}
        >
          ✏️
        </button>
      </div>

      {/* Search */}
      <div style={styles.searchContainer}>
        <div style={styles.searchIcon}>🔍</div>
        <input
          type="text"
          placeholder="Tìm kiếm cuộc trò chuyện..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Room List */}
      <div style={styles.roomList}>
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div
              key={room.roomId}
              onClick={() => onSelectRoom(room.roomId)}
              style={{
                ...styles.roomItem,
                ...(selectedRoomId === room.roomId ? styles.roomItemActive : {})
              }}
            >
              <div style={styles.roomAvatar}>
                {getRoomAvatar(room)}
              </div>
              <div style={styles.roomInfo}>
                <div style={styles.roomHeader}>
                  <div style={styles.roomName}>{getRoomName(room)}</div>
                  <div style={styles.roomTime}>
                    {getLastMessageTime(room.lastMessageTime)}
                  </div>
                </div>
                <div style={styles.roomMessage}>
                  {room.lastMessage || 'Chưa có tin nhắn'}
                </div>
              </div>
              {room.unreadCount > 0 && (
                <div style={styles.unreadBadge}>
                  {room.unreadCount}
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={styles.emptyList}>
            <div style={styles.emptyIcon}>💬</div>
            <div style={styles.emptyText}>
              {searchTerm ? 'Không tìm thấy cuộc trò chuyện' : 'Chưa có cuộc trò chuyện nào'}
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(newRoom) => {
          setShowCreateModal(false)
          if (onRoomCreated) {
            onRoomCreated(newRoom)
          }
        }}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.borderLight}`
  },
  title: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    margin: 0
  },
  newChatBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    background: colors.primary,
    color: colors.white,
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  searchContainer: {
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.borderLight}`,
    position: 'relative'
  },
  searchIcon: {
    position: 'absolute',
    left: spacing.xl,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '16px',
    pointerEvents: 'none'
  },
  searchInput: {
    width: '100%',
    padding: `${spacing.sm} ${spacing.lg} ${spacing.sm} ${spacing['3xl']}`,
    border: `1px solid ${colors.border}`,
    borderRadius: spacing.lg,
    fontSize: typography.sm,
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  roomList: {
    flex: 1,
    overflow: 'auto'
  },
  roomItem: {
    display: 'flex',
    alignItems: 'center',
    padding: spacing.lg,
    cursor: 'pointer',
    borderBottom: `1px solid ${colors.borderLight}`,
    transition: 'background-color 0.2s'
  },
  roomItemActive: {
    backgroundColor: colors.background
  },
  roomAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: colors.primary + '20',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    flexShrink: 0,
    marginRight: spacing.md
  },
  roomInfo: {
    flex: 1,
    minWidth: 0
  },
  roomHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs
  },
  roomName: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  roomTime: {
    fontSize: typography.xs,
    color: colors.textMuted,
    flexShrink: 0,
    marginLeft: spacing.sm
  },
  roomMessage: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  unreadBadge: {
    minWidth: '20px',
    height: '20px',
    borderRadius: '10px',
    backgroundColor: colors.error,
    color: colors.white,
    fontSize: typography.xs,
    fontWeight: typography.bold,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `0 ${spacing.xs}`,
    marginLeft: spacing.sm
  },
  emptyList: {
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
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center'
  }
}
