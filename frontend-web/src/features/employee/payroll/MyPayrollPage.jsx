import { useState, useEffect } from 'react'
import { PageLayout, DataTable, FilterBar, Loading, ErrorMessage } from '@/shared/components'
import { payrollService } from '@/shared/services'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function MyPayrollPage() {
  const { user } = useAuth()
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
      const employeeId = user?.employeeId || 1
      const data = await payrollService.getByEmployee(employeeId, month, year)
      setPayrolls(Array.isArray(data) ? data : [data])
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải bảng lương')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      header: 'Tháng/Năm',
      key: 'period',
      render: () => `${month}/${year}`
    },
    {
      header: 'Lương cơ bản',
      key: 'luongCoBan',
      render: (val) => `${(val || 0).toLocaleString('vi-VN')} đ`
    },
    {
      header: 'Phụ cấp',
      key: 'phuCap',
      render: (val) => `${(val || 0).toLocaleString('vi-VN')} đ`
    },
    {
      header: 'Thực nhận',
      key: 'luongThucNhan',
      render: (val) => (
        <strong style={{ color: '#10b981' }}>
          {(val || 0).toLocaleString('vi-VN')} đ
        </strong>
      )
    }
  ]

  const monthOptions = Array.from({length: 12}, (_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }))
  const yearOptions = Array.from({length: 3}, (_, i) => ({ label: `${new Date().getFullYear() - i}`, value: new Date().getFullYear() - i }))

  if (loading) return <Loading />
  if (error) return <ErrorMessage error={error} onRetry={loadPayrolls} />

  return (
    <PageLayout
      title="Bảng lương của tôi"
      subtitle="Xem thông tin lương hàng tháng"
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
