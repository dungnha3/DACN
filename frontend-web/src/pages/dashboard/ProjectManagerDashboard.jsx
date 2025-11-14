import { useMemo, useState } from 'react'
import { styles } from './ProjectManagerDashboard.styles'
import { NavItem, RoleBadge, KPICard, StatusBadge, LeaveStatusBar, ApprovalStatusBadge } from './ProjectManagerDashboard.components'
import { 
  kpiData, attendanceHistory, leaveRequests, notifications, sectionsConfig, pendingApprovals, 
  mockProjects, mockIssues, mockStorageItems, mockSprints, mockProjectMembers, mockActivities 
} from './ProjectManagerDashboard.constants'
import { chatContacts, chatMessages } from './EmployeeDashboard.constants'

export default function ProjectManagerDashboard() {
  const [active, setActive] = useState('dashboard')
  const [projectTab, setProjectTab] = useState('management') // management, issues, storage
  const [projectSubTab, setProjectSubTab] = useState('backlog') // backlog, sprints, members, activity
  const [approvals, setApprovals] = useState(pendingApprovals)
  const [selectedContact, setSelectedContact] = useState(chatContacts?.[0] || null)
  const [messageInput, setMessageInput] = useState('')
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  
  // STATE MỚI: Quản lý dự án đang được chọn
  const [allProjects, setAllProjects] = useState(mockProjects)
  const [selectedProjectId, setSelectedProjectId] = useState(allProjects[0]?.id || null)

  const username = typeof localStorage !== 'undefined' ? localStorage.getItem('username') : 'Project Manager'
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

        {/* START: PROJECT PAGE (REDESIGNED) */}
        {active === 'projects' && (
          <div style={styles.pageContent}>
            {/* Project Tab Navigation */}
            <div style={styles.projectTabContainer}>
              <button 
                style={projectTab === 'management' ? { ...styles.projectTabButton, ...styles.projectTabButtonActive } : styles.projectTabButton}
                onClick={() => setProjectTab('management')}
              >
                🏗️ Quản lý Dự án
              </button>
              <button 
                style={projectTab === 'issues' ? { ...styles.projectTabButton, ...styles.projectTabButtonActive } : styles.projectTabButton}
                onClick={() => setProjectTab('issues')}
              >
                🐞 Vấn đề & Sprints
              </button>
              <button 
                style={projectTab === 'storage' ? { ...styles.projectTabButton, ...styles.projectTabButtonActive } : styles.projectTabButton}
                onClick={() => setProjectTab('storage')}
              >
                🗄️ Lưu trữ
              </button>
            </div>

            {/* Tab Content */}
            <div style={styles.projectTabContent}>
              
              {/* Tab 1: Project Management (ProjectController) */}
              {projectTab === 'management' && (
                <>
                  <div style={styles.tableHeader}>
                    <h4 style={styles.tableTitle}>Danh sách dự án của tôi</h4>
                    <button style={styles.addBtn}>+ Tạo dự án mới</button>
                  </div>
                  <div style={styles.projectGrid}>
                    {allProjects.map(project => (
                      <div key={project.id} style={styles.projectCard}>
                        <div style={styles.projectCardHeader}>
                          <div>
                            <div style={styles.projectCardTitle}>{project.name}</div>
                          </div>
                          <span style={styles.projectCardStatus(project.status)}>{project.status}</span>
                        </div>
                        <div>
                          <div style={{ ...styles.projectCardProgress, marginBottom: 4 }}>
                            <div style={styles.projectCardProgressBar(project.progress)} />
                          </div>
                          <span style={{ fontSize: 12, color: '#67748e', fontWeight: 600 }}>{project.progress}% Hoàn thành</span>
                        </div>
                        <div style={styles.projectCardFooter}>
                          <div style={styles.projectCardTeam}>
                            {project.team.map((avatar, idx) => (
                              <div key={idx} style={{...styles.projectCardAvatar, zIndex: idx, marginLeft: idx === 0 ? 0 : -10}}>
                                {avatar}
                              </div>
                            ))}
                          </div>
                          <button 
                            style={styles.approveBtn} 
                            onClick={() => handleSelectProject(project.id)}
                          >
                            Quản lý
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Tab 2: Issue & Sprint Management (IssueController, SprintController, etc.) */}
              {projectTab === 'issues' && (
                <>
                  <ProjectSelectorBar />
                  
                  {/* Sub-tabs */}
                  <div style={styles.subTabsContainer}>
                    <button 
                      style={projectSubTab === 'backlog' ? {...styles.subTabButton, ...styles.subTabButtonActive} : styles.subTabButton}
                      onClick={() => setProjectSubTab('backlog')}
                    >
                      Backlog
                    </button>
                    <button 
                      style={projectSubTab === 'sprints' ? {...styles.subTabButton, ...styles.subTabButtonActive} : styles.subTabButton}
                      onClick={() => setProjectSubTab('sprints')}
                    >
                      Sprints
                    </button>
                    <button 
                      style={projectSubTab === 'members' ? {...styles.subTabButton, ...styles.subTabButtonActive} : styles.subTabButton}
                      onClick={() => setProjectSubTab('members')}
                    >
                      Thành viên
                    </button>
                    <button 
                      style={projectSubTab === 'activity' ? {...styles.subTabButton, ...styles.subTabButtonActive} : styles.subTabButton}
                      onClick={() => setProjectSubTab('activity')}
                    >
                      Hoạt động
                    </button>
                  </div>

                  {/* Render content based on sub-tab */}
                  {renderProjectSubContent()}
                </>
              )}

              {/* Tab 3: Storage (StorageController) */}
              {projectTab === 'storage' && (
                <>
                  <ProjectSelectorBar />
                  
                  {!selectedProjectId ? (
                    <div style={styles.placeholderCard}>
                      <div style={styles.placeholderIcon}>🗄️</div>
                      <h3 style={styles.placeholderTitle}>Chưa chọn dự án</h3>
                      <p style={styles.placeholderText}>
                        Vui lòng chọn một dự án từ danh sách thả xuống ở trên để xem lưu trữ.
                      </p>
                    </div>
                  ) : (
                    <div style={styles.tableCard}>
                      <div style={styles.tableHeader}>
                        <h4 style={styles.tableTitle}>Lưu trữ cho dự án: {allProjects.find(p => p.id === selectedProjectId)?.name}</h4>
                        <button style={styles.addBtn}>+ Tải lên tài liệu</button>
                      </div>
                      <div style={styles.storageGrid}>
                        {mockStorageItems.map(item => (
                          <div key={item.id} style={styles.storageItem}>
                            <span style={styles.storageIcon(item.type)}>
                              {item.type === 'folder' ? '📁' : '📄'}
                            </span>
                            <div style={styles.storageInfo}>
                              <div style={styles.storageName}>{item.name}</div>
                              <div style={styles.storageMeta}>
                                Cập nhật: {item.lastModified} | {item.size}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        {/* END: PROJECT PAGE */}

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