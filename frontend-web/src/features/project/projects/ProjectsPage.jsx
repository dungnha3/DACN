import { useState, useEffect } from 'react'
import { styles } from './ProjectsPage.styles'
import { mockTasks } from './data/projects.constants'
import CreateProjectModal from './components/CreateProjectModal'
import CreateIssueModal from './components/CreateIssueModal'
import { projectApi } from './api/projectApi'
import { issueApi } from './api/issueApi'

export default function ProjectsPage() {
  const [mainTab, setMainTab] = useState('tasks') // tasks | projects
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)

  // Load projects khi component mount
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const data = await projectApi.getAllProjects()
      setProjects(data)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectCreated = (newProject) => {
    // Reload projects sau khi tạo mới
    loadProjects()
  }

  return (
    <div style={styles.container}>
      {/* Main Tab Navigation */}
      <div style={styles.mainTabContainer}>
        <button
          style={{
            ...styles.mainTabButton,
            ...(mainTab === 'tasks' ? styles.mainTabButtonActive : {})
          }}
          onClick={() => setMainTab('tasks')}
        >
          Tác vụ của tôi ✏️
        </button>
        <button
          style={{
            ...styles.mainTabButton,
            ...(mainTab === 'projects' ? styles.mainTabButtonActive : {})
          }}
          onClick={() => setMainTab('projects')}
        >
          Dự án
        </button>
      </div>

      {/* Content Area */}
      {mainTab === 'tasks' ? (
        <TasksTab key="tasks-tab" />
      ) : (
        <ProjectsTab 
          projects={projects} 
          loading={loading}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  )
}

// Tab "Tác vụ của tôi"
function TasksTab() {
  const [viewMode, setViewMode] = useState('list') // list | deadline | calendar | gantt
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Load issues khi component mount
  useEffect(() => {
    loadIssues()
  }, [])

  const loadIssues = async () => {
    setLoading(true)
    try {
      const data = await issueApi.getMyIssues()
      setIssues(data)
    } catch (error) {
      console.error('Error loading issues:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleIssueCreated = (newIssue) => {
    // Reload issues sau khi tạo mới
    loadIssues()
  }
  
  return (
    <div style={styles.tabContent}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <button style={styles.createBtn} onClick={handleOpenModal}>+ Tạo</button>
          <select style={styles.filterSelect}>
            <option>Tất cả các vai trò</option>
            <option>Người tạo</option>
            <option>Người được phân công</option>
          </select>
          <select style={styles.filterSelect}>
            <option>Đang tiến hành ⚡</option>
            <option>Hoàn thành</option>
            <option>Chưa bắt đầu</option>
          </select>
          <input 
            type="text" 
            placeholder="+ Tìm kiếm" 
            style={styles.searchInput}
          />
        </div>
        <div style={styles.toolbarRight}>
          <button style={styles.iconBtn} title="Cài đặt">⚙️</button>
          <button style={styles.iconBtn} title="Thông báo">🔔</button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div style={styles.viewModeTabs}>
        <button 
          style={{...styles.viewModeTab, ...(viewMode === 'list' ? styles.viewModeTabActive : {})}}
          onClick={() => setViewMode('list')}
        >
          📋 Danh sách
        </button>
        <button 
          style={{...styles.viewModeTab, ...(viewMode === 'deadline' ? styles.viewModeTabActive : {})}}
          onClick={() => setViewMode('deadline')}
        >
          ⏰ Hạn chót
        </button>
        <button 
          style={{...styles.viewModeTab, ...(viewMode === 'calendar' ? styles.viewModeTabActive : {})}}
          onClick={() => setViewMode('calendar')}
        >
          📅 Trình lập kế hoạch
        </button>
        <button style={styles.viewModeTab}>📊 Lịch</button>
        <button style={styles.viewModeTab}>📈 Gantt</button>
        <div style={styles.viewModeDivider} />
        <button style={styles.viewModeTab}>⚠️ 0 Quá hạn</button>
        <button style={styles.viewModeTab}>💬 0 Bình luận</button>
        <button style={styles.viewModeTab}>✓ Đánh dấu đã đọc tất cả</button>
        <div style={{flex: 1}} />
        <button style={styles.settingsBtn}>⚙️ Quy tắc tự động hóa</button>
        <button style={styles.settingsBtn}>🎨 Phím mở rộng</button>
      </div>

      {/* Create Issue Modal */}
      <CreateIssueModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleIssueCreated}
      />

      {/* Tasks Table */}
      <div style={styles.tableWrapper}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingText}>Đang tải dữ liệu...</div>
          </div>
        ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>
                <input type="checkbox" />
              </th>
              <th style={styles.th}>⭐</th>
              <th style={styles.th}>Tên</th>
              <th style={styles.th}>
                Hoạt động 
                <span style={styles.sortIcon}>▼</span>
              </th>
              <th style={styles.th}>Hạn chót</th>
              <th style={styles.th}>Người tạo</th>
              <th style={styles.th}>Người được phân công</th>
              <th style={styles.th}>Dự án</th>
            </tr>
          </thead>
          <tbody>
            {issues.length === 0 ? (
              <tr>
                <td colSpan="8" style={{...styles.td, textAlign: 'center', padding: '32px'}}>
                  Chưa có tác vụ nào. Nhấn nút "Tạo" để tạo tác vụ mới.
                </td>
              </tr>
            ) : (
              issues.map((task) => (
              <tr key={task.issueId} style={styles.tr}>
                <td style={styles.td}>
                  <input type="checkbox" />
                </td>
                <td style={styles.td}>
                  <button style={styles.starBtn}>☆</button>
                </td>
                <td style={styles.td}>
                  <div style={styles.taskName}>
                    <span style={styles.taskIcon}>☰</span>
                    {task.issueKey}: {task.title}
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={{...styles.statusBadge, backgroundColor: task.statusColor || '#e5e7eb'}}>
                    {task.statusName}
                  </span>
                </td>
                <td style={styles.td}>
                  {task.dueDate ? (
                    <span style={{...styles.deadlineBadge, ...(task.isOverdue ? {backgroundColor: '#fee2e2', color: '#991b1b'} : {})}}>
                      {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                    </span>
                  ) : '-'}
                </td>
                <td style={styles.td}>
                  {task.reporterName ? (
                    <div style={styles.userBadge}>
                      <span style={styles.avatar}>{task.reporterName.charAt(0).toUpperCase()}</span>
                      {task.reporterName}
                    </div>
                  ) : '-'}
                </td>
                <td style={styles.td}>
                  {task.assigneeName ? (
                    <div style={styles.userBadge}>
                      <span style={styles.avatar}>{task.assigneeName.charAt(0).toUpperCase()}</span>
                      {task.assigneeName}
                    </div>
                  ) : '-'}
                </td>
                <td style={styles.td}>
                  <span style={styles.projectBadge}>{task.projectName || '-'}</span>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
        )}
      </div>

      {/* Footer */}
      <div style={styles.tableFooter}>
        <div style={styles.footerLeft}>
          <span>ĐÃ CHỌN: 0 / {issues.length}</span>
          <span style={{marginLeft: '20px'}}>TỔNG: {issues.length}</span>
        </div>
        <div style={styles.footerCenter}>
          <span>TRANG: 1</span>
        </div>
        <div style={styles.footerRight}>
          <span>BẢN GHI:</span>
          <select style={styles.pageSize}>
            <option>50</option>
            <option>100</option>
            <option>200</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <button style={styles.actionBtnActive}>ÁP DỤNG</button>
        <button style={styles.actionBtn}>
          <input type="checkbox" style={{marginRight: '8px'}} />
          ĐÁNH CHỜ TẤT CẢ
        </button>
      </div>
    </div>
  )
}

// Helper function để lấy style cho status badge
const getStatusBadgeStyle = (status) => {
  const baseStyle = {
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
  }
  
  switch(status) {
    case 'PLANNING':
      return { ...baseStyle, backgroundColor: '#fef3c7', color: '#92400e' }
    case 'IN_PROGRESS':
      return { ...baseStyle, backgroundColor: '#dbeafe', color: '#1e40af' }
    case 'ON_HOLD':
      return { ...baseStyle, backgroundColor: '#fee2e2', color: '#991b1b' }
    case 'COMPLETED':
      return { ...baseStyle, backgroundColor: '#dcfce7', color: '#166534' }
    case 'CANCELLED':
      return { ...baseStyle, backgroundColor: '#e5e7eb', color: '#374151' }
    default:
      return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#6b7280' }
  }
}

// Helper function để lấy text cho status
const getStatusText = (status) => {
  switch(status) {
    case 'PLANNING': return 'Đang lập kế hoạch'
    case 'IN_PROGRESS': return 'Đang thực hiện'
    case 'ON_HOLD': return 'Tạm dừng'
    case 'COMPLETED': return 'Hoàn thành'
    case 'CANCELLED': return 'Đã hủy'
    default: return status
  }
}

// Tab "Dự án"
function ProjectsTab({ projects, loading, onProjectCreated }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSuccess = (newProject) => {
    onProjectCreated && onProjectCreated(newProject)
  }

  return (
    <div style={styles.tabContent}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <button style={styles.createBtn} onClick={handleOpenModal}>+ Tạo</button>
          <select style={styles.filterSelect}>
            <option>Của tôi</option>
            <option>Tất cả</option>
          </select>
          <input 
            type="text" 
            placeholder="+ Tìm kiếm" 
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />

      {/* View Mode Tabs */}
      <div style={styles.viewModeTabs}>
        <button style={styles.viewModeTab}>⚠️ 0 Quá hạn</button>
        <button style={styles.viewModeTab}>💬 0 Bình luận</button>
        <button style={styles.viewModeTab}>✓ Đánh dấu đã đọc tất cả</button>
        <div style={{flex: 1}} />
        <button style={styles.settingsBtn}>⚙️ Quy tắc tự động hóa</button>
        <button style={styles.settingsBtn}>🎨 Phím mở rộng</button>
      </div>

      {/* Projects Table */}
      <div style={styles.tableWrapper}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingText}>Đang tải dữ liệu...</div>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>
                  <input type="checkbox" />
                </th>
                <th style={styles.th}>⭐</th>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Mã dự án</th>
                <th style={styles.th}>Tên</th>
                <th style={styles.th}>Mô tả</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Ngày bắt đầu</th>
                <th style={styles.th}>Ngày kết thúc</th>
                <th style={styles.th}>Người tạo</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{...styles.td, textAlign: 'center', padding: '32px'}}>
                    Chưa có dự án nào. Nhấn nút "Tạo" để tạo dự án mới.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.projectId} style={styles.tr}>
                    <td style={styles.td}>
                      <input type="checkbox" />
                    </td>
                    <td style={styles.td}>
                      <button style={styles.starBtn}>☆</button>
                    </td>
                    <td style={styles.td}>{project.projectId}</td>
                    <td style={styles.td}>
                      <span style={styles.keyBadge}>{project.keyProject}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.projectName}>
                        <span style={styles.projectIcon}>🔵</span>
                        {project.name}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.descriptionCell}>
                        {project.description || '-'}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={getStatusBadgeStyle(project.status)}>
                        {getStatusText(project.status)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {project.startDate ? new Date(project.startDate).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td style={styles.td}>
                      {project.endDate ? new Date(project.endDate).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.userBadge}>
                        <span style={styles.avatar}>
                          {project.createdByName ? project.createdByName.charAt(0).toUpperCase() : 'U'}
                        </span>
                        {project.createdByName || 'Unknown'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div style={styles.tableFooter}>
        <div style={styles.footerLeft}>
          <span>ĐÃ CHỌN: 0 / {projects.length}</span>
          <span style={{marginLeft: '20px'}}>TỔNG: {projects.length}</span>
        </div>
        <div style={styles.footerCenter}>
          <button style={styles.paginationBtn}>← TRƯỚC</button>
          <span style={{margin: '0 16px'}}>TRANG: 1</span>
          <button style={styles.paginationBtn}>TIẾP THEO →</button>
        </div>
      </div>
    </div>
  )
}
