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

// Role Badge Component with Avatar
export function RoleBadge({ role, avatarUrl }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px',
        background: '#f1f5f9',
        borderRadius: 20,
        fontSize: 14,
        fontWeight: 500,
        color: '#475569',
      }}>
        <span>👔</span>
        <span>{role}</span>
      </div>
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="Avatar"
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        />
      )}
    </div>
  )
}

// ========== NEW MODERN COMPONENTS ==========

// Modern Stat Card Component (matching Employee Dashboard)
export function StatCard({ title, value, subtext, icon, accentColor = '#3b82f6', onClick, loading = false, highlight = false }) {
  const cardStyle = {
    background: '#fff',
    padding: 24,
    borderRadius: 16,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    cursor: onClick ? 'pointer' : 'default',
    border: '1px solid #f1f5f9',
    borderLeft: highlight ? `4px solid ${accentColor}` : '1px solid #f1f5f9',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  };

  const iconStyle = {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    background: `${accentColor}15`,
    color: accentColor
  };

  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#94a3b8' }}>Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle} onClick={onClick}>
      <div style={headerStyle}>
        <div style={iconStyle}>{icon}</div>
        {highlight && (
          <div style={{
            padding: '2px 8px',
            background: '#fee2e2',
            color: '#ef4444',
            borderRadius: 100,
            fontSize: 11,
            fontWeight: 600
          }}>Cần xử lý</div>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginTop: 8 }}>{title}</div>
      {subtext && <div style={{ fontSize: 13, color: highlight ? accentColor : '#94a3b8', marginTop: 4 }}>{subtext}</div>}
    </div>
  );
}

// Project Stats Card - Shows project progress
export function ProjectStatsCard({ projects = [], loading = false, onViewAll }) {
  const cardStyle = {
    background: '#fff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f1f5f9'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  };

  const iconBgStyle = {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18
  };

  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={iconBgStyle}>🏗️</div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Tiến độ dự án</h3>
          </div>
        </div>
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
          Đang tải...
        </div>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={iconBgStyle}>🏗️</div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Tiến độ dự án</h3>
          </div>
        </div>
        <EmptyState message="Chưa có dự án nào" icon="📁" />
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={iconBgStyle}>🏗️</div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Tiến độ dự án</h3>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#3b82f6',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Xem tất cả →
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {projects.slice(0, 4).map((project, idx) => {
          const completionRate = project.totalIssues > 0
            ? Math.round((project.completedIssues / project.totalIssues) * 100)
            : 0;

          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>
                  {project.projectName || project.name || `Project ${idx + 1}`}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#3b82f6' }}>
                  {completionRate}%
                </span>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${completionRate}%`,
                  background: completionRate === 100 ? '#10b981' : 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
                  borderRadius: 4,
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#64748b' }}>
                <span>✅ {project.completedIssues || 0} hoàn thành</span>
                <span>🔄 {project.inProgressIssues || 0} đang làm</span>
                <span>📋 {project.todoIssues || 0} chờ</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Pending Approvals Widget
export function PendingApprovalsWidget({ leaves = [], loading = false, onApprove, onReject, onViewAll }) {
  const cardStyle = {
    background: '#fff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f1f5f9',
    height: '100%'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  };

  const iconBgStyle = {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: '#fef3c7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={iconBgStyle}>📋</div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Đơn chờ duyệt</h3>
          </div>
        </div>
        <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
          Đang tải...
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={iconBgStyle}>📋</div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Đơn chờ duyệt</h3>
        </div>
        {leaves.length > 0 && (
          <span style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '4px 10px',
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 600
          }}>
            {leaves.length} đơn
          </span>
        )}
      </div>

      {leaves.length === 0 ? (
        <EmptyState message="Không có đơn chờ duyệt" icon="✅" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {leaves.slice(0, 3).map((leave, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 12,
              background: '#fefce8',
              borderRadius: 10,
              border: '1px solid #fef08a'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>
                  {leave.nhanVien?.hoTen || leave.tenNhanVien || 'Nhân viên'}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {leave.loaiNghiPhep || 'Nghỉ phép'} • {formatDate(leave.ngayBatDau)} - {formatDate(leave.ngayKetThuc)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => onApprove && onApprove(leave.nghiphepId)}
                  style={{
                    background: '#dcfce7',
                    color: '#16a34a',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ✓
                </button>
                <button
                  onClick={() => onReject && onReject(leave.nghiphepId)}
                  style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ✗
                </button>
              </div>
            </div>
          ))}

          {leaves.length > 3 && onViewAll && (
            <button
              onClick={onViewAll}
              style={{
                background: '#f1f5f9',
                border: 'none',
                padding: '10px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: '#3b82f6',
                cursor: 'pointer'
              }}
            >
              Xem thêm {leaves.length - 3} đơn →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Quick Action Button
export function QuickActionButton({ icon, label, onClick, color = '#3b82f6' }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: 16,
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        cursor: 'pointer',
        transition: 'all 0.2s',
        flex: 1
      }}
    >
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: `${color}15`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>{label}</span>
    </button>
  );
}

// Empty State Component
export function EmptyState({ message, icon }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      color: '#94a3b8'
    }}>
      <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>{icon}</div>
      <div style={{ fontSize: 14 }}>{message}</div>
    </div>
  );
}

// ========== LEGACY COMPONENTS (kept for compatibility) ==========

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

// Status Badge Component for Attendance
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

// Leave Status Bar Component
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

// Role Badge for Project
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
