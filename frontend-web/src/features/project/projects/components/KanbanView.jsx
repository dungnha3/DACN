import { useState } from 'react'
import { styles } from './KanbanView.styles'
import { issueApi } from '../api/issueApi'

export default function KanbanView({ issues, projectId, onUpdate }) {
  const [draggedIssue, setDraggedIssue] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)

  // Debug: Log issues để xem structure
  console.log('KanbanView - All issues:', issues)
  if (issues.length > 0) {
    console.log('KanbanView - First issue:', issues[0])
    console.log('KanbanView - First issue statusId:', issues[0].statusId)
  }

  // Group issues by status
  const columns = [
    { id: 1, name: 'To Do', title: 'Cần làm', color: '#94a3b8' },
    { id: 2, name: 'In Progress', title: 'Đang tiến hành', color: '#3b82f6' },
    { id: 4, name: 'Done', title: 'Đã xong', color: '#10b981' },
  ]

  const getIssuesByStatus = (statusId) => {
    // Filter by statusId (backend trả về flat structure)
    const filtered = issues.filter(issue => issue.statusId === statusId)
    console.log(`Issues for status ${statusId}:`, filtered.length, filtered)
    return filtered
  }

  const getPriorityColor = (priority) => {
    const priorityColors = {
      'LOW': '#10b981',
      'MEDIUM': '#f59e0b',
      'HIGH': '#f97316',
      'CRITICAL': '#dc2626'
    }
    return priorityColors[priority] || '#94a3b8'
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

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  }

  const handleDragStart = (e, issue) => {
    console.log('Drag started:', issue.issueKey, 'Current status:', issue.statusId)
    setDraggedIssue(issue)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget)
  }

  const handleDragEnd = () => {
    console.log('Drag ended')
    setDraggedIssue(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e, columnId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = async (e, targetStatusId) => {
    e.preventDefault()
    e.stopPropagation()
    
    setDragOverColumn(null)
    
    if (!draggedIssue) {
      console.log('No dragged issue')
      return
    }

    const currentStatusId = draggedIssue.statusId
    
    console.log('Drop:', {
      issueKey: draggedIssue.issueKey,
      from: currentStatusId,
      to: targetStatusId
    })
    
    if (currentStatusId === targetStatusId) {
      console.log('Same status, no change needed')
      setDraggedIssue(null)
      return
    }

    try {
      console.log('Calling API to change status...')
      // Call API to change status
      await issueApi.changeIssueStatus(draggedIssue.issueId, targetStatusId)
      
      console.log('Status changed successfully, reloading issues...')
      // Reload issues
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error changing issue status:', error)
      alert('Không thể thay đổi trạng thái tác vụ: ' + (error.response?.data?.message || error.message))
    } finally {
      setDraggedIssue(null)
    }
  }

  if (issues.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📋</div>
        <div style={styles.emptyTitle}>Hiện không có dữ liệu nào về trang này.</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <button style={styles.createButton}>+ Tạo</button>
          <button style={styles.filterButton}>Tất cả các vai trò ▼</button>
          <button style={styles.filterButton}>Đang tiến hành ▼</button>
          <button style={styles.filterButton}>+ Tìm kiếm</button>
        </div>
      </div>

      <div style={styles.boardContainer}>
        {columns.map((column) => {
          const columnIssues = getIssuesByStatus(column.id)
          
          return (
            <div 
              key={column.id} 
              style={{
                ...styles.column,
                ...(dragOverColumn === column.id ? styles.columnDragOver : {})
              }}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div style={{
                ...styles.columnHeader,
                backgroundColor: column.color + '15',
              }}>
                <span style={{
                  ...styles.columnTitle,
                  color: column.color,
                }}>
                  {column.title}
                </span>
                {columnIssues.length > 0 && (
                  <span style={styles.columnCount}>{columnIssues.length}</span>
                )}
                <button style={styles.addButton}>+</button>
              </div>

              <div style={styles.cardList}>
                {columnIssues.map((issue) => (
                  <div
                    key={issue.issueId}
                    style={{
                      ...styles.card,
                      opacity: draggedIssue?.issueId === issue.issueId ? 0.5 : 1,
                      cursor: draggedIssue?.issueId === issue.issueId ? 'grabbing' : 'move',
                    }}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, issue)}
                    onDragEnd={handleDragEnd}
                  >
                    <div style={styles.cardHeader}>
                      <span style={styles.issueKey}>{issue.issueKey}</span>
                      {issue.dueDate && (
                        <span style={styles.dueDate}>
                          📅 {formatDate(issue.dueDate)}
                        </span>
                      )}
                    </div>

                    <div style={styles.cardTitle}>{issue.title}</div>

                    {issue.description && (
                      <div style={styles.cardDescription}>
                        {issue.description.substring(0, 80)}
                        {issue.description.length > 80 && '...'}
                      </div>
                    )}

                    <div style={styles.cardFooter}>
                      <span
                        style={{
                          ...styles.priorityBadge,
                          backgroundColor: getPriorityColor(issue.priority) + '20',
                          color: getPriorityColor(issue.priority),
                        }}
                      >
                        {getPriorityLabel(issue.priority)}
                      </span>

                      {issue.assigneeName && (
                        <div style={styles.assignee}>
                          <div style={styles.assigneeAvatar}>
                            {issue.assigneeName.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
