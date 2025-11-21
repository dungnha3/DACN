// Styles for Project Manager Dashboard - Soft UI Design
export const styles = {
  appShell: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  
  // Sidebar
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '280px',
    height: '100vh',
    background: 'linear-gradient(195deg, #1e3a8a 0%, #0f172a 100%)',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    overflowY: 'auto',
    overflowX: 'hidden',
    zIndex: 1000
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
    marginBottom: 16
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'linear-gradient(195deg, #dc2626 0%, #991b1b 100%)',
    display: 'grid',
    placeItems: 'center',
    fontSize: 20,
    boxShadow: '0 4px 16px rgba(220, 38, 38, 0.5)',
    flexShrink: 0
  },
  brandName: {
    fontSize: 15,
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.2
  },
  brandSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2
  },
  divider: {
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
    margin: '8px 0'
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    flexShrink: 0,
    marginBottom: 4
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 700,
    fontSize: 15,
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
    flexShrink: 0
  },
  userInfo: { flex: 1, minWidth: 0 },
  userName: { fontWeight: 600, color: '#fff', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userRole: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  navGroup: {
    marginBottom: 12,
    flexShrink: 0
  },
  navGroupLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: 8,
    paddingLeft: 12
  },
  navItem: {
    width: '100%',
    textAlign: 'left',
    padding: '10px 14px',
    borderRadius: 10,
    border: 'none',
    background: 'transparent',
    color: 'rgba(255,255,255,0.85)',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    transition: 'all 0.2s ease',
    marginBottom: 4
  },
  navIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  navItemActive: {
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444',
    fontWeight: 600,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
  },
  
  // Settings Dropdown
  settingsDropdown: {
    marginTop: 'auto',
    flexShrink: 0,
    paddingTop: 12,
    paddingBottom: 12,
    borderTop: '1px solid rgba(255,255,255,0.1)',
    position: 'sticky',
    bottom: 0,
    background: 'linear-gradient(195deg, #1e3a8a 0%, #0f172a 100%)'
  },
  settingsBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  dropdownMenu: {
    marginTop: 10,
    marginBottom: 4,
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  dropdownItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  dropdownDivider: {
    height: 1,
    background: 'rgba(255,255,255,0.1)',
    margin: '4px 0',
  },
  
  // Main Content
  content: {
    flex: 1,
    marginLeft: '280px',
    minHeight: '100vh',
    padding: '24px 32px',
    overflowY: 'auto',
    overflowX: 'hidden',
    boxSizing: 'border-box'
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
  statusBadge: {
    display: 'inline-block',
    padding: '5px 12px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600
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
  }
}
