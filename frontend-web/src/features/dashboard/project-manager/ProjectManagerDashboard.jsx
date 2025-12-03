import { useMemo, useState, useRef } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePermissions, useErrorHandler } from '@/shared/hooks'
import { dashboardBaseStyles as styles } from '@/shared/styles/dashboard'
import { NavItem, RoleBadge, KPICard } from './components/ProjectManagerDashboard.components'
import { kpiData, notifications, sectionsConfig } from './components/ProjectManagerDashboard.constants'

// Import các module tính năng đã tách riêng
import { ProfilePage, LeavePage, ApprovalsPage, ChatPage, ProjectsPage, PMStoragePage } from '@modules/project';
import { LeavesPage } from '@modules/hr'
import NotificationBell from '@/shared/components/notification/NotificationBell'
import { AIChatBot } from '@/shared/components/ai-chatbot'

export default function ProjectManagerDashboard() {
  const [active, setActive] = useState('dashboard')

  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'Project Manager'
  const user = useMemo(() => ({ name: username || 'Trần Thị B', role: 'Quản lý dự án' }), [username])

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
    hoverTimeoutRef.current = setTimeout(() => {
      setIsSidebarHovered(false);
    }, 100);
  };

  const handleLogout = async () => {
    await logout()
  }

  // Function để render nội dung dựa trên tab được chọn
  const renderContent = () => {
    switch (active) {
      case 'dashboard':
        return <DashboardOverview user={user} setActive={setActive} />
      case 'profile':
        return <ProfilePage />
      case 'leave':
        return <LeavePage />
      case 'storage':
        return <PMStoragePage />
      case 'approvals':
        return <ApprovalsPage />
      case 'team-leaves':
        return <LeavesPage />
      case 'projects':
        return <ProjectsPage />
      case 'chat':
        return <ChatPage />
      default:
        return <DashboardOverview user={user} setActive={setActive} />
    }
  }

  // Custom Styles for Light/Collapsed Theme (same as HR Manager)
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
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
    },
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
          <NavItem active={active === 'dashboard'} onClick={() => setActive('dashboard')} icon="🏠" collapsed={!isSidebarHovered}>
            {sections.dashboard.title}
          </NavItem>
        </div>

        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Quản lý dự án</div>
          <NavItem active={active === 'projects'} onClick={() => setActive('projects')} icon="🏗️" collapsed={!isSidebarHovered}>
            {sections.projects.title}
          </NavItem>
          <NavItem active={active === 'team-leaves'} onClick={() => setActive('team-leaves')} icon="✅" collapsed={!isSidebarHovered}>
            Duyệt nghỉ phép
          </NavItem>
        </div>

        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Cá nhân</div>
          <NavItem active={active === 'leave'} onClick={() => setActive('leave')} icon="📋" collapsed={!isSidebarHovered}>
            {sections.leave.title}
          </NavItem>
          <NavItem active={active === 'storage'} onClick={() => setActive('storage')} icon="💾" collapsed={!isSidebarHovered}>
            File của tôi
          </NavItem>
        </div>

        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Giao tiếp</div>
          <NavItem active={active === 'chat'} onClick={() => setActive('chat')} icon="💬" collapsed={!isSidebarHovered}>
            {sections.chat.title}
          </NavItem>
        </div>

        <div style={{ flex: 1 }} />

        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Hệ thống</div>
          <NavItem active={active === 'profile'} onClick={() => setActive('profile')} icon="⚙️" collapsed={!isSidebarHovered}>
            Thông tin & Tài khoản
          </NavItem>
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
        <header style={styles.header}>
          <div>
            <div style={styles.pageHeading}>{meta.pageTitle || meta.title}</div>
            {active !== 'chat' && <div style={styles.subHeading}>{meta.subtitle}</div>}
          </div>

          <div style={styles.rightCluster}>
            <NotificationBell />
            <RoleBadge role={user.role} />
          </div>
        </header>

        {/* Render nội dung động dựa trên tab được chọn */}
        {renderContent()}
      </main>

      {/* AI ChatBot - Floating button góc dưới phải */}
      <AIChatBot />
    </div>
  )
}

// Component Dashboard Overview - Chỉ hiển thị tổng quan, KPIs, charts
function DashboardOverview({ user, setActive }) {
  return (
    <div style={styles.dashboardContent}>
      {/* KPI Cards Row */}
      <div style={styles.kpiGrid}>
        <KPICard
          title="Số nhân viên"
          value={`${kpiData.teamSize} người`}
          icon="👥"
          color="success"
          change="+2 người"
        />
        <KPICard
          title="Đơn chờ duyệt"
          value={`${kpiData.pendingLeaves} đơn`}
          icon="⏳"
          color="warning"
          change="Cần xử lý"
        />
        <KPICard
          title="Đã duyệt hôm nay"
          value={`${kpiData.approvedToday} đơn`}
          icon="✓"
          color="info"
          change="+2 đơn"
        />
        <KPICard
          title="Tổng đơn tháng"
          value={`${kpiData.totalRequests} đơn`}
          icon="📊"
          color="primary"
          change="+5 đơn"
        />
      </div>

      {/* Welcome & Notifications Row */}
      <div style={styles.cardsRow}>
        <div style={styles.welcomeCard}>
          <div style={styles.welcomeContent}>
            <h3 style={styles.welcomeTitle}>Chào mừng, {user.name}!</h3>
            <p style={styles.welcomeText}>
              Bạn có {kpiData.pendingLeaves} đơn nghỉ phép đang chờ duyệt.
              Hãy xem xét và phê duyệt để nhân viên có thể sắp xếp công việc.
            </p>
            <button style={styles.checkInBtn} onClick={() => setActive('approvals')}>
              ✓ Xem đơn chờ duyệt
            </button>
          </div>
        </div>

        <div style={styles.notificationCard}>
          <h4 style={styles.cardTitle}>Thông báo & Sự kiện</h4>
          <div style={styles.notificationList}>
            {notifications.map((notif, idx) => (
              <div key={idx} style={styles.notificationItem}>
                <div style={styles.notifIcon}>📢</div>
                <div style={styles.notifContent}>
                  <div style={styles.notifTitle}>{notif.title}</div>
                  <div style={styles.notifDesc}>{notif.desc}</div>
                  <div style={styles.notifDate}>{notif.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={styles.chartsRow}>
        <div style={styles.chartCard}>
          <h4 style={styles.cardTitle}>Biểu đồ chấm công nhóm</h4>
          <div style={styles.chartPlaceholder}>
            <div style={styles.chartInfo}>📊 Biểu đồ đang được phát triển</div>
          </div>
        </div>

        <div style={styles.chartCard}>
          <h4 style={styles.cardTitle}>Thống kê nghỉ phép</h4>
          <div style={styles.chartPlaceholder}>
            <div style={styles.chartInfo}>📈 Biểu đồ đang được phát triển</div>
          </div>
        </div>
      </div>
    </div>
  )
}
