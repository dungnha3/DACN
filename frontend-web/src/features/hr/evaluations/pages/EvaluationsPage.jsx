import { useState } from 'react';

const mockEvaluations = [
  { id: 1, nhanVien: 'Nguyễn Văn A', kyDanhGia: 'Q3/2024', loaiDanhGia: 'QUARTERLY', diemChuyenMon: 8.5, diemThaiDo: 9.0, diemKyLuat: 8.0, diemTrungBinh: 8.5, xepLoai: 'A', trangThai: 'CHO_DUYET', nguoiDanhGia: 'Manager A', ngayTao: '2024-10-01' },
  { id: 2, nhanVien: 'Trần Thị B', kyDanhGia: 'Q3/2024', loaiDanhGia: 'QUARTERLY', diemChuyenMon: 7.5, diemThaiDo: 8.0, diemKyLuat: 7.5, diemTrungBinh: 7.7, xepLoai: 'B', trangThai: 'DA_DUYET', nguoiDanhGia: 'Manager B', ngayTao: '2024-10-02' },
  { id: 3, nhanVien: 'Lê Văn C', kyDanhGia: 'Q3/2024', loaiDanhGia: 'ANNUAL', diemChuyenMon: 9.0, diemThaiDo: 9.5, diemKyLuat: 9.0, diemTrungBinh: 9.2, xepLoai: 'A+', trangThai: 'DA_DUYET', nguoiDanhGia: 'Manager A', ngayTao: '2024-10-05' },
  { id: 4, nhanVien: 'Phạm Thị D', kyDanhGia: 'Q3/2024', loaiDanhGia: 'PROBATION', diemChuyenMon: 6.5, diemThaiDo: 7.0, diemKyLuat: 8.0, diemTrungBinh: 7.2, xepLoai: 'C', trangThai: 'TU_CHOI', nguoiDanhGia: 'HR Manager', ngayTao: '2024-10-10' },
];

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState(mockEvaluations);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedEval, setSelectedEval] = useState(null);

  const getStatusBadge = (status) => {
    const styles = {
      NHAP: { bg: '#f1f5f9', color: '#64748b', label: '📝 Nháp' },
      CHO_DUYET: { bg: '#fef3c7', color: '#92400e', label: '⏳ Chờ duyệt' },
      DA_DUYET: { bg: '#dcfce7', color: '#166534', label: '✓ Đã duyệt' },
      TU_CHOI: { bg: '#fee2e2', color: '#991b1b', label: '✗ Từ chối' },
    };
    const s = styles[status];
    return <span style={{ background: s.bg, color: s.color, padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 500 }}>{s.label}</span>;
  };

  const getRankBadge = (rank) => {
    const colors = { 'A+': '#10b981', 'A': '#3b82f6', 'B': '#f59e0b', 'C': '#ef4444', 'D': '#991b1b' };
    return <span style={{ background: colors[rank] || '#64748b', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: 700 }}>{rank}</span>;
  };

  const handleApprove = (id) => {
    setEvaluations(evaluations.map(e => e.id === id ? { ...e, trangThai: 'DA_DUYET' } : e));
    alert('Đã phê duyệt đánh giá!');
  };

  const handleReject = (id) => {
    const reason = prompt('Lý do từ chối:');
    if (reason) {
      setEvaluations(evaluations.map(e => e.id === id ? { ...e, trangThai: 'TU_CHOI' } : e));
      alert('Đã từ chối đánh giá!');
    }
  };

  const filteredEvals = evaluations.filter(e => filterStatus === 'ALL' || e.trangThai === filterStatus);

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Đánh giá Nhân viên</h1>
          <p style={s.subtitle}>Quản lý đánh giá năng lực và hiệu suất</p>
        </div>
        <button style={s.addBtn}>➕ Tạo đánh giá mới</button>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        <div style={s.statCard}>
          <div style={s.statValue}>{evaluations.filter(e => e.trangThai === 'CHO_DUYET').length}</div>
          <div style={s.statLabel}>Chờ duyệt</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statValue}>{evaluations.filter(e => e.trangThai === 'DA_DUYET').length}</div>
          <div style={s.statLabel}>Đã duyệt</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statValue}>{evaluations.filter(e => e.xepLoai === 'A+' || e.xepLoai === 'A').length}</div>
          <div style={s.statLabel}>Xuất sắc</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statValue}>{(evaluations.reduce((sum, e) => sum + e.diemTrungBinh, 0) / evaluations.length).toFixed(1)}</div>
          <div style={s.statLabel}>Điểm TB</div>
        </div>
      </div>

      <div style={s.filters}>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={s.select}>
          <option value="ALL">Tất cả trạng thái</option>
          <option value="CHO_DUYET">Chờ duyệt</option>
          <option value="DA_DUYET">Đã duyệt</option>
          <option value="TU_CHOI">Từ chối</option>
        </select>
      </div>

      <div style={s.tableCard}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Nhân viên</th>
              <th style={s.th}>Kỳ đánh giá</th>
              <th style={s.th}>Chuyên môn</th>
              <th style={s.th}>Thái độ</th>
              <th style={s.th}>Kỷ luật</th>
              <th style={s.th}>Điểm TB</th>
              <th style={s.th}>Xếp loại</th>
              <th style={s.th}>Trạng thái</th>
              <th style={s.th}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvals.map(e => (
              <tr key={e.id} style={s.tr}>
                <td style={s.td}><strong>{e.nhanVien}</strong></td>
                <td style={s.td}>{e.kyDanhGia}</td>
                <td style={s.td}><strong style={{ color: '#3b82f6' }}>{e.diemChuyenMon}</strong></td>
                <td style={s.td}><strong style={{ color: '#10b981' }}>{e.diemThaiDo}</strong></td>
                <td style={s.td}><strong style={{ color: '#f59e0b' }}>{e.diemKyLuat}</strong></td>
                <td style={s.td}><strong style={{ fontSize: 16 }}>{e.diemTrungBinh}</strong></td>
                <td style={s.td}>{getRankBadge(e.xepLoai)}</td>
                <td style={s.td}>{getStatusBadge(e.trangThai)}</td>
                <td style={s.td}>
                  {e.trangThai === 'CHO_DUYET' && (
                    <>
                      <button style={s.approveBtn} onClick={() => handleApprove(e.id)}>✓</button>
                      <button style={s.rejectBtn} onClick={() => handleReject(e.id)}>✗</button>
                    </>
                  )}
                  <button style={s.viewBtn} onClick={() => setSelectedEval(e)}>👁️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedEval && (
        <div style={s.modalOverlay} onClick={() => setSelectedEval(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: 20 }}>Chi tiết đánh giá</h2>
            <div style={s.detailGrid}>
              <div><strong>Nhân viên:</strong> {selectedEval.nhanVien}</div>
              <div><strong>Kỳ đánh giá:</strong> {selectedEval.kyDanhGia}</div>
              <div><strong>Người đánh giá:</strong> {selectedEval.nguoiDanhGia}</div>
              <div><strong>Ngày tạo:</strong> {selectedEval.ngayTao}</div>
              <div><strong>Điểm chuyên môn:</strong> {selectedEval.diemChuyenMon}</div>
              <div><strong>Điểm thái độ:</strong> {selectedEval.diemThaiDo}</div>
              <div><strong>Điểm kỷ luật:</strong> {selectedEval.diemKyLuat}</div>
              <div><strong>Điểm trung bình:</strong> {selectedEval.diemTrungBinh}</div>
              <div><strong>Xếp loại:</strong> {getRankBadge(selectedEval.xepLoai)}</div>
              <div><strong>Trạng thái:</strong> {getStatusBadge(selectedEval.trangThai)}</div>
            </div>
            <button style={s.closeBtn} onClick={() => setSelectedEval(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  container: { padding: 24, background: '#f8fafc', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 },
  subtitle: { color: '#64748b', fontSize: 14, margin: '4px 0 0 0' },
  addBtn: { padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: { background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  statValue: { fontSize: 32, fontWeight: 700, color: '#0f172a' },
  statLabel: { fontSize: 14, color: '#64748b', marginTop: 4 },
  filters: { marginBottom: 20 },
  select: { padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, minWidth: 200 },
  tableCard: { background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 12px', textAlign: 'left', background: '#f1f5f9', fontSize: 13, fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 12px', fontSize: 14, color: '#334155' },
  approveBtn: { padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, marginRight: 8 },
  rejectBtn: { padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, marginRight: 8 },
  viewBtn: { padding: '6px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 12, padding: 32, maxWidth: 600, width: '90%' },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  closeBtn: { padding: '10px 24px', background: '#64748b', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', width: '100%' },
};
