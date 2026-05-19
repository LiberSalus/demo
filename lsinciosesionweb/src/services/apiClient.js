// src/services/apiClient.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API || "https://libersalus.com/api/";

const api = axios.create({
  baseURL,
  timeout: 300000,
  withCredentials: false,
});

let _token = localStorage.getItem("access_token") || null;
export const setAuthToken = (t) => {
  _token = t || null;
  if (t) localStorage.setItem("access_token", t);
  else localStorage.removeItem("access_token");
};

export const getAuthToken = () => _token;

export const clearAuthToken = () => setAuthToken(null);

api.interceptors.request.use((cfg) => {
  if (_token) cfg.headers.Authorization = `Bearer ${_token}`;
  return cfg;
});

export default api;
