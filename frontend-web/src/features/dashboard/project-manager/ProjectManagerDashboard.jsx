import { useMemo, useState, useEffect, useRef } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { dashboardBaseStyles as styles } from '@/shared/styles/dashboard'
import { NavItem, RoleBadge } from './components/ProjectManagerDashboard.components'
import { sectionsConfig } from './components/ProjectManagerDashboard.constants'

// Import feature modules
import { ProfilePage, LeavePage, ApprovalsPage, ChatPage, ProjectsPage, PMStoragePage } from '@modules/project';
import { LeavesPage } from '@modules/hr' // Team leaves management
import NotificationBell from '@/shared/components/notification/NotificationBell'
import { AIChatBot } from '@/shared/components/ai-chatbot'

// Services
import { dashboardApi } from '@/features/project/projects/api/dashboardApi'
import { issueApi } from '@/features/project/projects/api/issueApi'
import { leavesService } from '@/features/hr/shared/services/leaves.service'

export default function ProjectManagerDashboard() {
  const [active, setActive] = useState('dashboard')
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'Project Manager'
  const user = useMemo(() => ({ name: username || 'Trần Thị B', role: 'Quản lý dự án' }), [username])

  const sections = useMemo(() => sectionsConfig, [])
  const meta = sections[active] || { title: 'Dashboard', subtitle: 'Tổng quan hệ thống' }

  // --- Handlers ---
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsSidebarHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsSidebarHovered(false), 100);
  };

  const handleLogout = async () => await logout();

  // --- Custom Styles (Matching HR Dashboard) ---
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
    navGroup: { marginBottom: 24 },
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
            Dashboard
          </NavItem>
          <NavItem active={active === 'profile'} onClick={() => setActive('profile')} icon="👤" collapsed={!isSidebarHovered}>
            Hồ sơ cá nhân
          </NavItem>
        </div>

        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Quản lý dự án</div>
          <NavItem active={active === 'projects'} onClick={() => setActive('projects')} icon="🏗️" collapsed={!isSidebarHovered}>
            Dự án & Tác vụ
          </NavItem>
          <NavItem active={active === 'approvals'} onClick={() => setActive('approvals')} icon="✅" collapsed={!isSidebarHovered}>
            Duyệt nghỉ phép
          </NavItem>
        </div>

        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Cá nhân</div>
          <NavItem active={active === 'my-leave'} onClick={() => setActive('my-leave')} icon="📋" collapsed={!isSidebarHovered}>
            Nghỉ phép của tôi
          </NavItem>
          <NavItem active={active === 'storage'} onClick={() => setActive('storage')} icon="💾" collapsed={!isSidebarHovered}>
            File của tôi
          </NavItem>
          <NavItem active={active === 'chat'} onClick={() => setActive('chat')} icon="💬" collapsed={!isSidebarHovered}>
            Giao tiếp
          </NavItem>
        </div>

        <div style={{flex: 1}} />

        <button style={customStyles.logoutBtn} onClick={handleLogout}>
          <span style={{fontSize: 20, minWidth: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🚪</span>
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
        {!['projects', 'profile', 'my-leave', 'storage', 'chat'].includes(active) && (
          <header style={styles.header}>
            <div>
              <div style={styles.pageHeading}>{meta.pageTitle || meta.title}</div>
              <div style={styles.subHeading}>{active === 'dashboard' ? `Chào mừng trở lại, ${user.name}` : meta.subtitle}</div>
            </div>
            <div style={styles.rightCluster}>
              <NotificationBell />
              <RoleBadge role={user.role} />
            </div>
          </header>
        )}

        {active === 'dashboard' && <DashboardOverview setActive={setActive} />}
        {active === 'profile' && <ProfilePage />}
        {active === 'projects' && <ProjectsPage />}
        {active === 'approvals' && <ApprovalsPage />}
        {active === 'my-leave' && <LeavePage />}
        {active === 'storage' && <PMStoragePage />}
        {active === 'chat' && <ChatPage />}
      </main>

      <AIChatBot />
    </div>
  )
}

// --- Dashboard Overview Component ---

function DashboardOverview({ setActive }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Run independent requests in parallel
        const [projectsStats, myIssues, pendingLeaves] = await Promise.all([
          dashboardApi.getMyProjectsStats().catch((e) => { console.error('getMyProjectsStats error:', e); return []; }),
          issueApi.getMyIssues().catch((e) => { console.error('getMyIssues error:', e); return []; }),
          leavesService.getPending().catch((e) => { console.error('getPending error:', e); return []; })
        ]);

        // Debug logs
        console.log('📊 Dashboard Data Loaded:');
        console.log('- projectsStats:', projectsStats);
        console.log('- myIssues:', myIssues);
        console.log('- pendingLeaves:', pendingLeaves);

        // Aggregate Stats
        const totalProjects = projectsStats.length;
        // Backend uses: ACTIVE, ON_HOLD, OVERDUE, COMPLETED, CANCELLED
        const activeProjects = projectsStats.filter(p => p.status === 'ACTIVE').length;
        const totalTasks = myIssues.length;
        // Count tasks that are not completed (check multiple possible status names)
        const pendingTasks = myIssues.filter(i => {
          const statusName = i.statusName || i.issueStatus?.name || '';
          return statusName.toLowerCase() !== 'done' && statusName.toLowerCase() !== 'completed';
        }).length;
        const pendingLeavesCount = pendingLeaves.length;
        
        // Calculate avg completion rate
        const avgCompletion = totalProjects > 0 
          ? projectsStats.reduce((sum, p) => sum + (p.completionRate || 0), 0) / totalProjects 
          : 0;

        setStats({
          projectsStats,
          totalProjects,
          activeProjects,
          totalTasks,
          pendingTasks,
          pendingLeavesCount,
          avgCompletion,
          pendingLeaves: pendingLeaves.slice(0, 5) // Latest 5
        });

      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={localStyles.loadingContainer}>
        <div className="spinner" style={localStyles.spinner}>⏳</div> 
        <div style={{color: '#64748b', marginTop: 16}}>Đang tải dữ liệu dự án...</div>
      </div>
    );
  }

  return (
    <div style={styles.dashboardContent}>
      {/* KPI Grid */}
      <div style={localStyles.statsGrid}>
        <StatCard 
          title="Dự án hoạt động"
          value={stats?.activeProjects || 0}
          subtext={`Trên tổng số ${stats?.totalProjects || 0} dự án`}
          icon="🏗️"
          accentColor="#3b82f6"
          onClick={() => setActive('projects')}
        />
        <StatCard 
          title="Tác vụ của tôi"
          value={stats?.pendingTasks || 0}
          subtext={`${stats?.totalTasks || 0} tác vụ được giao`}
          icon="📋"
          accentColor="#f59e0b"
          onClick={() => setActive('projects')}
          highlight={(stats?.pendingTasks || 0) > 0}
        />
        <StatCard 
          title="Đơn chờ duyệt"
          value={stats?.pendingLeavesCount || 0}
          subtext="Đơn nghỉ phép cần xử lý"
          icon="✍️"
          accentColor="#ef4444"
          onClick={() => setActive('approvals')}
          highlight={(stats?.pendingLeavesCount || 0) > 0}
        />
        <StatCard 
          title="Tiến độ trung bình"
          value={`${stats?.avgCompletion.toFixed(1)}%`}
          subtext="Tất cả dự án"
          icon="📈"
          accentColor="#10b981"
        />
      </div>

      {/* Charts / Tables Grid */}
      <div style={localStyles.mainGrid}>
        {/* Project Progress */}
        <div style={localStyles.card}>
          <div style={localStyles.cardHeader}>
            <div style={localStyles.cardIconBg}>📊</div>
            <h3 style={localStyles.cardTitle}>Tiến độ dự án</h3>
          </div>
          <div style={localStyles.chartBody}>
            {stats?.projectsStats?.length > 0 ? (
              <div style={localStyles.barChartContainer}>
                {stats.projectsStats.slice(0, 5).map((proj, idx) => (
                  <div key={idx} style={localStyles.barGroup}>
                    <div style={localStyles.barLabel} title={proj.projectName}>{proj.projectName}</div>
                    <div style={localStyles.barTrack}>
                      <div 
                        style={{
                          ...localStyles.barFill, 
                          width: `${proj.completionRate || 0}%`,
                          background: getProgressColor(proj.completionRate)
                        }} 
                      />
                    </div>
                    <div style={localStyles.barValue}>{Math.round(proj.completionRate || 0)}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="Chưa có dữ liệu dự án" icon="📂" />
            )}
          </div>
        </div>

        {/* Pending Approvals Mini List */}
        <div style={localStyles.card}>
          <div style={localStyles.cardHeader}>
            <div style={localStyles.cardIconBg}>⏳</div>
            <h3 style={localStyles.cardTitle}>Cần duyệt gấp</h3>
          </div>
          <div style={{...localStyles.chartBody, padding: 0}}>
            {stats?.pendingLeaves?.length > 0 ? (
              <div style={localStyles.listContainer}>
                {stats.pendingLeaves.map((item, idx) => (
                  <div key={idx} style={localStyles.listItem}>
                    <div style={localStyles.listItemAvatar}>
                      {(item.hoTenNhanVien || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div style={localStyles.listItemContent}>
                      <div style={localStyles.listItemTitle}>{item.hoTenNhanVien}</div>
                      <div style={localStyles.listItemSub}>{item.loaiPhepLabel || 'Nghỉ phép'} • {item.soNgay} ngày</div>
                    </div>
                    <button 
                      style={localStyles.miniActionBtn}
                      onClick={() => setActive('approvals')}
                    >
                      Xem
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="Không có đơn chờ duyệt" icon="✅" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helpers ---
const getProgressColor = (rate) => {
  if (rate >= 80) return '#10b981';
  if (rate >= 50) return '#f59e0b';
  return '#ef4444';
};

// --- Sub-components (Reused from HR Dashboard style) ---

const StatCard = ({ title, value, subtext, icon, accentColor, onClick, highlight }) => (
  <div 
    style={{
      ...localStyles.statCard, 
      cursor: onClick ? 'pointer' : 'default',
      borderLeft: highlight ? `4px solid ${accentColor}` : 'none'
    }}
    onClick={onClick}
  >
    <div style={localStyles.statHeader}>
      <div style={{...localStyles.statIcon, background: `${accentColor}20`, color: accentColor}}>{icon}</div>
      {highlight && <div style={localStyles.badge}>Cần xử lý</div>}
    </div>
    <div style={localStyles.statValue}>{value}</div>
    <div style={localStyles.statLabel}>{title}</div>
    <div style={{...localStyles.statSub, color: highlight ? accentColor : '#64748b'}}>
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

// --- Local Styles ---
const localStyles = {
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400 },
  spinner: { fontSize: 40, animation: 'spin 1s linear infinite' },
  
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 24 },
  statCard: { 
    background: '#fff', padding: 24, borderRadius: 16, 
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s',
    display: 'flex', flexDirection: 'column'
  },
  statHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  statIcon: { width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 },
  statValue: { fontSize: 32, fontWeight: 700, color: '#0f172a', lineHeight: 1 },
  statLabel: { fontSize: 14, fontWeight: 600, color: '#64748b', marginTop: 8 },
  statSub: { fontSize: 13, marginTop: 4 },
  badge: { padding: '2px 8px', background: '#fee2e2', color: '#ef4444', borderRadius: 100, fontSize: 11, fontWeight: 600 },
  
  mainGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' },
  
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
  barLabel: { width: 150, fontSize: 13, fontWeight: 500, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  barTrack: { flex: 1, height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  barValue: { width: 40, textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#334155' },
  
  listContainer: { display: 'flex', flexDirection: 'column' },
  listItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '16px 24px', borderBottom: '1px solid #f1f5f9' },
  listItemAvatar: { width: 36, height: 36, borderRadius: 18, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#475569' },
  listItemContent: { flex: 1 },
  listItemTitle: { fontSize: 14, fontWeight: 600, color: '#0f172a' },
  listItemSub: { fontSize: 12, color: '#64748b' },
  miniActionBtn: { border: 'none', background: 'transparent', color: '#3b82f6', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1', minHeight: 150 },
  emptyIcon: { fontSize: 32, marginBottom: 8, opacity: 0.5 },
  emptyText: { fontSize: 14 }
};
