import { obtenerApiBaseUrl } from './apiConfig'

function construirUrl(apiKey, ruta) {
  const baseNormalizada = obtenerApiBaseUrl(apiKey)
  const rutaNormalizada = ruta.startsWith('/') ? ruta : `/${ruta}`

  return `${baseNormalizada}${rutaNormalizada}`
}

function obtenerMensajeError(payload, mensajeRespaldo) {
  if (!payload) {
    return mensajeRespaldo
  }

  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (Array.isArray(payload?.detail) && payload.detail.length > 0) {
    return payload.detail.map((detalle) => detalle.msg).filter(Boolean).join(', ')
  }

  if (typeof payload?.detail === 'string' && payload.detail.trim()) {
    return payload.detail
  }

  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message
  }

  return mensajeRespaldo
}

async function parsearRespuesta(respuesta) {
  const tipoContenido = respuesta.headers.get('content-type') ?? ''

  if (tipoContenido.includes('application/json')) {
    return respuesta.json()
  }

  return respuesta.text()
}

export async function apiRequest(apiKey, ruta, opciones = {}) {
  const {
    body,
    headers = {},
    method = 'GET',
    credentials = 'include',
    ...resto
  } = opciones

  const esFormData = body instanceof FormData
  const esUrlSearchParams = body instanceof URLSearchParams
  const encabezados = new Headers(headers)

  if (
    !esFormData &&
    !esUrlSearchParams &&
    body !== undefined &&
    !encabezados.has('Content-Type')
  ) {
    encabezados.set('Content-Type', 'application/json')
  }

  const respuesta = await fetch(construirUrl(apiKey, ruta), {
    method,
    credentials,
    headers: encabezados,
    body:
      body === undefined
        ? undefined
        : esFormData || esUrlSearchParams
          ? body
          : JSON.stringify(body),
    ...resto,
  })

  const payload = await parsearRespuesta(respuesta)

  if (!respuesta.ok) {
    throw new Error(
      obtenerMensajeError(payload, `La solicitud falló con código ${respuesta.status}.`),
    )
  }

  return payload
}

export function crearApiClient(apiKey) {
  return (ruta, opciones) => apiRequest(apiKey, ruta, opciones)
}
