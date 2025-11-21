import { useState } from 'react'
import { chatRoomApi } from '../api/chatRoomApi'
import { userApi } from '../../projects/api/userApi'
import { colors, typography, spacing } from '@/shared/styles/theme'

export default function AddMemberModal({ isOpen, onClose, roomId, currentMembers = [], onSuccess }) {
  const [searchEmail, setSearchEmail] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSearch = async () => {
    if (!searchEmail.trim()) return

    try {
      const users = await userApi.searchUsers(searchEmail)
      // Filter out current members
      const filtered = users.filter(
        user => !currentMembers.find(m => m.userId === user.userId)
      )
      setSearchResults(filtered)
    } catch (err) {
      setError('Không thể tìm kiếm người dùng')
    }
  }

  const handleAddMember = async (user) => {
    try {
      setLoading(true)
      setError('')

      await chatRoomApi.addMember(roomId, user.userId)

      alert(`✅ Đã thêm ${user.username} vào nhóm`)

      if (onSuccess) {
        onSuccess()
      }

      handleClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể thêm thành viên')
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSearchEmail('')
    setSearchResults([])
    setError('')
    setLoading(false)
    onClose()
  }

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>Thêm thành viên</h3>
          <button style={styles.closeBtn} onClick={handleClose}>×</button>
        </div>

        <div style={styles.content}>
          {error && (
            <div style={styles.errorBox}>⚠️ {error}</div>
          )}

          <div style={styles.searchBox}>
            <input
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Nhập email hoặc username..."
              style={styles.input}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} style={styles.searchBtn}>
              🔍
            </button>
          </div>

          {searchResults.length > 0 && (
            <div style={styles.resultsList}>
              {searchResults.map(user => (
                <div key={user.userId} style={styles.userItem}>
                  <div style={styles.userAvatar}>
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div style={styles.userInfo}>
                    <div style={styles.userName}>{user.username}</div>
                    <div style={styles.userEmail}>{user.email}</div>
                  </div>
                  <button
                    onClick={() => handleAddMember(user)}
                    style={styles.addBtn}
                    disabled={loading}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && searchEmail && (
            <div style={styles.noResults}>
              Không tìm thấy người dùng
            </div>
          )}
        </div>
      </div>
    </div>
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
    maxHeight: '80vh',
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
    padding: spacing.xl,
    overflow: 'auto'
  },
  errorBox: {
    padding: spacing.md,
    backgroundColor: '#fef2f2',
    border: `1px solid ${colors.error}`,
    borderRadius: spacing.md,
    color: colors.error,
    marginBottom: spacing.lg,
    fontSize: typography.sm
  },
  searchBox: {
    display: 'flex',
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  input: {
    flex: 1,
    padding: spacing.md,
    border: `1px solid ${colors.border}`,
    borderRadius: spacing.md,
    fontSize: typography.base,
    outline: 'none'
  },
  searchBtn: {
    padding: `${spacing.md} ${spacing.lg}`,
    border: 'none',
    borderRadius: spacing.md,
    background: colors.primary,
    color: colors.white,
    fontSize: typography.lg,
    cursor: 'pointer'
  },
  resultsList: {
    border: `1px solid ${colors.border}`,
    borderRadius: spacing.md,
    overflow: 'hidden'
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    padding: spacing.md,
    borderBottom: `1px solid ${colors.borderLight}`,
    transition: 'background-color 0.2s'
  },
  userAvatar: {
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
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary
  },
  userEmail: {
    fontSize: typography.sm,
    color: colors.textSecondary
  },
  addBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: colors.success,
    color: colors.white,
    fontSize: '20px',
    cursor: 'pointer'
  },
  noResults: {
    textAlign: 'center',
    padding: spacing['6xl'],
    color: colors.textSecondary,
    fontSize: typography.base
  }
}
