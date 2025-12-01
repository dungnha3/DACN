import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { projectApi } from '@/features/project/projects/api/projectApi';
import { issueApi } from '@/features/project/projects/api/issueApi';
import { dashboardApi } from '@/features/project/projects/api/dashboardApi';
import { styles } from '@/features/project/projects/ProjectsPage.styles';
import IssueDetailPage from '@/features/project/projects/pages/IssueDetailPage';

export default function MyProjectsPage() {
  const [mainTab, setMainTab] = useState('tasks'); // tasks | projects | performance
  const [projects, setProjects] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user: authUser } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projectsRes, issuesRes] = await Promise.all([
        projectApi.getMyProjects(),
        issueApi.getMyIssues()
      ]);
      
      setProjects(projectsRes || []);
      setMyIssues(issuesRes || []);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Employee Notice */}
      <div style={{...styles.hrNotice, background: '#f0fdf4', borderColor: '#bbf7d0'}}>
        <span style={{fontSize: 18}}>👤</span>
        <div>
          <div style={{fontWeight: 600, color: '#15803d'}}>Trang dự án cá nhân</div>
          <div style={{fontSize: 13, color: '#6b7280', marginTop: 4}}>
            Xem các dự án và tác vụ được giao cho bạn. Liên hệ Project Manager để thay đổi.
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div style={styles.mainTabContainer}>
        <button
          style={{
            ...styles.mainTabButton,
            ...(mainTab === 'tasks' ? styles.mainTabButtonActive : {})
          }}
          onClick={() => setMainTab('tasks')}
        >
          ✏️ Tác vụ của tôi
        </button>
        <button
          style={{
            ...styles.mainTabButton,
            ...(mainTab === 'projects' ? styles.mainTabButtonActive : {})
          }}
          onClick={() => setMainTab('projects')}
        >
          🏭 Dự án
        </button>
        <button
          style={{
            ...styles.mainTabButton,
            ...(mainTab === 'performance' ? styles.mainTabButtonActive : {})
          }}
          onClick={() => setMainTab('performance')}
        >
          📊 Hiệu suất
        </button>
      </div>

      {/* Content Area */}
      {mainTab === 'tasks' ? (
        <MyTasksTab 
          issues={myIssues} 
          loading={loading} 
          error={error}
          onRefresh={loadData}
        />
      ) : mainTab === 'projects' ? (
        <MyProjectsTab 
          projects={projects} 
          issues={myIssues}
          loading={loading}
          error={error}
          onRefresh={loadData}
        />
      ) : (
        <MyPerformanceTab />
      )}
    </div>
  );
}

// ==================== TAB: TÁC VỤ CỦA TÔI ====================
function MyTasksTab({ issues, loading, error, onRefresh }) {
  const [viewMode, setViewMode] = useState('list');
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Nếu đã chọn issue, hiển thị IssueDetailPage
  if (selectedIssueId) {
    return (
      <IssueDetailPage 
        issueId={selectedIssueId}
        onBack={() => setSelectedIssueId(null)}
      />
    );
  }

  // Filter issues
  const filteredIssues = issues.filter(task => {
    const matchSearch = !searchTerm || 
      (task.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.issueKey || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchSearch;
    
    const statusName = (task.statusName || task.issueStatus?.name || '').toLowerCase();
    if (statusFilter === 'done') return matchSearch && (statusName.includes('done') || statusName.includes('hoàn thành'));
    if (statusFilter === 'progress') return matchSearch && statusName.includes('progress');
    if (statusFilter === 'todo') return matchSearch && (statusName.includes('todo') || statusName.includes('backlog'));
    return matchSearch;
  });

  // Count by status
  const countByStatus = {
    all: issues.length,
    done: issues.filter(t => (t.statusName || '').toLowerCase().includes('done')).length,
    progress: issues.filter(t => (t.statusName || '').toLowerCase().includes('progress')).length,
    todo: issues.filter(t => {
      const s = (t.statusName || '').toLowerCase();
      return s.includes('todo') || s.includes('backlog');
    }).length
  };

  return (
    <div style={styles.tabContent}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <select 
            style={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả ({countByStatus.all})</option>
            <option value="progress">Đang làm ({countByStatus.progress})</option>
            <option value="todo">Chưa làm ({countByStatus.todo})</option>
            <option value="done">Hoàn thành ({countByStatus.done})</option>
          </select>
          <input 
            type="text" 
            placeholder="🔍 Tìm kiếm tác vụ..." 
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={styles.toolbarRight}>
          <button style={styles.iconBtn} onClick={onRefresh} title="Làm mới">🔄</button>
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
        <div style={styles.viewModeDivider} />
        <button style={styles.viewModeTab}>
          ⚠️ {issues.filter(t => t.isOverdue).length} Quá hạn
        </button>
      </div>

      {/* Tasks Table */}
      <div style={styles.tableWrapper}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingText}>⏳ Đang tải dữ liệu...</div>
          </div>
        ) : error ? (
          <div style={{...styles.loadingContainer, color: '#ef4444'}}>
            <div>❌ {error}</div>
            <button onClick={onRefresh} style={{...styles.createBtn, marginTop: 16}}>🔄 Thử lại</button>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tên tác vụ</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Hạn chót</th>
                <th style={styles.th}>Độ ưu tiên</th>
                <th style={styles.th}>Dự án</th>
                <th style={styles.th}>Người giao</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{...styles.td, textAlign: 'center', padding: '48px'}}>
                    <div style={{fontSize: 40, marginBottom: 16}}>📭</div>
                    <div style={{color: '#64748b'}}>Không có tác vụ nào</div>
                  </td>
                </tr>
              ) : (
                filteredIssues.map((task) => (
                  <tr 
                    key={task.issueId} 
                    style={{
                      ...styles.tr, 
                      cursor: 'pointer',
                      backgroundColor: hoveredRow === task.issueId ? '#f8fafc' : 'transparent'
                    }}
                    onClick={() => setSelectedIssueId(task.issueId)}
                    onMouseEnter={() => setHoveredRow(task.issueId)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={styles.td}>
                      <div style={{fontWeight: 600, color: '#0f172a'}}>
                        <span style={{color: '#64748b', fontSize: 12, marginRight: 8}}>{task.issueKey}</span>
                        {task.title}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge, 
                        backgroundColor: task.statusColor || '#e5e7eb',
                        color: getStatusTextColor(task.statusColor)
                      }}>
                        {task.statusName || 'N/A'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {task.dueDate ? (
                        <span style={{
                          ...styles.deadlineBadge, 
                          ...(task.isOverdue ? {backgroundColor: '#fee2e2', color: '#991b1b'} : {})
                        }}>
                          {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                        </span>
                      ) : '-'}
                    </td>
                    <td style={styles.td}>
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td style={styles.td}>
                      <span style={styles.projectBadge}>{task.projectName || '-'}</span>
                    </td>
                    <td style={styles.td}>
                      {task.reporterName ? (
                        <div style={styles.userBadge}>
                          <span style={styles.avatar}>{task.reporterName.charAt(0).toUpperCase()}</span>
                          {task.reporterName}
                        </div>
                      ) : '-'}
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
        <div>TỔNG: {filteredIssues.length} tác vụ</div>
        <div></div>
      </div>
    </div>
  );
}

// ==================== TAB: DỰ ÁN ====================
function MyProjectsTab({ projects, issues, loading, error, onRefresh }) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Group issues by project
  const issuesByProject = {};
  issues.forEach(issue => {
    const pid = issue.projectId;
    if (pid) {
      if (!issuesByProject[pid]) issuesByProject[pid] = [];
      issuesByProject[pid].push(issue);
    }
  });

  const filteredProjects = projects.filter(p => 
    !searchTerm || 
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.keyProject || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.tabContent}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <input 
            type="text" 
            placeholder="🔍 Tìm kiếm dự án..." 
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={styles.toolbarRight}>
          <button style={styles.iconBtn} onClick={onRefresh} title="Làm mới">🔄</button>
        </div>
      </div>

      {/* Projects Table */}
      <div style={styles.tableWrapper}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingText}>⏳ Đang tải dự án...</div>
          </div>
        ) : error ? (
          <div style={{...styles.loadingContainer, color: '#ef4444'}}>
            <div>❌ {error}</div>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Mã dự án</th>
                <th style={styles.th}>Tên dự án</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Tasks của tôi</th>
                <th style={styles.th}>Thời gian</th>
                <th style={styles.th}>Tiến độ</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{...styles.td, textAlign: 'center', padding: '48px'}}>
                    <div style={{fontSize: 40, marginBottom: 16}}>🏭</div>
                    <div style={{color: '#64748b'}}>Chưa có dự án nào</div>
                    <div style={{color: '#94a3b8', fontSize: 13, marginTop: 8}}>
                      Liên hệ Project Manager để được thêm vào dự án
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => {
                  const myIssues = issuesByProject[project.projectId] || [];
                  const doneCount = myIssues.filter(i => 
                    (i.statusName || '').toLowerCase().includes('done')
                  ).length;
                  const progress = myIssues.length > 0 ? Math.round(doneCount / myIssues.length * 100) : 0;

                  return (
                    <tr 
                      key={project.projectId} 
                      style={{
                        ...styles.tr,
                        backgroundColor: hoveredRow === project.projectId ? '#f8fafc' : 'transparent',
                      }}
                      onMouseEnter={() => setHoveredRow(project.projectId)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={styles.td}>
                        <span style={styles.keyBadge}>{project.keyProject}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={{fontWeight: 600, color: '#0f172a'}}>
                          <span style={{marginRight: 8}}>🔵</span>
                          {project.name}
                        </div>
                        {project.description && (
                          <div style={{fontSize: 12, color: '#64748b', marginTop: 4, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                            {project.description}
                          </div>
                        )}
                      </td>
                      <td style={styles.td}>
                        <ProjectStatusBadge status={project.status} />
                      </td>
                      <td style={styles.td}>
                        <span style={{fontWeight: 600, color: '#0f172a'}}>{myIssues.length}</span>
                        <span style={{color: '#64748b', marginLeft: 4}}>
                          ({doneCount} xong)
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={{fontSize: 13}}>
                          {project.startDate ? new Date(project.startDate).toLocaleDateString('vi-VN') : '-'}
                          <span style={{color: '#94a3b8', margin: '0 6px'}}>→</span>
                          {project.endDate ? new Date(project.endDate).toLocaleDateString('vi-VN') : '-'}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                          <div style={{...styles.progressBar, width: 100}}>
                            <div style={{
                              height: '100%', borderRadius: 4,
                              width: `${progress}%`,
                              backgroundColor: progress >= 80 ? '#10b981' : progress >= 50 ? '#f59e0b' : '#3b82f6'
                            }} />
                          </div>
                          <span style={{fontSize: 13, fontWeight: 600, color: '#475569'}}>{progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div style={styles.tableFooter}>
        <div>TỔNG: {filteredProjects.length} dự án</div>
      </div>
    </div>
  );
}

// ==================== TAB: HIỆU SUẤT ====================
function MyPerformanceTab() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalProjects: 0,
    totalIssues: 0,
    completedIssues: 0,
    avgCompletionRate: 0,
    totalOverdue: 0
  });

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = async () => {
    setLoading(true);
    try {
      const data = await dashboardApi.getMyProjectsStats();
      setStats(data || []);
      
      const totalProjects = data?.length || 0;
      const totalIssues = (data || []).reduce((sum, p) => sum + (p.totalIssues || 0), 0);
      const completedIssues = (data || []).reduce((sum, p) => sum + (p.completedIssues || 0), 0);
      const avgCompletionRate = totalProjects > 0 
        ? (data || []).reduce((sum, p) => sum + (p.completionRate || 0), 0) / totalProjects 
        : 0;
      const totalOverdue = (data || []).reduce((sum, p) => sum + (p.overdueIssues || 0), 0);

      setSummary({ totalProjects, totalIssues, completedIssues, avgCompletionRate, totalOverdue });
    } catch (error) {
      console.error('Error loading performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionColor = (rate) => {
    if (rate >= 80) return '#10b981';
    if (rate >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={styles.tabContent}>
      {/* Header */}
      <div style={styles.performanceHeader}>
        <h2 style={{margin: '0 0 8px 0', fontSize: 20, fontWeight: 700, color: '#0f172a'}}>📊 Hiệu suất làm việc</h2>
        <p style={{margin: 0, color: '#64748b', fontSize: 14}}>Thống kê tiến độ hoàn thành các tác vụ được giao</p>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingText}>⏳ Đang tải dữ liệu...</div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div style={styles.summaryCards}>
            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>📁</div>
              <div>
                <div style={styles.summaryLabel}>Dự án tham gia</div>
                <div style={styles.summaryValue}>{summary.totalProjects}</div>
              </div>
            </div>

            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>📋</div>
              <div>
                <div style={styles.summaryLabel}>Tổng tác vụ</div>
                <div style={styles.summaryValue}>{summary.totalIssues}</div>
                <div style={{fontSize: 13, color: '#10b981', marginTop: 4}}>
                  ✅ {summary.completedIssues} hoàn thành
                </div>
              </div>
            </div>

            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>📈</div>
              <div>
                <div style={styles.summaryLabel}>Tỷ lệ hoàn thành</div>
                <div style={{...styles.summaryValue, color: getCompletionColor(summary.avgCompletionRate)}}>
                  {summary.avgCompletionRate.toFixed(1)}%
                </div>
              </div>
            </div>

            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>⚠️</div>
              <div>
                <div style={styles.summaryLabel}>Quá hạn</div>
                <div style={{...styles.summaryValue, color: summary.totalOverdue > 0 ? '#ef4444' : '#10b981'}}>
                  {summary.totalOverdue}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Table */}
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Dự án</th>
                  <th style={styles.th}>Tổng tasks</th>
                  <th style={styles.th}>Hoàn thành</th>
                  <th style={styles.th}>Đang làm</th>
                  <th style={styles.th}>Quá hạn</th>
                  <th style={styles.th}>Tiến độ</th>
                </tr>
              </thead>
              <tbody>
                {stats.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{...styles.td, textAlign: 'center', padding: '48px', color: '#64748b'}}>
                      Chưa có dữ liệu thống kê
                    </td>
                  </tr>
                ) : (
                  stats.map((project) => (
                    <tr key={project.projectId} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={{fontWeight: 600}}>
                          <span style={{...styles.keyBadge, marginRight: 10}}>{project.projectKey}</span>
                          {project.projectName}
                        </div>
                      </td>
                      <td style={styles.td}><strong>{project.totalIssues || 0}</strong></td>
                      <td style={styles.td}><span style={{color: '#10b981', fontWeight: 600}}>{project.completedIssues || 0}</span></td>
                      <td style={styles.td}><span style={{color: '#3b82f6', fontWeight: 600}}>{project.inProgressIssues || 0}</span></td>
                      <td style={styles.td}><span style={{color: '#ef4444', fontWeight: 600}}>{project.overdueIssues || 0}</span></td>
                      <td style={styles.td}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                          <div style={{...styles.progressBar, width: 120}}>
                            <div style={{
                              height: '100%', borderRadius: 4,
                              width: `${project.completionRate || 0}%`,
                              backgroundColor: getCompletionColor(project.completionRate || 0)
                            }} />
                          </div>
                          <span style={{fontWeight: 600, color: getCompletionColor(project.completionRate || 0)}}>
                            {(project.completionRate || 0).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ==================== HELPER COMPONENTS ====================

function ProjectStatusBadge({ status }) {
  const config = {
    ACTIVE: { bg: '#dbeafe', color: '#1e40af', label: 'Đang hoạt động' },
    ON_HOLD: { bg: '#fef3c7', color: '#92400e', label: 'Tạm dừng' },
    OVERDUE: { bg: '#fee2e2', color: '#991b1b', label: 'Quá hạn' },
    COMPLETED: { bg: '#dcfce7', color: '#166534', label: 'Hoàn thành' },
    CANCELLED: { bg: '#e5e7eb', color: '#374151', label: 'Đã hủy' }
  };
  const s = config[status] || { bg: '#f3f4f6', color: '#6b7280', label: status || 'N/A' };
  return (
    <span style={{
      padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
      backgroundColor: s.bg, color: s.color
    }}>
      {s.label}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const p = (priority || '').toUpperCase();
  const config = {
    HIGHEST: { bg: '#fef2f2', color: '#b91c1c', label: '🔴 Khẩn cấp' },
    HIGH: { bg: '#fef2f2', color: '#dc2626', label: '🟠 Cao' },
    MEDIUM: { bg: '#fff7ed', color: '#c2410c', label: '🟡 TB' },
    LOW: { bg: '#f0fdf4', color: '#15803d', label: '🟢 Thấp' },
    LOWEST: { bg: '#f8fafc', color: '#64748b', label: '⚪ Rất thấp' }
  };
  const pConfig = config[p] || config.MEDIUM;
  return (
    <span style={{
      padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
      backgroundColor: pConfig.bg, color: pConfig.color
    }}>
      {pConfig.label}
    </span>
  );
}

function getStatusTextColor(bgColor) {
  if (!bgColor) return '#475569';
  // Simple contrast check
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? '#0f172a' : '#ffffff';
}
