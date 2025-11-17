import { styles } from '../AccountingManagerDashboard.styles'

// Navigation Item Component
export function NavItem({ active, onClick, children, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.navItem,
        ...(active ? styles.navItemActive : {})
      }}
    >
      <span style={styles.navIcon}>{icon}</span>
      <span>{children}</span>
    </button>
  )
}

// Role Badge Component
export function RoleBadge({ role }) {
  return (
    <div style={styles.roleBadge}>
      {role}
    </div>
  )
}

// KPI Card Component
export function KPICard({ title, value, icon, color, change }) {
  const getColorStyle = (color) => {
    switch (color) {
      case 'success':
        return {
          background: 'linear-gradient(145deg, #10b981, #059669)',
          iconBg: 'rgba(16, 185, 129, 0.2)',
          iconColor: '#10b981'
        }
      case 'warning':
        return {
          background: 'linear-gradient(145deg, #f59e0b, #d97706)',
          iconBg: 'rgba(245, 158, 11, 0.2)',
          iconColor: '#f59e0b'
        }
      case 'info':
        return {
          background: 'linear-gradient(145deg, #3b82f6, #2563eb)',
          iconBg: 'rgba(59, 130, 246, 0.2)',
          iconColor: '#3b82f6'
        }
      case 'primary':
        return {
          background: 'linear-gradient(145deg, #059669, #047857)',
          iconBg: 'rgba(5, 150, 105, 0.2)',
          iconColor: '#059669'
        }
      default:
        return {
          background: 'linear-gradient(145deg, #059669, #047857)',
          iconBg: 'rgba(5, 150, 105, 0.2)',
          iconColor: '#059669'
        }
    }
  }

  const colorStyle = getColorStyle(color)

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 20,
      padding: 24,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16
      }}>
        <div>
          <div style={{
            fontSize: 14,
            color: '#7b809a',
            fontWeight: 500,
            marginBottom: 8
          }}>
            {title}
          </div>
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#344767'
          }}>
            {value}
          </div>
        </div>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: colorStyle.iconBg,
          display: 'grid',
          placeItems: 'center',
          fontSize: 24,
          color: colorStyle.iconColor
        }}>
          {icon}
        </div>
      </div>
      <div style={{
        fontSize: 13,
        color: change.startsWith('+') ? '#10b981' : '#dc2626',
        fontWeight: 600
      }}>
        {change} so với tháng trước
      </div>
    </div>
  )
}

// Status Badge Component
export function StatusBadge({ status }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'normal':
        return { bg: '#10b981', text: 'Bình thường' }
      case 'late':
        return { bg: '#f59e0b', text: 'Đi muộn' }
      case 'early':
        return { bg: '#3b82f6', text: 'Về sớm' }
      default:
        return { bg: '#6b7280', text: 'Không xác định' }
    }
  }

  const statusStyle = getStatusStyle(status)

  return (
    <span style={{
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      color: '#ffffff',
      background: statusStyle.bg
    }}>
      {statusStyle.text}
    </span>
  )
}

// Leave Status Bar Component
export function LeaveStatusBar({ status }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return { color: '#10b981', text: 'Đã duyệt', width: '100%' }
      case 'pending':
        return { color: '#f59e0b', text: 'Chờ duyệt', width: '60%' }
      case 'rejected':
        return { color: '#dc2626', text: 'Từ chối', width: '100%' }
      default:
        return { color: '#6b7280', text: 'Không xác định', width: '0%' }
    }
  }

  const config = getStatusConfig(status)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        flex: 1,
        height: 6,
        background: '#f1f5f9',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <div style={{
          width: config.width,
          height: '100%',
          background: config.color,
          borderRadius: 3,
          transition: 'width 0.3s ease'
        }} />
      </div>
      <span style={{
        fontSize: 12,
        fontWeight: 600,
        color: config.color,
        minWidth: 70
      }}>
        {config.text}
      </span>
    </div>
  )
}

// Approval Status Badge Component
export function ApprovalStatusBadge({ status }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return { 
          bg: 'linear-gradient(145deg, #10b981, #059669)', 
          text: 'Đã duyệt',
          shadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
        }
      case 'pending':
        return { 
          bg: 'linear-gradient(145deg, #f59e0b, #d97706)', 
          text: 'Chờ duyệt',
          shadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
        }
      case 'rejected':
        return { 
          bg: 'linear-gradient(145deg, #dc2626, #991b1b)', 
          text: 'Từ chối',
          shadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
        }
      default:
        return { 
          bg: 'linear-gradient(145deg, #6b7280, #4b5563)', 
          text: 'Không xác định',
          shadow: '0 2px 8px rgba(107, 114, 128, 0.3)'
        }
    }
  }

  const statusStyle = getStatusStyle(status)

  return (
    <span style={{
      padding: '6px 14px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 600,
      color: '#ffffff',
      background: statusStyle.bg,
      boxShadow: statusStyle.shadow,
      border: 'none'
    }}>
      {statusStyle.text}
    </span>
  )
}
