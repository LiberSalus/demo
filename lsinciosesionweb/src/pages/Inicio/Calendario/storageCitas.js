// src/pages/Inicio/Calendario/storageCitas.js

import { ensureId } from "@/utils/ensureId";

export const LS_CITAS_KEY = "ls_citas_por_fecha";

/**
 * Normaliza el shape:
 * {
 *   "YYYY-MM-DD": [ { ...cita }, ... ],
 *   ...
 * }
 * - Asegura que cada cita tenga id (UUID)
 * - Asegura que el valor por fecha siempre sea array
 */
export function normalizeCitasPorFecha(mapa = {}) {
  const resultado = {};

  for (const [claveFecha, lista] of Object.entries(mapa || {})) {
    resultado[claveFecha] = Array.isArray(lista)
      ? lista.map((cita) => ensureId(cita))
      : [];
  }

  return resultado;
}

/**
 * Carga citas desde localStorage.
 * Si no existe nada, usa fallback (por ejemplo CITAS_INICIALES).
 */
export function loadCitasPorFecha(fallback = {}) {
  try {
    const citasGuardadas = localStorage.getItem(LS_CITAS_KEY);
    if (!citasGuardadas) return normalizeCitasPorFecha(fallback);

    const citasParseadas = JSON.parse(citasGuardadas);
    return normalizeCitasPorFecha(citasParseadas);
  } catch {
    return normalizeCitasPorFecha(fallback);
  }
}

/**
 * Guarda el mapa de citas en localStorage
 */
export function saveCitasPorFecha(mapa = {}) {
  try {
    localStorage.setItem(LS_CITAS_KEY, JSON.stringify(mapa));
  } catch {
    null;
  }
}
