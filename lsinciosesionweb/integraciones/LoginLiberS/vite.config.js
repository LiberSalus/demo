import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: false,
    proxy: {
      '/api-preregistro': {
        target: 'https://libersalus.com',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: '',
        rewrite: (path) => path.replace(/^\/api-preregistro/, '/api/preregistro'),
      },
      '/api-sesion': {
        target: 'https://libersalus.com',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: '',
        rewrite: (path) => path.replace(/^\/api-sesion/, '/api/sesion'),
      },
      '/api-catalogos': {
        target: 'https://catalogos-nom024-fastapi-bigquery-967885369144.europe-west1.run.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api-catalogos/, ''),
      },
    },
  },
})
