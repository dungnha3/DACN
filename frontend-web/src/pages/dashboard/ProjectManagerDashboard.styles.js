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
    gridTemplateColumns: '320px 1fr',
    gap: 20,
    height: 'calc(100vh - 140px)',
    overflow: 'hidden'
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
    width: 36,
    height: 36,
    border: 'none',
    background: 'transparent',
    borderRadius: 8,
    cursor: 'pointer',
    color: '#7b809a',
    display: 'grid',
    placeItems: 'center',
    transition: 'all 0.2s'
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
    borderTop: '1px solid #f0f2f5',
    background: '#fff'
  },
  chatInputToolbar: {
    display: 'flex',
    gap: 8,
    marginBottom: 12
  },
  chatToolButton: {
    width: 32,
    height: 32,
    border: 'none',
    background: '#f8f9fa',
    borderRadius: 8,
    cursor: 'pointer',
    color: '#7b809a',
    display: 'grid',
    placeItems: 'center',
    transition: 'all 0.2s'
  },
  chatInputWrapper: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-end'
  },
  chatMessageInput: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #e9ecef',
    borderRadius: 12,
    fontSize: 14,
    outline: 'none',
    resize: 'none',
    minHeight: 44,
    maxHeight: 120,
    transition: 'all 0.2s'
  },
  chatSendButton: {
    width: 44,
    height: 44,
    border: 'none',
    background: 'linear-gradient(145deg, #1e3a8a, #1e40af)',
    borderRadius: 12,
    cursor: 'pointer',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
  }
}
