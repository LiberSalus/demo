// src/services/apiClient.js
import axios from "axios";
import { DEMO_ACTIVO } from "@/config/demo.config";
import {
  construirClaimsDemo,
  construirHomeDemo,
  construirRespuestaLogin,
  NOTICIAS_DEMO,
} from "@/config/demo.config";

const baseURL = import.meta.env.VITE_API || "https://libersalus.com/api/";

const CLAVE_ACCESS_TOKEN = "access_token";
const CLAVE_SESION_LISTA = "auth_ready";
const CLAVE_PERFIL_MINIMO = "perfil_min";
const EVENTO_SESION_NO_AUTORIZADA = "sesion:no-autorizada";
let _token = localStorage.getItem("access_token") || null;

// Guarda o elimina el token visible; la sesion por cookie HttpOnly se conserva en el navegador.
export const setAuthToken = (t) => {
  _token = t || null;
  if (t) localStorage.setItem(CLAVE_ACCESS_TOKEN, t);
  else localStorage.removeItem(CLAVE_ACCESS_TOKEN);
};

// Devuelve el token visible en memoria para validar guards y preparar requests.
export const getAuthToken = () => _token;

// Atajo centralizado para limpiar el token visible sin tocar otros datos de sesion.
export const clearAuthToken = () => setAuthToken(null);

// Detecta la ruta correspondiente para resolver una consulta demo sin red.
function resolverRutaDemo(metodo, ruta) {
  const url = String(ruta || "");

  const coincide = (fragmentos) =>
    fragmentos.some((fragmento) => url.includes(fragmento));

  if (coincide(["decode-token"])) {
    return { data: { claims: construirClaimsDemo() } };
  }

  if (coincide(["sesion/auth/token", "refresh-token"])) {
    return { data: construirRespuestaLogin() };
  }

  if (coincide(["logout"])) {
    return { data: {} };
  }

  if (coincide(["paciente/home"])) {
    return { data: construirHomeDemo() };
  }

  if (coincide(["medico/home"])) {
    return { data: {} };
  }

  if (coincide(["getListNews"])) {
    return { data: NOTICIAS_DEMO };
  }

  if (coincide(["foto/perfil"])) {
    return { data: null };
  }

  // Flujo de preregistro (registro) resuelve en demo sin backend.
  if (coincide(["enviar-codigo-correo", "validar-correo", "reenviar-codigo", "registro/", "guardar-curp", "guardar-direccion", "buscar-correo"])) {
    return { data: { id: 9001 } };
  }

  // Respuesta de respaldo segura para rutas no catalogadas.
  return { data: metodo.toLowerCase() === "post" ? {} : [] };
}

// Adaptador demo: mantiene el mismo interfaz (`{ data }`) que axios para que
// ningun servicio tenga que conocer la existencia del modo offline.
function crearApiDemo() {
  const resolver = (metodo, ruta) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(resolverRutaDemo(metodo, ruta)), 80);
    });

  return {
    get: (ruta) => resolver("get", ruta),
    post: (ruta) => resolver("post", ruta),
  };
}

// Interceptor para la instancia real de axios (solo se usa fuera del modo demo).
const apiReal = axios.create({
  baseURL,
  timeout: 300000,
  withCredentials: true,
});

// Adjunta Authorization solo cuando existe token legible por el frontend.
apiReal.interceptors.request.use((cfg) => {
  if (_token) cfg.headers.Authorization = `Bearer ${_token}`;
  return cfg;
});

// Ante 401 se limpia el estado local y se avisa a las rutas protegidas.
apiReal.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const omitirLimpiezaSesion = Boolean(error?.config?.omitirLimpiezaSesion);

    if (error?.response?.status === 401 && !omitirLimpiezaSesion) {
      _token = null;
      localStorage.removeItem(CLAVE_ACCESS_TOKEN);
      localStorage.removeItem(CLAVE_SESION_LISTA);
      localStorage.removeItem(CLAVE_PERFIL_MINIMO);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(EVENTO_SESION_NO_AUTORIZADA));
      }
    }

    return Promise.reject(error);
  }
);

// En modo demo la app trabaja completamente offline con datos de ejemplo.
const api = DEMO_ACTIVO ? crearApiDemo() : apiReal;

export default api;