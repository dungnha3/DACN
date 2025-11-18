import { useState } from 'react';

const initialEmployees = [
  { id: 1, code: 'NV001', hoTen: 'Nguyễn Văn A', email: 'nva@company.com', sdt: '0901234567', phongBan: 'IT', chucVu: 'Developer', luongCoBan: 15000000, trangThai: 'DANG_LAM_VIEC', ngayVaoLam: '2023-01-15', avatar: '👨‍💻' },
  { id: 2, code: 'NV002', hoTen: 'Trần Thị B', email: 'ttb@company.com', sdt: '0912345678', phongBan: 'HR', chucVu: 'HR Manager', luongCoBan: 20000000, trangThai: 'DANG_LAM_VIEC', ngayVaoLam: '2022-05-20', avatar: '👩‍💼' },
  { id: 3, code: 'NV003', hoTen: 'Lê Văn C', email: 'lvc@company.com', sdt: '0923456789', phongBan: 'IT', chucVu: 'Tech Lead', luongCoBan: 25000000, trangThai: 'DANG_LAM_VIEC', ngayVaoLam: '2021-03-10', avatar: '⚡' },
  { id: 4, code: 'NV004', hoTen: 'Phạm Thị D', email: 'ptd@company.com', sdt: '0934567890', phongBan: 'Accounting', chucVu: 'Accountant', luongCoBan: 12000000, trangThai: 'NGHI_VIEC', ngayVaoLam: '2023-06-01', avatar: '📊' },
  { id: 5, code: 'NV005', hoTen: 'Hoàng Văn E', email: 'hve@company.com', sdt: '0945678901', phongBan: 'Marketing', chucVu: 'Marketing Manager', luongCoBan: 18000000, trangThai: 'NGHI_THAI_SAN', ngayVaoLam: '2022-11-15', avatar: '📢' },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [newEmp, setNewEmp] = useState({
    hoTen: '', email: '', sdt: '', phongBan: 'IT', chucVu: '', luongCoBan: '', trangThai: 'DANG_LAM_VIEC', ngayVaoLam: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmp({ ...newEmp, [name]: value });
  };

  const handleSave = () => {
    if (!newEmp.hoTen || !newEmp.email) {
      alert("Vui lòng điền Họ tên và Email!");
      return;
    }
    
    const newId = employees.length + 1;
    const newEmployeeData = {
      id: newId,
      code: `NV00${newId}`,
      ...newEmp,
      luongCoBan: Number(newEmp.luongCoBan),
      avatar: '👤'
    };

    setEmployees([newEmployeeData, ...employees]);
    setShowModal(false);
    setNewEmp({ hoTen: '', email: '', sdt: '', phongBan: 'IT', chucVu: '', luongCoBan: '', trangThai: 'DANG_LAM_VIEC', ngayVaoLam: '' });
  };

  const handleDelete = (id) => {
    if(confirm('Bạn chắc chắn muốn xóa nhân viên này?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  }

  const filteredEmployees = employees.filter(emp => 
    emp.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const getStatusBadge = (status) => {
    const config = {
      DANG_LAM_VIEC: { color: '#16a34a', bg: '#dcfce7', text: 'Đang làm' },
      NGHI_VIEC: { color: '#dc2626', bg: '#fee2e2', text: 'Nghỉ việc' },
      NGHI_THAI_SAN: { color: '#d97706', bg: '#fef3c7', text: 'Thai sản' }
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
                <tr key={emp.id} style={s.tr}>
                  <td style={s.td}>
                    <div style={s.profileCell}>
                      <div style={s.avatarBox}>{emp.avatar}</div>
                      <div style={{minWidth: 0}}>
                        <div style={s.empName}>{emp.hoTen}</div>
                        <div style={s.empCode}>{emp.code}</div>
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
                    <div style={{fontWeight: 600, color: '#344767'}}>{emp.phongBan}</div>
                    <div style={{fontSize: 12, color: '#7b809a'}}>{emp.chucVu}</div>
                  </td>
                  <td style={{...s.td, fontWeight: 700, color: '#344767'}}>{formatCurrency(emp.luongCoBan)}</td>
                  <td style={s.td}>{emp.ngayVaoLam}</td>
                  <td style={s.td}>{getStatusBadge(emp.trangThai)}</td>
                  <td style={s.tdRight}>
                     <div style={s.actions}>
                        <button style={s.iconBtn} title="Sửa">✏️</button>
                        <button style={{...s.iconBtn, color: '#ef4444', background: '#fef2f2'}} onClick={() => handleDelete(emp.id)} title="Xóa">🗑️</button>
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
                  <label style={s.label}>Họ và tên <span style={{color:'red'}}>*</span></label>
                  <input style={s.input} name="hoTen" value={newEmp.hoTen} onChange={handleInputChange} placeholder="Nguyễn Văn A" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Email <span style={{color:'red'}}>*</span></label>
                  <input style={s.input} name="email" value={newEmp.email} onChange={handleInputChange} placeholder="email@company.com" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Số điện thoại</label>
                  <input style={s.input} name="sdt" value={newEmp.sdt} onChange={handleInputChange} placeholder="09xx..." />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Ngày vào làm</label>
                  <input style={s.input} type="date" name="ngayVaoLam" value={newEmp.ngayVaoLam} onChange={handleInputChange} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Phòng ban</label>
                  <select style={s.select} name="phongBan" value={newEmp.phongBan} onChange={handleInputChange}>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Accounting">Accounting</option>
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Chức vụ</label>
                  <input style={s.input} name="chucVu" value={newEmp.chucVu} onChange={handleInputChange} placeholder="VD: Developer" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Lương cơ bản</label>
                  <input style={s.input} type="number" name="luongCoBan" value={newEmp.luongCoBan} onChange={handleInputChange} placeholder="VNĐ" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Trạng thái</label>
                  <select style={s.select} name="trangThai" value={newEmp.trangThai} onChange={handleInputChange}>
                    <option value="DANG_LAM_VIEC">Đang làm việc</option>
                    <option value="NGHI_THAI_SAN">Nghỉ thai sản</option>
                    <option value="NGHI_VIEC">Đã nghỉ việc</option>
                  </select>
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
  searchInput: { width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #d2d6da', borderRadius: 8, outline: 'none', fontSize: 14, boxSizing: 'border-box', transition: 'all 0.2s' },
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
  input: { width: '100%', padding: '10px 12px', border: '1px solid #d2d6da', borderRadius: 8, outline: 'none', fontSize: 14, boxSizing: 'border-box', transition: 'all 0.2s', color: '#495057' },
  select: { width: '100%', padding: '10px 12px', border: '1px solid #d2d6da', borderRadius: 8, outline: 'none', fontSize: 14, boxSizing: 'border-box', background: '#fff', color: '#495057', cursor: 'pointer' },
  
  modalFooter: { padding: '20px 24px', borderTop: '1px solid #f0f2f5', display: 'flex', justifyContent: 'flex-end', gap: 12 },
  btnCancel: { padding: '10px 20px', border: 'none', background: '#f0f2f5', borderRadius: 8, fontWeight: 600, cursor: 'pointer', color: '#7b809a', transition: 'all 0.2s' },
  btnSave: { padding: '10px 24px', border: 'none', background: 'linear-gradient(195deg, #f59e0b 0%, #d97706 100%)', color: '#fff', borderRadius: 8, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(251, 140, 0, 0.2)', transition: 'all 0.2s' }
};