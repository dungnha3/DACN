import { useMemo, useState } from 'react'
import { styles } from './EmployeeDashboard.styles'
import { NavItem, RoleBadge, KPICard, StatusBadge, LeaveStatusBar } from './EmployeeDashboard.components'
import { kpiData, attendanceHistory, leaveRequests, notifications, sectionsConfig } from './EmployeeDashboard.constants'

export default function EmployeeDashboard() {
  const [active, setActive] = useState('dashboard')
  const username = typeof localStorage !== 'undefined' ? localStorage.getItem('username') : 'Employee'
  const user = useMemo(() => ({ name: username || 'Nguyễn Văn A', role: 'Nhân viên' }), [username])

  const sections = useMemo(() => sectionsConfig, [])
  const meta = sections[active]

  const handleLogout = async () => {
    try {
      const refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('refreshToken') : null
      if (refreshToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        })
      }
    } catch {}
    finally {
      const ls = typeof localStorage !== 'undefined' ? localStorage : null
      if (ls) {
        ;['accessToken','refreshToken','tokenType','userRole','username','expiresAt','staySignedIn'].forEach(k=> ls.removeItem(k))
      }
      if (typeof window !== 'undefined') window.location.reload()
    }
  }

  return (
    <div style={styles.appShell}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>⚡</div>
          <div>
            <div style={styles.brandName}>QLNS Employee</div>
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
          <NavItem active={active === 'payroll'} onClick={() => setActive('payroll')} icon="💰">
            {sections.payroll.title}
          </NavItem>
          <NavItem active={active === 'documents'} onClick={() => setActive('documents')} icon="📄">
            {sections.documents.title}
          </NavItem>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Đăng xuất
        </button>
      </aside>

      <main style={styles.content}>
        <header style={styles.header}>
          <div>
            <div style={styles.pageHeading}>{meta.title}</div>
            <div style={styles.subHeading}>Xin chào, {user.name}</div>
          </div>

          <div style={styles.rightCluster}>
            <RoleBadge role={user.role} />
          </div>
        </header>

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
        {active === 'timesheet' && (
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
        {active === 'leave' && (
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

        {/* Other Pages Placeholder */}
        {(active === 'profile' || active === 'payroll' || active === 'documents') && (
          <div style={styles.pageContent}>
            <div style={styles.placeholderCard}>
              <div style={styles.placeholderIcon}>
                {active === 'profile' ? '👤' : active === 'payroll' ? '💰' : '📄'}
              </div>
              <h3 style={styles.placeholderTitle}>{meta.pageTitle}</h3>
              <p style={styles.placeholderText}>
                Chức năng đang được phát triển. Bạn sẽ có thể {meta.subtitle.toLowerCase()} tại đây.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

