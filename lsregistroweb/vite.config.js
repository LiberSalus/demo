// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(() => ({
  base: "/", // 👈 clave
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api":  { target: "https://libersalus.com/api/preregistro", changeOrigin: true, secure: false, rewrite: p => p.replace(/^\/api/, "") },
      "/auth": { target: "https://libersalus.com/api/sesion",      changeOrigin: true, secure: false, rewrite: p => p.replace(/^\/auth/, "") },
      "/ine":  { target: "https://libersalus.com/api/sesion",      changeOrigin: true, secure: false, rewrite: p => p.replace(/^\/ine/, "") },
      "/file": { target: "https://libersalus.com/api/file",        changeOrigin: true, secure: false, rewrite: p => p.replace(/^\/file/, "") },
      "/cp":   { target: "https://catalogos-nom024-fastapi-bigquery-967885369144.europe-west1.run.app", changeOrigin: true, secure: false, rewrite: p => p.replace(/^\/cp/, "") },
    },
  },
}));
