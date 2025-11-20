import { useState, useEffect } from 'react'
import { PageLayout, DataTable, FilterBar, StatusBadge, Loading, ErrorMessage } from '@/shared/components'
import { payrollService } from '@/shared/services'

export default function PayrollManagementPage() {
  const [payrolls, setPayrolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    loadPayrolls()
  }, [month, year])

  const loadPayrolls = async () => {
    try {
      setLoading(true)
      const data = await payrollService.getByMonth(month, year)
      setPayrolls(data || [])
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải bảng lương')
    } finally {
      setLoading(false)
    }
  }

  const handleCalculateAll = async () => {
    if (!confirm(`Tính lương tất cả nhân viên tháng ${month}/${year}?`)) return
    
    try {
      await payrollService.calculate({ thang: month, nam: year })
      loadPayrolls()
      alert('Tính lương thành công!')
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleMarkAsPaid = async (payrollId) => {
    if (!confirm('Đánh dấu đã thanh toán?')) return
    
    try {
      await payrollService.markAsPaid(payrollId)
      loadPayrolls()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const columns = [
    { header: 'Mã NV', key: 'nhanvienId', width: '80px' },
    { header: 'Họ tên', key: 'tenNhanVien' },
    { header: 'Lương cơ bản', key: 'luongCoBan', render: (val) => `${(val || 0).toLocaleString('vi-VN')} đ` },
    { header: 'Phụ cấp', key: 'phuCap', render: (val) => `${(val || 0).toLocaleString('vi-VN')} đ` },
    {
      header: 'Thực nhận',
      key: 'luongThucNhan',
      render: (val) => (
        <strong style={{ color: '#10b981' }}>
          {(val || 0).toLocaleString('vi-VN')} đ
        </strong>
      )
    },
    {
      header: 'Trạng thái',
      key: 'trangThai',
      render: (val) => <StatusBadge status={val === 'DA_THANH_TOAN' ? 'success' : 'pending'} />
    },
    {
      header: 'Hành động',
      key: 'actions',
      render: (_, row) => (
        row.trangThai !== 'DA_THANH_TOAN' && (
          <button
            onClick={() => handleMarkAsPaid(row.id)}
            style={styles.payBtn}
          >
            💰 Thanh toán
          </button>
        )
      )
    }
  ]

  const monthOptions = Array.from({length: 12}, (_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }))
  const yearOptions = Array.from({length: 3}, (_, i) => ({ label: `${new Date().getFullYear() - i}`, value: new Date().getFullYear() - i }))

  if (loading) return <Loading />
  if (error) return <ErrorMessage error={error} onRetry={loadPayrolls} />

  return (
    <PageLayout
      title="Quản lý Bảng lương"
      subtitle="Quản lý toàn bộ bảng lương nhân viên - Xem FULL không bị mask"
      actions={
        <button onClick={handleCalculateAll} style={styles.calculateBtn}>
          🧮 Tính lương tất cả
        </button>
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
      <DataTable
        columns={columns}
        data={payrolls}
        emptyMessage={`Chưa có bảng lương tháng ${month}/${year}`}
      />
    </PageLayout>
  )
}

const styles = {
  calculateBtn: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  payBtn: {
    padding: '4px 12px',
    fontSize: '12px',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
}
