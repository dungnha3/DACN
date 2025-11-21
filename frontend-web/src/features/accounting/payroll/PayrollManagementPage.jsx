import { useState, useEffect } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { formatCurrency } from '@/shared/utils'
import { PayrollCalculationModal } from '@/shared/components/payroll'

export default function PayrollManagementPage() {
  const [payrolls, setPayrolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [showCalculationModal, setShowCalculationModal] = useState(false)
  
  const { user: authUser } = useAuth()

  // Mock employees data - in real app, fetch from API
  const mockEmployees = [
    { nhanvien_id: 1, hoTen: 'Nguyễn Văn A', email: 'nva@company.com', luongCoBan: 15000000, phuCap: 2000000, chucVu: 'Developer', phongBan: 'IT' },
    { nhanvien_id: 2, hoTen: 'Trần Thị B', email: 'ttb@company.com', luongCoBan: 18000000, phuCap: 2500000, chucVu: 'Senior Developer', phongBan: 'IT' },
    { nhanvien_id: 3, hoTen: 'Lê Văn C', email: 'lvc@company.com', luongCoBan: 12000000, phuCap: 1500000, chucVu: 'Tester', phongBan: 'QA' },
  ]

  // Mock attendance data - in real app, fetch from API
  const mockAttendance = [
    { nhanvien_id: 1, thang: month, nam: year, tongGio: 176 },
    { nhanvien_id: 1, thang: month, nam: year, tongGio: 8 },
    { nhanvien_id: 2, thang: month, nam: year, tongGio: 180 },
    { nhanvien_id: 3, thang: month, nam: year, tongGio: 170 },
  ]

  useEffect(() => {
    loadPayrolls()
  }, [month, year])

  const loadPayrolls = async () => {
    try {
      setLoading(true)
      // Simulate loading payroll data
      setTimeout(() => {
        setPayrolls([
          {
            id: 1,
            nhanVien: { hoTen: 'Nguyễn Văn A', email: 'a@company.com' },
            thang: month,
            nam: year,
            luongCoBan: 15000000,
            phuCap: 2000000,
            thuong: 1000000,
            khauTru: 500000,
            thucLinh: 17500000,
            trangThai: 'DA_TINH'
          },
          {
            id: 2,
            nhanVien: { hoTen: 'Trần Thị B', email: 'b@company.com' },
            thang: month,
            nam: year,
            luongCoBan: 18000000,
            phuCap: 2500000,
            thuong: 1500000,
            khauTru: 600000,
            thucLinh: 21400000,
            trangThai: 'DA_TINH'
          },
          {
            id: 3,
            nhanVien: { hoTen: authUser?.username || 'Accounting Manager', email: 'accounting@company.com' },
            thang: month,
            nam: year,
            luongCoBan: 25000000,
            phuCap: 5000000,
            thuong: 3000000,
            khauTru: 800000,
            thucLinh: 32200000,
            trangThai: 'DA_TINH'
          }
        ])
        setError(null)
        setLoading(false)
      }, 1000)
    } catch (err) {
      setError('Không thể tải bảng lương')
      setLoading(false)
    }
  }

  const handleConfirmCalculation = async (payrollData) => {
    try {
      // Simulate API call to create payroll
      await new Promise(resolve => setTimeout(resolve, 500))
      
      alert('✅ Đã tạo bảng lương thành công!')
      loadPayrolls()
    } catch (err) {
      throw new Error('Lỗi tạo bảng lương: ' + err.message)
    }
  }

  const handleCalculateAll = async () => {
    if (!confirm(`Tính lương tất cả nhân viên tháng ${month}/${year}?`)) return
    
    try {
      // Simulate calculation
      alert('✅ Đã tính lương thành công!')
      loadPayrolls()
    } catch (err) {
      alert('❌ Lỗi tính lương')
    }
  }


  if (loading) {
    return (
      <div style={{ padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 18, color: '#7b809a', marginBottom: 16 }}>Đang tải bảng lương...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 18, color: '#ef4444', marginBottom: 16 }}>❌ {error}</div>
          <button 
            onClick={loadPayrolls}
            style={{
              background: 'linear-gradient(195deg, #42424a, #191919)',
              color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px',
              fontSize: 13, fontWeight: 700, cursor: 'pointer'
            }}
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: '#7b809a', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>
          Quản lý tài chính / Bảng lương
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#344767' }}>
            Bảng lương
          </h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              style={{
                background: 'linear-gradient(195deg, #42a5f5, #1976d2)',
                color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(25, 118, 210, 0.2)'
              }}
              onClick={() => setShowCalculationModal(true)}
            >
              ⚡ Tính lương tự động
            </button>
            <button 
              style={{
                background: 'linear-gradient(195deg, #66bb6a, #43a047)',
                color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(67, 160, 71, 0.2)'
              }}
              onClick={handleCalculateAll}
            >
              📊 Tính lương tất cả
            </button>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <select 
          value={month} 
          onChange={(e) => setMonth(parseInt(e.target.value))}
          style={{
            padding: '10px 12px', border: '1px solid #d2d6da', borderRadius: 8,
            fontSize: 14, color: '#344767', background: '#fff'
          }}
        >
          {Array.from({length: 12}, (_, i) => (
            <option key={i+1} value={i+1}>Tháng {i+1}</option>
          ))}
        </select>
        <select 
          value={year} 
          onChange={(e) => setYear(parseInt(e.target.value))}
          style={{
            padding: '10px 12px', border: '1px solid #d2d6da', borderRadius: 8,
            fontSize: 14, color: '#344767', background: '#fff'
          }}
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 24 }}>
        {[
          { title: 'Tổng nhân viên', value: payrolls.length, icon: '👥', color: '#3b82f6', bg: '#eff6ff' },
          { title: 'Tổng lương', value: formatCurrency(payrolls.reduce((sum, p) => sum + p.thucLinh, 0)), icon: '💰', color: '#10b981', bg: '#f0fdf4' },
          { title: 'Đã tính', value: payrolls.filter(p => p.trangThai === 'DA_TINH').length, icon: '✓', color: '#10b981', bg: '#f0fdf4' },
          { title: 'Chưa tính', value: payrolls.filter(p => p.trangThai === 'CHUA_TINH').length, icon: '⏳', color: '#f59e0b', bg: '#fff7ed' }
        ].map((stat, i) => (
          <div key={i} style={{
            padding: 20, borderRadius: 16, border: '1px solid', borderColor: stat.color + '40',
            background: stat.bg, display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#67748e', textTransform: 'uppercase' }}>
                {stat.title}
              </span>
              <span style={{ fontSize: 18, color: stat.color }}>{stat.icon}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        overflow: 'hidden', border: '1px solid rgba(0,0,0,0.02)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#7b809a', textTransform: 'uppercase', borderBottom: '1px solid #f0f2f5' }}>
                Nhân viên
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#7b809a', textTransform: 'uppercase', borderBottom: '1px solid #f0f2f5' }}>
                Lương cơ bản
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#7b809a', textTransform: 'uppercase', borderBottom: '1px solid #f0f2f5' }}>
                Phụ cấp
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#7b809a', textTransform: 'uppercase', borderBottom: '1px solid #f0f2f5' }}>
                Thưởng
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#7b809a', textTransform: 'uppercase', borderBottom: '1px solid #f0f2f5' }}>
                Khấu trừ
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#7b809a', textTransform: 'uppercase', borderBottom: '1px solid #f0f2f5' }}>
                Thực lĩnh
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#7b809a', textTransform: 'uppercase', borderBottom: '1px solid #f0f2f5' }}>
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map(payroll => (
              <tr key={payroll.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                <td style={{ padding: '16px 24px', fontSize: 14, verticalAlign: 'middle', color: '#344767' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{payroll.nhanVien.hoTen}</div>
                    <div style={{ fontSize: 12, color: '#7b809a' }}>{payroll.nhanVien.email}</div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontSize: 14, verticalAlign: 'middle', color: '#344767', textAlign: 'right' }}>
                  {formatCurrency(payroll.luongCoBan)}
                </td>
                <td style={{ padding: '16px 24px', fontSize: 14, verticalAlign: 'middle', color: '#344767', textAlign: 'right' }}>
                  {formatCurrency(payroll.phuCap)}
                </td>
                <td style={{ padding: '16px 24px', fontSize: 14, verticalAlign: 'middle', color: '#10b981', textAlign: 'right' }}>
                  {formatCurrency(payroll.thuong)}
                </td>
                <td style={{ padding: '16px 24px', fontSize: 14, verticalAlign: 'middle', color: '#ef4444', textAlign: 'right' }}>
                  -{formatCurrency(payroll.khauTru)}
                </td>
                <td style={{ padding: '16px 24px', fontSize: 14, verticalAlign: 'middle', color: '#344767', textAlign: 'right', fontWeight: 700 }}>
                  {formatCurrency(payroll.thucLinh)}
                </td>
                <td style={{ padding: '16px 24px', fontSize: 14, verticalAlign: 'middle', textAlign: 'center' }}>
                  <span style={{
                    background: payroll.trangThai === 'DA_TINH' ? '#f0fdf4' : '#fff7ed',
                    color: payroll.trangThai === 'DA_TINH' ? '#15803d' : '#c2410c',
                    padding: '4px 8px', borderRadius: 6,
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase'
                  }}>
                    {payroll.trangThai === 'DA_TINH' ? '✓ Đã tính' : '⏳ Chưa tính'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payroll Calculation Modal */}
      <PayrollCalculationModal
        isOpen={showCalculationModal}
        onClose={() => setShowCalculationModal(false)}
        onConfirm={handleConfirmCalculation}
        employees={mockEmployees}
        attendanceData={mockAttendance}
      />
    </div>
  );
}
