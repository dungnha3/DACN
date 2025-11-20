import { useMemo, useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { styles } from './AdminDashboard.styles'
import { NavItem, RoleBadge, QuickActionBtn } from './components/AdminDashboard.components'
import { UsersManagementPage, RoleRequestsPage, AuditLogsPage } from '@/modules/admin'

export default function AdminDashboard() {
  const [active, setActive] = useState('dashboard')
  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'Admin'
  const user = useMemo(() => ({ name: username || 'Quản trị viên', role: 'Quản trị viên' }), [username])

  const handleLogout = async () => {
    await logout()
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

        {/* ADMIN MENU - Chỉ những gì được phép */}
        <div style={styles.navGroup}>
          <div style={styles.navGroupLabel}>TỔNG QUAN</div>
          <NavItem active={active === 'dashboard'} onClick={() => setActive('dashboard')} icon="🏠">
            Dashboard
          </NavItem>
        </div>

        <div style={styles.navGroup}>
          <div style={styles.navGroupLabel}>QUẢN TRỊ HỆ THỐNG</div>
          <NavItem active={active === 'users'} onClick={() => setActive('users')} icon="👤">
            Quản lý Users
          </NavItem>
          <NavItem active={active === 'role-requests'} onClick={() => setActive('role-requests')} icon="🔄">
            Yêu cầu Role
          </NavItem>
          <NavItem active={active === 'audit-logs'} onClick={() => setActive('audit-logs')} icon="📋">
            Audit Logs
          </NavItem>
          <NavItem active={active === 'settings'} onClick={() => setActive('settings')} icon="⚙️">
            Cài đặt hệ thống
          </NavItem>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Đăng xuất
        </button>
      </aside>

      <main style={styles.content}>
        <header style={styles.header}>
          <div>
            <div style={styles.pageHeading}>
              {active === 'dashboard' && 'Dashboard'}
              {active === 'users' && 'Quản lý Users'}
              {active === 'role-requests' && 'Yêu cầu thay đổi Role'}
              {active === 'audit-logs' && 'Audit Logs'}
              {active === 'settings' && 'Cài đặt hệ thống'}
            </div>
            <div style={styles.subHeading}>Xin chào, {user.name}</div>
          </div>

          <div style={styles.rightCluster}>
            <RoleBadge role={user.role} />
          </div>
        </header>

        {/* Dashboard Overview */}
        {active === 'dashboard' && (
          <div style={styles.pageContent}>
            <div style={styles.welcomeCard}>
              <div style={styles.welcomeContent}>
                <h3 style={styles.welcomeTitle}>Chào mừng Admin, {user.name}!</h3>
                <p style={styles.welcomeText}>
                  Với vai trò Admin, bạn có quyền quản lý users, phê duyệt yêu cầu thay đổi role, và theo dõi audit logs hệ thống.
                </p>
                <p style={{marginTop: '16px', fontSize: '14px', color: '#6b7280'}}>
                  ⚠️ <strong>Lưu ý:</strong> Admin không có quyền truy cập dữ liệu business (nhân viên, lương, chấm công). 
                  Các chức năng đó thuộc về HR Manager và Accounting Manager.
                </p>
                <div style={{marginTop: '24px', display: 'flex', gap: '12px'}}>
                  <QuickActionBtn onClick={() => setActive('users')} icon="👤">
                    Quản lý Users
                  </QuickActionBtn>
                  <QuickActionBtn onClick={() => setActive('role-requests')} icon="🔄">
                    Yêu cầu Role
                  </QuickActionBtn>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        {active === 'users' && <UsersManagementPage />}

        {/* Role Requests */}
        {active === 'role-requests' && <RoleRequestsPage />}

        {/* Audit Logs */}
        {active === 'audit-logs' && <AuditLogsPage />}

        {/* Settings Placeholder */}
        {active === 'settings' && (
          <div style={styles.pageContent}>
            <div style={styles.placeholderCard}>
              <div style={styles.placeholderIcon}>⚙️</div>
              <h3 style={styles.placeholderTitle}>Cài đặt hệ thống</h3>
              <p style={styles.placeholderText}>
                Chức năng đang được phát triển. Admin có thể cấu hình roles, permissions, và system settings tại đây.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
