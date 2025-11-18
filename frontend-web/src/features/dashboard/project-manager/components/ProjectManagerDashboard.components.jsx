import { styles } from '../ProjectManagerDashboard.styles'

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
      <span>👔 {role}</span>
    </div>
  )
}

// KPI Card Component - Simplified color scheme
export function KPICard({ title, value, icon, color, change }) {
  // Simplified: All cards use white background with blue/red accents
  const cardStyle = {
    ...styles.kpiCard,
    background: '#fff',
    borderColor: '#e5e7eb'
  }

  return (
    <div style={cardStyle}>
      <div style={styles.kpiHeader}>
        <div style={styles.kpiTitle}>{title}</div>
        <div style={{ ...styles.kpiIcon, color: '#dc2626' }}>{icon}</div>
      </div>
      <div style={{ ...styles.kpiValue, color: '#1e3a8a' }}>{value}</div>
      <div style={{ ...styles.kpiChange, color: '#6b7280' }}>{change}</div>
    </div>
  )
}

// Status Badge Component for Attendance - Simplified colors
export function StatusBadge({ status }) {
  const statuses = {
    normal: { label: '✓ Đúng giờ', bg: '#dbeafe', color: '#1e3a8a', border: '#93c5fd' },
    late: { label: '⚠ Đi muộn', bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
    early: { label: '⏰ Về sớm', bg: '#e5e7eb', color: '#374151', border: '#d1d5db' }
  }
  const s = statuses[status] || statuses.normal

  return (
    <div style={{ ...styles.statusBadge, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </div>
  )
}

// Leave Status Bar Component - Simplified to blue/red only
export function LeaveStatusBar({ status }) {
  const statuses = {
    approved: { width: '100%', bg: '#1e3a8a', label: '100% - Đã duyệt' },
    pending: { width: '30%', bg: '#6b7280', label: '30% - Chờ duyệt' },
    rejected: { width: '100%', bg: '#dc2626', label: '100% - Từ chối' }
  }
  const s = statuses[status] || statuses.pending

  return (
    <div style={styles.statusBarWrap}>
      <div style={{ ...styles.statusBar, width: s.width, background: s.bg }} />
      <span style={styles.statusBarLabel}>{s.label}</span>
    </div>
  )
}

// Approval Status Badge Component
export function ApprovalStatusBadge({ status }) {
  const statuses = {
    pending: { label: '⏳ Chờ duyệt', bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
    approved: { label: '✓ Đã duyệt', bg: '#dbeafe', color: '#1e3a8a', border: '#93c5fd' },
    rejected: { label: '✗ Từ chối', bg: '#fee2e2', color: '#991b1b', border: '#fecaca' }
  }
  const s = statuses[status] || statuses.pending

  return (
    <div style={{ ...styles.statusBadge, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </div>
  )
}

// Member Avatar Component
export function MemberAvatar({ color = '#65B741' }) {
  return (
    <div style={{
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      background: color,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '12px',
      marginRight: '-8px',
      border: '2px solid #fff'
    }}>👤</div>
  )
}

// Role Badge Component
export function RoleBadgeProject({ role }) {
  const roleStyle = role.includes('Người quản lý') 
    ? { bg: '#d4edda', color: '#155724', text: role }
    : { bg: '#e2e3e5', color: '#383d41', text: role }
  
  return (
    <div style={{
      display: 'inline-block',
      background: roleStyle.bg,
      color: roleStyle.color,
      padding: '6px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600',
      whiteSpace: 'nowrap'
    }}>
      {roleStyle.text}
    </div>
  )
}
