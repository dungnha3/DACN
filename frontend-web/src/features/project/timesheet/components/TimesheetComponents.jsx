export const StatusBadge = ({ status }) => {
  const statusConfig = {
    normal: { bg: '#dcfce7', color: '#166534', text: 'Bình thường' },
    late: { bg: '#fef3c7', color: '#92400e', text: 'Đi muộn' },
    early: { bg: '#dbeafe', color: '#1e3a8a', text: 'Về sớm' },
  }
  
  const config = statusConfig[status] || statusConfig.normal
  
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: config.bg,
      color: config.color,
    }}>
      {config.text}
    </span>
  )
}
