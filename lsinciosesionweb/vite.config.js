// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: env.VITE_BASE || "/",
    plugins: [react(), 
      svgr(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["vite.svg"],
        manifest: {
          name: "Libersalus",
          short_name: "Libersalus",
          description: "Gestión de salud",
          start_url: "/panel/",
          scope: "/panel/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#ffffff",
          icons: [
            {
              src: "vite.svg",
              sizes: "any",
              type: "image/svg+xml",
            },
          ],
        },
      })

    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      // Previene duplicados de React si trabajas con workspaces / links
      dedupe: ["react", "react-dom", "react-router", "react-router-dom"],
    },
    /*  server: {
      port: 5173,
      // si usas proxy, configúralo aquí SIN importar nada de src
       proxy: { '/api': { target: env.VITE_API, changeOrigin: true } }
    }, */
    server: {
      host: "0.0.0.0",
      port: 5174,
      strictPort: false,
      open:'chrome',
      proxy: {
        "/api": {
          target: "https://libersalus.com",
          changeOrigin: true,
          secure: true,
          // Quita el Domain de la cookie para que el navegador la acepte
          // tanto al entrar por localhost como por la IP local de la red.
          cookieDomainRewrite: "",
          configure: (proxy) => {
            proxy.on("proxyRes", (proxyRes) => {
              const cookies = proxyRes.headers["set-cookie"];

              if (!cookies) return;

              proxyRes.headers["set-cookie"] = cookies.map((cookie) =>
                cookie
                  .replace(/;\s*Domain=[^;]+/i, "")
                  .replace(/;\s*Secure/gi, "")
              );
            });
          },
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Separa librerias pesadas para que el bundle inicial no cargue todo junto.
          manualChunks(id) {
            if (!id.includes("node_modules")) return undefined;
            const rutaModulo = id.replace(/\\/g, "/");

            if (
              rutaModulo.includes("/node_modules/@mui/") ||
              rutaModulo.includes("/node_modules/@emotion/")
            ) {
              return "mui-vendor";
            }
            if (
              /\/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(
                rutaModulo
              )
            ) {
              return "react-vendor";
            }
            if (rutaModulo.includes("/node_modules/recharts/")) {
              return "recharts-vendor";
            }
            if (rutaModulo.includes("/node_modules/dayjs/")) {
              return "date-vendor";
            }
            return undefined;
          },
        },
      },
    },
  };
});
