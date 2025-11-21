import { useState, useEffect } from 'react';
import { employeesService, departmentsService, positionsService } from '@/features/hr/shared/services';
import { apiService } from '@/shared/services/api.service';
import { usePermissions, useErrorHandler } from '@/shared/hooks';
import { validateEmployee } from '@/shared/utils/validation';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const { isHRManager } = usePermissions();
  const { handleError } = useErrorHandler();

  const [newEmp, setNewEmp] = useState({
    userId: '',
    hoTen: '',
    cccd: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    diaChi: '',
    ngayVaoLam: new Date().toISOString().split('T')[0],
    phongbanId: '',
    chucvuId: '',
    luongCoBan: '',
    phuCap: ''
  });

  // Load dữ liệu từ API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Load employees, departments, positions
      const [empData, deptData, posData] = await Promise.all([
        employeesService.getAll(),
        departmentsService.getAll(),
        positionsService.getAll()
      ]);
      setEmployees(empData);
      setDepartments(deptData);
      setPositions(posData);

      // Load users (for dropdown) - Try both /users and /api/users
      try {
        const usersData = await apiService.get('/users');
        setUsers(usersData || []);
      } catch (err) {
        console.log('Could not load users from /users, trying /api/users:', err.message);
        try {
          const usersData = await apiService.get('/api/users');
          setUsers(usersData || []);
        } catch (err2) {
          console.error('Could not load users from both endpoints:', err2);
          setUsers([]);
        }
      }
    } catch (err) {
      const errorMessage = handleError(err, { context: 'load_employees_data' });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmp({ ...newEmp, [name]: value });
  };

  const handleSave = async () => {
    // Validation with validateEmployee
    const validationErrors = validateEmployee(newEmp);
    if (validationErrors) {
      setFormErrors(validationErrors);
      alert('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    setFormErrors({});

    try {
      setLoading(true);
      await employeesService.create({
        userId: Number(newEmp.userId),
        hoTen: newEmp.hoTen,
        cccd: newEmp.cccd || null,
        ngaySinh: newEmp.ngaySinh,
        gioiTinh: newEmp.gioiTinh,
        diaChi: newEmp.diaChi || null,
        ngayVaoLam: newEmp.ngayVaoLam,
        phongbanId: newEmp.phongbanId ? Number(newEmp.phongbanId) : null,
        chucvuId: newEmp.chucvuId ? Number(newEmp.chucvuId) : null,
        luongCoBan: newEmp.luongCoBan ? Number(newEmp.luongCoBan) : 0,
        phuCap: newEmp.phuCap ? Number(newEmp.phuCap) : 0
      });
      await loadData();
      setShowModal(false);
      setNewEmp({
        userId: '',
        hoTen: '',
        cccd: '',
        ngaySinh: '',
        gioiTinh: 'Nam',
        diaChi: '',
        ngayVaoLam: new Date().toISOString().split('T')[0],
        phongbanId: '',
        chucvuId: '',
        luongCoBan: '',
        phuCap: ''
      });
      alert('✅ Thêm nhân viên thành công!');
    } catch (err) {
      const errorMessage = handleError(err, { context: 'create_employee' });
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Bạn chắc chắn muốn xóa nhân viên này?')) {
      try {
        setLoading(true);
        await employeesService.delete(id);
        await loadData();
        alert('✅ Xóa nhân viên thành công!');
      } catch (err) {
        const errorMessage = handleError(err, { context: 'delete_employee' });
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  }

  // Filter employees by search term
  const filteredEmployees = employees.filter(emp => 
    emp.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.maNhanVien?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format currency
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      DANG_LAM_VIEC: { color: '#16a34a', bg: '#dcfce7', text: 'Đang làm' },
      NGHI_VIEC: { color: '#dc2626', bg: '#fee2e2', text: 'Nghỉ việc' },
      TAM_NGHI: { color: '#d97706', bg: '#fef3c7', text: 'Tạm nghỉ' }
    };
    const style = config[status] || config.DANG_LAM_VIEC;
    return (
      <span style={{
        background: style.bg, color: style.color,
        padding: '4px 8px', borderRadius: '6px',
        fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', 
        display: 'inline-block', whiteSpace: 'nowrap'
      }}>
        {style.text}
      </span>
    );
  };

  // Permission guard
  if (!isHRManager) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <div style={{ fontSize: '20px', fontWeight: '600', color: '#ef4444' }}>Không có quyền truy cập</div>
        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>Chỉ HR Manager mới có quyền quản lý nhân viên</div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      {/* Header */}
      <div style={s.headerWrapper}>
        <div>
          <div style={s.breadcrumb}>Quản lý nhân sự / Nhân viên</div>
          <h1 style={s.pageTitle}>Danh sách Nhân viên</h1>
          <div style={s.totalBadge}>Tổng số: {employees.length} nhân viên</div>
        </div>
        <div style={s.headerActions}>
          <button style={s.btnExport}>📥 Xuất Excel</button>
          <button style={s.btnAdd} onClick={() => setShowModal(true)}>+ Thêm mới</button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={s.filterBar}>
        <div style={s.searchWrapper}>
          <span style={s.searchIcon}>🔍</span>
          <input 
            style={s.searchInput} 
            placeholder="Tìm kiếm..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select style={s.filterSelect}><option>Tất cả trạng thái</option></select>
        <select style={s.filterSelect}><option>Tất cả phòng ban</option></select>
      </div>

      {/* Table Container - Đã fix lỗi scroll ngang */}
      <div style={s.tableCard}>
        <div style={s.tableResponsive}>
          <table style={s.table}>
            <thead>
              <tr>
                {/* Sử dụng width % thay vì px để fix layout */}
                <th style={{...s.th, width: '25%'}}>Nhân viên</th>
                <th style={{...s.th, width: '20%'}}>Liên hệ</th>
                <th style={{...s.th, width: '15%'}}>Vị trí</th>
                <th style={{...s.th, width: '15%'}}>Lương CB</th>
                <th style={{...s.th, width: '10%'}}>Ngày vào</th>
                <th style={{...s.th, width: '10%'}}>Trạng thái</th>
                <th style={{...s.thRight, width: '5%'}}></th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.nhanvienId} style={s.tr}>
                  <td style={s.td}>
                    <div style={s.profileCell}>
                      <div style={s.avatarBox}>{emp.avatar}</div>
                      <div style={{minWidth: 0}}>
                        <div style={s.empName}>{emp.hoTen}</div>
                        <div style={s.empCode}>{emp.maNhanVien || `NV${emp.nhanvienId}`}</div>
                      </div>
                    </div>
                  </td>
                  <td style={s.td}>
                    <div style={s.contactCell}>
                      <span title={emp.email} style={s.contactItem}>📧 {emp.email}</span>
                      <span style={s.contactItem}>📞 {emp.sdt}</span>
                    </div>
                  </td>
                  <td style={s.td}>
                    <div style={{fontWeight: 600, color: '#344767'}}>{emp.phongban?.tenPhongBan || 'N/A'}</div>
                    <div style={{fontSize: 12, color: '#7b809a'}}>{emp.chucvu?.tenChucVu || 'N/A'}</div>
                  </td>
                  <td style={{...s.td, fontWeight: 700, color: '#344767'}}>{formatCurrency(emp.luongCoBan)}</td>
                  <td style={s.td}>{emp.ngayVaoLam}</td>
                  <td style={s.td}>{getStatusBadge(emp.trangThai)}</td>
                  <td style={s.tdRight}>
                     <div style={s.actions}>
                        <button style={s.iconBtn} title="Sửa">✏️</button>
                        <button style={{...s.iconBtn, color: '#ef4444', background: '#fef2f2'}} onClick={() => handleDelete(emp.nhanvienId)} title="Xóa">🗑️</button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal giữ nguyên logic */}
      {showModal && (
        <div style={s.modalOverlay}>
          <div style={s.modalContent}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Thêm nhân viên mới</h2>
              <button style={s.closeBtn} onClick={() => setShowModal(false)}>×</button>
            </div>
            <div style={s.modalBody}>
              <div style={s.formGrid}>
                <div style={s.formGroup}>
                  <label style={s.label}>Tài khoản <span style={{color:'red'}}>*</span></label>
                  <select style={s.select} name="userId" value={newEmp.userId} onChange={handleInputChange}>
                    <option value="">-- Chọn tài khoản --</option>
                    {users.map(user => (
                      <option key={user.userId} value={user.userId}>{user.username} ({user.email})</option>
                    ))}
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Họ và tên <span style={{color:'red'}}>*</span></label>
                  <input style={s.input} name="hoTen" value={newEmp.hoTen} onChange={handleInputChange} placeholder="Nguyễn Văn A" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>CCCD</label>
                  <input style={s.input} name="cccd" value={newEmp.cccd} onChange={handleInputChange} placeholder="001234567890" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Ngày sinh <span style={{color:'red'}}>*</span></label>
                  <input style={s.input} type="date" name="ngaySinh" value={newEmp.ngaySinh} onChange={handleInputChange} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Giới tính <span style={{color:'red'}}>*</span></label>
                  <select style={s.select} name="gioiTinh" value={newEmp.gioiTinh} onChange={handleInputChange}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Địa chỉ</label>
                  <input style={s.input} name="diaChi" value={newEmp.diaChi} onChange={handleInputChange} placeholder="123 Nguyễn Trãi, Q1" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Ngày vào làm <span style={{color:'red'}}>*</span></label>
                  <input style={s.input} type="date" name="ngayVaoLam" value={newEmp.ngayVaoLam} onChange={handleInputChange} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Phòng ban</label>
                  <select style={s.select} name="phongbanId" value={newEmp.phongbanId} onChange={handleInputChange}>
                    <option value="">-- Chọn phòng ban --</option>
                    {departments.map(dept => (
                      <option key={dept.phongbanId} value={dept.phongbanId}>{dept.tenPhongBan}</option>
                    ))}
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Chức vụ</label>
                  <select style={s.select} name="chucvuId" value={newEmp.chucvuId} onChange={handleInputChange}>
                    <option value="">-- Chọn chức vụ --</option>
                    {positions.map(pos => (
                      <option key={pos.chucvuId} value={pos.chucvuId}>{pos.tenChucVu}</option>
                    ))}
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Lương cơ bản</label>
                  <input style={s.input} type="number" name="luongCoBan" value={newEmp.luongCoBan} onChange={handleInputChange} placeholder="VD: 10000000" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Phụ cấp</label>
                  <input style={s.input} type="number" name="phuCap" value={newEmp.phuCap} onChange={handleInputChange} placeholder="VD: 2000000" />
                </div>
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.btnCancel} onClick={() => setShowModal(false)}>Hủy bỏ</button>
              <button style={s.btnSave} onClick={handleSave}>Lưu nhân viên</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles - Đã fix lỗi tràn màn hình
const s = {
  container: { padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#344767', boxSizing: 'border-box' },
  
  headerWrapper: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 },
  breadcrumb: { fontSize: 13, color: '#7b809a', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' },
  pageTitle: { fontSize: 28, fontWeight: 700, margin: 0, color: '#344767' },
  totalBadge: { fontSize: 14, color: '#7b809a', marginTop: 4 },
  headerActions: { display: 'flex', gap: 12 },
  
  btnAdd: { background: 'linear-gradient(195deg, #f59e0b 0%, #d97706 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 6px rgba(251, 140, 0, 0.2)', textTransform: 'uppercase', transition: 'all 0.2s' },
  btnExport: { background: '#fff', color: '#344767', border: '1px solid #d2d6da', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },

  filterBar: { display: 'flex', gap: 16, marginBottom: 24, background: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', alignItems: 'center' },
  searchWrapper: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: 12, color: '#7b809a' },
  searchInput: { width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #d2d6da', borderRadius: 8, outline: 'none', fontSize: 14, boxSizing: 'border-box', transition: 'all 0.2s', background: '#fff', color: '#344767' },
  filterSelect: { padding: '12px 16px', border: '1px solid #d2d6da', borderRadius: 8, outline: 'none', fontSize: 14, minWidth: 150, cursor: 'pointer', background: '#fff', color: '#344767' },

  // Table Styles Fixes
  tableCard: { background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.02)' },
  tableResponsive: { width: '100%' }, // Bỏ overflowX auto để tránh scroll
  table: { 
    width: '100%', 
    borderCollapse: 'collapse', 
    tableLayout: 'fixed' // Quan trọng: Giữ cột không bị vỡ layout
  }, 
  
  th: { padding: '16px 12px', textAlign: 'left', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#7b809a', borderBottom: '1px solid #f0f2f5', background: '#fff' },
  thRight: { padding: '16px 12px', textAlign: 'right', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#7b809a', borderBottom: '1px solid #f0f2f5', background: '#fff' },
  tr: { borderBottom: '1px solid #f0f2f5', transition: 'background 0.2s' },
  
  // Cell Fixes: allow wrap, break word
  td: { 
    padding: '16px 12px', 
    fontSize: 14, 
    color: '#344767', 
    verticalAlign: 'middle',
    whiteSpace: 'normal', // Cho phép xuống dòng
    wordBreak: 'break-word' // Ngắt từ nếu quá dài
  },
  tdRight: { padding: '16px 12px', textAlign: 'right', verticalAlign: 'middle' },

  profileCell: { display: 'flex', alignItems: 'center', gap: 12 },
  avatarBox: { width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(195deg, #42424a, #191919)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 16, boxShadow: '0 4px 6px rgba(0,0,0,0.12)', flexShrink: 0 },
  empName: { fontWeight: 700, fontSize: 14, color: '#344767', marginBottom: 2 },
  empCode: { fontSize: 11, color: '#7b809a', fontWeight: 500 },
  contactCell: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: '#7b809a' },
  contactItem: { display: 'block', wordBreak: 'break-all' }, // Fix email dài quá
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 8 },
  iconBtn: { width: 30, height: 30, border: 'none', background: '#f8f9fa', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', fontSize: 14, color: '#7b809a' },

  // Modal
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: '#fff', borderRadius: 16, width: 700, maxWidth: '95%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', maxHeight: '90vh', animation: 'fadeIn 0.3s ease-out' },
  modalHeader: { padding: '24px', borderBottom: '1px solid #f0f2f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { margin: 0, fontSize: 20, fontWeight: 700, color: '#344767' },
  closeBtn: { border: 'none', background: 'none', fontSize: 24, cursor: 'pointer', color: '#7b809a' },
  modalBody: { padding: 24, overflowY: 'auto' },
  
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  formGroup: { marginBottom: 0 },
  label: { display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#344767' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #d2d6da', borderRadius: 8, outline: 'none', fontSize: 14, boxSizing: 'border-box', transition: 'all 0.2s', color: '#344767', background: '#fff' },
  select: { width: '100%', padding: '10px 12px', border: '1px solid #d2d6da', borderRadius: 8, outline: 'none', fontSize: 14, boxSizing: 'border-box', background: '#fff', color: '#344767', cursor: 'pointer' },
  
  modalFooter: { padding: '20px 24px', borderTop: '1px solid #f0f2f5', display: 'flex', justifyContent: 'flex-end', gap: 12 },
  btnCancel: { padding: '10px 20px', border: 'none', background: '#f0f2f5', borderRadius: 8, fontWeight: 600, cursor: 'pointer', color: '#7b809a', transition: 'all 0.2s' },
  btnSave: { padding: '10px 24px', border: 'none', background: 'linear-gradient(195deg, #f59e0b 0%, #d97706 100%)', color: '#fff', borderRadius: 8, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(251, 140, 0, 0.2)', transition: 'all 0.2s' }
};