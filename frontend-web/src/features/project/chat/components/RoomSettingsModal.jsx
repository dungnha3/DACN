import { useState, useEffect } from 'react'
import { chatRoomApi } from '../api/chatRoomApi'
import AddMemberModal from './AddMemberModal'
import { colors, typography, spacing } from '@/shared/styles/theme'

export default function RoomSettingsModal({ isOpen, onClose, roomId, roomInfo }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)

  useEffect(() => {
    if (isOpen && roomId) {
      loadMembers()
    }
  }, [isOpen, roomId])

  if (!isOpen) return null

  const loadMembers = async () => {
    try {
      setLoading(true)
      const membersList = await chatRoomApi.getRoomMembers(roomId)
      setMembers(membersList)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (userId, username) => {
    if (!confirm(`Xóa ${username} khỏi nhóm?`)) return

    try {
      await chatRoomApi.removeMember(roomId, userId)
      alert(`✅ Đã xóa ${username}`)
      loadMembers()
    } catch (error) {
      alert('Không thể xóa thành viên')
    }
  }

  const handleLeaveRoom = async () => {
    if (!confirm('Bạn có chắc muốn rời khỏi nhóm này?')) return

    try {
      await chatRoomApi.leaveRoom(roomId)
      alert('✅ Đã rời khỏi nhóm')
      onClose()
      window.location.reload() // Reload to update room list
    } catch (error) {
      alert('Không thể rời nhóm')
    }
  }

  return (
    <>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <h3 style={styles.title}>Thông tin nhóm</h3>
            <button style={styles.closeBtn} onClick={onClose}>×</button>
          </div>

          <div style={styles.content}>
            {/* Room Info */}
            <div style={styles.section}>
              <div style={styles.roomAvatar}>
                {roomInfo?.type === 'PROJECT' && '🏭'}
                {roomInfo?.type === 'GROUP' && '👥'}
                {roomInfo?.type === 'DIRECT' && '👤'}
              </div>
              <h2 style={styles.roomName}>{roomInfo?.name || 'Cuộc trò chuyện'}</h2>
              <div style={styles.roomType}>
                {roomInfo?.type === 'PROJECT' && 'Chat dự án'}
                {roomInfo?.type === 'GROUP' && 'Nhóm chat'}
                {roomInfo?.type === 'DIRECT' && 'Chat trực tiếp'}
              </div>
            </div>

            {/* Members List */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h4 style={styles.sectionTitle}>
                  Thành viên ({members.length})
                </h4>
                {roomInfo?.type === 'GROUP' && (
                  <button
                    onClick={() => setShowAddMember(true)}
                    style={styles.addMemberBtn}
                  >
                    + Thêm
                  </button>
                )}
              </div>

              {loading ? (
                <div style={styles.loading}>Đang tải...</div>
              ) : (
                <div style={styles.membersList}>
                  {members.map(member => (
                    <div key={member.userId} style={styles.memberItem}>
                      <div style={styles.memberAvatar}>
                        {member.username?.charAt(0).toUpperCase()}
                      </div>
                      <div style={styles.memberInfo}>
                        <div style={styles.memberName}>{member.username}</div>
                        <div style={styles.memberRole}>
                          {member.role === 'ADMIN' && '👑 Quản trị viên'}
                          {member.role === 'MEMBER' && 'Thành viên'}
                        </div>
                      </div>
                      {roomInfo?.type === 'GROUP' && member.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleRemoveMember(member.userId, member.username)}
                          style={styles.removeBtn}
                          title="Xóa khỏi nhóm"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            {roomInfo?.type === 'GROUP' && (
              <div style={styles.section}>
                <button
                  onClick={handleLeaveRoom}
                  style={styles.leaveBtn}
                >
                  🚪 Rời khỏi nhóm
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        roomId={roomId}
        currentMembers={members}
        onSuccess={() => {
          setShowAddMember(false)
          loadMembers()
        }}
      />
    </>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: spacing.lg,
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.border}`
  },
  title: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    margin: 0
  },
  closeBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: colors.background,
    fontSize: '24px',
    cursor: 'pointer'
  },
  content: {
    flex: 1,
    overflow: 'auto'
  },
  section: {
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.borderLight}`
  },
  roomAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: colors.primary + '20',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    margin: '0 auto',
    marginBottom: spacing.md
  },
  roomName: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs
  },
  roomType: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  sectionTitle: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    margin: 0
  },
  addMemberBtn: {
    padding: `${spacing.xs} ${spacing.md}`,
    border: `1px solid ${colors.primary}`,
    borderRadius: spacing.md,
    background: colors.white,
    color: colors.primary,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    cursor: 'pointer'
  },
  loading: {
    textAlign: 'center',
    padding: spacing.xl,
    color: colors.textSecondary
  },
  membersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm
  },
  memberItem: {
    display: 'flex',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: spacing.md,
    backgroundColor: colors.background
  },
  memberAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.primary + '30',
    color: colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.base,
    fontWeight: typography.bold,
    marginRight: spacing.md
  },
  memberInfo: {
    flex: 1
  },
  memberName: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary
  },
  memberRole: {
    fontSize: typography.sm,
    color: colors.textSecondary
  },
  removeBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    background: colors.error,
    color: colors.white,
    fontSize: '20px',
    cursor: 'pointer'
  },
  leaveBtn: {
    width: '100%',
    padding: spacing.md,
    border: `1px solid ${colors.error}`,
    borderRadius: spacing.md,
    background: colors.white,
    color: colors.error,
    fontSize: typography.base,
    fontWeight: typography.semibold,
    cursor: 'pointer'
  }
}
