// Styles for Project Manager Dashboard - Soft UI Design
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
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
  
  // Approval Page Specific
  approvalCard: {
    background: '#fff',
    borderRadius: 12,
    padding: 20,
    border: '1px solid #e9ecef',
    marginBottom: 16
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
    fontSize: 13,
    color: '#7b809a',
    fontWeight: 600
  },
  approvalBody: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
    marginBottom: 16,
    padding: 16,
    background: '#f8f9fa',
    borderRadius: 8
  },
  approvalField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  approvalLabel: {
    fontSize: 11,
    fontWeight: 700,
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
    padding: 12,
    background: '#fff',
    borderRadius: 6,
    border: '1px solid #e9ecef'
  },
  approvalReasonLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#7b809a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 6
  },
  approvalReasonText: {
    fontSize: 14,
    color: '#344767',
    lineHeight: 1.5
  },
  approvalActions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end'
  },
  approveBtn: {
    background: 'linear-gradient(195deg, #1e3a8a 0%, #1e40af 100%)',
    border: 'none',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    boxShadow: '0 2px 10px rgba(30, 58, 138, 0.3)',
    transition: 'all 0.2s'
  },
  rejectBtn: {
    background: 'linear-gradient(195deg, #dc2626 0%, #991b1b 100%)',
    border: 'none',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    boxShadow: '0 2px 10px rgba(220, 38, 38, 0.3)',
    transition: 'all 0.2s'
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

  // Chat Styles
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
    padding: '20px 16px 16px',
    borderBottom: '1px solid #f0f2f5'
  },
  chatSearchInput: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    border: '1px solid #e9ecef',
    borderRadius: 12,
    fontSize: 14,
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
    gap: 12,
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
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'linear-gradient(145deg, #1e3a8a, #1e40af)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontSize: 18,
    fontWeight: 700,
    boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
  },
  chatOnlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
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
    borderBottom: '1px solid #f0f2f5',
    background: '#fafbfc'
  },
  chatWindowHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  chatWindowAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'linear-gradient(145deg, #1e3a8a, #1e40af)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontSize: 16,
    fontWeight: 700,
    boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
  },
  chatWindowName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#344767'
  },
  chatWindowStatus: {
    fontSize: 12,
    color: '#7b809a',
    marginTop: 2
  },
  chatWindowActions: {
    display: 'flex',
    gap: 8
  },
  chatActionButton: {
    width: 40,
    height: 40,
    border: 'none',
    background: 'transparent',
    borderRadius: 10,
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
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    color: '#6c757d'
  },
  chatMessageRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 16,
    alignItems: 'flex-end'
  },
  chatMessageRowOwn: {
    flexDirection: 'row-reverse'
  },
  chatMessageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'linear-gradient(145deg, #1e3a8a, #1e40af)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(30, 58, 138, 0.3)'
  },
  chatMessageGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    maxWidth: '70%'
  },
  chatMessageBubble: {
    padding: '12px 16px',
    borderRadius: '18px 18px 18px 4px',
    background: '#fff',
    color: '#344767',
    fontSize: 14,
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
    fontSize: 11,
    color: '#adb5bd',
    alignSelf: 'flex-start',
    marginLeft: 4
  },
  chatMessageTimeOwn: {
    alignSelf: 'flex-end',
    marginRight: 4
  },
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
    display: 'grid',
    placeItems: 'center',
    transition: 'all 0.3s ease',
    color: '#7b809a',
    padding: 0,
    position: 'relative'
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
    background: 'linear-gradient(145deg, #1e3a8a, #1e40af)',
    boxShadow: '5px 5px 15px rgba(30, 58, 138, 0.4), -3px -3px 10px rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    fontSize: 20,
    color: '#ffffff',
    display: 'grid',
    placeItems: 'center',
    transition: 'all 0.3s ease',
    fontWeight: 700,
    padding: 0,
    flexShrink: 0,
    position: 'relative'
  },

  // START: PROJECT PAGE STYLES
  projectTabContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    background: '#e9ecef',
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 20
  },
  projectTabButton: {
    border: 'none',
    padding: '10px 24px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#67748e',
    background: 'transparent',
    transition: 'all 0.2s'
  },
  projectTabButtonActive: {
    background: '#fff',
    color: '#1e3a8a',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  projectTabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  projectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 20
  },
  projectCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    border: '1px solid #e9ecef',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  projectCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  projectCardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1e3a8a',
    marginBottom: 4
  },
  projectCardStatus: (status) => {
    const s = {
      'Đang tiến hành': { bg: '#dbeafe', color: '#1e3a8a' },
      'Tạm dừng': { bg: '#e5e7eb', color: '#374151' },
      'Hoàn thành': { bg: '#d1fae5', color: '#065f46' },
      'Chưa bắt đầu': { bg: '#fee2e2', color: '#991b1b' }
    }
    return {
      padding: '4px 10px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 600,
      background: s[status]?.bg || s['Tạm dừng'].bg,
      color: s[status]?.color || s['Tạm dừng'].color,
    }
  },
  projectCardProgress: {
    width: '100%',
    height: 8,
    background: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden'
  },
  projectCardProgressBar: (progress) => ({
    width: `${progress}%`,
    height: '100%',
    background: 'linear-gradient(195deg, #1e3a8a 0%, #1e40af 100%)',
    borderRadius: 4
  }),
  projectCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  projectCardTeam: {
    display: 'flex',
  },
  projectCardAvatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#1e3a8a',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 700,
    border: '2px solid #fff',
    marginLeft: -8,
  },
  projectCardDue: {
    fontSize: 13,
    color: '#dc2626',
    fontWeight: 600
  },
  
  // Storage Grid
  storageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 16
  },
  storageItem: {
    background: '#fff',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
    border: '1px solid #e9ecef',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  storageIcon: (type) => ({
    fontSize: 24,
    color: type === 'folder' ? '#fbbf24' : '#6b7280'
  }),
  storageInfo: {
    flex: 1
  },
  storageName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#344767',
    marginBottom: 4
  },
  storageMeta: {
    fontSize: 12,
    color: '#7b809a'
  },
  
  // START: NEW PROJECT DETAIL STYLES
  projectSelectorBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    border: '1px solid #e9ecef',
  },
  projectSelector: {
    fontSize: 14,
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #d2d6da',
    background: '#fff',
    fontWeight: 600,
    color: '#344767'
  },
  projectSelectorLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#344767',
    marginRight: 10
  },
  
  subTabsContainer: {
    display: 'flex',
    gap: 8,
    borderBottom: '1px solid #e9ecef',
    marginBottom: 20
  },
  subTabButton: {
    border: 'none',
    background: 'transparent',
    padding: '10px 16px',
    fontSize: 14,
    fontWeight: 600,
    color: '#67748e',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s'
  },
  subTabButtonActive: {
    color: '#1e3a8a',
    borderBottom: '3px solid #1e3a8a'
  },
  
  sprintCard: {
    background: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    border: '1px solid #e9ecef',
    marginBottom: 16
  },
  sprintHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  sprintName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#344767'
  },
  sprintDates: {
    fontSize: 13,
    color: '#7b809a',
    fontWeight: 600,
    marginTop: 4
  },
  sprintActions: {
    display: 'flex',
    gap: 10
  },
  sprintButton: {
    background: 'linear-gradient(195deg, #1e3a8a 0%, #1e40af 100%)',
    border: 'none',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    boxShadow: '0 2px 8px rgba(30, 58, 138, 0.3)'
  },
  
  activityFeed: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  activityItem: {
    display: 'flex',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    background: '#f8f9fa',
    border: '1px solid #e9ecef'
  },
  activityAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'linear-gradient(195deg, #1e3a8a 0%, #1e40af 100%)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0
  },
  activityContent: {
    fontSize: 14,
    color: '#344767'
  },
  activityTime: {
    fontSize: 12,
    color: '#7b809a',
    marginTop: 4
  },
  
  // PROJECTS PAGE STYLES
  projectsContainer: {
    padding: '24px',
    background: '#f0f2f5',
    minHeight: '100vh'
  },
  projectsTable: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  projectsTh: {
    padding: '14px 16px',
    background: '#f8f9fa',
    borderBottom: '2px solid #e9ecef',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '700',
    color: '#7b809a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  projectsTd: {
    padding: '14px 16px',
    borderBottom: '1px solid #e9ecef',
    fontSize: '13px',
    color: '#344767',
    verticalAlign: 'middle'
  },
  projectsTr: {
    transition: 'background 0.2s'
  },
  projectsEmpty: {
    textAlign: 'center',
    padding: '40px 20px',
    background: '#fff',
    color: '#7b809a'
  },
  projectsPagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    background: '#fff',
    borderTop: '1px solid #e9ecef',
    fontSize: '13px',
    color: '#7b809a'
  },
  projectsHeaderBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    background: 'linear-gradient(180deg, rgba(30, 58, 138, 0.1) 0%, transparent 100%)',
    borderBottom: '1px solid #e9ecef',
    marginBottom: '16px',
    borderRadius: '8px 8px 0 0'
  },
  projectsHeaderBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    background: 'linear-gradient(180deg, rgba(30, 58, 138, 0.1) 0%, transparent 100%)',
    borderBottom: '1px solid #e9ecef',
    marginBottom: '16px',
    borderRadius: '8px 8px 0 0'
  },
  projectsFilterTab: {
    background: 'rgba(255, 255, 255, 0.3)',
    border: '1px solid rgba(30, 58, 138, 0.2)',
    color: '#344767',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s'
  },
  
  // PROJECT DETAIL PAGE STYLES
  projectDetailContainer: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: '24px'
  },
  projectDetailHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    color: '#fff'
  },
  projectDetailTitle: {
    fontSize: '28px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  projectDetailActions: {
    display: 'flex',
    gap: '12px'
  },
  projectDetailBtn: {
    background: '#fff',
    color: '#344767',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.2s'
  },
  projectDetailBtnPrimary: {
    background: '#2196F3',
    color: '#fff'
  },
  projectDetailTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    paddingBottom: '12px'
  },
  projectDetailTab: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s'
  },
  projectDetailTabActive: {
    background: '#fff',
    color: '#667eea'
  },
  projectDetailContent: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    marginBottom: '24px'
  },
  projectDetailSearchBar: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '16px',
    padding: '16px',
    background: '#f8f9fa',
    borderRadius: '8px',
    borderBottom: '1px solid #e9ecef'
  },
  projectDetailSearchInput: {
    padding: '10px 14px',
    border: '1px solid #e9ecef',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: 'inherit',
    minWidth: '150px'
  },
  projectDetailSearchInputLarge: {
    padding: '10px 14px',
    border: '1px solid #e9ecef',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: 'inherit',
    flex: 1
  },
  projectDetailToolbar: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap'
  },
  projectDetailToolbarBtn: {
    background: '#2196F3',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s'
  },
  projectDetailStats: {
    display: 'flex',
    gap: '16px',
    padding: '12px 16px',
    background: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '13px',
    color: '#7b809a',
    fontWeight: '600'
  },
  projectDetailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  projectDetailBackBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    marginBottom: '16px',
    transition: 'all 0.2s'
  },
  projectDetailTaskTable: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  projectDetailTaskTh: {
    textAlign: 'left',
    padding: '14px 16px',
    background: '#f8f9fa',
    borderBottom: '1px solid #e9ecef',
    fontSize: '12px',
    fontWeight: '700',
    color: '#7b809a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  projectDetailTaskTd: {
    padding: '14px 16px',
    borderBottom: '1px solid #e9ecef',
    fontSize: '13px',
    color: '#344767',
    verticalAlign: 'middle'
  },
  projectDetailTaskTr: {
    transition: 'background 0.2s'
  },

  // CALENDAR STYLES
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '10px 0',
    borderBottom: '1px solid #e9ecef'
  },
  monthNavButton: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#344767',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#e9ecef',
      borderColor: '#d3d7e8'
    }
  },
  calendarDayHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
    marginBottom: '8px',
    marginTop: '12px'
  },
  calendarDayHeaderCell: {
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: '700',
    color: '#7b809a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '8px'
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
    marginTop: '12px'
  },
  calendarDayCell: {
    minHeight: '100px',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      borderColor: '#d3d7e8'
    }
  }
  // END: CALENDAR STYLES
}
