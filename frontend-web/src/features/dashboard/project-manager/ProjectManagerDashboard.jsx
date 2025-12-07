import { useMemo, useState, useRef, useEffect } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { dashboardBaseStyles as styles } from '@/shared/styles/dashboard'
import { profileService } from '@/shared/services/profile.service'
import {
  NavItem,
  RoleBadge,
  StatCard,
  ProjectStatsCard,
  PendingApprovalsWidget,
  QuickActionButton
} from './components/ProjectManagerDashboard.components'
import { sectionsConfig } from './components/ProjectManagerDashboard.constants'
import { pmDashboardService } from './services/pmDashboard.service'

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
  const [userAvatar, setUserAvatar] = useState(null)

  // Fetch user avatar on mount
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
            <RoleBadge role={user.role} avatarUrl={userAvatar} />
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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await pmDashboardService.getOverviewStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading PM dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle leave approval
  const handleApproveLeave = async (leaveId) => {
    try {
      await pmDashboardService.approveLeave(leaveId);
      // Refresh data
      const data = await pmDashboardService.getOverviewStats();
      setStats(data);
    } catch (error) {
      console.error('Error approving leave:', error);
      alert('Có lỗi khi duyệt đơn: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle leave rejection
  const handleRejectLeave = async (leaveId) => {
    const reason = prompt('Nhập lý do từ chối:');
    if (!reason) return;

    try {
      await pmDashboardService.rejectLeave(leaveId, reason);
      // Refresh data
      const data = await pmDashboardService.getOverviewStats();
      setStats(data);
    } catch (error) {
      console.error('Error rejecting leave:', error);
      alert('Có lỗi khi từ chối đơn: ' + (error.response?.data?.message || error.message));
    }
  };

  // Dashboard local styles
  const dashboardStyles = {
    container: {
      padding: 32,
      maxWidth: 1400,
      margin: '0 auto'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 20,
      marginBottom: 24
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: 24,
      marginBottom: 24
    },
    quickActions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16
    }
  };

  return (
    <div style={dashboardStyles.container}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            Chào mừng, {user.name}!
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>
            {stats?.pendingLeaveCount > 0
              ? `Bạn có ${stats.pendingLeaveCount} đơn nghỉ phép cần duyệt.`
              : 'Tất cả đơn đã được xử lý. Hãy kiểm tra tiến độ dự án.'}
          </p>
        </div>
        <button
          onClick={() => setActive('projects')}
          style={{
            background: '#fff',
            color: '#1e3a8a',
            border: 'none',
            padding: '12px 24px',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          🏗️ Xem dự án
        </button>
      </div>

      {/* Stats Grid */}
      <div style={dashboardStyles.statsGrid}>
        <StatCard
          title="Tổng dự án"
          value={loading ? '...' : stats?.totalProjects || 0}
          subtext="Dự án đang quản lý"
          icon="🏗️"
          accentColor="#3b82f6"
          loading={loading}
          onClick={() => setActive('projects')}
        />
        <StatCard
          title="Issues đang xử lý"
          value={loading ? '...' : stats?.inProgressIssues || 0}
          subtext={`${stats?.completedIssues || 0} đã hoàn thành`}
          icon="🔄"
          accentColor="#8b5cf6"
          loading={loading}
          onClick={() => setActive('projects')}
        />
        <StatCard
          title="Đơn chờ duyệt"
          value={loading ? '...' : stats?.pendingLeaveCount || 0}
          subtext="Cần xử lý"
          icon="📋"
          accentColor="#f59e0b"
          loading={loading}
          onClick={() => setActive('team-leaves')}
          highlight={(stats?.pendingLeaveCount || 0) > 0}
        />
        <StatCard
          title="Thành viên"
          value={loading ? '...' : stats?.totalMembers || 0}
          subtext="Trong các dự án"
          icon="👥"
          accentColor="#10b981"
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div style={dashboardStyles.mainGrid}>
        {/* Project Stats Card */}
        <ProjectStatsCard
          projects={stats?.projects || []}
          loading={loading}
          onViewAll={() => setActive('projects')}
        />

        {/* Pending Approvals Widget */}
        <PendingApprovalsWidget
          leaves={stats?.pendingLeavesList || []}
          loading={loading}
          onApprove={handleApproveLeave}
          onReject={handleRejectLeave}
          onViewAll={() => setActive('team-leaves')}
        />
      </div>

      {/* Quick Actions */}
      <div style={dashboardStyles.quickActions}>
        <QuickActionButton
          icon="🏗️"
          label="Xem dự án"
          onClick={() => setActive('projects')}
          color="#3b82f6"
        />
        <QuickActionButton
          icon="✅"
          label="Duyệt nghỉ phép"
          onClick={() => setActive('team-leaves')}
          color="#10b981"
        />
        <QuickActionButton
          icon="📋"
          label="Đơn của tôi"
          onClick={() => setActive('leave')}
          color="#f59e0b"
        />
        <QuickActionButton
          icon="💬"
          label="Trò chuyện"
          onClick={() => setActive('chat')}
          color="#8b5cf6"
        />
      </div>
    </div>
  )
}
