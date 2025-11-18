import { useState, useEffect } from 'react'
import { styles } from './IssueDetailPage.styles'
import { issueApi } from '../api/issueApi'
import { commentApi } from '../api/commentApi'
import { activityApi } from '../api/activityApi'

export default function IssueDetailPage({ issueId, onBack }) {
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('comments') // comments | history
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState(null)
  const [loadingComments, setLoadingComments] = useState(false)
  const [activities, setActivities] = useState([])
  const [loadingActivities, setLoadingActivities] = useState(false)

  useEffect(() => {
    loadIssue()
    loadComments()
    loadActivities()
  }, [issueId])

  const loadIssue = async () => {
    setLoading(true)
    try {
      const data = await issueApi.getIssueById(issueId)
      setIssue(data)
    } catch (error) {
      console.error('Error loading issue:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadComments = async () => {
    setLoadingComments(true)
    try {
      const data = await commentApi.getIssueComments(issueId)
      setComments(data)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await commentApi.createComment({
        issueId: issueId,
        content: newComment
      })
      setNewComment('')
      loadComments()
    } catch (error) {
      console.error('Error creating comment:', error)
      alert('Không thể tạo bình luận')
    }
  }

  const handleUpdateComment = async (commentId, content) => {
    try {
      await commentApi.updateComment(commentId, content)
      setEditingComment(null)
      loadComments()
    } catch (error) {
      console.error('Error updating comment:', error)
      alert('Không thể cập nhật bình luận')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return

    try {
      await commentApi.deleteComment(commentId)
      loadComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Không thể xóa bình luận')
    }
  }

  const loadActivities = async () => {
    setLoadingActivities(true)
    try {
      const data = await activityApi.getIssueActivities(issueId)
      setActivities(data)
    } catch (error) {
      console.error('Error loading activities:', error)
    } finally {
      setLoadingActivities(false)
    }
  }

  const getActivityIcon = (activityType) => {
    const icons = {
      'CREATED': '🆕',
      'STATUS_CHANGED': '🔄',
      'ASSIGNEE_CHANGED': '👤',
      'PRIORITY_CHANGED': '⚡',
      'SPRINT_CHANGED': '🏃',
      'DUE_DATE_CHANGED': '📅',
      'ESTIMATED_HOURS_CHANGED': '⏱️',
      'ACTUAL_HOURS_CHANGED': '⏰',
      'TITLE_CHANGED': '✏️',
      'DESCRIPTION_CHANGED': '📝',
      'COMMENT_ADDED': '💬',
      'COMMENT_EDITED': '✍️',
      'COMMENT_DELETED': '🗑️'
    }
    return icons[activityType] || '📌'
  }

  const getActivityColor = (activityType) => {
    const colors = {
      'CREATED': '#10b981',
      'STATUS_CHANGED': '#f59e0b',
      'ASSIGNEE_CHANGED': '#8b5cf6',
      'PRIORITY_CHANGED': '#ef4444',
      'SPRINT_CHANGED': '#3b82f6',
      'DUE_DATE_CHANGED': '#ec4899',
      'ESTIMATED_HOURS_CHANGED': '#6366f1',
      'ACTUAL_HOURS_CHANGED': '#06b6d4',
      'TITLE_CHANGED': '#3b82f6',
      'DESCRIPTION_CHANGED': '#3b82f6',
      'COMMENT_ADDED': '#6b7280',
      'COMMENT_EDITED': '#6b7280',
      'COMMENT_DELETED': '#ef4444'
    }
    return colors[activityType] || '#6b7280'
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Đang tải dữ liệu...</div>
      </div>
    )
  }

  if (!issue) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorText}>Không tìm thấy tác vụ</div>
        <button style={styles.backButton} onClick={onBack}>← Quay lại</button>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Không có'
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (statusName) => {
    const colors = {
      'To Do': '#94a3b8',
      'In Progress': '#3b82f6',
      'Review': '#9C27B0',
      'Done': '#10b981'
    }
    return colors[statusName] || '#94a3b8'
  }

  const getPriorityLabel = (priority) => {
    const labels = {
      'LOW': 'Thấp',
      'MEDIUM': 'Trung bình',
      'HIGH': 'Cao',
      'CRITICAL': 'Khẩn cấp'
    }
    return labels[priority] || priority
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backButton} onClick={onBack}>← Quay lại</button>
          <h2 style={styles.title}>
            {issue.issueKey} - {issue.title}
          </h2>
          <button style={styles.starButton}>⭐</button>
        </div>
        <div style={styles.headerRight}>
          <select style={styles.dropdown}>
            <option>Chọn một lường</option>
          </select>
          <button style={styles.iconButton}>👤</button>
          <button style={styles.iconButton}>⚙️</button>
          <button style={styles.actionButton}>Thêm</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Left Panel */}
        <div style={styles.leftPanel}>
          {/* Priority Badge */}
          <div style={styles.prioritySection}>
            <span 
              style={{
                ...styles.priorityBadge,
                backgroundColor: issue.priority === 'HIGH' || issue.priority === 'CRITICAL' ? '#fee2e2' : '#e0f2fe',
                color: issue.priority === 'HIGH' || issue.priority === 'CRITICAL' ? '#991b1b' : '#0369a1'
              }}
            >
              {issue.priority === 'HIGH' || issue.priority === 'CRITICAL' ? '⚠️' : 'ℹ️'} Ưu tiên {getPriorityLabel(issue.priority)}
            </span>
          </div>

          {/* Add Checklist */}
          <div style={styles.addSection}>
            <button style={styles.addButton}>+ Thêm một danh sách kiểm tra</button>
          </div>

          {/* Project Info */}
          <div style={styles.projectInfo}>
            <p style={styles.projectText}>
              Tác vụ này nằm trong dự án (nhóm): <strong>{issue.projectName}</strong>
            </p>
          </div>

          {/* Description */}
          {issue.description && (
            <div style={styles.descriptionSection}>
              <h3 style={styles.sectionTitle}>Mô tả</h3>
              <p style={styles.descriptionText}>{issue.description}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button style={styles.startButton}>BẮT ĐẦU</button>
            <button style={styles.completeButton}>HOÀN THÀNH</button>
            <button style={styles.moreButton}>THÊM...</button>
            <button style={styles.editButton}>SỬA</button>
          </div>

          {/* Tabs */}
          <div style={styles.tabs}>
            <button 
              style={{...styles.tab, ...(activeTab === 'comments' ? styles.tabActive : {})}}
              onClick={() => setActiveTab('comments')}
            >
              Ghi chú <span style={styles.tabCount}>{comments.length}</span>
            </button>
            <button 
              style={{...styles.tab, ...(activeTab === 'history' ? styles.tabActive : {})}}
              onClick={() => setActiveTab('history')}
            >
              Lịch sử <span style={styles.tabCount}>{activities.filter(a => a.activityType === 'STATUS_CHANGED').length}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div style={styles.tabContent}>
            {activeTab === 'comments' && (
              <div style={styles.commentSection}>
                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} style={styles.commentInput}>
                  <div style={styles.avatar}>👤</div>
                  <input 
                    type="text" 
                    placeholder="Thêm bình luận" 
                    style={styles.input}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  {newComment.trim() && (
                    <button type="submit" style={styles.submitCommentBtn}>
                      Gửi
                    </button>
                  )}
                </form>

                {/* Comments List */}
                <div style={styles.commentsList}>
                  {loadingComments ? (
                    <p style={styles.loadingText}>Đang tải bình luận...</p>
                  ) : comments.length === 0 ? (
                    <p style={styles.emptyText}>Chưa có bình luẫn nào</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.commentId} style={styles.commentItem}>
                        <div style={styles.commentHeader}>
                          <div style={styles.commentAuthor}>
                            <div style={styles.userAvatar}>
                              {comment.authorName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div style={styles.authorName}>{comment.authorName}</div>
                              <div style={styles.commentDate}>
                                {new Date(comment.createdAt).toLocaleString('vi-VN')}
                              </div>
                            </div>
                          </div>
                          <div style={styles.commentActions}>
                            <button 
                              style={styles.editCommentBtn}
                              onClick={() => setEditingComment(comment.commentId)}
                            >
                              Sửa
                            </button>
                            <button 
                              style={styles.deleteCommentBtn}
                              onClick={() => handleDeleteComment(comment.commentId)}
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                        
                        {editingComment === comment.commentId ? (
                          <div style={styles.editCommentForm}>
                            <input
                              type="text"
                              defaultValue={comment.content}
                              style={styles.input}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleUpdateComment(comment.commentId, e.target.value)
                                }
                                if (e.key === 'Escape') {
                                  setEditingComment(null)
                                }
                              }}
                              autoFocus
                            />
                            <button
                              style={styles.cancelEditBtn}
                              onClick={() => setEditingComment(null)}
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <div style={styles.commentContent}>{comment.content}</div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            {activeTab === 'history' && (
              <div style={styles.historySection}>
                {loadingActivities ? (
                  <p style={styles.loadingText}>Đang tải lịch sử...</p>
                ) : activities.filter(a => a.activityType === 'STATUS_CHANGED').length === 0 ? (
                  <p style={styles.emptyText}>Chưa có thay đổi trạng thái nào</p>
                ) : (
                  <div style={styles.activitiesList}>
                    {activities.filter(activity => activity.activityType === 'STATUS_CHANGED').map((activity) => (
                      <div key={activity.activityId} style={styles.activityItem}>
                        <div style={{
                          ...styles.activityIcon,
                          backgroundColor: getActivityColor(activity.activityType) + '20',
                          color: getActivityColor(activity.activityType)
                        }}>
                          {getActivityIcon(activity.activityType)}
                        </div>
                        <div style={styles.activityContent}>
                          <div style={styles.activityHeader}>
                            <span style={styles.activityUser}>{activity.userName}</span>
                            <span style={styles.activityAction}>{activity.description}</span>
                          </div>
                          {activity.oldValue && activity.newValue && (
                            <div style={styles.activityChange}>
                              <span style={styles.oldValue}>{activity.oldValue}</span>
                              <span style={styles.arrow}>→</span>
                              <span style={styles.newValue}>{activity.newValue}</span>
                            </div>
                          )}
                          <div style={styles.activityTime}>
                            {new Date(activity.createdAt).toLocaleString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div style={styles.rightPanel}>
          <div style={styles.infoBox}>
            <h3 style={styles.infoBoxTitle}>Đang chờ thực hiện</h3>
            <p style={styles.infoBoxSubtitle}>từ 17/11/2025 9:54 pm</p>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Hạn chót:</span>
              <span style={styles.infoValue}>
                {issue.dueDate ? formatDate(issue.dueDate) : 'Không có'}
              </span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>nhắc nhở:</span>
              <span style={{...styles.infoValue, color: '#3b82f6'}}>
                🔔 Nhắc lại
              </span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Giai đoạn:</span>
              <div style={styles.progressBar}>
                <div style={styles.progressFill}></div>
              </div>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Tự động:</span>
              <span style={styles.infoValue}>Cấu hình</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Được tạo ra:</span>
              <span style={styles.infoValue}>
                {formatDate(issue.createdAt)}
              </span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Đánh giá:</span>
              <span style={styles.infoValue}>Không có</span>
            </div>

            <button style={styles.videoCallButton}>
              📹 CUỘC GỌI VIDEO
            </button>

            <div style={styles.creatorSection}>
              <h4 style={styles.sectionLabel}>Được tạo bởi</h4>
              <div style={styles.userInfo}>
                <div style={styles.userAvatar}>
                  {issue.reporterName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span style={styles.userName}>{issue.reporterName}</span>
              </div>
            </div>

            <div style={styles.assigneeSection}>
              <h4 style={styles.sectionLabel}>
                Người được phân công
                <button style={styles.changeButton}>thay đổi</button>
              </h4>
              <div style={styles.userInfo}>
                <div style={styles.userAvatar}>
                  {issue.assigneeName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span style={styles.userName}>
                  {issue.assigneeName || 'Chưa gán'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
