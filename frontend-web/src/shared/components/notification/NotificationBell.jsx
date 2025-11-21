import { useState, useEffect, useRef } from 'react'
import { notificationService } from '@/shared/services/notification.service'
import { colors, typography, spacing } from '@/shared/styles/theme'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    loadUnreadCount()
    const interval = setInterval(loadUnreadCount, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (showDropdown && notifications.length === 0) {
      loadNotifications()
    }
  }, [showDropdown])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount()
      setUnreadCount(count || 0)
    } catch (error) {
      // Silently fail
    }
  }

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await notificationService.getMyNotifications(0, 10)
      setNotifications(data || [])
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const handleNotificationClick = async (notification) => {
    if (notification.isRead === false) {
      try {
        await notificationService.markAsRead(notification.notificationId)
        setUnreadCount(prev => Math.max(0, prev - 1))
        setNotifications(notifications.map(n => 
          n.notificationId === notification.notificationId 
            ? { ...n, isRead: true } 
            : n
        ))
      } catch (error) {
        // Ignore
      }
    }

    // Navigate to link if exists
    if (notification.link) {
      window.location.href = notification.link
    }

    setShowDropdown(false)
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setUnreadCount(0)
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    } catch (error) {
      // Ignore
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Vừa xong'
    if (minutes < 60) return `${minutes} phút trước`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} giờ trước`

    const days = Math.floor(hours / 24)
    if (days < 7) return `${days} ngày trước`

    return date.toLocaleDateString('vi-VN')
  }

  const getNotificationIcon = (type) => {
    if (type?.includes('CHAT')) return '💬'
    if (type?.includes('MESSAGE')) return '✉️'
    if (type?.includes('MENTION')) return '🔔'
    if (type?.includes('MEMBER')) return '👥'
    if (type?.includes('PROJECT')) return '🏭'
    if (type?.includes('LEAVE')) return '📋'
    if (type?.includes('HR')) return '👤'
    return '📢'
  }

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button
        style={styles.bellButton}
        onClick={() => setShowDropdown(!showDropdown)}
        title="Thông báo"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <h3 style={styles.dropdownTitle}>Thông báo</h3>
            {unreadCount > 0 && (
              <button style={styles.markAllBtn} onClick={handleMarkAllRead}>
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div style={styles.notificationList}>
            {loading ? (
              <div style={styles.loading}>Đang tải...</div>
            ) : notifications.length === 0 ? (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>🔔</div>
                <div>Không có thông báo mới</div>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.notificationId}
                  style={{
                    ...styles.notificationItem,
                    ...(notif.isRead ? {} : styles.notificationItemUnread)
                  }}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div style={styles.notifIcon}>{getNotificationIcon(notif.type)}</div>
                  <div style={styles.notifContent}>
                    <div style={styles.notifTitle}>{notif.title}</div>
                    {notif.content && (
                      <div style={styles.notifMessage}>{notif.content}</div>
                    )}
                    <div style={styles.notifTime}>{formatTime(notif.createdAt)}</div>
                  </div>
                  {!notif.isRead && <div style={styles.unreadDot} />}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div style={styles.dropdownFooter}>
              <button style={styles.viewAllBtn} onClick={() => window.location.href = '/notifications'}>
                Xem tất cả
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    position: 'relative'
  },
  bellButton: {
    position: 'relative',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    background: colors.background,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.textPrimary,
    transition: 'all 0.2s',
    ':hover': {
      background: colors.border
    }
  },
  badge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    minWidth: '18px',
    height: '18px',
    borderRadius: '9px',
    background: colors.error,
    color: colors.white,
    fontSize: '10px',
    fontWeight: typography.bold,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px'
  },
  dropdown: {
    position: 'absolute',
    top: '50px',
    right: 0,
    width: '380px',
    maxHeight: '600px',
    background: colors.white,
    borderRadius: spacing.lg,
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    border: `1px solid ${colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000
  },
  dropdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.borderLight}`
  },
  dropdownTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    margin: 0
  },
  markAllBtn: {
    border: 'none',
    background: 'none',
    color: colors.primary,
    fontSize: typography.sm,
    cursor: 'pointer',
    fontWeight: typography.semibold
  },
  notificationList: {
    flex: 1,
    overflow: 'auto',
    maxHeight: '450px'
  },
  loading: {
    padding: spacing['6xl'],
    textAlign: 'center',
    color: colors.textSecondary
  },
  empty: {
    padding: spacing['6xl'],
    textAlign: 'center',
    color: colors.textSecondary
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: spacing.md
  },
  notificationItem: {
    display: 'flex',
    padding: spacing.md,
    cursor: 'pointer',
    transition: 'background 0.2s',
    borderBottom: `1px solid ${colors.borderLight}`,
    ':hover': {
      background: colors.background
    }
  },
  notificationItemUnread: {
    background: colors.primary + '08'
  },
  notifIcon: {
    fontSize: '24px',
    marginRight: spacing.md,
    flexShrink: 0
  },
  notifContent: {
    flex: 1,
    minWidth: 0
  },
  notifTitle: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs
  },
  notifMessage: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  notifTime: {
    fontSize: typography.xs,
    color: colors.textSecondary
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: colors.primary,
    flexShrink: 0,
    marginLeft: spacing.sm
  },
  dropdownFooter: {
    borderTop: `1px solid ${colors.borderLight}`,
    padding: spacing.md
  },
  viewAllBtn: {
    width: '100%',
    padding: spacing.md,
    border: 'none',
    background: colors.background,
    color: colors.primary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
    borderRadius: spacing.md,
    cursor: 'pointer'
  }
}
