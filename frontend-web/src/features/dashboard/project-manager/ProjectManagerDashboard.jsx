import { useMemo, useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { styles } from './ProjectManagerDashboard.styles'
import { NavItem, RoleBadge, KPICard } from './components/ProjectManagerDashboard.components'
import { kpiData, notifications, sectionsConfig } from './components/ProjectManagerDashboard.constants'

// Import các module tính năng đã tách riêng
import {
  ProfilePage,
  TimesheetPage,
  LeavePage,
  ApprovalsPage,
  PayrollPage,
  DocumentsPage,
  ProjectsPage,
  ChatPage
} from '@/features/project'

export default function ProjectManagerDashboard() {
  const [active, setActive] = useState('dashboard')

  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'Project Manager'
  const user = useMemo(() => ({ name: username || 'Trần Thị B', role: 'Quản lý dự án' }), [username])

  const sections = useMemo(() => sectionsConfig, [])
  const meta = sections[active]

  const handleLogout = async () => {
    await logout()
  }

  // Function để render nội dung dựa trên tab được chọn
  const renderContent = () => {
    switch(active) {
      case 'dashboard':
        return <DashboardOverview user={user} setActive={setActive} />
      case 'profile':
        return <ProfilePage />
      case 'timesheet':
        return <TimesheetPage />
      case 'leave':
        return <LeavePage />
      case 'approvals':
        return <ApprovalsPage />
      case 'payroll':
        return <PayrollPage />
      case 'documents':
        return <DocumentsPage />
      case 'projects':
        return <ProjectsPage />
      case 'chat':
        return <ChatPage />
      default:
        return <DashboardOverview user={user} setActive={setActive} />
    }
  }

  return (
    <div style={styles.appShell}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>⚡</div>
          <div>
            <div style={styles.brandName}>QLNS Project Manager</div>
            <div style={styles.brandSubtitle}>Portal</div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.userCard}>
          <div style={styles.userAvatar}>{user.name.slice(0, 1).toUpperCase()}</div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userRole}>🎯 {user.role}</div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.navGroup}>
          <div style={styles.navGroupLabel}>Menu chính</div>
          <NavItem active={active === 'dashboard'} onClick={() => setActive('dashboard')} icon="🏠">
            {sections.dashboard.title}
          </NavItem>
          <NavItem active={active === 'profile'} onClick={() => setActive('profile')} icon="👤">
            {sections.profile.title}
          </NavItem>
          <NavItem active={active === 'timesheet'} onClick={() => setActive('timesheet')} icon="🕐">
            {sections.timesheet.title}
          </NavItem>
          <NavItem active={active === 'leave'} onClick={() => setActive('leave')} icon="📋">
            {sections.leave.title}
          </NavItem>
          <NavItem active={active === 'approvals'} onClick={() => setActive('approvals')} icon="✓">
            {sections.approvals.title}
          </NavItem>
          <NavItem active={active === 'payroll'} onClick={() => setActive('payroll')} icon="💰">
            {sections.payroll.title}
          </NavItem>
          <NavItem active={active === 'documents'} onClick={() => setActive('documents')} icon="📄">
            {sections.documents.title}
          </NavItem>
          <NavItem active={active === 'projects'} onClick={() => setActive('projects')} icon="🏗️">
            {sections.projects.title}
          </NavItem>
          <NavItem active={active === 'chat'} onClick={() => setActive('chat')} icon="💬">
            {sections.chat.title}
          </NavItem>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Đăng xuất
        </button>
      </aside>

      <main style={styles.content}>
        <header style={styles.header}>
          <div>
            <div style={styles.pageHeading}>{meta.pageTitle || meta.title}</div>
            {active !== 'chat' && <div style={styles.subHeading}>{meta.subtitle}</div>}
          </div>

          <div style={styles.rightCluster}>
            <RoleBadge role={user.role} />
          </div>
        </header>

        {/* Render nội dung động dựa trên tab được chọn */}
        {renderContent()}
      </main>
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
