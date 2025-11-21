import { colors, typography, spacing } from '@/shared/styles/theme'

export default function MessageBubble({ message, isOwn }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const renderMessageContent = () => {
    if (message.messageType === 'FILE' && message.file) {
      return (
        <div style={styles.fileMessage}>
          <div style={styles.fileIcon}>📄</div>
          <div style={styles.fileInfo}>
            <div style={styles.fileName}>{message.file.originalFilename}</div>
            <div style={styles.fileSize}>
              {(message.file.fileSize / 1024).toFixed(0)} KB
            </div>
          </div>
        </div>
      )
    }

    if (message.messageType === 'IMAGE' && message.file) {
      return (
        <div style={styles.imageMessage}>
          <img 
            src={message.file.fileUrl || `/api/storage/files/${message.file.fileId}`}
            alt={message.file.originalFilename}
            style={styles.messageImage}
          />
        </div>
      )
    }

    // Default text message
    return <div style={styles.messageText}>{message.content}</div>
  }

  return (
    <div style={{
      ...styles.container,
      ...(isOwn ? styles.containerOwn : styles.containerOther)
    }}>
      {!isOwn && (
        <div style={styles.avatar}>
          {message.senderName?.charAt(0).toUpperCase() || '?'}
        </div>
      )}
      
      <div style={styles.bubble}>
        {!isOwn && message.senderName && (
          <div style={styles.senderName}>{message.senderName}</div>
        )}
        
        <div style={{
          ...styles.content,
          ...(isOwn ? styles.contentOwn : styles.contentOther)
        }}>
          {renderMessageContent()}
          
          {message.isDeleted && (
            <div style={styles.deletedMessage}>
              <em>Tin nhắn đã bị xóa</em>
            </div>
          )}
        </div>
        
        <div style={{
          ...styles.meta,
          ...(isOwn ? styles.metaOwn : styles.metaOther)
        }}>
          <span style={styles.time}>{formatTime(message.sentAt)}</span>
          {message.editedAt && (
            <span style={styles.edited}> • Đã chỉnh sửa</span>
          )}
          {isOwn && message.seen && (
            <span style={styles.seenIcon} title="Đã xem">✓✓</span>
          )}
        </div>
      </div>

      {isOwn && (
        <div style={{...styles.avatar, ...styles.avatarOwn}}>
          {message.senderName?.charAt(0).toUpperCase() || 'B'}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    maxWidth: '70%'
  },
  containerOwn: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    flexDirection: 'row-reverse'
  },
  containerOther: {
    alignSelf: 'flex-start',
    marginRight: 'auto'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: colors.primary + '30',
    color: colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.sm,
    fontWeight: typography.bold,
    flexShrink: 0
  },
  avatarOwn: {
    backgroundColor: colors.success + '30',
    color: colors.success
  },
  bubble: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    maxWidth: '100%'
  },
  senderName: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
    marginBottom: spacing.xs
  },
  content: {
    padding: spacing.md,
    borderRadius: spacing.lg,
    wordWrap: 'break-word',
    wordBreak: 'break-word'
  },
  contentOwn: {
    backgroundColor: colors.primary,
    color: colors.white,
    borderBottomRightRadius: spacing.xs
  },
  contentOther: {
    backgroundColor: colors.white,
    color: colors.textPrimary,
    border: `1px solid ${colors.border}`,
    borderBottomLeftRadius: spacing.xs
  },
  messageText: {
    fontSize: typography.base,
    lineHeight: '1.5'
  },
  fileMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm
  },
  fileIcon: {
    fontSize: '24px'
  },
  fileInfo: {
    flex: 1
  },
  fileName: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    marginBottom: spacing.xs
  },
  fileSize: {
    fontSize: typography.xs,
    opacity: 0.8
  },
  imageMessage: {
    maxWidth: '300px'
  },
  messageImage: {
    width: '100%',
    borderRadius: spacing.md,
    display: 'block'
  },
  deletedMessage: {
    fontSize: typography.sm,
    opacity: 0.6,
    fontStyle: 'italic'
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    fontSize: typography.xs,
    color: colors.textMuted
  },
  metaOwn: {
    justifyContent: 'flex-end'
  },
  metaOther: {
    justifyContent: 'flex-start'
  },
  time: {
    fontSize: typography.xs
  },
  edited: {
    fontSize: typography.xs,
    fontStyle: 'italic'
  },
  seenIcon: {
    fontSize: typography.sm,
    color: colors.success
  }
}
