import { useState, useEffect } from 'react'
import { PageLayout, Loading, ErrorMessage, FormField } from '@/shared/components'
import { profileService } from '@/shared/services'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = await profileService.getProfile()
      setProfile(data)
      setFormData(data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải thông tin')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      await profileService.updateProfile(formData)
      setEditing(false)
      loadProfile()
      alert('Cập nhật thành công!')
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!')
      return
    }

    try {
      await profileService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      })
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      alert('Đổi mật khẩu thành công!')
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorMessage error={error} onRetry={loadProfile} />

  return (
    <PageLayout title="Hồ sơ cá nhân" subtitle="Quản lý thông tin cá nhân của bạn">
      <div style={{ padding: '24px' }}>
        {/* Profile Info */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Thông tin cơ bản</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} style={styles.editBtn}>
                ✏️ Chỉnh sửa
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setEditing(false)} style={styles.cancelBtn}>Hủy</button>
                <button onClick={handleUpdateProfile} style={styles.saveBtn}>Lưu</button>
              </div>
            )}
          </div>

          {editing ? (
            <>
              <FormField
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={(val) => setFormData({...formData, email: val})}
              />
              <FormField
                label="Số điện thoại"
                value={formData.phone || ''}
                onChange={(val) => setFormData({...formData, phone: val})}
              />
              <FormField
                label="Họ tên"
                value={formData.fullName || ''}
                onChange={(val) => setFormData({...formData, fullName: val})}
              />
            </>
          ) : (
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.label}>Username:</span>
                <span style={styles.value}>{profile?.username}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.label}>Email:</span>
                <span style={styles.value}>{profile?.email || '-'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.label}>Số điện thoại:</span>
                <span style={styles.value}>{profile?.phone || '-'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.label}>Họ tên:</span>
                <span style={styles.value}>{profile?.fullName || '-'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Đổi mật khẩu</h3>
          <FormField
            label="Mật khẩu cũ"
            type="password"
            value={passwordData.oldPassword}
            onChange={(val) => setPasswordData({...passwordData, oldPassword: val})}
          />
          <FormField
            label="Mật khẩu mới"
            type="password"
            value={passwordData.newPassword}
            onChange={(val) => setPasswordData({...passwordData, newPassword: val})}
          />
          <FormField
            label="Xác nhận mật khẩu"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(val) => setPasswordData({...passwordData, confirmPassword: val})}
          />
          <button onClick={handleChangePassword} style={styles.saveBtn}>
            🔒 Đổi mật khẩu
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

const styles = {
  section: {
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '20px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  infoGrid: {
    display: 'grid',
    gap: '16px',
  },
  infoItem: {
    display: 'flex',
    padding: '12px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    width: '150px',
  },
  value: {
    fontSize: '14px',
    color: '#111827',
  },
  editBtn: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: '#6b7280',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  saveBtn: {
    padding: '8px 16px',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  }
}
