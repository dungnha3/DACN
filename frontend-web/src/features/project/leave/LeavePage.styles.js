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
  leaveLayout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
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
  addBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(195deg, #3b82f6 0%, #2563eb 100%)',
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
  orderOverview: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 20px 0',
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  orderItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
  },
  orderIcon: (status) => ({
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    backgroundColor: 
      status === 'approved' ? '#dcfce7' : 
      status === 'pending' ? '#fef3c7' : 
      '#fee2e2',
    color:
      status === 'approved' ? '#166534' :
      status === 'pending' ? '#92400e' :
      '#991b1b',
  }),
  orderContent: {
    flex: 1,
  },
  orderTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: '4px',
  },
  orderStatus: {
    fontSize: '12px',
    color: '#64748b',
  },
}
