import { useState, useEffect } from 'react'
import { PageLayout, DataTable, FilterBar, StatusBadge, Loading, ErrorMessage } from '@/shared/components'
import { attendanceService } from '@/shared/services'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function MyAttendancePage() {
  const { user } = useAuth()
  const [attendances, setAttendances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [checkInStatus, setCheckInStatus] = useState(null)

  useEffect(() => {
    loadAttendances()
    loadCheckInStatus()
  }, [month, year])

  const loadAttendances = async () => {
    try {
      setLoading(true)
      const employeeId = user?.employeeId || 1
      
      // Mock data - Backend API chưa ready
      const mockData = [
        { id: 1, ngayCham: '2025-11-08', gioVao: '08:30', gioRa: '17:45', tongGio: 9.3, trangThai: 'DUNG_GIO' },
        { id: 2, ngayCham: '2025-11-07', gioVao: '08:35', gioRa: '17:30', tongGio: 8.9, trangThai: 'DI_MUON' },
        { id: 3, ngayCham: '2025-11-06', gioVao: '08:25', gioRa: '17:15', tongGio: 8.8, trangThai: 'VE_SOM' }
      ]
      
      setAttendances(mockData)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải chấm công')
    } finally {
      setLoading(false)
    }
  }

  const loadCheckInStatus = async () => {
    try {
      const mockStatus = { hasCheckedIn: true, hasCheckedOut: false, checkInTime: '08:30', attendanceId: 1 }
      setCheckInStatus(mockStatus)
    } catch (err) {
      console.error('Cannot load check-in status:', err)
    }
  }

  const handleCheckIn = async () => {
    alert('⚠️ Chức năng check-in đang được phát triển. Backend API chưa sẵn sàng.')
  }

  const handleCheckOut = async () => {
    alert('⚠️ Chức năng check-out đang được phát triển. Backend API chưa sẵn sàng.')
  }

  const columns = [
    { header: 'Ngày', key: 'ngayCham', render: (val) => new Date(val).toLocaleDateString('vi-VN') },
    { header: 'Giờ vào', key: 'gioVao' },
    { header: 'Giờ ra', key: 'gioRa' },
    { header: 'Tổng giờ', key: 'tongGio', render: (val) => `${val} giờ` },
    { header: 'Trạng thái', key: 'trangThai', render: (val) => <StatusBadge status={val.toLowerCase()} /> }
  ]

  const monthOptions = Array.from({length: 12}, (_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }))
  const yearOptions = Array.from({length: 3}, (_, i) => ({ label: `${new Date().getFullYear() - i}`, value: new Date().getFullYear() - i }))

  if (loading) return <Loading />
  if (error) return <ErrorMessage error={error} onRetry={loadAttendances} />

  return (
    <PageLayout
      title="Chấm công của tôi"
      subtitle="Xem lịch sử chấm công"
      actions={
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleCheckIn} disabled={checkInStatus?.hasCheckedIn} style={styles.btn}>
            🕐 Check In
          </button>
          <button onClick={handleCheckOut} disabled={!checkInStatus?.hasCheckedIn || checkInStatus?.hasCheckedOut} style={styles.btn}>
            🚪 Check Out
          </button>
        </div>
      }
      filters={
        <FilterBar
          filters={[
            { value: month, onChange: (val) => setMonth(Number(val)), options: monthOptions },
            { value: year, onChange: (val) => setYear(Number(val)), options: yearOptions }
          ]}
        />
      }
    >
      <DataTable columns={columns} data={attendances} emptyMessage="Chưa có dữ liệu chấm công" />
    </PageLayout>
  )
}

const styles = {
  btn: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  }
}
