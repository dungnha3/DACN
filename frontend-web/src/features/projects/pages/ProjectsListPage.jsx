import { useState, useEffect } from 'react'
import { PageLayout, DataTable, Loading, ErrorMessage, StatusBadge } from '@/shared/components'
import { projectService } from '@/shared/services/project.service'

export default function ProjectsListPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await projectService.getMyProjects()
      setProjects(data || [])
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách dự án')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (projectId) => {
    if (!confirm('Bạn có chắc muốn xóa dự án này?')) return
    
    try {
      await projectService.delete(projectId)
      loadProjects()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const columns = [
    {
      header: 'Tên dự án',
      key: 'ten',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: '600', color: '#111827' }}>{val}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{row.moTa}</div>
        </div>
      )
    },
    {
      header: 'Mã dự án',
      key: 'maDuAn',
      width: '120px'
    },
    {
      header: 'Trạng thái',
      key: 'trangThai',
      width: '140px',
      render: (val) => {
        const statusMap = {
          'DANG_THUC_HIEN': 'active',
          'HOAN_THANH': 'success',
          'TAM_DUNG': 'warning',
          'HUY': 'error'
        }
        return <StatusBadge status={statusMap[val] || 'info'} />
      }
    },
    {
      header: 'Ngày bắt đầu',
      key: 'ngayBatDau',
      width: '120px',
      render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '-'
    },
    {
      header: 'Hành động',
      key: 'actions',
      width: '100px',
      render: (_, row) => (
        <button
          onClick={() => handleDelete(row.duanId)}
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
      )
    }
  ]

  if (loading) return <Loading />
  if (error) return <ErrorMessage error={error} onRetry={loadProjects} />

  return (
    <PageLayout
      title="Danh sách Dự án"
      subtitle="Quản lý các dự án bạn tham gia"
      actions={
        <button
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
          ➕ Tạo dự án mới
        </button>
      }
    >
      <DataTable
        columns={columns}
        data={projects}
        emptyMessage="Bạn chưa tham gia dự án nào"
      />
    </PageLayout>
  )
}
