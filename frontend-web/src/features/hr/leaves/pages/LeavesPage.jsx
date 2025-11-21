import { useState, useMemo, useEffect } from 'react';
import { leavesService } from '@/features/hr/shared/services';
import { usePermissions, useErrorHandler } from '@/shared/hooks';
import { validateRequired } from '@/shared/utils/validation';
import {
  PageContainer,
  PageHeader, 
  PageTitle,
  Breadcrumb,
  FilterBar,
  SearchInput,
  Button,
  StatCard,
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
  ModalFooter,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  LoadingState,
  ErrorState,
  EmptyState,
  IconButton
} from '@/shared/components/ui';

export default function LeavesPage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { isProjectManager, isHRManager } = usePermissions();
  const { handleError } = useErrorHandler();
  
  // Determine mode: PM can approve, HR read-only
  const canApprove = isProjectManager;
  const isReadOnly = isHRManager && !isProjectManager;

  // State cho Modal
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ 
    nhanvienId: '', 
    loaiPhep: 'PHEP_NAM', 
    ngayBatDau: '', 
    ngayKetThuc: '', 
    lyDo: '' 
  });

  // Fetch leaves data
  useEffect(() => {
    fetchLeavesData();
  }, []);

  const fetchLeavesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leavesService.getAll();
      setLeaves(data || []);
    } catch (err) {
      const errorMessage = handleError(err, { context: 'load_leaves' });
      setError(errorMessage);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredLeaves = useMemo(() => {
    return leaves.filter(l => {
      const matchStatus = filterStatus === 'ALL' || l.trangThai === filterStatus;
      const matchSearch = l.hoTenNhanVien?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [leaves, filterStatus, searchTerm]);

  const stats = {
    choDuyet: leaves.filter(l => l.trangThai === 'CHO_DUYET').length,
    daDuyet: leaves.filter(l => l.trangThai === 'DA_DUYET').length,
    tuChoi: leaves.filter(l => l.trangThai === 'TU_CHOI').length,
    tongNgayPhep: leaves.filter(l => l.trangThai === 'DA_DUYET').reduce((acc, curr) => acc + (curr.soNgay || 0), 0)
  };

  const handleAction = async (action) => {
    if (!selectedLeave) return;
    
    // Validation for reject
    if (action === 'REJECT') {
      const noteError = validateRequired(approvalNote, 'Lý do từ chối');
      if (noteError) {
        alert(noteError);
        return;
      }
    }
    
    try {
      if (action === 'APPROVE') {
        await leavesService.approve(selectedLeave.nghiphepId, approvalNote || 'Approved');
        alert('✅ Đã duyệt đơn nghỉ phép!');
      } else {
        await leavesService.reject(selectedLeave.nghiphepId, approvalNote);
        alert('✅ Đã từ chối đơn!');
      }
      
      // Refresh data
      fetchLeavesData();
      setSelectedLeave(null);
      setApprovalNote('');
    } catch (err) {
      const errorMessage = handleError(err, { context: action === 'APPROVE' ? 'approve_leave' : 'reject_leave' });
      alert(errorMessage);
    }
  };

  // Helpers
  const getStatusBadge = (status) => {
    const config = {
      CHO_DUYET: { bg: '#fff7ed', color: '#c2410c', label: '⏳ Chờ duyệt', border: '#ffedd5' },
      DA_DUYET: { bg: '#f0fdf4', color: '#15803d', label: '✓ Đã duyệt', border: '#dcfce7' },
      TU_CHOI: { bg: '#fef2f2', color: '#b91c1c', label: '✗ Từ chối', border: '#fee2e2' },
    };
    const s = config[status] || config.CHO_DUYET;
    return (
      <span style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: s.bg, 
        color: s.color, 
        border: `1px solid ${s.border}`,
        padding: '6px 12px', 
        borderRadius: '20px', 
        fontSize: '12px', 
        fontWeight: 600,
        whiteSpace: 'nowrap',
        minWidth: '100px'
      }}>
        {s.label}
      </span>
    );
  };

  const getLeaveType = (type) => {
    const map = {
      PHEP_NAM: { label: 'Phép năm', icon: '🏖️' },
      OM: { label: 'Nghỉ ốm', icon: '💊' },
      KO_LUONG: { label: 'Không lương', icon: '💸' },
      KHAC: { label: 'Khác', icon: '📝' }
    };
    return map[type] || { label: type, icon: '📄' };
  };

  const handleCreateLeave = async () => {
    if (!createForm.nhanvienId || !createForm.loaiPhep || !createForm.ngayBatDau || !createForm.ngayKetThuc) {
      return alert('Vui lòng nhập đủ thông tin');
    }
    
    try {
      await leavesService.create({
        nhanvienId: Number(createForm.nhanvienId),
        loaiPhep: createForm.loaiPhep,
        ngayBatDau: createForm.ngayBatDau,
        ngayKetThuc: createForm.ngayKetThuc,
        lyDo: createForm.lyDo || ''
      });
      
      setShowCreateModal(false);
      setCreateForm({ nhanvienId: '', loaiPhep: 'PHEP_NAM', ngayBatDau: '', ngayKetThuc: '', lyDo: '' });
      fetchLeavesData();
      alert('Đã tạo đơn nghỉ phép');
    } catch (err) {
      alert('Lỗi tạo đơn: ' + (err.response?.data?.message || err.message));
    }
  };

  console.log('LeavesPage render:', { loading, error, leavesCount: leaves.length, isProjectManager, isHRManager });

  if (loading) {
    return (
      <PageContainer>
        <LoadingState message="Đang tải dữ liệu nghỉ phép..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState message={error} onRetry={fetchLeavesData} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* HEADER */}
      <PageHeader>
        <div>
          <Breadcrumb>Quản lý nhân sự / Nghỉ phép</Breadcrumb>
          <PageTitle>Quản lý Đơn Nghỉ Phép</PageTitle>
        </div>
        <Button variant="warning" onClick={() => setShowCreateModal(true)}>
          + Tạo đơn hộ
        </Button>
      </PageHeader>

      {/* HR READ-ONLY NOTICE */}
      {isReadOnly && (
        <div style={{
          background: '#eff6ff', 
          padding: 16, 
          borderRadius: 12, 
          border: '1px solid #bfdbfe',
          display: 'flex', 
          gap: 12, 
          alignItems: 'flex-start', 
          marginBottom: 24
        }}>
          <span style={{fontSize: 18}}>ℹ️</span>
          <div>
            <div style={{fontWeight: 600, color: '#3b82f6'}}>Chế độ chỉ xem</div>
            <div style={{fontSize: 13, color: '#6b7280', marginTop: 4}}>
              HR Manager chỉ có quyền xem thông tin. Để duyệt đơn, liên hệ Project Manager.
            </div>
          </div>
        </div>
      )}

      {/* STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 24 }}>
        <StatCard title="Chờ duyệt" value={stats.choDuyet} icon="⏳" color="#f59e0b" bg="#fff7ed" />
        <StatCard title="Đã duyệt tháng này" value={stats.daDuyet} icon="✓" color="#10b981" bg="#f0fdf4" />
        <StatCard title="Từ chối" value={stats.tuChoi} icon="✗" color="#ef4444" bg="#fef2f2" />
        <StatCard title="Tổng ngày nghỉ" value={stats.tongNgayPhep} icon="📅" color="#3b82f6" bg="#eff6ff" />
      </div>

      {/* FILTER BAR */}
      <FilterBar>
        <SearchInput 
          placeholder="Tìm nhân viên..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <FormSelect 
          value={filterStatus} 
          onChange={e => setFilterStatus(e.target.value)}
          style={{ minWidth: 180 }}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="CHO_DUYET">Chờ duyệt</option>
          <option value="DA_DUYET">Đã duyệt</option>
          <option value="TU_CHOI">Từ chối</option>
        </FormSelect>
      </FilterBar>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead width="25%">Nhân viên</TableHead>
            <TableHead width="15%">Loại phép</TableHead>
            <TableHead width="20%">Thời gian</TableHead>
            <TableHead width="20%">Lý do</TableHead>
            <TableHead width="12%" align="center">Trạng thái</TableHead>
            <TableHead width="8%" align="center">Xử lý</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLeaves.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <EmptyState 
                  icon="📋" 
                  title="Không có đơn nghỉ phép"
                  message="Chưa có đơn nghỉ phép nào được tạo"
                />
              </TableCell>
            </TableRow>
          ) : (
            filteredLeaves.map(leave => {
              const type = getLeaveType(leave.loaiPhep);
              return (
                <TableRow key={leave.nghiphepId}>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, 
                        background: 'linear-gradient(195deg, #42424a, #191919)',
                        color: '#fff', display: 'grid', placeItems: 'center', 
                        fontSize: 18, boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}>
                        {leave.avatar || '👤'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{leave.hoTenNhanVien}</div>
                        <div style={{ fontSize: 12, color: '#7b809a' }}>{leave.chucVu}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{type.icon}</span> {type.label}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div>{leave.ngayBatDau} ➝ {leave.ngayKetThuc}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#7b809a' }}>{leave.soNgay} ngày</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{
                      maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', 
                      textOverflow: 'ellipsis', color: '#7b809a', fontSize: 13
                    }} title={leave.lyDo}>
                      {leave.lyDo}
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    {getStatusBadge(leave.trangThai)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      onClick={() => {
                        setSelectedLeave(leave);
                        setApprovalNote(leave.ghiChuDuyet || '');
                      }}
                      title="Xem chi tiết"
                    >
                      👁️
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* MODAL CHI TIẾT / DUYỆT */}
      {selectedLeave && (
        <Modal isOpen={true} onClose={() => setSelectedLeave(null)}>
          <ModalHeader onClose={() => setSelectedLeave(null)}>
            <ModalTitle>Chi tiết Đơn nghỉ phép #{selectedLeave.nghiphepId}</ModalTitle>
          </ModalHeader>
          
          <ModalBody>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingBottom: 20, borderBottom: '1px solid #f0f2f5', marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10, 
                  background: 'linear-gradient(195deg, #42424a, #191919)',
                  color: '#fff', display: 'grid', placeItems: 'center', fontSize: 24
                }}>
                  {selectedLeave.avatar || '👤'}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{selectedLeave.hoTenNhanVien}</div>
                  <div style={{ fontSize: 12, color: '#7b809a' }}>{selectedLeave.chucVu}</div>
                </div>
              </div>
              <div>{getStatusBadge(selectedLeave.trangThai)}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: 12, color: '#7b809a', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', display: 'block' }}>
                  Loại nghỉ phép
                </label>
                <div style={{ fontSize: 15, color: '#344767', fontWeight: 500 }}>
                  {getLeaveType(selectedLeave.loaiPhep).label}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#7b809a', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', display: 'block' }}>
                  Tổng số ngày
                </label>
                <div style={{ fontSize: 15, color: '#344767', fontWeight: 500 }}>
                  {selectedLeave.soNgay} ngày
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#7b809a', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', display: 'block' }}>
                  Từ ngày
                </label>
                <div style={{ fontSize: 15, color: '#344767', fontWeight: 500 }}>
                  {selectedLeave.ngayBatDau}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#7b809a', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', display: 'block' }}>
                  Đến ngày
                </label>
                <div style={{ fontSize: 15, color: '#344767', fontWeight: 500 }}>
                  {selectedLeave.ngayKetThuc}
                </div>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 12, color: '#7b809a', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', display: 'block' }}>
                  Lý do
                </label>
                <div style={{
                  background: '#f8f9fa', padding: 12, borderRadius: 8, fontSize: 14, lineHeight: 1.5,
                  border: '1px solid #e9ecef', color: '#344767'
                }}>
                  {selectedLeave.lyDo}
                </div>
              </div>
            </div>

            {selectedLeave.trangThai === 'CHO_DUYET' && canApprove ? (
              <div style={{
                background: '#fff7ed', padding: 16, borderRadius: 12, border: '1px solid #ffedd5'
              }}>
                <FormGroup>
                  <FormLabel>Ghi chú duyệt / Lý do từ chối</FormLabel>
                  <FormTextarea 
                    placeholder="Nhập ghi chú..." 
                    value={approvalNote}
                    onChange={e => setApprovalNote(e.target.value)}
                  />
                </FormGroup>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <Button variant="danger" onClick={() => handleAction('REJECT')}>
                    ✗ Từ chối
                  </Button>
                  <Button variant="success" onClick={() => handleAction('APPROVE')}>
                    ✓ Phê duyệt
                  </Button>
                </div>
              </div>
            ) : selectedLeave.trangThai === 'CHO_DUYET' && isReadOnly ? (
              <div style={{
                background: '#eff6ff', padding: 16, borderRadius: 12, border: '1px solid #bfdbfe',
                display: 'flex', gap: 12, alignItems: 'flex-start'
              }}>
                <span style={{fontSize: 18}}>ℹ️</span>
                <div>
                  <div style={{fontWeight: 600, color: '#3b82f6'}}>Chỉ xem thông tin</div>
                  <div style={{fontSize: 13, color: '#6b7280', marginTop: 4}}>
                    HR Manager chỉ có quyền xem, không duyệt. Đơn này đang chờ PM duyệt.
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: '#f8f9fa', padding: 16, borderRadius: 8, border: '1px solid #e9ecef'
              }}>
                <div style={{ fontSize: 13, marginBottom: 6, color: '#344767' }}>
                  <span style={{ fontWeight: 600, marginRight: 6, color: '#7b809a' }}>Người duyệt:</span> 
                  {selectedLeave.tenNguoiDuyet || 'N/A'}
                </div>
                <div style={{ fontSize: 13, marginBottom: 6, color: '#344767' }}>
                  <span style={{ fontWeight: 600, marginRight: 6, color: '#7b809a' }}>Thời gian:</span> 
                  {selectedLeave.ngayDuyet ? new Date(selectedLeave.ngayDuyet).toLocaleString() : '-'}
                </div>
                {selectedLeave.ghiChuDuyet && (
                  <div style={{ fontSize: 13, marginBottom: 6, color: '#344767' }}>
                    <span style={{ fontWeight: 600, marginRight: 6, color: '#7b809a' }}>Ghi chú:</span> 
                    {selectedLeave.ghiChuDuyet}
                  </div>
                )}
              </div>
            )}
          </ModalBody>
        </Modal>
      )}

      {/* MODAL TẠO ĐƠN */}
      {showCreateModal && (
        <Modal isOpen={true} onClose={() => setShowCreateModal(false)}>
          <ModalHeader onClose={() => setShowCreateModal(false)}>
            <ModalTitle>Tạo đơn nghỉ phép mới</ModalTitle>
          </ModalHeader>
          
          <ModalBody>
            <FormGroup>
              <FormLabel required>Mã nhân viên</FormLabel>
              <FormInput 
                placeholder="Nhập mã nhân viên" 
                value={createForm.nhanvienId}
                onChange={(e) => setCreateForm({...createForm, nhanvienId: e.target.value})}
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel required>Loại phép</FormLabel>
              <FormSelect 
                value={createForm.loaiPhep}
                onChange={(e) => setCreateForm({...createForm, loaiPhep: e.target.value})}
              >
                <option value="PHEP_NAM">Phép năm</option>
                <option value="OM">Nghỉ ốm</option>
                <option value="KO_LUONG">Không lương</option>
                <option value="KHAC">Khác</option>
              </FormSelect>
            </FormGroup>
            
            <FormGroup>
              <FormLabel required>Từ ngày</FormLabel>
              <FormInput 
                type="date"
                value={createForm.ngayBatDau}
                onChange={(e) => setCreateForm({...createForm, ngayBatDau: e.target.value})}
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel required>Đến ngày</FormLabel>
              <FormInput 
                type="date"
                value={createForm.ngayKetThuc}
                onChange={(e) => setCreateForm({...createForm, ngayKetThuc: e.target.value})}
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Lý do</FormLabel>
              <FormTextarea 
                placeholder="Nhập lý do nghỉ"
                value={createForm.lyDo}
                onChange={(e) => setCreateForm({...createForm, lyDo: e.target.value})}
              />
            </FormGroup>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Hủy
            </Button>
            <Button variant="success" onClick={handleCreateLeave}>
              Tạo đơn
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </PageContainer>
  );
}
