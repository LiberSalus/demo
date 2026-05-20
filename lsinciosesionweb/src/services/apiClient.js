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
export const setAuthToken = (t) => {
  _token = t || null;
  if (t) localStorage.setItem(CLAVE_ACCESS_TOKEN, t);
  else localStorage.removeItem(CLAVE_ACCESS_TOKEN);
};

export const getAuthToken = () => _token;

export const clearAuthToken = () => setAuthToken(null);

api.interceptors.request.use((cfg) => {
  if (_token) cfg.headers.Authorization = `Bearer ${_token}`;
  return cfg;
});

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error?.response?.status === 401) {
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
