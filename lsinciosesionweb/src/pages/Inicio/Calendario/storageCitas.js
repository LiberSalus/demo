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
export function normalizeCitasPorFecha(map = {}) {
  const out = {};

  for (const [dateKey, list] of Object.entries(map || {})) {
    out[dateKey] = Array.isArray(list) ? list.map((c) => ensureId(c)) : [];
  }

  return out;
}

/**
 * Carga citas desde localStorage.
 * Si no existe nada, usa fallback (por ejemplo CITAS_INICIALES).
 */
export function loadCitasPorFecha(fallback = {}) {
  try {
    const raw = localStorage.getItem(LS_CITAS_KEY);
    if (!raw) return normalizeCitasPorFecha(fallback);

    const parsed = JSON.parse(raw);
    return normalizeCitasPorFecha(parsed);
  } catch {
    return normalizeCitasPorFecha(fallback);
  }
}

/**
 * Guarda el mapa de citas en localStorage
 */
export function saveCitasPorFecha(map = {}) {
  try {
    localStorage.setItem(LS_CITAS_KEY, JSON.stringify(map));
  } catch {
    null;
  }
}
