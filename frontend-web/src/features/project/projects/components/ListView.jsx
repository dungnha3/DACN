import { useEffect, useState } from 'react'
import { styles } from './ListView.styles'
import { projectApi } from '../api/projectApi'
import { issueApi } from '../api/issueApi'

export default function ListView({ issues, projectId, onUpdate }) {
  const [members, setMembers] = useState([])
  const [openMenuId, setOpenMenuId] = useState(null) // State quản lý menu nào đang mở

  useEffect(() => {
    const loadMembers = async () => {
      if (!projectId) return
      try {
        const data = await projectApi.getProjectMembers(projectId)
        setMembers(data || [])
      } catch (e) {
        setMembers([])
      }
    }

    loadMembers()
  }, [projectId])

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

  // Xử lý chọn thành viên
  const handleSelectMember = async (issueId, assigneeId) => {
    setOpenMenuId(null) // Đóng menu sau khi chọn
    try {
      await issueApi.assignIssue(issueId, assigneeId)
      if (onUpdate) {
        await onUpdate()
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Component hiển thị Avatar user (có màu)
  const UserAvatar = ({ name, size = '28px', fontSize = '12px' }) => (
    <div style={{ ...styles.userAvatar, width: size, height: size, fontSize: fontSize }}>
      {name?.charAt(0)?.toUpperCase() || 'U'}
    </div>
  )

  // Component hiển thị Avatar rỗng (Icon người xám)
  const EmptyAvatarIcon = () => (
    <div style={styles.emptyAvatar}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )

  if (issues.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>✓</div>
        <div style={styles.emptyTitle}>Dự án đã được tạo</div>
        <div style={styles.emptyText}>
          Chưa có tác vụ nào. Hãy tạo tác vụ đầu tiên của bạn.
        </div>
        <button style={styles.createButton}>Tạo một tác vụ</button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Lớp phủ vô hình để đóng menu khi click ra ngoài */}
      {openMenuId && (
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 10, cursor: 'default' }} 
          onClick={() => setOpenMenuId(null)}
        />
      )}

      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <button style={styles.filterButton}>☆ Tên</button>
          <button style={styles.filterButton}>Giai đoạn Kanban</button>
          <button style={styles.filterButton}>Hoạt động ▼</button>
          <button style={styles.filterButton}>Hạn chốt</button>
          <button style={styles.filterButton}>Người tạo</button>
          <button style={styles.filterButton}>Người được phân công</button>
        </div>
        <div style={styles.toolbarRight}>
          <button style={styles.iconButton}>🔍</button>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHead}>
            <tr>
              <th style={styles.tableHeader}><input type="checkbox" style={styles.checkbox} /></th>
              <th style={styles.tableHeader}>Tên</th>
              <th style={styles.tableHeader}>Giai đoạn Kanban</th>
              <th style={styles.tableHeader}>Hoạt động</th>
              <th style={styles.tableHeader}>Hạn chốt</th>
              <th style={styles.tableHeader}>Người tạo</th>
              {/* Đã sửa lỗi style ở dòng dưới */}
              <th style={{ ...styles.tableHeader, minWidth: '180px' }}>Người được phân công</th> 
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
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(issue.statusName) + '20',
                    color: getStatusColor(issue.statusName),
                  }}>
                    {issue.statusName || 'N/A'}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <span style={{
                    ...styles.priorityBadge,
                    backgroundColor: getPriorityColor(issue.priority) + '20',
                    color: getPriorityColor(issue.priority),
                  }}>
                    {getPriorityLabel(issue.priority)}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  {formatDate(issue.dueDate)}
                </td>
                <td style={styles.tableCell}>
                  <div style={styles.userInfo}>
                    <UserAvatar name={issue.reporterName} />
                    <span style={styles.userName}>
                      {issue.reporterName || 'N/A'}
                    </span>
                  </div>
                </td>

                {/* --- CỘT NGƯỜI ĐƯỢC PHÂN CÔNG (LOGIC MỚI) --- */}
                <td style={styles.tableCell}>
                  <div 
                    style={styles.assigneeContainer}
                    onClick={() => setOpenMenuId(openMenuId === issue.issueId ? null : issue.issueId)}
                    title="Nhấn để thay đổi người thực hiện"
                  >
                    {issue.assigneeName ? (
                      // 1. Đã có người: Hiện Avatar + Tên
                      <>
                        <UserAvatar name={issue.assigneeName} />
                        <span style={styles.assigneeNameText}>{issue.assigneeName}</span>
                      </>
                    ) : (
                      // 2. Chưa có người: Hiện Icon rỗng + Text "Chưa gán"
                      <>
                        <EmptyAvatarIcon />
                        <span style={styles.unassignedText}>Chưa gán</span>
                      </>
                    )}

                    {/* Dropdown Menu */}
                    {openMenuId === issue.issueId && members.length > 0 && (
                      <div style={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.dropdownHeader}>Chọn thành viên</div>
                        
                        {/* Option Bỏ gán (Unassign) */}
                         <div 
                            style={styles.dropdownItem}
                            onClick={() => handleSelectMember(issue.issueId, null)}
                          >
                            <EmptyAvatarIcon />
                            <span style={styles.dropdownItemName}>-- Chưa gán --</span>
                        </div>

                        {/* Danh sách thành viên */}
                        {members.map((m) => (
                          <div 
                            key={m.userId} 
                            style={styles.dropdownItem}
                            onClick={() => handleSelectMember(issue.issueId, m.userId)}
                          >
                            <UserAvatar name={m.username} size="24px" fontSize="10px" />
                            <span style={styles.dropdownItemName}>{m.username}</span>
                            {m.role && <span style={styles.roleBadge}>{m.role}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                {/* ----------------------------------------------- */}

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