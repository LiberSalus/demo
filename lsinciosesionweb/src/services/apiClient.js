// src/services/apiClient.js
import axios from "axios";

const baseURL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_SESION_API || "https://libersalus.com/api/sesion");

const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: false, // aquí vienes usando JWT en body, si cambias a cookie => true
});

let _token = localStorage.getItem("access_token") || null;
export const setAuthToken = (t) => {
  _token = t || null;
  if (t) localStorage.setItem("access_token", t);
  else localStorage.removeItem("access_token");
};

api.interceptors.request.use((cfg) => {
  if (_token) cfg.headers.Authorization = `Bearer ${_token}`;
  return cfg;
});

export default api;
