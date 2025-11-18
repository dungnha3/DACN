import { useMemo, useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { styles } from './HrManagerDashboard.styles'
import { NavItem, RoleBadge, KPICard, StatusBadge, LeaveStatusBar, ApprovalStatusBadge } from './components/HrManagerDashboard.components'
import { 
  kpiData, 
  attendanceHistory, 
  leaveRequests, 
  notifications, 
  sectionsConfig, 
  pendingApprovals, 
  chatContacts, 
  chatMessages 
} from './components/HrManagerDashboard.constants'
import { 
  EmployeesPage, 
  AttendancePage, 
  PayrollPage, 
  LeavesPage, 
  DepartmentsPage, 
  ContractsPage, 
  PositionsPage, 
  EvaluationsPage, 
  HRDashboardPage 
} from '@/features/hr'

// --- THƯ VIỆN BIỂU ĐỒ ---
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function HrManagerDashboard() {
  const [active, setActive] = useState('dashboard')
  const [approvals, setApprovals] = useState(pendingApprovals)
  
  // --- DỮ LIỆU GIẢ CHO BIỂU ĐỒ & WIDGET (MOCK DATA) ---
  const mockChartData = [
    { name: 'IT', hours: 1250 },
    { name: 'HR', hours: 450 },
    { name: 'Sales', hours: 980 },
    { name: 'Marketing', hours: 800 },
    { name: 'Accounting', hours: 600 },
  ];

  const mockExpiringContracts = [
    { id: 1, name: 'Lê Văn C', role: 'Tech Lead', date: '25/11/2025' },
    { id: 2, name: 'Phạm Thị D', role: 'Accountant', date: '01/12/2025' },
    { id: 3, name: 'Nguyễn Văn A', role: 'Developer', date: '15/12/2025' },
  ];
  // ----------------------------------------------------

  const [selectedContact, setSelectedContact] = useState(chatContacts[0])
  const [messageInput, setMessageInput] = useState('')
  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'HR Manager'
  const user = useMemo(() => ({ name: username || 'Nguyễn Thị C', role: 'Quản lý nhân sự' }), [username])

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
          <div style={styles.navGroupLabel}>Chấm công & Lương</div>
          <NavItem active={active === 'attendance'} onClick={() => setActive('attendance')} icon="🕐">
            Chấm công
          </NavItem>
          <NavItem active={active === 'payroll'} onClick={() => setActive('payroll')} icon="💰">
            Bảng lương
          </NavItem>
          <NavItem active={active === 'leaves'} onClick={() => setActive('leaves')} icon="📋">
            Nghỉ phép
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
        {!['employees', 'attendance', 'payroll', 'leaves', 'departments', 'contracts', 'positions', 'evaluations'].includes(active) && (
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
                value={`${mockExpiringContracts.length} HĐ`} 
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
                  {mockExpiringContracts.map((contract, idx) => (
                    <div key={idx} style={styles.notificationItem}>
                      <div style={{...styles.notifIcon, fontSize: 16}}>📄</div>
                      <div style={styles.notifContent}>
                        <div style={styles.notifTitle}>{contract.name} <span style={{fontWeight: 'normal', fontSize: 12, color: '#7b809a'}}>({contract.role})</span></div>
                        <div style={styles.notifDesc}>Hết hạn: {contract.date}</div>
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
                    <BarChart data={mockChartData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip 
                        cursor={{fill: 'transparent'}} 
                        contentStyle={{borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                      />
                      <Bar dataKey="hours" name="Tổng giờ làm" radius={[4, 4, 0, 0]} barSize={40}>
                        {mockChartData.map((entry, index) => (
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
            <div style={styles.chatSidebar}>
              <div style={styles.chatSidebarHeader}>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..." 
                  style={styles.chatSearchInput}
                />
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
                    <div style={styles.chatContactAvatar}>{contact.avatar}</div>
                    <div style={styles.chatContactInfo}>
                      <div style={styles.chatContactName}>{contact.name}</div>
                      <div style={styles.chatContactMessage}>{contact.lastMessage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.chatWindow}>
               <div style={styles.chatWindowHeader}>
                  <div style={styles.chatWindowName}>{selectedContact.name}</div>
               </div>
               <div style={styles.chatMessagesArea}>
                  {chatMessages.map(msg => (
                    <div key={msg.id} style={{
                      ...styles.chatMessageRow,
                      ...(msg.isOwn ? styles.chatMessageRowOwn : {})
                    }}>
                      <div style={{
                        ...styles.chatMessageBubble,
                        ...(msg.isOwn ? styles.chatMessageBubbleOwn : {})
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
               </div>
               <div style={styles.chatInputArea}>
                  <div style={styles.chatInputWrapper}>
                    <input 
                      style={styles.chatMessageInput} 
                      placeholder="Nhập tin nhắn..."
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                    />
                    <button style={styles.chatSendButton}>➤</button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* HR Management Modules - Import từ components con */}
        {active === 'employees' && <EmployeesPage />}
        {active === 'departments' && <DepartmentsPage />}
        {active === 'positions' && <PositionsPage />}
        {active === 'contracts' && <ContractsPage />}
        {active === 'attendance' && <AttendancePage />}
        {active === 'payroll' && <PayrollPage />}
        {active === 'leaves' && <LeavesPage />}
        {active === 'evaluations' && <EvaluationsPage />}

      </main>
    </div>
  )
}