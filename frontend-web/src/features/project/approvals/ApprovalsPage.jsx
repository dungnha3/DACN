import { useState } from 'react'
import { styles } from './ApprovalsPage.styles'
import { pendingApprovals } from './data/approvals.constants'
import { ApprovalStatusBadge } from './components/ApprovalsComponents'

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState(pendingApprovals)

  const handleApprove = (id) => {
    setApprovals(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'approved' } : item
    ))
    alert('Đã duyệt đơn thành công!')
  }

  const handleReject = (id) => {
    setApprovals(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'rejected' } : item
    ))
    alert('Đã từ chối đơn!')
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Duyệt nghỉ phép</h1>
        <p style={styles.subtitle}>Duyệt đơn nghỉ phép của nhân viên trong dự án</p>
      </div>

      <div style={styles.pageContent}>
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h4 style={styles.tableTitle}>Duyệt nghỉ phép nhân viên</h4>
          </div>
          
          {approvals.map((approval) => (
            <div key={approval.id} style={styles.approvalCard}>
              <div style={styles.approvalHeader}>
                <div>
                  <div style={styles.approvalEmployee}>{approval.employeeName}</div>
                  <div style={styles.approvalType}>{approval.type}</div>
                </div>
                <ApprovalStatusBadge status={approval.status} />
              </div>

              <div style={styles.approvalBody}>
                <div style={styles.approvalField}>
                  <div style={styles.approvalLabel}>Từ ngày</div>
                  <div style={styles.approvalValue}>{approval.fromDate}</div>
                </div>
                <div style={styles.approvalField}>
                  <div style={styles.approvalLabel}>Đến ngày</div>
                  <div style={styles.approvalValue}>{approval.toDate}</div>
                </div>
                <div style={styles.approvalField}>
                  <div style={styles.approvalLabel}>Số ngày</div>
                  <div style={styles.approvalValue}>{approval.days} ngày</div>
                </div>
                <div style={styles.approvalField}>
                  <div style={styles.approvalLabel}>Ngày gửi</div>
                  <div style={styles.approvalValue}>{approval.submitDate}</div>
                </div>
                <div style={styles.approvalReason}>
                  <div style={styles.approvalReasonLabel}>Lý do</div>
                  <div style={styles.approvalReasonText}>{approval.reason}</div>
                </div>
              </div>

              {approval.status === 'pending' && (
                <div style={styles.approvalActions}>
                  <button style={styles.rejectBtn} onClick={() => handleReject(approval.id)}>
                    ✗ Từ chối
                  </button>
                  <button style={styles.approveBtn} onClick={() => handleApprove(approval.id)}>
                    ✓ Phê duyệt
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
