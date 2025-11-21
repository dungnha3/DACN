import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePermissions, useErrorHandler } from '@/shared/hooks'
import { styles } from './AccountingManagerDashboard.styles'
import { NavItem, RoleBadge, KPICard, ApprovalStatusBadge } from './components/AccountingManagerDashboard.components'
import { kpiData, notifications, sectionsConfig, chatContacts, chatMessages } from './components/AccountingManagerDashboard.constants'
import { leavesService } from '@/features/hr/shared/services/leaves.service'
import { PayrollManagementPage, AttendanceManagementPage, LeaveApprovalsPage } from '@/modules/accounting'

export default function AccountingManagerDashboard() {
  const [active, setActive] = useState('dashboard')
  const [approvals, setApprovals] = useState([])
  const [selectedContact, setSelectedContact] = useState(chatContacts[0])
  const [messageInput, setMessageInput] = useState('')
  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'Accounting Manager'
  const user = useMemo(() => ({ name: username || 'Nguyễn Thị F', role: 'Quản lý kế toán' }), [username])

  const sections = useMemo(() => sectionsConfig, [])
  const meta = sections[active]
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
      console.warn('Failed to load approvals:', err)
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
        </div>

        <div style={styles.navGroup}>
          <div style={styles.navGroupLabel}>Quản lý tài chính</div>
          <NavItem active={active === 'payroll'} onClick={() => setActive('payroll')} icon="💰">
            Bảng lương
          </NavItem>
          <NavItem active={active === 'timesheet'} onClick={() => setActive('timesheet')} icon="🕐">
            Quản lý chấm công
          </NavItem>
          <NavItem active={active === 'approvals'} onClick={() => setActive('approvals')} icon="✓">
            Duyệt nghỉ phép (Step 2)
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

        {/* Approvals Page - Step 2 */}
        {/* Leave Approvals - Step 2 */}
        {active === 'approvals' && <LeaveApprovalsPage />}

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

        {/* Payroll Management */}
        {active === 'payroll' && <PayrollManagementPage />}

        {/* Other Pages Placeholder */}
        {(active === 'profile' || active === 'documents') && (
          <div style={styles.pageContent}>
            <div style={styles.placeholderCard}>
              <div style={styles.placeholderIcon}>
                {active === 'profile' ? '👤' : '📄'}
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
