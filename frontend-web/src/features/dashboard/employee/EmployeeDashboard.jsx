import { useMemo, useState, useEffect, useRef } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { dashboardBaseStyles as styles } from '@/shared/styles/dashboard'
import {
  NavItem,
  RoleBadge,
  StatCard,
  TodayStatusCard,
  AttendanceChart,
  LeaveStatusWidget,

  QuickActionButton
} from './components/EmployeeDashboard.components'
import { sectionsConfig } from './components/EmployeeDashboard.constants'
import { ProfilePage, MyPayrollPage, MyAttendancePage, MyLeavePage, MyDocumentsPage, MyProjectsPage, MyStoragePage } from '@/modules/employee'
import NotificationBell from '@/shared/components/notification/NotificationBell'
import { ChatPage } from '@/modules/project'

// Services
import { profileService } from '@/shared/services/profile.service'
import { employeesService } from '@/features/hr/shared/services/employees.service'
import { attendanceService } from '@/shared/services/attendance.service'
import { leaveService } from '@/shared/services/leave.service'
import { payrollService } from '@/shared/services/payroll.service'

export default function EmployeeDashboard() {
  const [active, setActive] = useState('dashboard')
  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'Employee'
  const user = useMemo(() => ({ name: username || 'Nguyễn Văn A', role: 'Nhân viên' }), [username])

  // Dashboard data states
  const [loading, setLoading] = useState(true)
  const [employeeId, setEmployeeId] = useState(null)
  const [attendanceStatus, setAttendanceStatus] = useState(null)
  const [attendanceData, setAttendanceData] = useState([])
  const [leaveStats, setLeaveStats] = useState({ pending: 0, approved: 0, rejected: 0, remaining: 12 })
  const [payrollData, setPayrollData] = useState(null)
  const [stats, setStats] = useState({
    totalHours: 0,
    lateDays: 0,
    workingDays: 0
  })
  const [checkInLoading, setCheckInLoading] = useState(false)
  const [userAvatar, setUserAvatar] = useState(null)

  const sections = useMemo(() => sectionsConfig, [])
  const meta = sections[active] || { title: 'Dashboard', subtitle: 'Employee Portal' }

  // State for sidebar hover
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

  // Fetch employee data on mount
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // Get user profile first
        const profile = await profileService.getProfile()
        if (profile?.userId) {
          // Set avatar from profile
          setUserAvatar(profile.avatarUrl)
          // Get employee by user ID
          const employee = await employeesService.getByUserId(profile.userId)
          if (employee?.nhanvienId) {
            setEmployeeId(employee.nhanvienId)
          }
        }
      } catch (error) {
        console.error('Error fetching employee data:', error)
      }
    }
    fetchEmployeeData()
  }, [])

  // Fetch dashboard data when employeeId is available
  useEffect(() => {
    if (!employeeId || active !== 'dashboard') return

    const fetchDashboardData = async () => {
      setLoading(true)
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1

      try {
        // Fetch all data in parallel
        const [
          statusRes,
          attendanceRes,
          leaveRes,
          payrollRes
        ] = await Promise.allSettled([
          attendanceService.getStatus(employeeId),
          attendanceService.getByMonth(employeeId, year, month),
          leaveService.getByEmployee(employeeId),
          // Use getByEmployeePeriod to get payroll for specific month/year
          payrollService.getByEmployeePeriod(employeeId, month, year)
        ])

        // Process attendance status
        if (statusRes.status === 'fulfilled' && statusRes.value) {
          setAttendanceStatus(statusRes.value)
        }

        // Process attendance data for chart
        if (attendanceRes.status === 'fulfilled' && Array.isArray(attendanceRes.value)) {
          const chartData = attendanceRes.value
            .slice(-7)
            .map(item => ({
              date: item.ngayCham,
              hours: item.soGioLam || 0,
              status: item.trangThai
            }))
          setAttendanceData(chartData)

          // Calculate stats
          const totalHours = attendanceRes.value.reduce((sum, item) => sum + (item.soGioLam || 0), 0)
          const lateDays = attendanceRes.value.filter(item => item.trangThai === 'DI_MUON').length
          const workingDays = attendanceRes.value.length
          setStats({ totalHours, lateDays, workingDays })
        }

        // Process leave data
        if (leaveRes.status === 'fulfilled' && Array.isArray(leaveRes.value)) {
          const thisYearLeaves = leaveRes.value.filter(l => {
            const leaveDate = new Date(l.ngayBatDau)
            return leaveDate.getFullYear() === year
          })
          const pending = thisYearLeaves.filter(l => l.trangThai === 'CHO_DUYET').length
          const approved = thisYearLeaves.filter(l => l.trangThai === 'DA_DUYET').length
          const rejected = thisYearLeaves.filter(l => l.trangThai === 'TU_CHOI').length
          const usedDays = thisYearLeaves
            .filter(l => l.trangThai === 'DA_DUYET')
            .reduce((sum, l) => sum + (l.soNgay || 0), 0)
          setLeaveStats({
            pending,
            approved,
            rejected,
            remaining: Math.max(12 - usedDays, 0)
          })
        }

        // Process payroll data - handle gracefully (may return 204/403/404 when no data)
        if (payrollRes.status === 'fulfilled' && payrollRes.value) {
          // Response is single object for the specified period
          setPayrollData(payrollRes.value)
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [employeeId, active])

  // Handle check-in
  const handleCheckIn = async () => {
    if (!employeeId) return
    setCheckInLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      await attendanceService.checkIn(employeeId, today)
      // Refresh status
      const status = await attendanceService.getStatus(employeeId)
      setAttendanceStatus(status)
    } catch (error) {
      console.error('Check-in error:', error)
      alert('Có lỗi khi chấm công: ' + (error.response?.data?.message || error.message))
    } finally {
      setCheckInLoading(false)
    }
  }

  // Handle check-out
  const handleCheckOut = async () => {
    if (!attendanceStatus?.chamcongId) return
    setCheckInLoading(true)
    try {
      await attendanceService.checkOut(attendanceStatus.chamcongId)
      // Refresh status
      const status = await attendanceService.getStatus(employeeId)
      setAttendanceStatus(status)
    } catch (error) {
      console.error('Check-out error:', error)
      alert('Có lỗi khi chấm công ra: ' + (error.response?.data?.message || error.message))
    } finally {
      setCheckInLoading(false)
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
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

  // Local styles for dashboard
  const dashboardStyles = {
    container: {
      padding: 32,
      maxWidth: 1400,
      margin: '0 auto'
    },
    header: {
      marginBottom: 32
    },
    greeting: {
      fontSize: 28,
      fontWeight: 700,
      color: '#0f172a',
      margin: 0,
      marginBottom: 4
    },
    subGreeting: {
      fontSize: 15,
      color: '#64748b',
      margin: 0
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 380px',
      gap: 24,
      marginBottom: 24
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16,
      marginBottom: 24
    },
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    },
    quickActions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 16,
      marginTop: 0
    }
  }

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
              <RoleBadge role={user.role} avatarUrl={userAvatar} />
            </div>
          </header>
        )}

        {/* Dashboard Main - NEW DESIGN */}
        {active === 'dashboard' && (
          <div style={dashboardStyles.container}>
            <div style={dashboardStyles.mainGrid}>
              {/* Left Column */}
              <div>
                {/* Stats Grid */}
                <div style={dashboardStyles.statsGrid}>
                  <StatCard
                    title="Ngày phép còn lại"
                    value={`${leaveStats.remaining} ngày`}
                    subtext={`Đã sử dụng ${12 - leaveStats.remaining} ngày`}
                    icon="📅"
                    accentColor="#3b82f6"
                    loading={loading}
                    onClick={() => setActive('leave')}
                  />
                  <StatCard
                    title="Số lần đi muộn"
                    value={`${stats.lateDays} lần`}
                    subtext="Trong tháng này"
                    icon="⏰"
                    accentColor={stats.lateDays > 3 ? '#ef4444' : '#f59e0b'}
                    loading={loading}
                    onClick={() => setActive('timesheet')}
                  />
                  <StatCard
                    title="Tổng giờ làm"
                    value={`${stats.totalHours.toFixed(1)}h`}
                    subtext={`${stats.workingDays} ngày công`}
                    icon="🕐"
                    accentColor="#8b5cf6"
                    loading={loading}
                    onClick={() => setActive('timesheet')}
                  />
                </div>

                {/* Charts Row */}
                <div style={dashboardStyles.chartsGrid}>
                  <AttendanceChart data={attendanceData} loading={loading} />
                  <LeaveStatusWidget data={leaveStats} loading={loading} />
                </div>

              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <TodayStatusCard
                  status={attendanceStatus}
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                  loading={checkInLoading}
                />

                {/* Quick Actions - Moved to Right Column */}
                <div style={dashboardStyles.quickActions}>
                  <QuickActionButton
                    icon="🕐"
                    label="Xem chấm công"
                    onClick={() => setActive('timesheet')}
                    color="#3b82f6"
                  />
                  <QuickActionButton
                    icon="📋"
                    label="Xin nghỉ phép"
                    onClick={() => setActive('leave')}
                    color="#10b981"
                  />
                  <QuickActionButton
                    icon="💰"
                    label="Xem phiếu lương"
                    onClick={() => setActive('payroll')}
                    color="#f59e0b"
                  />
                  <QuickActionButton
                    icon="📄"
                    label="Tài liệu"
                    onClick={() => setActive('documents')}
                    color="#8b5cf6"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timesheet Page */}
        {active === 'timesheet' && <MyAttendancePage />}

        {/* Leave Page */}
        {active === 'leave' && <MyLeavePage />}

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
