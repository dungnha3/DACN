import { useState, useEffect } from 'react'
import { PageLayout, ApprovalCard, Loading, ErrorMessage, EmptyState } from '@/shared/components'
import { roleRequestsService } from '@/shared/services'

export default function RoleRequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const data = await roleRequestsService.getPending()
      setRequests(data || [])
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải yêu cầu')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (request) => {
    try {
      setProcessingId(request.requestId || request.id)
      await roleRequestsService.approve(request.requestId || request.id)
      loadRequests()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (request) => {
    const reason = prompt('Lý do từ chối (bắt buộc):')
    if (!reason) {
      alert('Vui lòng nhập lý do từ chối!')
      return
    }

    try {
      setProcessingId(request.requestId || request.id)
      await roleRequestsService.reject(request.requestId || request.id, reason)
      loadRequests()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorMessage error={error} onRetry={loadRequests} />

  return (
    <PageLayout
      title="Yêu cầu Thay đổi Role"
      subtitle="Duyệt yêu cầu thay đổi quyền từ HR Manager"
    >
      <div style={{ padding: '24px' }}>
        {requests.length === 0 ? (
          <EmptyState
            icon="✅"
            title="Không có yêu cầu nào"
            message="Không có yêu cầu thay đổi role chờ duyệt"
          />
        ) : (
          requests.map((req) => (
            <ApprovalCard
              key={req.requestId || req.id}
              title={`${req.username || req.user?.username} - Yêu cầu role ${req.requestedRole}`}
              subtitle={`Tạo lúc ${new Date(req.createdAt || req.ngayTao).toLocaleString('vi-VN')}`}
              status="pending"
              details={[
                { label: 'Username', value: req.username || req.user?.username },
                { label: 'Email', value: req.email || req.user?.email },
                { label: 'Role hiện tại', value: req.currentRole },
                { label: 'Role mong muốn', value: req.requestedRole },
                { label: 'Lý do', value: req.reason || req.lyDo || '-' }
              ]}
              onApprove={() => handleApprove(req)}
              onReject={() => handleReject(req)}
              showActions={true}
              approving={processingId === (req.requestId || req.id)}
              rejecting={processingId === (req.requestId || req.id)}
            />
          ))
        )}
      </div>
    </PageLayout>
  )
}
