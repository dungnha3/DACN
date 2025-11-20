import { useEffect, useMemo, useState } from 'react'
import { styles } from './TimesheetPage.styles'
import { StatusBadge } from './components/TimesheetComponents'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { employeesService } from '@/features/hr/shared/services/employees.service'
import { attendanceService } from '@/features/hr/shared/services/attendance.service'

export default function TimesheetPage() {
  const { user: authUser } = useAuth()
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [records, setRecords] = useState([])
  const [employeeId, setEmployeeId] = useState(null)
  const [todayRecordId, setTodayRecordId] = useState(null)

  const now = useMemo(() => new Date(), [])
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const mapRecord = (item) => ({
    date: item.ngayCham || item.date || '',
    timeIn: item.gioVao || item.timeIn || '-',
    timeOut: item.gioRa || item.timeOut || '-',
    hours: typeof item.tongGio === 'number' ? Number(item.tongGio.toFixed(1)) : item.hours ?? 0,
    status: item.trangThai || item.status || 'normal'
  })

  const loadEmployeeAndData = async () => {
    try {
      const userId = authUser?.userId
      if (!userId || typeof userId !== 'number') {
        console.warn('Invalid userId:', userId)
        return
      }
      
      const emp = await employeesService.getByUserId(userId)
      const eid = emp?.nhanvienId || emp?.id || emp?.employeeId
      
      if (!eid || typeof eid !== 'number') {
        console.warn('No valid employeeId found for userId:', userId)
        return
      }
      
      setEmployeeId(eid)
      const list = await attendanceService.getByMonth(eid, year, month)
      const mapped = (list || []).map(mapRecord)
      setRecords(mapped)
      
      const statusRes = await attendanceService.getStatus(eid)
      const checkedIn = statusRes?.dangCheckin ?? statusRes?.checkedIn ?? statusRes?.isCheckedIn ?? false
      const recId = statusRes?.chamcongId || statusRes?.id || null
      setIsCheckedIn(Boolean(checkedIn))
      setTodayRecordId(recId)
    } catch (err) {
      console.warn('Failed to load attendance data:', err)
      // Don't show alert on initial load - user may not have employee record
    }
  }

  useEffect(() => {
    loadEmployeeAndData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCheckInOut = async () => {
    try {
      if (!employeeId) return alert('Không tìm thấy mã nhân viên')
      const statusRes = await attendanceService.getStatus(employeeId)
      const checkedIn = statusRes?.dangCheckin ?? statusRes?.checkedIn ?? statusRes?.isCheckedIn ?? false
      const recId = statusRes?.chamcongId || statusRes?.id || null
      if (!checkedIn) {
        await attendanceService.checkIn(employeeId, todayStr)
        setIsCheckedIn(true)
        await loadEmployeeAndData()
        alert('Đã chấm công vào')
      } else {
        const targetId = recId || todayRecordId
        if (!targetId) return alert('Không tìm thấy bản ghi chấm công hôm nay')
        await attendanceService.checkOut(targetId)
        setIsCheckedIn(false)
        await loadEmployeeAndData()
        alert('Đã chấm công ra')
      }
    } catch (err) {
      alert('Lỗi chấm công: ' + (err.response?.data?.message || err.message))
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
                {records.map((record, idx) => (
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
