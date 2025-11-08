import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // keep /api prefix because backend maps /api/auth
      },
      '/phong-ban': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/chuc-vu': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/hop-dong': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
