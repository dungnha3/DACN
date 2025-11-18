import { styles } from './DocumentsPage.styles'

export default function DocumentsPage() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Hợp đồng & Tài liệu</h1>
        <p style={styles.subtitle}>Quản lý hợp đồng và tài liệu cá nhân</p>
      </div>
      
      <div style={styles.content}>
        <div style={styles.placeholderCard}>
          <div style={styles.placeholderIcon}>📄</div>
          <h3 style={styles.placeholderTitle}>Hợp đồng & Tài liệu</h3>
          <p style={styles.placeholderText}>
            Tính năng đang được phát triển
          </p>
        </div>
      </div>
    </div>
  )
}
