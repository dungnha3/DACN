import { useEffect, useMemo, useState, useRef } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { dashboardBaseStyles as styles } from '@/shared/styles/dashboard'
import { NavItem, RoleBadge, StatCard, QuickActionButton } from './components/AccountingManagerDashboard.components'
import { kpiData, notifications, sectionsConfig } from './components/AccountingManagerDashboard.constants'
import { leavesService } from '@/features/hr/shared/services/leaves.service'
import { PayrollManagementPage, AttendanceManagementPage, AccountingStoragePage } from '@/modules/accounting'
import { SharedProfilePage } from '@/shared/components/profile'
import { SharedPayrollPage } from '@/shared/components/payroll'
import { ChatPage } from '@/modules/project'
import NotificationBell from '@/shared/components/notification/NotificationBell'

export default function AccountingManagerDashboard() {
  const [active, setActive] = useState('dashboard')
  const [approvals, setApprovals] = useState([])
  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'Accounting Manager'
  const user = useMemo(() => ({ name: username || 'Nguyễn Thị F', role: 'Quản lý kế toán' }), [username])

  const sections = useMemo(() => sectionsConfig, [])
  const meta = sections[active] || { title: 'Dashboard', subtitle: 'Quản lý tài chính' }
  const pendingApprovals = useMemo(() => approvals.filter(a => a.status === 'pending'), [approvals])

  // State for sidebar hover (synchronized with Employee/HR Dashboards)
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)
  const hoverTimeoutRef = useRef(null)

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setIsSidebarHovered(true)
  }

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsSidebarHovered(false)
    }, 100)
  }

  const handleLogout = async () => {
    await logout()
  }

  const mapLeaveStatus = (s) => {
    const m = { CHO_DUYET: 'pending', DA_DUYET: 'approved', BI_TU_CHOI: 'rejected' }
    return m[s] || s || 'pending'
  }

  const loadApprovals = async () => {
    try {
      const data = await leavesService.getPending()
      const mapped = (data || []).map((item) => ({
        id: item.nghiphepId || item.id,
        employee: item.hoTenNhanVien || item.employee || item.tenNhanVien || 'N/A',
        type: item.loaiPhepLabel || item.type || 'Nghỉ phép',
        fromDate: item.ngayBatDau || item.fromDate,
        toDate: item.ngayKetThuc || item.toDate,
        days: item.soNgay ?? item.days ?? 0,
        submitDate: item.ngayTao || item.submitDate || '',
        reason: item.lyDo || item.reason || '',
        status: mapLeaveStatus(item.trangThai || item.status)
      }))
      setApprovals(mapped)
    } catch (err) {
      // Don't show alert on initial load
    }
  }

  useEffect(() => {
    loadApprovals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Custom Styles for Light/Collapsed Theme (EXACT COPY from EmployeeDashboard)
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
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
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
  }

  // Dashboard specific styles
  const dashboardStyles = {
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 20,
      marginBottom: 24
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20,
      marginBottom: 24
    },
    quickActions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
      marginTop: 20
    },
    welcomeCard: {
      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      padding: 28,
      borderRadius: 20,
      color: '#fff',
      boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
    },
    notificationCard: {
      background: '#fff',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #f1f5f9'
    }
  }

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

        {/* Group 1: Tổng quan */}
        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Tổng quan</div>
          <NavItem active={active === 'dashboard'} onClick={() => setActive('dashboard')} icon="🏠" collapsed={!isSidebarHovered}>
            Dashboard
          </NavItem>
        </div>

        {/* Group 2: Cá nhân */}
        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Cá nhân</div>
          <NavItem active={active === 'my-payroll'} onClick={() => setActive('my-payroll')} icon="💵" collapsed={!isSidebarHovered}>
            Phiếu lương cá nhân
          </NavItem>
          <NavItem active={active === 'storage'} onClick={() => setActive('storage')} icon="💾" collapsed={!isSidebarHovered}>
            File của tôi
          </NavItem>
        </div>

        {/* Group 3: Quản lý Tài chính */}
        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Quản lý Tài chính</div>
          <NavItem active={active === 'payroll'} onClick={() => setActive('payroll')} icon="💰" collapsed={!isSidebarHovered}>
            Bảng lương
          </NavItem>
          <NavItem active={active === 'timesheet'} onClick={() => setActive('timesheet')} icon="🕐" collapsed={!isSidebarHovered}>
            Quản lý chấm công
          </NavItem>
        </div>

        {/* Group 4: Giao tiếp */}
        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Giao tiếp</div>
          <NavItem active={active === 'chat'} onClick={() => setActive('chat')} icon="💬" collapsed={!isSidebarHovered}>
            Trò chuyện
          </NavItem>
        </div>

        <div style={{ flex: 1 }} />

        {/* Group 5: Hệ thống */}
        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Hệ thống</div>
          <NavItem active={active === 'profile'} onClick={() => setActive('profile')} icon="⚙️" collapsed={!isSidebarHovered}>
            Cài đặt
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
        {/* Header - Hide for pages with own headers */}
        {!['profile', 'my-payroll', 'storage'].includes(active) && (
          <header style={styles.header}>
            <div>
              <div style={styles.pageHeading}>{meta.title}</div>
              {active !== 'chat' && <div style={styles.subHeading}>Xin chào, {user.name}</div>}
            </div>

            <div style={styles.rightCluster}>
              <NotificationBell />
              <RoleBadge role={user.role} />
            </div>
          </header>
        )}

        {/* Dashboard Main */}
        {active === 'dashboard' && (
          <div style={styles.dashboardContent}>
            {/* Stats Cards Row */}
            <div style={dashboardStyles.statsGrid}>
              <StatCard
                title="Tổng doanh thu"
                value={kpiData.revenue}
                icon="💵"
                accentColor="#10b981"
                trend={{ type: 'up', value: '+12%' }}
              />
              <StatCard
                title="Chi phí tháng này"
                value={kpiData.expenses}
                icon="📊"
                accentColor="#f59e0b"
                trend={{ type: 'up', value: '+5%' }}
              />
              <StatCard
                title="Lợi nhuận"
                value={kpiData.profit}
                icon="📈"
                accentColor="#3b82f6"
                trend={{ type: 'up', value: '+8%' }}
              />
              <StatCard
                title="Đơn chờ duyệt"
                value={pendingApprovals.length}
                icon="⏳"
                accentColor="#8b5cf6"
                subtext="Cần xử lý"
              />
            </div>

            {/* Welcome & Notifications Row */}
            <div style={dashboardStyles.mainGrid}>
              <div style={dashboardStyles.welcomeCard}>
                <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, marginBottom: 12 }}>
                  Chào mừng, {user.name}!
                </h2>
                <p style={{ margin: 0, fontSize: 15, opacity: 0.9, lineHeight: 1.6 }}>
                  Hôm nay bạn có {pendingApprovals.length} đơn cần duyệt.
                  Hãy xem xét và phê duyệt để đảm bảo quy trình kế toán diễn ra suôn sẻ.
                </p>
                <button
                  style={{
                    background: '#fff',
                    color: '#059669',
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                  onClick={() => setActive('payroll')}
                >
                  📋 Xem bảng lương
                </button>
              </div>

              <div style={dashboardStyles.notificationCard}>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
                  Thông báo & Sự kiện
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {notifications.slice(0, 3).map((notif, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      gap: 12,
                      padding: 12,
                      background: '#f8fafc',
                      borderRadius: 10
                    }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        flexShrink: 0
                      }}>📢</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>{notif.title}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{notif.desc}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{notif.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={dashboardStyles.quickActions}>
              <QuickActionButton
                icon="💰"
                label="Bảng lương"
                onClick={() => setActive('payroll')}
                color="#10b981"
              />
              <QuickActionButton
                icon="🕐"
                label="Quản lý chấm công"
                onClick={() => setActive('timesheet')}
                color="#3b82f6"
              />
              <QuickActionButton
                icon="💾"
                label="File của tôi"
                onClick={() => setActive('storage')}
                color="#8b5cf6"
              />
              <QuickActionButton
                icon="💬"
                label="Trò chuyện"
                onClick={() => setActive('chat')}
                color="#f59e0b"
              />
            </div>
          </div>
        )}

        {/* Attendance Management */}
        {active === 'timesheet' && <AttendanceManagementPage />}

        {/* Payroll Management */}
        {active === 'payroll' && <PayrollManagementPage />}

        {/* Chat Page */}
        {active === 'chat' && <ChatPage />}

        {/* My Payroll (Personal) */}
        {active === 'my-payroll' && (
          <SharedPayrollPage
            title="Phiếu lương cá nhân"
            breadcrumb="Cá nhân / Phiếu lương"
          />
        )}

        {/* Profile Page */}
        {active === 'profile' && (
          <SharedProfilePage
            title="Cài đặt"
            breadcrumb="Hệ thống / Cài đặt"
            allowEdit={true}
            userRole="Accounting Manager"
          />
        )}

        {/* Storage */}
        {active === 'storage' && <AccountingStoragePage />}
      </main>
    </div>
  )
}
