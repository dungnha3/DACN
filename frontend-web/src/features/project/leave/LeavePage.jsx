import { styles } from './LeavePage.styles'
import { leaveRequests } from './data/leave.constants'
import { LeaveStatusBar } from './components/LeaveComponents'

export default function LeavePage() {
  const handleAddLeave = () => {
    alert('Tính năng đăng ký nghỉ phép đang được phát triển')
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Đơn từ & Nghỉ phép</h1>
        <p style={styles.subtitle}>Xin nghỉ phép và xem trạng thái đơn</p>
      </div>

      <div style={styles.pageContent}>
        <div style={styles.leaveLayout}>
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <h4 style={styles.tableTitle}>Lịch sử đơn từ của tôi</h4>
              <button style={styles.addBtn} onClick={handleAddLeave}>
                + Đăng ký nghỉ phép
              </button>
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Loại đơn</th>
                    <th style={styles.th}>Ngày gửi</th>
                    <th style={styles.th}>Người duyệt</th>
                    <th style={styles.th}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((req) => (
                    <tr key={req.id} style={styles.tr}>
                      <td style={styles.td}>{req.type}</td>
                      <td style={styles.td}>{req.date}</td>
                      <td style={styles.td}>{req.approver}</td>
                      <td style={styles.td}>
                        <LeaveStatusBar status={req.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.orderOverview}>
            <h4 style={styles.cardTitle}>Thông báo của tôi</h4>
            <div style={styles.orderList}>
              {leaveRequests.map((req) => (
                <div key={req.id} style={styles.orderItem}>
                  <div style={styles.orderIcon(req.status)}>
                    {req.status === 'approved' ? '✓' : req.status === 'pending' ? '⏳' : '✗'}
                  </div>
                  <div style={styles.orderContent}>
                    <div style={styles.orderTitle}>{req.type} {req.date}</div>
                    <div style={styles.orderStatus}>
                      {req.status === 'approved' ? 'Đã duyệt' : req.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
