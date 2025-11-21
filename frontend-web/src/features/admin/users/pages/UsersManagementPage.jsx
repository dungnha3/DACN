import { useState, useEffect } from 'react'
import { PageLayout, DataTable, Loading, ErrorMessage, StatusBadge, FormModal, FormField } from '@/shared/components'
import { usersService } from '@/shared/services'
import { usePermissions, useErrorHandler } from '@/shared/hooks'
import { validateEmail, validateRequired } from '@/shared/utils/validation'

export default function UsersManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'EMPLOYEE'
  })
  const [formErrors, setFormErrors] = useState({})
  
  const { isAdmin } = usePermissions()
  const { handleError } = useErrorHandler()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await usersService.getAll()
      setUsers(data || [])
      setError(null)
    } catch (err) {
      const errorMessage = handleError(err, { context: 'load_users' })
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    // Validate
    const errors = {}
    const usernameError = validateRequired(formData.username, 'Username')
    if (usernameError) errors.username = usernameError
    
    const emailError = validateEmail(formData.email)
    if (emailError) errors.email = emailError
    
    const passwordError = validateRequired(formData.password, 'Password')
    if (passwordError) errors.password = passwordError
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      await usersService.create(formData)
      setShowModal(false)
      setFormData({ username: '', email: '', password: '', role: 'EMPLOYEE' })
      setFormErrors({})
      loadUsers()
      alert('✅ Tạo user thành công!')
    } catch (err) {
      const errorMessage = handleError(err, { context: 'create_user' })
      alert(errorMessage)
    }
  }

  const handleToggleActive = async (userId, isActive) => {
    try {
      if (isActive) {
        await usersService.deactivate(userId)
      } else {
        await usersService.activate(userId)
      }
      loadUsers()
      alert(`✅ ${isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} user thành công!`)
    } catch (err) {
      const errorMessage = handleError(err, { context: 'toggle_active' })
      alert(errorMessage)
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Bạn có chắc muốn xóa user này?')) return

    try {
      await usersService.delete(userId)
      loadUsers()
      alert('✅ Xóa user thành công!')
    } catch (err) {
      const errorMessage = handleError(err, { context: 'delete_user' })
      alert(errorMessage)
    }
  }

  const columns = [
    {
      header: 'ID',
      key: 'userId',
      width: '60px'
    },
    {
      header: 'Username',
      key: 'username',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: '600' }}>{val}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{row.email}</div>
        </div>
      )
    },
    {
      header: 'Role',
      key: 'role',
      width: '150px',
      render: (val) => {
        const roleLabels = {
          'ADMIN': 'Admin',
          'MANAGER_HR': 'HR Manager',
          'MANAGER_ACCOUNTING': 'Accounting',
          'MANAGER_PROJECT': 'PM',
          'EMPLOYEE': 'Employee'
        }
        return <span style={{ fontSize: '13px', fontWeight: '500' }}>{roleLabels[val] || val}</span>
      }
    },
    {
      header: 'Trạng thái',
      key: 'isActive',
      width: '120px',
      render: (val) => <StatusBadge status={val ? 'active' : 'inactive'} />
    },
    {
      header: 'Hành động',
      key: 'actions',
      width: '180px',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleToggleActive(row.userId, row.isActive)}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              backgroundColor: row.isActive ? '#f59e0b' : '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {row.isActive ? 'Vô hiệu' : 'Kích hoạt'}
          </button>
          <button
            onClick={() => handleDelete(row.userId)}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Xóa
          </button>
        </div>
      )
    }
  ]

  // Permission check
  if (!isAdmin) {
    return <ErrorMessage error="Bạn không có quyền truy cập trang này" />
  }
  
  if (loading) return <Loading />
  if (error) return <ErrorMessage error={error} onRetry={loadUsers} />

  return (
    <>
      <PageLayout
        title="Quản lý Users"
        subtitle="Quản lý tài khoản người dùng - Chỉ Admin có quyền"
        actions={
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            ➕ Tạo user mới
          </button>
        }
      >
        <DataTable
          columns={columns}
          data={users}
          emptyMessage="Chưa có user nào"
        />
      </PageLayout>

      {showModal && (
        <FormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Tạo User Mới"
          onSubmit={handleCreate}
          submitText="Tạo"
        >
          <FormField
            label="Username"
            value={formData.username}
            onChange={(val) => setFormData({...formData, username: val})}
            required
          />
          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(val) => setFormData({...formData, email: val})}
            required
          />
          <FormField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(val) => setFormData({...formData, password: val})}
            required
          />
          <FormField
            label="Role"
            type="select"
            value={formData.role}
            onChange={(val) => setFormData({...formData, role: val})}
            options={[
              { label: 'Admin', value: 'ADMIN' },
              { label: 'HR Manager', value: 'MANAGER_HR' },
              { label: 'Accounting Manager', value: 'MANAGER_ACCOUNTING' },
              { label: 'Project Manager', value: 'MANAGER_PROJECT' },
              { label: 'Employee', value: 'EMPLOYEE' }
            ]}
          />
        </FormModal>
      )}
    </>
  )
}
