// src/services/apiIne.js
import axios from "axios";

const baseURL = import.meta.env.DEV
  ? "/ine" // -> 8060 por proxy
  : (import.meta.env.VITE_SESION_API || "https://libersalus.com/api/sesion");

const apiIne = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: false,
});

export default apiIne;
