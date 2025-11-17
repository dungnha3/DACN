import { useState } from 'react';

const mockContracts = [
  { id: 1, nhanVien: 'Nguyễn Văn A', loaiHopDong: 'HOP_DONG_VO_THOI_HAN', ngayBatDau: '2023-01-15', ngayKetThuc: null, luongCoBan: 15000000, trangThai: 'DANG_HIEU_LUC' },
  { id: 2, nhanVien: 'Trần Thị B', loaiHopDong: 'HOP_DONG_XAC_DINH_THOI_HAN', ngayBatDau: '2024-01-01', ngayKetThuc: '2025-12-31', luongCoBan: 12000000, trangThai: 'DANG_HIEU_LUC' },
  { id: 3, nhanVien: 'Lê Văn C', loaiHopDong: 'HOP_DONG_THU_VIEC', ngayBatDau: '2024-11-01', ngayKetThuc: '2024-12-31', luongCoBan: 10000000, trangThai: 'DANG_HIEU_LUC' },
];

export default function ContractsPage() {
  const [contracts, setContracts] = useState(mockContracts);
  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const getContractTypeBadge = (type) => {
    const types = {
      HOP_DONG_THU_VIEC: { label: '📝 Hợp đồng thử việc', color: '#f59e0b' },
      HOP_DONG_XAC_DINH_THOI_HAN: { label: '📋 HĐ xác định thời hạn', color: '#3b82f6' },
      HOP_DONG_VO_THOI_HAN: { label: '📜 HĐ vô thời hạn', color: '#10b981' },
    };
    const t = types[type];
    return <span style={{ color: t.color, fontWeight: 600 }}>{t.label}</span>;
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Quản lý Hợp đồng</h1>
          <p style={s.subtitle}>{contracts.length} hợp đồng</p>
        </div>
        <button style={s.addBtn}>➕ Tạo hợp đồng mới</button>
      </div>

      <div style={s.tableCard}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Nhân viên</th>
              <th style={s.th}>Loại hợp đồng</th>
              <th style={s.th}>Ngày bắt đầu</th>
              <th style={s.th}>Ngày kết thúc</th>
              <th style={s.th}>Lương cơ bản</th>
              <th style={s.th}>Trạng thái</th>
              <th style={s.th}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(c => (
              <tr key={c.id} style={s.tr}>
                <td style={s.td}><strong>{c.nhanVien}</strong></td>
                <td style={s.td}>{getContractTypeBadge(c.loaiHopDong)}</td>
                <td style={s.td}>{c.ngayBatDau}</td>
                <td style={s.td}>{c.ngayKetThuc || 'Vô thời hạn'}</td>
                <td style={s.td}>{formatCurrency(c.luongCoBan)}</td>
                <td style={s.td}><span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '12px', fontSize: '13px' }}>✓ Đang hiệu lực</span></td>
                <td style={s.td}>
                  <button style={s.viewBtn}>👁️</button>
                  <button style={s.printBtn}>🖨️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  tableCard: { background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 16px', textAlign: 'left', background: '#f1f5f9', fontSize: 13, fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: 14, color: '#334155' },
  viewBtn: { padding: '6px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, marginRight: 8 },
  printBtn: { padding: '6px 12px', background: '#64748b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 },
};
