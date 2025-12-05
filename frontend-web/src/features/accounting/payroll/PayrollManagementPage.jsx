import { useState, useEffect } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { formatCurrency } from '@/shared/utils'
import { payrollService } from '@/shared/services/payroll.service'

export default function PayrollManagementPage() {
  const [payrolls, setPayrolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [calculating, setCalculating] = useState(false)
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, totalAmount: 0 })
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const { user: authUser } = useAuth()

  useEffect(() => {
    loadPayrolls()
    setCurrentPage(1) // Reset về trang 1 khi đổi tháng/năm
  }, [month, year])

  const loadPayrolls = async () => {
    try {
      setLoading(true)
      setError(null)

      // Gọi API thực
      const data = await payrollService.getByPeriod(month, year)
      const payrollList = Array.isArray(data) ? data : []
      setPayrolls(payrollList)

      // Tính stats
      const totalAmount = payrollList.reduce((sum, p) => sum + (p.luongThucNhan || 0), 0)
      const paid = payrollList.filter(p => p.trangThai === 'DA_THANH_TOAN').length
      const pending = payrollList.filter(p => p.trangThai === 'CHUA_THANH_TOAN').length

      setStats({
        total: payrollList.length,
        paid,
        pending,
        totalAmount
      })
    } catch (err) {
      console.error('Lỗi tải bảng lương:', err)
      setError('Không thể tải bảng lương. ' + (err.response?.data?.message || err.message))
      setPayrolls([])
    } finally {
      setLoading(false)
    }
  }

  const handleCalculateAll = async () => {
    if (!confirm(`Tính lương tự động tất cả nhân viên tháng ${month}/${year}?\n\nHệ thống sẽ tự động tính dựa trên:\n- Hợp đồng còn hiệu lực\n- Dữ liệu chấm công\n- Bảo hiểm & Thuế TNCN`)) return

    try {
      setCalculating(true)
      const result = await payrollService.autoCalculateAll(month, year)

      alert(`✅ Đã tính lương thành công cho ${result.soLuongBangLuong || 0} nhân viên!`)
      loadPayrolls()
    } catch (err) {
      console.error('Lỗi tính lương:', err)
      alert('❌ ' + (err.response?.data?.message || 'Lỗi tính lương tự động'))
    } finally {
      setCalculating(false)
    }
  }

  const handleMarkPaid = async (id, name) => {
    if (!confirm(`Xác nhận đã thanh toán lương cho ${name}?`)) return

    try {
      await payrollService.markAsPaid(id)
      alert('✅ Đã đánh dấu thanh toán thành công!')
      loadPayrolls()
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Lỗi cập nhật trạng thái'))
    }
  }

  const handleCancel = async (id, name) => {
    if (!confirm(`Xác nhận hủy bảng lương của ${name}?`)) return

    try {
      await payrollService.cancel(id)
      alert('✅ Đã hủy bảng lương!')
      loadPayrolls()
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Lỗi hủy bảng lương'))
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'CHUA_THANH_TOAN': { bg: '#fff7ed', color: '#c2410c', text: '⏳ Chờ thanh toán' },
      'DA_THANH_TOAN': { bg: '#f0fdf4', color: '#15803d', text: '✅ Đã thanh toán' },
      'DA_HUY': { bg: '#fef2f2', color: '#dc2626', text: '❌ Đã hủy' }
    }
    const config = statusConfig[status] || { bg: '#f1f5f9', color: '#64748b', text: status }
    return (
      <span style={{
        background: config.bg,
        color: config.color,
        padding: '4px 10px', borderRadius: 6,
        fontSize: 11, fontWeight: 700
      }}>
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div style={{ padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{
            width: 50, height: 50, margin: '0 auto 20px',
            border: '4px solid #e2e8f0', borderTopColor: '#6366f1',
            borderRadius: '50%', animation: 'spin 1s linear infinite'
          }} />
          <div style={{ fontSize: 16, color: '#64748b' }}>Đang tải bảng lương tháng {month}/{year}...</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <div style={{ fontSize: 18, color: '#ef4444', marginBottom: 16 }}>{error}</div>
          <button
            onClick={loadPayrolls}
            style={{
              background: 'linear-gradient(195deg, #6366f1, #4f46e5)',
              color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px',
              fontSize: 14, fontWeight: 600, cursor: 'pointer'
            }}
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>
          Kế toán / Quản lý bảng lương
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#1e293b' }}>
            💰 Bảng lương
          </h1>
          <button
            style={{
              background: calculating
                ? 'linear-gradient(195deg, #94a3b8, #64748b)'
                : 'linear-gradient(195deg, #6366f1, #4f46e5)',
              color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px',
              fontSize: 14, fontWeight: 600, cursor: calculating ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              display: 'flex', alignItems: 'center', gap: 8
            }}
            onClick={handleCalculateAll}
            disabled={calculating}
          >
            {calculating ? '⏳ Đang tính...' : '⚡ Tính lương tất cả'}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div style={{
        display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center',
        background: '#fff', padding: '16px 20px', borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: '#475569' }}>Kỳ lương:</label>
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            style={{
              padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: 8,
              fontSize: 14, color: '#1e293b', background: '#fff', cursor: 'pointer'
            }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            style={{
              padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: 8,
              fontSize: 14, color: '#1e293b', background: '#fff', cursor: 'pointer'
            }}
          >
            {[2023, 2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button
          onClick={loadPayrolls}
          style={{
            padding: '10px 16px', border: '2px solid #e2e8f0', borderRadius: 8,
            fontSize: 13, fontWeight: 600, color: '#475569', background: '#fff', cursor: 'pointer'
          }}
        >
          🔄 Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 24 }}>
        {[
          { title: 'Tổng nhân viên', value: stats.total, icon: '👥', color: '#6366f1', bg: '#eef2ff' },
          { title: 'Tổng chi lương', value: formatCurrency(stats.totalAmount), icon: '💰', color: '#10b981', bg: '#f0fdf4' },
          { title: 'Đã thanh toán', value: stats.paid, icon: '✅', color: '#22c55e', bg: '#f0fdf4' },
          { title: 'Chờ thanh toán', value: stats.pending, icon: '⏳', color: '#f59e0b', bg: '#fffbeb' }
        ].map((stat, i) => (
          <div key={i} style={{
            padding: 20, borderRadius: 16, border: '1px solid ' + stat.color + '30',
            background: stat.bg, display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                {stat.title}
              </span>
              <span style={{ fontSize: 20 }}>{stat.icon}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden', border: '1px solid #f1f5f9'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Nhân viên', 'Lương cơ bản', 'Ngày công', 'Phụ cấp', 'Thưởng', 'Khấu trừ', 'Thực lĩnh', 'Trạng thái', 'Thao tác'].map((h, i) => (
                <th key={i} style={{
                  padding: '14px 16px', textAlign: i >= 1 && i <= 6 ? 'right' : 'center',
                  fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payrolls.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>Chưa có dữ liệu bảng lương</div>
                  <div style={{ fontSize: 14, marginTop: 8 }}>Nhấn "Tính lương tất cả" để tạo bảng lương tháng {month}/{year}</div>
                </td>
              </tr>
            ) : (
              // Sắp xếp và phân trang
              (() => {
                const sortedPayrolls = [...payrolls].sort((a, b) => {
                  const order = { 'CHUA_THANH_TOAN': 0, 'DA_THANH_TOAN': 1, 'DA_HUY': 2 };
                  return (order[a.trangThai] || 0) - (order[b.trangThai] || 0);
                });
                const totalPages = Math.ceil(sortedPayrolls.length / ITEMS_PER_PAGE);
                const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                const paginatedPayrolls = sortedPayrolls.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                return paginatedPayrolls.map(p => (
                  <tr key={p.bangluongId} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '16px', fontSize: 14, color: '#1e293b' }}>
                      <div style={{ fontWeight: 600 }}>{p.hoTenNhanVien || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#475569', textAlign: 'right' }}>
                      {formatCurrency(p.luongCoBan || 0)}
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#475569', textAlign: 'right' }}>
                      {p.ngayCong || 0}/{p.ngayCongChuan || 22}
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#475569', textAlign: 'right' }}>
                      {formatCurrency(p.phuCap || 0)}
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#22c55e', textAlign: 'right' }}>
                      +{formatCurrency(p.thuong || 0)}
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#ef4444', textAlign: 'right' }}>
                      -{formatCurrency(p.tongKhauTru || 0)}
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#1e293b', textAlign: 'right', fontWeight: 700 }}>
                      {formatCurrency(p.luongThucNhan || 0)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      {getStatusBadge(p.trangThai)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        {p.trangThai === 'CHUA_THANH_TOAN' && (
                          <>
                            <button
                              onClick={() => handleMarkPaid(p.bangluongId, p.hoTenNhanVien)}
                              title="Thanh toán"
                              style={{
                                width: 32, height: 32, border: 'none', borderRadius: 8,
                                background: '#f0fdf4', color: '#22c55e', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}
                            >
                              💳
                            </button>
                            <button
                              onClick={() => handleCancel(p.bangluongId, p.hoTenNhanVien)}
                              title="Hủy"
                              style={{
                                width: 32, height: 32, border: 'none', borderRadius: 8,
                                background: '#fef2f2', color: '#ef4444', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}
                            >
                              ❌
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ));
              })()
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {payrolls.length > ITEMS_PER_PAGE && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          padding: '16px 20px',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            Hiển thị {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, payrolls.length)} - {Math.min(currentPage * ITEMS_PER_PAGE, payrolls.length)} trong tổng số {payrolls.length} nhân viên
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: currentPage === 1 ? '#f1f5f9' : '#fff',
                color: currentPage === 1 ? '#94a3b8' : '#475569',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: 500
              }}
            >
              ⏮️
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 14px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: currentPage === 1 ? '#f1f5f9' : '#fff',
                color: currentPage === 1 ? '#94a3b8' : '#475569',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: 500
              }}
            >
              ◀ Trước
            </button>

            {/* Page numbers */}
            {(() => {
              const totalPages = Math.ceil(payrolls.length / ITEMS_PER_PAGE);
              return Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                .map((page, idx, arr) => (
                  <div key={page} style={{ display: 'flex', alignItems: 'center' }}>
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span style={{ padding: '0 8px', color: '#94a3b8' }}>...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: '36px',
                        height: '36px',
                        border: page === currentPage ? '2px solid #6366f1' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        background: page === currentPage ? '#6366f1' : '#fff',
                        color: page === currentPage ? '#fff' : '#475569',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: page === currentPage ? 600 : 500
                      }}
                    >
                      {page}
                    </button>
                  </div>
                ))
            })()}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(payrolls.length / ITEMS_PER_PAGE)))}
              disabled={currentPage >= Math.ceil(payrolls.length / ITEMS_PER_PAGE)}
              style={{
                padding: '8px 14px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: currentPage >= Math.ceil(payrolls.length / ITEMS_PER_PAGE) ? '#f1f5f9' : '#fff',
                color: currentPage >= Math.ceil(payrolls.length / ITEMS_PER_PAGE) ? '#94a3b8' : '#475569',
                cursor: currentPage >= Math.ceil(payrolls.length / ITEMS_PER_PAGE) ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: 500
              }}
            >
              Sau ▶
            </button>
            <button
              onClick={() => setCurrentPage(Math.ceil(payrolls.length / ITEMS_PER_PAGE))}
              disabled={currentPage >= Math.ceil(payrolls.length / ITEMS_PER_PAGE)}
              style={{
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: currentPage >= Math.ceil(payrolls.length / ITEMS_PER_PAGE) ? '#f1f5f9' : '#fff',
                color: currentPage >= Math.ceil(payrolls.length / ITEMS_PER_PAGE) ? '#94a3b8' : '#475569',
                cursor: currentPage >= Math.ceil(payrolls.length / ITEMS_PER_PAGE) ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: 500
              }}
            >
              ⏭️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
