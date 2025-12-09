import { useEffect, useMemo, useState, useRef } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import './AccountingManagerDashboard.css' // Import custom CSS
import { dashboardService } from '@/features/hr/shared/services/dashboard.service'
import { payrollService } from '@/shared/services/payroll.service'
import { apiService } from '@/shared/services/api.service' // For direct API calls if needed

// Feature Pages (We will implement these next)
import { PayrollPage } from '@/features/accounting/payroll/PayrollPage'
import { AttendancePage } from '@/features/accounting/attendance/AttendancePage'
import AccountingStoragePage from '@/features/accounting/storage/AccountingStoragePage'

// Shared Components
import { SharedProfilePage } from '@/shared/components/profile'
import { SharedPayrollPage } from '@/shared/components/payroll'
import { ChatPage } from '@/modules/project'
import NotificationBell from '@/shared/components/notification/NotificationBell'

export default function AccountingManagerDashboard() {
  const [active, setActive] = useState('dashboard')
  const { logout, user: authUser } = useAuth()

  // Real Data State
  const [stats, setStats] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    pendingTasks: 0,
    notifs: 0
  })
  const [loading, setLoading] = useState(true)
  const [welcomeText, setWelcomeText] = useState('')

  const username = authUser?.username || localStorage.getItem('username') || 'Accounting'
  const user = useMemo(() => ({
    name: username,
    role: 'Quản lý kế toán',
    initial: username.charAt(0).toUpperCase()
  }), [username])

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // Fetch HR/Accounting stats
        const data = await dashboardService.getStats()

        // Map data to UI
        // Handle both wrapped { tongQuan: ... } and flat structure
        const statsData = data?.tongQuan || data || {}
        console.log("Dashboard Stats Data:", statsData)

        // Note: Backend currently supports "Total Salary Cost" as expenses. 
        // Revenue/Profit are not yet tracked, so we default to 0.
        // Use tongChiPhiLuongThang from DashboardStatsDTO
        const totalSalary = statsData.tongChiPhiLuongThang || statsData.tongLuongThangNay || 0

        // Aggregate all pending tasks
        const pendingPayrolls = statsData.bangLuongChoDuyet || 0
        const pendingLeaves = statsData.donNghiPhepChoDuyet || 0
        const expiringContracts = statsData.hopDongHetHan30Ngay || 0
        const totalPending = pendingPayrolls + pendingLeaves + expiringContracts

        const unreadNotifs = statsData.thongBaoChuaDoc || 0

        setStats({
          revenue: 0, // Backend does not track Revenue yet
          expenses: totalSalary,
          profit: 0, // Backend does not track Profit yet
          pendingTasks: totalPending, // Sum of Payrolls + Leaves + Expiring Contracts
          notifs: unreadNotifs
        })

        setWelcomeText(`Hôm nay bạn có ${pendingPayrolls} bảng lương cần duyệt.`)
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error)
      } finally {
        setLoading(false)
      }
    }

    if (active === 'dashboard') {
      fetchDashboardData()
    }
  }, [active])

  const handleLogout = async () => {
    await logout()
  }

  // --- Render Helpers ---

  // --- Render Helpers ---

  const renderSidebar = () => (
    <aside className="sidebar">
      <div className="user-profile">
        <div className="avatar">{user.initial}</div>
        <div className="user-info">
          <h4>{user.name}</h4>
          <p>{user.role}</p>
        </div>
      </div>

      <div className="menu-section">
        <div className="menu-title">Tổng quan</div>
        <div className={`menu-item ${active === 'dashboard' ? 'active' : ''}`} onClick={() => setActive('dashboard')}>
          <i className="fa-solid fa-house"></i>
          <span>Dashboard</span>
        </div>

        <div className="menu-title" style={{ marginTop: '15px' }}>Cá nhân</div>
        <div className={`menu-item ${active === 'my-payroll' ? 'active' : ''}`} onClick={() => setActive('my-payroll')}>
          <i className="fa-solid fa-money-check-dollar"></i>
          <span>Phiếu lương cá nhân</span>
        </div>
        <div className={`menu-item ${active === 'storage' ? 'active' : ''}`} onClick={() => setActive('storage')}>
          <i className="fa-solid fa-folder-open"></i>
          <span>File của tôi</span>
        </div>

        <div className="menu-title" style={{ marginTop: '15px' }}>Quản lý tài chính</div>
        <div className={`menu-item ${active === 'payroll' ? 'active' : ''}`} onClick={() => setActive('payroll')}>
          <i className="fa-solid fa-coins"></i>
          <span>Bảng lương</span>
        </div>
        <div className={`menu-item ${active === 'attendance' ? 'active' : ''}`} onClick={() => setActive('attendance')}>
          <i className="fa-regular fa-clock"></i>
          <span>Quản lý chấm công</span>
        </div>

        <div className="menu-title" style={{ marginTop: '15px' }}>Hệ thống</div>
        <div className={`menu-item ${active === 'profile' ? 'active' : ''}`} onClick={() => setActive('profile')}>
          <i className="fa-solid fa-gear"></i>
          <span>Cài đặt</span>
        </div>

        <div style={{ flex: 1 }}></div>
        <div className="menu-item" onClick={handleLogout} style={{ color: '#ef4444', borderColor: '#fecaca', background: '#fff' }}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Đăng xuất</span>
        </div>
      </div>
    </aside>
  )

  const renderDashboardContent = () => (
    <>
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-green">
              <i className="fa-solid fa-money-bill-wave"></i>
            </div>
            <span className="badge text-green">+0%</span>
          </div>
          <div>
            <div className="stat-value">{stats.revenue.toLocaleString('vi-VN')}</div>
            <div className="stat-label">Tổng doanh thu</div>
            <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '4px' }}>(Chưa cập nhật)</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-purple">
              <i className="fa-solid fa-chart-simple"></i>
            </div>
            <span className="badge text-purple">Tháng này</span>
          </div>
          <div>
            <div className="stat-value">{stats.expenses.toLocaleString('vi-VN')}</div>
            <div className="stat-label">Chi phí lương</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-blue">
              <i className="fa-solid fa-arrow-trend-up"></i>
            </div>
            <span className="badge text-blue">+0%</span>
          </div>
          <div>
            <div className="stat-value">{stats.profit.toLocaleString('vi-VN')}</div>
            <div className="stat-label">Lợi nhuận</div>
            <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '4px' }}>(Chưa cập nhật)</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-yellow">
              <i className="fa-solid fa-hourglass-half"></i>
            </div>
            <span className="badge text-yellow">Cần xử lý</span>
          </div>
          <div>
            <div className="stat-value">{stats.pendingTasks}</div>
            <div className="stat-label">Đơn chờ duyệt</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">

        <div className="card welcome-card">
          <h2>Chào mừng, {user.name}!</h2>
          <p>Hôm nay bạn có <strong>{stats.pendingTasks} đơn cần duyệt</strong>. Hãy xem xét và phê duyệt để đảm bảo quy trình kế toán diễn ra suôn sẻ.</p>
          <button className="btn-primary" onClick={() => setActive('payroll')}>
            <i className="fa-solid fa-file-invoice-dollar"></i>
            Xem bảng lương
          </button>
        </div>

        <div className="card">
          <div className="notif-header">
            <i className="fa-regular fa-bell"></i>
            Thông báo & Sự kiện
          </div>
          <div className="notif-list">
            {/* Mock notifications matching layout */}
            <div className="notif-item">
              <div className="notif-icon">
                <i className="fa-solid fa-file-contract"></i>
              </div>
              <div className="notif-content">
                <h5>Báo cáo tài chính Q4</h5>
                <p>Cần hoàn thành báo cáo trước 15/12</p>
                <span className="notif-time">
                  <i className="fa-regular fa-clock" style={{ marginRight: '5px', fontSize: '0.7rem' }}></i>1 giờ trước
                </span>
              </div>
            </div>

            <div className="notif-item">
              <div className="notif-icon">
                <i className="fa-solid fa-magnifying-glass-dollar"></i>
              </div>
              <div className="notif-content">
                <h5>Kiểm toán nội bộ</h5>
                <p>Lịch kiểm toán sắp tới</p>
                <span className="notif-time">
                  <i className="fa-regular fa-clock" style={{ marginRight: '5px', fontSize: '0.7rem' }}></i>2 giờ trước
                </span>
              </div>
            </div>

            <div className="notif-item">
              <div className="notif-icon">
                <i className="fa-solid fa-money-check"></i>
              </div>
              <div className="notif-content">
                <h5>Thanh toán lương</h5>
                <p>Đã hoàn thành thanh toán lương tháng 11</p>
                <span className="notif-time">
                  <i className="fa-regular fa-clock" style={{ marginRight: '5px', fontSize: '0.7rem' }}></i>1 ngày trước
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )

  return (
    <div className="accounting-dashboard-container">
      {renderSidebar()}

      <main className="main-content">
        {/* Header */}
        {active !== 'profile' && active !== 'my-payroll' && active !== 'storage' && (
          <header>
            <div className="header-title">
              <h1>{active === 'dashboard' ? 'Dashboard' :
                active === 'payroll' ? 'Quản lý Bảng lương' :
                  active === 'attendance' ? 'Quản lý Chấm công' :
                    active === 'chat' ? 'Trò chuyện' : 'Quản lý'}</h1>
              <p>Xin chào, {user.name}</p>
            </div>
            <div className="header-actions">
              <button className="icon-btn" title="Thông báo">
                <i className="fa-regular fa-bell"></i>
                {stats.notifs > 0 && <div className="notification-dot"></div>}
              </button>
              <div className="breadcrumbs">
                <i className="fa-solid fa-briefcase"></i>
                Quản lý kế toán
              </div>
            </div>
          </header>
        )}

        {/* Content Switcher */}
        {active === 'dashboard' && renderDashboardContent()}

        {active === 'payroll' && <PayrollPage />}

        {active === 'attendance' && <AttendancePage />}

        {active === 'storage' && <AccountingStoragePage />}

        {active === 'chat' && <ChatPage />}

        {active === 'my-payroll' && (
          <SharedPayrollPage
            title="Phiếu lương cá nhân"
            breadcrumb="Cá nhân / Phiếu lương"
            glassMode={true}
          />
        )}

        {active === 'profile' && (
          <SharedProfilePage
            title="Cài đặt"
            breadcrumb="Hệ thống / Cài đặt"
            allowEdit={true}
            userRole="Accounting Manager"
          />
        )}

      </main>
    </div>
  )
}
