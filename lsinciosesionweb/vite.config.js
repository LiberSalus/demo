// vite.config.js (lsinicio/panel)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  base: "/panel/",
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    port: 5174,
    proxy: {
      // === 8060 :: SESIÓN (login/refresh/decode/logout) ===
      "/api": {
        target: "https://libersalus.com/api/sesion",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
      // === 8020 :: ARCHIVOS (foto de perfil, etc.) ===
      "/file": {
        target: "https://libersalus.com/api/file",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/file/, ""),
      },
    },
  },
});
