import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        // en tournant en local ça aurait été http://localhost:5000
        // en tournant sur docker : http://back:5000
        target: 'http://back:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
