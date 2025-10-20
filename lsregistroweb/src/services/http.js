// http.js
import axios from "axios";

function pickBaseURL({ devPath, envVar, fallback }) {
  if (import.meta.env.DEV) return devPath;
  return import.meta.env[envVar] || fallback;
}

export function createClient({ devPath, envVar, fallback }) {
  const instance = axios.create({
    baseURL: pickBaseURL({ devPath, envVar, fallback }),
    timeout: 30000,
    withCredentials: false, // ponlo true solo si realmente usas cookies/sesión
  });

  instance.interceptors.request.use((config) => {
    config.metadata = { started: performance.now?.() };
    console.debug(
      "[HTTP] →",
      (config.method || "GET").toUpperCase(),
      (config.baseURL || "") + (config.url || "")
    );
    return config;
  });

  instance.interceptors.response.use(
    (res) => {
      const took = ((performance.now?.() || 0) - (res.config.metadata?.started || 0)).toFixed(0);
      console.debug("[HTTP] ←", res.status, res.config.url, `${took}ms`);
      return res;
    },
    (err) => {
      const cfg = err.config || {};
      const took = ((performance.now?.() || 0) - (cfg.metadata?.started || 0)).toFixed(0);
      console.warn("[HTTP] ✖", err.response?.status || "ERR", cfg?.url, `${took}ms`, err.message);
      return Promise.reject(err);
    }
  );

  return instance;
}
