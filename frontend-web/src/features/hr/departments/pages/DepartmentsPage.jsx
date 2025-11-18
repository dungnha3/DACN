import { useState, useMemo, useEffect } from 'react';
import { departmentsService, employeesService } from '@/features/hr/shared/services';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      const [depts, emps] = await Promise.all([
        departmentsService.getAll(),
        employeesService.getAll()
      ]);
      setDepartments(depts);
      setEmployees(emps);
    } catch (err) {
      console.error('Error loading data:', err);
      alert('Không thể tải dữ liệu: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phongbanId: null,
    tenPhongBan: '',
    moTa: '',
    truongPhongId: ''
  });

  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => 
      dept.tenPhongBan.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  const stats = {
    totalDepts: departments.length,
    totalEmps: departments.reduce((acc, cur) => acc + (cur.soLuongNhanVien || 0), 0),
    noManager: departments.filter(d => !d.tenTruongPhong).length
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({ phongbanId: null, tenPhongBan: '', moTa: '', truongPhongId: '' });
    setShowModal(true);
  };

  const handleEdit = (dept) => {
    setIsEditing(true);
    setFormData({
      phongbanId: dept.phongbanId,
      tenPhongBan: dept.tenPhongBan,
      moTa: dept.moTa,
      truongPhongId: dept.truongPhongId || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if(confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) {
      try {
        setLoading(true);
        await departmentsService.delete(id);
        await loadData();
        alert('Xóa phòng ban thành công!');
      } catch (err) {
        alert('Lỗi: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.tenPhongBan) return alert("Tên phòng ban là bắt buộc!");

    try {
      setLoading(true);
      if (isEditing) {
        await departmentsService.update(formData.phongbanId, formData);
      } else {
        await departmentsService.create(formData);
      }
      await loadData();
      setShowModal(false);
      alert(isEditing ? 'Cập nhật phòng ban thành công!' : 'Thêm phòng ban thành công!');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.container}>
      <div style={s.headerWrapper}>
        <div>
          <div style={s.breadcrumb}>Quản lý nhân sự / Phòng ban</div>
          <h1 style={s.pageTitle}>Quản lý Phòng Ban</h1>
        </div>
        <button style={s.btnAdd} onClick={handleAddNew}>
          <span style={{marginRight: 6}}>+</span> Thêm mới
        </button>
      </div>

      <div style={s.statsGrid}>
        <StatCard title="Tổng phòng ban" value={stats.totalDepts} icon="🏢" color="#3b82f6" />
        <StatCard title="Tổng nhân sự" value={stats.totalEmps} icon="👥" color="#10b981" />
        <StatCard title="Chưa có trưởng phòng" value={stats.noManager} icon="⚠️" color="#f59e0b" />
      </div>

      <div style={s.searchBar}>
        <div style={s.searchWrapper}>
          <span style={s.searchIcon}>🔍</span>
          <input 
            style={s.searchInput} 
            placeholder="Tìm kiếm phòng ban..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={s.grid}>
        {filteredDepartments.map(dept => (
          <div key={dept.phongbanId} style={s.card}>
            <div style={s.cardHeader}>
              <div style={s.iconBox}>🏢</div>
              <div style={s.actionMenu}>
                <button style={s.iconBtn} onClick={() => handleEdit(dept)}>✏️</button>
                <button style={{...s.iconBtn, color: '#ef4444'}} onClick={() => handleDelete(dept.phongbanId)}>🗑️</button>
              </div>
            </div>

            <h3 style={s.deptName}>{dept.tenPhongBan}</h3>
            <p style={s.deptDesc}>{dept.moTa}</p>

            <div style={s.divider} />

            <div style={s.cardInfo}>
              <div style={s.infoItem}>
                <span style={s.infoLabel}>Trưởng phòng</span>
                {dept.tenTruongPhong ? (
                  <div style={s.managerBox}>
                    <div style={s.managerAvatar}>{dept.tenTruongPhong.charAt(0)}</div>
                    <span style={s.managerName}>{dept.tenTruongPhong}</span>
                  </div>
                ) : (
                  <span style={s.noManager}>Chưa bổ nhiệm</span>
                )}
              </div>
              
              <div style={s.infoItem}>
                <span style={s.infoLabel}>Nhân sự</span>
                <div style={s.empCountBadge}>
                  👥 {dept.soLuongNhanVien || 0}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>{isEditing ? 'Cập nhật Phòng ban' : 'Thêm Phòng ban mới'}</h3>
              <button style={s.closeBtn} onClick={() => setShowModal(false)}>×</button>
            </div>
            <div style={s.modalBody}>
              <div style={s.formGroup}>
                <label style={s.label}>Tên phòng ban <span style={{color:'red'}}>*</span></label>
                <input 
                  style={s.input} 
                  value={formData.tenPhongBan}
                  onChange={e => setFormData({...formData, tenPhongBan: e.target.value})}
                  placeholder="VD: Phòng Marketing"
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Mô tả</label>
                <textarea 
                  style={s.textarea} 
                  value={formData.moTa}
                  onChange={e => setFormData({...formData, moTa: e.target.value})}
                  placeholder="Mô tả chức năng, nhiệm vụ..."
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Trưởng phòng</label>
                <select 
                  style={s.select}
                  value={formData.truongPhongId}
                  onChange={e => setFormData({...formData, truongPhongId: e.target.value})}
                >
                  <option value="">-- Chọn nhân viên --</option>
                  {employees.map(e => (
                    <option key={e.nhanvienId} value={e.nhanvienId}>{e.hoTen}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.btnCancel} onClick={() => setShowModal(false)}>Hủy</button>
              <button style={s.btnSave} onClick={handleSubmit}>Lưu lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div style={s.statCard}>
      <div>
        <div style={s.statTitle}>{title}</div>
        <div style={{...s.statValue, color}}>{value}</div>
      </div>
      <div style={{...s.statIcon, color, background: `${color}15`}}>{icon}</div>
    </div>
  );
}

const s = {
  container: {
    padding: '24px 32px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#344767',
    boxSizing: 'border-box'
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
  btnAdd: {
    background: 'linear-gradient(195deg, #fb8c00, #ffa726)',
    color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px',
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(251, 140, 0, 0.2)', display: 'flex', alignItems: 'center'
  },
  
  statsGrid: {
    display: 'flex', gap: 20, marginBottom: 24
  },
  statCard: {
    flex: 1, background: '#fff', borderRadius: 12, padding: 20,
    boxShadow: '0 2px 6px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  statTitle: { fontSize: 13, color: '#7b809a', fontWeight: 600, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: 700 },
  statIcon: { width: 48, height: 48, borderRadius: 12, display: 'grid', placeItems: 'center', fontSize: 24 },

  searchBar: { marginBottom: 24 },
  searchWrapper: {
    position: 'relative', maxWidth: 400, display: 'flex', alignItems: 'center'
  },
  searchIcon: { position: 'absolute', left: 12, color: '#7b809a' },
  searchInput: {
    width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #d2d6da',
    borderRadius: 8, outline: 'none', fontSize: 14, boxSizing: 'border-box',
    color: '#344767', background: '#fff'
  },

  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24
  },
  card: {
    background: '#fff', borderRadius: 16, padding: 24,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
    border: '1px solid rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column'
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16
  },
  iconBox: {
    width: 48, height: 48, borderRadius: 12,
    background: 'linear-gradient(195deg, #42424a, #191919)',
    color: '#fff', display: 'grid', placeItems: 'center', fontSize: 24,
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
  },
  actionMenu: { display: 'flex', gap: 8 },
  iconBtn: {
    background: 'transparent', border: 'none', cursor: 'pointer',
    fontSize: 16, color: '#7b809a', padding: 4
  },
  deptName: { fontSize: 18, fontWeight: 700, color: '#344767', margin: '0 0 8px 0' },
  deptDesc: { fontSize: 13, color: '#7b809a', lineHeight: 1.5, height: 40, overflow: 'hidden', marginBottom: 16 },
  divider: { height: 1, background: '#f0f2f5', marginBottom: 16 },
  
  cardInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  infoItem: { display: 'flex', flexDirection: 'column', gap: 6 },
  infoLabel: { fontSize: 11, textTransform: 'uppercase', color: '#7b809a', fontWeight: 700 },
  
  managerBox: { display: 'flex', alignItems: 'center', gap: 8 },
  managerAvatar: {
    width: 24, height: 24, borderRadius: '50%', background: '#3b82f6', color: '#fff',
    fontSize: 12, display: 'grid', placeItems: 'center', fontWeight: 600
  },
  managerName: { fontSize: 14, fontWeight: 600, color: '#344767' },
  noManager: { fontSize: 13, color: '#9ca3af', fontStyle: 'italic' },
  
  empCountBadge: {
    background: '#f0fdf4', color: '#166534', padding: '4px 10px',
    borderRadius: 20, fontSize: 12, fontWeight: 700, border: '1px solid #dcfce7'
  },

  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modal: {
    background: '#fff', borderRadius: 16, width: 500, maxWidth: '95%',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: 24
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { margin: 0, fontSize: 20, fontWeight: 700, color: '#344767' },
  closeBtn: { border: 'none', background: 'none', fontSize: 24, cursor: 'pointer', color: '#7b809a' },
  
  modalBody: { display: 'flex', flexDirection: 'column', gap: 16 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 14, fontWeight: 600, color: '#344767' },
  
  // FIX: Thêm màu chữ và nền rõ ràng cho Input/Select
  input: {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d2d6da', 
    outline: 'none', fontSize: 14, color: '#344767', background: '#fff', boxSizing: 'border-box'
  },
  textarea: {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d2d6da', 
    outline: 'none', fontSize: 14, minHeight: 80, resize: 'vertical',
    color: '#344767', background: '#fff', fontFamily: 'inherit', boxSizing: 'border-box'
  },
  select: {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d2d6da', 
    outline: 'none', fontSize: 14, color: '#344767', background: '#fff', 
    cursor: 'pointer', boxSizing: 'border-box'
  },
  
  modalFooter: {
    marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 16, borderTop: '1px solid #f0f2f5'
  },
  btnCancel: {
    padding: '10px 20px', borderRadius: 8, border: 'none', background: '#f0f2f5',
    color: '#7b809a', fontWeight: 600, cursor: 'pointer'
  },
  btnSave: {
    padding: '10px 24px', borderRadius: 8, border: 'none',
    background: 'linear-gradient(195deg, #fb8c00, #ffa726)', color: '#fff',
    fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }
};