import { useMemo, useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { styles } from './ProjectManagerDashboard.styles'
import { NavItem, RoleBadge, KPICard, StatusBadge, LeaveStatusBar, ApprovalStatusBadge, MemberAvatar, RoleBadgeProject } from './components/ProjectManagerDashboard.components'
import { 
  kpiData, attendanceHistory, leaveRequests, notifications, sectionsConfig, pendingApprovals, 
  mockProjects, mockIssues, mockStorageItems, mockSprints, mockProjectMembers, mockActivities, projectsListData, projectTasksData 
} from './components/ProjectManagerDashboard.constants'
import { chatContacts, chatMessages } from '../employee/components/EmployeeDashboard.constants'

export default function ProjectManagerDashboard() {
  const [active, setActive] = useState('dashboard')
  const [projectMainTab, setProjectMainTab] = useState('issues') // issues, projects - 2 tab chính
  const [projectTab, setProjectTab] = useState('management') // management, issues, storage (cho tab projects)
  const [projectSubTab, setProjectSubTab] = useState('backlog') // backlog, sprints, members, activity
  const [tasksViewTab, setTasksViewTab] = useState('list') // list, deadline, calendar - tab nhỏ trong "Tác vụ"
  const [approvals, setApprovals] = useState(pendingApprovals)
  const [selectedContact, setSelectedContact] = useState(chatContacts?.[0] || null)
  const [messageInput, setMessageInput] = useState('')
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null) // Dự án được chọn để xem chi tiết
  
  // State cho lịch
  const [calendarDate, setCalendarDate] = useState(new Date(2025, 10, 18)) // Nov 18, 2025
  
  // Kanban board state cho tab Hạn chót
  const [kanbanTasks, setKanbanTasks] = useState({
    overdue: [
      // Quá hạn (Overdue) - không có tác vụ
    ],
    today: [
      // Hạn hôm nay (Due Today) - không có tác vụ
    ],
    thisWeek: [
      { id: 1, title: 'test1 cv1', dueDate: '22 tháng 11, 7:00 pm', assignees: 2, date: new Date(2025, 10, 22) },
      { id: 2, title: 'asd', dueDate: '22 tháng 11, 7:00 pm', assignees: 2, date: new Date(2025, 10, 22) }
    ],
    nextWeek: [
      // Hạn tuần sau (Due Next Week)
    ],
    noDeadline: [
      // Không có hạn chót (No Deadline)
    ]
  })
  
  // STATE MỚI: Quản lý dự án đang được chọn
  const [allProjects, setAllProjects] = useState(mockProjects)
  const [selectedProjectId, setSelectedProjectId] = useState(allProjects[0]?.id || null)

  const { logout, user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'Project Manager'
  const user = useMemo(() => ({ name: username || 'Trần Thị B', role: 'Quản lý dự án' }), [username])

  const sections = useMemo(() => sectionsConfig, [])
  const meta = sections[active]

  // Hàm chọn dự án (từ Tab 1) và tự động chuyển tab
  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId)
    setProjectTab('issues') // Tự động chuyển sang tab "Quản lý Vấn đề"
    setProjectSubTab('backlog') // Mặc định vào Backlog
  }

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
    const currentTime = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
    if (!isCheckedIn) {
      setIsCheckedIn(true)
      alert(`Đã chấm công vào lúc ${currentTime}`)
    } else {
      setIsCheckedIn(false)
      alert(`Đã chấm công ra lúc ${currentTime}`)
    }
  }
  
  // Helper render badge cho Issue Priority
  const IssuePriorityBadge = ({ priority }) => {
    const priorities = {
      'Cao nhất': { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
      'Cao': { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
      'Trung bình': { bg: '#dbeafe', color: '#1e3a8a', border: '#93c5fd' },
      'Thấp': { bg: '#e5e7eb', color: '#374151', border: '#d1d5db' }
    }
    const p = priorities[priority] || priorities['Thấp']
    return (
      <div style={{ ...styles.statusBadge, background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>
        {priority}
      </div>
    )
  }
  
  // Helper render badge cho Issue Status
  const IssueStatusBadge = ({ status }) => {
    const statuses = {
      'Mở': { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
      'Đang xử lý': { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
      'Đã đóng': { bg: '#dbeafe', color: '#1e3a8a', border: '#93c5fd' }
    }
    const s = statuses[status] || statuses['Mở']
    return (
      <div style={{ ...styles.statusBadge, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
        {status}
      </div>
    )
  }

  // Component mới: Thanh chọn dự án
  const ProjectSelectorBar = () => (
    <div style={styles.projectSelectorBar}>
      <div>
        <label style={styles.projectSelectorLabel} htmlFor="project-select">Dự án đang xem:</label>
        <select 
          id="project-select"
          style={styles.projectSelector}
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(Number(e.target.value))}
        >
          {allProjects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>
      {/* Bạn có thể thêm các nút tổng quan của dự án ở đây */}
    </div>
  )

  // Component mới: Nội dung cho tab con
  const renderProjectSubContent = () => {
    if (!selectedProjectId) {
      return (
        <div style={styles.placeholderCard}>
          <div style={styles.placeholderIcon}>🏗️</div>
          <h3 style={styles.placeholderTitle}>Chưa chọn dự án</h3>
          <p style={styles.placeholderText}>
            Vui lòng vào tab "Quản lý dự án" và chọn một dự án để xem,
            hoặc chọn từ danh sách thả xuống ở trên.
          </p>
        </div>
      )
    }

    // Render dựa trên projectSubTab state
    switch (projectSubTab) {
      case 'backlog':
        return (
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <h4 style={styles.tableTitle}>Backlog (Tất cả Vấn đề)</h4>
              <button style={styles.addBtn}>+ Tạo Vấn đề</button>
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Tiêu đề</th>
                    <th style={styles.th}>Độ ưu tiên</th>
                    <th style={styles.th}>Trạng thái</th>
                    <th style={styles.th}>Người xử lý</th>
                  </tr>
                </thead>
                <tbody>
                  {mockIssues.map(issue => (
                    <tr key={issue.id} style={styles.tr}>
                      <td style={styles.td}>{issue.id}</td>
                      <td style={styles.td}>{issue.title}</td>
                      <td style={styles.td}><IssuePriorityBadge priority={issue.priority} /></td>
                      <td style={styles.td}><IssueStatusBadge status={issue.status} /></td>
                      <td style={styles.td}>{issue.assignee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      case 'sprints':
        return (
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <h4 style={styles.tableTitle}>Quản lý Sprints</h4>
              <button style={styles.addBtn}>+ Tạo Sprint mới</button>
            </div>
            {mockSprints.map(sprint => (
              <div key={sprint.id} style={styles.sprintCard}>
                <div style={styles.sprintHeader}>
                  <div>
                    <div style={styles.sprintName}>{sprint.name}</div>
                    <div style={styles.sprintDates}>{sprint.startDate} - {sprint.endDate}</div>
                  </div>
                  <div style={styles.sprintActions}>
                    {sprint.status === 'Chưa bắt đầu' && (
                      <button style={styles.sprintButton}>Bắt đầu Sprint</button>
                    )}
                    {sprint.status === 'Đang tiến hành' && (
                      <button style={{...styles.sprintButton, background: '#dc2626'}}>Hoàn thành Sprint</button>
                    )}
                    <span style={{...styles.projectCardStatus(sprint.status), margin: 'auto 0'}}>{sprint.status}</span>
                  </div>
                </div>
                <div style={{fontSize: 14, color: '#344767'}}>
                  <strong>{sprint.issues} issues</strong> trong sprint này.
                </div>
              </div>
            ))}
          </div>
        )
      case 'members':
        return (
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <h4 style={styles.tableTitle}>Thành viên Dự án</h4>
              <button style={styles.addBtn}>+ Thêm Thành viên</button>
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Tên</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Vai trò (Role)</th>
                    <th style={styles.th}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProjectMembers.map(member => (
                    <tr key={member.id} style={styles.tr}>
                      <td style={styles.td}>{member.name}</td>
                      <td style={styles.td}>{member.email}</td>
                      <td style={styles.td}>{member.role}</td>
                      <td style={styles.td}>
                        <button style={{...styles.sprintButton, fontSize: 12, padding: '6px 12px'}}>Sửa Role</button>
                        <button style={{...styles.rejectBtn, fontSize: 12, padding: '6px 12px', marginLeft: 8}}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      case 'activity':
        return (
          <div style={styles.tableCard}>
            <h4 style={styles.tableTitle}>Hoạt động Dự án</h4>
            <div style={styles.activityFeed}>
              {mockActivities.map(act => (
                <div key={act.id} style={styles.activityItem}>
                  <div style={styles.activityAvatar}>{act.user.slice(0,1)}</div>
                  {/* Div này đã được sửa lỗi trong file styles.js */}
                  <div style={styles.activityContent}>
                    <span style={{fontWeight: 700}}>{act.user}</span> {act.action} <span style={{fontWeight: 700, color: '#1e3a8a'}}>{act.target}</span>
                    <div style={styles.activityTime}>{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div style={styles.appShell}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>⚡</div>
          <div>
            <div style={styles.brandName}>QLNS Project Manager</div>
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
          <NavItem active={active === 'approvals'} onClick={() => setActive('approvals')} icon="✓">
            {sections.approvals.title}
          </NavItem>
          <NavItem active={active === 'payroll'} onClick={() => setActive('payroll')} icon="💰">
            {sections.payroll.title}
          </NavItem>
          <NavItem active={active === 'documents'} onClick={() => setActive('documents')} icon="📄">
            {sections.documents.title}
          </NavItem>

          {/* NAV ITEM DỰ ÁN */}
          <NavItem active={active === 'projects'} onClick={() => setActive('projects')} icon="🏗️">
            {sections.projects.title}
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
            <div style={styles.pageHeading}>{meta.pageTitle || meta.title}</div>
            {active !== 'chat' && <div style={styles.subHeading}>{meta.subtitle}</div>}
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
              <KPICard title="Số nhân viên" value={`${kpiData.teamSize} người`} icon="👥" color="success" change="+2 người" />
              <KPICard title="Đơn chờ duyệt" value={`${kpiData.pendingLeaves} đơn`} icon="⏳" color="warning" change="Cần xử lý" />
              <KPICard title="Đã duyệt hôm nay" value={`${kpiData.approvedToday} đơn`} icon="✓" color="info" change="+2 đơn" />
              <KPICard title="Tổng đơn tháng" value={`${kpiData.totalRequests} đơn`} icon="📊" color="primary" change="+5 đơn" />
            </div>

            {/* Welcome & Notifications Row */}
            <div style={styles.cardsRow}>
              <div style={styles.welcomeCard}>
                <div style={styles.welcomeContent}>
                  <h3 style={styles.welcomeTitle}>Chào mừng, {user.name}!</h3>
                  <p style={styles.welcomeText}>
                    Bạn có {kpiData.pendingLeaves} đơn nghỉ phép đang chờ duyệt. Hãy xem xét và phê duyệt để nhân viên có thể sắp xếp công việc.
                  </p>
                  <button style={styles.checkInBtn} onClick={() => setActive('approvals')}>
                    ✓ Xem đơn chờ duyệt
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
                <h4 style={styles.cardTitle}>Biểu đồ chấm công nhóm</h4>
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
                <button
                  onClick={handleCheckInOut}
                  style={{
                    ...styles.checkInBtn,
                    background: isCheckedIn
                      ? 'linear-gradient(195deg, #6b7280 0%, #4b5563 100%)'
                      : styles.checkInBtn.background,
                    opacity: 1
                  }}
                >
                  {isCheckedIn ? '⏹ Chấm công ra' : '🟢 Chấm công'}
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

        {/* Approvals Page - NEW FEATURE FOR PROJECT MANAGER */}
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

        {/* START: PROJECT PAGE (REDESIGNED WITH 2 MAIN TABS) */}
        {active === 'projects' && !selectedProject && (
          <div style={styles.pageContent}>
            {/* Project Main Tab Navigation - Tác vụ vs Dự án */}
            <div style={styles.projectTabContainer}>
              <button 
                style={projectMainTab === 'issues' ? { ...styles.projectTabButton, ...styles.projectTabButtonActive } : styles.projectTabButton}
                onClick={() => setProjectMainTab('issues')}
              >
                ✅ Tác vụ
              </button>
              <button 
                style={projectMainTab === 'projects' ? { ...styles.projectTabButton, ...styles.projectTabButtonActive } : styles.projectTabButton}
                onClick={() => setProjectMainTab('projects')}
              >
                🏗️ Dự án 
              </button>
            </div>

            {/* Main Tab Content */}
            <div style={styles.projectTabContent}>
              
              {/* Main Tab 1: Tác vụ - Các công việc của tôi (Issues) */}
              {projectMainTab === 'issues' && (
                <>
                  {/* Header: Tác vụ của tôi */}
                  <div style={{marginBottom: '24px'}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
                      <h2 style={{fontSize: '24px', fontWeight: '700', color: '#344767', margin: 0}}>Tác vụ của tôi</h2>
                      <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                        <button style={{background: 'linear-gradient(195deg, #66bb6a 0%, #43a047 100%)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'}}>
                          ➕ Tạo
                        </button>
                        <button style={{background: 'rgba(0,0,0,0.05)', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer'}}>
                          Tất cả vai trò
                        </button>
                        <button style={{background: 'rgba(0,0,0,0.05)', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '24px', cursor: 'pointer'}}>
                          ⚙️
                        </button>
                      </div>
                    </div>

                    {/* Search and filter bar */}
                    <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                      <div style={{flex: 1, position: 'relative'}}>
                        <input 
                          type="text" 
                          placeholder="Lọc và tìm kiếm" 
                          style={{
                            width: '100%',
                            padding: '10px 16px 10px 40px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontFamily: 'inherit'
                          }}
                        />
                        <span style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999'}}>🔍</span>
                      </div>
                    </div>
                  </div>

                  {/* Tasks View Tab Navigation - Danh sách, Hạn chót, Lịch */}
                  <div style={{display: 'flex', gap: '16px', borderBottom: '1px solid #e0e0e0', marginBottom: '20px', paddingBottom: '0'}}>
                    <button 
                      style={{
                        padding: '12px 16px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: tasksViewTab === 'list' ? '600' : '400',
                        color: tasksViewTab === 'list' ? '#1e3a8a' : '#666',
                        borderBottom: tasksViewTab === 'list' ? '3px solid #1e3a8a' : 'none',
                        marginBottom: '-1px'
                      }}
                      onClick={() => setTasksViewTab('list')}
                    >
                      Danh sách
                    </button>
                    <button 
                      style={{
                        padding: '12px 16px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: tasksViewTab === 'deadline' ? '600' : '400',
                        color: tasksViewTab === 'deadline' ? '#1e3a8a' : '#666',
                        borderBottom: tasksViewTab === 'deadline' ? '3px solid #1e3a8a' : 'none',
                        marginBottom: '-1px'
                      }}
                      onClick={() => setTasksViewTab('deadline')}
                    >
                      Hạn chót
                    </button>
                    <button 
                      style={{
                        padding: '12px 16px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: tasksViewTab === 'calendar' ? '600' : '400',
                        color: tasksViewTab === 'calendar' ? '#1e3a8a' : '#666',
                        borderBottom: tasksViewTab === 'calendar' ? '3px solid #1e3a8a' : 'none',
                        marginBottom: '-1px'
                      }}
                      onClick={() => setTasksViewTab('calendar')}
                    >
                      Lịch
                    </button>
                  </div>

                  {/* Content based on tasksViewTab */}
                  {tasksViewTab === 'list' && (
                    <div style={styles.tableCard}>
                      <div style={styles.tableWrap}>
                        <table style={styles.table}>
                          <thead>
                            <tr>
                              <th style={{...styles.th, width: '40px'}}>
                                <input type="checkbox" style={{cursor: 'pointer'}} />
                              </th>
                              <th style={styles.th}>Tên</th>
                              <th style={styles.th}>Hoạt động</th>
                              <th style={styles.th}>Hạn chót</th>
                              <th style={styles.th}>Người tạo</th>
                              <th style={styles.th}>Người được phân công</th>
                              <th style={styles.th}>Dự án</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockIssues.map(issue => (
                              <tr key={issue.id} style={styles.tr}>
                                <td style={{...styles.td, width: '40px', textAlign: 'center'}}>
                                  <input type="checkbox" style={{cursor: 'pointer'}} />
                                </td>
                                <td style={styles.td}>
                                  <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}>
                                    📌 {issue.title}
                                  </span>
                                </td>
                                <td style={styles.td}>{issue.lastUpdate || '17 tháng 11, 10:11 pm'}</td>
                                <td style={{...styles.td, color: '#dc2626', fontWeight: '500'}}>{issue.dueDate || '22 tháng 11, 7:00 pm'}</td>
                                <td style={styles.td}>
                                  <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}>
                                    👤 {issue.reporter || 'Nguyễn Nhân'}
                                  </span>
                                </td>
                                <td style={styles.td}>
                                  <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}>
                                    👤 {issue.assignee || 'Nhật Nguyễn Nhật Trư...'}
                                  </span>
                                </td>
                                <td style={styles.td}>
                                  <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}>
                                    📁 Test
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Pagination info */}
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', color: '#666', fontSize: '13px', borderTop: '1px solid #e0e0e0', marginTop: '16px', paddingTop: '16px'}}>
                        <div>ĐÃ CHỌN: 0 / 2</div>
                        <div>TỔNG: <span style={{color: '#1e3a8a', fontWeight: '600'}}>HIỆN THỊ</span></div>
                        <div>TRANG: 1</div>
                        <div style={{display: 'flex', gap: '12px', marginLeft: 'auto'}}>
                          <select style={{padding: '6px 12px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '12px', cursor: 'pointer'}}>
                            <option>50</option>
                            <option>100</option>
                            <option>200</option>
                          </select>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{display: 'flex', gap: '12px', marginTop: '12px'}}>
                        <button style={{padding: '10px 16px', background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px'}}>
                          CHỌN HÀNH ĐỘNG
                        </button>
                        <button style={{padding: '10px 16px', background: 'linear-gradient(195deg, #66bb6a 0%, #43a047 100%)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'}}>
                          ÁP DỤNG
                        </button>
                        <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginLeft: '12px'}}>
                          <input type="checkbox" style={{cursor: 'pointer'}} />
                          <span style={{fontSize: '13px'}}>DANH CHO TẤT CẢ</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {tasksViewTab === 'deadline' && (
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '16px 0'}}>
                      {/* Column 1: Quá hạn */}
                      <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{
                          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                          color: '#fff',
                          padding: '12px 16px',
                          borderRadius: '8px 8px 0 0',
                          fontWeight: '600',
                          fontSize: '14px',
                          marginBottom: '8px'
                        }}>
                          Quá hạn ({kanbanTasks.overdue.length})
                        </div>
                        <div style={{
                          flex: 1,
                          borderLeft: '3px dashed #ddd',
                          borderRight: '1px solid #eee',
                          borderBottom: '1px solid #eee',
                          borderRadius: '0 0 8px 8px',
                          padding: '12px',
                          minHeight: '300px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          backgroundColor: 'rgba(255, 107, 107, 0.03)'
                        }}>
                          {kanbanTasks.overdue.map(task => (
                            <div key={task.id} style={{
                              background: '#fff',
                              border: '1px solid #eee',
                              borderRadius: '8px',
                              padding: '12px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                              cursor: 'grab'
                            }}>
                              <div style={{fontWeight: '500', fontSize: '14px', marginBottom: '6px'}}>{task.title}</div>
                              <div style={{fontSize: '12px', color: '#0095cc', marginBottom: '8px'}}>{task.dueDate}</div>
                              <div style={{display: 'flex', gap: '4px'}}>
                                {Array(task.assignees).fill(0).map((_, i) => (
                                  <div key={i} style={{width: '24px', height: '24px', borderRadius: '50%', background: '#999', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold'}}>👤</div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 2: Hạn hôm nay */}
                      <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{
                          background: 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)',
                          color: '#fff',
                          padding: '12px 16px',
                          borderRadius: '8px 8px 0 0',
                          fontWeight: '600',
                          fontSize: '14px',
                          marginBottom: '8px'
                        }}>
                          Hạn hôm nay ({kanbanTasks.today.length})
                        </div>
                        <div style={{
                          flex: 1,
                          borderLeft: '3px dashed #ddd',
                          borderRight: '1px solid #eee',
                          borderBottom: '1px solid #eee',
                          borderRadius: '0 0 8px 8px',
                          padding: '12px',
                          minHeight: '300px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          backgroundColor: 'rgba(102, 187, 106, 0.03)'
                        }}>
                          {kanbanTasks.today.map(task => (
                            <div key={task.id} style={{
                              background: '#fff',
                              border: '1px solid #eee',
                              borderRadius: '8px',
                              padding: '12px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                              cursor: 'grab'
                            }}>
                              <div style={{fontWeight: '500', fontSize: '14px', marginBottom: '6px'}}>{task.title}</div>
                              <div style={{fontSize: '12px', color: '#0095cc', marginBottom: '8px'}}>{task.dueDate}</div>
                              <div style={{display: 'flex', gap: '4px'}}>
                                {Array(task.assignees).fill(0).map((_, i) => (
                                  <div key={i} style={{width: '24px', height: '24px', borderRadius: '50%', background: '#999', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold'}}>👤</div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 3: Hạn tuần này */}
                      <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{
                          background: 'linear-gradient(135deg, #29b6f6 0%, #0288d1 100%)',
                          color: '#fff',
                          padding: '12px 16px',
                          borderRadius: '8px 8px 0 0',
                          fontWeight: '600',
                          fontSize: '14px',
                          marginBottom: '8px'
                        }}>
                          Hạn tuần này ({kanbanTasks.thisWeek.length})
                        </div>
                        <div style={{
                          flex: 1,
                          borderLeft: '3px dashed #ddd',
                          borderRight: '1px solid #eee',
                          borderBottom: '1px solid #eee',
                          borderRadius: '0 0 8px 8px',
                          padding: '12px',
                          minHeight: '300px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          backgroundColor: 'rgba(41, 182, 246, 0.03)',
                          overflowY: 'auto'
                        }}>
                          {kanbanTasks.thisWeek.map(task => (
                            <div key={task.id} style={{
                              background: '#fff',
                              border: '1px solid #eee',
                              borderRadius: '8px',
                              padding: '12px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                              cursor: 'grab'
                            }}>
                              <div style={{fontWeight: '500', fontSize: '14px', marginBottom: '6px'}}>{task.title}</div>
                              <div style={{fontSize: '12px', color: '#0095cc', marginBottom: '8px'}}>{task.dueDate}</div>
                              <div style={{display: 'flex', gap: '4px'}}>
                                {Array(task.assignees).fill(0).map((_, i) => (
                                  <div key={i} style={{width: '24px', height: '24px', borderRadius: '50%', background: '#999', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold'}}>👤</div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 4: Hạn tuần sau */}
                      <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{
                          background: 'linear-gradient(135deg, #4dd0e1 0%, #00838f 100%)',
                          color: '#fff',
                          padding: '12px 16px',
                          borderRadius: '8px 8px 0 0',
                          fontWeight: '600',
                          fontSize: '14px',
                          marginBottom: '8px'
                        }}>
                          Hạn tuần sau ({kanbanTasks.nextWeek.length})
                        </div>
                        <div style={{
                          flex: 1,
                          borderLeft: '3px dashed #ddd',
                          borderRight: '1px solid #eee',
                          borderBottom: '1px solid #eee',
                          borderRadius: '0 0 8px 8px',
                          padding: '12px',
                          minHeight: '300px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          backgroundColor: 'rgba(77, 208, 225, 0.03)'
                        }}>
                          {kanbanTasks.nextWeek.map(task => (
                            <div key={task.id} style={{
                              background: '#fff',
                              border: '1px solid #eee',
                              borderRadius: '8px',
                              padding: '12px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                              cursor: 'grab'
                            }}>
                              <div style={{fontWeight: '500', fontSize: '14px', marginBottom: '6px'}}>{task.title}</div>
                              <div style={{fontSize: '12px', color: '#0095cc', marginBottom: '8px'}}>{task.dueDate}</div>
                              <div style={{display: 'flex', gap: '4px'}}>
                                {Array(task.assignees).fill(0).map((_, i) => (
                                  <div key={i} style={{width: '24px', height: '24px', borderRadius: '50%', background: '#999', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold'}}>👤</div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {tasksViewTab === 'calendar' && (
                    <div style={styles.calendarContainer}>
                      {/* Header với navigation */}
                      <div style={styles.calendarHeader}>
                        <button
                          onClick={() => {
                            const newDate = new Date(calendarDate)
                            newDate.setMonth(newDate.getMonth() - 1)
                            setCalendarDate(newDate)
                          }}
                          style={styles.monthNavButton}
                        >
                          &lt; Tháng trước
                        </button>
                        <h3 style={{ margin: '0', fontSize: '18px', fontWeight: 600 }}>
                          {calendarDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button
                          onClick={() => {
                            const newDate = new Date(calendarDate)
                            newDate.setMonth(newDate.getMonth() + 1)
                            setCalendarDate(newDate)
                          }}
                          style={styles.monthNavButton}
                        >
                          Tháng sau &gt;
                        </button>
                      </div>

                      {/* Dòng tiêu đề thứ */}
                      <div style={styles.calendarDayHeader}>
                        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                          <div key={day} style={styles.calendarDayHeaderCell}>
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Lưới lịch */}
                      <div style={styles.calendarGrid}>
                        {(() => {
                          const year = calendarDate.getFullYear()
                          const month = calendarDate.getMonth()
                          const firstDay = new Date(year, month, 1).getDay()
                          const daysInMonth = new Date(year, month + 1, 0).getDate()
                          const days = []

                          // Thêm ô trống cho ngày của tháng trước
                          for (let i = 0; i < firstDay; i++) {
                            days.push(null)
                          }

                          // Thêm tất cả ngày của tháng
                          for (let i = 1; i <= daysInMonth; i++) {
                            days.push(i)
                          }

                          // Render
                          return days.map((day, index) => {
                            if (day === null) {
                              return (
                                <div
                                  key={`empty-${index}`}
                                  style={{
                                    ...styles.calendarDayCell,
                                    backgroundColor: '#f5f5f5',
                                    opacity: 0.5
                                  }}
                                />
                              )
                            }

                            // Kiểm tra ngày hiện tại có tác vụ không
                            const currentDate = new Date(year, month, day)
                            const tasksOnDate = kanbanTasks.thisWeek.filter((task) => {
                              if (!task.date) return false
                              return (
                                task.date.getFullYear() === year &&
                                task.date.getMonth() === month &&
                                task.date.getDate() === day
                              )
                            })

                            const isToday =
                              day === new Date().getDate() &&
                              month === new Date().getMonth() &&
                              year === new Date().getFullYear()

                            return (
                              <div
                                key={day}
                                style={{
                                  ...styles.calendarDayCell,
                                  backgroundColor: isToday ? '#e8f5e9' : 'white',
                                  border: isToday ? '2px solid #4caf50' : '1px solid #e0e0e0',
                                  position: 'relative',
                                  overflow: 'hidden'
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: isToday ? 600 : 500,
                                    marginBottom: '4px',
                                    color: isToday ? '#2e7d32' : '#333'
                                  }}
                                >
                                  {day}
                                </div>
                                {tasksOnDate.length > 0 && (
                                  <div
                                    style={{
                                      fontSize: '11px',
                                      lineHeight: '1.2'
                                    }}
                                  >
                                    {tasksOnDate.slice(0, 2).map((task) => (
                                      <div
                                        key={task.id}
                                        style={{
                                          backgroundColor: '#ff6f00',
                                          color: 'white',
                                          padding: '2px 4px',
                                          borderRadius: '3px',
                                          marginBottom: '2px',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          fontSize: '10px'
                                        }}
                                        title={task.title}
                                      >
                                        {task.title}
                                      </div>
                                    ))}
                                    {tasksOnDate.length > 2 && (
                                      <div
                                        style={{
                                          fontSize: '9px',
                                          color: '#ff6f00',
                                          fontWeight: 'bold'
                                        }}
                                      >
                                        +{tasksOnDate.length - 2} khác
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })
                        })()}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Main Tab 2: Dự án - Các dự án của tôi */}
              {projectMainTab === 'projects' && (
                <>
                  {/* Header with filter tabs */}
                  <div style={styles.projectsHeaderBar}>
                    <button style={styles.projectsFilterTab}>0️⃣ Quá hạn</button>
                    <button style={styles.projectsFilterTab}>0️⃣ Bình luận</button>
                    <button style={{...styles.projectsFilterTab, background: 'rgba(255, 255, 255, 0.6)'}}>✓ Đánh dấu đã đọc tất cả</button>
                  </div>

                  {/* Projects Table */}
                  <table style={styles.projectsTable}>
                    <thead>
                      <tr>
                        <th style={{...styles.projectsTh, width: '40px'}}>
                          <input type="checkbox" style={{cursor: 'pointer'}} />
                        </th>
                        <th style={{...styles.projectsTh, width: '50px'}}>ID</th>
                        <th style={styles.projectsTh}>Tên</th>
                        <th style={styles.projectsTh}>Hoạt động</th>
                        <th style={styles.projectsTh}>Performance</th>
                        <th style={styles.projectsTh}>Xem các thành viên</th>
                        <th style={styles.projectsTh}>Vai trò</th>
                        <th style={styles.projectsTh}>Quyền riêng tư</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectsListData.map((project) => (
                        <tr 
                          key={project.id} 
                          style={{...styles.projectsTr, cursor: 'pointer'}}
                          onClick={() => setSelectedProject(project)}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#e8f4f8'} 
                          onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                        >
                          <td style={{...styles.projectsTd, width: '40px', textAlign: 'center'}}>
                            <input type="checkbox" style={{cursor: 'pointer'}} onClick={(e) => e.stopPropagation()} />
                          </td>
                          <td style={{...styles.projectsTd, width: '50px', color: '#1e3a8a', fontWeight: '600'}}>{project.id}</td>
                          <td style={{...styles.projectsTd, fontWeight: '600', color: '#1e3a8a'}}>
                            <span style={{display: 'inline-flex', alignItems: 'center', gap: '8px'}}>
                              📁 {project.name}
                            </span>
                          </td>
                          <td style={styles.projectsTd}>{project.lastUpdate}</td>
                          <td style={{...styles.projectsTd, fontWeight: '600', color: '#1e3a8a'}}>{project.performance}%</td>
                          <td style={styles.projectsTd}>
                            <div style={{display: 'flex', gap: '4px'}}>
                              <MemberAvatar color="#65B741" />
                              <MemberAvatar color="#999999" />
                            </div>
                          </td>
                          <td style={styles.projectsTd}>
                            <RoleBadgeProject role={project.role} />
                          </td>
                          <td style={styles.projectsTd}>
                            <span style={{color: '#2d5a2d', fontSize: '13px'}}>🌐 {project.privacy}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div style={styles.projectsPagination}>
                    <div>ĐÃ CHỌN: 0 / 2</div>
                    <div>TỔNG: 1</div>
                    <div>TRANG: 1</div>
                    <div style={{marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center'}}>
                      <button style={{background: 'none', border: 'none', color: '#1e3a8a', cursor: 'pointer', fontWeight: '600'}}>‹ TRƯỚC</button>
                      <button style={{background: 'none', border: 'none', color: '#1e3a8a', cursor: 'pointer', fontWeight: '600'}}>TIẾP THEO ›</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {/* END: PROJECT PAGE */}

        {/* PROJECT DETAIL VIEW */}
        {active === 'projects' && selectedProject && (
          <div style={styles.projectDetailContainer}>
            {/* Header */}
            <div style={styles.projectDetailHeader}>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px', flex: 1}}>
                <button 
                  style={styles.projectDetailBackBtn}
                  onClick={() => setSelectedProject(null)}
                  title="Quay lại danh sách"
                >
                  ← Quay lại
                </button>
                <h1 style={styles.projectDetailTitle}>{selectedProject.name}</h1>
              </div>
              <div style={{display: 'flex', gap: '12px'}}>
                <button style={styles.projectDetailBtn}>🎬 Cuộc gọi video</button>
                <button style={styles.projectDetailBtn}>ℹ️ Giới thiệu về dự án</button>
                <button style={{...styles.projectDetailBtn, padding: '8px 12px', fontSize: '16px'}}>⋯</button>
              </div>
            </div>

            {/* Tabs */}
            <div style={styles.projectDetailTabs}>
              <button style={{...styles.projectDetailTab, ...styles.projectDetailTabActive}}>📋 Tác vụ</button>
              <button style={styles.projectDetailTab}>📰 Bản tin</button>
              <button style={styles.projectDetailTab}>📅 Lịch</button>
              <button style={styles.projectDetailTab}>📂 Drive</button>
              <button style={styles.projectDetailTab}>➕ Thêm</button>
            </div>

            {/* Content Area */}
            <div style={styles.projectDetailContent}>
              {/* Search & Filter Bar */}
              <div style={styles.projectDetailSearchBar}>
                <input 
                  type="text" 
                  placeholder="Tìm tác vụ..." 
                  style={styles.projectDetailSearchInput}
                />
                <div style={{display: 'flex', gap: '8px'}}>
                  <button style={{...styles.projectDetailBtn, padding: '6px 12px', fontSize: '13px'}}>🔽 Sắp xếp</button>
                  <button style={{...styles.projectDetailBtn, padding: '6px 12px', fontSize: '13px'}}>⚙️ Bộ lọc</button>
                </div>
              </div>

              {/* Tasks Table */}
              <table style={styles.projectDetailTaskTable}>
                <thead>
                  <tr style={{borderBottom: '2px solid rgba(255,255,255,0.3)'}}>
                    <th style={{...styles.projectDetailTaskTh, width: '30%'}}>Tên</th>
                    <th style={{...styles.projectDetailTaskTh, width: '12%'}}>Giai đoạn Kanban</th>
                    <th style={{...styles.projectDetailTaskTh, width: '14%'}}>Hoạt động</th>
                    <th style={{...styles.projectDetailTaskTh, width: '14%'}}>Hạn chót</th>
                    <th style={{...styles.projectDetailTaskTh, width: '12%'}}>Người tạo</th>
                    <th style={{...styles.projectDetailTaskTh, width: '12%'}}>Người được phân công</th>
                    <th style={{...styles.projectDetailTaskTh, width: '8%'}}>Dự án</th>
                    <th style={{...styles.projectDetailTaskTh, width: '8%'}}>Lưu trữ</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTasksData.map((task) => (
                    <tr key={task.id} style={{...styles.projectDetailTaskTr, cursor: 'pointer'}} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{...styles.projectDetailTaskTd, fontWeight: '600'}}>📌 {task.name}</td>
                      <td style={styles.projectDetailTaskTd}>
                        <span style={{
                          background: task.kanbanStage === 'To Do' ? '#e9ecef' : task.kanbanStage === 'In Progress' ? '#fff3cd' : '#d4edda',
                          color: task.kanbanStage === 'To Do' ? '#495057' : task.kanbanStage === 'In Progress' ? '#856404' : '#155724',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {task.kanbanStage}
                        </span>
                      </td>
                      <td style={styles.projectDetailTaskTd}>{task.activity}</td>
                      <td style={styles.projectDetailTaskTd}>{task.dueDate}</td>
                      <td style={styles.projectDetailTaskTd}>{task.creator}</td>
                      <td style={styles.projectDetailTaskTd}>{task.assignee}</td>
                      <td style={styles.projectDetailTaskTd}>
                        <span style={{fontSize: '12px', color: 'rgba(255,255,255,0.7)'}}>📁 {task.project}</span>
                      </td>
                      <td style={styles.projectDetailTaskTd}>
                        <span style={{fontSize: '12px', color: 'rgba(255,255,255,0.7)'}}>🗂️ {task.storage}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* END PROJECT DETAIL VIEW */}

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
                {chatContacts?.map((contact) => (
                  <div 
                    key={contact.id}
                    style={{
                      ...styles.chatContactItem,
                      ...(selectedContact?.id === contact.id ? styles.chatContactItemActive : {})
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
                  <div style={styles.chatWindowAvatar}>{selectedContact?.avatar || '?'}</div>
                  <div>
                    <div style={styles.chatWindowName}>{selectedContact?.name || 'Chọn cuộc trò chuyện'}</div>
                    <div style={styles.chatWindowStatus}>
                      {selectedContact?.online ? '🟢 Đang hoạt động' : '⚫ Không hoạt động'}
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
                {chatMessages?.map((message) => (
                  <div 
                    key={message.id}
                    style={{
                      ...styles.chatMessageRow,
                      ...(message.isOwn ? styles.chatMessageRowOwn : {})
                    }}
                  >
                    {!message.isOwn && (
                      <div style={styles.chatMessageAvatar}>{selectedContact?.avatar || '?'}</div>
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
                    placeholder={`Nhắn tin tới ${selectedContact?.name || 'ai đó'}...`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    style={styles.chatMessageInput}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && messageInput.trim()) {
                        setMessageInput('')
                      }
                    }}
                  />
                  <button 
                    style={styles.chatSendButton}
                    onClick={() => {
                      if (messageInput.trim()) {
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