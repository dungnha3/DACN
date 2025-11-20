import { useState, useEffect } from 'react'
import { PageLayout, DataTable, Loading, ErrorMessage, StatusBadge } from '@/shared/components'
import { issueService } from '@/shared/services/issue.service'
import { projectService } from '@/shared/services/project.service'

export default function IssuesPage() {
  const [issues, setIssues] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      loadIssues(selectedProject)
    }
  }, [selectedProject])

  const loadProjects = async () => {
    try {
      const data = await projectService.getMyProjects()
      setProjects(data || [])
      if (data && data.length > 0) {
        setSelectedProject(data[0].duanId)
      }
    } catch (err) {
      console.error('Error loading projects:', err)
    }
  }

  const loadIssues = async (projectId) => {
    try {
      setLoading(true)
      const data = await issueService.getByProject(projectId)
      setIssues(data || [])
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await issueService.updateStatus(issueId, newStatus)
      loadIssues(selectedProject)
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const columns = [
    {
      header: 'ID',
      key: 'issueId',
      width: '80px'
    },
    {
      header: 'Tiêu đề',
      key: 'tieuDe',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: '600', color: '#111827' }}>{val}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{row.moTa?.substring(0, 60)}...</div>
        </div>
      )
    },
    {
      header: 'Loại',
      key: 'loai',
      width: '100px',
      render: (val) => {
        const typeMap = {
          'TASK': { label: 'Task', color: '#3b82f6' },
          'BUG': { label: 'Bug', color: '#ef4444' },
          'FEATURE': { label: 'Feature', color: '#10b981' }
        }
        const config = typeMap[val] || { label: val, color: '#6b7280' }
        return (
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: config.color + '20',
            color: config.color
          }}>
            {config.label}
          </span>
        )
      }
    },
    {
      header: 'Độ ưu tiên',
      key: 'doUuTien',
      width: '100px',
      render: (val) => {
        const priorityMap = {
          'CAO': { label: 'Cao', color: '#ef4444' },
          'TRUNG_BINH': { label: 'TB', color: '#f59e0b' },
          'THAP': { label: 'Thấp', color: '#10b981' }
        }
        const config = priorityMap[val] || { label: val, color: '#6b7280' }
        return (
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: config.color + '20',
            color: config.color
          }}>
            {config.label}
          </span>
        )
      }
    },
    {
      header: 'Trạng thái',
      key: 'trangThai',
      width: '140px',
      render: (val, row) => (
        <select
          value={val}
          onChange={(e) => handleStatusChange(row.issueId, e.target.value)}
          style={{
            padding: '4px 8px',
            fontSize: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      )
    },
    {
      header: 'Assignee',
      key: 'assigneeName',
      width: '150px',
      render: (val) => val || 'Chưa assign'
    }
  ]

  if (loading && !selectedProject) return <Loading />
  if (error) return <ErrorMessage error={error} onRetry={() => loadIssues(selectedProject)} />

  return (
    <PageLayout
      title="Quản lý Tasks"
      subtitle="Quản lý các tasks/issues trong dự án"
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
          ➕ Tạo task mới
        </button>
      }
      filters={
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Dự án:
          </label>
          <select
            value={selectedProject || ''}
            onChange={(e) => setSelectedProject(Number(e.target.value))}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '200px'
            }}
          >
            {projects.map(p => (
              <option key={p.duanId} value={p.duanId}>
                {p.ten}
              </option>
            ))}
          </select>
        </div>
      }
    >
      {loading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={issues}
          emptyMessage="Chưa có task nào trong dự án này"
        />
      )}
    </PageLayout>
  )
}
