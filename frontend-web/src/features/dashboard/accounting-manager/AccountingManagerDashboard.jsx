import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePermissions, useErrorHandler } from '@/shared/hooks'
import { dashboardBaseStyles as styles } from '@/shared/styles/dashboard'
import { NavItem, RoleBadge, KPICard, ApprovalStatusBadge } from './components/AccountingManagerDashboard.components'
import { kpiData, notifications, sectionsConfig, chatContacts, chatMessages } from './components/AccountingManagerDashboard.constants'
import { leavesService } from '@/features/hr/shared/services/leaves.service'
import { PayrollManagementPage, AttendanceManagementPage, AccountingStoragePage } from '@/modules/accounting'
import { SharedProfilePage } from '@/shared/components/profile'
import { SharedPayrollPage } from '@/shared/components/payroll'
import { ChatPage } from '@/modules/project'
import NotificationBell from '@/shared/components/notification/NotificationBell'

export default function AccountingManagerDashboard() {
  const [active, setActive] = useState('dashboard')
  const [approvals, setApprovals] = useState([])
  const [selectedContact, setSelectedContact] = useState(chatContacts[0])
  const [messageInput, setMessageInput] = useState('')
  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'Accounting Manager'
  const user = useMemo(() => ({ name: username || 'Nguyễn Thị F', role: 'Quản lý kế toán' }), [username])

  const sections = useMemo(() => sectionsConfig, [])
  const meta = sections[active] || { title: 'Dashboard', subtitle: 'Quản lý tài chính' }
  const pendingApprovals = useMemo(() => approvals.filter(a => a.status === 'pending'), [approvals])

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

  // ❌ Removed: loadAttendance, loadPayroll - Không cần nữa

  useEffect(() => {
    loadApprovals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ❌ Removed: handleCheckInOut, handleAutoCalculateSalary, handleExportPayrollReport, formatCurrency

  return (
    <div style={styles.appShell}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>💰</div>
          <div>
            <div style={styles.brandName}>QLNS Accounting Manager</div>
            <div style={styles.brandSubtitle}>Portal</div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.userCard}>
          <div style={styles.userAvatar}>{user.name.slice(0, 1).toUpperCase()}</div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userRole}>💼 {user.role}</div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.navGroup}>
          <div style={styles.navGroupLabel}>Tổng quan</div>
          <NavItem active={active === 'dashboard'} onClick={() => setActive('dashboard')} icon="🏠">
            Dashboard
          </NavItem>
          <NavItem active={active === 'profile'} onClick={() => setActive('profile')} icon="👤">
            Hồ sơ cá nhân
          </NavItem>
        </div>

        <div style={styles.navGroup}>
          <div style={styles.navGroupLabel}>Cá nhân</div>
          <NavItem active={active === 'my-payroll'} onClick={() => setActive('my-payroll')} icon="💰">
            Phiếu lương cá nhân
          </NavItem>
          <NavItem active={active === 'storage'} onClick={() => setActive('storage')} icon="💾">
            File của tôi
          </NavItem>
        </div>

        <div style={styles.navGroup}>
          <div style={styles.navGroupLabel}>Quản lý tài chính</div>
          <NavItem active={active === 'payroll'} onClick={() => setActive('payroll')} icon="💰">
            Bảng lương
          </NavItem>
          <NavItem active={active === 'timesheet'} onClick={() => setActive('timesheet')} icon="🕐">
            Quản lý chấm công
          </NavItem>
        </div>

        <div style={styles.navGroup}>
          <div style={styles.navGroupLabel}>Giao tiếp</div>
          <NavItem active={active === 'chat'} onClick={() => setActive('chat')} icon="💬">
            Chat
          </NavItem>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Đăng xuất
        </button>
      </aside>

      <main style={styles.content}>
        {/* Hide header for shared component pages */}
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
            {/* KPI Cards Row */}
            <div style={styles.kpiGrid}>
              <KPICard title="Tổng doanh thu" value={`${kpiData.revenue}đ`} icon="💵" color="success" change="+12%" />
              <KPICard title="Chi phí tháng này" value={`${kpiData.expenses}đ`} icon="📊" color="warning" change="+5%" />
              <KPICard title="Lợi nhuận" value={`${kpiData.profit}đ`} icon="📈" color="info" change="+8%" />
              <KPICard title="Đơn chờ duyệt" value={`${kpiData.pendingApprovals}`} icon="⏳" color="primary" change="-2" />
            </div>

            {/* Welcome & Notifications Row */}
            <div style={styles.cardsRow}>
              <div style={styles.welcomeCard}>
                <div style={styles.welcomeContent}>
                  <h3 style={styles.welcomeTitle}>Chào mừng, {user.name}!</h3>
                  <p style={styles.welcomeText}>
                    Hôm nay bạn có {pendingApprovals.length} đơn cần duyệt. 
                    Hãy xem xét và phê duyệt để đảm bảo quy trình kế toán diễn ra suôn sẻ.
                  </p>
                  <button style={styles.checkInBtn} onClick={() => setActive('approvals')}>
                    📋 Xem đơn chờ duyệt
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
                <h4 style={styles.cardTitle}>Biểu đồ doanh thu theo tháng</h4>
                <div style={styles.chartPlaceholder}>
                  <div style={styles.chartInfo}>📊 Biểu đồ đang được phát triển</div>
                </div>
              </div>

              <div style={styles.chartCard}>
                <h4 style={styles.cardTitle}>Thống kê chi phí</h4>
                <div style={styles.chartPlaceholder}>
                  <div style={styles.chartInfo}>📈 Biểu đồ đang được phát triển</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Management - Quản lý tất cả nhân viên */}
        {active === 'timesheet' && <AttendanceManagementPage />}

        {/* ❌ Removed: Leave Page (cá nhân) - Accounting không cần */}
        {/* Chat Page */}
        {active === 'chat' && <ChatPage />}

        

        {/* Profile Page */}
        {active === 'profile' && (
          <SharedProfilePage 
            title="Hồ sơ cá nhân"
            breadcrumb="Cá nhân / Hồ sơ cá nhân"
            allowEdit={true}
            userRole="Accounting Manager"
          />
        )}

        {/* Documents Placeholder */}
        {active === 'documents' && (
          <div style={styles.pageContent}>
            <div style={styles.placeholderCard}>
              <div style={styles.placeholderIcon}>📄</div>
              <h3 style={styles.placeholderTitle}>{meta.pageTitle}</h3>
              <p style={styles.placeholderText}>
                Tính năng đang được phát triển
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

