import { useState, useEffect } from 'react'
import { PageLayout, ApprovalCard, Loading, ErrorMessage, EmptyState } from '@/shared/components'
import { roleRequestsService } from '@/shared/services'
import { usePermissions, useErrorHandler } from '@/shared/hooks'
import { validateRequired } from '@/shared/utils/validation'

export default function RoleRequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingId, setProcessingId] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [rejectNote, setRejectNote] = useState('')
  const [rejectError, setRejectError] = useState('')
  
  const { isAdmin } = usePermissions()
  const { handleError } = useErrorHandler()

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
      const errorMessage = handleError(err, { context: 'load_role_requests' })
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (request) => {
    if (!confirm(`Xác nhận duyệt yêu cầu thay đổi role của ${request.targetUser?.username || request.username}?`)) return
    
    try {
      setProcessingId(request.requestId || request.id)
      const note = `Approved by Admin` // Optional note
      await roleRequestsService.approve(request.requestId || request.id, note)
      loadRequests()
      alert('✅ Đã duyệt yêu cầu thành công!')
    } catch (err) {
      const errorMessage = handleError(err, { context: 'approve_role_request' })
      alert(errorMessage)
    } finally {
      setProcessingId(null)
    }
  }

  const handleRejectClick = (request) => {
    setSelectedRequest(request)
    setRejectNote('')
    setRejectError('')
    setShowRejectModal(true)
  }
  
  const handleRejectSubmit = async () => {
    // Validate
    const error = validateRequired(rejectNote, 'Lý do từ chối')
    if (error) {
      setRejectError(error)
      return
    }
    
    if (rejectNote.trim().length < 10) {
      setRejectError('Lý do từ chối phải có ít nhất 10 ký tự')
      return
    }

    try {
      setProcessingId(selectedRequest.requestId || selectedRequest.id)
      await roleRequestsService.reject(selectedRequest.requestId || selectedRequest.id, rejectNote)
      setShowRejectModal(false)
      loadRequests()
      alert('✅ Đã từ chối yêu cầu!')
    } catch (err) {
      const errorMessage = handleError(err, { context: 'reject_role_request' })
      alert(errorMessage)
    } finally {
      setProcessingId(null)
    }
  }

  // Permission check
  if (!isAdmin) {
    return <ErrorMessage error="Bạn không có quyền truy cập trang này" />
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
              onReject={() => handleRejectClick(req)}
              showActions={true}
              approving={processingId === (req.requestId || req.id)}
              rejecting={processingId === (req.requestId || req.id)}
            />
          ))
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Từ chối yêu cầu</h3>
            <p style={styles.modalSubtitle}>
              Từ chối yêu cầu của: <strong>{selectedRequest?.targetUser?.username || selectedRequest?.username}</strong>
            </p>
            
            <label style={styles.label}>Lý do từ chối (bắt buộc):</label>
            <textarea
              style={{...styles.textarea, borderColor: rejectError ? '#ef4444' : '#cbd5e1'}}
              rows="4"
              placeholder="Nhập lý do từ chối (tối thiểu 10 ký tự)..."
              value={rejectNote}
              onChange={(e) => {
                setRejectNote(e.target.value)
                setRejectError('')
              }}
            />
            {rejectError && <div style={styles.error}>{rejectError}</div>}
            
            <div style={styles.modalActions}>
              <button
                style={styles.btnCancel}
                onClick={() => setShowRejectModal(false)}
              >
                Hủy
              </button>
              <button
                style={styles.btnReject}
                onClick={handleRejectSubmit}
                disabled={processingId !== null}
              >
                {processingId ? 'Đang xử lý...' : 'Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#111827'
  },
  modalSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none'
  },
  error: {
    color: '#ef4444',
    fontSize: '13px',
    marginTop: '6px'
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    justifyContent: 'flex-end'
  },
  btnCancel: {
    padding: '10px 20px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  btnReject: {
    padding: '10px 20px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  }
}
