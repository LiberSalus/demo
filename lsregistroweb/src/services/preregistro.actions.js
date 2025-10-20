// src/services/preregistro.actions.js
import { preregApi } from "@/services/clients";

/**
 * Envía el código por 'correo' o 'telefono', probando rutas simple y doble.
 * Devuelve el path que funcionó (útil para logging).
 */
export async function enviarCodigo({ metodo, identificador }) {
  if (!metodo || !identificador) {
    throw new Error("Faltan datos para enviar código.");
  }

  // En DEV algunos deployments exponen la doble ruta; en PROD suele ser la simple.
  const candidates = import.meta.env.DEV
    ? [
        `/preregistro/preregistro/enviar-codigo-${metodo}/`,
        `/preregistro/enviar-codigo-${metodo}/`,
      ]
    : [
        `/preregistro/enviar-codigo-${metodo}/`,
        `/preregistro/preregistro/enviar-codigo-${metodo}/`,
      ];

  let lastErr = null;
  for (const path of candidates) {
    try {
      const res = await preregApi.post(path, { identificador });
      // Si llegó aquí, funcionó
      console.debug("[PREREG] código enviado vía", path, res.status);
      return path;
    } catch (err) {
      const code = err?.response?.status;
      console.warn("[PREREG] intento fallido", path, code);
      // Si es 404 probamos la siguiente; otros errores los propagamos
      if (code !== 404) throw err;
      lastErr = err;
    }
  }
  // Si ninguna ruta respondió, lanza el último error (404)
  throw lastErr || new Error("No se encontró el endpoint para enviar el código.");
}
