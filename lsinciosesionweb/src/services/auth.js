// src/services/auth.js
//import api from "./apiClient";
//
//export async function login({ username, password, role = "paciente" }) {
//  const body = new URLSearchParams();
//  body.set("grant_type", "password");
//  body.set("username", username);
//  body.set("password", password);
//  body.set("role", role);
//
//  const { data } = await api.post("sesion/auth/token", body, {
//    headers: { "Content-Type": "application/x-www-form-urlencoded" },
//  });
//  // si el backend te devuelve access_token en body:
//  if (data?.access_token) {
//    // guardas en memoria/localStorage para el bearer
//     setAuthToken(data.access_token) 
//  }
//  return data;
//}
//
//export const decodeToken   = () => api.get("/auth/decode-token").then(r=>r.data);
//export const refreshToken  = () => api.post("/auth/refresh-token").then(r=>r.data);
//export const logout        = () => api.post("/auth/logout").then(r=>r.data);
//

// src/services/auth.js
import api, { setAuthToken } from "./apiClient"; // 👈 asegúrate de importar setAuthToken

const USE_MOCK = import.meta.env.VITE_MOCK_AUTH === "1";

// JWT falso (sin firma) compatible con tu flujo actual
function makeFakeToken({ username, role }) {
  const header  = { alg: "none", typ: "JWT" };
  const nowSec  = Math.floor(Date.now() / 1000);
  const payload = {
    sub: "u-dev",
    name: username || "Usuario Dev",
    role: role || "paciente",
    iat: nowSec,
    exp: nowSec + 60 * 60 * 24, // 24h
  };
  const b64 = (o) => btoa(JSON.stringify(o));
  return `${b64(header)}.${b64(payload)}.`; // firma vacía
}

export async function login({ username, password, role = "paciente" }) {
  // 👇 Mock ultra-simple si el back no está
  if (USE_MOCK) {
    if (!username || !password) throw new Error("Credenciales requeridas");
    const access_token = makeFakeToken({ username, role });
    setAuthToken(access_token); // lo guarda y queda disponible al interceptor
    // Devuelve la forma que tu Login.jsx ya espera (incluye user.*)
    return {
      access_token,
      token_type: "bearer",
      user: {
        first_name: "Dev",
        last_name:  "User",
        email: username,
        // avatar: null,
      },
    };
  }

  // ⇣ Real (cuando el back regrese)
  const body = new URLSearchParams();
  body.set("grant_type", "password");
  body.set("username", username);
  body.set("password", password);
  body.set("role", role);

  const { data } = await api.post("sesion/auth/token", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (data?.access_token) setAuthToken(data.access_token);
  return data;
}

export const decodeToken  = () => api.get("/auth/decode-token").then(r => r.data);
export const refreshToken = () => api.post("/auth/refresh-token").then(r => r.data);
export const logout       = () => api.post("/auth/logout").then(r => r.data);
