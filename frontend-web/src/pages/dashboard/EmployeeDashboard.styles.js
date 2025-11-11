// Styles for Employee Dashboard - Soft UI Design
export const styles = {
  appShell: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  
  // Sidebar
  sidebar: {
    background: 'linear-gradient(195deg, #1e3a8a 0%, #0f172a 100%)',
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'linear-gradient(195deg, #dc2626 0%, #991b1b 100%)',
    display: 'grid',
    placeItems: 'center',
    fontSize: 20,
    boxShadow: '0 2px 12px rgba(220, 38, 38, 0.4)'
  },
  brandName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#fff'
  },
  brandSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2
  },
  divider: {
    height: 1,
    background: 'rgba(255,255,255,0.1)'
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'linear-gradient(195deg, #dc2626 0%, #991b1b 100%)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 700,
    fontSize: 16,
    boxShadow: '0 2px 10px rgba(220, 38, 38, 0.3)'
  },
  userInfo: { flex: 1 },
  userName: { fontWeight: 700, color: '#fff', fontSize: 14 },
  userRole: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  navGroup: {},
  navGroupLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 8,
    paddingLeft: 12
  },
  navItem: {
    width: '100%',
    textAlign: 'left',
    padding: '11px 16px',
    borderRadius: 10,
    border: 'none',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    transition: 'all 0.2s',
    marginBottom: 4
  },
  navIcon: {
    fontSize: 16,
    width: 20,
    textAlign: 'center'
  },
  navItemActive: {
    background: 'rgba(255,255,255,0.15)',
    fontWeight: 600,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  logoutBtn: {
    marginTop: 'auto',
    background: 'linear-gradient(195deg, #dc2626 0%, #991b1b 100%)',
    border: 'none',
    color: '#fff',
    padding: '11px 16px',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    transition: 'all 0.2s',
    boxShadow: '0 2px 10px rgba(220, 38, 38, 0.3)'
  },
  
  // Main Content
  content: {
    padding: '24px 28px',
    overflowY: 'auto'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  pageHeading: { fontSize: 20, fontWeight: 700, color: '#344767' },
  subHeading: { fontSize: 14, color: '#7b809a', marginTop: 4 },
  rightCluster: { display: 'flex', gap: 12, alignItems: 'center' },
  roleBadge: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(195deg, #1e3a8a 0%, #1e40af 100%)',
    color: '#fff',
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 600,
    boxShadow: '0 2px 10px rgba(30, 58, 138, 0.3)'
  },
  
  // Dashboard Content
  dashboardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 20
  },
  kpiCard: {
    padding: 20,
    borderRadius: 16,
    border: '1px solid',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  kpiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  kpiTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#67748e',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  kpiIcon: {
    fontSize: 24
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 4
  },
  kpiChange: {
    fontSize: 13,
    fontWeight: 600
  },
  
  // Cards Row
  cardsRow: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: 20
  },
  welcomeCard: {
    background: 'linear-gradient(195deg, #1e3a8a 0%, #1e40af 100%)',
    borderRadius: 16,
    padding: 28,
    color: '#fff',
    boxShadow: '0 4px 20px rgba(30, 58, 138, 0.3)'
  },
  welcomeContent: {},
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12
  },
  welcomeText: {
    fontSize: 14,
    lineHeight: 1.6,
    opacity: 0.9,
    marginBottom: 20
  },
  checkInBtn: {
    background: 'linear-gradient(195deg, #dc2626 0%, #991b1b 100%)',
    border: 'none',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    transition: 'all 0.2s',
    boxShadow: '0 2px 10px rgba(220, 38, 38, 0.3)'
  },
  notificationCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#344767',
    marginBottom: 16
  },
  notificationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  notificationItem: {
    display: 'flex',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    background: '#f8f9fa',
    border: '1px solid #e9ecef'
  },
  notifIcon: {
    fontSize: 20
  },
  notifContent: {
    flex: 1
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#344767',
    marginBottom: 4
  },
  notifDesc: {
    fontSize: 13,
    color: '#7b809a',
    marginBottom: 4
  },
  notifDate: {
    fontSize: 12,
    color: '#adb5bd'
  },
  
  // Charts
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20
  },
  chartCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
  },
  chartPlaceholder: {
    height: 200,
    display: 'grid',
    placeItems: 'center',
    background: '#f8f9fa',
    borderRadius: 12,
    marginTop: 16
  },
  chartInfo: {
    color: '#7b809a',
    fontSize: 14
  },
  
  // Page Content
  pageContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  tableCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    flex: 1
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#344767'
  },
  addBtn: {
    background: 'linear-gradient(195deg, #dc2626 0%, #991b1b 100%)',
    border: 'none',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    boxShadow: '0 2px 10px rgba(220, 38, 38, 0.3)'
  },
  tableWrap: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: 12,
    fontWeight: 700,
    color: '#7b809a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #e9ecef'
  },
  tr: {
    borderBottom: '1px solid #f0f2f5',
    transition: 'background 0.2s'
  },
  td: {
    padding: '14px 16px',
    fontSize: 14,
    color: '#344767'
  },
  hoursCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  hoursBar: (hours) => ({
    height: 6,
    width: `${(hours / 10) * 100}%`,
    maxWidth: '100px',
    background: 'linear-gradient(90deg, #1e3a8a 0%, #1e40af 100%)',
    borderRadius: 3
  }),
  hoursText: {
    fontSize: 13,
    fontWeight: 600,
    color: '#344767'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '5px 12px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600
  },
  
  // Leave Page
  leaveLayout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: 20
  },
  orderOverview: {
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  orderItem: {
    display: 'flex',
    gap: 12,
    paddingBottom: 12,
    borderBottom: '1px solid #f0f2f5'
  },
  orderIcon: (status) => ({
    width: 32,
    height: 32,
    borderRadius: 8,
    background: status === 'approved' ? '#dbeafe' : status === 'pending' ? '#e5e7eb' : '#fee2e2',
    color: status === 'approved' ? '#1e3a8a' : status === 'pending' ? '#6b7280' : '#dc2626',
    display: 'grid',
    placeItems: 'center',
    fontSize: 16,
    fontWeight: 700
  }),
  orderContent: {
    flex: 1
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#344767',
    marginBottom: 4
  },
  orderStatus: {
    fontSize: 12,
    color: '#7b809a'
  },
  statusBarWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  statusBar: {
    height: 4,
    borderRadius: 2,
    transition: 'width 0.3s'
  },
  statusBarLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#344767'
  },
  
  // Placeholder
  placeholderCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 60,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    textAlign: 'center'
  },
  placeholderIcon: {
    fontSize: 72,
    marginBottom: 20
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#344767',
    marginBottom: 12
  },
  placeholderText: {
    fontSize: 15,
    color: '#7b809a',
    lineHeight: 1.6,
    maxWidth: 500,
    margin: '0 auto'
  },

  // Chat Styles - Soft UI / Neumorphism Design
  chatContainer: {
    display: 'grid',
    gridTemplateColumns: '360px 1fr',
    height: 'calc(100vh - 120px)',
    gap: 20,
    background: 'transparent'
  },

  // Chat Sidebar (Left Column)
  chatSidebar: {
    background: '#ffffff',
    borderRadius: 20,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  chatSidebarHeader: {
    padding: '20px',
    borderBottom: 'none'
  },
  chatSearchInput: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    border: 'none',
    borderRadius: 14,
    fontSize: 14,
    outline: 'none',
    background: '#e8eaf0',
    boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    color: '#344767',
    position: 'relative'
  },
  chatContactList: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px'
  },
  chatContactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 12px',
    margin: '4px 0',
    borderRadius: 16,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    border: 'none'
  },
  chatContactItemActive: {
    background: '#e8eaf0',
    boxShadow: 'inset 3px 3px 8px rgba(0, 0, 0, 0.1), inset -3px -3px 8px rgba(255, 255, 255, 0.9)'
  },
  chatContactAvatar: {
    position: 'relative',
    width: 50,
    height: 50,
    borderRadius: 16,
    background: 'linear-gradient(145deg, #667eea, #764ba2)',
    boxShadow: '5px 5px 15px rgba(102, 126, 234, 0.4), -3px -3px 10px rgba(255, 255, 255, 0.8)',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    border: 'none'
  },
  chatContactAvatarIcon: {
    fontSize: 26
  },
  chatOnlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    background: '#10b981',
    border: '2px solid #fff',
    borderRadius: '50%',
    boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)'
  },
  chatContactInfo: {
    flex: 1,
    minWidth: 0
  },
  chatContactHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  chatContactName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#344767',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  chatContactTime: {
    fontSize: 12,
    color: '#7b809a',
    flexShrink: 0,
    marginLeft: 8
  },
  chatContactMessage: {
    fontSize: 13,
    color: '#7b809a',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  chatUnreadBadge: {
    minWidth: 22,
    height: 22,
    padding: '0 7px',
    background: 'linear-gradient(145deg, #dc2626, #991b1b)',
    color: '#fff',
    borderRadius: 11,
    fontSize: 11,
    fontWeight: 700,
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    boxShadow: '2px 2px 6px rgba(220, 38, 38, 0.4)'
  },

  // Chat Window (Right Column)
  chatWindow: {
    background: '#ffffff',
    borderRadius: 20,
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
    borderBottom: 'none',
    background: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
  },
  chatWindowHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 14
  },
  chatWindowAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    background: 'linear-gradient(145deg, #667eea, #764ba2)',
    boxShadow: '5px 5px 15px rgba(102, 126, 234, 0.4), -3px -3px 10px rgba(255, 255, 255, 0.8)',
    display: 'grid',
    placeItems: 'center',
    fontSize: 24,
    border: 'none'
  },
  chatWindowName: {
    fontSize: 17,
    fontWeight: 700,
    color: '#344767',
    marginBottom: 2
  },
  chatWindowStatus: {
    fontSize: 13,
    color: '#7b809a'
  },
  chatWindowActions: {
    display: 'flex',
    gap: 8
  },
  chatActionButton: {
    width: 44,
    height: 44,
    border: 'none',
    borderRadius: 14,
    background: '#e8eaf0',
    boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1), -4px -4px 10px rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    color: '#667eea',
    padding: 0
  },

  // Messages Area
  chatMessagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    background: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  chatDateDivider: {
    textAlign: 'center',
    margin: '12px 0'
  },
  chatDateText: {
    display: 'inline-block',
    padding: '6px 16px',
    background: '#ffffff',
    borderRadius: 16,
    fontSize: 12,
    color: '#7b809a',
    fontWeight: 600,
    boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.06), -2px -2px 6px rgba(255, 255, 255, 0.9)'
  },
  chatMessageRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start'
  },
  chatMessageRowOwn: {
    flexDirection: 'row-reverse'
  },
  chatMessageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 11,
    background: 'linear-gradient(145deg, #667eea, #764ba2)',
    boxShadow: '3px 3px 8px rgba(102, 126, 234, 0.3)',
    display: 'grid',
    placeItems: 'center',
    fontSize: 18,
    flexShrink: 0
  },
  chatMessageGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    maxWidth: '65%'
  },
  chatMessageBubble: {
    padding: '12px 16px',
    borderRadius: 18,
    background: '#ffffff',
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.1), -3px -3px 10px rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    color: '#344767',
    lineHeight: 1.6,
    wordWrap: 'break-word',
    borderBottomLeftRadius: 4,
    border: 'none'
  },
  chatMessageBubbleOwn: {
    background: 'linear-gradient(145deg, #667eea, #764ba2)',
    color: '#ffffff',
    boxShadow: '5px 5px 15px rgba(102, 126, 234, 0.4), -3px -3px 10px rgba(255, 255, 255, 0.8)',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 18,
    border: 'none'
  },
  chatMessageTime: {
    fontSize: 11,
    color: '#adb5bd',
    paddingLeft: 8
  },
  chatMessageTimeOwn: {
    textAlign: 'right',
    paddingLeft: 0,
    paddingRight: 8,
    color: '#d1d5db'
  },

  // Input Area
  chatInputArea: {
    padding: '16px 24px',
    borderTop: 'none',
    background: '#ffffff',
    boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)'
  },
  chatInputToolbar: {
    display: 'flex',
    gap: 8,
    marginBottom: 12
  },
  chatToolButton: {
    width: 40,
    height: 40,
    border: 'none',
    borderRadius: 12,
    background: '#e8eaf0',
    boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.08), -3px -3px 8px rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    color: '#7b809a',
    padding: 0
  },
  chatInputWrapper: {
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  },
  chatMessageInput: {
    flex: 1,
    padding: '14px 20px',
    border: 'none',
    borderRadius: 18,
    fontSize: 14,
    outline: 'none',
    background: '#e8eaf0',
    boxShadow: 'inset 4px 4px 10px rgba(0, 0, 0, 0.1), inset -4px -4px 10px rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    color: '#344767'
  },
  chatSendButton: {
    width: 52,
    height: 52,
    border: 'none',
    borderRadius: 16,
    background: 'linear-gradient(145deg, #667eea, #764ba2)',
    boxShadow: '5px 5px 15px rgba(102, 126, 234, 0.4), -3px -3px 10px rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    fontSize: 20,
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    fontWeight: 700,
    padding: 0,
    flexShrink: 0
  },
  chatSendButtonPressed: {
    boxShadow: 'inset 4px 4px 10px rgba(102, 126, 234, 0.5), inset -2px -2px 6px rgba(255, 255, 255, 0.3)'
  }
}
