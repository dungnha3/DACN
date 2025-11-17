// Styles for Accounting Manager Dashboard - Soft UI Design with Green Theme
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
    background: 'linear-gradient(195deg, #059669 0%, #047857 100%)',
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
    background: 'linear-gradient(195deg, #10b981 0%, #059669 100%)',
    display: 'grid',
    placeItems: 'center',
    fontSize: 20,
    boxShadow: '0 2px 12px rgba(16, 185, 129, 0.4)'
  },
  brandName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#ffffff',
    lineHeight: 1.2
  },
  brandSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 500
  },
  divider: {
    height: 1,
    background: 'rgba(255, 255, 255, 0.2)',
    margin: '8px 0'
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 0'
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'grid',
    placeItems: 'center',
    fontSize: 18,
    fontWeight: 700,
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: 2
  },
  userRole: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 500
  },
  navGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  navGroupLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 8,
    paddingLeft: 8
  },
  logoutBtn: {
    marginTop: 'auto',
    padding: '12px 16px',
    border: 'none',
    borderRadius: 12,
    background: 'linear-gradient(145deg, #dc2626, #991b1b)',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
  },

  // Content Area
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
  pageHeading: {
    fontSize: 24,
    fontWeight: 700,
    color: '#344767',
    marginBottom: 4
  },
  subHeading: {
    fontSize: 14,
    color: '#7b809a',
    fontWeight: 500
  },
  rightCluster: {
    display: 'flex',
    alignItems: 'center',
    gap: 16
  },

  // Welcome Card
  welcomeCard: {
    background: 'linear-gradient(195deg, #059669 0%, #047857 100%)',
    borderRadius: 20,
    padding: 32,
    color: '#ffffff',
    boxShadow: '0 8px 32px rgba(5, 150, 105, 0.3)',
    position: 'relative',
    overflow: 'hidden'
  },
  welcomeContent: {
    position: 'relative',
    zIndex: 2
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12,
    color: '#ffffff'
  },
  welcomeText: {
    fontSize: 15,
    lineHeight: 1.6,
    marginBottom: 24,
    color: 'rgba(255, 255, 255, 0.9)'
  },
  actionBtn: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: 12,
    background: 'linear-gradient(145deg, #10b981, #059669)',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
  },

  // Role Badge
  roleBadge: {
    padding: '8px 16px',
    borderRadius: 20,
    background: 'linear-gradient(145deg, #059669, #047857)',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
  },

  // Dashboard Content
  dashboardContent: {
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    flex: 1,
    overflowY: 'auto'
  },

  // KPI Grid
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 24
  },

  // Cards Row
  cardsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: 24
  },

  // Notification Card
  notificationCard: {
    background: '#ffffff',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#344767',
    marginBottom: 20
  },
  notificationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  notificationItem: {
    display: 'flex',
    gap: 12,
    padding: '12px 0'
  },
  notifIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'linear-gradient(145deg, #059669, #047857)',
    display: 'grid',
    placeItems: 'center',
    fontSize: 16,
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
  },
  notifContent: {
    flex: 1
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#344767',
    marginBottom: 4
  },
  notifDesc: {
    fontSize: 14,
    color: '#7b809a',
    lineHeight: 1.5,
    marginBottom: 4
  },
  notifDate: {
    fontSize: 12,
    color: '#adb5bd',
    fontWeight: 500
  },

  // Charts Row
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24
  },
  chartCard: {
    background: '#ffffff',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
  },
  chartPlaceholder: {
    height: 200,
    background: '#f8f9fa',
    borderRadius: 12,
    display: 'grid',
    placeItems: 'center',
    border: '2px dashed #dee2e6'
  },
  chartInfo: {
    fontSize: 16,
    color: '#7b809a',
    fontWeight: 500
  },

  // Page Content
  pageContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },

  // Table Card
  tableCard: {
    background: '#ffffff',
    borderRadius: 20,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    borderBottom: '1px solid #f0f2f5'
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#344767'
  },
  addBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: 10,
    background: 'linear-gradient(145deg, #10b981, #059669)',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
  },
  tableWrap: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '16px 24px',
    textAlign: 'left',
    fontSize: 13,
    fontWeight: 700,
    color: '#7b809a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #f0f2f5',
    background: '#f8f9fa'
  },
  tr: {
    borderBottom: '1px solid #f0f2f5',
    transition: 'background-color 0.2s ease'
  },
  td: {
    padding: '16px 24px',
    fontSize: 14,
    color: '#344767'
  },
  hoursCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  hoursBar: (hours) => ({
    width: Math.min(hours * 8, 80),
    height: 6,
    background: hours >= 8 ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #f59e0b, #d97706)',
    borderRadius: 3
  }),
  hoursText: {
    fontSize: 13,
    fontWeight: 600,
    color: '#344767'
  },

  // Leave Layout
  leaveLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: 24
  },
  orderOverview: {
    background: '#ffffff',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    height: 'fit-content'
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  orderItem: {
    display: 'flex',
    gap: 12,
    padding: '12px 0',
    borderBottom: '1px solid #f0f2f5'
  },
  orderIcon: (status) => ({
    width: 32,
    height: 32,
    borderRadius: 8,
    background: status === 'approved' ? 'linear-gradient(145deg, #10b981, #059669)' : 
                status === 'pending' ? 'linear-gradient(145deg, #f59e0b, #d97706)' : 
                'linear-gradient(145deg, #dc2626, #991b1b)',
    display: 'grid',
    placeItems: 'center',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 700,
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
  }),
  orderContent: {
    flex: 1
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#344767',
    marginBottom: 2
  },
  orderStatus: {
    fontSize: 12,
    color: '#7b809a',
    fontWeight: 500
  },

  // Approvals Grid
  approvalsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: 24
  },
  approvalCard: {
    background: '#ffffff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f0f2f5',
    transition: 'all 0.3s ease'
  },
  approvalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  approvalType: {
    fontSize: 16,
    fontWeight: 700,
    color: '#344767'
  },
  approvalContent: {
    marginBottom: 16
  },
  approvalEmployee: {
    fontSize: 15,
    color: '#344767',
    marginBottom: 8
  },
  approvalDate: {
    fontSize: 13,
    color: '#7b809a',
    marginBottom: 4
  },
  approvalReason: {
    fontSize: 13,
    color: '#7b809a',
    fontStyle: 'italic'
  },
  approvalActions: {
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end'
  },
  rejectBtn: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: 8,
    background: 'linear-gradient(145deg, #dc2626, #991b1b)',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
  },
  approveBtn: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: 8,
    background: 'linear-gradient(145deg, #10b981, #059669)',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
  },

  // Placeholder
  placeholderCard: {
    background: '#ffffff',
    borderRadius: 20,
    padding: 48,
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 24,
    opacity: 0.6
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

  // Chat Styles - Soft UI / Neumorphism Design with Green 
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
    padding: '16px',
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
    gap: 10,
    padding: '10px 8px',
    margin: '2px 0',
    borderRadius: 12,
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
    width: 42,
    height: 42,
    borderRadius: 12,
    background: 'linear-gradient(145deg, #059669, #047857)',
    boxShadow: '3px 3px 10px rgba(5, 150, 105, 0.3), -2px -2px 8px rgba(255, 255, 255, 0.8)',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    border: 'none'
  },
  chatContactAvatarIcon: {
    fontSize: 20
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
    background: 'linear-gradient(145deg, #10b981, #059669)',
    color: '#fff',
    borderRadius: 11,
    fontSize: 11,
    fontWeight: 700,
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    boxShadow: '2px 2px 6px rgba(16, 185, 129, 0.4)'
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
    padding: '12px 20px',
    borderBottom: 'none',
    background: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  },
  chatWindowHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  chatWindowAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: 'linear-gradient(145deg, #059669, #047857)',
    boxShadow: '3px 3px 10px rgba(5, 150, 105, 0.3), -2px -2px 8px rgba(255, 255, 255, 0.8)',
    display: 'grid',
    placeItems: 'center',
    fontSize: 18,
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
    width: 36,
    height: 36,
    border: 'none',
    borderRadius: 10,
    background: '#e8eaf0',
    boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.08), -3px -3px 8px rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    color: '#059669',
    padding: 0
  },
  // Messages Area
  chatMessagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 20px',
    background: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
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
    background: 'linear-gradient(145deg, #059669, #047857)',
    boxShadow: '3px 3px 8px rgba(5, 150, 105, 0.3)',
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
    background: 'linear-gradient(145deg, #059669, #047857)',
    color: '#ffffff',
    boxShadow: '5px 5px 15px rgba(5, 150, 105, 0.4), -3px -3px 10px rgba(255, 255, 255, 0.8)',
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
    width: 44,
    height: 44,
    border: 'none',
    borderRadius: 12,
    background: 'linear-gradient(145deg, #059669, #047857)',
    boxShadow: '3px 3px 10px rgba(5, 150, 105, 0.3), -2px -2px 8px rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    fontSize: 18,
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
    boxShadow: 'inset 4px 4px 10px rgba(5, 150, 105, 0.5), inset -2px -2px 6px rgba(255, 255, 255, 0.3)'
  },

  // Navigation Item Styles
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

  // Approval Card Styles
  approvalCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    border: '1px solid #e9ecef'
  },
  approvalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  approvalEmployee: {
    fontSize: 16,
    fontWeight: 700,
    color: '#344767',
    marginBottom: 4
  },
  approvalType: {
    fontSize: 14,
    color: '#7b809a',
    fontWeight: 500
  },
  approvalBody: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginBottom: 16
  },
  approvalField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  approvalLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#7b809a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  approvalValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#344767'
  },
  approvalReason: {
    gridColumn: '1 / -1',
    marginTop: 8
  },
  approvalReasonLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#7b809a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 8
  },
  approvalReasonText: {
    fontSize: 14,
    color: '#344767',
    lineHeight: 1.5,
    padding: 12,
    background: '#f8f9fa',
    borderRadius: 8,
    border: '1px solid #e9ecef'
  },
  approvalActions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end'
  },
  rejectBtn: {
    background: 'linear-gradient(195deg, #dc2626 0%, #991b1b 100%)',
    border: 'none',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    boxShadow: '0 2px 10px rgba(220, 38, 38, 0.3)',
    transition: 'all 0.2s'
  },
  approveBtn: {
    background: 'linear-gradient(195deg, #059669 0%, #047857 100%)',
    border: 'none',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    boxShadow: '0 2px 10px rgba(5, 150, 105, 0.3)',
    transition: 'all 0.2s'
  },

  // Check-in Button Style (for welcome card)
  checkInBtn: {
    background: 'linear-gradient(195deg, #059669 0%, #047857 100%)',
    border: 'none',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    transition: 'all 0.2s',
    boxShadow: '0 2px 10px rgba(5, 150, 105, 0.3)'
  },

  // Payroll Styles
  payrollActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
    padding: 20,
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    marginBottom: 20
  },
  monthSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#344767'
  },
  monthSelect: {
    padding: '8px 16px',
    border: '1px solid #e9ecef',
    borderRadius: 8,
    fontSize: 14,
    color: '#344767',
    background: '#fff',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s'
  },
  actionButtons: {
    display: 'flex',
    gap: 12
  },
  autoCalculateBtn: {
    background: 'linear-gradient(195deg, #059669 0%, #047857 100%)',
    border: 'none',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  exportBtn: {
    background: 'linear-gradient(195deg, #3b82f6 0%, #2563eb 100%)',
    border: 'none',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  employeeCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  employeeName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#344767'
  },
  employeePosition: {
    fontSize: 12,
    color: '#7b809a',
    fontWeight: 500
  },
  totalSalaryCell: {
    fontSize: 14,
    fontWeight: 700,
    color: '#059669'
  },
  payrollStatusBadge: {
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  }
}
