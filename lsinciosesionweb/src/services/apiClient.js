// src/services/apiClient.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API || "https://libersalus.com/api/";

const api = axios.create({
  baseURL,
  timeout: 300000,
  withCredentials: true,
});

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

// Adjunta Authorization solo cuando existe token legible por el frontend.
api.interceptors.request.use((cfg) => {
  if (_token) cfg.headers.Authorization = `Bearer ${_token}`;
  return cfg;
});

// Ante 401 se limpia el estado local y se avisa a las rutas protegidas.
// Algunas consultas informativas pueden omitir esta limpieza para no cerrar
// sesión cuando solo estamos intentando completar datos secundarios.
api.interceptors.response.use(
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

export default api;
