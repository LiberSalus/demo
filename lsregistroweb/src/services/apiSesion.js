// src/services/apiSesion.js
import axios from "axios";

const apiSesion = axios.create({
  baseURL: "/auth",
  withCredentials: true,            // manda cookie access_token
  headers: { Accept: "application/json" },
});

// Opcional: si vence la sesión, redirige a login
apiSesion.interceptors.response.use(
  (r) => r,
  (err) => {
    const s = err?.response?.status;
    if (s === 401 || s === 419) {
      // window.location.href = "/iniciar-sesion";
    }
    return Promise.reject(err);
  }
);

export default apiSesion;
