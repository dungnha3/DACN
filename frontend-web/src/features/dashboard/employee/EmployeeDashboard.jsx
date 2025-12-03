import { useMemo, useState, useEffect, useRef } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePermissions, useErrorHandler } from '@/shared/hooks'
import { dashboardBaseStyles as styles } from '@/shared/styles/dashboard'
import { NavItem, RoleBadge, KPICard, StatusBadge, LeaveStatusBar } from './components/EmployeeDashboard.components'
import { kpiData, attendanceHistory, leaveRequests, notifications, sectionsConfig } from './components/EmployeeDashboard.constants'
import { ProfilePage, MyPayrollPage, MyAttendancePage, MyLeavePage, MyDocumentsPage, MyProjectsPage, MyStoragePage } from '@/modules/employee'
import NotificationBell from '@/shared/components/notification/NotificationBell'
import { ChatPage } from '@/modules/project'

export default function EmployeeDashboard() {
  const [active, setActive] = useState('dashboard')
  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'Employee'
  const user = useMemo(() => ({ name: username || 'Nguyễn Văn A', role: 'Nhân viên' }), [username])

  const sections = useMemo(() => sectionsConfig, [])
  const meta = sections[active] || { title: 'Dashboard', subtitle: 'Employee Portal' }

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

  const handleLogout = async () => {
    await logout()
  }


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
            {sections.dashboard.title}
          </NavItem>
        </div>

        {/* Group 2: Công việc */}
        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Công việc</div>
          <NavItem active={active === 'timesheet'} onClick={() => setActive('timesheet')} icon="🕐" collapsed={!isSidebarHovered}>
            {sections.timesheet.title}
          </NavItem>
          <NavItem active={active === 'leave'} onClick={() => setActive('leave')} icon="📋" collapsed={!isSidebarHovered}>
            {sections.leave.title}
          </NavItem>
          <NavItem active={active === 'projects'} onClick={() => setActive('projects')} icon="🏭" collapsed={!isSidebarHovered}>
            Dự án của tôi
          </NavItem>
        </div>

        {/* Group 3: Tài chính & Tài liệu */}
        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Tài chính & Tài liệu</div>
          <NavItem active={active === 'payroll'} onClick={() => setActive('payroll')} icon="💰" collapsed={!isSidebarHovered}>
            {sections.payroll.title}
          </NavItem>
          <NavItem active={active === 'documents'} onClick={() => setActive('documents')} icon="📄" collapsed={!isSidebarHovered}>
            {sections.documents.title}
          </NavItem>
          <NavItem active={active === 'storage'} onClick={() => setActive('storage')} icon="💾" collapsed={!isSidebarHovered}>
            File của tôi
          </NavItem>
        </div>

        {/* Group 4: Giao tiếp */}
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

      <main style={customStyles.content}>
        {/* Hide header for pages with their own headers */}
        {!['profile', 'projects'].includes(active) && (
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
            {/* KPI Cards Row */}
            <div style={styles.kpiGrid}>
              <KPICard title="Lương dự kiến" value={`${kpiData.salary}đ`} icon="💵" color="success" change="+5%" />
              <KPICard title="Ngày phép còn" value={`${kpiData.leaveDays} ngày`} icon="📅" color="info" change="+3 ngày" />
              <KPICard title="Số lần đi muộn" value={`${kpiData.lateDays} lần`} icon="⏰" color="warning" change="-2 lần" />
              <KPICard title="Tổng giờ làm (Tháng)" value={`${kpiData.totalHours}h`} icon="🕐" color="primary" change="+8h" />
            </div>

            {/* Welcome & Notifications Row */}
            <div style={styles.cardsRow}>
              <div style={styles.welcomeCard}>
                <div style={styles.welcomeContent}>
                  <h3 style={styles.welcomeTitle}>Chào mừng, {user.name}!</h3>
                  <p style={styles.welcomeText}>
                    Hãy bắt đầu ngày làm việc của bạn bằng cách chấm công. Chúc bạn một ngày làm việc hiệu quả!
                  </p>
                  <button style={styles.checkInBtn}>
                    ✓ Chấm công vào
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
                <h4 style={styles.cardTitle}>Biểu đồ giờ làm theo ngày</h4>
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
        )}

        {/* Timesheet Page */}
        {active === 'timesheet' && <MyAttendancePage />}
        {false && (
          <div style={styles.pageContent}>
            <div style={styles.tableCard}>
              <div style={styles.tableHeader}>
                <h4 style={styles.tableTitle}>Lịch sử chấm công</h4>
              </div>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Ngày</th>
                      <th style={styles.th}>Giờ vào</th>
                      <th style={styles.th}>Giờ ra</th>
                      <th style={styles.th}>Tổng giờ</th>
                      <th style={styles.th}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceHistory.map((record, idx) => (
                      <tr key={idx} style={styles.tr}>
                        <td style={styles.td}>{record.date}</td>
                        <td style={styles.td}>{record.timeIn}</td>
                        <td style={styles.td}>{record.timeOut}</td>
                        <td style={styles.td}>
                          <div style={styles.hoursCell}>
                            <div style={styles.hoursBar(record.hours)} />
                            <span style={styles.hoursText}>{record.hours}h</span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <StatusBadge status={record.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Leave Page */}
        {active === 'leave' && <MyLeavePage />}
        {false && (
          <div style={styles.pageContent}>
            <div style={styles.leaveLayout}>
              <div style={styles.tableCard}>
                <div style={styles.tableHeader}>
                  <h4 style={styles.tableTitle}>Lịch sử đơn từ</h4>
                  <button style={styles.addBtn}>+ Đăng ký nghỉ phép</button>
                </div>
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Loại đơn</th>
                        <th style={styles.th}>Ngày gửi</th>
                        <th style={styles.th}>Người duyệt</th>
                        <th style={styles.th}>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map((req) => (
                        <tr key={req.id} style={styles.tr}>
                          <td style={styles.td}>{req.type}</td>
                          <td style={styles.td}>{req.date}</td>
                          <td style={styles.td}>{req.approver}</td>
                          <td style={styles.td}>
                            <LeaveStatusBar status={req.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={styles.orderOverview}>
                <h4 style={styles.cardTitle}>Thông báo của tôi</h4>
                <div style={styles.orderList}>
                  {leaveRequests.map((req) => (
                    <div key={req.id} style={styles.orderItem}>
                      <div style={styles.orderIcon(req.status)}>
                        {req.status === 'approved' ? '✓' : req.status === 'pending' ? '⏳' : '✗'}
                      </div>
                      <div style={styles.orderContent}>
                        <div style={styles.orderTitle}>{req.type} {req.date}</div>
                        <div style={styles.orderStatus}>
                          {req.status === 'approved' ? 'Đã duyệt' : req.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Page */}
        {active === 'chat' && <ChatPage />}

        {/* Profile Page */}
        {active === 'profile' && <ProfilePage />}

        {/* Payroll Page */}
        {active === 'payroll' && <MyPayrollPage />}

        {/* Documents Page */}
        {active === 'documents' && <MyDocumentsPage />}

        {/* Storage Page */}
        {active === 'storage' && <MyStoragePage />}

        {/* Projects Page */}
        {active === 'projects' && <MyProjectsPage />}
      </main>
    </div>
  )
}

