import { useState, useEffect } from 'react'
import { styles } from './ProjectDetailPage.styles'
import { projectApi } from '../api/projectApi'
import { issueApi } from '../api/issueApi'
import ListView from '../components/ListView'
import KanbanView from '../components/KanbanView'

export default function ProjectDetailPage({ projectId, onBack }) {
  const [project, setProject] = useState(null)
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('list') // 'list' or 'kanban'

  useEffect(() => {
    loadProjectData()
  }, [projectId])

  const loadProjectData = async () => {
    setLoading(true)
    try {
      // Load project details
      const projectData = await projectApi.getProjectById(projectId)
      setProject(projectData)

      // Load project issues
      const issuesData = await issueApi.getProjectIssues(projectId)
      setIssues(issuesData)
    } catch (error) {
      console.error('Error loading project data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToProjects = () => {
    if (onBack) {
      onBack()
    }
  }

  const handleIssueUpdate = async () => {
    // Reload issues after update
    try {
      const issuesData = await issueApi.getProjectIssues(projectId)
      setIssues(issuesData)
    } catch (error) {
      console.error('Error reloading issues:', error)
    }
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Đang tải dự án...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorText}>Không tìm thấy dự án</div>
        <button style={styles.backButton} onClick={handleBackToProjects}>
          ← Quay lại danh sách dự án
        </button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backButton} onClick={handleBackToProjects}>
            ← Quay lại
          </button>
          <div style={styles.projectIcon}>📁</div>
          <div style={styles.projectInfo}>
            <h1 style={styles.projectName}>{project.name}</h1>
            {project.description && (
              <p style={styles.projectDescription}>{project.description}</p>
            )}
          </div>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.actionButton}>
            📞 Cuộc gọi video
          </button>
          <button style={styles.actionButton}>
            Giới thiệu về dự án
          </button>
          <button style={styles.moreButton}>⋯</button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={styles.tabsContainer}>
        <div style={styles.tabsList}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'list' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('list')}
          >
            Danh sách
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'kanban' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('kanban')}
          >
            Kanban
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div style={styles.contentContainer}>
        {activeTab === 'list' ? (
          <ListView 
            issues={issues} 
            projectId={projectId}
            onUpdate={handleIssueUpdate}
          />
        ) : (
          <KanbanView 
            issues={issues} 
            projectId={projectId}
            onUpdate={handleIssueUpdate}
          />
        )}
      </div>
    </div>
  )
}
