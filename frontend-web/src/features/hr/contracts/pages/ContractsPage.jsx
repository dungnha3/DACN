import { useState, useMemo, useEffect } from 'react';
import { contractsService, employeesService } from '@/features/hr/shared/services';
import { usePermissions, useErrorHandler } from '@/shared/hooks';
import { validateRequired, validateDateRange } from '@/shared/utils/validation';

export default function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('HIEU_LUC');
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [newEndDate, setNewEndDate] = useState('');
  const [formData, setFormData] = useState({
    nhanvienId: '',
    loaiHopDong: 'THU_VIEC',
    ngayBatDau: new Date().toISOString().split('T')[0],
    ngayKetThuc: '',
    luongCoBan: '',
    noiDung: ''
  });

  const { isHRManager } = usePermissions();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [contractsData, employeesData] = await Promise.all([
        contractsService.getAll(),
        employeesService.getAll()
      ]);
      setContracts(contractsData);
      setEmployees(employeesData);
    } catch (err) {
      const errorMessage = handleError(err, { context: 'load_contracts' });
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const filteredContracts = useMemo(() => {
    if (activeTab === 'TAT_CA') return contracts;
    return contracts.filter(c => c.trangThai === activeTab);
  }, [contracts, activeTab]);

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.trangThai === 'HIEU_LUC').length,
    expiring: contracts.filter(c => c.trangThai === 'HIEU_LUC' && c.soNgayConLai <= 90 && c.soNgayConLai > 0).length,
  };

  // --- HANDLERS ---
  const handleRenew = (contract) => {
    setSelectedContract(contract);
    setNewEndDate(contract.ngayKetThuc || ''); // Set ngày kết thúc cũ làm mặc định
    setShowRenewModal(true);
  };

  const handleConfirmRenew = async () => {
    if (!newEndDate) return alert("Vui lòng chọn ngày kết thúc mới!");
    
    try {
      setLoading(true);
      await contractsService.renew(selectedContract.hopdongId, newEndDate);
      await loadData();
      setShowRenewModal(false);
      alert(`✅ Đã gia hạn hợp đồng thành công đến ${newEndDate}`);
    } catch (err) {
      const errorMessage = handleError(err, { context: 'renew_contract' });
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if(confirm('Bạn có chắc chắn muốn HỦY hợp đồng này? Thao tác không thể hoàn tác.')) {
      try {
        setLoading(true);
        await contractsService.cancel(id);
        await loadData();
        alert('✅ Hủy hợp đồng thành công!');
      } catch (err) {
        const errorMessage = handleError(err, { context: 'cancel_contract' });
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateContract = async () => {
    // Validation
    const errors = [];
    
    const empError = validateRequired(formData.nhanvienId, 'Nhân viên');
    if (empError) errors.push(empError);
    
    const startDateError = validateRequired(formData.ngayBatDau, 'Ngày bắt đầu');
    if (startDateError) errors.push(startDateError);
    
    if (formData.loaiHopDong !== 'VO_THOI_HAN') {
      const endDateError = validateRequired(formData.ngayKetThuc, 'Ngày kết thúc');
      if (endDateError) errors.push(endDateError);
      
      if (formData.ngayBatDau && formData.ngayKetThuc) {
        const dateRangeError = validateDateRange(formData.ngayBatDau, formData.ngayKetThuc);
        if (dateRangeError) errors.push(dateRangeError);
      }
    }
    
    const salaryError = validateRequired(formData.luongCoBan, 'Lương cơ bản');
    if (salaryError) errors.push(salaryError);
    else if (Number(formData.luongCoBan) <= 0) errors.push('Lương cơ bản phải lớn hơn 0');
    
    if (errors.length > 0) {
      return alert(errors.join('\n'));
    }
    
    try {
      setLoading(true);
      await contractsService.create({
        ...formData,
        nhanvienId: Number(formData.nhanvienId),
        luongCoBan: Number(formData.luongCoBan)
      });
      await loadData();
      setShowCreateModal(false);
      // Reset form
      setFormData({
        nhanvienId: '',
        loaiHopDong: 'THU_VIEC',
        ngayBatDau: new Date().toISOString().split('T')[0],
        ngayKetThuc: '',
        luongCoBan: '',
        noiDung: ''
      });
      alert('✅ Tạo hợp đồng thành công!');
    } catch (err) {
      const errorMessage = handleError(err, { context: 'create_contract' });
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- BADGE RENDERERS ---
  const getContractStatusBadge = (status, daysRemaining) => {
    const isExpiring = daysRemaining !== null && daysRemaining <= 90 && daysRemaining > 0;
    
    const config = {
      HIEU_LUC: { label: 'Đang hiệu lực', color: '#059669', bg: '#ecfdf5', icon: '✓' },
      HET_HAN: { label: 'Đã hết hạn', color: '#f97316', bg: '#fff7ed', icon: '✗' },
      BI_HUY: { label: 'Đã hủy', color: '#dc2626', bg: '#fef2f2', icon: '🚫' },
    };
    
    const statusStyle = config[status];

    return (
      <span style={{
        ...s.statusBadge, 
        background: statusStyle.bg, 
        color: statusStyle.color,
        // Cảnh báo hết hạn
        ...(isExpiring ? { background: '#fef3c7', color: '#c2410c', border: '1px solid #fcd34d' } : {})
      }}>
        {isExpiring ? `⚠️ Sắp hết (${daysRemaining} ngày)` : `${statusStyle.icon} ${statusStyle.label}`}
      </span>
    );
  };

  const getContractTypeBadge = (type) => {
    const types = {
      THU_VIEC: { label: 'Thử việc', color: '#f59e0b', icon: '📝' },
      XAC_DINH: { label: 'Xác định T.Hạn', color: '#3b82f6', icon: '📋' },
      VO_THOI_HAN: { label: 'Vô thời hạn', color: '#10b981', icon: '📜' },
    };
    const t = types[type] || types.THU_VIEC;
    return <span style={{ color: t.color, fontWeight: 600 }}>{t.icon} {t.label}</span>;
  };

  // Permission guard
  if (!isHRManager) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <div style={{ fontSize: '20px', fontWeight: '600', color: '#ef4444' }}>Không có quyền truy cập</div>
        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>Chỉ HR Manager mới có quyền quản lý hợp đồng</div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      {/* HEADER */}
      <div style={s.headerWrapper}>
        <div>
          <div style={s.breadcrumb}>Quản lý nhân sự / Hợp đồng</div>
          <h1 style={s.pageTitle}>Quản lý Hợp Đồng</h1>
          <p style={s.subtitle}>{stats.active} hợp đồng đang hiệu lực, {stats.expiring} sắp hết hạn</p>
        </div>
        <button style={s.btnAdd} onClick={() => setShowCreateModal(true)}>
          <span style={{marginRight: 6}}>+</span> Tạo hợp đồng mới
        </button>
      </div>

      {/* TABS */}
      <div style={s.tabsContainer}>
        {['HIEU_LUC', 'HET_HAN', 'BI_HUY'].map(tab => (
          <button 
            key={tab} 
            style={{...s.tabBtn, ...(activeTab === tab ? s.tabBtnActive : {})}}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'HIEU_LUC' ? `Đang hiệu lực (${stats.active})` : tab === 'HET_HAN' ? 'Đã hết hạn' : 'Đã hủy'}
          </button>
        ))}
      </div>

      {/* TABLE CARD */}
      <div style={s.tableCard}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={{...s.th, width: '20%'}}>Nhân viên</th>
              <th style={{...s.th, width: '15%'}}>Loại HĐ</th>
              <th style={{...s.th, width: '10%'}}>Bắt đầu</th>
              <th style={{...s.th, width: '10%'}}>Kết thúc</th>
              <th style={{...s.th, width: '15%'}}>Lương cơ bản</th>
              <th style={{...s.th, width: '15%', textAlign: 'center'}}>Trạng thái</th>
              <th style={{...s.th, width: '15%', textAlign: 'center'}}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredContracts.map(c => {
              const isExpiringSoon = c.soNgayConLai !== null && c.soNgayConLai <= 90 && c.soNgayConLai > 0 && c.trangThai === 'HIEU_LUC';
              const isPermanent = c.loaiHopDong === 'VO_THOI_HAN';
              
              return (
                <tr key={c.hopdongId} style={{...s.tr, ...(isExpiringSoon ? s.trExpiring : {})}}>
                  <td style={s.td}>
                    <div style={s.profileCell}>
                      <div style={s.avatarBox}>{c.avatar || '👤'}</div>
                      <div>
                        <div style={s.empName}>{c.nhanVien}</div>
                        <div style={s.empRole}>{c.chucVu}</div>
                      </div>
                    </div>
                  </td>
                  <td style={s.td}>
                    {getContractTypeBadge(c.loaiHopDong)}
                  </td>
                  <td style={s.td}>{c.ngayBatDau}</td>
                  <td style={s.td}>
                    <div style={isPermanent ? s.permanentLabel : {}}>
                       {c.ngayKetThuc || 'Vô thời hạn'}
                    </div>
                  </td>
                  <td style={s.td}>
                    <span style={s.salaryText}>{formatCurrency(c.luongCoBan)}</span>
                  </td>
                  <td style={{...s.td, textAlign: 'center'}}>
                    {getContractStatusBadge(c.trangThai, c.soNgayConLai)}
                  </td>
                  <td style={s.tdActions}>
                    <div style={s.actionGroup}>
                       {/* Nút gia hạn chỉ hiện khi đang hiệu lực và không vô thời hạn */}
                      {c.trangThai === 'HIEU_LUC' && !isPermanent && (
                        <button 
                          style={s.renewBtn} 
                          onClick={() => handleRenew(c)} 
                          title="Gia hạn hợp đồng"
                        >
                          🔄
                        </button>
                      )}
                      {/* Nút hủy hợp đồng */}
                      {c.trangThai === 'HIEU_LUC' && (
                        <button 
                          style={s.cancelBtn} 
                          onClick={() => handleCancel(c.hopdongId)} 
                          title="Hủy hợp đồng"
                        >
                          🚫
                        </button>
                      )}
                       {/* Nút xem chi tiết (luôn có) */}
                      <button style={s.viewBtn} title="Xem chi tiết">👁️</button>
                    </div>
                  </td>
                </tr>
              )}
            )}
          </tbody>
        </table>
        {filteredContracts.length === 0 && (
          <div style={s.emptyState}>Không tìm thấy hợp đồng nào trong trạng thái này.</div>
        )}
      </div>

      {/* MODAL TẠO HỢP ĐỒNG MỚI */}
      {showCreateModal && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>Tạo hợp đồng mới</h3>
              <button style={s.closeBtn} onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div style={s.modalBody}>
              <div style={s.formGroup}>
                <label style={s.label}>Nhân viên <span style={{color:'red'}}>*</span></label>
                <select
                  style={s.input}
                  value={formData.nhanvienId}
                  onChange={(e) => setFormData({...formData, nhanvienId: e.target.value})}
                >
                  <option value="">-- Chọn nhân viên --</option>
                  {employees.map(emp => (
                    <option key={emp.nhanvienId} value={emp.nhanvienId}>
                      {emp.hoTen} - {emp.maNhanVien || `NV${emp.nhanvienId}`}
                    </option>
                  ))}
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Loại hợp đồng <span style={{color:'red'}}>*</span></label>
                <select
                  style={s.input}
                  value={formData.loaiHopDong}
                  onChange={(e) => {
                    setFormData({...formData, loaiHopDong: e.target.value});
                    // Nếu chọn vô thời hạn, xóa ngày kết thúc
                    if (e.target.value === 'VO_THOI_HAN') {
                      setFormData(prev => ({...prev, loaiHopDong: e.target.value, ngayKetThuc: ''}));
                    }
                  }}
                >
                  <option value="THU_VIEC">Thử việc</option>
                  <option value="XAC_DINH">Xác định thời hạn</option>
                  <option value="VO_THOI_HAN">Vô thời hạn</option>
                </select>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                <div style={s.formGroup}>
                  <label style={s.label}>Ngày bắt đầu <span style={{color:'red'}}>*</span></label>
                  <input
                    type="date"
                    style={s.input}
                    value={formData.ngayBatDau}
                    onChange={(e) => setFormData({...formData, ngayBatDau: e.target.value})}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Ngày kết thúc {formData.loaiHopDong !== 'VO_THOI_HAN' && <span style={{color:'red'}}>*</span>}</label>
                  <input
                    type="date"
                    style={s.input}
                    value={formData.ngayKetThuc}
                    onChange={(e) => setFormData({...formData, ngayKetThuc: e.target.value})}
                    disabled={formData.loaiHopDong === 'VO_THOI_HAN'}
                    min={formData.ngayBatDau}
                  />
                </div>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Lương cơ bản <span style={{color:'red'}}>*</span></label>
                <input
                  type="number"
                  style={s.input}
                  value={formData.luongCoBan}
                  onChange={(e) => setFormData({...formData, luongCoBan: e.target.value})}
                  placeholder="VD: 10000000"
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Nội dung hợp đồng</label>
                <textarea
                  style={{...s.input, minHeight: 80, fontFamily: 'inherit', resize: 'vertical'}}
                  value={formData.noiDung}
                  onChange={(e) => setFormData({...formData, noiDung: e.target.value})}
                  placeholder="Mô tả chi tiết nội dung hợp đồng..."
                />
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.btnCancel} onClick={() => setShowCreateModal(false)}>Hủy</button>
              <button style={s.btnSave} onClick={handleCreateContract}>Tạo hợp đồng</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GIA HẠN */}
      {showRenewModal && selectedContract && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>Gia hạn Hợp đồng #{selectedContract.hopdongId}</h3>
              <button style={s.closeBtn} onClick={() => setShowRenewModal(false)}>×</button>
            </div>
            <div style={s.modalBody}>
              <div style={s.renewInfo}>
                Đang gia hạn cho <b>{selectedContract.nhanVien}</b> ({selectedContract.loaiHopDong})
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Ngày kết thúc hiện tại</label>
                <input style={s.inputDisabled} value={selectedContract.ngayKetThuc} disabled />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Ngày kết thúc MỚI <span style={{color:'red'}}>*</span></label>
                <input 
                  type="date" 
                  style={s.input} 
                  value={newEndDate} 
                  onChange={e => setNewEndDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // Không cho chọn ngày trong quá khứ
                />
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.btnCancel} onClick={() => setShowRenewModal(false)}>Hủy</button>
              <button style={s.btnSave} onClick={handleConfirmRenew}>Xác nhận Gia hạn</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- STYLES ---
const s = {
  container: { padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#344767' },
  headerWrapper: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  breadcrumb: { fontSize: 13, color: '#7b809a', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' },
  pageTitle: { fontSize: 28, fontWeight: 700, margin: 0, color: '#344767' },
  subtitle: { fontSize: 14, color: '#7b809a', margin: '4px 0 0 0' },
  btnAdd: { 
    background: 'linear-gradient(195deg, #3b82f6, #2563eb)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px',
    fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center'
  },

  // Tabs
  tabsContainer: { display: 'flex', marginBottom: 24, padding: '4px', background: '#e9ecef', borderRadius: 10, maxWidth: 600 },
  tabBtn: { 
    flex: 1, padding: '10px 15px', border: 'none', background: 'transparent', borderRadius: 8, 
    color: '#7b809a', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: 14 
  },
  tabBtnActive: { 
    background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', color: '#344767' 
  },

  // Table
  tableCard: { background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.02)' },
  table: { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' },
  th: { padding: '16px 12px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#7b809a', textTransform: 'uppercase', borderBottom: '1px solid #f0f2f5', background: '#fff' },
  tr: { borderBottom: '1px solid #f0f2f5' },
  trExpiring: { background: '#fff9e6', color: '#c2410c' }, // Cảnh báo sắp hết hạn
  td: { padding: '14px 12px', fontSize: 14, verticalAlign: 'middle', color: '#344767', overflow: 'hidden', textOverflow: 'ellipsis' },
  tdActions: { padding: '14px 12px', textAlign: 'center' },
  
  // Cells
  profileCell: { display: 'flex', alignItems: 'center', gap: 12 },
  avatarBox: { width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(195deg, #42424a, #191919)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' },
  empName: { fontWeight: 600, fontSize: 14 },
  empRole: { fontSize: 12, color: '#7b809a' },
  salaryText: { fontWeight: 700, color: '#059669', fontSize: 13 },
  permanentLabel: { fontStyle: 'italic', color: '#3b82f6' },
  
  statusBadge: { 
    display: 'inline-block', padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase'
  },
  
  // Actions
  actionGroup: { display: 'flex', justifyContent: 'center', gap: 8 },
  viewBtn: { padding: '8px 10px', background: '#e9ecef', color: '#344767', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  renewBtn: { 
    padding: '8px 10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 
  },
  cancelBtn: { 
    padding: '8px 10px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600 
  },
  emptyState: { textAlign: 'center', padding: 40, color: '#7b809a', fontSize: 16 },

  // Modal
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 16, width: 500, maxWidth: '95%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: 24 },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f2f5', paddingBottom: 16, marginBottom: 16 },
  modalTitle: { margin: 0, fontSize: 20, fontWeight: 700, color: '#344767' },
  closeBtn: { border: 'none', background: 'none', fontSize: 24, cursor: 'pointer', color: '#7b809a' },
  modalBody: { display: 'flex', flexDirection: 'column', gap: 16 },
  renewInfo: { background: '#fff7ed', padding: 12, borderRadius: 8, border: '1px solid #fdba74', fontSize: 14 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 14, fontWeight: 600, color: '#344767' },
  input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d2d6da', outline: 'none', fontSize: 14, boxSizing: 'border-box' },
  inputDisabled: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e9ecef', background: '#f8f9fa', color: '#7b809a', outline: 'none', fontSize: 14, boxSizing: 'border-box' },
  modalFooter: { marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 16, borderTop: '1px solid #f0f2f5' },
  btnCancel: { padding: '10px 20px', borderRadius: 8, border: 'none', background: '#f0f2f5', color: '#7b809a', fontWeight: 600, cursor: 'pointer' },
  btnSave: { padding: '10px 24px', borderRadius: 8, border: 'none', background: 'linear-gradient(195deg, #fb8c00, #ffa726)', color: '#fff', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }
};