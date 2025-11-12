import { useMemo, useState } from 'react'
import { styles } from './AdminDashboard.styles'
import { NavItem, RoleBadge, KPICard, StatusBadge, EmployeeStatusBar, DepartmentCard, QuickActionBtn } from './AdminDashboard.components'
import { adminKpiData, employeeData, departmentData, leaveRequestsAdmin, attendanceOverview, adminNotifications, payrollOverview, recentActivities, adminSectionsConfig } from './AdminDashboard.constants'

export default function AdminDashboard() {
  const [active, setActive] = useState('dashboard')
  const username = typeof localStorage !== 'undefined' ? localStorage.getItem('username') : 'Admin'
  const user = useMemo(() => ({ name: username || 'Quản trị viên', role: 'Quản trị viên' }), [username])

  const sections = useMemo(() => adminSectionsConfig, [])
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
            <div style={styles.brandName}>QLNS Admin</div>
            <div style={styles.brandSubtitle}>Portal</div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.userCard}>
          <div style={styles.userAvatar}>{user.name.slice(0, 1).toUpperCase()}</div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userRole}>👑 {user.role}</div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.navGroup}>
          <div style={styles.navGroupLabel}>Quản lý & Tổ chức</div>
          <NavItem active={active === 'dashboard'} onClick={() => setActive('dashboard')} icon="🏠">
            {sections.dashboard.title}
          </NavItem>
          <NavItem active={active === 'employees'} onClick={() => setActive('employees')} icon="👥">
            {sections.employees.title}
          </NavItem>
          <NavItem active={active === 'departments'} onClick={() => setActive('departments')} icon="🏢">
            {sections.departments.title}
          </NavItem>
        </div>

        <div style={styles.navGroup}>
          <div style={styles.navGroupLabel}>Chấm công & Công việc</div>
          <NavItem active={active === 'attendance'} onClick={() => setActive('attendance')} icon="🕐">
            {sections.attendance.title}
          </NavItem>
          <NavItem active={active === 'leave'} onClick={() => setActive('leave')} icon="📋">
            {sections.leave.title}
          </NavItem>
          <NavItem active={active === 'payroll'} onClick={() => setActive('payroll')} icon="💰">
            {sections.payroll.title}
          </NavItem>
        </div>

        <div style={styles.navGroup}>
          <div style={styles.navGroupLabel}>Hệ thống</div>
          <NavItem active={active === 'reports'} onClick={() => setActive('reports')} icon="📊">
            {sections.reports.title}
          </NavItem>
          <NavItem active={active === 'settings'} onClick={() => setActive('settings')} icon="⚙️">
            {sections.settings.title}
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
            {active !== 'employees' && <div style={styles.subHeading}>Xin chào, {user.name}</div>}
          </div>

          <div style={styles.rightCluster}>
            <RoleBadge role={user.role} />
            <QuickActionBtn onClick={() => setActive('employees')} icon="➕">
              Thêm mới
            </QuickActionBtn>
          </div>
        </header>

        {/* Dashboard Main */}
        {active === 'dashboard' && (
          <div style={styles.dashboardContent}>
            {/* KPI Cards Row */}
            <div style={styles.kpiGrid}>
              <KPICard title="Tổng nhân viên" value={`${adminKpiData.totalEmployees}`} icon="👥" color="primary" change="+12 người" />
              <KPICard title="Đang hoạt động" value={`${adminKpiData.activeEmployees}`} icon="✅" color="success" change="+5 người" />
              <KPICard title="Đơn chờ duyệt" value={`${adminKpiData.pendingRequests}`} icon="📋" color="warning" change="-2 đơn" />
              <KPICard title="Phòng ban" value={`${adminKpiData.totalDepartments}`} icon="🏢" color="info" change="+1 phòng" />
            </div>

            {/* Welcome & Notifications Row */}
            <div style={styles.cardsRow}>
              <div style={styles.welcomeCard}>
                <div style={styles.welcomeContent}>
                  <h3 style={styles.welcomeTitle}>Chào mừng, {user.name}!</h3>
                  <p style={styles.welcomeText}>
                    Hệ thống quản lý nhân sự đang hoạt động tốt. Hôm nay có {adminKpiData.pendingRequests} đơn cần được xem xét và phê duyệt.
                  </p>
                  <QuickActionBtn onClick={() => setActive('leave')} icon="📋">
                    Xem đơn chờ duyệt
                  </QuickActionBtn>
                </div>
              </div>

              <div style={styles.notificationCard}>
                <h4 style={styles.cardTitle}>Thông báo & Hoạt động</h4>
                <div style={styles.notificationList}>
                  {adminNotifications.map((notif, idx) => (
                    <div key={idx} style={styles.notificationItem}>
                      <div style={styles.notifIcon}>
                        {notif.type === 'request' ? '📋' : notif.type === 'report' ? '📊' : '👤'}
                      </div>
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
                <h4 style={styles.cardTitle}>Thống kê chấm công hôm nay</h4>
                <div style={styles.chartPlaceholder}>
                  <div style={styles.chartInfo}>
                    📊 Có mặt: {attendanceOverview[0].present} | Vắng: {attendanceOverview[0].absent} | Muộn: {attendanceOverview[0].late}
                  </div>
                </div>
              </div>

              <div style={styles.chartCard}>
                <h4 style={styles.cardTitle}>Hoạt động gần đây</h4>
                <div style={styles.overviewList}>
                  {recentActivities.slice(0, 4).map((activity) => (
                    <div key={activity.id} style={styles.overviewItem}>
                      <div style={styles.overviewIcon('active')}>
                        {activity.icon}
                      </div>
                      <div style={styles.overviewContent}>
                        <div style={styles.overviewTitle}>{activity.action}</div>
                        <div style={styles.overviewStatus}>{activity.employee} - {activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employee Management Page */}
        {active === 'employees' && (
          <div style={styles.pageContent}>
            <div style={styles.tableCard}>
              <div style={styles.tableHeader}>
                <h4 style={styles.tableTitle}>Danh sách nhân viên</h4>
                <button style={styles.addBtn}>+ Thêm nhân viên</button>
              </div>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Họ tên</th>
                      <th style={styles.th}>Phòng ban</th>
                      <th style={styles.th}>Chức vụ</th>
                      <th style={styles.th}>Ngày vào</th>
                      <th style={styles.th}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeData.map((employee) => (
                      <tr key={employee.id} style={styles.tr}>
                        <td style={styles.td}>{employee.name}</td>
                        <td style={styles.td}>{employee.department}</td>
                        <td style={styles.td}>{employee.position}</td>
                        <td style={styles.td}>{employee.joinDate}</td>
                        <td style={styles.td}>
                          <StatusBadge status={employee.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Department Management Page */}
        {active === 'departments' && (
          <div style={styles.pageContent}>
            <div style={styles.adminLayout}>
              <div style={styles.tableCard}>
                <div style={styles.tableHeader}>
                  <h4 style={styles.tableTitle}>Danh sách phòng ban</h4>
                  <button style={styles.addBtn}>+ Tạo phòng ban</button>
                </div>
                <div style={styles.overviewList}>
                  {departmentData.map((dept) => (
                    <DepartmentCard 
                      key={dept.id}
                      name={dept.name}
                      employeeCount={dept.employeeCount}
                      icon={dept.icon}
                      status={dept.status}
                    />
                  ))}
                </div>
              </div>

              <div style={styles.overviewCard}>
                <h4 style={styles.cardTitle}>Tổng quan phòng ban</h4>
                <div style={styles.overviewList}>
                  <div style={styles.overviewItem}>
                    <div style={styles.overviewIcon('active')}>
                      📊
                    </div>
                    <div style={styles.overviewContent}>
                      <div style={styles.overviewTitle}>Tổng số phòng ban</div>
                      <div style={styles.overviewStatus}>{departmentData.length} phòng ban</div>
                    </div>
                  </div>
                  <div style={styles.overviewItem}>
                    <div style={styles.overviewIcon('active')}>
                      👥
                    </div>
                    <div style={styles.overviewContent}>
                      <div style={styles.overviewTitle}>Tổng nhân viên</div>
                      <div style={styles.overviewStatus}>{departmentData.reduce((sum, dept) => sum + dept.employeeCount, 0)} người</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leave Approval Page */}
        {active === 'leave' && (
          <div style={styles.pageContent}>
            <div style={styles.tableCard}>
              <div style={styles.tableHeader}>
                <h4 style={styles.tableTitle}>Đơn xin nghỉ chờ duyệt</h4>
              </div>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Nhân viên</th>
                      <th style={styles.th}>Loại đơn</th>
                      <th style={styles.th}>Từ ngày</th>
                      <th style={styles.th}>Đến ngày</th>
                      <th style={styles.th}>Lý do</th>
                      <th style={styles.th}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequestsAdmin.map((request) => (
                      <tr key={request.id} style={styles.tr}>
                        <td style={styles.td}>{request.employeeName}</td>
                        <td style={styles.td}>{request.type}</td>
                        <td style={styles.td}>{request.startDate}</td>
                        <td style={styles.td}>{request.endDate}</td>
                        <td style={styles.td}>{request.reason}</td>
                        <td style={styles.td}>
                          <StatusBadge status={request.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Other Pages Placeholder */}
        {(active === 'attendance' || active === 'payroll' || active === 'reports' || active === 'settings') && (
          <div style={styles.pageContent}>
            <div style={styles.placeholderCard}>
              <div style={styles.placeholderIcon}>
                {active === 'attendance' ? '🕐' : active === 'payroll' ? '💰' : active === 'reports' ? '📊' : '⚙️'}
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