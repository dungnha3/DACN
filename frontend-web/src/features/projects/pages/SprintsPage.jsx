import { useState, useEffect } from 'react'
import { PageLayout, DataTable, Loading, ErrorMessage, StatusBadge } from '@/shared/components'
import { apiService } from '@/shared/services'

export default function SprintsPage() {
  const [sprints, setSprints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSprints()
  }, [])

  const loadSprints = async () => {
    try {
      setLoading(true)
      // Mock data - backend API cần project ID
      const mockData = [
        { sprintId: 1, ten: 'Sprint 1', ngayBatDau: '2025-11-01', ngayKetThuc: '2025-11-15', trangThai: 'DANG_CHAY' },
        { sprintId: 2, ten: 'Sprint 2', ngayBatDau: '2025-11-16', ngayKetThuc: '2025-11-30', trangThai: 'CHO_BAT_DAU' }
      ]
      setSprints(mockData)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải sprints')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { header: 'Sprint ID', key: 'sprintId', width: '100px' },
    { header: 'Tên Sprint', key: 'ten' },
    {
      header: 'Ngày bắt đầu',
      key: 'ngayBatDau',
      render: (val) => new Date(val).toLocaleDateString('vi-VN')
    },
    {
      header: 'Ngày kết thúc',
      key: 'ngayKetThuc',
      render: (val) => new Date(val).toLocaleDateString('vi-VN')
    },
    {
      header: 'Trạng thái',
      key: 'trangThai',
      render: (val) => {
        const statusMap = {
          'DANG_CHAY': 'active',
          'HOAN_THANH': 'success',
          'CHO_BAT_DAU': 'pending'
        }
        return <StatusBadge status={statusMap[val]} />
      }
    }
  ]

  if (loading) return <Loading />
  if (error) return <ErrorMessage error={error} onRetry={loadSprints} />

  return (
    <PageLayout
      title="Quản lý Sprints"
      subtitle="Quản lý các sprint trong dự án"
    >
      <DataTable
        columns={columns}
        data={sprints}
        emptyMessage="Chưa có sprint nào"
      />
    </PageLayout>
  )
}
