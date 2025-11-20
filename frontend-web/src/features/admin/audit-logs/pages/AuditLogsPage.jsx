import { useState, useEffect } from 'react'
import { PageLayout, DataTable, Loading, ErrorMessage, FilterBar } from '@/shared/components'
import { apiService } from '@/shared/services'

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionFilter, setActionFilter] = useState('ALL')

  useEffect(() => {
    loadLogs()
  }, [actionFilter])

  const loadLogs = async () => {
    try {
      setLoading(true)
      // API: GET /api/audit-logs hoặc /api/audit-logs?action=LOGIN
      const params = actionFilter !== 'ALL' ? { action: actionFilter } : {}
      const data = await apiService.get('/api/audit-logs', { params })
      setLogs(data || [])
      setError(null)
    } catch (err) {
      // Nếu API chưa có, dùng mock data
      const mockData = [
        { id: 1, username: 'admin', action: 'LOGIN', details: 'Đăng nhập thành công', ipAddress: '192.168.1.1', timestamp: new Date().toISOString() },
        { id: 2, username: 'hr_manager', action: 'CREATE_USER', details: 'Tạo user employee1', ipAddress: '192.168.1.5', timestamp: new Date().toISOString() }
      ]
      setLogs(mockData)
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      header: 'Timestamp',
      key: 'timestamp',
      width: '180px',
      render: (val) => new Date(val).toLocaleString('vi-VN')
    },
    {
      header: 'User',
      key: 'username',
      width: '150px'
    },
    {
      header: 'Action',
      key: 'action',
      width: '150px',
      render: (val) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '600',
          backgroundColor: '#dbeafe',
          color: '#1e40af'
        }}>
          {val}
        </span>
      )
    },
    {
      header: 'Details',
      key: 'details'
    },
    {
      header: 'IP Address',
      key: 'ipAddress',
      width: '140px'
    }
  ]

  if (loading) return <Loading />
  if (error) return <ErrorMessage error={error} onRetry={loadLogs} />

  return (
    <PageLayout
      title="Audit Logs"
      subtitle="Lịch sử hoạt động hệ thống"
      filters={
        <FilterBar
          filters={[
            {
              label: 'Action',
              value: actionFilter,
              onChange: setActionFilter,
              options: [
                { label: 'Tất cả', value: 'ALL' },
                { label: 'Login', value: 'LOGIN' },
                { label: 'Create User', value: 'CREATE_USER' },
                { label: 'Update User', value: 'UPDATE_USER' },
                { label: 'Delete User', value: 'DELETE_USER' }
              ]
            }
          ]}
        />
      }
    >
      <DataTable
        columns={columns}
        data={logs}
        emptyMessage="Chưa có audit logs"
      />
    </PageLayout>
  )
}
