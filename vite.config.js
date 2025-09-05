import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/NYT_list/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.nytimes.com/svc',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
