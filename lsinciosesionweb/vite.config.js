// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_BASE || '/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      // Previene duplicados de React si trabajas con workspaces / links
      dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
    },
    server: {
      port: 5173,
      // si usas proxy, configúralo aquí SIN importar nada de src
      // proxy: { '/api': { target: env.VITE_API, changeOrigin: true } }
    },
  }
})
