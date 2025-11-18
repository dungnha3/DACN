import { useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { styles } from './ProfilePage.styles'

export default function ProfilePage() {
  const { user: authUser } = useAuth()
  const username = authUser?.username || localStorage.getItem('username') || 'Project Manager'

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Hồ sơ cá nhân</h1>
        <p style={styles.subtitle}>Xem và cập nhật thông tin cá nhân</p>
      </div>
      
      <div style={styles.content}>
        <div style={styles.placeholderCard}>
          <div style={styles.placeholderIcon}>👤</div>
          <h3 style={styles.placeholderTitle}>Hồ sơ cá nhân</h3>
          <p style={styles.placeholderText}>
            Tính năng đang được phát triển
          </p>
          <p style={styles.userName}>Xin chào, {username}!</p>
        </div>
      </div>
    </div>
  )
}
