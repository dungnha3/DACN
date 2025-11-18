export const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '24px',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
  },
  pageContent: {
    width: '100%',
  },
  chatContainer: {
    display: 'grid',
    gridTemplateColumns: '360px 1fr',
    height: 'calc(100vh - 120px)',
    gap: '20px',
    background: 'transparent'
  },
  // Chat Sidebar (Left Column)
  chatSidebar: {
    background: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  chatSidebarHeader: {
    padding: '20px 16px 16px',
    borderBottom: '1px solid #f0f2f5'
  },
  chatSearchInput: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    border: '1px solid #e9ecef',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    background: '#f8f9fa'
  },
  chatContactList: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 0'
  },
  chatContactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderRadius: 0,
    position: 'relative'
  },
  chatContactItemActive: {
    background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.1) 0%, rgba(30, 64, 175, 0.05) 100%)',
    borderLeft: '3px solid #1e3a8a'
  },
  chatContactAvatar: {
    position: 'relative',
    flexShrink: 0
  },
  chatContactAvatarIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #1e3a8a, #1e40af)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontSize: '18px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
  },
  chatOnlineBadge: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '12px',
    height: '12px',
    background: '#10b981',
    borderRadius: '50%',
    border: '2px solid #fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  chatContactInfo: {
    flex: 1,
    minWidth: 0
  },
  chatContactHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
  },
  chatContactName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#344767',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  chatContactTime: {
    fontSize: '12px',
    color: '#7b809a',
    flexShrink: 0,
    marginLeft: '8px'
  },
  chatContactMessage: {
    fontSize: '13px',
    color: '#7b809a',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  chatUnreadBadge: {
    minWidth: '22px',
    height: '22px',
    padding: '0 7px',
    background: 'linear-gradient(145deg, #dc2626, #991b1b)',
    color: '#fff',
    borderRadius: '11px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    boxShadow: '2px 2px 6px rgba(220, 38, 38, 0.4)'
  },
  // Chat Window (Right Column)
  chatWindow: {
    background: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  chatWindowHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #f0f2f5',
    background: '#fafbfc'
  },
  chatWindowHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  chatWindowAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(145deg, #1e3a8a, #1e40af)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontSize: '16px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
  },
  chatWindowName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#344767'
  },
  chatWindowStatus: {
    fontSize: '12px',
    color: '#7b809a',
    marginTop: '2px'
  },
  chatWindowActions: {
    display: 'flex',
    gap: '8px'
  },
  chatActionButton: {
    width: '40px',
    height: '40px',
    border: 'none',
    background: 'transparent',
    borderRadius: '10px',
    cursor: 'pointer',
    color: '#7b809a',
    display: 'grid',
    placeItems: 'center',
    transition: 'all 0.2s',
    padding: 0,
    position: 'relative'
  },
  chatMessagesArea: {
    flex: 1,
    padding: '20px 24px',
    overflowY: 'auto',
    background: '#fafbfc'
  },
  chatDateDivider: {
    display: 'flex',
    justifyContent: 'center',
    margin: '16px 0'
  },
  chatDateText: {
    padding: '6px 16px',
    background: '#e9ecef',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6c757d'
  },
  chatMessageRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    alignItems: 'flex-end'
  },
  chatMessageRowOwn: {
    flexDirection: 'row-reverse'
  },
  chatMessageAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(145deg, #1e3a8a, #1e40af)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontSize: '14px',
    fontWeight: '700',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(30, 58, 138, 0.3)'
  },
  chatMessageGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    maxWidth: '70%'
  },
  chatMessageBubble: {
    padding: '12px 16px',
    borderRadius: '18px 18px 18px 4px',
    background: '#fff',
    color: '#344767',
    fontSize: '14px',
    lineHeight: 1.5,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f0f2f5'
  },
  chatMessageBubbleOwn: {
    background: 'linear-gradient(145deg, #1e3a8a, #1e40af)',
    color: '#fff',
    borderRadius: '18px 18px 4px 18px',
    border: 'none'
  },
  chatMessageTime: {
    fontSize: '11px',
    color: '#adb5bd',
    alignSelf: 'flex-start',
    marginLeft: '4px'
  },
  chatMessageTimeOwn: {
    alignSelf: 'flex-end',
    marginRight: '4px'
  },
  chatInputArea: {
    padding: '16px 24px',
    borderTop: 'none',
    background: '#ffffff',
    boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)'
  },
  chatInputToolbar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px'
  },
  chatToolButton: {
    width: '40px',
    height: '40px',
    border: 'none',
    borderRadius: '12px',
    background: '#e8eaf0',
    boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.08), -3px -3px 8px rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'grid',
    placeItems: 'center',
    transition: 'all 0.3s ease',
    color: '#7b809a',
    padding: 0,
    position: 'relative'
  },
  chatInputWrapper: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  chatMessageInput: {
    flex: 1,
    padding: '14px 20px',
    border: 'none',
    borderRadius: '18px',
    fontSize: '14px',
    outline: 'none',
    background: '#e8eaf0',
    boxShadow: 'inset 4px 4px 10px rgba(0, 0, 0, 0.1), inset -4px -4px 10px rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    color: '#344767'
  },
  chatSendButton: {
    width: '52px',
    height: '52px',
    border: 'none',
    borderRadius: '16px',
    background: 'linear-gradient(145deg, #1e3a8a, #1e40af)',
    boxShadow: '5px 5px 15px rgba(30, 58, 138, 0.4), -3px -3px 10px rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#ffffff',
    display: 'grid',
    placeItems: 'center',
    transition: 'all 0.3s ease',
    fontWeight: '700',
    padding: 0,
    flexShrink: 0,
    position: 'relative'
  },
}
