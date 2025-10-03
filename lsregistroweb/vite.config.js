// vite.config.js (lsregistroweb)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  base: "/registro/",
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    proxy: {
      // === 8040 :: PRE-REGISTRO ===
      "/api": {
        target: "https://libersalus.com/api/preregistro",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },

      // === 8060 :: SESIÓN (si algo de registro pega auth temporalmente) ===
      "/auth": {
        target: "https://libersalus.com/api/sesion",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/auth/, ""),
      },

      // === 8060 :: CURP extractor si corre ahí (ajusta si queda en otro) ===
      "/ine": {
        target: "https://libersalus.com/api/sesion",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/ine/, ""),
      },

      // === 8020 :: ARCHIVOS (si subes PDFs/imagenes en registro) ===
      "/file": {
        target: "https://libersalus.com/api/file",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/file/, ""),
      },

      // === CP externo (como ya lo tenías) ===
      "/cp": {
        target:
          "https://catalogos-nom024-fastapi-bigquery-967885369144.europe-west1.run.app",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/cp/, ""),
      },
    },
  },
});
