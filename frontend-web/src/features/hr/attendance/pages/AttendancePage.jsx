import { useState, useMemo, useEffect } from 'react';
import { attendanceService } from '@/features/hr/shared/services';

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get current date
  const today = new Date().toISOString().split('T')[0];
  const [filterDate, setFilterDate] = useState(today);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [showGPSModal, setShowGPSModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Fetch attendance data
  useEffect(() => {
    fetchAttendanceData();
  }, [filterDate]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch data by date range (same day for start and end)
      const data = await attendanceService.getByDateRange(filterDate, filterDate);
      setAttendanceData(data || []);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Không thể tải dữ liệu chấm công');
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC ---
  const filteredData = useMemo(() => {
    return attendanceData.filter(item => {
      const matchDate = item.ngayCham === filterDate;
      const matchStatus = filterStatus === 'ALL' || item.trangThai === filterStatus;
      const matchSearch = item.hoTenNhanVien.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDate && matchStatus && matchSearch;
    });
  }, [attendanceData, filterDate, filterStatus, searchTerm]);

  const stats = {
    total: filteredData.length,
    present: filteredData.filter(a => a.gioVao).length,
    late: filteredData.filter(a => a.isLate || a.trangThai === 'DI_TRE').length,
    early: filteredData.filter(a => a.isEarlyLeave || a.trangThai === 'VE_SOM').length,
    absent: filteredData.filter(a => !a.gioVao && a.trangThai.includes('NGHI')).length
  };

  // --- HANDLERS ---
  const handleGPSCheckIn = async () => {
    setIsSimulating(true);
    try {
      // Lấy tọa độ GPS
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const gpsData = {
                // Backend sẽ tự động lấy nhanvienId từ user hiện tại
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                diaChiCheckin: 'Vị trí hiện tại'
              };
              
              await attendanceService.gpsCheckIn(gpsData);
              alert('✅ Chấm công GPS thành công!');
              setShowGPSModal(false);
              fetchAttendanceData(); // Refresh data
            } catch (err) {
              console.error('GPS check-in error:', err);
              alert('❌ Chấm công thất bại: ' + (err.response?.data?.message || err.message));
            } finally {
              setIsSimulating(false);
            }
          },
          (error) => {
            alert('❌ Không thể lấy vị trí GPS');
            setIsSimulating(false);
          }
        );
      } else {
        alert('❌ Trình duyệt không hỗ trợ GPS');
        setIsSimulating(false);
      }
    } catch (err) {
      alert('❌ Lỗi: ' + err.message);
      setIsSimulating(false);
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setShowEditModal(true);
  };

  // --- HELPERS ---
  const getStatusBadge = (status) => {
    const config = {
      DU_GIO: { bg: '#ecfdf5', color: '#059669', label: 'Đúng giờ', border: '#a7f3d0' },
      DI_TRE: { bg: '#fffbeb', color: '#d97706', label: 'Đi muộn', border: '#fde68a' },
      VE_SOM: { bg: '#fff7ed', color: '#ea580c', label: 'Về sớm', border: '#fed7aa' },
      NGHI_PHEP: { bg: '#eff6ff', color: '#2563eb', label: 'Nghỉ phép', border: '#bfdbfe' },
      NGHI_KHONG_PHEP: { bg: '#fef2f2', color: '#dc2626', label: 'Vắng mặt', border: '#fecaca' }
    };
    const s = config[status] || { bg: '#f3f4f6', color: '#4b5563', label: 'Chưa rõ', border: '#e5e7eb' };
    
    return (
      <span style={{
        display: 'inline-block', padding: '4px 10px', borderRadius: '20px',
        fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
        background: s.bg, color: s.color, border: `1px solid ${s.border}`
      }}>
        {s.label}
      </span>
    );
  };

  const getMethodIcon = (method) => {
    if (method === 'GPS') return <span title="GPS Check-in">📡</span>;
    if (method === 'FACE_ID') return <span title="Face ID">🙂</span>;
    if (method === 'MANUAL') return <span title="Thủ công">📝</span>;
    return <span title="Chưa chấm">-</span>;
  };

  return (
    <div style={s.container}>
      {/* HEADER */}
      <div style={s.headerWrapper}>
        <div>
          <div style={s.breadcrumb}>Quản lý nhân sự / Chấm công</div>
          <h1 style={s.pageTitle}>Theo dõi Chấm Công</h1>
        </div>
        <button style={s.btnGPS} onClick={() => setShowGPSModal(true)}>
          📍 Check-in GPS
        </button>
      </div>

      {/* STATS CARDS */}
      <div style={s.statsGrid}>
        <StatCard title="Tổng nhân sự" value={stats.total} icon="👥" color="#4b5563" bg="#f3f4f6" />
        <StatCard title="Có mặt" value={stats.present} icon="✅" color="#059669" bg="#ecfdf5" />
        <StatCard title="Đi muộn / Về sớm" value={stats.late + stats.early} icon="⚠️" color="#d97706" bg="#fffbeb" />
        <StatCard title="Vắng mặt" value={stats.absent} icon="🚫" color="#dc2626" bg="#fef2f2" />
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
        <div style={s.filterGroup}>
          <input 
            type="date" 
            style={s.dateInput}
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
          <select 
            style={s.filterSelect} 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="DU_GIO">Đúng giờ</option>
            <option value="DI_TRE">Đi muộn</option>
            <option value="VE_SOM">Về sớm</option>
            <option value="NGHI_PHEP">Nghỉ phép</option>
            <option value="NGHI_KHONG_PHEP">Vắng mặt</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div style={s.tableCard}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={{...s.th, width: '25%'}}>Nhân viên</th>
              <th style={{...s.th, width: '10%'}}>Giờ vào</th>
              <th style={{...s.th, width: '10%'}}>Giờ ra</th>
              <th style={{...s.th, width: '8%'}}>Giờ làm</th>
              <th style={{...s.th, width: '20%'}}>Địa điểm / Ghi chú</th>
              <th style={{...s.th, width: '12%', textAlign: 'center'}}>Trạng thái</th>
              <th style={{...s.th, width: '15%', textAlign: 'center'}}>Phương thức</th>
              <th style={{...s.th, width: '5%'}}></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(row => (
              <tr key={row.chamcongId} style={s.tr}>
                <td style={s.td}>
                  <div style={s.profileCell}>
                    <div style={s.avatarBox}>{row.avatar}</div>
                    <div>
                      <div style={s.empName}>{row.hoTenNhanVien}</div>
                      <div style={s.empRole}>{row.chucVu}</div>
                    </div>
                  </div>
                </td>
                <td style={s.td}>
                  <div style={{fontWeight: 600, color: row.isLate ? '#d97706' : '#344767'}}>
                    {row.gioVao || '--:--'}
                  </div>
                </td>
                <td style={s.td}>
                   <div style={{fontWeight: 600, color: row.isEarlyLeave ? '#d97706' : '#344767'}}>
                    {row.gioRa || '--:--'}
                  </div>
                </td>
                <td style={s.td}>
                  {row.soGioLam > 0 ? 
                    <span style={s.workHours}>{row.soGioLam}h</span> : 
                    <span style={{color: '#adb5bd'}}>-</span>
                  }
                </td>
                <td style={s.td}>
                  <div style={s.locationCell}>
                    {row.diaChiCheckin ? (
                      <div style={s.addressText} title={row.diaChiCheckin}>{row.diaChiCheckin}</div>
                    ) : (
                      <div style={{color: '#adb5bd', fontSize: 12}}>Không có địa điểm</div>
                    )}
                    {row.ghiChu && <div style={s.noteText}>Note: {row.ghiChu}</div>}
                  </div>
                </td>
                <td style={{...s.td, textAlign: 'center'}}>
                  {getStatusBadge(row.trangThai)}
                </td>
                <td style={{...s.td, textAlign: 'center'}}>
                   <div style={s.methodBadge}>
                      {getMethodIcon(row.phuongThuc)} 
                      <span style={{marginLeft: 4}}>{row.phuongThuc || 'N/A'}</span>
                   </div>
                </td>
                <td style={s.td}>
                  <button style={s.editBtn} onClick={() => handleEdit(row)} title="Sửa công">
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GPS MODAL */}
      {showGPSModal && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>📍 Chấm công GPS</h3>
              <button style={s.closeBtn} onClick={() => setShowGPSModal(false)}>×</button>
            </div>
            <div style={s.modalBody}>
              <div style={s.gpsPlaceholder}>
                {isSimulating ? (
                  <div style={s.loadingPulse}>📡 Đang xác định vị trí...</div>
                ) : (
                  <>
                     <div style={{fontSize: 40, marginBottom: 10}}>🗺️</div>
                     <div>Vị trí hiện tại: <b>Văn phòng HCM</b></div>
                     <div style={{fontSize: 12, color: '#7b809a'}}>Bán kính chính xác: 10m</div>
                  </>
                )}
              </div>
              <button 
                style={s.confirmBtn} 
                onClick={handleGPSCheckIn}
                disabled={isSimulating}
              >
                {isSimulating ? 'Đang xử lý...' : 'Xác nhận Check-in'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB COMPONENT ---
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
  )
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
  btnGPS: {
    background: 'linear-gradient(195deg, #059669, #10b981)',
    color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px',
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)',
    transition: 'transform 0.2s'
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
    borderRadius: 8, outline: 'none', fontSize: 14, background: '#fff', color: '#344767'
  },
  filterGroup: { display: 'flex', gap: 12 },
  dateInput: {
    padding: '10px 12px', border: '1px solid #d2d6da', borderRadius: 8,
    outline: 'none', fontSize: 14, color: '#344767', background: '#fff'
  },
  filterSelect: {
    padding: '10px 12px', border: '1px solid #d2d6da', borderRadius: 8,
    outline: 'none', fontSize: 14, minWidth: 160, cursor: 'pointer', color: '#344767', background: '#fff'
  },

  // Table
  tableCard: {
    background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    overflow: 'hidden', border: '1px solid rgba(0,0,0,0.02)'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700,
    color: '#7b809a', textTransform: 'uppercase', borderBottom: '1px solid #f0f2f5', background: '#fff'
  },
  tr: { borderBottom: '1px solid #f0f2f5' },
  td: { padding: '14px 20px', fontSize: 14, verticalAlign: 'middle', color: '#344767' },
  
  // Cells
  profileCell: { display: 'flex', alignItems: 'center', gap: 12 },
  avatarBox: {
    width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(195deg, #42424a, #191919)',
    color: '#fff', display: 'grid', placeItems: 'center', fontSize: 16, boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  empName: { fontWeight: 600, fontSize: 14 },
  empRole: { fontSize: 12, color: '#7b809a' },
  
  workHours: {
    background: '#e0e7ff', color: '#3730a3', padding: '4px 8px', 
    borderRadius: 6, fontSize: 12, fontWeight: 700
  },
  locationCell: { display: 'flex', flexDirection: 'column', gap: 2 },
  addressText: { fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 },
  noteText: { fontSize: 12, color: '#ef4444', fontStyle: 'italic' },
  
  methodBadge: {
    display: 'inline-flex', alignItems: 'center', padding: '4px 8px',
    background: '#f8f9fa', borderRadius: 6, fontSize: 12, color: '#4b5563', border: '1px solid #e9ecef'
  },
  editBtn: {
    border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16, opacity: 0.6, transition: 'opacity 0.2s'
  },

  // Modal
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', 
    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modal: {
    background: '#fff', borderRadius: 16, width: 400, maxWidth: '90%',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: 24
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20
  },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 700 },
  closeBtn: { border: 'none', background: 'none', fontSize: 24, cursor: 'pointer', color: '#7b809a' },
  modalBody: { textAlign: 'center' },
  gpsPlaceholder: {
    background: '#f0f9ff', padding: 30, borderRadius: 12, marginBottom: 20, border: '2px dashed #bae6fd'
  },
  loadingPulse: { color: '#0284c7', fontWeight: 600, fontSize: 14 },
  confirmBtn: {
    width: '100%', padding: '12px', borderRadius: 8, border: 'none',
    background: 'linear-gradient(195deg, #3b82f6, #2563eb)', color: '#fff', fontWeight: 700, cursor: 'pointer'
  }
};