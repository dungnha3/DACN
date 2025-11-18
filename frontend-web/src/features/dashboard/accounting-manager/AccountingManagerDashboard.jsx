import { useMemo, useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { styles } from './AccountingManagerDashboard.styles'
import { NavItem, RoleBadge, KPICard, StatusBadge, LeaveStatusBar, ApprovalStatusBadge } from './components/AccountingManagerDashboard.components'
import { kpiData, attendanceHistory, leaveRequests, notifications, sectionsConfig, pendingApprovals, chatContacts, chatMessages, payrollData, payrollSummary } from './components/AccountingManagerDashboard.constants'
import ProfilePage from '@/pages/profile/ProfilePage'

export default function AccountingManagerDashboard() {
  const [active, setActive] = useState('dashboard')
  const [approvals, setApprovals] = useState(pendingApprovals)
  const [selectedContact, setSelectedContact] = useState(chatContacts[0])
  const [messageInput, setMessageInput] = useState('')
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [payroll, setPayroll] = useState(payrollData)
  const [selectedMonth, setSelectedMonth] = useState('11/2025')
  const [isCalculating, setIsCalculating] = useState(false)
  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'Accounting Manager'
  const user = useMemo(() => ({ name: username || 'Nguyễn Thị F', role: 'Quản lý kế toán' }), [username])

  const sections = useMemo(() => sectionsConfig, [])
  const meta = sections[active]

  const handleLogout = async () => {
    await logout()
  }

  const handleApprove = (id) => {
    setApprovals(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'approved' } : item
    ))
    alert('Đã duyệt đơn thành công!')
  }

  const handleReject = (id) => {
    setApprovals(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'rejected' } : item
    ))
    alert('Đã từ chối đơn!')
  }

  const handleCheckInOut = () => {
    const now = new Date()
    const currentTime = now.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
    
    if (!isCheckedIn) {
      // Check in
      setIsCheckedIn(true)
      alert(`Đã chấm công vào lúc ${currentTime}`)
    } else {
      // Check out
      setIsCheckedIn(false)
      alert(`Đã chấm công ra lúc ${currentTime}`)
    }
  }

  const handleAutoCalculateSalary = async () => {
    setIsCalculating(true)
    
    // Simulate API call
    setTimeout(() => {
      setPayroll(prev => prev.map(emp => ({
        ...emp,
        status: emp.status === 'pending' ? 'calculated' : emp.status,
        calculatedDate: emp.status === 'pending' ? new Date().toLocaleDateString('vi-VN') : emp.calculatedDate
      })))
      setIsCalculating(false)
      alert('Đã tính lương tự động thành công cho tất cả nhân viên!')
    }, 2000)
  }

  const handleExportPayrollReport = () => {
    // Simulate export functionality
    const csvContent = [
      ['Mã NV', 'Tên nhân viên', 'Phòng ban', 'Lương cơ bản', 'Phụ cấp', 'Tăng ca', 'Khấu trừ', 'Tổng lương', 'Trạng thái'],
      ...payroll.map(emp => [
        emp.employeeId,
        emp.employeeName,
        emp.department,
        emp.baseSalary.toLocaleString('vi-VN'),
        emp.allowances.toLocaleString('vi-VN'),
        emp.overtime.toLocaleString('vi-VN'),
        emp.deductions.toLocaleString('vi-VN'),
        emp.totalSalary.toLocaleString('vi-VN'),
        emp.status === 'paid' ? 'Đã trả' : emp.status === 'calculated' ? 'Đã tính' : 'Chưa tính'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `BangLuong_${selectedMonth.replace('/', '_')}.csv`
    link.click()
    
    alert('Đã xuất báo cáo bảng lương thành công!')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

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
          <NavItem active={active === 'approvals'} onClick={() => setActive('approvals')} icon="✓">
            {sections.approvals.title}
          </NavItem>
          <NavItem active={active === 'payroll'} onClick={() => setActive('payroll')} icon="💰">
            {sections.payroll.title}
          </NavItem>
          <NavItem active={active === 'documents'} onClick={() => setActive('documents')} icon="📄">
            {sections.documents.title}
          </NavItem>
          <NavItem active={active === 'chat'} onClick={() => setActive('chat')} icon="💬">
            {sections.chat.title}
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
            {active !== 'chat' && <div style={styles.subHeading}>Xin chào, {user.name}</div>}
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
                    Hôm nay bạn có {pendingApprovals.filter(a => a.status === 'pending').length} đơn cần duyệt. 
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

        {/* Timesheet Page */}
        {active === 'timesheet' && (
          <div style={styles.pageContent}>
            <div style={styles.tableCard}>
              <div style={styles.tableHeader}>
                <h4 style={styles.tableTitle}>Lịch sử chấm công</h4>
                <button 
                  style={{
                    ...styles.checkInBtn,
                    background: isCheckedIn 
                      ? 'linear-gradient(195deg, #dc2626 0%, #991b1b 100%)' 
                      : 'linear-gradient(195deg, #059669 0%, #047857 100%)',
                    boxShadow: isCheckedIn 
                      ? '0 2px 10px rgba(220, 38, 38, 0.3)' 
                      : '0 2px 10px rgba(5, 150, 105, 0.3)'
                  }}
                  onClick={handleCheckInOut}
                >
                  {isCheckedIn ? '🚪 Chấm công ra' : '🕐 Chấm công vào'}
                </button>
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

        {/* Approvals Page - ACCOUNTING MANAGER FEATURE */}
        {active === 'approvals' && (
          <div style={styles.pageContent}>
            <div style={styles.tableCard}>
              <div style={styles.tableHeader}>
                <h4 style={styles.tableTitle}>Duyệt đơn từ nhân viên</h4>
              </div>
              
              {approvals.map((approval) => (
                <div key={approval.id} style={styles.approvalCard}>
                  <div style={styles.approvalHeader}>
                    <div>
                      <div style={styles.approvalEmployee}>{approval.employee}</div>
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
                      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
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
          </div>
        )}

        {/* Payroll Page */}
        {active === 'payroll' && (
          <div style={styles.pageContent}>
            {/* Summary Cards */}
            <div style={styles.kpiGrid}>
              <KPICard 
                title="Tổng nhân viên" 
                value={payrollSummary.totalEmployees} 
                icon="👥" 
                color="info" 
                change={`${payrollSummary.calculatedEmployees} đã tính`} 
              />
              <KPICard 
                title="Tổng lương tháng" 
                value={formatCurrency(payrollSummary.totalPayroll)} 
                icon="💰" 
                color="success" 
                change={`${payrollSummary.paidEmployees} đã trả`} 
              />
              <KPICard 
                title="Chờ xử lý" 
                value={payrollSummary.pendingEmployees} 
                icon="⏳" 
                color="warning" 
                change="cần tính lương" 
              />
            </div>

            {/* Action Buttons */}
            <div style={styles.payrollActions}>
              <div style={styles.monthSelector}>
                <label style={styles.monthLabel}>Tháng:</label>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={styles.monthSelect}
                >
                  <option value="11/2025">Tháng 11/2025</option>
                  <option value="10/2025">Tháng 10/2025</option>
                  <option value="09/2025">Tháng 9/2025</option>
                </select>
              </div>
              
              <div style={styles.actionButtons}>
                <button 
                  style={{
                    ...styles.autoCalculateBtn,
                    opacity: isCalculating ? 0.7 : 1,
                    cursor: isCalculating ? 'not-allowed' : 'pointer'
                  }}
                  onClick={handleAutoCalculateSalary}
                  disabled={isCalculating}
                >
                  {isCalculating ? '⏳ Đang tính...' : '🧮 Tính lương tự động'}
                </button>
                
                <button 
                  style={styles.exportBtn}
                  onClick={handleExportPayrollReport}
                >
                  📊 Xuất báo cáo lương
                </button>
              </div>
            </div>

            {/* Payroll Table */}
            <div style={styles.tableCard}>
              <div style={styles.tableHeader}>
                <h4 style={styles.tableTitle}>Bảng lương tháng {selectedMonth}</h4>
              </div>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Mã NV</th>
                      <th style={styles.th}>Tên nhân viên</th>
                      <th style={styles.th}>Phòng ban</th>
                      <th style={styles.th}>Lương cơ bản</th>
                      <th style={styles.th}>Phụ cấp</th>
                      <th style={styles.th}>Tăng ca</th>
                      <th style={styles.th}>Khấu trừ</th>
                      <th style={styles.th}>Tổng lương</th>
                      <th style={styles.th}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payroll.map((employee) => (
                      <tr key={employee.id} style={styles.tr}>
                        <td style={styles.td}>{employee.employeeId}</td>
                        <td style={styles.td}>
                          <div style={styles.employeeCell}>
                            <div style={styles.employeeName}>{employee.employeeName}</div>
                            <div style={styles.employeePosition}>{employee.position}</div>
                          </div>
                        </td>
                        <td style={styles.td}>{employee.department}</td>
                        <td style={styles.td}>{formatCurrency(employee.baseSalary)}</td>
                        <td style={styles.td}>{formatCurrency(employee.allowances)}</td>
                        <td style={styles.td}>{formatCurrency(employee.overtime)}</td>
                        <td style={styles.td}>{formatCurrency(employee.deductions)}</td>
                        <td style={styles.td}>
                          <div style={styles.totalSalaryCell}>
                            {formatCurrency(employee.totalSalary)}
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.payrollStatusBadge,
                            background: employee.status === 'paid' 
                              ? 'linear-gradient(145deg, #10b981, #059669)' 
                              : employee.status === 'calculated'
                              ? 'linear-gradient(145deg, #3b82f6, #2563eb)'
                              : 'linear-gradient(145deg, #f59e0b, #d97706)',
                            color: '#ffffff'
                          }}>
                            {employee.status === 'paid' ? '✓ Đã trả' : 
                             employee.status === 'calculated' ? '📊 Đã tính' : '⏳ Chưa tính'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Profile Page */}
        {active === 'profile' && <ProfilePage />}

        {/* Other Pages Placeholder */}
        {(active === 'documents') && (
          <div style={styles.pageContent}>
            <div style={styles.placeholderCard}>
              <div style={styles.placeholderIcon}>
                {'📄'}
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
