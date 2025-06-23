import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://hossamoka4a.pythonanywhere.com',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('🔴 Proxy Error:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('📤 Sending Request:', req.method, req.url);
            console.log('🎯 Target URL:', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('📥 Received Response:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
}) 