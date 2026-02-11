// src/utils/ensureId.js

/**
 * Asegura que el objeto tenga un id único.
 * - Si ya trae id, lo respeta.
 * - Si no trae id, asigna crypto.randomUUID() (o fallback seguro).
 */
export function ensureId(obj) {
  const hasId =
    obj && obj.id !== undefined && obj.id !== null && String(obj.id).trim() !== "";

  if (hasId) return obj;

  const uuid =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random()
      .toString(16)
      .slice(2)}`;

  return { ...obj, id: uuid };
}
