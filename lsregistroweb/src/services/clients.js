// src/services/clients.js
import { createClient } from "./http";

const useDirect = import.meta.env.VITE_USE_DIRECT_APIS === "1";
const API_ROOT = import.meta.env.VITE_API_URL || "https://libersalus.com/api";

// PREREGISTRO:
// - Si useDirect=1 → baseURL = https://libersalus.com/api  (sin proxy)
// - Si no → baseURL = /api  (usa proxy de Vite)
export const preregApi = createClient({
  devPath: useDirect ? API_ROOT : "/api",
  envVar: "VITE_PREREG_API", // en build prod quedará https://libersalus.com/api/preregistro
  fallback: "https://libersalus.com/api/preregistro",
});

// Los demás pueden quedarse como estaban (si también quieres directo, aplica lo mismo):
export const sesionApi = createClient({
  devPath: "/auth",
  envVar: "VITE_SESION_API",
  fallback: "https://libersalus.com/api/sesion",
});

export const fileApi = createClient({
  devPath: "/file",
  envVar: "VITE_FILE_API",
  fallback: "https://libersalus.com/api/file",
});
