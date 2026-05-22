// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: env.VITE_BASE || "/",
    plugins: [react(), svgr()],
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
  };
});
