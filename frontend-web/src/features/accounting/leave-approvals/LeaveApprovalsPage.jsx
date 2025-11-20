import { useState, useEffect } from 'react'
import { PageLayout, ApprovalCard, FilterBar, Loading, ErrorMessage, EmptyState } from '@/shared/components'
import { leaveService } from '@/shared/services'

export default function LeaveApprovalsPage() {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('PM_APPROVED')
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    loadLeaves()
  }, [statusFilter])

  const loadLeaves = async () => {
    try {
      setLoading(true)
      const data = await leaveService.getPending()
      // Filter by status
      const filtered = statusFilter === 'PM_APPROVED' 
        ? (data || []).filter(l => l.trangThai === 'PM_APPROVED')
        : data || []
      setLeaves(filtered)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (leave) => {
    const note = prompt('Ghi chú phê duyệt (không bắt buộc):')
    if (note === null) return

    try {
      setProcessingId(leave.nghiphepId || leave.id)
      await leaveService.approve(leave.nghiphepId || leave.id, note || '')
      loadLeaves()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (leave) => {
    const note = prompt('Lý do từ chối (bắt buộc):')
    if (!note) {
      alert('Vui lòng nhập lý do từ chối!')
      return
    }

    try {
      setProcessingId(leave.nghiphepId || leave.id)
      await leaveService.reject(leave.nghiphepId || leave.id, note)
      loadLeaves()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorMessage error={error} onRetry={loadLeaves} />

  return (
    <PageLayout
      title="Duyệt nghỉ phép - Bước 2"
      subtitle="Duyệt đơn nghỉ phép sau PM (Step 2) - Check phép tồn + lương"
      filters={
        <FilterBar
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { label: 'PM đã duyệt (Chờ tôi)', value: 'PM_APPROVED' },
                { label: 'Tôi đã duyệt', value: 'DA_DUYET' },
                { label: 'Tôi đã từ chối', value: 'BI_TU_CHOI' }
              ]
            }
          ]}
        />
      }
    >
      <div style={{ padding: '24px' }}>
        {leaves.length === 0 ? (
          <EmptyState
            icon="✅"
            title="Không có đơn cần duyệt"
            message={statusFilter === 'PM_APPROVED' ? 'Không có đơn PM đã duyệt chờ bạn xử lý' : 'Không có đơn phù hợp'}
          />
        ) : (
          leaves.map((leave) => (
            <ApprovalCard
              key={leave.nghiphepId || leave.id}
              title={`${leave.tenNhanVien || leave.hoTenNhanVien} - ${leave.loaiPhepLabel || leave.loaiNghiPhep}`}
              subtitle={`Từ ${new Date(leave.tuNgay || leave.ngayBatDau).toLocaleDateString('vi-VN')} đến ${new Date(leave.denNgay || leave.ngayKetThuc).toLocaleDateString('vi-VN')}`}
              status="pending"
              details={[
                { label: 'Nhân viên', value: leave.tenNhanVien || leave.hoTenNhanVien },
                { label: 'Lý do', value: leave.lyDo || '-' },
                { label: 'Số ngày', value: `${leave.soNgay || 0} ngày` },
                { label: 'Ngày tạo', value: new Date(leave.ngayTao || leave.createdAt).toLocaleDateString('vi-VN') }
              ]}
              onApprove={() => handleApprove(leave)}
              onReject={() => handleReject(leave)}
              showActions={leave.trangThai === 'PM_APPROVED'}
              approving={processingId === (leave.nghiphepId || leave.id)}
              rejecting={processingId === (leave.nghiphepId || leave.id)}
            />
          ))
        )}
      </div>
    </PageLayout>
  )
}
