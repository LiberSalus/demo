// vite.config.js (solo local)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

const LOCAL_HOST = "http://192.168.100.100";

export default defineConfig({
  base: "/registro/",
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    proxy: {
      // === 8040 :: PRE-REGISTRO ===
      "/api": {
        target: `${LOCAL_HOST}:8040`,
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api/, ""), // /api/x -> /x   (raíz 8040)
      },

      // === 8060 :: SESIÓN / INE extractor (ajústalo si cambiara) ===
      "/auth": {
        target: `${LOCAL_HOST}:8060`,
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/auth/, ""), // /auth/x -> /x
      },
      "/ine": {
        target: `${LOCAL_HOST}:8060`,
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/ine/, ""), // /ine/x -> /x
      },
      "/cp": {
        target: `https://catalogos-nom024-fastapi-bigquery-967885369144.europe-west1.run.app/`,
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/cp/, ""), // /cp/x -> /x
      },

      // === 8020 :: ARCHIVOS ===
      "/file": {
        target: `${LOCAL_HOST}:8020`,
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/file/, ""), // /file/x -> /x
      },
    },
  },
});
