import { styles } from './PayrollPage.styles'

export default function PayrollPage() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Phiếu lương</h1>
        <p style={styles.subtitle}>Xem thông tin lương và phụ cấp</p>
      </div>
      
      <div style={styles.content}>
        <div style={styles.placeholderCard}>
          <div style={styles.placeholderIcon}>💰</div>
          <h3 style={styles.placeholderTitle}>Phiếu lương</h3>
          <p style={styles.placeholderText}>
            Tính năng đang được phát triển
          </p>
        </div>
      </div>
    </div>
  )
}
