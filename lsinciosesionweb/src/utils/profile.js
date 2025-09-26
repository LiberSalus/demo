// src/utils/profile.js
export function getCurrentProfile() {
  // Espera algo como: localStorage.user = { name, profile: "adulto_activo" }
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    return u.profile || "adulto_activo"; // default temporal
  } catch { return "adulto_activo"; }
}
