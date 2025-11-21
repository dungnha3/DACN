import { useMemo, useState, useEffect } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { styles } from './HrManagerDashboard.styles'
import { NavItem, RoleBadge, KPICard, StatusBadge, LeaveStatusBar, ApprovalStatusBadge } from './components/HrManagerDashboard.components'
import { sectionsConfig, chatContacts, chatMessages, notifications } from './components/HrManagerDashboard.constants'
import { dashboardService, attendanceService, leavesService, contractsService } from '@/features/hr/shared/services'
import { 
  EmployeesPage, 
  LeavesPage, 
  DepartmentsPage, 
  ContractsPage, 
  PositionsPage, 
  EvaluationsPage, 
  HRDashboardPage 
} from '@modules/hr'

// --- THƯ VIỆN BIỂU ĐỒ ---
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function HrManagerDashboard() {
  const [active, setActive] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  
  // State cho dữ liệu từ API
  const [kpiData, setKpiData] = useState({ totalEmployees: 0, pendingLeaves: 0, approvedToday: 0, newHires: 0 })
  const [chartData, setChartData] = useState([])
  const [expiringContracts, setExpiringContracts] = useState([])
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])
  const [approvals, setApprovals] = useState([])
  
  const [selectedContact, setSelectedContact] = useState(chatContacts[0])
  const [messageInput, setMessageInput] = useState('')
  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'HR Manager'
  const user = useMemo(() => ({ name: username || 'Nguyễn Thị C', role: 'Quản lý nhân sự' }), [username])

  const sections = useMemo(() => sectionsConfig, [])
  const meta = sections[active]
  
  // Load dữ liệu khi component mount
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [stats, contracts, attendance, leaves, pending] = await Promise.all([
        dashboardService.getStats(),
        contractsService.getExpiring(30),
        attendanceService.getAll(),
        leavesService.getAll(),
        leavesService.getPending()
      ])
      
      setKpiData({
        totalEmployees: stats.tongNhanVien || 0,
        pendingLeaves: pending.length || 0,
        approvedToday: stats.donDaDuyet || 0,
        newHires: stats.nhanVienMoi || 0
      })
      setChartData(stats.chamCongPhongBan || [])
      setExpiringContracts(contracts.slice(0, 3) || [])
      setAttendanceHistory(attendance.slice(0, 5) || [])
      setLeaveRequests(leaves.slice(0, 3) || [])
      setApprovals(pending || [])
    } catch (err) {
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  const handleApprove = async (id) => {
    try {
      await leavesService.approve(id, 'Phê duyệt')
      await loadDashboardData()
      alert('Đã duyệt đơn thành công!')
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleReject = async (id) => {
    try {
      await leavesService.reject(id, 'Từ chối')
      await loadDashboardData()
      alert('Đã từ chối đơn!')
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
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
        </div>

        <div style={styles.navGroup}>
          <div style={styles.navGroupLabel}>Đánh giá & Khác</div>
          <NavItem active={active === 'evaluations'} onClick={() => setActive('evaluations')} icon="⭐">
            Đánh giá
          </NavItem>
          <NavItem active={active === 'chat'} onClick={() => setActive('chat')} icon="💬">
            Chat
          </NavItem>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Đăng xuất
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main style={styles.content}>
        
        {/* Dynamic Header (Ẩn trên các trang chi tiết để giữ không gian) */}
        {!['employees', 'departments', 'positions', 'contracts', 'leaves', 'evaluations'].includes(active) && (
          <header style={styles.header}>
            <div>
              <div style={styles.pageHeading}>{meta?.title || 'HR Dashboard'}</div>
              {active !== 'chat' && <div style={styles.subHeading}>Xin chào, {user.name}</div>}
            </div>

            <div style={styles.rightCluster}>
              <RoleBadge role={user.role} />
            </div>
          </header>
        )}

        {/* --- DASHBOARD SCREEN (MOCK UI) --- */}
        {active === 'dashboard' && (
          <div style={styles.dashboardContent}>
            
            {/* 1. KPI CARDS ROW */}
            <div style={styles.kpiGrid}>
              <KPICard 
                title="Tổng nhân viên" 
                value={`${kpiData.totalEmployees} người`} 
                icon="👥" color="success" change="+5 người" 
              />
              <KPICard 
                title="Đơn chờ duyệt" 
                value={`${kpiData.pendingLeaves} đơn`} 
                icon="⏳" color="warning" change="Cần xử lý" 
              />
              <KPICard 
                title="Đã duyệt hôm nay" 
                value={`${kpiData.approvedToday} đơn`} 
                icon="✓" color="info" change="+3 đơn" 
              />
              <KPICard 
                title="Hợp đồng sắp hết hạn" 
                value={`${expiringContracts.length} HĐ`} 
                icon="📝" color="primary" change="Trong 30 ngày tới" 
              />
            </div>

            {/* 2. WELCOME & NOTIFICATIONS ROW */}
            <div style={styles.cardsRow}>
              <div style={styles.welcomeCard}>
                <div style={styles.welcomeContent}>
                  <h3 style={styles.welcomeTitle}>Chào mừng, {user.name}!</h3>
                  <p style={styles.welcomeText}>
                    Hệ thống ghi nhận bạn có <b>{kpiData.pendingLeaves}</b> đơn nghỉ phép đang chờ duyệt và <b>{kpiData.newHires}</b> hồ sơ tuyển dụng mới cần xem xét.
                  </p>
                  <button style={styles.checkInBtn} onClick={() => setActive('approvals')}>
                    ✓ Duyệt đơn ngay
                  </button>
                </div>
              </div>

              {/* Widget Hợp đồng sắp hết hạn */}
              <div style={styles.notificationCard}>
                <h4 style={styles.cardTitle}>⚠️ Hợp đồng cần chú ý</h4>
                <div style={styles.notificationList}>
                  {expiringContracts.map((contract, idx) => (
                    <div key={idx} style={styles.notificationItem}>
                      <div style={{...styles.notifIcon, fontSize: 16}}>📄</div>
                      <div style={styles.notifContent}>
                        <div style={styles.notifTitle}>{contract.nhanVien || contract.tenNhanVien} <span style={{fontWeight: 'normal', fontSize: 12, color: '#7b809a'}}>({contract.chucVu || contract.tenChucVu})</span></div>
                        <div style={styles.notifDesc}>Hết hạn: {contract.ngayKetThuc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. CHARTS ROW (Sử dụng Recharts với Mock Data) */}
            <div style={styles.chartsRow}>
              {/* Biểu đồ Cột: Thống kê chấm công */}
              <div style={styles.chartCard}>
                <h4 style={styles.cardTitle}>📊 Thống kê giờ làm việc theo phòng ban</h4>
                <div style={{ height: 300, marginTop: 20 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.map(d => ({ name: d.phongBan, hours: (d.coMat || 0) * 8 }))} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip 
                        cursor={{fill: 'transparent'}} 
                        contentStyle={{borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                      />
                      <Bar dataKey="hours" name="Tổng giờ làm" radius={[4, 4, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#fb8c00', '#43a047', '#1e88e5', '#e53935', '#8e24aa'][index % 5]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Widget Thông báo */}
              <div style={styles.notificationCard}>
                <h4 style={styles.cardTitle}>📌 Thông báo & Sự kiện</h4>
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
          </div>
        )}

        {/* --- CÁC TRANG CHỨC NĂNG KHÁC --- */}

        {active === 'leave' && (
          <div style={styles.pageContent}>
            <div style={styles.leaveLayout}>
              <div style={styles.tableCard}>
                <div style={styles.tableHeader}>
                  <h4 style={styles.tableTitle}>Lịch sử đơn từ của tôi</h4>
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

        {/* Approvals Page */}
        {active === 'approvals' && (
          <div style={styles.pageContent}>
            <div style={styles.tableCard}>
              <div style={styles.tableHeader}>
                <h4 style={styles.tableTitle}>Duyệt nghỉ phép nhân viên</h4>
              </div>
              
              {approvals.map((approval) => (
                <div key={approval.id} style={styles.approvalCard}>
                  <div style={styles.approvalHeader}>
                    <div>
                      <div style={styles.approvalEmployee}>{approval.employeeName}</div>
                      <div style={styles.approvalType}>{approval.type}</div>
                    </div>
                    <ApprovalStatusBadge status={approval.status} />
                  </div>

                  <div style={styles.approvalBody}>
                    <div style={styles.approvalField}>
                      <div style={styles.approvalLabel}>Từ ngày</div>
                      <div style={styles.approvalValue}>{approval.fromDate}</div>
                    </div>
                    <div style={styles.approvalField}>
                      <div style={styles.approvalLabel}>Đến ngày</div>
                      <div style={styles.approvalValue}>{approval.toDate}</div>
                    </div>
                    <div style={styles.approvalField}>
                      <div style={styles.approvalLabel}>Số ngày</div>
                      <div style={styles.approvalValue}>{approval.days} ngày</div>
                    </div>
                    <div style={styles.approvalField}>
                      <div style={styles.approvalLabel}>Ngày gửi</div>
                      <div style={styles.approvalValue}>{approval.submitDate}</div>
                    </div>
                    <div style={styles.approvalReason}>
                      <div style={styles.approvalReasonLabel}>Lý do</div>
                      <div style={styles.approvalReasonText}>{approval.reason}</div>
                    </div>
                  </div>

                  {approval.status === 'pending' && (
                    <div style={styles.approvalActions}>
                      <button style={styles.rejectBtn} onClick={() => handleReject(approval.id)}>
                        ✗ Từ chối
                      </button>
                      <button style={styles.approveBtn} onClick={() => handleApprove(approval.id)}>
                        ✓ Phê duyệt
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Page */}
        {active === 'chat' && (
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
                {chatContacts.map((contact) => (
                  <div 
                    key={contact.id}
                    style={{
                      ...styles.chatContactItem,
                      ...(selectedContact.id === contact.id ? styles.chatContactItemActive : {})
                    }}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div style={styles.chatContactAvatar}>
                      <span style={styles.chatContactAvatarIcon}>{contact.avatar}</span>
                      {contact.online && <div style={styles.chatOnlineBadge} />}
                    </div>
                    <div style={styles.chatContactInfo}>
                      <div style={styles.chatContactHeader}>
                        <div style={styles.chatContactName}>{contact.name}</div>
                        <div style={styles.chatContactTime}>{contact.time}</div>
                      </div>
                      <div style={styles.chatContactMessage}>{contact.lastMessage}</div>
                    </div>
                    {contact.unread > 0 && (
                      <div style={styles.chatUnreadBadge}>{contact.unread}</div>
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
                  <div style={styles.chatWindowAvatar}>{selectedContact.avatar}</div>
                  <div>
                    <div style={styles.chatWindowName}>{selectedContact.name}</div>
                    <div style={styles.chatWindowStatus}>
                      {selectedContact.online ? '🟢 Đang hoạt động' : '⚫ Không hoạt động'}
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
                  <button style={styles.chatActionButton} title="Video call">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="23 7 16 12 23 17 23 7"/>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                    </svg>
                  </button>
                  <button style={styles.chatActionButton} title="Thêm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div style={styles.chatMessagesArea}>
                <div style={styles.chatDateDivider}>
                  <span style={styles.chatDateText}>Hôm nay</span>
                </div>
                {chatMessages.map((message) => (
                  <div 
                    key={message.id}
                    style={{
                      ...styles.chatMessageRow,
                      ...(message.isOwn ? styles.chatMessageRowOwn : {})
                    }}
                  >
                    {!message.isOwn && (
                      <div style={styles.chatMessageAvatar}>{selectedContact.avatar}</div>
                    )}
                    <div style={styles.chatMessageGroup}>
                      <div style={{
                        ...styles.chatMessageBubble,
                        ...(message.isOwn ? styles.chatMessageBubbleOwn : {})
                      }}>
                        {message.content}
                      </div>
                      <div style={{
                        ...styles.chatMessageTime,
                        ...(message.isOwn ? styles.chatMessageTimeOwn : {})
                      }}>
                        {message.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div style={styles.chatInputArea}>
                <div style={styles.chatInputToolbar}>
                  <button style={styles.chatToolButton} title="Đính kèm file">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h5a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h-1l-4 5v4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6Z"/>
                    </svg>
                  </button>
                  <button style={styles.chatToolButton} title="Hình ảnh">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </button>
                  <button style={styles.chatToolButton} title="Emoji">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    placeholder={`Nhắn tin tới ${selectedContact.name}...`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    style={styles.chatMessageInput}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && messageInput.trim()) {
                        // Handle send message
                        setMessageInput('')
                      }
                    }}
                  />
                  <button 
                    style={styles.chatSendButton}
                    onClick={() => {
                      if (messageInput.trim()) {
                        // Handle send message
                        setMessageInput('')
                      }
                    }}
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
        )}

        {/* HR Management Modules - Chỉ những gì được phép */}
        {active === 'employees' && <EmployeesPage />}
        {active === 'departments' && <DepartmentsPage />}
        {active === 'positions' && <PositionsPage />}
        {active === 'contracts' && <ContractsPage />}
        {active === 'leaves' && <LeavesPage />}
        {active === 'evaluations' && <EvaluationsPage />}
        
        {/* ❌ KHÔNG có quyền: Payroll, Attendance Management (thuộc Accounting) */}

      </main>
    </div>
  )
}