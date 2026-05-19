export const API_KEYS = {
  catalogos: 'catalogos',
  preregistro: 'preregistro',
  sesion: 'sesion',
}

const API_BASE_URLS = {
  [API_KEYS.catalogos]: import.meta.env.VITE_API_CATALOGOS_URL?.trim(),
  [API_KEYS.preregistro]: import.meta.env.VITE_API_PREREGISTRO_URL?.trim(),
  [API_KEYS.sesion]: import.meta.env.VITE_API_SESION_URL?.trim(),
}

const MENSAJES_CONFIG = {
  [API_KEYS.catalogos]:
    'Falta configurar VITE_API_CATALOGOS_URL para consultar el catálogo de códigos postales.',
  [API_KEYS.preregistro]:
    'Falta configurar VITE_API_PREREGISTRO_URL para conectar la primera etapa del preregistro.',
  [API_KEYS.sesion]:
    'Falta configurar VITE_API_SESION_URL para conectar la segunda etapa del preregistro.',
}

export function obtenerApiBaseUrl(apiKey) {
  const baseUrl = API_BASE_URLS[apiKey]

  if (!baseUrl) {
    throw new Error(MENSAJES_CONFIG[apiKey] ?? 'Falta configurar la URL base del API.')
  }

  return baseUrl.replace(/\/+$/, '')
}
