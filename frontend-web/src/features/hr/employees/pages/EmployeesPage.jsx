import { useState } from 'react';
import { exportEmployees } from '../../shared/utils/export.utils';

const mockEmployees = [
  { id: 1, hoTen: 'Nguyễn Văn A', email: 'nva@company.com', sdt: '0901234567', phongBan: 'IT', chucVu: 'Developer', luongCoBan: 15000000, trangThai: 'DANG_LAM_VIEC', ngayVaoLam: '2023-01-15' },
  { id: 2, hoTen: 'Trần Thị B', email: 'ttb@company.com', sdt: '0912345678', phongBan: 'HR', chucVu: 'HR Manager', luongCoBan: 20000000, trangThai: 'DANG_LAM_VIEC', ngayVaoLam: '2022-05-20' },
  { id: 3, hoTen: 'Lê Văn C', email: 'lvc@company.com', sdt: '0923456789', phongBan: 'IT', chucVu: 'Tech Lead', luongCoBan: 25000000, trangThai: 'DANG_LAM_VIEC', ngayVaoLam: '2021-03-10' },
  { id: 4, hoTen: 'Phạm Thị D', email: 'ptd@company.com', sdt: '0934567890', phongBan: 'Accounting', chucVu: 'Accountant', luongCoBan: 12000000, trangThai: 'NGHI_VIEC', ngayVaoLam: '2023-06-01' },
  { id: 5, hoTen: 'Hoàng Văn E', email: 'hve@company.com', sdt: '0945678901', phongBan: 'Marketing', chucVu: 'Marketing Manager', luongCoBan: 18000000, trangThai: 'DANG_LAM_VIEC', ngayVaoLam: '2022-11-15' },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const filteredEmployees = employees.filter(emp => {
    const matchSearch = emp.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || emp.trangThai === filterStatus;
    return matchSearch && matchStatus;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      DANG_LAM_VIEC: { bg: '#dcfce7', color: '#166534', label: 'Đang làm việc' },
      NGHI_VIEC: { bg: '#fee2e2', color: '#991b1b', label: 'Nghỉ việc' },
      NGHI_THAI_SAN: { bg: '#fef3c7', color: '#92400e', label: 'Nghỉ thai sản' },
    };
    const s = statusStyles[status] || statusStyles.DANG_LAM_VIEC;
    return (
      <span style={{ 
        background: s.bg, 
        color: s.color, 
        padding: '4px 12px', 
        borderRadius: '12px', 
        fontSize: '13px',
        fontWeight: 500
      }}>
        {s.label}
      </span>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Quản lý Nhân viên</h1>
          <p style={styles.subtitle}>Tổng số: {employees.length} nhân viên</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={styles.exportBtn} onClick={exportEmployees}>
            📥 Export Excel
          </button>
          <button style={styles.addBtn} onClick={() => setShowAddModal(true)}>
            ➕ Thêm nhân viên mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo tên, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          style={styles.select}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="DANG_LAM_VIEC">Đang làm việc</option>
          <option value="NGHI_VIEC">Nghỉ việc</option>
          <option value="NGHI_THAI_SAN">Nghỉ thai sản</option>
        </select>
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Họ tên</th>
              <th style={styles.th}>Email / SĐT</th>
              <th style={styles.th}>Phòng ban</th>
              <th style={styles.th}>Chức vụ</th>
              <th style={styles.th}>Lương cơ bản</th>
              <th style={styles.th}>Ngày vào làm</th>
              <th style={styles.th}>Trạng thái</th>
              <th style={styles.th}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(emp => (
              <tr key={emp.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={{ fontWeight: 600 }}>{emp.hoTen}</div>
                </td>
                <td style={styles.td}>
                  <div style={{ fontSize: '13px' }}>{emp.email}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{emp.sdt}</div>
                </td>
                <td style={styles.td}>{emp.phongBan}</td>
                <td style={styles.td}>{emp.chucVu}</td>
                <td style={styles.td}>{formatCurrency(emp.luongCoBan)}</td>
                <td style={styles.td}>{emp.ngayVaoLam}</td>
                <td style={styles.td}>{getStatusBadge(emp.trangThai)}</td>
                <td style={styles.td}>
                  <button style={styles.actionBtn} onClick={() => setSelectedEmployee(emp)}>
                    👁️ Xem
                  </button>
                  <button style={styles.editBtn}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div style={styles.modalOverlay} onClick={() => setSelectedEmployee(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: 20 }}>Chi tiết nhân viên</h2>
            <div style={styles.detailGrid}>
              <div><strong>Họ tên:</strong> {selectedEmployee.hoTen}</div>
              <div><strong>Email:</strong> {selectedEmployee.email}</div>
              <div><strong>Số điện thoại:</strong> {selectedEmployee.sdt}</div>
              <div><strong>Phòng ban:</strong> {selectedEmployee.phongBan}</div>
              <div><strong>Chức vụ:</strong> {selectedEmployee.chucVu}</div>
              <div><strong>Lương cơ bản:</strong> {formatCurrency(selectedEmployee.luongCoBan)}</div>
              <div><strong>Ngày vào làm:</strong> {selectedEmployee.ngayVaoLam}</div>
              <div><strong>Trạng thái:</strong> {getStatusBadge(selectedEmployee.trangThai)}</div>
            </div>
            <button style={styles.closeBtn} onClick={() => setSelectedEmployee(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 24, background: '#f8fafc', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 },
  subtitle: { color: '#64748b', fontSize: 14, margin: '4px 0 0 0' },
  exportBtn: { padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  addBtn: { padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  filters: { display: 'flex', gap: 12, marginBottom: 20 },
  searchInput: { flex: 1, padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14 },
  select: { padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, minWidth: 200 },
  tableCard: { background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 16px', textAlign: 'left', background: '#f1f5f9', fontSize: 13, fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: 14, color: '#334155' },
  actionBtn: { padding: '6px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, marginRight: 8 },
  editBtn: { padding: '6px 10px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 12, padding: 32, maxWidth: 600, width: '90%', maxHeight: '80vh', overflow: 'auto' },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  closeBtn: { padding: '10px 24px', background: '#64748b', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', width: '100%' },
};
