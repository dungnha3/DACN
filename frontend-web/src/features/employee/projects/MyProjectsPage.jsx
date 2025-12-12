import { useState, useEffect } from 'react';
import { styles } from './MyProjectsPage.styles';
import { projectService } from '@/shared/services/project.service';
import { issueService } from '@/shared/services/issue.service';
import { apiService } from '@/shared/services/api.service';
import ProjectDetailPage from '@/features/project/projects/pages/ProjectDetailPage';
import IssueDetailPage from '@/features/project/projects/pages/IssueDetailPage';
import CreateIssueModal from '@/features/project/projects/components/CreateIssueModal';

export default function MyProjectsPage({ glassMode }) {
  const [mainTab, setMainTab] = useState('tasks'); // tasks | projects | performance
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load projects khi component mount
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getMyProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      ...styles.container,
      backgroundColor: glassMode ? 'transparent' : styles.container.backgroundColor,
      minHeight: glassMode ? 'auto' : styles.container.minHeight
    }}>
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
        <button
          style={{
            ...styles.mainTabButton,
            ...(mainTab === 'performance' ? styles.mainTabButtonActive : {})
          }}
          onClick={() => setMainTab('performance')}
        >
          Hiệu suất 📊
        </button>
      </div>

      {/* Content Area */}
      {mainTab === 'tasks' ? (
        <TasksTab key="tasks-tab" />
      ) : mainTab === 'projects' ? (
        <ProjectsTab
          projects={projects}
          loading={loading}
        />
      ) : (
        <PerformanceTab key="performance-tab" />
      )}
    </div>
  )
}

// Tab "Tác vụ của tôi"
function TasksTab() {
  const [viewMode, setViewMode] = useState('list'); // list | deadline | calendar | gantt
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  // Load issues khi component mount
  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    setLoading(true);
    try {
      const data = await issueService.getMyIssues();
      setIssues(data);
    } catch (error) {
      console.error("Failed to load issues", error);
    } finally {
      setLoading(false);
    }
  };

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

  // Nếu đã chọn issue, hiển thị IssueDetailPage
  if (selectedIssueId) {
    return (
      <IssueDetailPage
        issueId={selectedIssueId}
        onBack={() => setSelectedIssueId(null)}
      />
    )
  }

  return (
    <div style={styles.tabContent}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          {/* Employee usually doesn't create tasks directly from here, but if needed we can enable it */}
          {/* <button style={styles.createBtn} onClick={handleOpenModal}>+ Tạo</button> */}

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
          style={{ ...styles.viewModeTab, ...(viewMode === 'list' ? styles.viewModeTabActive : {}) }}
          onClick={() => setViewMode('list')}
        >
          📋 Danh sách
        </button>
        <button
          style={{ ...styles.viewModeTab, ...(viewMode === 'deadline' ? styles.viewModeTabActive : {}) }}
          onClick={() => setViewMode('deadline')}
        >
          ⏰ Hạn chót
        </button>
        <button style={styles.viewModeTab}>📅 Lịch</button>
        <div style={styles.viewModeDivider} />
        <button style={styles.viewModeTab}>⚠️ 0 Quá hạn</button>
        <button style={styles.viewModeTab}>💬 0 Bình luận</button>
        <div style={{ flex: 1 }} />
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
                  <td colSpan="6" style={{ ...styles.td, textAlign: 'center', padding: '32px' }}>
                    Chưa có tác vụ nào.
                  </td>
                </tr>
              ) : (
                issues.map((task) => (
                  <tr
                    key={task.issueId}
                    style={{
                      ...styles.tr,
                      cursor: 'pointer',
                      backgroundColor: hoveredRow === task.issueId ? '#f7fafc' : 'transparent'
                    }}
                    onClick={() => setSelectedIssueId(task.issueId)}
                    onMouseEnter={() => setHoveredRow(task.issueId)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={styles.td}>
                      <div style={styles.taskName}>
                        {task.issueKey}: {task.title}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, backgroundColor: task.statusColor || '#e5e7eb' }}>
                        {task.statusName}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {task.dueDate ? (
                        <span style={{ ...styles.deadlineBadge, ...(task.isOverdue ? { backgroundColor: '#fee2e2', color: '#991b1b' } : {}) }}>
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
          <span>TỔNG: {issues.length}</span>
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

  switch (status) {
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
  switch (status) {
    case 'PLANNING': return 'Đang lập kế hoạch'
    case 'IN_PROGRESS': return 'Đang thực hiện'
    case 'ON_HOLD': return 'Tạm dừng'
    case 'COMPLETED': return 'Hoàn thành'
    case 'CANCELLED': return 'Đã hủy'
    default: return status
  }
}

// Tab "Dự án"
function ProjectsTab({ projects, loading }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [hoveredRow, setHoveredRow] = useState(null)

  // Nếu đã chọn project, hiển thị ProjectDetailPage
  if (selectedProjectId) {
    return (
      <ProjectDetailPage
        projectId={selectedProjectId}
        onBack={() => setSelectedProjectId(null)}
      />
    )
  }

  return (
    <div style={styles.tabContent}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
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

      {/* View Mode Tabs */}
      <div style={styles.viewModeTabs}>
        <button style={styles.viewModeTab}>⚠️ 0 Quá hạn</button>
        <button style={styles.viewModeTab}>💬 0 Bình luận</button>
        <div style={{ flex: 1 }} />
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
                  <td colSpan="8" style={{ ...styles.td, textAlign: 'center', padding: '32px' }}>
                    Chưa có dự án nào.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.projectId}
                    style={{
                      ...styles.tr,
                      cursor: 'pointer',
                      backgroundColor: hoveredRow === project.projectId ? '#f7fafc' : 'transparent',
                    }}
                    onClick={() => setSelectedProjectId(project.projectId)}
                    onMouseEnter={() => setHoveredRow(project.projectId)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
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
          <span>TỔNG: {projects.length}</span>
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
    </div>
  )
}

// Tab "Hiệu suất"
function PerformanceTab() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState({
    totalProjects: 0,
    totalIssues: 0,
    completedIssues: 0,
    avgCompletionRate: 0,
    totalOverdue: 0
  })

  useEffect(() => {
    loadPerformanceData()
  }, [])

  const loadPerformanceData = async () => {
    setLoading(true)
    try {
      const data = await apiService.get('/api/project-dashboard/my-projects')
      setStats(data)

      // Tính toán summary
      const totalProjects = data.length
      const totalIssues = data.reduce((sum, p) => sum + p.totalIssues, 0)
      const completedIssues = data.reduce((sum, p) => sum + p.completedIssues, 0)
      const avgCompletionRate = totalProjects > 0
        ? data.reduce((sum, p) => sum + p.completionRate, 0) / totalProjects
        : 0
      const totalOverdue = data.reduce((sum, p) => sum + p.overdueIssues, 0)

      setSummary({
        totalProjects,
        totalIssues,
        completedIssues,
        avgCompletionRate,
        totalOverdue
      })
    } catch (error) {
      console.error("Failed to load performance data", error)
    } finally {
      setLoading(false)
    }
  }

  const getCompletionColor = (rate) => {
    if (rate >= 80) return '#10b981'
    if (rate >= 50) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div style={styles.tabContent}>
      {/* Header */}
      <div style={styles.performanceHeader}>
        <h2 style={styles.performanceTitle}>Tổng quan hiệu suất</h2>
        <p style={styles.performanceSubtitle}>Thống kê tất cả dự án của bạn</p>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingText}>Đang tải dữ liệu...</div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div style={styles.summaryCards}>
            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>📁</div>
              <div style={styles.summaryContent}>
                <div style={styles.summaryLabel}>Tổng dự án</div>
                <div style={styles.summaryValue}>{summary.totalProjects}</div>
              </div>
            </div>

            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>📋</div>
              <div style={styles.summaryContent}>
                <div style={styles.summaryLabel}>Tổng tác vụ</div>
                <div style={styles.summaryValue}>{summary.totalIssues}</div>
                <div style={styles.summaryDetail}>
                  Hoàn thành: {summary.completedIssues}
                </div>
              </div>
            </div>

            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>✅</div>
              <div style={styles.summaryContent}>
                <div style={styles.summaryLabel}>Tỷ lệ hoàn thành TB</div>
                <div style={{
                  ...styles.summaryValue,
                  color: getCompletionColor(summary.avgCompletionRate)
                }}>
                  {summary.avgCompletionRate.toFixed(1)}%
                </div>
              </div>
            </div>

            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>⚠️</div>
              <div style={styles.summaryContent}>
                <div style={styles.summaryLabel}>Quá hạn</div>
                <div style={{ ...styles.summaryValue, color: '#ef4444' }}>
                  {summary.totalOverdue}
                </div>
              </div>
            </div>
          </div>

          {/* Projects Performance Table */}
          <div style={styles.performanceTable}>
            <h3 style={styles.sectionTitle}>Chi tiết theo dự án</h3>

            {stats.length === 0 ? (
              <div style={styles.emptyState}>
                <p>Chưa có dữ liệu thống kê</p>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Dự án</th>
                    <th style={styles.th}>Trạng thái</th>
                    <th style={styles.th}>Tổng tác vụ</th>
                    <th style={styles.th}>Hoàn thành</th>
                    <th style={styles.th}>Đang làm</th>
                    <th style={styles.th}>Chưa làm</th>
                    <th style={styles.th}>Quá hạn</th>
                    <th style={styles.th}>Tỷ lệ hoàn thành</th>
                    <th style={styles.th}>Sprints</th>
                    <th style={styles.th}>Thành viên</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((project) => (
                    <tr key={project.projectId} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.projectNameCell}>
                          <span style={styles.projectKeyBadge}>{project.projectKey}</span>
                          <span style={styles.projectNameText}>{project.projectName}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.statusBadge}>{project.status}</span>
                      </td>
                      <td style={styles.td}>
                        <strong>{project.totalIssues}</strong>
                      </td>
                      <td style={styles.td}>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>
                          {project.completedIssues}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                          {project.inProgressIssues}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ color: '#6b7280', fontWeight: '600' }}>
                          {project.todoIssues}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ color: '#ef4444', fontWeight: '600' }}>
                          {project.overdueIssues}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.progressCell}>
                          <div style={styles.progressBar}>
                            <div style={{
                              ...styles.progressFill,
                              width: `${project.completionRate}%`,
                              backgroundColor: getCompletionColor(project.completionRate)
                            }} />
                          </div>
                          <span style={styles.progressText}>
                            {project.completionRate.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.sprintInfo}>
                          <span>Hoạt động: {project.activeSprints}</span>
                          <span style={{ color: '#6b7280', fontSize: '12px' }}>
                            / {project.totalSprints} tổng
                          </span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.memberBadge}>
                          👥 {project.totalMembers}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
