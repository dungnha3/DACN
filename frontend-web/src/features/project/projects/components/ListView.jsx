import { styles } from './ListView.styles'

export default function ListView({ issues, projectId, onUpdate }) {
  const getStatusColor = (statusName) => {
    const statusColors = {
      'To Do': '#94a3b8',
      'In Progress': '#3b82f6',
      'Review': '#f59e0b',
      'Done': '#10b981'
    }
    return statusColors[statusName] || '#94a3b8'
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
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  if (issues.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>✓</div>
        <div style={styles.emptyTitle}>Dự án đã được tạo</div>
        <div style={styles.emptyText}>
          Chế độ xem này sẽ hiển thị các tác vụ mà bạn và/hoặc nhân viên của bạn
          có trách nhiệm thực hiện. Hãy tạo tác vụ đầu tiên của bạn để thấy nó trên
          trang này.
        </div>
        <button style={styles.createButton}>Tạo một tác vụ</button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <button style={styles.filterButton}>
            ☆ Tên
          </button>
          <button style={styles.filterButton}>
            Giải đoạn Kanban
          </button>
          <button style={styles.filterButton}>
            Hoạt động ▼
          </button>
          <button style={styles.filterButton}>
            Hạn chốt
          </button>
          <button style={styles.filterButton}>
            Người tạo
          </button>
          <button style={styles.filterButton}>
            Người được phân công
          </button>
          <button style={styles.filterButton}>
            Dự án
          </button>
          <button style={styles.filterButton}>
            Lượng
          </button>
          <button style={styles.filterButton}>
            Thẻ
          </button>
        </div>
        <div style={styles.toolbarRight}>
          <button style={styles.iconButton}>🔍</button>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHead}>
            <tr>
              <th style={styles.tableHeader}>
                <input type="checkbox" style={styles.checkbox} />
              </th>
              <th style={styles.tableHeader}>Tên</th>
              <th style={styles.tableHeader}>Giai đoạn Kanban</th>
              <th style={styles.tableHeader}>Hoạt động</th>
              <th style={styles.tableHeader}>Hạn chốt</th>
              <th style={styles.tableHeader}>Người tạo</th>
              <th style={styles.tableHeader}>Người được phân công</th>
              <th style={styles.tableHeader}>Dự án</th>
              <th style={styles.tableHeader}>Lượng</th>
              <th style={styles.tableHeader}>Thẻ</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.issueId} style={styles.tableRow}>
                <td style={styles.tableCell}>
                  <input type="checkbox" style={styles.checkbox} />
                </td>
                <td style={styles.tableCell}>
                  <div style={styles.issueName}>
                    <span style={styles.issueKey}>{issue.issueKey}</span>
                    {issue.title}
                  </div>
                </td>
                <td style={styles.tableCell}>
                  <span 
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(issue.statusName) + '20',
                      color: getStatusColor(issue.statusName),
                    }}
                  >
                    {issue.statusName || 'N/A'}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <span 
                    style={{
                      ...styles.priorityBadge,
                      backgroundColor: getPriorityColor(issue.priority) + '20',
                      color: getPriorityColor(issue.priority),
                    }}
                  >
                    {getPriorityLabel(issue.priority)}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  {formatDate(issue.dueDate)}
                </td>
                <td style={styles.tableCell}>
                  <div style={styles.userInfo}>
                    <div style={styles.userAvatar}>
                      {issue.reporterName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span style={styles.userName}>
                      {issue.reporterName || 'N/A'}
                    </span>
                  </div>
                </td>
                <td style={styles.tableCell}>
                  {issue.assigneeName ? (
                    <div style={styles.userInfo}>
                      <div style={styles.userAvatar}>
                        {issue.assigneeName.charAt(0).toUpperCase()}
                      </div>
                      <span style={styles.userName}>
                        {issue.assigneeName}
                      </span>
                    </div>
                  ) : (
                    <span style={styles.unassigned}>Chưa gán</span>
                  )}
                </td>
                <td style={styles.tableCell}>
                  {issue.projectName || '-'}
                </td>
                <td style={styles.tableCell}>
                  {issue.estimatedHours ? `${issue.estimatedHours}h` : '-'}
                </td>
                <td style={styles.tableCell}>
                  -
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
