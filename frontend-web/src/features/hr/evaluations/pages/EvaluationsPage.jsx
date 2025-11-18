import { useState, useMemo } from 'react';

// --- MOCK DATA (Cấu trúc theo DanhGiaDTO từ BE) ---
const mockEvaluations = [
  {
    danhGiaId: 1,
    nhanvienId: 101,
    tenNhanVien: 'Nguyễn Văn A',
    avatar: '👨‍💻',
    chucVu: 'Senior Developer',
    phongBan: 'Phòng IT',
    nguoiDanhGiaId: 201,
    tenNguoiDanhGia: 'Trần Minh Quân',
    kyDanhGia: 'Q4-2024',
    loaiDanhGia: 'HANG_QUY',
    diemChuyenMon: 8.5,
    diemThaiDo: 9.0,
    diemKyNangMem: 8.2,
    diemDongDoi: 8.8,
    diemTong: 8.6,
    xepLoai: 'TOT',
    nhanXet: 'Nhân viên làm việc tốt, nhiệt tình, có tinh thần trách nhiệm cao.',
    mucTieuTiepTheo: 'Hoàn thành dự án X trong Q1 2025',
    keHoachPhatTrien: 'Tham gia khóa học leadership',
    trangThai: 'CHO_DUYET',
    ngayBatDau: '2024-10-01',
    ngayKetThuc: '2024-12-31',
    ngayHoanThanh: null,
    createdAt: '2024-11-15T08:30:00'
  },
  {
    danhGiaId: 2,
    nhanvienId: 102,
    tenNhanVien: 'Trần Thị B',
    avatar: '👩‍💼',
    chucVu: 'HR Staff',
    phongBan: 'Phòng Nhân Sự',
    nguoiDanhGiaId: 202,
    tenNguoiDanhGia: 'Lê Thị Hoa',
    kyDanhGia: 'Q4-2024',
    loaiDanhGia: 'HANG_QUY',
    diemChuyenMon: 9.2,
    diemThaiDo: 9.5,
    diemKyNangMem: 9.0,
    diemDongDoi: 9.3,
    diemTong: 9.2,
    xepLoai: 'XUAT_SAC',
    nhanXet: 'Xuất sắc trong công việc, là tấm gương cho các nhân viên khác.',
    mucTieuTiepTheo: 'Lên kế hoạch tuyển dụng 2025',
    keHoachPhatTrien: 'Tham gia hội thảo HR toàn quốc',
    trangThai: 'DA_DUYET',
    ngayBatDau: '2024-10-01',
    ngayKetThuc: '2024-12-31',
    ngayHoanThanh: '2024-11-18',
    createdAt: '2024-11-10T10:00:00'
  },
  {
    danhGiaId: 3,
    nhanvienId: 103,
    tenNhanVien: 'Lê Văn C',
    avatar: '⚡',
    chucVu: 'Thử việc - Developer',
    phongBan: 'Phòng IT',
    nguoiDanhGiaId: 201,
    tenNguoiDanhGia: 'Trần Minh Quân',
    kyDanhGia: 'Tháng 11/2024',
    loaiDanhGia: 'THU_VIEC',
    diemChuyenMon: 7.0,
    diemThaiDo: 7.5,
    diemKyNangMem: 6.8,
    diemDongDoi: 7.2,
    diemTong: 7.1,
    xepLoai: 'KHA',
    nhanXet: 'Đáp ứng yêu cầu công việc, cần cải thiện kỹ năng giao tiếp.',
    mucTieuTiepTheo: 'Hoàn thành thử việc, học thêm React Native',
    keHoachPhatTrien: 'Mentoring từ senior developer',
    trangThai: 'CHO_DUYET',
    ngayBatDau: '2024-11-01',
    ngayKetThuc: '2024-11-30',
    ngayHoanThanh: null,
    createdAt: '2024-11-16T14:20:00'
  },
  {
    danhGiaId: 4,
    tenNhanVien: 'Phạm Thị D',
    avatar: '📊',
    chucVu: 'Accountant',
    phongBan: 'Phòng Kế Toán',
    nguoiDanhGiaId: 203,
    tenNguoiDanhGia: 'Nguyễn Văn Tài',
    kyDanhGia: '2024',
    loaiDanhGia: 'HANG_NAM',
    diemChuyenMon: 6.0,
    diemThaiDo: 6.5,
    diemKyNangMem: 6.2,
    diemDongDoi: 6.0,
    diemTong: 6.2,
    xepLoai: 'TRUNG_BINH',
    nhanXet: 'Công việc đạt yêu cầu nhưng chưa có điểm nổi bật.',
    mucTieuTiepTheo: 'Cải thiện kỹ năng Excel và báo cáo',
    keHoachPhatTrien: 'Đào tạo thêm về phần mềm kế toán',
    trangThai: 'TU_CHOI',
    ngayBatDau: '2024-01-01',
    ngayKetThuc: '2024-12-31',
    ngayHoanThanh: null,
    createdAt: '2024-11-12T09:00:00'
  },
  {
    danhGiaId: 5,
    nhanvienId: 105,
    tenNhanVien: 'Hoàng Văn E',
    avatar: '🎯',
    chucVu: 'Marketing Manager',
    phongBan: 'Phòng Marketing',
    nguoiDanhGiaId: 204,
    tenNguoiDanhGia: 'Phạm Thu Hà',
    kyDanhGia: 'Q3-2024',
    loaiDanhGia: 'THANG_CHUC',
    diemChuyenMon: 8.8,
    diemThaiDo: 9.2,
    diemKyNangMem: 8.5,
    diemDongDoi: 9.0,
    diemTong: 8.9,
    xepLoai: 'TOT',
    nhanXet: 'Đạt yêu cầu thăng chức, lãnh đạo tốt, tầm nhìn chiến lược.',
    mucTieuTiepTheo: 'Mở rộng thị trường khu vực miền Bắc',
    keHoachPhatTrien: 'Khóa đào tạo Digital Marketing chuyên sâu',
    trangThai: 'DANG_DANH_GIA',
    ngayBatDau: '2024-07-01',
    ngayKetThuc: '2024-09-30',
    ngayHoanThanh: null,
    createdAt: '2024-11-18T11:15:00'
  }
];

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState(mockEvaluations);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEval, setSelectedEval] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');
  const [approvalAction, setApprovalAction] = useState(null); // 'APPROVE' or 'REJECT'

  // --- LOGIC ---
  const filteredEvals = useMemo(() => {
    return evaluations.filter(e => {
      const matchStatus = filterStatus === 'ALL' || e.trangThai === filterStatus;
      const matchSearch = e.tenNhanVien.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [evaluations, filterStatus, searchTerm]);

  const stats = {
    total: evaluations.length,
    pending: evaluations.filter(e => e.trangThai === 'CHO_DUYET').length,
    approved: evaluations.filter(e => e.trangThai === 'DA_DUYET').length,
    excellent: evaluations.filter(e => e.xepLoai === 'XUAT_SAC').length,
    avgScore: evaluations.length > 0 
      ? (evaluations.reduce((sum, e) => sum + (e.diemTong || 0), 0) / evaluations.length).toFixed(1)
      : 0
  };

  // --- HANDLERS ---
  const openApprovalModal = (evalItem, action) => {
    setSelectedEval(evalItem);
    setApprovalAction(action);
    setApprovalNote('');
    setShowApprovalModal(true);
  };

  const handleApprovalSubmit = () => {
    if (!selectedEval) return;
    
    // Giả lập gọi API PATCH /api/danh-gia/{id}/approve hoặc /reject
    const newStatus = approvalAction === 'APPROVE' ? 'DA_DUYET' : 'TU_CHOI';
    setEvaluations(prev => prev.map(e => 
      e.danhGiaId === selectedEval.danhGiaId
        ? { ...e, trangThai: newStatus, ngayHoanThanh: new Date().toISOString().split('T')[0] }
        : e
    ));
    
    alert(`Đã ${approvalAction === 'APPROVE' ? 'phê duyệt' : 'từ chối'} đánh giá!`);
    setShowApprovalModal(false);
  };

  // --- BADGE HELPERS ---
  const getStatusBadge = (status) => {
    const config = {
      DANG_DANH_GIA: { bg: '#e0f2fe', color: '#0369a1', label: '📋 Đang đánh giá', border: '#bae6fd' },
      CHO_DUYET: { bg: '#fff7ed', color: '#c2410c', label: '⏳ Chờ duyệt', border: '#fed7aa' },
      DA_DUYET: { bg: '#f0fdf4', color: '#15803d', label: '✓ Đã duyệt', border: '#dcfce7' },
      TU_CHOI: { bg: '#fef2f2', color: '#b91c1c', label: '✗ Từ chối', border: '#fecaca' },
    };
    const s = config[status] || config.DANG_DANH_GIA;
    return (
      <span style={{
        display: 'inline-block', padding: '6px 12px', borderRadius: '20px',
        fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
        background: s.bg, color: s.color, border: `1px solid ${s.border}`
      }}>
        {s.label}
      </span>
    );
  };

  const getRankBadge = (rank) => {
    const config = {
      XUAT_SAC: { color: '#059669', bg: '#ecfdf5', label: 'XUẤT SẮC', icon: '🏆' },
      TOT: { color: '#2563eb', bg: '#eff6ff', label: 'TỐT', icon: '👍' },
      KHA: { color: '#f59e0b', bg: '#fff7ed', label: 'KHÁ', icon: '⭐' },
      TRUNG_BINH: { color: '#8b5cf6', bg: '#f5f3ff', label: 'TRUNG BÌNH', icon: '📊' },
      YEU: { color: '#ef4444', bg: '#fef2f2', label: 'YẾU', icon: '⚠️' }
    };
    const r = config[rank] || { color: '#6b7280', bg: '#f3f4f6', label: rank, icon: '' };
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '5px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 700,
        background: r.bg, color: r.color
      }}>
        {r.icon} {r.label}
      </span>
    );
  };

  const getEvalTypeBadge = (type) => {
    const types = {
      HANG_QUY: { label: 'Hàng quý', icon: '📅' },
      HANG_NAM: { label: 'Hàng năm', icon: '🎆' },
      THU_VIEC: { label: 'Thử việc', icon: '👤' },
      THANG_CHUC: { label: 'Thăng chức', icon: '🚀' },
      DANG_KY_TANG_LUONG: { label: 'Tăng lương', icon: '💰' }
    };
    const t = types[type] || { label: type, icon: '📝' };
    return `${t.icon} ${t.label}`;
  };

  return (
    <div style={s.container}>
      {/* HEADER */}
      <div style={s.headerWrapper}>
        <div>
          <div style={s.breadcrumb}>Quản lý nhân sự / Đánh giá</div>
          <h1 style={s.pageTitle}>Đánh giá Hiệu suất Nhân viên</h1>
          <p style={s.subtitle}>{stats.approved} đã duyệt, {stats.pending} chờ duyệt, điểm trung bình: {stats.avgScore}</p>
        </div>
        <button style={s.btnAdd}>
          <span style={{marginRight: 6}}>+</span> Tạo đánh giá mới
        </button>
      </div>

      {/* STATS CARDS */}
      <div style={s.statsGrid}>
        <StatCard title="Tổng đánh giá" value={stats.total} icon="📊" color="#6366f1" bg="#eef2ff" />
        <StatCard title="Chờ duyệt" value={stats.pending} icon="⏳" color="#f59e0b" bg="#fffbeb" />
        <StatCard title="Đã duyệt" value={stats.approved} icon="✓" color="#10b981" bg="#f0fdf4" />
        <StatCard title="Xuất sắc" value={stats.excellent} icon="🏆" color="#ec4899" bg="#fdf2f8" />
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
          <option value="DANG_DANH_GIA">Đang đánh giá</option>
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
              <th style={{...s.th, width: '20%'}}>Nhân viên</th>
              <th style={{...s.th, width: '10%'}}>Kỳ đánh giá</th>
              <th style={{...s.th, width: '8%'}}>CM</th>
              <th style={{...s.th, width: '8%'}}>TĐ</th>
              <th style={{...s.th, width: '8%'}}>KN</th>
              <th style={{...s.th, width: '8%'}}>ĐĐ</th>
              <th style={{...s.th, width: '8%'}}>Điểm TB</th>
              <th style={{...s.th, width: '12%', textAlign: 'center'}}>Xếp loại</th>
              <th style={{...s.th, width: '10%', textAlign: 'center'}}>Trạng thái</th>
              <th style={{...s.th, width: '10%', textAlign: 'center'}}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvals.map(e => (
              <tr key={e.danhGiaId} style={s.tr}>
                <td style={s.td}>
                  <div style={s.profileCell}>
                    <div style={s.avatarBox}>{e.avatar || '👤'}</div>
                    <div>
                      <div style={s.empName}>{e.tenNhanVien}</div>
                      <div style={s.empRole}>{e.chucVu}</div>
                    </div>
                  </div>
                </td>
                <td style={s.td}>
                  <div style={{fontSize: 12, fontWeight: 600}}>{e.kyDanhGia}</div>
                  <div style={{fontSize: 11, color: '#7b809a'}}>{getEvalTypeBadge(e.loaiDanhGia)}</div>
                </td>
                <td style={s.td}><span style={s.scoreBox}>{e.diemChuyenMon}</span></td>
                <td style={s.td}><span style={s.scoreBox}>{e.diemThaiDo}</span></td>
                <td style={s.td}><span style={s.scoreBox}>{e.diemKyNangMem}</span></td>
                <td style={s.td}><span style={s.scoreBox}>{e.diemDongDoi}</span></td>
                <td style={s.td}><span style={s.totalScore}>{e.diemTong}</span></td>
                <td style={{...s.td, textAlign: 'center'}}>{getRankBadge(e.xepLoai)}</td>
                <td style={{...s.td, textAlign: 'center'}}>{getStatusBadge(e.trangThai)}</td>
                <td style={s.tdActions}>
                  <div style={s.actionGroup}>
                    {e.trangThai === 'CHO_DUYET' && (
                      <>
                        <button 
                          style={s.approveBtn} 
                          onClick={() => openApprovalModal(e, 'APPROVE')}
                          title="Phê duyệt"
                        >
                          ✓
                        </button>
                        <button 
                          style={s.rejectBtn} 
                          onClick={() => openApprovalModal(e, 'REJECT')}
                          title="Từ chối"
                        >
                          ✗
                        </button>
                      </>
                    )}
                    <button style={s.viewBtn} onClick={() => setSelectedEval(e)} title="Xem chi tiết">
                      👁️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEvals.length === 0 && (
          <div style={s.emptyState}>Không tìm thấy đánh giá nào.</div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedEval && !showApprovalModal && (
        <div style={s.modalOverlay} onClick={() => setSelectedEval(null)}>
          <div style={{...s.modal, maxWidth: 700}} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>Chi tiết Đánh giá #{selectedEval.danhGiaId}</h3>
              <button style={s.closeBtn} onClick={() => setSelectedEval(null)}>×</button>
            </div>
            
            <div style={s.modalBody}>
              {/* Info Section */}
              <div style={s.infoSection}>
                <div style={s.profileCell}>
                  <div style={{...s.avatarBox, width: 48, height: 48, fontSize: 24}}>{selectedEval.avatar || '👤'}</div>
                  <div>
                    <div style={{...s.empName, fontSize: 16}}>{selectedEval.tenNhanVien}</div>
                    <div style={s.empRole}>{selectedEval.chucVu} - {selectedEval.phongBan}</div>
                  </div>
                </div>
                <div>{getRankBadge(selectedEval.xepLoai)}</div>
              </div>

              {/* Eval Info */}
              <div style={s.detailGrid}>
                <div style={s.detailItem}>
                  <label style={s.detailLabel}>Kỳ đánh giá</label>
                  <div style={s.detailValue}>{selectedEval.kyDanhGia}</div>
                </div>
                <div style={s.detailItem}>
                  <label style={s.detailLabel}>Loại đánh giá</label>
                  <div style={s.detailValue}>{getEvalTypeBadge(selectedEval.loaiDanhGia)}</div>
                </div>
                <div style={s.detailItem}>
                  <label style={s.detailLabel}>Người đánh giá</label>
                  <div style={s.detailValue}>{selectedEval.tenNguoiDanhGia}</div>
                </div>
                <div style={s.detailItem}>
                  <label style={s.detailLabel}>Trạng thái</label>
                  <div style={s.detailValue}>{getStatusBadge(selectedEval.trangThai)}</div>
                </div>
              </div>

              {/* Scores Section */}
              <div style={s.scoresSection}>
                <h4 style={s.sectionTitle}>📊 Chi tiết điểm số</h4>
                <div style={s.scoresGrid}>
                  <ScoreItem label="Chuyên môn" score={selectedEval.diemChuyenMon} color="#3b82f6" />
                  <ScoreItem label="Thái độ" score={selectedEval.diemThaiDo} color="#10b981" />
                  <ScoreItem label="Kỹ năng mềm" score={selectedEval.diemKyNangMem} color="#f59e0b" />
                  <ScoreItem label="Đồng đội" score={selectedEval.diemDongDoi} color="#8b5cf6" />
                </div>
                <div style={s.totalScoreBox}>
                  <span>Tổng điểm:</span>
                  <span style={s.bigScore}>{selectedEval.diemTong}</span>
                </div>
              </div>

              {/* Comments Section */}
              {selectedEval.nhanXet && (
                <div style={s.commentSection}>
                  <label style={s.detailLabel}>📝 Nhận xét</label>
                  <div style={s.commentBox}>{selectedEval.nhanXet}</div>
                </div>
              )}
              
              {selectedEval.mucTieuTiepTheo && (
                <div style={s.commentSection}>
                  <label style={s.detailLabel}>🎯 Mục tiêu tiếp theo</label>
                  <div style={s.commentBox}>{selectedEval.mucTieuTiepTheo}</div>
                </div>
              )}
              
              {selectedEval.keHoachPhatTrien && (
                <div style={s.commentSection}>
                  <label style={s.detailLabel}>🚀 Kế hoạch phát triển</label>
                  <div style={s.commentBox}>{selectedEval.keHoachPhatTrien}</div>
                </div>
              )}
            </div>
            
            <div style={s.modalFooter}>
              <button style={s.btnCancel} onClick={() => setSelectedEval(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVAL MODAL */}
      {showApprovalModal && selectedEval && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>
                {approvalAction === 'APPROVE' ? '🟢 Phê duyệt' : '🔴 Từ chối'} Đánh giá
              </h3>
              <button style={s.closeBtn} onClick={() => setShowApprovalModal(false)}>×</button>
            </div>
            
            <div style={s.modalBody}>
              <div style={{...s.infoSection, marginBottom: 16}}>
                Đánh giá cho <b>{selectedEval.tenNhanVien}</b> - {selectedEval.kyDanhGia}
              </div>
              
              <div style={s.formGroup}>
                <label style={s.label}>
                  {approvalAction === 'APPROVE' ? 'Ghi chú (không bắt buộc)' : 'Lý do từ chối *'}
                </label>
                <textarea 
                  style={s.textarea}
                  placeholder={approvalAction === 'APPROVE' ? 'Nhập ghi chú...' : 'Nhập lý do từ chối...'}
                  value={approvalNote}
                  onChange={e => setApprovalNote(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            
            <div style={s.modalFooter}>
              <button style={s.btnCancel} onClick={() => setShowApprovalModal(false)}>Hủy</button>
              <button 
                style={approvalAction === 'APPROVE' ? s.btnApprove : s.btnReject}
                onClick={handleApprovalSubmit}
              >
                {approvalAction === 'APPROVE' ? '✓ Phê duyệt' : '✗ Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB COMPONENTS ---
function StatCard({ title, value, icon, color, bg }) {
  return (
    <div style={{...s.statCard, background: bg, borderLeft: `4px solid ${color}`}}>
      <div style={s.statContent}>
        <div>
          <div style={{...s.statTitle, color: color}}>{title}</div>
          <div style={{...s.statValue, color: color}}>{value}</div>
        </div>
        <div style={{...s.statIcon, color: color}}>{icon}</div>
      </div>
    </div>
  );
}

function ScoreItem({ label, score, color }) {
  return (
    <div style={s.scoreItem}>
      <div style={s.scoreLabel}>{label}</div>
      <div style={{...s.scoreValue, color: color}}>{score}</div>
      <div style={{...s.scoreBar, background: `${color}20`}}>
        <div style={{...s.scoreBarFill, width: `${score * 10}%`, background: color}} />
      </div>
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
  subtitle: {
    fontSize: 14, color: '#7b809a', margin: '4px 0 0 0'
  },
  btnAdd: {
    background: 'linear-gradient(195deg, #6366f1, #4f46e5)',
    color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px',
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center'
  },

  // Stats
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24
  },
  statCard: {
    padding: 20, borderRadius: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
  },
  statContent: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  statTitle: { fontSize: 13, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 },
  statValue: { fontSize: 28, fontWeight: 700 },
  statIcon: { fontSize: 24, opacity: 0.8 },

  // Filter
  filterBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 24, background: '#fff', padding: 16, borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
  },
  searchWrapper: {
    position: 'relative', display: 'flex', alignItems: 'center', width: 300
  },
  searchIcon: { position: 'absolute', left: 12, color: '#7b809a' },
  searchInput: {
    width: '100%', padding: '10px 12px 10px 40px', border: '1px solid #d2d6da',
    borderRadius: 8, outline: 'none', fontSize: 14
  },
  filterSelect: {
    padding: '10px 12px', border: '1px solid #d2d6da', borderRadius: 8,
    outline: 'none', fontSize: 14, minWidth: 180, cursor: 'pointer', color: '#344767'
  },

  // Table
  tableCard: {
    background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    overflow: 'hidden', border: '1px solid rgba(0,0,0,0.02)'
  },
  table: { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' },
  th: {
    padding: '16px 12px', textAlign: 'left', fontSize: 12, fontWeight: 700,
    color: '#7b809a', textTransform: 'uppercase', borderBottom: '1px solid #f0f2f5', background: '#fff'
  },
  tr: { borderBottom: '1px solid #f0f2f5' },
  td: { padding: '14px 12px', fontSize: 14, verticalAlign: 'middle', color: '#344767' },
  tdActions: { padding: '14px 12px', textAlign: 'center' },

  // Cells
  profileCell: { display: 'flex', alignItems: 'center', gap: 12 },
  avatarBox: {
    width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(195deg, #42424a, #191919)',
    color: '#fff', display: 'grid', placeItems: 'center', fontSize: 16, boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  empName: { fontWeight: 600, fontSize: 14 },
  empRole: { fontSize: 12, color: '#7b809a' },

  scoreBox: {
    background: '#e0f2fe', color: '#0369a1', padding: '4px 8px',
    borderRadius: 6, fontSize: 13, fontWeight: 700, display: 'inline-block'
  },
  totalScore: {
    background: 'linear-gradient(195deg, #ec4899, #d946ef)', color: '#fff',
    padding: '6px 12px', borderRadius: 8, fontSize: 15, fontWeight: 700, display: 'inline-block'
  },

  // Actions
  actionGroup: { display: 'flex', justifyContent: 'center', gap: 8 },
  approveBtn: {
    padding: '8px 10px', background: '#10b981', color: '#fff', border: 'none',
    borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600
  },
  rejectBtn: {
    padding: '8px 10px', background: '#ef4444', color: '#fff', border: 'none',
    borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600
  },
  viewBtn: {
    padding: '8px 10px', background: '#e9ecef', color: '#344767', border: 'none',
    borderRadius: 6, cursor: 'pointer', fontSize: 14
  },
  emptyState: { textAlign: 'center', padding: 40, color: '#7b809a', fontSize: 16 },

  // Modal
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modal: {
    background: '#fff', borderRadius: 16, width: 550, maxWidth: '95%',
    maxHeight: '90vh', display: 'flex', flexDirection: 'column',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
  },
  modalHeader: {
    padding: '20px 24px', borderBottom: '1px solid #f0f2f5',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: '#344767' },
  closeBtn: { border: 'none', background: 'none', fontSize: 24, color: '#7b809a', cursor: 'pointer' },
  modalBody: { padding: 20, overflowY: 'auto', flex: 1 },

  infoSection: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: 16, borderBottom: '1px solid #f0f2f5', marginBottom: 16
  },

  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 },
  detailItem: {},
  detailLabel: {
    fontSize: 12, color: '#7b809a', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase'
  },
  detailValue: { fontSize: 14, color: '#344767', fontWeight: 500 },

  // Scores Section
  scoresSection: {
    background: '#f8f9fa', padding: 16, borderRadius: 12, marginBottom: 16
  },
  sectionTitle: { margin: '0 0 16px 0', fontSize: 15, fontWeight: 700, color: '#344767' },
  scoresGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 },
  scoreItem: { display: 'flex', flexDirection: 'column', gap: 4 },
  scoreLabel: { fontSize: 12, color: '#7b809a', fontWeight: 600 },
  scoreValue: { fontSize: 20, fontWeight: 700 },
  scoreBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 3, transition: 'width 0.3s' },
  totalScoreBox: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#fff', padding: 12, borderRadius: 8, border: '2px solid #e5e7eb'
  },
  bigScore: { fontSize: 32, fontWeight: 700, color: '#ec4899' },

  // Comments
  commentSection: { marginBottom: 12 },
  commentBox: {
    background: '#fff', padding: 10, borderRadius: 8, fontSize: 13, lineHeight: 1.5,
    border: '1px solid #e9ecef', color: '#344767'
  },

  // Form
  formGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 14, fontWeight: 600, color: '#344767' },
  textarea: {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d2d6da',
    outline: 'none', fontSize: 14, minHeight: 80, resize: 'vertical',
    color: '#344767', background: '#fff', fontFamily: 'inherit', boxSizing: 'border-box'
  },

  modalFooter: {
    padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: 12,
    borderTop: '1px solid #f0f2f5'
  },
  btnCancel: {
    padding: '10px 20px', borderRadius: 8, border: 'none', background: '#f0f2f5',
    color: '#7b809a', fontWeight: 600, cursor: 'pointer'
  },
  btnApprove: {
    padding: '10px 24px', borderRadius: 8, border: 'none',
    background: 'linear-gradient(195deg, #10b981, #059669)', color: '#fff',
    fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  btnReject: {
    padding: '10px 24px', borderRadius: 8, border: 'none',
    background: 'linear-gradient(195deg, #ef4444, #dc2626)', color: '#fff',
    fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }
};
