// src/services/api.js
import axios from "axios";

const baseURL = import.meta.env.DEV
  ? "/api" // -> 8040 por proxy
  : (import.meta.env.VITE_PREREG_API || "https://libersalus.com/api/preregistro");

const api = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: false,
});

export default api;
