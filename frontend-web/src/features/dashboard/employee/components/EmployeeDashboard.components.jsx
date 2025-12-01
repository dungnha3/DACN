import { dashboardBaseStyles as styles } from '@/shared/styles/dashboard'

// Navigation Item Component - Collapsible sidebar support (like HR Manager)
export function NavItem({ active, onClick, children, icon, collapsed }) {
  const baseStyle = {
    ...styles.navItem,
    color: active ? '#3b82f6' : '#64748b',
    background: active ? '#eff6ff' : 'transparent',
    justifyContent: collapsed ? 'center' : 'flex-start',
    alignItems: 'center',
    padding: collapsed ? '12px 0' : '12px',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    transition: 'background 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: 10,
    marginBottom: 4,
    display: 'flex',
    gap: 0,
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'inherit',
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
    color: active ? '#3b82f6' : '#64748b',
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

// KPI Card Component - Modern card design
export function KPICard({ title, value, icon, color, change, loading, onClick }) {
  const cardStyle = {
    background: '#fff',
    padding: 20,
    borderRadius: 16,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    cursor: onClick ? 'pointer' : 'default',
    border: `1px solid ${color}20`,
  }

  const accentColor = color || '#3b82f6'

  return (
    <div style={cardStyle} onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ 
          width: 40, height: 40, borderRadius: 12, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: 18, background: `${accentColor}15`, color: accentColor 
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>
        {loading ? '...' : value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginTop: 8 }}>{title}</div>
      {change && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{change}</div>}
    </div>
  )
}

// Status Badge Component for Attendance
export function StatusBadge({ status }) {
  const statuses = {
    normal: { label: '✓ Đúng giờ', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    late: { label: '⚠ Đi muộn', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
    early: { label: '⏰ Về sớm', bg: '#fefce8', color: '#a16207', border: '#fef08a' }
  }
  const s = statuses[status] || statuses.normal

  return (
    <div style={{ 
      display: 'inline-flex', alignItems: 'center', padding: '4px 10px', 
      borderRadius: 100, fontSize: 12, fontWeight: 600,
      background: s.bg, color: s.color, border: `1px solid ${s.border}` 
    }}>
      {s.label}
    </div>
  )
}

// Leave Status Bar Component
export function LeaveStatusBar({ status }) {
  const statuses = {
    approved: { width: '100%', bg: '#22c55e', label: 'Đã duyệt' },
    pending: { width: '50%', bg: '#f59e0b', label: 'Chờ duyệt' },
    rejected: { width: '100%', bg: '#ef4444', label: 'Từ chối' }
  }
  const s = statuses[status] || statuses.pending

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: s.width, height: '100%', background: s.bg, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{s.label}</span>
    </div>
  )
}

// Stat Card for Dashboard
export function StatCard({ title, value, subtext, icon, accentColor, onClick, highlight }) {
  return (
    <div 
      style={{
        background: '#fff', padding: 24, borderRadius: 16, 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex', flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: highlight ? `4px solid ${accentColor}` : 'none'
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ 
          width: 40, height: 40, borderRadius: 12, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: 20, background: `${accentColor}20`, color: accentColor 
        }}>{icon}</div>
        {highlight && <div style={{ padding: '2px 8px', background: '#fee2e2', color: '#ef4444', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>Cần xử lý</div>}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginTop: 8 }}>{title}</div>
      <div style={{ fontSize: 13, marginTop: 4, color: highlight ? accentColor : '#94a3b8' }}>{subtext}</div>
    </div>
  )
}
