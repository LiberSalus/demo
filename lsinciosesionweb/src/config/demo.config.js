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
// visual (avatar y mancha) que el inicio usa para personalizar la interfaz y
// el perfil de salud (perfil + edad) que alimenta el gating de cuestionarios.
export const PERSONAS_DEMO = [
  {
    clave: "mujer",
    nombre: "María Demo",
    first_name: "María",
    last_name: "Fernández",
    sexo: "mujer",
    genero: "Mujer",
    perfil: "adulto_activo",
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
    perfil: "adulto_activo",
    edad: "50",
    peso: "90",
    sangre: "A+",
    estatura: "177",
    curp: "PEJJ760514HDFRNC09",
    descripcion: "Adulto activo interesado en mantener su salud física y moverse más.",
  },
  {
    clave: "mayor",
    nombre: "Rosa Demo",
    first_name: "Rosa",
    last_name: "López",
    sexo: "mujer",
    genero: "Mujer",
    perfil: "mayor_asistido",
    edad: "68",
    peso: "58",
    sangre: "B+",
    estatura: "155",
    curp: "LOCR580412MMCPRS07",
    descripcion: "Persona mayor que valora su salud y busca cuidados preventivos.",
  },
  {
    clave: "menor",
    nombre: "Sofía Demo",
    first_name: "Sofía",
    last_name: "García",
    sexo: "mujer",
    genero: "Niña",
    perfil: "menor_tutor",
    edad: "10",
    peso: "35",
    sangre: "A-",
    estatura: "138",
    curp: "GAGS160124MQTRRF05",
    descripcion: "Niña acompañada por su tutor para explorar la plataforma.",
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

// Fija una persona construida en runtime (p. ej. derivada de una cuenta local).
export function establecerPersonaDemoObjeto(persona) {
  if (persona && persona.nombre) personaDemoActual = persona;
}

// Token simplificado (sin firma) que permite mantener coherentes los guards.
export const DEMO_TOKEN = btoa(JSON.stringify({ alg: "none", typ: "JWT" })) +
  "." +
  btoa(JSON.stringify({ sub: "demo", demotivo: "demo" })) +
  ".";

// Datos del perfil del usuario demo activo que alimentan header e Inicio.
// Es una funcion (no una constante) porque la persona activa puede cambiar en
// runtime: persona de catalogo o cuenta registrada localmente.
export function obtenerPerfilDemo() {
  const persona = obtenerPersonaDemo();

  return {
    nombre: persona.nombre,
    nombre_completo: persona.nombre,
    first_name: persona.first_name,
    last_name: persona.last_name,
    email: DEMO_CREDENCIALES.correo,
    correo: DEMO_CREDENCIALES.correo,
    telefono: "5551234567",
    rol: "paciente",
    perfil: persona.perfil || "adulto_activo",
    sexo: persona.sexo,
    edad: persona.edad || "50",
    peso: persona.peso || "90",
    sangre: persona.sangre || "A+",
    estatura: persona.estatura || "177",
  };
}

// Claims de sesion esperados por useSesionActiva (obtenerClaims).
export function construirClaimsDemo() {
  const persona = obtenerPersonaDemo();
  const ahoraSegundos = Math.floor(Date.now() / 1000);

  return {
    sub: "demo-user",
    name: persona.nombre,
    role: obtenerPerfilDemo().rol,
    refresh_threshold_minutes: 15,
    iat: ahoraSegundos,
    exp: ahoraSegundos + 60 * 60 * 24,
  };
}

// Respuesta base de inicio de sesion; replica la forma del backend (access_token + user).
// Para una cuenta registrada localmente se pasa su propio correo.
export function construirRespuestaLogin(correoCuenta) {
  const persona = obtenerPersonaDemo();
  const correo = String(correoCuenta || "").trim() || DEMO_CREDENCIALES.correo;

  return {
    access_token: DEMO_TOKEN,
    token_type: "bearer",
    user: {
      first_name: persona.first_name,
      last_name: persona.last_name,
      email: correo,
      username: correo,
      sexo: persona.sexo,
      perfil: persona.perfil || "adulto_activo",
      edad: persona.edad,
    },
  };
}

// Home de paciente; replica la forma normalizada por services/dashboard.js.
export function construirHomeDemo() {
  const persona = obtenerPersonaDemo();
  const esCuentaLocal = persona.origen === "cuenta";
  const perfil = obtenerPerfilDemo();
  const cuentaLocal = cargarCuentaDemo();
  const correo =
    esCuentaLocal && cuentaLocal?.correo ? cuentaLocal.correo : perfil.correo;

  return {
    perfil: {
      nombre: persona.nombre,
      sexo: persona.sexo,
      correo,
      telefono: persona.telefono || perfil.telefono,
    },
    resumenSalud: {
      edad: persona.edad || (esCuentaLocal ? "" : perfil.edad),
      peso: persona.peso || (esCuentaLocal ? "" : perfil.peso),
      sangre: persona.sangre || (esCuentaLocal ? "" : perfil.sangre),
      estatura: persona.estatura || (esCuentaLocal ? "" : perfil.estatura),
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

// ---------- Cuenta registrada localmente (registro demo) ----------
const CLAVE_CUENTA_DEMO = "cuentaDemo";

// Guarda o fusiona datos de la cuenta registrada en modo demo (localStorage).
export function guardarCuentaDemo(parcial = {}) {
  const cuenta = { ...cargarCuentaDemo(), ...parcial };
  localStorage.setItem(CLAVE_CUENTA_DEMO, JSON.stringify(cuenta));
  return cuenta;
}

// Devuelve la cuenta registrada en modo demo (o null si no existe).
export function cargarCuentaDemo() {
  try {
    const cruda = localStorage.getItem(CLAVE_CUENTA_DEMO);
    return cruda ? JSON.parse(cruda) : null;
  } catch {
    return null;
  }
}

// Deriva el perfil de salud por edad (misma regla que src/utils/profile.js).
function derivarPerfilDemo(edad) {
  const n = Number(edad);
  if (!Number.isFinite(n)) return "adulto_activo";
  if (n < 18) return "menor_tutor";
  if (n > 60) return "mayor_asistido";
  return "adulto_activo";
}

// Calcula la edad desde una fecha de nacimiento ("YYYY-MM-DD" o "DD/MM/YYYY").
function calcularEdadDesdeFechaNacimiento(fecha) {
  const texto = String(fecha || "").trim();
  let coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  let dia;
  let mes;
  let anio;

  if (coincidencia) {
    [, anio, mes, dia] = coincidencia;
  } else {
    coincidencia = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
    if (!coincidencia) return "";
    [, dia, mes, anio] = coincidencia;
  }

  const nacimiento = new Date(Number(anio), Number(mes) - 1, Number(dia));
  if (Number.isNaN(nacimiento.getTime())) return "";

  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const cumplioEsteAnio =
    hoy.getMonth() > nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() >= nacimiento.getDate());
  if (!cumplioEsteAnio) edad -= 1;

  return String(edad);
}

// Construye una persona demo derivada desde una cuenta registrada localmente,
// para que la identidad y el gating funcionen igual que con PERSONAS_DEMO.
export function construirPersonaDesdeCuenta(cuenta = {}) {
  const nombre =
    String(cuenta.nombre || "").trim() ||
    `${String(cuenta.first_name || "").trim()} ${String(cuenta.last_name || "").trim()}`.trim() ||
    "Usuario demo";
  const edad =
    calcularEdadDesdeFechaNacimiento(cuenta.fechaNacimiento) ||
    String(cuenta.edad || "");

  return {
    clave: "cuenta_local",
    origen: "cuenta",
    nombre,
    first_name: String(cuenta.first_name || "").trim(),
    last_name: String(cuenta.last_name || "").trim(),
    sexo: String(cuenta.sexo || "").trim(),
    genero:
      cuenta.sexo === "hombre"
        ? "Hombre"
        : cuenta.sexo === "mujer"
          ? "Mujer"
          : "",
    perfil: derivarPerfilDemo(edad),
    edad,
    telefono: String(cuenta.telefono || "").trim(),
    descripcion: "Cuenta registrada en el modo demo.",
  };
}