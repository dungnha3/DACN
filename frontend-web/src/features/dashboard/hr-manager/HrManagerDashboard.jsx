import { useMemo, useState, useEffect } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePermissions, useErrorHandler } from '@/shared/hooks'
import { dashboardBaseStyles as styles } from '@/shared/styles/dashboard'
import { NavItem, RoleBadge, KPICard } from './components/HrManagerDashboard.components'
import { sectionsConfig } from './components/HrManagerDashboard.constants'
import { 
  EmployeesPage, 
  LeavesPage, 
  DepartmentsPage, 
  ContractsPage, 
  PositionsPage, 
  EvaluationsPage 
} from '@modules/hr'
import { SharedProfilePage } from '@/shared/components/profile'
import { SharedLeaveRequestPage } from '@/shared/components/leave-request'

export default function HrManagerDashboard() {
  const [active, setActive] = useState('dashboard')
  
  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'HR Manager'
  const user = useMemo(() => ({ name: username || 'Nguyễn Thị C', role: 'Quản lý nhân sự' }), [username])

  const sections = useMemo(() => sectionsConfig, [])
  const meta = sections[active]

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div style={styles.appShell}>
      {/* --- SIDEBAR --- */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>⚡</div>
          <div>
            <div style={styles.brandName}>QLNS HR Manager</div>
            <div style={styles.brandSubtitle}>Portal</div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.userCard}>
          <div style={styles.userAvatar}>{user.name.slice(0, 1).toUpperCase()}</div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userRole}>👥 {user.role}</div>
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
          <div style={styles.navGroupLabel}>Quản lý nhân sự</div>
          <NavItem active={active === 'employees'} onClick={() => setActive('employees')} icon="👥">
            Nhân viên
          </NavItem>
          <NavItem active={active === 'departments'} onClick={() => setActive('departments')} icon="🏢">
            Phòng ban
          </NavItem>
          <NavItem active={active === 'positions'} onClick={() => setActive('positions')} icon="💼">
            Chức vụ
          </NavItem>
          <NavItem active={active === 'contracts'} onClick={() => setActive('contracts')} icon="📝">
            Hợp đồng
          </NavItem>
        </div>

        <div style={styles.navGroup}>
          <div style={styles.navGroupLabel}>Nghỉ phép</div>
          <NavItem active={active === 'leaves'} onClick={() => setActive('leaves')} icon="📋">
            Quản lý nghỉ phép
          </NavItem>
          <NavItem active={active === 'my-leave'} onClick={() => setActive('my-leave')} icon="👁️">
            Xem đơn nghỉ phép
          </NavItem>
        </div>

        <div style={styles.navGroup}>
          <div style={styles.navGroupLabel}>Đánh giá & Khác</div>
          <NavItem active={active === 'evaluations'} onClick={() => setActive('evaluations')} icon="⭐">
            Đánh giá
          </NavItem>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Đăng xuất
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main style={styles.content}>
        
        {/* Dynamic Header */}
        {!['employees', 'departments', 'positions', 'contracts', 'leaves', 'evaluations', 'profile', 'my-leave'].includes(active) && (
          <header style={styles.header}>
            <div>
              <div style={styles.pageHeading}>{meta?.title || 'HR Dashboard'}</div>
              <div style={styles.subHeading}>Xin chào, {user.name}</div>
            </div>
            <div style={styles.rightCluster}>
              <RoleBadge role={user.role} />
            </div>
          </header>
        )}

        {/* Dashboard Overview */}
        {active === 'dashboard' && (
          <div style={styles.dashboardContent}>
            <div style={styles.kpiGrid}>
              <KPICard 
                title="Tổng nhân viên" 
                value="25 người" 
                icon="👥" color="success" change="+5 người" 
              />
              <KPICard 
                title="Đơn chờ duyệt" 
                value="3 đơn" 
                icon="⏳" color="warning" change="Cần xử lý" 
              />
              <KPICard 
                title="Đã duyệt hôm nay" 
                value="2 đơn" 
                icon="✓" color="info" change="+2 đơn" 
              />
              <KPICard 
                title="Hợp đồng sắp hết hạn" 
                value="1 HĐ" 
                icon="📝" color="primary" change="Trong 30 ngày tới" 
              />
            </div>

            <div style={styles.cardsRow}>
              <div style={styles.welcomeCard}>
                <div style={styles.welcomeContent}>
                  <h3 style={styles.welcomeTitle}>Chào mừng, {user.name}!</h3>
                  <p style={styles.welcomeText}>
                    Hệ thống ghi nhận bạn có <b>3</b> đơn nghỉ phép đang chờ duyệt và <b>2</b> hồ sơ tuyển dụng mới cần xem xét.
                  </p>
                  <button style={styles.checkInBtn} onClick={() => setActive('leaves')}>
                    ✓ Xem đơn nghỉ phép
                  </button>
                </div>
              </div>

              <div style={styles.notificationCard}>
                <h4 style={styles.cardTitle}>📌 Thông báo & Sự kiện</h4>
                <div style={styles.notificationList}>
                  <div style={styles.notificationItem}>
                    <div style={styles.notifIcon}>📢</div>
                    <div style={styles.notifContent}>
                      <div style={styles.notifTitle}>Họp định kỳ phòng HR</div>
                      <div style={styles.notifDesc}>Thứ 2, 9:00 AM - Phòng họp A</div>
                      <div style={styles.notifDate}>Hôm nay</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shared Components */}
        {active === 'profile' && (
          <SharedProfilePage 
            title="Hồ sơ cá nhân"
            breadcrumb="Cá nhân / Hồ sơ cá nhân"
            allowEdit={true}
          />
        )}
        
        {active === 'my-leave' && (
          <SharedLeaveRequestPage 
            title="Quản lý nghỉ phép"
            breadcrumb="HR / Quản lý nghỉ phép"
            viewMode="management"
          />
        )}

        {/* HR Management Modules */}
        {active === 'employees' && <EmployeesPage />}
        {active === 'departments' && <DepartmentsPage />}
        {active === 'positions' && <PositionsPage />}
        {active === 'contracts' && <ContractsPage />}
        {active === 'leaves' && <LeavesPage />}
        {active === 'evaluations' && <EvaluationsPage />}

      </main>
    </div>
  )
}
