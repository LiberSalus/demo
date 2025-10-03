// src/services/auth.js
import api from "./apiClient";

export async function login({ username, password, role = "paciente" }) {
  const body = new URLSearchParams();
  body.set("grant_type", "password");
  body.set("username", username);
  body.set("password", password);
  body.set("role", role);

  const { data } = await api.post("/auth/token", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  // si el backend te devuelve access_token en body:
  if (data?.access_token) {
    // guardas en memoria/localStorage para el bearer
    // setAuthToken(data.access_token) si lo usas
  }
  return data;
}

export const decodeToken   = () => api.get("/auth/decode-token").then(r=>r.data);
export const refreshToken  = () => api.post("/auth/refresh-token").then(r=>r.data);
export const logout        = () => api.post("/auth/logout").then(r=>r.data);
