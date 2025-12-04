import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { contractsService } from '@/features/hr/shared/services';
import { usePermissions, useErrorHandler } from '@/shared/hooks';
import { formatCurrency } from '@/shared/utils';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  Breadcrumb,
  FilterBar,
  FormSelect,
  Button,
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
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  LoadingState,
  ErrorState,
  EmptyState,
  StatCard
} from '@/shared/components/ui';

export default function SharedContractsPage({
  title = "Hợp đồng & Tài liệu",
  breadcrumb = "Cá nhân / Hợp đồng",
  viewMode = "personal" // "personal" | "management"
}) {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('HIEU_LUC');
  const [selectedContract, setSelectedContract] = useState(null);

  const { user: authUser } = useAuth();
  const { currentUser, isHRManager } = usePermissions();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    loadContracts();
  }, [activeTab]);

  const loadContracts = async () => {
    try {
      setLoading(true);
      setError(null);

      if (viewMode === "personal" && currentUser?.userId) {
        // Load personal contracts only
        const data = await contractsService.getByEmployee(currentUser.userId);
        setContracts(data || []);
      } else if (viewMode === "management" && isHRManager) {
        // Load all contracts for management
        const data = await contractsService.getAll();
        setContracts(data || []);
      }
    } catch (err) {
      const errorMessage = handleError(err, { context: 'load_contracts' });
      setError(errorMessage);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter contracts by status
  const filteredContracts = contracts.filter(contract => {
    if (activeTab === 'ALL') return true;
    return contract.trangThai === activeTab;
  });

  // Calculate stats
  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.trangThai === 'HIEU_LUC').length,
    expired: contracts.filter(c => c.trangThai === 'HET_HAN').length,
    terminated: contracts.filter(c => c.trangThai === 'DA_CHAM_DUT').length
  };


  // Get contract type
  const getContractType = (type) => {
    const types = {
      THU_VIEC: { label: 'Thử việc', icon: '📝', color: '#f59e0b' },
      XAC_DINH_THOI_HAN: { label: 'Xác định thời hạn', icon: '📋', color: '#3b82f6' },
      KHONG_XAC_DINH_THOI_HAN: { label: 'Không xác định thời hạn', icon: '📄', color: '#10b981' },
      THOI_VU: { label: 'Thời vụ', icon: '⏰', color: '#ef4444' }
    };
    return types[type] || { label: type, icon: '📄', color: '#6b7280' };
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      HIEU_LUC: { bg: '#f0fdf4', color: '#15803d', label: '✓ Hiệu lực', border: '#dcfce7' },
      HET_HAN: { bg: '#fff7ed', color: '#c2410c', label: '⏰ Hết hạn', border: '#ffedd5' },
      DA_CHAM_DUT: { bg: '#fef2f2', color: '#b91c1c', label: '✗ Đã chấm dứt', border: '#fee2e2' },
      CHO_KY: { bg: '#eff6ff', color: '#2563eb', label: '✍️ Chờ ký', border: '#bfdbfe' }
    };
    const s = config[status] || config.HIEU_LUC;
    return (
      <span style={{
        background: s.bg, color: s.color, border: `1px solid ${s.border}`,
        padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
        textTransform: 'uppercase', whiteSpace: 'nowrap'
      }}>
        {s.label}
      </span>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState message="Đang tải thông tin hợp đồng..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState message={error} onRetry={loadContracts} />
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
              Quản lý hợp đồng và tài liệu cá nhân
            </div>
          )}
        </div>
        {viewMode === "management" && isHRManager && (
          <Button variant="success">+ Tạo hợp đồng</Button>
        )}
      </PageHeader>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 24 }}>
        <StatCard
          title="Tổng hợp đồng"
          value={stats.total}
          icon="📄"
          color="#3b82f6"
          bg="#eff6ff"
        />
        <StatCard
          title="Đang hiệu lực"
          value={stats.active}
          icon="✓"
          color="#10b981"
          bg="#f0fdf4"
        />
        <StatCard
          title="Hết hạn"
          value={stats.expired}
          icon="⏰"
          color="#f59e0b"
          bg="#fff7ed"
        />
        <StatCard
          title="Đã chấm dứt"
          value={stats.terminated}
          icon="✗"
          color="#ef4444"
          bg="#fef2f2"
        />
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 24, background: '#fff',
        padding: 16, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        {[
          { key: 'ALL', label: 'Tất cả', count: stats.total },
          { key: 'HIEU_LUC', label: 'Hiệu lực', count: stats.active },
          { key: 'HET_HAN', label: 'Hết hạn', count: stats.expired },
          { key: 'DA_CHAM_DUT', label: 'Đã chấm dứt', count: stats.terminated }
        ].map(tab => (
          <button
            key={tab.key}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: activeTab === tab.key ? '#3b82f6' : '#f8f9fa',
              color: activeTab === tab.key ? '#fff' : '#374151',
              fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span style={{
              background: activeTab === tab.key ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
              color: activeTab === tab.key ? '#fff' : '#6b7280',
              padding: '2px 6px', borderRadius: 10, fontSize: 11, fontWeight: 700
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Contracts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hợp đồng</CardTitle>
        </CardHeader>
        <CardBody style={{ padding: 0 }}>
          {filteredContracts.length === 0 ? (
            <div style={{ padding: 40 }}>
              <EmptyState
                icon="📄"
                title="Không có hợp đồng"
                message={activeTab === 'ALL' ? "Chưa có hợp đồng nào" : `Không có hợp đồng ở trạng thái này`}
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {viewMode === "management" && <TableHead width="20%">Nhân viên</TableHead>}
                  <TableHead width="15%">Loại hợp đồng</TableHead>
                  <TableHead width="15%">Thời hạn</TableHead>
                  <TableHead width="15%">Lương cơ bản</TableHead>
                  <TableHead width="12%">Trạng thái</TableHead>
                  <TableHead width="8%" align="center">Chi tiết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.map(contract => {
                  const contractType = getContractType(contract.loaiHopDong);
                  return (
                    <TableRow key={contract.hopdongId}>
                      {viewMode === "management" && (
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: 8,
                              background: 'linear-gradient(195deg, #42424a, #191919)',
                              color: '#fff', display: 'grid', placeItems: 'center', fontSize: 14
                            }}>
                              {contract.nhanvien?.hoTen?.charAt(0) || '?'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>
                                {contract.nhanvien?.hoTen || 'N/A'}
                              </div>
                              <div style={{ fontSize: 12, color: '#7b809a' }}>
                                {contract.nhanvien?.maNhanVien || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 16 }}>{contractType.icon}</span>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{contractType.label}</div>
                            <div style={{ fontSize: 12, color: '#7b809a' }}>
                              Số: {contract.soHopDong || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontSize: 14 }}>
                          <div>{contract.ngayBatDau}</div>
                          <div style={{ fontSize: 12, color: '#7b809a' }}>
                            đến {contract.ngayKetThuc || 'Không xác định'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontWeight: 600, color: '#16a34a' }}>
                          {formatCurrency(contract.luongCoBan)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(contract.trangThai)}</TableCell>
                      <TableCell align="center">
                        <button
                          style={{
                            border: 'none', background: '#f8f9fa', borderRadius: 8,
                            width: 32, height: 32, cursor: 'pointer', fontSize: 16,
                            color: '#344767', display: 'flex', alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={() => setSelectedContract(contract)}
                          title="Xem chi tiết"
                        >
                          👁️
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Contract Detail Modal */}
      {selectedContract && (
        <Modal isOpen={true} onClose={() => setSelectedContract(null)}>
          <ModalHeader onClose={() => setSelectedContract(null)}>
            <ModalTitle>Chi tiết Hợp đồng #{selectedContract.hopdongId}</ModalTitle>
          </ModalHeader>

          <ModalBody>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: 12, color: '#7b809a', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', display: 'block' }}>
                  Số hợp đồng
                </label>
                <div style={{ fontSize: 15, color: '#344767', fontWeight: 500 }}>
                  {selectedContract.soHopDong || 'N/A'}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: '#7b809a', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', display: 'block' }}>
                  Loại hợp đồng
                </label>
                <div style={{ fontSize: 15, color: '#344767', fontWeight: 500 }}>
                  {getContractType(selectedContract.loaiHopDong).label}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: '#7b809a', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', display: 'block' }}>
                  Ngày bắt đầu
                </label>
                <div style={{ fontSize: 15, color: '#344767', fontWeight: 500 }}>
                  {selectedContract.ngayBatDau}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: '#7b809a', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', display: 'block' }}>
                  Ngày kết thúc
                </label>
                <div style={{ fontSize: 15, color: '#344767', fontWeight: 500 }}>
                  {selectedContract.ngayKetThuc || 'Không xác định'}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: '#7b809a', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', display: 'block' }}>
                  Lương cơ bản
                </label>
                <div style={{ fontSize: 15, color: '#16a34a', fontWeight: 700 }}>
                  {formatCurrency(selectedContract.luongCoBan)}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: '#7b809a', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', display: 'block' }}>
                  Trạng thái
                </label>
                <div>{getStatusBadge(selectedContract.trangThai)}</div>
              </div>
            </div>

            {selectedContract.noiDung && (
              <div>
                <label style={{ fontSize: 12, color: '#7b809a', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', display: 'block' }}>
                  Nội dung hợp đồng
                </label>
                <div style={{
                  background: '#f8f9fa', padding: 12, borderRadius: 8, fontSize: 14, lineHeight: 1.6,
                  border: '1px solid #e9ecef', color: '#344767', maxHeight: 200, overflowY: 'auto'
                }}>
                  {selectedContract.noiDung}
                </div>
              </div>
            )}

            {/* Action buttons for personal view */}
            {viewMode === "personal" && selectedContract.trangThai === 'CHO_KY' && (
              <div style={{
                marginTop: 20, padding: 16, background: '#fff7ed', borderRadius: 12,
                border: '1px solid #ffedd5', textAlign: 'center'
              }}>
                <div style={{ fontSize: 14, color: '#c2410c', marginBottom: 12, fontWeight: 600 }}>
                  ✍️ Hợp đồng đang chờ ký
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <Button variant="success">✓ Ký hợp đồng</Button>
                  <Button variant="secondary">📄 Tải xuống</Button>
                </div>
              </div>
            )}

            {selectedContract.trangThai !== 'CHO_KY' && (
              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <Button variant="secondary">📄 Tải xuống hợp đồng</Button>
              </div>
            )}
          </ModalBody>
        </Modal>
      )}
    </PageContainer>
  );
}
