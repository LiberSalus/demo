// src/config/demo.config.js
// Configuracion central del modo demo totalmente offline.
// Cuando VITE_DEMO=true, la app no toca backend: todas las consultas se
// resuelven desde este catalogo y la sesion se mantiene en localStorage.

const _DEMO_ACTIVO = import.meta.env.VITE_DEMO === "true";

// Indica si la app debe operar en modo demo totalmente offline.
export const DEMO_ACTIVO = _DEMO_ACTIVO;

const DEMO_DEFAULT_USER = "demo@libersalus.com";
const DEMO_DEFAULT_PASSWORD = "Demo1234";
const PERSONA_POR_DEFECTO = "mujer";

// Credenciales que valida el login dem/ las variables de entorno definen sus
// valores; si faltan, se usa este respaldo para no bloquear el modo.
export const DEMO_CREDENCIALES = {
  correo: import.meta.env.VITE_DEMO_USER?.trim() || DEMO_DEFAULT_USER,
  contrasena: import.meta.env.VITE_DEMO_PASSWORD?.trim() || DEMO_DEFAULT_PASSWORD,
};

// Personas disponibles para explorar la demo. Cada una define la variante
// visual (avatar y mancha) que el inicio usa para personalizar la interfaz.
export const PERSONAS_DEMO = [
  {
    clave: "mujer",
    nombre: "María Demo",
    first_name: "María",
    last_name: "Fernández",
    sexo: "mujer",
    genero: "Mujer",
    edad: "34",
    peso: "62",
    sangre: "O+",
    estatura: "163",
    curp: "FEMR900321MDFRXB02",
    descripcion: "Profesional joven que busca cuidar su alimentación y descanso.",
  },
  {
    clave: "hombre",
    nombre: "Juan Demo",
    first_name: "Juan",
    last_name: "Pérez",
    sexo: "hombre",
    genero: "Hombre",
    edad: "50",
    peso: "90",
    sangre: "A+",
    estatura: "177",
    curp: "PEJJ760514HDFRNC09",
    descripcion: "Adulto activo interesado en mantener su salud física y moverse más.",
  },
];

let personaDemoActual =
  PERSONAS_DEMO.find((persona) => persona.clave === PERSONA_POR_DEFECTO) ||
  PERSONAS_DEMO[0];

// Devuelve la persona demo seleccionada para la sesion actual.
export function obtenerPersonaDemo() {
  return personaDemoActual;
}

// Fija la persona demo que usaran las respuestas (login y home) de la sesion.
export function establecerPersonaDemo(clave) {
  const persona = PERSONAS_DEMO.find((item) => item.clave === clave);
  if (persona) personaDemoActual = persona;
}

// Token simplificado (sin firma) que permite mantener coherentes los guards.
export const DEMO_TOKEN = btoa(JSON.stringify({ alg: "none", typ: "JWT" })) +
  "." +
  btoa(JSON.stringify({ sub: "demo", demotivo: "demo" })) +
  ".";

// Datos del perfil del usuario demo activo que alimentan header e Inicio.
export const DEMO_PERFIL = {
  nombre: personaDemoActual.nombre,
  nombre_completo: personaDemoActual.nombre,
  first_name: personaDemoActual.first_name,
  last_name: personaDemoActual.last_name,
  email: DEMO_CREDENCIALES.correo,
  correo: DEMO_CREDENCIALES.correo,
  telefono: "5551234567",
  rol: "paciente",
  sexo: personaDemoActual.sexo,
  edad: personaDemoActual.edad || "50",
  peso: personaDemoActual.peso || "90",
  sangre: personaDemoActual.sangre || "A+",
  estatura: personaDemoActual.estatura || "177",
};

// Claims de sesion esperados por useSesionActiva (obtenerClaims).
export function construirClaimsDemo() {
  const persona = obtenerPersonaDemo();
  const ahoraSegundos = Math.floor(Date.now() / 1000);

  return {
    sub: "demo-user",
    name: persona.nombre,
    role: DEMO_PERFIL.rol,
    refresh_threshold_minutes: 15,
    iat: ahoraSegundos,
    exp: ahoraSegundos + 60 * 60 * 24,
  };
}

// Respuesta base de inicio de sesion; replica la forma del backend (access_token + user).
export function construirRespuestaLogin() {
  const persona = obtenerPersonaDemo();

  return {
    access_token: DEMO_TOKEN,
    token_type: "bearer",
    user: {
      first_name: persona.first_name,
      last_name: persona.last_name,
      email: DEMO_CREDENCIALES.correo,
      username: DEMO_CREDENCIALES.correo,
      sexo: persona.sexo,
    },
  };
}

// Home de paciente; replica la forma normalizada por services/dashboard.js.
export function construirHomeDemo() {
  const persona = obtenerPersonaDemo();

  return {
    perfil: {
      nombre: persona.nombre,
      sexo: persona.sexo,
      correo: DEMO_CREDENCIALES.correo,
      telefono: persona.telefono || DEMO_PERFIL.telefono,
    },
    resumenSalud: {
      edad: persona.edad || DEMO_PERFIL.edad,
      peso: persona.peso || DEMO_PERFIL.peso,
      sangre: persona.sangre || DEMO_PERFIL.sangre,
      estatura: persona.estatura || DEMO_PERFIL.estatura,
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