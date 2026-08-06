// src/utils/profile.js

// Deriva un perfil a partir de la edad cuando la sesion no lo trae explicito.
function derivarPerfilPorEdad(edad) {
  if (edad === undefined || edad === null || edad === "") return null;

  const n = Number(edad);
  if (Number.isNaN(n)) return null;
  if (n < 18) return "menor_tutor";
  if (n > 60) return "mayor_asistido";
  return "adulto_activo";
}

// Lee el perfil actual con varios respaldos para no depender de una sola
// fuente: primero el perfil explicito de sesion, luego el de perfil_min
// (modo demo), y como ultimo recurso se deriva de la edad.
export function getCurrentProfile() {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (u.profile) return u.profile;
  } catch { /* sigue al respaldo */ }

  try {
    const p = JSON.parse(localStorage.getItem("perfil_min") || "{}");
    if (p.profile) return p.profile;

    const derivado = derivarPerfilPorEdad(p.edad);
    if (derivado) return derivado;
  } catch { /* sigue al default */ }

  return "adulto_activo"; // default temporal mientras el backend no envie perfil
}
