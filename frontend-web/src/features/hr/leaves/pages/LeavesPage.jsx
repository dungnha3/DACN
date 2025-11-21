import { useState, useMemo, useEffect } from 'react';
import { leavesService } from '@/features/hr/shared/services';
import { usePermissions, useErrorHandler } from '@/shared/hooks';
import { validateRequired } from '@/shared/utils/validation';

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
  const [createForm, setCreateForm] = useState({ nhanvienId: '', loaiPhep: 'PHEP_NAM', ngayBatDau: '', ngayKetThuc: '', lyDo: '' });

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

  // --- LOGIC ---
  const filteredLeaves = useMemo(() => {
    return leaves.filter(l => {
      const matchStatus = filterStatus === 'ALL' || l.trangThai === filterStatus;
      const matchSearch = l.hoTenNhanVien.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [leaves, filterStatus, searchTerm]);

  const stats = {
    choDuyet: leaves.filter(l => l.trangThai === 'CHO_DUYET').length,
    daDuyet: leaves.filter(l => l.trangThai === 'DA_DUYET').length,
    tuChoi: leaves.filter(l => l.trangThai === 'TU_CHOI').length,
    tongNgayPhep: leaves.filter(l => l.trangThai === 'DA_DUYET').reduce((acc, curr) => acc + curr.soNgay, 0)
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
        display: 'inline-flex', // FIX: Dùng Flexbox để căn giữa
        alignItems: 'center',
        justifyContent: 'center',
        background: s.bg, 
        color: s.color, 
        border: `1px solid ${s.border}`,
        padding: '6px 12px', 
        borderRadius: '20px', 
        fontSize: '12px', 
        fontWeight: 600,
        whiteSpace: 'nowrap', // FIX: Ngăn xuống dòng
        minWidth: '100px' // FIX: Độ rộng tối thiểu để đều nhau
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

  return (
    <div style={s.container}>
      {/* HEADER */}
      <div style={s.headerWrapper}>
        <div>
          <div style={s.breadcrumb}>Quản lý nhân sự / Nghỉ phép</div>
          <h1 style={s.pageTitle}>Quản lý Đơn Nghỉ Phép</h1>
        </div>
        <button style={s.btnAdd} onClick={() => setShowCreateModal(true)}>
          <span style={{marginRight: 6}}>+</span> Tạo đơn hộ
        </button>
      </div>

      {/* STATS CARDS */}
      <div style={s.statsGrid}>
        <StatCard title="Chờ duyệt" value={stats.choDuyet} icon="⏳" color="#f59e0b" bg="#fff7ed" />
        <StatCard title="Đã duyệt tháng này" value={stats.daDuyet} icon="✓" color="#10b981" bg="#f0fdf4" />
        <StatCard title="Từ chối" value={stats.tuChoi} icon="✗" color="#ef4444" bg="#fef2f2" />
        <StatCard title="Tổng ngày nghỉ" value={stats.tongNgayPhep} icon="📅" color="#3b82f6" bg="#eff6ff" />
      </div>

      {/* FILTER BAR */}
      <div style={s.filterBar}>
        <div style={s.searchWrapper}>
          <span style={s.searchIcon}>🔍</span>
          <input 
            style={s.searchInput} 
            placeholder="Tìm nhân viên..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          style={s.filterSelect} 
          value={filterStatus} 
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="CHO_DUYET">Chờ duyệt</option>
          <option value="DA_DUYET">Đã duyệt</option>
          <option value="TU_CHOI">Từ chối</option>
        </select>
      </div>

      {/* TABLE CARD */}
      <div style={s.tableCard}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={{...s.th, width: '25%'}}>Nhân viên</th>
              <th style={{...s.th, width: '15%'}}>Loại phép</th>
              <th style={{...s.th, width: '20%'}}>Thời gian</th>
              <th style={{...s.th, width: '20%'}}>Lý do</th>
              <th style={{...s.th, width: '12%', textAlign: 'center'}}>Trạng thái</th>
              <th style={{...s.th, width: '8%', textAlign: 'center'}}>Xử lý</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map(leave => {
              const type = getLeaveType(leave.loaiPhep);
              return (
                <tr key={leave.nghiphepId} style={s.tr}>
                  <td style={s.td}>
                    <div style={s.profileCell}>
                      <div style={s.avatarBox}>{leave.avatar}</div>
                      <div>
                        <div style={s.empName}>{leave.hoTenNhanVien}</div>
                        <div style={s.empRole}>{leave.chucVu}</div>
                      </div>
                    </div>
                  </td>
                  <td style={s.td}>
                    <div style={s.typeBadge}>
                      <span>{type.icon}</span> {type.label}
                    </div>
                  </td>
                  <td style={s.td}>
                    <div style={s.dateCell}>
                      <div>{leave.ngayBatDau} ➝ {leave.ngayKetThuc}</div>
                      <div style={s.daysCount}>{leave.soNgay} ngày</div>
                    </div>
                  </td>
                  <td style={s.td}>
                    <div style={s.reasonText} title={leave.lyDo}>{leave.lyDo}</div>
                  </td>
                  <td style={{...s.td, textAlign: 'center'}}>
                    {getStatusBadge(leave.trangThai)}
                  </td>
                  <td style={{...s.td, textAlign: 'center'}}>
                    <button 
                      style={s.actionBtn} 
                      onClick={() => {
                        setSelectedLeave(leave);
                        setApprovalNote(leave.ghiChuDuyet || '');
                      }}
                      title="Xem chi tiết"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL DUYỆT ĐƠN / CHI TIẾT */}
      {selectedLeave && (
        <div style={s.modalOverlay} onClick={() => setSelectedLeave(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>Chi tiết Đơn nghỉ phép #{selectedLeave.nghiphepId}</h3>
              <button style={s.closeBtn} onClick={() => setSelectedLeave(null)}>×</button>
            </div>
            
            <div style={s.modalBody}>
              <div style={s.infoSection}>
                <div style={s.profileCell}>
                  <div style={{...s.avatarBox, width: 48, height: 48, fontSize: 24}}>{selectedLeave.avatar}</div>
                  <div>
                    <div style={{...s.empName, fontSize: 16}}>{selectedLeave.hoTenNhanVien}</div>
                    <div style={s.empRole}>{selectedLeave.chucVu}</div>
                  </div>
                </div>
                <div style={s.statusBig}>{getStatusBadge(selectedLeave.trangThai)}</div>
              </div>

              <div style={s.detailGrid}>
                <div style={s.detailItem}>
                  <label style={s.detailLabel}>Loại nghỉ phép</label>
                  <div style={s.detailValue}>{getLeaveType(selectedLeave.loaiPhep).label}</div>
                </div>
                <div style={s.detailItem}>
                  <label style={s.detailLabel}>Tổng số ngày</label>
                  <div style={s.detailValue}>{selectedLeave.soNgay} ngày</div>
                </div>
                <div style={s.detailItem}>
                  <label style={s.detailLabel}>Từ ngày</label>
                  <div style={s.detailValue}>{selectedLeave.ngayBatDau}</div>
                </div>
                <div style={s.detailItem}>
                  <label style={s.detailLabel}>Đến ngày</label>
                  <div style={s.detailValue}>{selectedLeave.ngayKetThuc}</div>
                </div>
                <div style={{...s.detailItem, gridColumn: '1/-1'}}>
                  <label style={s.detailLabel}>Lý do</label>
                  <div style={s.reasonBox}>{selectedLeave.lyDo}</div>
                </div>
              </div>

              {selectedLeave.trangThai === 'CHO_DUYET' && canApprove ? (
                <div style={s.approvalSection}>
                  <label style={s.detailLabel}>Ghi chú duyệt / Lý do từ chối</label>
                  <textarea 
                    style={s.noteInput} 
                    placeholder="Nhập ghi chú..." 
                    value={approvalNote}
                    onChange={e => setApprovalNote(e.target.value)}
                  />
                  <div style={s.approvalActions}>
                    <button style={s.btnReject} onClick={() => handleAction('REJECT')}>✗ Từ chối</button>
                    <button style={s.btnApprove} onClick={() => handleAction('APPROVE')}>✓ Phê duyệt</button>
                  </div>
                </div>
              ) : selectedLeave.trangThai === 'CHO_DUYET' && isReadOnly ? (
                <div style={s.readOnlyNotice}>
                  <span style={{fontSize: 18}}>ℹ️</span>
                  <div>
                    <div style={{fontWeight: 600, color: '#3b82f6'}}>Chỉ xem thông tin</div>
                    <div style={{fontSize: 13, color: '#6b7280', marginTop: 4}}>
                      HR Manager chỉ có quyền xem, không duyệt. Đơn này đang chờ PM duyệt.
                    </div>
                  </div>
                </div>
              ) : (
                <div style={s.historySection}>
                  <div style={s.historyItem}>
                    <span style={s.historyLabel}>Người duyệt:</span> {selectedLeave.tenNguoiDuyet || 'N/A'}
                  </div>
                  <div style={s.historyItem}>
                    <span style={s.historyLabel}>Thời gian:</span> {selectedLeave.ngayDuyet ? new Date(selectedLeave.ngayDuyet).toLocaleString() : '-'}
                  </div>
                  {selectedLeave.ghiChuDuyet && (
                    <div style={s.historyItem}>
                      <span style={s.historyLabel}>Ghi chú:</span> {selectedLeave.ghiChuDuyet}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL TẠO ĐƠN */}
      {showCreateModal && (
        <div style={s.modalOverlay}>
          <div style={{...s.modal, maxWidth: 500}}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>Tạo đơn nghỉ phép mới</h3>
              <button style={s.closeBtn} onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div style={s.modalBody}>
              <div style={{display:'grid', gap:12}}>
                <div style={s.formGroup}>
                  <label style={s.label}>Mã nhân viên</label>
                  <input 
                    style={s.input} 
                    placeholder="Nhập mã nhân viên" 
                    value={createForm.nhanvienId}
                    onChange={(e)=>setCreateForm({...createForm, nhanvienId:e.target.value})}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Loại phép</label>
                  <select 
                    style={s.select}
                    value={createForm.loaiPhep}
                    onChange={(e)=>setCreateForm({...createForm, loaiPhep:e.target.value})}
                  >
                    <option value="PHEP_NAM">Phép năm</option>
                    <option value="OM">Nghỉ ốm</option>
                    <option value="KO_LUONG">Không lương</option>
                    <option value="KHAC">Khác</option>
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Từ ngày</label>
                  <input 
                    style={s.input} 
                    type="date"
                    value={createForm.ngayBatDau}
                    onChange={(e)=>setCreateForm({...createForm, ngayBatDau:e.target.value})}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Đến ngày</label>
                  <input 
                    style={s.input} 
                    type="date"
                    value={createForm.ngayKetThuc}
                    onChange={(e)=>setCreateForm({...createForm, ngayKetThuc:e.target.value})}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Lý do</label>
                  <textarea 
                    style={{...s.input, minHeight: 80}} 
                    placeholder="Nhập lý do nghỉ"
                    value={createForm.lyDo}
                    onChange={(e)=>setCreateForm({...createForm, lyDo:e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div style={{padding: 20, display: 'flex', justifyContent: 'flex-end', gap:12}}>
               <button style={s.btnCancel} onClick={() => setShowCreateModal(false)}>Hủy</button>
               <button 
                 style={s.btnApprove} 
                 onClick={async ()=>{
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
                     setCreateForm({ nhanvienId:'', loaiPhep:'PHEP_NAM', ngayBatDau:'', ngayKetThuc:'', lyDo:'' });
                     fetchLeavesData();
                     alert('Đã tạo đơn nghỉ phép');
                   } catch (err) {
                     alert('Lỗi tạo đơn: ' + (err.response?.data?.message || err.message));
                   }
                 }}
               >Tạo đơn</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }) {
  return (
    <div style={{...s.statCard, background: bg, borderColor: color + '40'}}>
      <div style={s.statHeader}>
        <span style={s.statTitle}>{title}</span>
        <span style={{...s.statIcon, color: color}}>{icon}</span>
      </div>
      <div style={{...s.statValue, color: color}}>{value}</div>
    </div>
  );
}

// --- STYLES ---
const s = {
  container: {
    padding: '24px 32px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#344767'
  },
  headerWrapper: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24
  },
  breadcrumb: {
    fontSize: 13, color: '#7b809a', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase'
  },
  pageTitle: {
    fontSize: 28, fontWeight: 700, margin: 0, color: '#344767'
  },
  btnAdd: {
    background: 'linear-gradient(195deg, #fb8c00, #ffa726)',
    color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px',
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(251, 140, 0, 0.2)', display: 'flex', alignItems: 'center'
  },
  
  // Stats
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 24
  },
  statCard: {
    padding: 20, borderRadius: 16, border: '1px solid', display: 'flex', flexDirection: 'column'
  },
  statHeader: {
    display: 'flex', justifyContent: 'space-between', marginBottom: 10
  },
  statTitle: {
    fontSize: 13, fontWeight: 600, color: '#67748e', textTransform: 'uppercase'
  },
  statIcon: { fontSize: 18 },
  statValue: { fontSize: 28, fontWeight: 700 },

  // Filter
  filterBar: {
    display: 'flex', gap: 16, marginBottom: 24, background: '#fff', padding: 16,
    borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
  },
  searchWrapper: {
    flex: 1, position: 'relative', display: 'flex', alignItems: 'center'
  },
  searchIcon: { position: 'absolute', left: 12, color: '#7b809a' },
  searchInput: {
    width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #d2d6da',
    borderRadius: 8, outline: 'none', fontSize: 14, background: '#fff', color: '#344767'
  },
  filterSelect: {
    padding: '12px 16px', border: '1px solid #d2d6da', borderRadius: 8,
    outline: 'none', fontSize: 14, minWidth: 180, cursor: 'pointer', color: '#344767', background: '#fff'
  },

  // Table
  tableCard: {
    background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    overflow: 'hidden', border: '1px solid rgba(0,0,0,0.02)'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 700,
    color: '#7b809a', textTransform: 'uppercase', borderBottom: '1px solid #f0f2f5', background: '#fff'
  },
  tr: { borderBottom: '1px solid #f0f2f5' },
  td: { padding: '16px 24px', fontSize: 14, verticalAlign: 'middle', color: '#344767' },
  
  // Cells
  profileCell: { display: 'flex', alignItems: 'center', gap: 12 },
  avatarBox: {
    width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(195deg, #42424a, #191919)',
    color: '#fff', display: 'grid', placeItems: 'center', fontSize: 18, boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  empName: { fontWeight: 600, fontSize: 14 },
  empRole: { fontSize: 12, color: '#7b809a' },
  typeBadge: { fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 },
  dateCell: { display: 'flex', flexDirection: 'column', gap: 2 },
  daysCount: { fontSize: 12, fontWeight: 600, color: '#7b809a' },
  reasonText: {
    maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#7b809a', fontSize: 13
  },
  
  // FIX: Action Button Style
  actionBtn: {
    display: 'inline-flex', // Flexbox để căn giữa icon
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none', 
    background: '#f8f9fa', 
    borderRadius: 8, 
    width: 32, 
    height: 32, 
    cursor: 'pointer',
    fontSize: 16, 
    color: '#344767', 
    transition: 'all 0.2s'
  },

  // Modal
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modal: {
    background: '#fff', borderRadius: 16, width: 600, maxWidth: '95%',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', animation: 'fadeIn 0.3s'
  },
  modalHeader: {
    padding: '20px 24px', borderBottom: '1px solid #f0f2f5',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: '#344767' },
  closeBtn: { border: 'none', background: 'none', fontSize: 24, color: '#7b809a', cursor: 'pointer' },
  modalBody: { padding: 24 },
  infoSection: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: 20, borderBottom: '1px solid #f0f2f5', marginBottom: 20
  },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 },
  detailItem: {},
  detailLabel: { fontSize: 12, color: '#7b809a', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' },
  detailValue: { fontSize: 15, color: '#344767', fontWeight: 500 },
  reasonBox: {
    background: '#f8f9fa', padding: 12, borderRadius: 8, fontSize: 14, lineHeight: 1.5,
    border: '1px solid #e9ecef', color: '#344767'
  },
  
  approvalSection: {
    background: '#fff7ed', padding: 16, borderRadius: 12, border: '1px solid #ffedd5'
  },
  noteInput: {
    width: '100%', padding: 12, borderRadius: 8, border: '1px solid #fdba74',
    marginBottom: 16, outline: 'none', fontSize: 14, boxSizing: 'border-box', minHeight: 80,
    background: '#fff', color: '#344767', fontWeight: 600
  },
  approvalActions: { display: 'flex', gap: 12, justifyContent: 'flex-end' },
  btnReject: {
    padding: '10px 20px', border: 'none', background: '#fee2e2', color: '#991b1b',
    borderRadius: 8, fontWeight: 600, cursor: 'pointer'
  },
  btnApprove: {
    padding: '10px 20px', border: 'none', background: 'linear-gradient(195deg, #66bb6a, #43a047)',
    color: '#fff', borderRadius: 8, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  historySection: {
    background: '#f8f9fa', padding: 16, borderRadius: 8, border: '1px solid #e9ecef'
  },
  historyItem: { fontSize: 13, marginBottom: 6, color: '#344767' },
  historyLabel: { fontWeight: 600, marginRight: 6, color: '#7b809a' },
  
  // Read-only notice for HR
  readOnlyNotice: {
    background: '#eff6ff', padding: 16, borderRadius: 12, border: '1px solid #bfdbfe',
    display: 'flex', gap: 12, alignItems: 'flex-start'
  },
  
  // Form elements
  formGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: 600, color: '#344767', marginBottom: 8, display: 'block' },
  input: {
    width: '100%', padding: 12, border: '1px solid #d2d6da', borderRadius: 8,
    outline: 'none', fontSize: 14, boxSizing: 'border-box', color: '#344767', background: '#fff'
  },
  select: {
    width: '100%', padding: 12, border: '1px solid #d2d6da', borderRadius: 8,
    outline: 'none', fontSize: 14, boxSizing: 'border-box', color: '#344767', background: '#fff', cursor: 'pointer'
  },
  btnCancel: {
    padding: '10px 20px', border: 'none', background: '#f0f2f5', color: '#7b809a',
    borderRadius: 8, fontWeight: 600, cursor: 'pointer'
  },
  statusBig: {}
};