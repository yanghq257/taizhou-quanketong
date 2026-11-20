import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 相对 base，方便部署到院内任意静态目录；HashRouter 不依赖服务端重写。
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
})
