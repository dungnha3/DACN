import { useState } from 'react';

const mockLeaves = [
  { id: 1, nhanVien: 'Nguyễn Văn A', loaiNghiPhep: 'NGHI_PHEP_NAM', tuNgay: '2024-11-20', denNgay: '2024-11-22', soNgay: 3, lyDo: 'Nghỉ việc gia đình', trangThai: 'CHO_DUYET', nguoiDuyet: null, ngayDuyet: null },
  { id: 2, nhanVien: 'Trần Thị B', loaiNghiPhep: 'NGHI_OM', tuNgay: '2024-11-18', denNgay: '2024-11-18', soNgay: 1, lyDo: 'Bị cảm, sốt', trangThai: 'DA_DUYET', nguoiDuyet: 'HR Manager', ngayDuyet: '2024-11-17' },
  { id: 3, nhanVien: 'Lê Văn C', loaiNghiPhep: 'NGHI_KHONG_LUONG', tuNgay: '2024-11-25', denNgay: '2024-11-27', soNgay: 3, lyDo: 'Đi du lịch', trangThai: 'DA_DUYET', nguoiDuyet: 'HR Manager', ngayDuyet: '2024-11-16' },
  { id: 4, nhanVien: 'Phạm Thị D', loaiNghiPhep: 'NGHI_PHEP_NAM', tuNgay: '2024-11-21', denNgay: '2024-11-21', soNgay: 1, lyDo: 'Việc cá nhân', trangThai: 'TU_CHOI', nguoiDuyet: 'HR Manager', ngayDuyet: '2024-11-17' },
];

export default function LeavesPage() {
  const [leaves, setLeaves] = useState(mockLeaves);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusBadge = (status) => {
    const styles = {
      CHO_DUYET: { bg: '#fef3c7', color: '#92400e', label: '⏳ Chờ duyệt' },
      DA_DUYET: { bg: '#dcfce7', color: '#166534', label: '✓ Đã duyệt' },
      TU_CHOI: { bg: '#fee2e2', color: '#991b1b', label: '✗ Từ chối' },
      HUY: { bg: '#f1f5f9', color: '#64748b', label: '⊘ Đã hủy' },
    };
    const s = styles[status];
    return <span style={{ background: s.bg, color: s.color, padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 500 }}>{s.label}</span>;
  };

  const getLeaveTypeBadge = (type) => {
    const types = {
      NGHI_PHEP_NAM: '🏖️ Nghỉ phép năm',
      NGHI_OM: '🤒 Nghỉ ốm',
      NGHI_KHONG_LUONG: '⚠️ Nghỉ không lương',
      NGHI_THAI_SAN: '👶 Nghỉ thai sản',
      NGHI_KHAC: '📋 Nghỉ khác',
    };
    return types[type] || type;
  };

  const filteredLeaves = leaves.filter(l => filterStatus === 'ALL' || l.trangThai === filterStatus);

  const handleApprove = (id) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, trangThai: 'DA_DUYET', nguoiDuyet: 'HR Manager', ngayDuyet: new Date().toISOString().split('T')[0] } : l));
  };

  const handleReject = (id) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, trangThai: 'TU_CHOI', nguoiDuyet: 'HR Manager', ngayDuyet: new Date().toISOString().split('T')[0] } : l));
  };

  return (
    <div style={st.container}>
      <div style={st.header}>
        <div>
          <h1 style={st.title}>Quản lý Nghỉ phép</h1>
          <p style={st.subtitle}>Theo dõi và phê duyệt đơn nghỉ phép</p>
        </div>
        <button style={st.createBtn} onClick={() => setShowCreateModal(true)}>➕ Tạo đơn mới</button>
      </div>

      {/* Stats */}
      <div style={st.statsGrid}>
        <div style={st.statCard}>
          <div style={st.statValue}>{leaves.filter(l => l.trangThai === 'CHO_DUYET').length}</div>
          <div style={st.statLabel}>Chờ duyệt</div>
        </div>
        <div style={st.statCard}>
          <div style={st.statValue}>{leaves.filter(l => l.trangThai === 'DA_DUYET').length}</div>
          <div style={st.statLabel}>Đã duyệt</div>
        </div>
        <div style={st.statCard}>
          <div style={st.statValue}>{leaves.filter(l => l.trangThai === 'TU_CHOI').length}</div>
          <div style={st.statLabel}>Từ chối</div>
        </div>
        <div style={st.statCard}>
          <div style={st.statValue}>{leaves.reduce((sum, l) => sum + (l.trangThai === 'DA_DUYET' ? l.soNgay : 0), 0)}</div>
          <div style={st.statLabel}>Tổng ngày nghỉ</div>
        </div>
      </div>

      <div style={st.filters}>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={st.select}>
          <option value="ALL">Tất cả trạng thái</option>
          <option value="CHO_DUYET">Chờ duyệt</option>
          <option value="DA_DUYET">Đã duyệt</option>
          <option value="TU_CHOI">Từ chối</option>
        </select>
      </div>

      <div style={st.tableCard}>
        <table style={st.table}>
          <thead>
            <tr>
              <th style={st.th}>Nhân viên</th>
              <th style={st.th}>Loại nghỉ phép</th>
              <th style={st.th}>Từ ngày</th>
              <th style={st.th}>Đến ngày</th>
              <th style={st.th}>Số ngày</th>
              <th style={st.th}>Lý do</th>
              <th style={st.th}>Trạng thái</th>
              <th style={st.th}>Người duyệt</th>
              <th style={st.th}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map(l => (
              <tr key={l.id} style={st.tr}>
                <td style={st.td}><strong>{l.nhanVien}</strong></td>
                <td style={st.td}>{getLeaveTypeBadge(l.loaiNghiPhep)}</td>
                <td style={st.td}>{l.tuNgay}</td>
                <td style={st.td}>{l.denNgay}</td>
                <td style={st.td}><strong>{l.soNgay} ngày</strong></td>
                <td style={st.td} title={l.lyDo}>{l.lyDo.slice(0, 30)}...</td>
                <td style={st.td}>{getStatusBadge(l.trangThai)}</td>
                <td style={st.td}>{l.nguoiDuyet || '-'}</td>
                <td style={st.td}>
                  {l.trangThai === 'CHO_DUYET' && (
                    <>
                      <button style={st.approveBtn} onClick={() => handleApprove(l.id)}>✓</button>
                      <button style={st.rejectBtn} onClick={() => handleReject(l.id)}>✗</button>
                    </>
                  )}
                  {l.trangThai !== 'CHO_DUYET' && <button style={st.viewBtn}>👁️</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const st = {
  container: { padding: 24, background: '#f8fafc', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 },
  subtitle: { color: '#64748b', fontSize: 14, margin: '4px 0 0 0' },
  createBtn: { padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: { background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  statValue: { fontSize: 32, fontWeight: 700, color: '#0f172a' },
  statLabel: { fontSize: 14, color: '#64748b', marginTop: 4 },
  filters: { display: 'flex', gap: 12, marginBottom: 20 },
  select: { padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, minWidth: 200 },
  tableCard: { background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 16px', textAlign: 'left', background: '#f1f5f9', fontSize: 13, fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: 14, color: '#334155' },
  approveBtn: { padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, marginRight: 8 },
  rejectBtn: { padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  viewBtn: { padding: '6px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
};
