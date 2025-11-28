import { dashboardBaseStyles as styles } from '@/shared/styles/dashboard'

// Navigation Item Component - Updated with collapse support
export function NavItem({ active, onClick, children, icon, collapsed }) {
  const baseStyle = {
    ...styles.navItem,
    color: active ? '#3b82f6' : '#94a3b8',
    background: active ? '#eff6ff' : 'transparent',
    justifyContent: collapsed ? 'center' : 'flex-start',
    alignItems: 'center',
    padding: collapsed ? '12px 0' : '12px',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    transition: 'background 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s cubic-bezier(0.4, 0, 0.2, 1), justify-content 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: 10,
    marginBottom: 4,
    display: 'flex',
    gap: 0,
    cursor: 'pointer',
  };

  const iconWrapperStyle = {
    minWidth: 24,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: 18,
    color: active ? '#3b82f6' : '#94a3b8',
    transition: 'color 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const textWrapperStyle = {
    marginLeft: collapsed ? 0 : 12,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const textStyle = {
    fontSize: 14,
    fontWeight: active ? 600 : 500,
    whiteSpace: 'nowrap',
    display: 'inline-block',
    transition: 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: collapsed ? 0 : 1,
    transform: collapsed ? 'translateX(-10px)' : 'translateX(0)',
  };

  return (
    <button
      onClick={onClick}
      style={baseStyle}
      title={collapsed ? children : ''}
    >
      <span style={iconWrapperStyle}>{icon}</span>
      <span style={textWrapperStyle}>
        <span style={textStyle}>{children}</span>
      </span>
      {active && !collapsed && (
        <div style={{
          position: 'absolute', 
          right: 0, 
          top: '50%', 
          transform: 'translateY(-50%)',
          width: 3, 
          height: '60%', 
          background: '#3b82f6', 
          borderTopLeftRadius: 3, 
          borderBottomLeftRadius: 3,
          transition: 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      )}
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

// KPI Card Component - Updated for Project Manager theme
export function KPICard({ title, value, icon, color, change }) {
  const colorMap = {
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
    primary: '#6366f1',
    danger: '#ef4444'
  }
  const accentColor = colorMap[color] || '#3b82f6'

  const cardStyle = {
    ...styles.kpiCard,
    background: '#fff',
    borderColor: '#e5e7eb',
    borderRadius: 16,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  }

  return (
    <div style={cardStyle}>
      <div style={styles.kpiHeader}>
        <div style={styles.kpiTitle}>{title}</div>
        <div style={{ 
          ...styles.kpiIcon, 
          width: 40, 
          height: 40, 
          borderRadius: 12, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: `${accentColor}20`, 
          color: accentColor,
          fontSize: 20
        }}>{icon}</div>
      </div>
      <div style={{ ...styles.kpiValue, color: '#0f172a', fontSize: 28, fontWeight: 700 }}>{value}</div>
      <div style={{ ...styles.kpiChange, color: '#64748b', fontSize: 13 }}>{change}</div>
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
