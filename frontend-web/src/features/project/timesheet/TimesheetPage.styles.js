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
  tableCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  checkInBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(195deg, #10b981 0%, #059669 100%)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e2e8f0',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '16px 12px',
    fontSize: '14px',
    color: '#1e293b',
  },
  hoursCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  hoursBar: (hours) => ({
    width: '80px',
    height: '6px',
    backgroundColor: '#e2e8f0',
    borderRadius: '3px',
    position: 'relative',
    overflow: 'hidden',
    '::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      width: `${(hours / 9) * 100}%`,
      backgroundColor: hours >= 8.5 ? '#10b981' : hours >= 7 ? '#f59e0b' : '#ef4444',
      borderRadius: '3px',
    }
  }),
  hoursText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
  },
}
