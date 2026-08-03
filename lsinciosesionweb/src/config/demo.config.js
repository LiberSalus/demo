// src/config/demo.config.js
// Configuracion central del modo demo totalmente offline.
// Cuando VITE_DEMO=true, la app no toca backend: todas las consultas se
// resuelven desde este catalogo y la sesion se mantiene en localStorage.

const _DEMO_ACTIVO = import.meta.env.VITE_DEMO === "true";

// Indica si la app debe operar en modo demo totalmente offline.
export const DEMO_ACTIVO = _DEMO_ACTIVO;

const DEMO_DEFAULT_USER = "demo@libersalus.com";
const DEMO_DEFAULT_PASSWORD = "Demo1234";

// Credenciales que valida el login dem/ las variables de entorno definen sus
// valores; si faltan, se usan estos respaldos para no bloquear el modo.
export const DEMO_CREDENCIALES = {
  correo: import.meta.env.VITE_DEMO_USER?.trim() || DEMO_DEFAULT_USER,
  contrasena: import.meta.env.VITE_DEMO_PASSWORD?.trim() || DEMO_DEFAULT_PASSWORD,
};

// Token simplificado (sin firma) que permite mantener coherentes los guards.
export const DEMO_TOKEN = btoa(JSON.stringify({ alg: "none", typ: "JWT" })) +
  "." +
  btoa(JSON.stringify({ sub: "demo", demotivo: "demo" })) +
  ".";

// Datos del perfil del usuario demo que alimentan header e Inicio.
export const DEMO_PERFIL = {
  nombre: "Demo Libersalus",
  nombre_completo: "Demo Libersalus",
  first_name: "Demo",
  last_name: "Libersalus",
  email: DEMO_CREDENCIALES.correo,
  correo: DEMO_CREDENCIALES.correo,
  telefono: "5551234567",
  rol: "paciente",
  sexo: "mujer",
};

// Claims de sesion esperados por useSesionActiva (obtenerClaims).
export function construirClaimsDemo() {
  const ahoraSegundos = Math.floor(Date.now() / 1000);

  return {
    sub: "demo-user",
    name: DEMO_PERFIL.nombre,
    role: DEMO_PERFIL.rol,
    refresh_threshold_minutes: 15,
    iat: ahoraSegundos,
    exp: ahoraSegundos + 60 * 60 * 24,
  };
}

// Respuesta base de inicio de sesion; replica la forma del backend (access_token + user).
export function construirRespuestaLogin() {
  return {
    access_token: DEMO_TOKEN,
    token_type: "bearer",
    user: {
      first_name: DEMO_PERFIL.first_name,
      last_name: DEMO_PERFIL.last_name,
      email: DEMO_PERFIL.email,
      username: DEMO_PERFIL.email,
    },
  };
}

// Home de paciente; replica la forma normalizada por services/dashboard.js.
export function construirHomeDemo() {
  return {
    perfil: {
      nombre: DEMO_PERFIL.nombre,
      sexo: DEMO_PERFIL.sexo,
      correo: DEMO_PERFIL.email,
      telefono: DEMO_PERFIL.telefono,
    },
    resumenSalud: {
      edad: "50",
      peso: "90",
      sangre: "A+",
      estatura: "177",
    },
    mensaje: "Modo demo: estás viendo la plataforma con datos de ejemplo.",
  };
}

// Noticias de ejemplo; replica la forma que normaliza services/noticias.js.
export const NOTICIAS_DEMO = [
  {
    id: 1,
    titulo: "Hidratate a lo largo del dia",
    autor: "Libersalus",
    fecha: new Date().toISOString(),
    imagenPrincipal: "",
    link: "",
  },
  {
    id: 2,
    titulo: "La importancia de mover el cuerpo",
    autor: "Libersalus",
    fecha: new Date(Date.now() - 86400000).toISOString(),
    imagenPrincipal: "",
    link: "",
  },
];