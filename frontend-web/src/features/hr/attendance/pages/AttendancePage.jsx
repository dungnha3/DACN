import { useState } from 'react';

const mockAttendance = [
  { id: 1, nhanVien: 'Nguyễn Văn A', ngay: '2024-11-17', gioVao: '08:00', gioRa: '17:30', soGioLam: 8.5, trangThai: 'CO_MAT', ghiChu: '' },
  { id: 2, nhanVien: 'Trần Thị B', ngay: '2024-11-17', gioVao: '08:15', gioRa: '17:45', soGioLam: 8.5, trangThai: 'DI_MUON', ghiChu: 'Đi muộn 15 phút' },
  { id: 3, nhanVien: 'Lê Văn C', ngay: '2024-11-17', gioVao: '08:00', gioRa: '20:00', soGioLam: 11, trangThai: 'TANG_CA', ghiChu: 'Làm thêm 2.5 giờ' },
  { id: 4, nhanVien: 'Phạm Thị D', ngay: '2024-11-17', gioVao: null, gioRa: null, soGioLam: 0, trangThai: 'VANG_MAT', ghiChu: 'Nghỉ không phép' },
  { id: 5, nhanVien: 'Hoàng Văn E', ngay: '2024-11-17', gioVao: '08:00', gioRa: '17:00', soGioLam: 8, trangThai: 'NGHI_PHEP', ghiChu: 'Nghỉ phép có lương' },
];

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(mockAttendance);
  const [selectedDate, setSelectedDate] = useState('2024-11-17');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  const filteredAttendance = attendance.filter(a => {
    const matchDate = a.ngay === selectedDate;
    const matchStatus = filterStatus === 'ALL' || a.trangThai === filterStatus;
    return matchDate && matchStatus;
  });

  const getStatusBadge = (status) => {
    const statusStyles = {
      CO_MAT: { bg: '#dcfce7', color: '#166534', label: '✓ Có mặt' },
      VANG_MAT: { bg: '#fee2e2', color: '#991b1b', label: '✗ Vắng mặt' },
      DI_MUON: { bg: '#fef3c7', color: '#92400e', label: '⏰ Đi muộn' },
      VE_SOM: { bg: '#fef3c7', color: '#92400e', label: '⏰ Về sớm' },
      NGHI_PHEP: { bg: '#dbeafe', color: '#1e3a8a', label: '📋 Nghỉ phép' },
      TANG_CA: { bg: '#e0e7ff', color: '#3730a3', label: '🌙 Tăng ca' },
    };
    const s = statusStyles[status] || statusStyles.CO_MAT;
    return (
      <span style={{ background: s.bg, color: s.color, padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 500 }}>
        {s.label}
      </span>
    );
  };

  const stats = {
    total: filteredAttendance.length,
    present: filteredAttendance.filter(a => a.trangThai === 'CO_MAT').length,
    absent: filteredAttendance.filter(a => a.trangThai === 'VANG_MAT').length,
    late: filteredAttendance.filter(a => a.trangThai === 'DI_MUON').length,
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Quản lý Chấm công</h1>
          <p style={styles.subtitle}>Theo dõi giờ làm việc của nhân viên</p>
        </div>
        <button style={styles.checkInBtn} onClick={() => setShowCheckInModal(true)}>
          ⏱️ Chấm công
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #10b981' }}>
          <div style={styles.statValue}>{stats.present}</div>
          <div style={styles.statLabel}>Có mặt</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #ef4444' }}>
          <div style={styles.statValue}>{stats.absent}</div>
          <div style={styles.statLabel}>Vắng mặt</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #f59e0b' }}>
          <div style={styles.statValue}>{stats.late}</div>
          <div style={styles.statLabel}>Đi muộn</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #3b82f6' }}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Tổng số</div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.dateInput}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={styles.select}>
          <option value="ALL">Tất cả trạng thái</option>
          <option value="CO_MAT">Có mặt</option>
          <option value="VANG_MAT">Vắng mặt</option>
          <option value="DI_MUON">Đi muộn</option>
          <option value="NGHI_PHEP">Nghỉ phép</option>
          <option value="TANG_CA">Tăng ca</option>
        </select>
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nhân viên</th>
              <th style={styles.th}>Ngày</th>
              <th style={styles.th}>Giờ vào</th>
              <th style={styles.th}>Giờ ra</th>
              <th style={styles.th}>Số giờ làm</th>
              <th style={styles.th}>Trạng thái</th>
              <th style={styles.th}>Ghi chú</th>
              <th style={styles.th}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map(a => (
              <tr key={a.id} style={styles.tr}>
                <td style={styles.td}><strong>{a.nhanVien}</strong></td>
                <td style={styles.td}>{a.ngay}</td>
                <td style={styles.td}>{a.gioVao || '-'}</td>
                <td style={styles.td}>{a.gioRa || '-'}</td>
                <td style={styles.td}><strong>{a.soGioLam}h</strong></td>
                <td style={styles.td}>{getStatusBadge(a.trangThai)}</td>
                <td style={styles.td} title={a.ghiChu}>
                  {a.ghiChu ? a.ghiChu.slice(0, 30) + '...' : '-'}
                </td>
                <td style={styles.td}>
                  <button style={styles.editBtn}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 24, background: '#f8fafc', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 },
  subtitle: { color: '#64748b', fontSize: 14, margin: '4px 0 0 0' },
  checkInBtn: { padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: { background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  statValue: { fontSize: 32, fontWeight: 700, color: '#0f172a' },
  statLabel: { fontSize: 14, color: '#64748b', marginTop: 4 },
  filters: { display: 'flex', gap: 12, marginBottom: 20 },
  dateInput: { padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, minWidth: 200 },
  select: { padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, minWidth: 200 },
  tableCard: { background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 16px', textAlign: 'left', background: '#f1f5f9', fontSize: 13, fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: 14, color: '#334155' },
  editBtn: { padding: '6px 10px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 },
};
