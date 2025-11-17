import { styles } from '../HrManagerDashboard.styles'

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

// KPI Card Component - Updated for HR Manager theme
export function KPICard({ title, value, icon, color, change }) {
  // All cards use white background with gray/yellow accents
  const cardStyle = {
    ...styles.kpiCard,
    background: '#fff',
    borderColor: '#e5e7eb'
  }

  return (
    <div style={cardStyle}>
      <div style={styles.kpiHeader}>
        <div style={styles.kpiTitle}>{title}</div>
        <div style={{ ...styles.kpiIcon, color: '#f59e0b' }}>{icon}</div>
      </div>
      <div style={{ ...styles.kpiValue, color: '#374151' }}>{value}</div>
      <div style={{ ...styles.kpiChange, color: '#6b7280' }}>{change}</div>
    </div>
  )
}

// Status Badge Component for Attendance - Updated for HR Manager theme
export function StatusBadge({ status }) {
  const statuses = {
    normal: { label: '✓ Đúng giờ', bg: '#e5e7eb', color: '#374151', border: '#d1d5db' },
    late: { label: '⚠ Đi muộn', bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
    early: { label: '⏰ Về sớm', bg: '#fef3c7', color: '#d97706', border: '#fde68a' }
  }
  const s = statuses[status] || statuses.normal

  return (
    <div style={{ ...styles.statusBadge, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </div>
  )
}

// Leave Status Bar Component - Updated for HR Manager theme
export function LeaveStatusBar({ status }) {
  const statuses = {
    approved: { width: '100%', bg: '#374151', label: '100% - Đã duyệt' },
    pending: { width: '30%', bg: '#f59e0b', label: '30% - Chờ duyệt' },
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

// Approval Status Badge Component - Updated for HR Manager theme
export function ApprovalStatusBadge({ status }) {
  const statuses = {
    pending: { label: '⏳ Chờ duyệt', bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
    approved: { label: '✓ Đã duyệt', bg: '#e5e7eb', color: '#374151', border: '#d1d5db' },
    rejected: { label: '✗ Từ chối', bg: '#fee2e2', color: '#991b1b', border: '#fecaca' }
  }
  const s = statuses[status] || statuses.pending

  return (
    <div style={{ ...styles.statusBadge, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </div>
  )
}
