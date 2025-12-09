import { useMemo, useState, useEffect, useRef } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePermissions, useErrorHandler } from '@/shared/hooks'
import { dashboardService } from '@/features/hr/shared/services'
import { profileService } from '@/shared/services/profile.service'
import { dashboardBaseStyles as styles } from '@/shared/styles/dashboard'
import { NavItem, RoleBadge } from './components/HrManagerDashboard.components'
import { sectionsConfig } from './components/HrManagerDashboard.constants'
import {
  EmployeesPage,
  EmployeeDetailPage,
  LeavesPage,
  DepartmentsPage,
  DepartmentDetailPage,
  ContractsPage,
  PositionsPage,
  EvaluationsPage,
  HRStoragePage
} from '@modules/hr'
import { SharedProfilePage } from '@/shared/components/profile'
import { SharedLeaveRequestPage } from '@/shared/components/leave-request'
import { ChatPage } from '@/modules/project'
import NotificationBell from '@/shared/components/notification/NotificationBell'

export default function HrManagerDashboard() {
  const [active, setActive] = useState('dashboard')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null)

  // Dashboard Data State
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);

  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'HR Manager'
  const user = useMemo(() => ({ name: username || 'Nguyễn Thị C', role: 'Quản lý nhân sự' }), [username])

  // Fetch user avatar
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const profile = await profileService.getProfile();
        setUserAvatar(profile?.avatarUrl);
      } catch (error) {
        console.error('Failed to load user avatar:', error);
      }
    };
    loadAvatar();
  }, []);

  // Fetch Dashboard Data
  useEffect(() => {
    if (active === 'dashboard') {
      const loadData = async () => {
        try {
          setLoading(true);
          const data = await dashboardService.getStats();
          console.log("Dashboard Data:", data); // Debug log
          setStats(normalizeData(data));
        } catch (error) {
          console.error("Failed to load dashboard stats", error);
          // Fallback mock data if API completely fails (optional, remove if strict)
          // setStats(mockData); 
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [active]);

  // --- Helpers ---

  // Normalize data to handle both Flat (DashboardDTO) and Nested (DashboardStatsDTO) structures
  const normalizeData = (data) => {
    if (!data) return null;

    // Check if nested (DashboardStatsDTO)
    if (data.tongQuan) {
      return {
        ...data.tongQuan, // Spread tongQuan to top level
        chamCongPhongBan: data.chamCongPhongBan || [],
        nhanVienTheoTuoi: data.nhanVienTheoTuoi || [],
        nhanVienTheoGioiTinh: data.nhanVienTheoGioiTinh || {},
        luongTheoThang: data.luongTheoThang || []
      };
    }

    // Assume Flat (DashboardDTO) - This matches the simple DTO structure
    return {
      tongNhanVien: data.tongNhanVien || 0,
      nhanVienDangLam: data.nhanVienDangLam || 0,
      donNghiPhepChoDuyet: data.donNghiPhepChoDuyet || 0,
      bangLuongChoDuyet: data.bangLuongChuaThanhToan || 0, // Mapping guess
      hopDongHetHan30Ngay: data.hopDongSapHetHan || 0,
      tongChiPhiLuongThang: data.tongLuongThangNay || 0,
      chamCongPhongBan: [], // Flat DTO might not have charts
      nhanVienTheoTuoi: [],
      ...data // Keep other fields
    };
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // --- Navigation Handlers ---
  const handleViewEmployeeDetail = (employeeId) => { setSelectedEmployeeId(employeeId); setActive('employee-detail'); }
  const handleBackFromEmployeeDetail = () => { setSelectedEmployeeId(null); setActive('employees'); }
  const handleViewDepartmentDetail = (departmentId) => { setSelectedDepartmentId(departmentId); setActive('department-detail'); }
  const handleBackFromDepartmentDetail = () => { setSelectedDepartmentId(null); setActive('departments'); }
  const handleLogout = async () => await logout();

  const sections = useMemo(() => sectionsConfig, [])
  const meta = sections[active]

  // State for sidebar hover
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsSidebarHovered(true);
  };

  const handleMouseLeave = () => {
    // Delay 100ms để tránh flicker khi chuột di chuyển nhanh
    hoverTimeoutRef.current = setTimeout(() => {
      setIsSidebarHovered(false);
    }, 100);
  };

  // Custom Styles for Light/Collapsed Theme
  const customStyles = {
    ...styles,
    appShell: {
      ...styles.appShell,
      display: 'flex',
      gridTemplateColumns: 'none',
      backgroundColor: '#f8fafc',
      height: '100vh',
      overflow: 'hidden',
    },
    sidebar: {
      ...styles.sidebar,
      width: isSidebarHovered ? '260px' : '70px',
      background: '#fff',
      borderRight: '1px solid #e2e8f0',
      padding: '20px 12px',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isSidebarHovered ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none',
      zIndex: 50,
      flexShrink: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      height: '100vh',
      willChange: 'width',
    },
    content: {
      ...styles.content,
      flex: 1,
      width: '100%',
      background: '#f8fafc',
      height: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    // User card overrides
    userCard: {
      ...styles.userCard,
      background: 'transparent',
      padding: 0,
      justifyContent: isSidebarHovered ? 'flex-start' : 'center',
      marginBottom: 24,
      transition: 'justify-content 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    userInfo: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      marginLeft: isSidebarHovered ? 12 : 0,
    },
    userInfoInner: {
      transition: 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: isSidebarHovered ? 1 : 0,
      transform: isSidebarHovered ? 'translateX(0)' : 'translateX(-10px)',
    },
    userName: {
      ...styles.userName,
      color: '#334155',
      whiteSpace: 'nowrap',
      fontSize: 14,
      fontWeight: 600,
    },
    userRole: {
      ...styles.userRole,
      color: '#94a3b8',
      whiteSpace: 'nowrap',
      fontSize: 12,
    },
    userAvatar: {
      ...styles.userAvatar,
      minWidth: 40,
      width: 40,
      height: 40,
      flexShrink: 0,
      background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      boxShadow: '0 2px 4px rgba(100, 116, 139, 0.2)',
    },

    // Navigation overrides
    navGroup: {
      marginBottom: 24,
    },
    navGroupLabel: {
      ...styles.navGroupLabel,
      color: '#94a3b8',
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      paddingLeft: 12,
      overflow: 'hidden',
      transition: 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), height 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: isSidebarHovered ? 1 : 0,
      height: isSidebarHovered ? '20px' : '0',
      marginBottom: isSidebarHovered ? 8 : 0,
    },
    divider: {
      ...styles.divider,
      background: '#f1f5f9',
      margin: '20px 0',
    },
    logoutBtn: {
      ...styles.logoutBtn,
      background: '#fff',
      color: '#ef4444',
      border: '1px solid #fecaca',
      borderRadius: '10px',
      justifyContent: isSidebarHovered ? 'flex-start' : 'center',
      padding: isSidebarHovered ? '12px 16px' : '12px',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      boxShadow: 'none',
    }
  };

  return (
    <div style={customStyles.appShell}>
      {/* --- SIDEBAR --- */}
      <aside
        style={customStyles.sidebar}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={customStyles.userCard}>
          <div style={customStyles.userAvatar}>{user.name.slice(0, 1).toUpperCase()}</div>
          <div style={customStyles.userInfo}>
            <div style={customStyles.userInfoInner}>
              <div style={customStyles.userName}>{user.name}</div>
              <div style={customStyles.userRole}>{user.role}</div>
            </div>
          </div>
        </div>

        <div style={customStyles.divider} />

        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Tổng quan</div>
          <NavItem active={active === 'dashboard'} onClick={() => setActive('dashboard')} icon="🏠" collapsed={!isSidebarHovered}>Dashboard</NavItem>
        </div>

        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Quản lý nhân sự</div>
          <NavItem active={active === 'employees'} onClick={() => setActive('employees')} icon="👥" collapsed={!isSidebarHovered}>Nhân viên</NavItem>
          <NavItem active={active === 'departments'} onClick={() => setActive('departments')} icon="🏢" collapsed={!isSidebarHovered}>Phòng ban</NavItem>
          <NavItem active={active === 'positions'} onClick={() => setActive('positions')} icon="💼" collapsed={!isSidebarHovered}>Chức vụ</NavItem>
          <NavItem active={active === 'contracts'} onClick={() => setActive('contracts')} icon="📝" collapsed={!isSidebarHovered}>Hợp đồng</NavItem>
        </div>

        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Nghỉ phép</div>
          <NavItem active={active === 'leaves'} onClick={() => setActive('leaves')} icon="📋" collapsed={!isSidebarHovered}>Quản lý nghỉ phép</NavItem>
          <NavItem active={active === 'my-leave'} onClick={() => setActive('my-leave')} icon="👁️" collapsed={!isSidebarHovered}>Xem đơn nghỉ phép</NavItem>
        </div>

        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Đánh giá & Khác</div>
          <NavItem active={active === 'evaluations'} onClick={() => setActive('evaluations')} icon="⭐" collapsed={!isSidebarHovered}>Đánh giá</NavItem>
          <NavItem active={active === 'storage'} onClick={() => setActive('storage')} icon="💾" collapsed={!isSidebarHovered}>Tài liệu công ty</NavItem>
          <NavItem active={active === 'chat'} onClick={() => setActive('chat')} icon="💬" collapsed={!isSidebarHovered}>Trò chuyện</NavItem>
        </div>

        <div style={{ flex: 1 }} />

        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Hệ thống</div>
          <NavItem active={active === 'profile'} onClick={() => setActive('profile')} icon="⚙️" collapsed={!isSidebarHovered}>Cài đặt</NavItem>
        </div>

        <button style={customStyles.logoutBtn} onClick={handleLogout}>
          <span style={{ fontSize: 20, minWidth: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚪</span>
          <span style={{
            marginLeft: isSidebarHovered ? 12 : 0,
            transition: 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: isSidebarHovered ? 1 : 0,
            transform: isSidebarHovered ? 'translateX(0)' : 'translateX(-10px)',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600
          }}>Đăng xuất</span>
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main style={customStyles.content}>

        {/* Dynamic Header */}
        {!['employees', 'employee-detail', 'departments', 'department-detail', 'positions', 'contracts', 'leaves', 'evaluations', 'storage', 'profile', 'my-leave'].includes(active) && (
          <header style={styles.header}>
            <div>
              <div style={styles.pageHeading}>{meta?.title || 'HR Dashboard'}</div>
              <div style={styles.subHeading}>Chào mừng trở lại, {user.name}</div>
            </div>
            <div style={styles.rightCluster}>
              <NotificationBell />
              <RoleBadge role={user.role} avatarUrl={userAvatar} />
            </div>
          </header>
        )}

        {/* Dashboard Overview */}
        {active === 'dashboard' && (
          <div style={styles.dashboardContent}>
            {loading ? (
              <div style={localStyles.loadingContainer}>
                <div className="spinner" style={localStyles.spinner}>⏳</div>
                <div style={{ color: '#64748b', marginTop: 16 }}>Đang tải dữ liệu hệ thống...</div>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div style={localStyles.statsGrid}>
                  <StatCard
                    title="Tổng nhân viên"
                    value={stats?.tongNhanVien || 0}
                    subtext={`${stats?.nhanVienDangLam || 0} đang hoạt động`}
                    icon="👥"
                    accentColor="#3b82f6"
                    onClick={() => setActive('employees')}
                  />
                  <StatCard
                    title="Cần phê duyệt"
                    value={(stats?.donNghiPhepChoDuyet || 0) + (stats?.bangLuongChoDuyet || 0)}
                    subtext={`${stats?.donNghiPhepChoDuyet || 0} đơn nghỉ • ${stats?.bangLuongChoDuyet || 0} bảng lương`}
                    icon="⚡"
                    accentColor="#f59e0b"
                    onClick={() => setActive('leaves')}
                    highlight={(stats?.donNghiPhepChoDuyet || 0) > 0}
                  />
                  <StatCard
                    title="Hợp đồng sắp hết hạn"
                    value={stats?.hopDongHetHan30Ngay || 0}
                    subtext="Trong 30 ngày tới"
                    icon="⚠️"
                    accentColor="#ef4444"
                    onClick={() => setActive('contracts')}
                    highlight={(stats?.hopDongHetHan30Ngay || 0) > 0}
                  />
                  <StatCard
                    title="Chi phí lương tháng"
                    value={formatCurrency(stats?.tongChiPhiLuongThang)}
                    subtext="Ước tính hiện tại"
                    icon="💰"
                    accentColor="#10b981"
                  />
                </div>

                {/* Main Charts Area */}
                <div style={localStyles.mainGrid}>
                  {/* Attendance Chart */}
                  <div style={localStyles.card}>
                    <div style={localStyles.cardHeader}>
                      <div style={localStyles.cardIconBg}>📊</div>
                      <h3 style={localStyles.cardTitle}>Chấm công theo phòng ban</h3>
                    </div>

                    <div style={localStyles.chartBody}>
                      {stats?.chamCongPhongBan?.length > 0 ? (
                        <div style={localStyles.barChartContainer}>
                          {stats.chamCongPhongBan.slice(0, 5).map((dept, idx) => (
                            <div key={idx} style={localStyles.barGroup}>
                              <div style={localStyles.barLabel} title={dept.tenPhongBan}>{dept.tenPhongBan}</div>
                              <div style={localStyles.barTrack}>
                                {/* Stacked Bar */}
                                <div style={{ ...localStyles.barSegment, width: `${dept.tiLeDungGio}%`, background: '#10b981' }} title={`Đúng giờ: ${dept.tiLeDungGio}%`} />
                                <div style={{ ...localStyles.barSegment, width: `${(dept.nhanVienDiMuon / dept.tongNhanVien * 100) || 0}%`, background: '#f59e0b' }} title={`Đi muộn: ${dept.nhanVienDiMuon}`} />
                                <div style={{ ...localStyles.barSegment, width: `${(dept.nhanVienVeSom / dept.tongNhanVien * 100) || 0}%`, background: '#ef4444' }} title={`Về sớm: ${dept.nhanVienVeSom}`} />
                              </div>
                              <div style={localStyles.barValue}>{dept.tiLeDungGio}%</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState message="Chưa có dữ liệu chấm công" icon="📅" />
                      )}
                    </div>

                    {stats?.chamCongPhongBan?.length > 0 && (
                      <div style={localStyles.legend}>
                        <LegendItem color="#10b981" label="Đúng giờ" />
                        <LegendItem color="#f59e0b" label="Đi muộn" />
                        <LegendItem color="#ef4444" label="Về sớm" />
                      </div>
                    )}
                  </div>

                  {/* Demographics Only (Welcome card removed) */}
                  <div style={localStyles.sideColumn}>
                    {/* Age Chart */}
                    <div style={localStyles.card}>
                      <div style={localStyles.cardHeader}>
                        <div style={localStyles.cardIconBg}>👥</div>
                        <h3 style={localStyles.cardTitle}>Độ tuổi nhân sự</h3>
                      </div>
                      <div style={localStyles.chartBody}>
                        {stats?.nhanVienTheoTuoi?.length > 0 ? (
                          <div style={localStyles.pieList}>
                            {stats.nhanVienTheoTuoi.map((item, idx) => (
                              <div key={idx} style={localStyles.pieItem}>
                                <div style={localStyles.pieItemHeader}>
                                  <span style={localStyles.pieLabel}>{item.nhomTuoi}</span>
                                  <span style={localStyles.pieValue}>{item.soLuong}</span>
                                </div>
                                <div style={localStyles.pieTrack}>
                                  <div style={{ ...localStyles.pieFill, width: `${item.tiLe}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <EmptyState message="Chưa có dữ liệu độ tuổi" icon="🎂" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Shared Components & Pages */}
        {active === 'profile' && <SharedProfilePage title="Hồ sơ cá nhân" breadcrumb="Cá nhân / Hồ sơ cá nhân" allowEdit={true} />}
        {active === 'my-leave' && <SharedLeaveRequestPage title="Quản lý nghỉ phép" breadcrumb="HR / Quản lý nghỉ phép" viewMode="management" />}
        {active === 'employees' && <EmployeesPage onViewDetail={handleViewEmployeeDetail} />}
        {active === 'employee-detail' && selectedEmployeeId && <EmployeeDetailPage employeeId={selectedEmployeeId} onBack={handleBackFromEmployeeDetail} />}
        {active === 'departments' && <DepartmentsPage onViewDetail={handleViewDepartmentDetail} />}
        {active === 'department-detail' && selectedDepartmentId && <DepartmentDetailPage departmentId={selectedDepartmentId} onBack={handleBackFromDepartmentDetail} />}
        {active === 'positions' && <PositionsPage />}
        {active === 'contracts' && <ContractsPage />}
        {active === 'leaves' && <LeavesPage />}
        {active === 'evaluations' && <EvaluationsPage />}
        {active === 'storage' && <HRStoragePage />}
        {active === 'chat' && <ChatPage />}
      </main>
    </div>
  )
}

// --- Sub-components ---

const StatCard = ({ title, value, subtext, icon, accentColor, onClick, highlight }) => (
  <div
    style={{
      ...localStyles.statCard,
      cursor: onClick ? 'pointer' : 'default',
      borderLeft: highlight ? `4px solid ${accentColor}` : 'none'
    }}
    onClick={onClick}
    className="hover-card" // Class for CSS hover effects if globally available
  >
    <div style={localStyles.statHeader}>
      <div style={{ ...localStyles.statIcon, background: `${accentColor}20`, color: accentColor }}>{icon}</div>
      {highlight && <div style={localStyles.badge}>Cần xử lý</div>}
    </div>
    <div style={localStyles.statValue}>{value}</div>
    <div style={localStyles.statLabel}>{title}</div>
    <div style={{ ...localStyles.statSub, color: highlight ? accentColor : '#64748b' }}>
      {subtext}
    </div>
  </div>
);

const EmptyState = ({ message, icon }) => (
  <div style={localStyles.emptyState}>
    <div style={localStyles.emptyIcon}>{icon}</div>
    <div style={localStyles.emptyText}>{message}</div>
  </div>
);

const LegendItem = ({ color, label }) => (
  <div style={localStyles.legendItem}>
    <div style={{ ...localStyles.legendDot, background: color }} />
    {label}
  </div>
);

// --- Styles ---

const localStyles = {
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400 },
  spinner: { fontSize: 40, animation: 'spin 1s linear infinite' },

  welcomeBanner: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: '24px 32px', borderRadius: 16, marginBottom: 32,
    color: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  welcomeContent: { maxWidth: '60%' },
  welcomeTitle: { margin: '0 0 8px 0', fontSize: 24, fontWeight: 700 },
  welcomeText: { margin: 0, opacity: 0.9, fontSize: 15, lineHeight: 1.5 },
  bannerBtn: {
    border: 'none', background: '#fff', color: '#0f172a',
    padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
    cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 24 },

  statCard: {
    background: '#fff', padding: 24, borderRadius: 16,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex', flexDirection: 'column'
  },
  statHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  statIcon: { width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 },
  statValue: { fontSize: 32, fontWeight: 700, color: '#0f172a', lineHeight: 1 },
  statLabel: { fontSize: 14, fontWeight: 600, color: '#64748b', marginTop: 8 },
  statSub: { fontSize: 13, marginTop: 4 },
  badge: { padding: '2px 8px', background: '#fee2e2', color: '#ef4444', borderRadius: 100, fontSize: 11, fontWeight: 600 },

  mainGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' },
  sideColumn: { display: 'flex', flexDirection: 'column', gap: 24 },

  card: {
    background: '#fff', borderRadius: 16,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden', display: 'flex', flexDirection: 'column'
  },
  cardHeader: { padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 12 },
  cardIconBg: { width: 32, height: 32, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 },
  cardTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' },
  chartBody: { padding: 24, minHeight: 200 },

  barChartContainer: { display: 'flex', flexDirection: 'column', gap: 16 },
  barGroup: { display: 'flex', alignItems: 'center', gap: 16 },
  barLabel: { width: 120, fontSize: 13, fontWeight: 500, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  barTrack: { flex: 1, height: 12, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden', display: 'flex' },
  barSegment: { height: '100%' },
  barValue: { width: 40, textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#334155' },

  legend: { display: 'flex', gap: 20, padding: '0 24px 24px 24px', borderTop: '1px solid #f8fafc', paddingTop: 16 },
  legendItem: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b' },
  legendDot: { width: 10, height: 10, borderRadius: 4 },

  pieList: { display: 'flex', flexDirection: 'column', gap: 16 },
  pieItem: { display: 'flex', flexDirection: 'column', gap: 6 },
  pieItemHeader: { display: 'flex', justifyContent: 'space-between', fontSize: 13 },
  pieLabel: { color: '#475569', fontWeight: 500 },
  pieValue: { color: '#0f172a', fontWeight: 600 },
  pieTrack: { height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' },
  pieFill: { height: '100%', background: '#3b82f6', borderRadius: 4 },

  actionBtn: {
    border: 'none', background: '#fff', color: '#2563eb',
    padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
    cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },

  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1', minHeight: 150 },
  emptyIcon: { fontSize: 32, marginBottom: 8, opacity: 0.5 },
  emptyText: { fontSize: 14 }
};
