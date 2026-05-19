import { API_KEYS } from '../../../servicios/apiConfig'
import { crearApiClient } from '../../../servicios/apiClient'
import { API_ROUTES } from '../../../servicios/apiRoutes'
import { DEV_AUTH_BRIDGE, obtenerDashboardBaseUrl } from '../../../servicios/env'

const sesionApi = crearApiClient(API_KEYS.sesion)
const rutasSesion = API_ROUTES.sesion

const AUTH_READY_KEY = 'auth_ready'
const PERFIL_MIN_KEY = 'perfil_min'
const ACCESS_TOKEN_KEY = 'access_token'
const DEV_TOKEN_PARAM = 'dev_access_token'
const DEV_EMAIL_PARAM = 'dev_email'
const DEV_LOGOUT_PARAM = 'dev_logout'

function normalizarToken(valor) {
  if (typeof valor !== 'string') {
    return ''
  }

  return valor
    .trim()
    .replace(/^"|"$/g, '')
    .replace(/^Bearer\s+/i, '')
    .trim()
}

function pareceToken(valor) {
  const token = normalizarToken(valor)

  return (
    token.length > 20 &&
    !/\s/.test(token)
  )
}

function buscarTokenEnObjeto(valor) {
  if (!valor || typeof valor !== 'object') {
    return ''
  }

  const llavesPrioritarias = [
    'access_token',
    'accessToken',
    'token_acceso',
    'tokenAcceso',
    'token_de_acceso',
    'tokenDeAcceso',
    'token',
    'jwt',
    'access',
    'bearer',
    'authorization',
  ]

  for (const llave of llavesPrioritarias) {
    const token = normalizarToken(valor[llave])

    if (token) {
      return token
    }
  }

  for (const item of Object.values(valor)) {
    if (pareceToken(item)) {
      return normalizarToken(item)
    }

    const tokenAnidado = buscarTokenEnObjeto(item)

    if (tokenAnidado) {
      return tokenAnidado
    }
  }

  return ''
}

function obtenerAccessToken(respuesta) {
  if (typeof respuesta === 'string' && respuesta.trim()) {
    const texto = normalizarToken(respuesta)

    try {
      return obtenerAccessToken(JSON.parse(texto))
    } catch {
      return texto
    }
  }

  return buscarTokenEnObjeto(respuesta)
}

function obtenerNombreUsuario(usuario = {}, correo = '') {
  if (usuario.first_name && usuario.last_name) {
    return `${usuario.first_name} ${usuario.last_name}`
  }

  return usuario.nombre || usuario.name || correo || 'Usuario'
}

function guardarSesion({ respuesta, correo }) {
  const accessToken = obtenerAccessToken(respuesta)

  if (!accessToken) {
    throw new Error('El servidor no devolvió un token de acceso.')
  }

  const usuario =
    typeof respuesta === 'object' && respuesta
      ? respuesta.user || respuesta.usuario || {}
      : {}

  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(AUTH_READY_KEY, '1')
  localStorage.setItem(
    PERFIL_MIN_KEY,
    JSON.stringify({
      nombre: obtenerNombreUsuario(usuario, correo),
      email: usuario.email || usuario.correo || correo,
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      sexo: usuario.sexo || usuario.genero || usuario.gender,
    }),
  )
}

export function limpiarSesionLocalDesdeLogoutDev() {
  if (!DEV_AUTH_BRIDGE || typeof window === 'undefined') {
    return false
  }

  const url = new URL(window.location.href)

  if (url.searchParams.get(DEV_LOGOUT_PARAM) !== '1') {
    return false
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(AUTH_READY_KEY)
  localStorage.removeItem(PERFIL_MIN_KEY)
  url.searchParams.delete(DEV_LOGOUT_PARAM)
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`)

  return true
}

export async function iniciarSesion({ correo, contrasena }) {
  const respuesta = await sesionApi(rutasSesion.medicionesIniciarSesion, {
    method: 'POST',
    body: {
      identificador: correo,
      tipo_identificador: 'correo',
      contrasena,
    },
    credentials: 'omit',
  })

  guardarSesion({ respuesta, correo })

  return respuesta
}

export function obtenerDashboardUrl({ respuesta, correo } = {}) {
  const dashboardUrl = obtenerDashboardBaseUrl()
  const accessToken = obtenerAccessToken(respuesta)

  if (!DEV_AUTH_BRIDGE) {
    return dashboardUrl
  }

  const url = new URL(dashboardUrl, window.location.origin)

  url.searchParams.set(DEV_TOKEN_PARAM, accessToken)

  if (correo) {
    url.searchParams.set(DEV_EMAIL_PARAM, correo)
  }

  return url.toString()
}
