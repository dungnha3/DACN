import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { apiService } from '@/shared/services/api.service';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    ten: '',
    ho: '',
    email: '',
    soDienThoai: '',
    phongBan: '',
    chucVu: '',
    ngonNguThongBao: 'Tiếng Việt',
    diaChi: '',
    ngaySinh: '',
    gioiTinh: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from backend API first
      try {
        const response = await apiService.get('/api/users/me');
        const userData = response.data;
        
        // Map backend data to profile
        const backendProfile = {
          id: userData.id,
          username: userData.username,
          ten: userData.ten || extractLastName(userData.username),
          ho: userData.ho || extractFirstName(userData.username),
          email: userData.email,
          soDienThoai: userData.soDienThoai || 'Chưa cập nhật',
          phongBan: userData.phongBan || getRoleDepartment(userData.role),
          chucVu: getRoleTitle(userData.role),
          role: userData.role,
          ngonNguThongBao: userData.ngonNguThongBao || 'Tiếng Việt',
          diaChi: userData.diaChi || 'Chưa cập nhật',
          ngaySinh: userData.ngaySinh || '1990-01-01',
          gioiTinh: userData.gioiTinh || 'Nam',
          trangThai: 'TRUC_TUYEN',
          avatar: userData.avatar || null,
        };
        
        setProfile(backendProfile);
        setFormData({
          ten: backendProfile.ten,
          ho: backendProfile.ho,
          email: backendProfile.email,
          soDienThoai: backendProfile.soDienThoai,
          phongBan: backendProfile.phongBan,
          chucVu: backendProfile.chucVu,
          ngonNguThongBao: backendProfile.ngonNguThongBao,
          diaChi: backendProfile.diaChi,
          ngaySinh: backendProfile.ngaySinh,
          gioiTinh: backendProfile.gioiTinh,
        });
      } catch (apiError) {
        console.warn('Backend API not available, using fallback data:', apiError);
        
        // Fallback: Use data from AuthContext
        const fallbackProfile = {
          id: 1,
          username: user?.username || 'user',
          ten: extractLastName(user?.username),
          ho: extractFirstName(user?.username),
          email: user?.email || 'user@example.com',
          soDienThoai: 'Chưa cập nhật',
          phongBan: getRoleDepartment(user?.role),
          chucVu: getRoleTitle(user?.role),
          role: user?.role || 'EMPLOYEE',
          ngonNguThongBao: 'Tiếng Việt',
          diaChi: 'Chưa cập nhật',
          ngaySinh: '1990-01-01',
          gioiTinh: 'Nam',
          trangThai: 'TRUC_TUYEN',
          avatar: null,
        };
        
        setProfile(fallbackProfile);
        setFormData({
          ten: fallbackProfile.ten,
          ho: fallbackProfile.ho,
          email: fallbackProfile.email,
          soDienThoai: fallbackProfile.soDienThoai,
          phongBan: fallbackProfile.phongBan,
          chucVu: fallbackProfile.chucVu,
          ngonNguThongBao: fallbackProfile.ngonNguThongBao,
          diaChi: fallbackProfile.diaChi,
          ngaySinh: fallbackProfile.ngaySinh,
          gioiTinh: fallbackProfile.gioiTinh,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper functions
  const extractFirstName = (username) => {
    if (!username) return 'User';
    // Capitalize first letter
    return username.charAt(0).toUpperCase() + username.slice(1);
  };
  
  const extractLastName = (username) => {
    if (!username) return '';
    // For single word usernames, return empty
    return '';
  };
  
  const getRoleTitle = (role) => {
    const roleTitles = {
      'ADMIN': 'Quản trị viên',
      'MANAGER_HR': 'Quản lý nhân sự',
      'MANAGER_ACCOUNTING': 'Quản lý kế toán',
      'MANAGER_PROJECT': 'Quản lý dự án',
      'EMPLOYEE': 'Nhân viên'
    };
    return roleTitles[role] || 'Nhân viên';
  };
  
  const getRoleDepartment = (role) => {
    const departments = {
      'ADMIN': 'Quản trị',
      'MANAGER_HR': 'Nhân sự',
      'MANAGER_ACCOUNTING': 'Kế toán',
      'MANAGER_PROJECT': 'Dự án',
      'EMPLOYEE': 'IT'
    };
    return departments[role] || 'IT';
  };

  const handleSave = async () => {
    try {
      // TODO: Call API to update profile
      // await apiService.put('/api/profile/me', formData);
      
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Cập nhật thất bại!');
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      ADMIN: { label: 'QUẢN TRỊ VIÊN', bg: '#ff4655', color: '#fff' },
      MANAGER_HR: { label: 'QUẢN LÝ NHÂN SỰ', bg: '#3b82f6', color: '#fff' },
      MANAGER_ACCOUNTING: { label: 'QUẢN LÝ KẾ TOÁN', bg: '#10b981', color: '#fff' },
      MANAGER_PROJECT: { label: 'QUẢN LÝ DỰ ÁN', bg: '#f59e0b', color: '#fff' },
      EMPLOYEE: { label: 'NHÂN VIÊN', bg: '#64748b', color: '#fff' },
    };
    return roleMap[role] || roleMap.EMPLOYEE;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Đang tải...</div>
      </div>
    );
  }

  const roleBadge = getRoleBadge(profile?.role);

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {/* Left Column - Avatar & Status */}
        <div style={styles.leftColumn}>
          {/* Avatar Card */}
          <div style={styles.avatarCard}>
            <div style={{ ...styles.roleBadge, background: roleBadge.bg, color: roleBadge.color }}>
              {roleBadge.label}
            </div>
            
            <div style={styles.avatarContainer}>
              <div style={styles.avatar}>
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Avatar" style={styles.avatarImg} />
                ) : (
                  <div style={styles.avatarPlaceholder}>
                    {(profile?.ho?.[0] || '') + (profile?.ten?.[0] || '')}
                  </div>
                )}
              </div>
            </div>

            {profile?.trangThai === 'TRUC_TUYEN' && (
              <div style={styles.statusBadge}>
                <span style={styles.statusDot} />
                <span style={styles.statusText}>TRỰC TUYẾN</span>
              </div>
            )}
          </div>

          {/* Stress Level Card (if needed) */}
          <div style={styles.stressCard}>
            <div style={styles.stressTitle}>Độ căng thẳng của bạn</div>
            <div style={styles.gaugeContainer}>
              <div style={styles.gauge}>
                <div style={styles.gaugeFill} />
                <div style={styles.gaugeValue}>?</div>
              </div>
            </div>
            <button style={styles.stressButton}>LÀM THẾ NÀO ĐỂ ĐỔI?</button>
          </div>
        </div>

        {/* Right Column - Profile Info */}
        <div style={styles.rightColumn}>
          <div style={styles.infoCard}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Thông tin liên hệ</h2>
              <button 
                style={styles.editButton}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? '💾 Lưu' : '✏️ Sửa'}
              </button>
            </div>

            <div style={styles.formGrid}>
              {/* Họ */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Họ</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.ho}
                    onChange={(e) => handleChange('ho', e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  <div style={styles.value}>{profile?.ho}</div>
                )}
              </div>

              {/* Tên */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Tên</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.ten}
                    onChange={(e) => handleChange('ten', e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  <div style={styles.value}>{profile?.ten}</div>
                )}
              </div>

              {/* Email */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  <div style={{ ...styles.value, color: '#3b82f6' }}>{profile?.email}</div>
                )}
              </div>

              {/* Số điện thoại */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Số điện thoại</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.soDienThoai}
                    onChange={(e) => handleChange('soDienThoai', e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  <div style={styles.value}>{profile?.soDienThoai}</div>
                )}
              </div>

              {/* Phòng ban */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Phòng ban</label>
                <div style={styles.value}>{profile?.phongBan}</div>
              </div>

              {/* Chức vụ */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Chức vụ</label>
                <div style={styles.value}>{profile?.chucVu}</div>
              </div>

              {/* Ngày sinh */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Ngày sinh</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.ngaySinh}
                    onChange={(e) => handleChange('ngaySinh', e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  <div style={styles.value}>{profile?.ngaySinh}</div>
                )}
              </div>

              {/* Giới tính */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Giới tính</label>
                {isEditing ? (
                  <select
                    value={formData.gioiTinh}
                    onChange={(e) => handleChange('gioiTinh', e.target.value)}
                    style={styles.input}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                ) : (
                  <div style={styles.value}>{profile?.gioiTinh}</div>
                )}
              </div>

              {/* Địa chỉ */}
              <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                <label style={styles.label}>Địa chỉ</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.diaChi}
                    onChange={(e) => handleChange('diaChi', e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  <div style={styles.value}>{profile?.diaChi}</div>
                )}
              </div>

              {/* Ngôn ngữ thông báo */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Ngôn ngữ thông báo</label>
                {isEditing ? (
                  <select
                    value={formData.ngonNguThongBao}
                    onChange={(e) => handleChange('ngonNguThongBao', e.target.value)}
                    style={styles.input}
                  >
                    <option value="Tiếng Việt">Tiếng Việt</option>
                    <option value="English">English</option>
                  </select>
                ) : (
                  <div style={styles.value}>{profile?.ngonNguThongBao}</div>
                )}
              </div>
            </div>

            {isEditing && (
              <div style={styles.buttonGroup}>
                <button style={styles.cancelButton} onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    ten: profile.ten,
                    ho: profile.ho,
                    email: profile.email,
                    soDienThoai: profile.soDienThoai,
                    phongBan: profile.phongBan,
                    chucVu: profile.chucVu,
                    ngonNguThongBao: profile.ngonNguThongBao,
                    diaChi: profile.diaChi,
                    ngaySinh: profile.ngaySinh,
                    gioiTinh: profile.gioiTinh,
                  });
                }}>
                  Hủy
                </button>
                <button style={styles.saveButton} onClick={handleSave}>
                  Lưu thay đổi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 24,
    background: '#f8fafc',
    minHeight: '100vh',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  loading: {
    fontSize: 18,
    color: '#64748b',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    gap: 24,
    maxWidth: 1400,
    margin: '0 auto',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  avatarCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    position: 'relative',
    textAlign: 'center',
  },
  roleBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: '6px 14px',
    borderRadius: '0 12px 12px 0',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  avatarContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: '50%',
    margin: '0 auto',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    fontSize: 64,
    fontWeight: 700,
    color: '#fff',
    textTransform: 'uppercase',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: '#dcfce7',
    color: '#166534',
    padding: '8px 16px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    marginTop: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#16a34a',
  },
  statusText: {},
  stressCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  stressTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: 20,
  },
  gaugeContainer: {
    marginBottom: 20,
  },
  gauge: {
    width: 140,
    height: 70,
    margin: '0 auto',
    position: 'relative',
    borderRadius: '140px 140px 0 0',
    background: 'linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)',
    overflow: 'hidden',
  },
  gaugeFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: '#fff',
    borderRadius: '0 0 140px 140px',
  },
  gaugeValue: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 32,
    fontWeight: 700,
    color: '#0f172a',
  },
  stressButton: {
    width: '100%',
    padding: '10px 16px',
    background: '#fff',
    border: '2px solid #3b82f6',
    borderRadius: 8,
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  rightColumn: {},
  infoCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 16,
    borderBottom: '1px solid #e2e8f0',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
  },
  editButton: {
    padding: '8px 20px',
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  value: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: 500,
    padding: '10px 0',
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 15,
    color: '#0f172a',
    outline: 'none',
    transition: 'all 0.2s',
  },
  buttonGroup: {
    display: 'flex',
    gap: 12,
    marginTop: 32,
    paddingTop: 24,
    borderTop: '1px solid #e2e8f0',
  },
  cancelButton: {
    flex: 1,
    padding: '12px 24px',
    background: '#e2e8f0',
    color: '#475569',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  saveButton: {
    flex: 1,
    padding: '12px 24px',
    background: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
