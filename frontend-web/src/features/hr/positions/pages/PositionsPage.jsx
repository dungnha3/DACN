import { useState } from 'react';

const mockPositions = [
  { id: 1, ten: 'Developer', moTa: 'Phát triển phần mềm', heSoLuong: 1.5, soNhanVien: 12 },
  { id: 2, ten: 'Senior Developer', moTa: 'Phát triển phần mềm cấp cao', heSoLuong: 2.0, soNhanVien: 8 },
  { id: 3, ten: 'Tech Lead', moTa: 'Trưởng nhóm kỹ thuật', heSoLuong: 2.5, soNhanVien: 3 },
  { id: 4, ten: 'HR Manager', moTa: 'Quản lý nhân sự', heSoLuong: 2.2, soNhanVien: 2 },
  { id: 5, ten: 'Accountant', moTa: 'Kế toán viên', heSoLuong: 1.6, soNhanVien: 4 },
  { id: 6, ten: 'Marketing Manager', moTa: 'Quản lý marketing', heSoLuong: 2.0, soNhanVien: 1 },
];

export default function PositionsPage() {
  const [positions, setPositions] = useState(mockPositions);
  const [showModal, setShowModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [formData, setFormData] = useState({ ten: '', moTa: '', heSoLuong: 1.0 });

  const handleAdd = () => {
    setEditingPosition(null);
    setFormData({ ten: '', moTa: '', heSoLuong: 1.0 });
    setShowModal(true);
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
    setFormData({ ten: position.ten, moTa: position.moTa, heSoLuong: position.heSoLuong });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingPosition) {
      setPositions(positions.map(p => p.id === editingPosition.id ? { ...p, ...formData } : p));
    } else {
      setPositions([...positions, { id: Date.now(), ...formData, soNhanVien: 0 }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc muốn xóa chức vụ này?')) {
      setPositions(positions.filter(p => p.id !== id));
    }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Quản lý Chức vụ</h1>
          <p style={s.subtitle}>{positions.length} chức vụ</p>
        </div>
        <button style={s.addBtn} onClick={handleAdd}>➕ Thêm chức vụ mới</button>
      </div>

      <div style={s.grid}>
        {positions.map(pos => (
          <div key={pos.id} style={s.card}>
            <div style={s.cardHeader}>
              <h3 style={s.cardTitle}>{pos.ten}</h3>
              <div style={s.coefficient}>×{pos.heSoLuong}</div>
            </div>
            <p style={s.cardDesc}>{pos.moTa}</p>
            <div style={s.cardFooter}>
              <div style={s.employeeCount}>👤 {pos.soNhanVien} nhân viên</div>
              <div style={s.cardActions}>
                <button style={s.editBtn} onClick={() => handleEdit(pos)}>✏️</button>
                <button style={s.deleteBtn} onClick={() => handleDelete(pos.id)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={s.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={s.modalTitle}>{editingPosition ? 'Sửa chức vụ' : 'Thêm chức vụ mới'}</h2>
            
            <div style={s.formGroup}>
              <label style={s.label}>Tên chức vụ *</label>
              <input
                style={s.input}
                value={formData.ten}
                onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                placeholder="VD: Senior Developer"
              />
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>Mô tả</label>
              <textarea
                style={{ ...s.input, minHeight: 80 }}
                value={formData.moTa}
                onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                placeholder="Mô tả về chức vụ..."
              />
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>Hệ số lương *</label>
              <input
                type="number"
                step="0.1"
                min="1"
                style={s.input}
                value={formData.heSoLuong}
                onChange={(e) => setFormData({ ...formData, heSoLuong: parseFloat(e.target.value) })}
              />
              <small style={{ color: '#64748b', fontSize: 12 }}>Dùng để tính lương: Lương CB × Hệ số</small>
            </div>

            <div style={s.modalActions}>
              <button style={s.cancelBtn} onClick={() => setShowModal(false)}>Hủy</button>
              <button style={s.saveBtn} onClick={handleSave}>
                {editingPosition ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
  card: { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 },
  coefficient: { background: '#dbeafe', color: '#1e3a8a', padding: '4px 12px', borderRadius: 12, fontSize: 14, fontWeight: 600 },
  cardDesc: { color: '#64748b', fontSize: 14, marginBottom: 16, minHeight: 40 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f1f5f9' },
  employeeCount: { fontSize: 14, color: '#475569', fontWeight: 500 },
  cardActions: { display: 'flex', gap: 8 },
  editBtn: { padding: '6px 10px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  deleteBtn: { padding: '6px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 12, padding: 32, maxWidth: 500, width: '90%' },
  modalTitle: { fontSize: 24, fontWeight: 700, marginBottom: 24 },
  formGroup: { marginBottom: 20 },
  label: { display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14 },
  modalActions: { display: 'flex', gap: 12, marginTop: 24 },
  cancelBtn: { flex: 1, padding: '10px 20px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  saveBtn: { flex: 1, padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
};
