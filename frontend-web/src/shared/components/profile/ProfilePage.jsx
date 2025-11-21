import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePermissions } from '@/shared/hooks';
import { formatCurrency, commonStyles } from '@/shared/utils';
import { colors, typography, spacing } from '@/shared/styles/theme';

export default function SharedProfilePage({ 
  title = "Hồ sơ cá nhân",
  breadcrumb = "Cá nhân / Hồ sơ cá nhân",
  allowEdit = true,
  userRole = "User"
}) {
  const { user: authUser } = useAuth();
  const username = authUser?.username || localStorage.getItem('username') || 'User';
  
  // Basic auth check
  if (!authUser && !username) {
    return (
      <div style={{ padding: '24px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 20, color: '#ef4444', marginBottom: 16 }}>❌ Không có quyền truy cập</div>
        <div style={{ fontSize: 14, color: '#7b809a' }}>Vui lòng đăng nhập để xem thông tin cá nhân</div>
      </div>
    );
  }
  
  // Try to get permissions (optional)
  let isAccountingManager = false;
  let isEmployee = false;
  try {
    const { currentUser, isAccountingManager: isAccounting, isEmployee: isEmp } = usePermissions();
    isAccountingManager = isAccounting;
    isEmployee = isEmp;
  } catch (err) {
    // Permissions hook might fail, continue with basic access
    console.warn('Permissions hook failed:', err);
  }
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // Simulate loading employee data
      setTimeout(() => {
        const roleData = {
          "Project Manager": { luongCoBan: 20000000, phuCap: 3000000 },
          "Employee": { luongCoBan: 15000000, phuCap: 2000000 },
          "HR Manager": { luongCoBan: 18000000, phuCap: 2500000 }
        };
        
        setEmployee({
          hoTen: username,
          email: authUser?.email || `${username}@company.com`,
          sdt: '0123456789',
          diaChi: 'Hà Nội',
          cccd: '001234567890',
          ngaySinh: '1990-01-01',
          gioiTinh: 'Nam',
          phongban: { tenPhongBan: 'IT' },
          chucvu: { tenChucVu: userRole },
          ngayVaoLam: '2020-01-01',
          trangThai: 'DANG_LAM_VIEC',
          ...roleData[userRole] || roleData["Employee"]
        });
        setFormData({
          hoTen: username,
          email: authUser?.email || `${username}@company.com`,
          sdt: '0123456789',
          diaChi: 'Hà Nội'
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error loading profile:', err);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Simulate save
      alert('✅ Cập nhật thông tin thành công!');
      setEditing(false);
      // Update employee data
      setEmployee(prev => ({ ...prev, ...formData }));
    } catch (err) {
      alert('❌ Lỗi cập nhật thông tin');
    }
  };


  if (loading) {
    return (
      <div style={commonStyles.pageContainer}>
        <div style={{ textAlign: 'center', padding: spacing['6xl'] }}>
          <div style={{ fontSize: typography.xl, color: colors.textSecondary, marginBottom: spacing.lg }}>Đang tải thông tin cá nhân...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={commonStyles.pageContainer}>
      {/* Header */}
      <div style={{ marginBottom: spacing['2xl'] }}>
        <div style={{ fontSize: typography.sm, color: colors.textSecondary, marginBottom: spacing.sm, fontWeight: typography.semibold, textTransform: 'uppercase' }}>
          {breadcrumb}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={commonStyles.heading1}>
            {title}
          </h1>
          {allowEdit && (
            <button 
              style={{
                background: editing ? colors.gradientSuccess : colors.gradientPrimary,
                color: '#fff', border: 'none', borderRadius: spacing.lg, padding: `${spacing.md} ${spacing.xl}`,
                fontSize: typography.sm, fontWeight: typography.bold, cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
              }}
              onClick={editing ? handleSave : () => setEditing(true)}
            >
              {editing ? '💾 Lưu' : '✏️ Chỉnh sửa'}
            </button>
          )}
        </div>
      </div>

      {employee ? (
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
          {/* Avatar & Basic Info */}
          <div style={{
            background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.02)', gridColumn: '1/-1'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                width: 80, height: 80, borderRadius: 20, 
                background: 'linear-gradient(195deg, #42424a, #191919)',
                color: '#fff', display: 'grid', placeItems: 'center', 
                fontSize: 32, boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                👤
              </div>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#344767' }}>
                  {employee.hoTen}
                </h2>
                <div style={{ fontSize: 14, color: '#7b809a', marginTop: 4 }}>
                  {userRole}
                </div>
                <div style={{ marginTop: 12 }}>
                  <span style={{
                    background: '#dcfce7', color: '#16a34a', padding: '6px 12px', 
                    borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block'
                  }}>
                    🟢 Đang làm việc
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div style={{
            background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#344767', marginBottom: 20 }}>
              Thông tin cá nhân
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#7b809a', marginBottom: 6, display: 'block' }}>
                  Họ và tên
                </label>
                {editing ? (
                  <input 
                    name="hoTen"
                    value={formData.hoTen}
                    onChange={handleInputChange}
                    style={{
                      width: '100%', padding: 12, border: '1px solid #d2d6da', borderRadius: 8,
                      outline: 'none', fontSize: 14, boxSizing: 'border-box', color: '#344767'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: 15, color: '#344767', fontWeight: 500 }}>
                    {employee.hoTen}
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#7b809a', marginBottom: 6, display: 'block' }}>
                  Email
                </label>
                {editing ? (
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%', padding: 12, border: '1px solid #d2d6da', borderRadius: 8,
                      outline: 'none', fontSize: 14, boxSizing: 'border-box', color: '#344767'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: 15, color: '#344767', fontWeight: 500 }}>
                    {employee.email}
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#7b809a', marginBottom: 6, display: 'block' }}>
                  Số điện thoại
                </label>
                {editing ? (
                  <input 
                    name="sdt"
                    value={formData.sdt}
                    onChange={handleInputChange}
                    style={{
                      width: '100%', padding: 12, border: '1px solid #d2d6da', borderRadius: 8,
                      outline: 'none', fontSize: 14, boxSizing: 'border-box', color: '#344767'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: 15, color: '#344767', fontWeight: 500 }}>
                    {employee.sdt}
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#7b809a', marginBottom: 6, display: 'block' }}>
                  Địa chỉ
                </label>
                {editing ? (
                  <input 
                    name="diaChi"
                    value={formData.diaChi}
                    onChange={handleInputChange}
                    style={{
                      width: '100%', padding: 12, border: '1px solid #d2d6da', borderRadius: 8,
                      outline: 'none', fontSize: 14, boxSizing: 'border-box', color: '#344767'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: 15, color: '#344767', fontWeight: 500 }}>
                    {employee.diaChi}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div style={{
            background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#344767', marginBottom: 20 }}>
              Thông tin công việc
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#7b809a', marginBottom: 6, display: 'block' }}>
                  Phòng ban
                </label>
                <div style={{ fontSize: 15, color: '#344767', fontWeight: 500 }}>
                  {employee.phongban?.tenPhongBan}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#7b809a', marginBottom: 6, display: 'block' }}>
                  Chức vụ
                </label>
                <div style={{ fontSize: 15, color: '#344767', fontWeight: 500 }}>
                  {employee.chucvu?.tenChucVu}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#7b809a', marginBottom: 6, display: 'block' }}>
                  Ngày vào làm
                </label>
                <div style={{ fontSize: 15, color: '#344767', fontWeight: 500 }}>
                  {employee.ngayVaoLam}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#7b809a', marginBottom: 6, display: 'block' }}>
                  Lương cơ bản
                </label>
                <div style={{ fontSize: 15, color: '#16a34a', fontWeight: 700 }}>
                  {/* Salary masking theo PHAN_QUYEN_CHI_TIET.md */}
                  {(isAccountingManager || isEmployee) ? formatCurrency(employee.luongCoBan) : '***'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: '#fff', borderRadius: 16, padding: 60, textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>👤</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#344767', marginBottom: 12 }}>
            Chưa có thông tin nhân viên
          </div>
          <div style={{ fontSize: 14, color: '#7b809a', lineHeight: 1.6, marginBottom: 20 }}>
            Tài khoản của bạn chưa được liên kết với hồ sơ nhân viên. 
            Vui lòng liên hệ HR để cập nhật thông tin.
          </div>
          <div style={{ 
            fontSize: 14, color: '#344767', background: '#f8f9fa', 
            padding: 12, borderRadius: 8, display: 'inline-block'
          }}>
            <strong>Tài khoản hiện tại:</strong> {username}
          </div>
        </div>
      )}
    </div>
  );
}
