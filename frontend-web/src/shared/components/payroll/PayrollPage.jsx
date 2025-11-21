import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { payrollService } from '@/features/hr/shared/services';
import { usePermissions, useErrorHandler } from '@/shared/hooks';
import { formatCurrency } from '@/shared/utils';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  Breadcrumb,
  FilterBar,
  FormSelect,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  LoadingState,
  ErrorState,
  EmptyState,
  StatCard
} from '@/shared/components/ui';

export default function SharedPayrollPage({ 
  title = "Phiếu lương",
  breadcrumb = "Cá nhân / Phiếu lương",
  viewMode = "personal" // "personal" | "management"
}) {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const { user: authUser } = useAuth();
  const { currentUser, isHRManager } = usePermissions();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    loadPayrolls();
  }, [selectedMonth, selectedYear]);

  const loadPayrolls = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (viewMode === "personal" && currentUser?.userId) {
        // Load personal payrolls only
        const data = await payrollService.getByEmployee(currentUser.userId, selectedYear, selectedMonth);
        setPayrolls(data || []);
      } else if (viewMode === "management" && isHRManager) {
        // Load all payrolls for management
        const data = await payrollService.getAll(selectedYear, selectedMonth);
        setPayrolls(data || []);
      }
    } catch (err) {
      const errorMessage = handleError(err, { context: 'load_payrolls' });
      setError(errorMessage);
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const currentPayroll = payrolls.find(p => p.thang === selectedMonth && p.nam === selectedYear);
  const stats = {
    luongCoBan: currentPayroll?.luongCoBan || 0,
    phuCap: currentPayroll?.phuCap || 0,
    thuong: currentPayroll?.thuong || 0,
    khauTru: currentPayroll?.khauTru || 0,
    thucLinh: currentPayroll?.thucLinh || 0
  };


  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      CHO_DUYET: { bg: '#fff7ed', color: '#c2410c', label: '⏳ Chờ duyệt' },
      DA_DUYET: { bg: '#f0fdf4', color: '#15803d', label: '✓ Đã duyệt' },
      DA_TRA: { bg: '#eff6ff', color: '#2563eb', label: '💰 Đã trả' },
      HUY: { bg: '#fef2f2', color: '#b91c1c', label: '✗ Hủy' }
    };
    const s = config[status] || config.CHO_DUYET;
    return (
      <span style={{
        background: s.bg, color: s.color, padding: '4px 8px', borderRadius: 6,
        fontSize: 11, fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap'
      }}>
        {s.label}
      </span>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState message="Đang tải thông tin lương..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState message={error} onRetry={loadPayrolls} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader>
        <div>
          <Breadcrumb>{breadcrumb}</Breadcrumb>
          <PageTitle>{title}</PageTitle>
          {viewMode === "personal" && (
            <div style={{ fontSize: 14, color: '#7b809a', marginTop: 4 }}>
              Xem thông tin lương và phụ cấp của bạn
            </div>
          )}
        </div>
      </PageHeader>

      {/* Filter Bar */}
      <FilterBar>
        <FormSelect 
          value={selectedMonth} 
          onChange={e => setSelectedMonth(Number(e.target.value))}
          style={{ minWidth: 120 }}
        >
          {Array.from({length: 12}, (_, i) => (
            <option key={i+1} value={i+1}>Tháng {i+1}</option>
          ))}
        </FormSelect>
        
        <FormSelect 
          value={selectedYear} 
          onChange={e => setSelectedYear(Number(e.target.value))}
          style={{ minWidth: 100 }}
        >
          {Array.from({length: 5}, (_, i) => {
            const year = new Date().getFullYear() - i;
            return <option key={year} value={year}>{year}</option>
          })}
        </FormSelect>
      </FilterBar>

      {currentPayroll ? (
        <>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 24 }}>
            <StatCard 
              title="Lương cơ bản" 
              value={formatCurrency(stats.luongCoBan)} 
              icon="💰" 
              color="#3b82f6" 
              bg="#eff6ff" 
            />
            <StatCard 
              title="Phụ cấp" 
              value={formatCurrency(stats.phuCap)} 
              icon="💎" 
              color="#10b981" 
              bg="#f0fdf4" 
            />
            <StatCard 
              title="Thưởng" 
              value={formatCurrency(stats.thuong)} 
              icon="🎁" 
              color="#f59e0b" 
              bg="#fff7ed" 
            />
            <StatCard 
              title="Khấu trừ" 
              value={formatCurrency(stats.khauTru)} 
              icon="📉" 
              color="#ef4444" 
              bg="#fef2f2" 
            />
            <StatCard 
              title="Thực lĩnh" 
              value={formatCurrency(stats.thucLinh)} 
              icon="💵" 
              color="#8b5cf6" 
              bg="#f3e8ff" 
            />
          </div>

          {/* Payroll Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                Chi tiết lương tháng {selectedMonth}/{selectedYear}
              </CardTitle>
              <div>{getStatusBadge(currentPayroll.trangThai)}</div>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Thu nhập */}
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: '#16a34a', marginBottom: 16 }}>
                    💰 Thu nhập
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Lương cơ bản:</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(currentPayroll.luongCoBan)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Phụ cấp:</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(currentPayroll.phuCap)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Thưởng:</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(currentPayroll.thuong)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Làm thêm giờ:</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(currentPayroll.lamThemGio || 0)}</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '8px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#16a34a' }}>
                      <span>Tổng thu nhập:</span>
                      <span>{formatCurrency((currentPayroll.luongCoBan || 0) + (currentPayroll.phuCap || 0) + (currentPayroll.thuong || 0) + (currentPayroll.lamThemGio || 0))}</span>
                    </div>
                  </div>
                </div>

                {/* Khấu trừ */}
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: '#ef4444', marginBottom: 16 }}>
                    📉 Khấu trừ
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Bảo hiểm xã hội:</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(currentPayroll.bhxh || 0)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Bảo hiểm y tế:</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(currentPayroll.bhyt || 0)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Bảo hiểm thất nghiệp:</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(currentPayroll.bhtn || 0)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Thuế TNCN:</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(currentPayroll.thueTNCN || 0)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Khấu trừ khác:</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(currentPayroll.khauTruKhac || 0)}</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '8px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#ef4444' }}>
                      <span>Tổng khấu trừ:</span>
                      <span>{formatCurrency(currentPayroll.khauTru)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thực lĩnh */}
              <div style={{ 
                marginTop: 24, padding: 20, background: '#f8f9fa', borderRadius: 12, 
                border: '2px solid #e5e7eb', textAlign: 'center'
              }}>
                <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
                  THỰC LĨNH THÁNG {selectedMonth}/{selectedYear}
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#1f2937' }}>
                  {formatCurrency(currentPayroll.thucLinh)}
                </div>
                {currentPayroll.ngayTra && (
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
                    Ngày trả: {new Date(currentPayroll.ngayTra).toLocaleDateString('vi-VN')}
                  </div>
                )}
              </div>

              {/* Ghi chú */}
              {currentPayroll.ghiChu && (
                <div style={{ marginTop: 20 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                    📝 Ghi chú
                  </h4>
                  <div style={{ 
                    background: '#f9fafb', padding: 12, borderRadius: 8, 
                    fontSize: 14, color: '#374151', border: '1px solid #e5e7eb'
                  }}>
                    {currentPayroll.ghiChu}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </>
      ) : (
        <Card>
          <CardBody>
            <EmptyState 
              icon="💰" 
              title="Không có dữ liệu lương"
              message={`Chưa có thông tin lương cho tháng ${selectedMonth}/${selectedYear}`}
            />
          </CardBody>
        </Card>
      )}

      {/* History Table (if multiple payrolls) */}
      {payrolls.length > 1 && (
        <Card style={{ marginTop: 24 }}>
          <CardHeader>
            <CardTitle>Lịch sử lương</CardTitle>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tháng/Năm</TableHead>
                  <TableHead>Lương CB</TableHead>
                  <TableHead>Phụ cấp</TableHead>
                  <TableHead>Thưởng</TableHead>
                  <TableHead>Khấu trừ</TableHead>
                  <TableHead>Thực lĩnh</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrolls.map(payroll => (
                  <TableRow key={`${payroll.thang}-${payroll.nam}`}>
                    <TableCell>{payroll.thang}/{payroll.nam}</TableCell>
                    <TableCell>{formatCurrency(payroll.luongCoBan)}</TableCell>
                    <TableCell>{formatCurrency(payroll.phuCap)}</TableCell>
                    <TableCell>{formatCurrency(payroll.thuong)}</TableCell>
                    <TableCell>{formatCurrency(payroll.khauTru)}</TableCell>
                    <TableCell style={{ fontWeight: 700 }}>
                      {formatCurrency(payroll.thucLinh)}
                    </TableCell>
                    <TableCell>{getStatusBadge(payroll.trangThai)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      )}
    </PageContainer>
  );
}
