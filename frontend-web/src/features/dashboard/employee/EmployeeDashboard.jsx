import { useMemo, useState, useEffect, useRef } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePermissions, useErrorHandler } from '@/shared/hooks'
import { dashboardBaseStyles as styles } from '@/shared/styles/dashboard'
import { NavItem, RoleBadge, KPICard, StatusBadge, LeaveStatusBar, StatCard } from './components/EmployeeDashboard.components'
import { sectionsConfig } from './components/EmployeeDashboard.constants'
import { ProfilePage, MyPayrollPage, MyAttendancePage, MyLeavePage, MyDocumentsPage, MyProjectsPage, MyStoragePage, MyReviewsPage } from '@/modules/employee'
import NotificationBell from '@/shared/components/notification/NotificationBell'
import AIChatBot from '@/shared/components/ai-chatbot/AIChatBot'
// Real Chat APIs
import { chatRoomApi } from '@/features/project/chat/api/chatRoomApi'
import { messageApi } from '@/features/project/chat/api/messageApi'
import websocketService from '@/features/project/chat/services/websocketService'
// HR Services for KPI data
import { attendanceService } from '@/shared/services/attendance.service'
import { leaveService } from '@/shared/services/leave.service'
import { payrollService } from '@/shared/services/payroll.service'
import { profileService } from '@/shared/services/profile.service'

export default function EmployeeDashboard() {
  const [active, setActive] = useState('dashboard')
  // Chat state - load from real API
  const [chatRooms, setChatRooms] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [wsConnected, setWsConnected] = useState(false)
  
  // KPI data state
  const [kpiData, setKpiData] = useState({
    salary: '---',
    leaveDays: 0,
    lateDays: 0,
    totalHours: 0
  })
  const [kpiLoading, setKpiLoading] = useState(true)
  const [employeeId, setEmployeeId] = useState(null)
  const [todayStatus, setTodayStatus] = useState(null)
  const [notifications, setNotifications] = useState([])
  
  // Sidebar hover state (like HR Manager)
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)
  const hoverTimeoutRef = useRef(null)
  
  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'Employee'
  const user = useMemo(() => ({ name: username || 'Nguyễn Văn A', role: 'Nhân viên' }), [username])

  const sections = useMemo(() => sectionsConfig, [])
  const meta = sections[active] || { title: 'Dashboard', subtitle: 'Employee Portal' }

  const handleLogout = async () => {
    await logout()
  }
  
  // Sidebar hover handlers
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setIsSidebarHovered(true)
  }

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsSidebarHovered(false), 100)
  }

  // Custom Styles for Light/Collapsed Theme (like HR Manager)
  const customStyles = {
    appShell: {
      display: 'flex',
      backgroundColor: '#f8fafc',
      height: '100vh',
      overflow: 'hidden',
    },
    sidebar: {
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
    },
    content: {
      flex: 1,
      width: '100%',
      background: '#f8fafc',
      height: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    userCard: {
      display: 'flex',
      alignItems: 'center',
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
    userAvatar: { 
      minWidth: 40, width: 40, height: 40, flexShrink: 0,
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: 16,
      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
    },
    userName: { color: '#334155', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' },
    userRole: { color: '#94a3b8', fontSize: 12, whiteSpace: 'nowrap' },
    navGroup: { marginBottom: 20 },
    navGroupLabel: {
      color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.5px', paddingLeft: 12, overflow: 'hidden',
      transition: 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), height 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: isSidebarHovered ? 1 : 0,
      height: isSidebarHovered ? '20px' : '0',
      marginBottom: isSidebarHovered ? 8 : 0,
    },
    divider: { background: '#f1f5f9', height: 1, margin: '16px 0' },
    logoutBtn: {
      background: '#fff', color: '#ef4444', border: '1px solid #fecaca',
      borderRadius: 10, padding: isSidebarHovered ? '12px 16px' : '12px',
      display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
      justifyContent: isSidebarHovered ? 'flex-start' : 'center',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      fontWeight: 600, fontSize: 14, fontFamily: 'inherit',
    }
  }

  // Load chat when switching to chat tab
  useEffect(() => {
    if (active === 'chat') {
      loadChatRooms()
      connectWebSocket()
    }
    return () => {
      if (active !== 'chat') {
        websocketService.disconnect()
      }
    }
  }, [active])

  // Load messages when selected room changes
  useEffect(() => {
    if (selectedContact?.roomId) {
      loadMessages(selectedContact.roomId)
      subscribeToRoom(selectedContact.roomId)
    }
  }, [selectedContact])

  // Load KPI data on mount
  useEffect(() => {
    loadKpiData()
  }, [])

  // Load KPI data from real APIs
  const loadKpiData = async () => {
    try {
      setKpiLoading(true)
      
      // Get profile to get employee ID (nhanvienId)
      const profile = await profileService.getProfile()
      const empId = profile?.nhanvienId || profile?.employeeId || authUser?.nhanvienId
      setEmployeeId(empId)
      
      if (!empId) {
        console.log('Employee ID not found in profile')
        setKpiLoading(false)
        return
      }
      
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      
      // Fetch all KPI data in parallel
      const [
        attendanceStats,
        totalHoursRes,
        todayStatusRes,
        salaryRes,
        leaveRequests
      ] = await Promise.allSettled([
        attendanceService.getStatistics(empId, year, month),
        attendanceService.getTotalHours(empId, year, month),
        attendanceService.getTodayStatus(empId),
        payrollService.getByEmployee(empId, month, year),
        leaveService.getByEmployee(empId)
      ])
      
      // Process attendance statistics
      let lateDays = 0
      if (attendanceStats.status === 'fulfilled' && attendanceStats.value) {
        lateDays = attendanceStats.value.lateDays || attendanceStats.value.diTre || 0
      }
      
      // Process total hours - API returns { totalHours: number } or just number
      let totalHours = 0
      if (totalHoursRes.status === 'fulfilled' && totalHoursRes.value) {
        const hoursData = totalHoursRes.value
        // Handle both object { totalHours: x } and direct number responses
        if (typeof hoursData === 'number') {
          totalHours = hoursData
        } else if (typeof hoursData === 'object') {
          totalHours = hoursData.totalHours || hoursData.tongGio || hoursData.soGio || 0
        }
      }
      
      // Process today's status
      if (todayStatusRes.status === 'fulfilled') {
        setTodayStatus(todayStatusRes.value)
      }
      
      // Process salary
      let salary = '---'
      if (salaryRes.status === 'fulfilled' && salaryRes.value) {
        const salaryData = salaryRes.value
        const salaryAmount = salaryData.thucNhan || salaryData.tongLuong || salaryData.luongCoBan || 0
        salary = new Intl.NumberFormat('vi-VN').format(salaryAmount)
      }
      
      // Process leave days (remaining)
      let leaveDays = 12 // Default annual leave
      if (leaveRequests.status === 'fulfilled' && leaveRequests.value) {
        const approvedLeaves = (leaveRequests.value || []).filter(
          l => l.trangThai === 'DUYET' || l.trangThai === 'APPROVED'
        )
        const usedDays = approvedLeaves.reduce((sum, l) => sum + (l.soNgay || 0), 0)
        leaveDays = Math.max(12 - usedDays, 0) // 12 is default annual leave
      }
      
      setKpiData({
        salary,
        leaveDays,
        lateDays,
        totalHours: typeof totalHours === 'number' ? Number(totalHours).toFixed(1) : '0'
      })
      
    } catch (error) {
      console.error('Error loading KPI data:', error)
    } finally {
      setKpiLoading(false)
    }
  }

  const loadChatRooms = async () => {
    try {
      const rooms = await chatRoomApi.getMyChatRooms()
      setChatRooms(rooms || [])
      if (rooms && rooms.length > 0) {
        setSelectedContact(rooms[0])
      }
    } catch (error) {
      setChatRooms([])
    }
  }

  const connectWebSocket = () => {
    websocketService.connect(
      () => {
        setWsConnected(true)
      },
      (error) => {
        setWsConnected(false)
      }
    )
  }

  const loadMessages = async (roomId) => {
    try {
      const msgs = await messageApi.getMessages(roomId, 0, 50)
      setMessages(msgs || [])
    } catch (error) {
      setMessages([])
    }
  }

  const subscribeToRoom = (roomId) => {
    if (!wsConnected) return
    
    websocketService.subscribeToRoom(roomId, (message) => {
      if (message.type === 'CHAT_MESSAGE') {
        setMessages(prev => [...prev, message.data])
      }
    })
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedContact) return
    
    try {
      if (selectedContact.roomId) {
        await messageApi.sendMessage(selectedContact.roomId, messageInput)
        setMessageInput('')
        // Message will be received via WebSocket
      }
    } catch (error) {
      alert('Không thể gửi tin nhắn: ' + (error.message || 'Lỗi kết nối'))
    }
  }

  // Helper to check if message is from current user
  const isOwnMessage = (message) => {
    return message.senderId === authUser?.userId || message.isOwn === true
  }

  // Helper to format message time
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  // Handle GPS Check-in/Check-out
  const handleGpsCheckIn = async () => {
    if (!employeeId) {
      alert('Không tìm thấy thông tin nhân viên. Vui lòng tải lại trang.')
      return
    }

    // Check if already checked out today
    if (todayStatus?.hasCheckedOut) {
      alert('Bạn đã hoàn thành chấm công hôm nay!')
      return
    }

    try {
      // Get current position
      if (!navigator.geolocation) {
        alert('Trình duyệt không hỗ trợ GPS. Vui lòng sử dụng trình duyệt khác.')
        return
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })

      const { latitude, longitude } = position.coords

      if (todayStatus?.hasCheckedIn) {
        // Check-out
        const attendanceId = todayStatus.chamCong?.chamcongId
        if (attendanceId) {
          await attendanceService.checkOut(attendanceId)
          alert('✅ Chấm công ra thành công!')
        }
      } else {
        // GPS Check-in
        const result = await attendanceService.gpsCheckIn(
          employeeId,
          latitude,
          longitude,
          `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
        )
        
        if (result.khoangCach && result.khoangCach > 500) {
          alert(`⚠️ Bạn đang ở ngoài phạm vi công ty (${result.khoangCach.toFixed(0)}m). Chấm công có thể không hợp lệ.`)
        } else {
          alert('✅ Chấm công vào thành công!')
        }
      }

      // Reload KPI data
      loadKpiData()

    } catch (error) {
      console.error('GPS Check-in error:', error)
      if (error.code === 1) {
        alert('❌ Bạn đã từ chối quyền truy cập vị trí. Vui lòng cho phép truy cập GPS để chấm công.')
      } else if (error.code === 2) {
        alert('❌ Không thể xác định vị trí. Vui lòng kiểm tra GPS và thử lại.')
      } else if (error.code === 3) {
        alert('❌ Hết thời gian chờ GPS. Vui lòng thử lại.')
      } else {
        alert('❌ Lỗi chấm công: ' + (error.message || 'Không xác định'))
      }
    }
  }

  return (
    <div style={customStyles.appShell}>
      {/* --- SIDEBAR (Collapsible like HR Manager) --- */}
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

        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Tổng quan</div>
          <NavItem active={active === 'dashboard'} onClick={() => setActive('dashboard')} icon="🏠" collapsed={!isSidebarHovered}>Dashboard</NavItem>
          <NavItem active={active === 'profile'} onClick={() => setActive('profile')} icon="👤" collapsed={!isSidebarHovered}>Hồ sơ cá nhân</NavItem>
        </div>

        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Công việc</div>
          <NavItem active={active === 'timesheet'} onClick={() => setActive('timesheet')} icon="🕐" collapsed={!isSidebarHovered}>Chấm công</NavItem>
          <NavItem active={active === 'leave'} onClick={() => setActive('leave')} icon="📋" collapsed={!isSidebarHovered}>Nghỉ phép</NavItem>
          <NavItem active={active === 'payroll'} onClick={() => setActive('payroll')} icon="💰" collapsed={!isSidebarHovered}>Phiếu lương</NavItem>
          <NavItem active={active === 'projects'} onClick={() => setActive('projects')} icon="🏭" collapsed={!isSidebarHovered}>Dự án</NavItem>
        </div>

        <div style={customStyles.navGroup}>
          <div style={customStyles.navGroupLabel}>Tài liệu & Khác</div>
          <NavItem active={active === 'documents'} onClick={() => setActive('documents')} icon="📄" collapsed={!isSidebarHovered}>Hợp đồng</NavItem>
          <NavItem active={active === 'storage'} onClick={() => setActive('storage')} icon="💾" collapsed={!isSidebarHovered}>File của tôi</NavItem>
          <NavItem active={active === 'reviews'} onClick={() => setActive('reviews')} icon="⭐" collapsed={!isSidebarHovered}>Đánh giá</NavItem>
          <NavItem active={active === 'chat'} onClick={() => setActive('chat')} icon="💬" collapsed={!isSidebarHovered}>Trò chuyện</NavItem>
        </div>

        <div style={{flex: 1}} />

        <button style={customStyles.logoutBtn} onClick={handleLogout}>
          <span style={{fontSize: 18, minWidth: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🚪</span>
          <span style={{
            marginLeft: isSidebarHovered ? 8 : 0,
            transition: 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: isSidebarHovered ? 1 : 0,
            transform: isSidebarHovered ? 'translateX(0)' : 'translateX(-10px)',
            overflow: 'hidden', whiteSpace: 'nowrap',
          }}>Đăng xuất</span>
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
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
          <div style={{ padding: '24px 32px' }}>
            {/* Stats Grid (like HR Manager) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 24 }}>
              <StatCard 
                title="Lương tháng này"
                value={kpiLoading ? '...' : `${kpiData.salary}đ`}
                subtext="Dự kiến"
                icon="💰"
                accentColor="#10b981"
                onClick={() => setActive('payroll')}
              />
              <StatCard 
                title="Ngày phép còn lại"
                value={kpiLoading ? '...' : `${kpiData.leaveDays}`}
                subtext={`/ 12 ngày năm`}
                icon="📅"
                accentColor="#3b82f6"
                onClick={() => setActive('leave')}
              />
              <StatCard 
                title="Số lần đi muộn"
                value={kpiLoading ? '...' : `${kpiData.lateDays}`}
                subtext="Tháng này"
                icon="⏰"
                accentColor="#f59e0b"
                highlight={kpiData.lateDays > 0}
                onClick={() => setActive('timesheet')}
              />
              <StatCard 
                title="Tổng giờ làm"
                value={kpiLoading ? '...' : `${kpiData.totalHours}h`}
                subtext="Tháng này"
                icon="🕐"
                accentColor="#8b5cf6"
                onClick={() => setActive('timesheet')}
              />
            </div>

            {/* Welcome & Attendance Row (Modern style like HR Manager) */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
              {/* Welcome Card */}
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                padding: '28px 32px', borderRadius: 16, color: '#fff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 22, fontWeight: 700 }}>Chào mừng, {user.name}!</h3>
                {todayStatus ? (
                  <p style={{ margin: 0, opacity: 0.9, fontSize: 15, lineHeight: 1.6 }}>
                    {todayStatus.hasCheckedIn 
                      ? `✅ Bạn đã chấm công vào lúc ${todayStatus.chamCong?.gioVao || 'N/A'}${todayStatus.hasCheckedOut ? ` và ra lúc ${todayStatus.chamCong?.gioRa}` : '. Đừng quên chấm công ra cuối ngày!'}`
                      : 'Hãy bắt đầu ngày làm việc bằng cách chấm công. Chúc bạn một ngày làm việc hiệu quả!'}
                  </p>
                ) : (
                  <p style={{ margin: 0, opacity: 0.9, fontSize: 15 }}>
                    Hãy bắt đầu ngày làm việc bằng cách chấm công. Chúc bạn một ngày hiệu quả!
                  </p>
                )}
                <button 
                  style={{
                    marginTop: 20, border: 'none', borderRadius: 10, padding: '12px 24px',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    background: todayStatus?.hasCheckedOut ? '#94a3b8' : (todayStatus?.hasCheckedIn ? '#ef4444' : '#fff'),
                    color: todayStatus?.hasCheckedOut ? '#fff' : (todayStatus?.hasCheckedIn ? '#fff' : '#1d4ed8'),
                  }}
                  onClick={handleGpsCheckIn}
                  disabled={todayStatus?.hasCheckedOut}
                >
                  {todayStatus?.hasCheckedOut ? '✅ Đã hoàn thành hôm nay' : todayStatus?.hasCheckedIn ? '📤 Chấm công ra' : '📥 Chấm công vào'}
                </button>
              </div>

              {/* Today Status Card */}
              <div style={{
                background: '#fff', borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📊</div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Trạng thái hôm nay</h3>
                </div>
                <div style={{ padding: 20 }}>
                  {todayStatus ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <span style={{ fontSize: 32 }}>{todayStatus.hasCheckedIn ? '✅' : '⏳'}</span>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 15 }}>
                            {todayStatus.hasCheckedIn ? 'Đã chấm công' : 'Chưa chấm công'}
                          </div>
                          {todayStatus.chamCong && (
                            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                              Vào: {todayStatus.chamCong.gioVao || '--:--'} • Ra: {todayStatus.chamCong.gioRa || '--:--'}
                            </div>
                          )}
                        </div>
                      </div>
                      {todayStatus.chamCong?.trangThai && (
                        <div style={{
                          padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                          background: todayStatus.chamCong.trangThai === 'DU_GIO' ? '#f0fdf4' : '#fef3c7',
                          color: todayStatus.chamCong.trangThai === 'DU_GIO' ? '#15803d' : '#d97706',
                        }}>
                          {todayStatus.chamCong.trangThai === 'DU_GIO' ? '✓ Đúng giờ' : todayStatus.chamCong.trangThai === 'DI_TRE' ? '⚠️ Đi trễ' : todayStatus.chamCong.trangThai}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
                      {kpiLoading ? '⏳ Đang tải...' : 'Chưa có dữ liệu chấm công'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🚀</div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Truy cập nhanh</h3>
                </div>
                <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'Xem chấm công', icon: '🕐', action: () => setActive('timesheet') },
                    { label: 'Xin nghỉ phép', icon: '📋', action: () => setActive('leave') },
                    { label: 'Xem lương', icon: '💰', action: () => setActive('payroll') },
                    { label: 'Dự án', icon: '🏭', action: () => setActive('projects') },
                  ].map((item, idx) => (
                    <button key={idx} onClick={item.action} style={{
                      background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10,
                      padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                      transition: 'all 0.2s', fontFamily: 'inherit'
                    }}>
                      <span style={{ fontSize: 18 }}>{item.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>💡</div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Thông tin hữu ích</h3>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f8fafc', borderRadius: 10 }}>
                      <span style={{ fontSize: 20 }}>📞</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Hỗ trợ IT</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>Ext: 1234</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f8fafc', borderRadius: 10 }}>
                      <span style={{ fontSize: 20 }}>📧</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>HR Support</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>hr@company.com</div>
                      </div>
                    </div>
                  </div>
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
        {active === 'chat' && (
          <div style={styles.pageContent}>
            <div style={styles.chatContainer}>
              {/* Left Column - Chat List */}
              <div style={styles.chatSidebar}>
                <div style={styles.chatSidebarHeader}>
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <svg 
                      style={{
                        position: 'absolute',
                        left: '14px',
                        width: '18px',
                        height: '18px',
                        pointerEvents: 'none',
                        zIndex: 1
                      }}
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#7b809a" 
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm cuộc trò chuyện..." 
                      style={styles.chatSearchInput}
                    />
                  </div>
                </div>
                
                <div style={styles.chatContactList}>
                  {chatRooms.map((contact) => (
                    <div 
                      key={contact.id || contact.roomId}
                      style={{
                        ...styles.chatContactItem,
                        ...((selectedContact?.id === contact.id || selectedContact?.roomId === contact.roomId) ? styles.chatContactItemActive : {})
                      }}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div style={styles.chatContactAvatar}>
                        <span style={styles.chatContactAvatarIcon}>{contact.avatar || '\ud83d\udc64'}</span>
                        {(contact.online || wsConnected) && <div style={styles.chatOnlineBadge} />}
                      </div>
                      <div style={styles.chatContactInfo}>
                        <div style={styles.chatContactHeader}>
                          <div style={styles.chatContactName}>{contact.name}</div>
                          <div style={styles.chatContactTime}>{contact.time || ''}</div>
                        </div>
                        <div style={styles.chatContactMessage}>{contact.lastMessage || 'Chưa có tin nhắn'}</div>
                      </div>
                      {(contact.unread || contact.unreadCount) > 0 && (
                        <div style={styles.chatUnreadBadge}>{contact.unread || contact.unreadCount}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Chat Window */}
              <div style={styles.chatWindow}>
                {/* Chat Header */}
                <div style={styles.chatWindowHeader}>
                  <div style={styles.chatWindowHeaderLeft}>
                    <div style={styles.chatWindowAvatar}>{selectedContact?.avatar || 'Người dùng'}</div>
                    <div>
                      <div style={styles.chatWindowName}>{selectedContact?.name || 'Chọn cuộc trò chuyện'}</div>
                      <div style={styles.chatWindowStatus}>
                        {wsConnected ? 'Đang hoạt động' : 'Không hoạt động'}
                      </div>
                    </div>
                  </div>
                  <div style={styles.chatWindowActions}>
                    <button style={styles.chatActionButton} title="Tìm kiếm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                      </svg>
                    </button>
                    <button style={styles.chatActionButton} title="Gọi điện">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div style={styles.chatMessagesArea}>
                  <div style={styles.chatDateDivider}>
                    <span style={styles.chatDateText}>Hôm nay</span>
                  </div>
                  {messages.map((message, idx) => {
                    const isOwn = isOwnMessage(message)
                    return (
                      <div 
                        key={message.messageId || message.id || idx}
                        style={{
                          ...styles.chatMessageRow,
                          ...(isOwn ? styles.chatMessageRowOwn : {})
                        }}
                      >
                        {!isOwn && (
                          <div style={styles.chatMessageAvatar}>
                            {message.senderName?.charAt(0) || '👤'}
                          </div>
                        )}
                        <div style={styles.chatMessageGroup}>
                          <div style={{
                            ...styles.chatMessageBubble,
                            ...(isOwn ? styles.chatMessageBubbleOwn : {})
                          }}>
                            {message.content}
                          </div>
                          <div style={{
                            ...styles.chatMessageTime,
                            ...(isOwn ? styles.chatMessageTimeOwn : {})
                          }}>
                            {formatMessageTime(message.sentAt || message.time)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Input Area */}
                <div style={styles.chatInputArea}>
                  <div style={styles.chatInputToolbar}>
                    <button style={styles.chatToolButton} title="Đính kèm file">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                      </svg>
                    </button>
                    <button style={styles.chatToolButton} title="Hình ảnh">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </button>
                    <button style={styles.chatToolButton} title="Biểu tượng cảm xúc">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                        <line x1="9" y1="9" x2="9.01" y2="9"/>
                        <line x1="15" y1="9" x2="15.01" y2="9"/>
                      </svg>
                    </button>
                  </div>
                  <div style={styles.chatInputWrapper}>
                    <input 
                      type="text"
                      placeholder={`Nhắn tin tới ${selectedContact?.name || 'cuộc trò chuyện'}...`}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      style={styles.chatMessageInput}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && messageInput.trim()) {
                          handleSendMessage()
                        }
                      }}
                    />
                    <button 
                      style={styles.chatSendButton}
                      onClick={handleSendMessage}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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

        {/* Reviews Page */}
        {active === 'reviews' && <MyReviewsPage />}
      </main>

      {/* AI Assistant - Floating Button */}
      <AIChatBot />
    </div>
  )
}


