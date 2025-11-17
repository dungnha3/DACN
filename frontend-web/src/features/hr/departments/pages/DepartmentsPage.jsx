import { useState } from 'react';

const mockDepartments = [
  { id: 1, ten: 'Phòng IT', moTa: 'Phát triển và bảo trì hệ thống', soNhanVien: 15, truongPhong: 'Nguyễn Văn A', trangThai: 'HOAT_DONG' },
  { id: 2, ten: 'Phòng HR', moTa: 'Quản lý nhân sự và tuyển dụng', soNhanVien: 8, truongPhong: 'Trần Thị B', trangThai: 'HOAT_DONG' },
  { id: 3, ten: 'Phòng Kế toán', moTa: 'Quản lý tài chính và kế toán', soNhanVien: 6, truongPhong: 'Lê Văn C', trangThai: 'HOAT_DONG' },
  { id: 4, ten: 'Phòng Marketing', moTa: 'Marketing và truyền thông', soNhanVien: 10, truongPhong: 'Phạm Thị D', trangThai: 'HOAT_DONG' },
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState(mockDepartments);

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Quản lý Phòng ban</h1>
          <p style={s.subtitle}>{departments.length} phòng ban đang hoạt động</p>
        </div>
        <button style={s.addBtn}>➕ Tạo phòng ban mới</button>
      </div>

      <div style={s.grid}>
        {departments.map(dept => (
          <div key={dept.id} style={s.card}>
            <div style={s.cardIcon}>🏢</div>
            <h3 style={s.cardTitle}>{dept.ten}</h3>
            <p style={s.cardDesc}>{dept.moTa}</p>
            <div style={s.cardStats}>
              <div><strong>{dept.soNhanVien}</strong> nhân viên</div>
              <div>👤 {dept.truongPhong}</div>
            </div>
            <div style={s.cardActions}>
              <button style={s.viewBtn}>👁️ Xem chi tiết</button>
              <button style={s.editBtn}>✏️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  container: { padding: 24, background: '#f8fafc', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 },
  subtitle: { color: '#64748b', fontSize: 14, margin: '4px 0 0 0' },
  addBtn: { padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 },
  card: { background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  cardIcon: { fontSize: 40, marginBottom: 12 },
  cardTitle: { fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' },
  cardDesc: { color: '#64748b', fontSize: 14, marginBottom: 16 },
  cardStats: { fontSize: 14, color: '#334155', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 },
  cardActions: { display: 'flex', gap: 8 },
  viewBtn: { flex: 1, padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  editBtn: { padding: '8px 12px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
};
