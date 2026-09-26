import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // 開発時は /api を wrangler dev（8787）へ転送し、本番と同じパスで呼べるようにする
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
