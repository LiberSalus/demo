// src/services/auth.js
import api, { clearAuthToken, getAuthToken, setAuthToken } from "./apiClient";
import { DEV_AUTH_BRIDGE } from "./env";

const USAR_MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH === "1";
const CLAVE_SESION_LISTA = "auth_ready";
const CLAVE_PERFIL_MINIMO = "perfil_min";
const PARAM_TOKEN_DEV = "dev_access_token";
const PARAM_CORREO_DEV = "dev_email";
const PARAM_SESION_LISTA_DEV = "dev_auth_ready";

function normalizarToken(valor) {
  if (typeof valor !== "string") return "";

  return valor
    .trim()
    .replace(/^"|"$/g, "")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

function pareceToken(valor) {
  const token = normalizarToken(valor);

  return token.length > 20 && !/\s/.test(token);
}

function buscarTokenEnObjeto(valor) {
  if (!valor || typeof valor !== "object") return "";

  // El backend ha devuelto tokens con distintas formas; priorizamos nombres
  // explícitos antes de buscar en objetos anidados.
  const llavesPrioritarias = [
    "access_token",
    "accessToken",
    "token_acceso",
    "tokenAcceso",
    "token_de_acceso",
    "tokenDeAcceso",
    "token",
    "jwt",
    "access",
    "bearer",
    "authorization",
  ];

  for (const llave of llavesPrioritarias) {
    const token = normalizarToken(valor[llave]);
    if (token) return token;
  }

  for (const item of Object.values(valor)) {
    if (pareceToken(item)) return normalizarToken(item);

    const tokenAnidado = buscarTokenEnObjeto(item);
    if (tokenAnidado) return tokenAnidado;
  }

  return "";
}

function obtenerTokenDeRespuesta(datos) {
  if (typeof datos === "string" && datos.trim()) {
    const texto = normalizarToken(datos);

    try {
      return obtenerTokenDeRespuesta(JSON.parse(texto));
    } catch {
      return texto;
    }
  }

  return buscarTokenEnObjeto(datos);
}

function crearTokenFalso({ usuario, rol }) {
  const encabezado = { alg: "none", typ: "JWT" };
  const ahoraSegundos = Math.floor(Date.now() / 1000);
  const payload = {
    sub: "u-dev",
    name: usuario || "Usuario Dev",
    role: rol || "paciente",
    iat: ahoraSegundos,
    exp: ahoraSegundos + 60 * 60 * 24,
  };
  const aBase64 = (objeto) => btoa(JSON.stringify(objeto));

  return `${aBase64(encabezado)}.${aBase64(payload)}.`;
}

export function estaAutenticado() {
  return Boolean(getAuthToken() || localStorage.getItem(CLAVE_SESION_LISTA));
}

export function limpiarSesionAutenticacion() {
  clearAuthToken();
  localStorage.removeItem(CLAVE_SESION_LISTA);
  localStorage.removeItem(CLAVE_PERFIL_MINIMO);
}

export function iniciarSesionDevDesdeUrl() {
  if (!DEV_AUTH_BRIDGE || typeof window === "undefined") return false;

  const url = new URL(window.location.href);
  const token = url.searchParams.get(PARAM_TOKEN_DEV);
  const sesionLista = url.searchParams.get(PARAM_SESION_LISTA_DEV) === "1";

  if (!token && !sesionLista) return false;

  const correo = url.searchParams.get(PARAM_CORREO_DEV) || "";

  // Puente solo para desarrollo local: LoginLiberS corre en otro puerto y
  // comparte la sesión con el dashboard mediante parámetros temporales.
  if (token) setAuthToken(token);
  else clearAuthToken();

  localStorage.setItem(CLAVE_SESION_LISTA, "1");

  if (correo && !localStorage.getItem(CLAVE_PERFIL_MINIMO)) {
    localStorage.setItem(
      CLAVE_PERFIL_MINIMO,
      JSON.stringify({
        nombre: correo,
        email: correo,
      })
    );
  }

  url.searchParams.delete(PARAM_TOKEN_DEV);
  url.searchParams.delete(PARAM_CORREO_DEV);
  url.searchParams.delete(PARAM_SESION_LISTA_DEV);
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);

  return true;
}

export async function iniciarSesion({ username, password, role = "paciente" }) {
  if (USAR_MOCK_AUTH) {
    if (!username || !password) throw new Error("Credenciales requeridas");

    const access_token = crearTokenFalso({ usuario: username, rol: role });
    setAuthToken(access_token);

    return {
      access_token,
      token_type: "bearer",
      user: {
        first_name: "Dev",
        last_name: "User",
        email: username,
      },
    };
  }

  const body = new URLSearchParams();
  body.set("grant_type", "password");
  body.set("username", username);
  body.set("password", password);
  body.set("scope", role);

  const { data } = await api.post("sesion/auth/token", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const token = obtenerTokenDeRespuesta(data);
  if (token) setAuthToken(token);

  return data;
}

export const decodificarToken = () =>
  api.get("sesion/auth/decode-token").then((respuesta) => respuesta.data);

export const refrescarToken = () =>
  api.post("sesion/auth/refresh-token").then((respuesta) => respuesta.data);

export async function cerrarSesion() {
  try {
    return await api.post("sesion/auth/logout").then((respuesta) => respuesta.data);
  } finally {
    // Siempre limpiamos la sesión local aunque el endpoint falle, para no dejar
    // al usuario atrapado en el dashboard.
    limpiarSesionAutenticacion();
  }
}
