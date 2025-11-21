import { useState } from 'react'
import { chatRoomApi } from '../api/chatRoomApi'
import { userApi } from '../../projects/api/userApi'
import { colors, typography, spacing } from '@/shared/styles/theme'

export default function CreateGroupModal({ isOpen, onClose, onSuccess }) {
  const [groupName, setGroupName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSearchUser = async () => {
    if (!searchEmail.trim()) return

    try {
      const users = await userApi.searchUsers(searchEmail)
      setSearchResults(users)
    } catch (err) {
      setError('Không thể tìm kiếm người dùng')
    }
  }

  const handleAddMember = (user) => {
    if (!selectedMembers.find(m => m.userId === user.userId)) {
      setSelectedMembers([...selectedMembers, user])
      setSearchEmail('')
      setSearchResults([])
    }
  }

  const handleRemoveMember = (userId) => {
    setSelectedMembers(selectedMembers.filter(m => m.userId !== userId))
  }

  const handleCreate = async () => {
    if (!groupName.trim()) {
      setError('Vui lòng nhập tên nhóm')
      return
    }

    if (selectedMembers.length === 0) {
      setError('Vui lòng thêm ít nhất 1 thành viên')
      return
    }

    try {
      setLoading(true)
      setError('')

      const newGroup = await chatRoomApi.createGroupChat({
        name: groupName,
        memberIds: selectedMembers.map(m => m.userId)
      })

      alert('✅ Tạo nhóm chat thành công!')
      
      if (onSuccess) {
        onSuccess(newGroup)
      }

      handleClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tạo nhóm chat')
      setLoading(false)
    }
  }

  const handleClose = () => {
    setGroupName('')
    setSearchEmail('')
    setSearchResults([])
    setSelectedMembers([])
    setError('')
    setLoading(false)
    onClose()
  }

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Tạo nhóm chat</h2>
          <button style={styles.closeBtn} onClick={handleClose}>×</button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          {/* Group Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Tên nhóm *</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Nhập tên nhóm chat..."
              style={styles.input}
            />
          </div>

          {/* Search Users */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Thêm thành viên</label>
            <div style={styles.searchBox}>
              <input
                type="text"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Nhập email hoặc username..."
                style={styles.input}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
              />
              <button 
                onClick={handleSearchUser}
                style={styles.searchBtn}
              >
                🔍
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div style={styles.searchResults}>
                {searchResults.map(user => (
                  <div
                    key={user.userId}
                    onClick={() => handleAddMember(user)}
                    style={styles.userItem}
                  >
                    <div style={styles.userAvatar}>
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.userInfo}>
                      <div style={styles.userName}>{user.username}</div>
                      <div style={styles.userEmail}>{user.email}</div>
                    </div>
                    <button style={styles.addBtn}>+</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Members */}
          {selectedMembers.length > 0 && (
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Thành viên đã chọn ({selectedMembers.length})
              </label>
              <div style={styles.membersList}>
                {selectedMembers.map(member => (
                  <div key={member.userId} style={styles.memberChip}>
                    <span>{member.username}</span>
                    <button
                      onClick={() => handleRemoveMember(member.userId)}
                      style={styles.removeBtn}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button
            onClick={handleClose}
            style={styles.cancelBtn}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleCreate}
            style={{
              ...styles.createBtn,
              ...(loading ? styles.btnDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : 'Tạo nhóm'}
          </button>
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
    fontSize: typography.xl,
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
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
  formGroup: {
    marginBottom: spacing.xl
  },
  label: {
    display: 'block',
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm
  },
  input: {
    width: '100%',
    padding: spacing.md,
    border: `1px solid ${colors.border}`,
    borderRadius: spacing.md,
    fontSize: typography.base,
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  searchBox: {
    display: 'flex',
    gap: spacing.sm
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
  searchResults: {
    marginTop: spacing.md,
    border: `1px solid ${colors.border}`,
    borderRadius: spacing.md,
    maxHeight: '200px',
    overflow: 'auto'
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    padding: spacing.md,
    cursor: 'pointer',
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
  membersList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  memberChip: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.xs} ${spacing.md}`,
    backgroundColor: colors.background,
    borderRadius: spacing.lg,
    fontSize: typography.sm
  },
  removeBtn: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: 'none',
    background: colors.error,
    color: colors.white,
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: spacing.md,
    padding: spacing.xl,
    borderTop: `1px solid ${colors.border}`
  },
  cancelBtn: {
    padding: `${spacing.md} ${spacing.xl}`,
    border: `1px solid ${colors.border}`,
    borderRadius: spacing.md,
    background: colors.white,
    color: colors.textPrimary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
    cursor: 'pointer'
  },
  createBtn: {
    padding: `${spacing.md} ${spacing.xl}`,
    border: 'none',
    borderRadius: spacing.md,
    background: colors.primary,
    color: colors.white,
    fontSize: typography.base,
    fontWeight: typography.semibold,
    cursor: 'pointer'
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
}
