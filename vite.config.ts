import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Use Vite's default dev port to avoid colliding with the backend (which runs on 8080)
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // backend
        changeOrigin: true,
        secure: false,
        ws: false, // disable websocket proxying unless needed
        // optional: short timeout to fail faster
        timeout: 10000,
      },
    },
  },
})