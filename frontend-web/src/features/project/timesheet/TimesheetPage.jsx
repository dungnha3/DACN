import { useState } from 'react'
import { styles } from './TimesheetPage.styles'
import { attendanceHistory } from './data/timesheet.constants'
import { StatusBadge } from './components/TimesheetComponents'

export default function TimesheetPage() {
  const [isCheckedIn, setIsCheckedIn] = useState(false)

  const handleCheckInOut = () => {
    const now = new Date()
    const currentTime = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
    if (!isCheckedIn) {
      setIsCheckedIn(true)
      alert(`Đã chấm công vào lúc ${currentTime}`)
    } else {
      setIsCheckedIn(false)
      alert(`Đã chấm công ra lúc ${currentTime}`)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Lịch sử chấm công</h1>
        <p style={styles.subtitle}>Xem lịch sử chấm công và số giờ làm việc</p>
      </div>

      <div style={styles.pageContent}>
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h4 style={styles.tableTitle}>Lịch sử chấm công</h4>
            <button
              onClick={handleCheckInOut}
              style={{
                ...styles.checkInBtn,
                background: isCheckedIn
                  ? 'linear-gradient(195deg, #6b7280 0%, #4b5563 100%)'
                  : styles.checkInBtn.background,
                opacity: 1
              }}
            >
              {isCheckedIn ? '⏹ Chấm công ra' : '🟢 Chấm công'}
            </button>
          </div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Ngày</th>
                  <th style={styles.th}>Giờ vào</th>
                  <th style={styles.th}>Giờ ra</th>
                  <th style={styles.th}>Tổng giờ</th>
                  <th style={styles.th}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((record, idx) => (
                  <tr key={idx} style={styles.tr}>
                    <td style={styles.td}>{record.date}</td>
                    <td style={styles.td}>{record.timeIn}</td>
                    <td style={styles.td}>{record.timeOut}</td>
                    <td style={styles.td}>
                      <div style={styles.hoursCell}>
                        <div style={styles.hoursBar(record.hours)} />
                        <span style={styles.hoursText}>{record.hours}h</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <StatusBadge status={record.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
