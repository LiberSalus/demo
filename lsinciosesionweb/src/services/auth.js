// src/services/auth.js
import api, { clearAuthToken, getAuthToken, setAuthToken } from "./apiClient";
import { notificar } from "@/shared/utils/notificacionNativa";

const USAR_MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH === "1";
const CLAVE_SESION_LISTA = "auth_ready";
const CLAVE_PERFIL_MINIMO = "perfil_min";
export const EVENTO_SESION_NO_AUTORIZADA = "sesion:no-autorizada";

const RUTAS_AUTH = {
  token: "sesion/auth/token",
  logout: "sesion/auth/logout",
  decodeToken: "sesion/auth/decode-token",
  refreshToken: "sesion/auth/refresh-token",
};

const CONFIG_CONSULTA_PERFIL = {
  omitirLimpiezaSesion: true,
};

// Extrae un mensaje entendible desde las respuestas de error del backend.
function obtenerMensajeError(error) {
  const detalle = error?.response?.data?.detail;
  const mensaje = error?.response?.data?.message;

  if (typeof detalle === "string") return detalle;
  if (typeof mensaje === "string") return mensaje;

  return error?.message || "No fue posible completar la solicitud.";
}

// Limpia formatos comunes para guardar solo el valor real del token.
function normalizarToken(valor) {
  if (typeof valor !== "string") return "";

  return valor
    .trim()
    .replace(/^"|"$/g, "")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

// Ayuda a reconocer tokens dentro de respuestas no estandarizadas del backend.
function pareceToken(valor) {
  const token = normalizarToken(valor);

  return token.length > 20 && !/\s/.test(token);
}

// Busca el token en objetos simples o anidados cuando el backend cambia nombres de campos.
function buscarTokenEnObjeto(valor) {
  if (!valor || typeof valor !== "object") return "";

  // El backend ha devuelto tokens con distintas formas; priorizamos nombres
  // explícitos antes de buscar en objetos anidados.
  const llavesPrioritarias = [
    "access_token",
    "accessToken",
    "token_acceso",
    "tokenAcceso",
    "token_de_acceso",
    "tokenDeAcceso",
    "token",
    "jwt",
    "access",
    "bearer",
    "authorization",
  ];

  for (const llave of llavesPrioritarias) {
    const token = normalizarToken(valor[llave]);
    if (token) return token;
  }

  for (const item of Object.values(valor)) {
    if (pareceToken(item)) return normalizarToken(item);

    const tokenAnidado = buscarTokenEnObjeto(item);
    if (tokenAnidado) return tokenAnidado;
  }

  return "";
}

// Acepta respuestas en texto u objeto y devuelve el token si viene expuesto.
function obtenerTokenDeRespuesta(datos) {
  if (typeof datos === "string" && datos.trim()) {
    const texto = normalizarToken(datos);

    try {
      return obtenerTokenDeRespuesta(JSON.parse(texto));
    } catch {
      return texto;
    }
  }

  return buscarTokenEnObjeto(datos);
}

// Genera una sesion local de desarrollo cuando VITE_MOCK_AUTH esta activo.
function crearTokenFalso({ usuario, rol }) {
  const encabezado = { alg: "none", typ: "JWT" };
  const ahoraSegundos = Math.floor(Date.now() / 1000);
  const payload = {
    sub: "u-dev",
    name: usuario || "Usuario Dev",
    role: rol || "paciente",
    iat: ahoraSegundos,
    exp: ahoraSegundos + 60 * 60 * 24,
  };
  const aBase64 = (objeto) => btoa(JSON.stringify(objeto));

  return `${aBase64(encabezado)}.${aBase64(payload)}.`;
}

// Construye un nombre visible con los campos disponibles del usuario.
function obtenerNombreUsuario(usuario = {}, correo = "") {
  if (usuario.first_name && usuario.last_name) {
    return `${usuario.first_name} ${usuario.last_name}`;
  }

  return (
    usuario.nombre_completo ||
    usuario.nombre ||
    usuario.name ||
    usuario.first_name ||
    usuario.username ||
    usuario.email ||
    usuario.correo ||
    correo ||
    "Usuario"
  );
}

// Aisla el usuario desde distintas formas de respuesta del servicio.
function obtenerUsuarioDeRespuesta(respuesta) {
  if (!respuesta || typeof respuesta !== "object") return {};

  return respuesta.user || respuesta.usuario || respuesta.data || respuesta;
}

// Guarda una version minima del perfil para cabeceras y componentes del dashboard.
function guardarPerfilMinimo({ usuario, correo }) {
  localStorage.setItem(
    CLAVE_PERFIL_MINIMO,
    JSON.stringify({
      nombre: obtenerNombreUsuario(usuario, correo),
      email: usuario.email || usuario.correo || correo || "",
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      nombre_completo: usuario.nombre_completo,
      username: usuario.username,
      telefono: usuario.telefono,
      rol: usuario.rol,
      sexo: usuario.sexo || usuario.genero || usuario.gender,
    })
  );

  // Se emiten ambos eventos mientras unificamos consumidores antiguos y nuevos.
  window.dispatchEvent(new CustomEvent("perfil:update"));
  window.dispatchEvent(new CustomEvent("perfil_min_updated"));
}

// Registra la sesion local; soporta token visible o cookie HttpOnly del backend.
function guardarSesionAutenticada({ respuesta, correo }) {
  const token = obtenerTokenDeRespuesta(respuesta);

  if (token) {
    setAuthToken(token);
  } else {
    // El servicio nuevo de /auth/token devuelve la sesión en cookie HttpOnly.
    // En ese caso no podemos leer el token desde JS, solo marcar la sesión como lista.
    clearAuthToken();
  }

  localStorage.setItem(CLAVE_SESION_LISTA, "1");
  guardarPerfilMinimo({ usuario: obtenerUsuarioDeRespuesta(respuesta), correo });
}

// Indica si el dashboard debe permitir acceso a rutas protegidas.
export function estaAutenticado() {
  const tieneToken = Boolean(getAuthToken());
  const sesionLista = localStorage.getItem(CLAVE_SESION_LISTA) === "1";

  return tieneToken || sesionLista;
}

// Limpia cualquier rastro local de autenticacion usado por el frontend.
export function limpiarSesionAutenticacion() {
  clearAuthToken();
  localStorage.removeItem(CLAVE_SESION_LISTA);
  localStorage.removeItem(CLAVE_PERFIL_MINIMO);
}

// Inicia sesion contra /auth/token y deja preparada la cookie/token para el dashboard.
export async function iniciarSesion({
  username,
  password,
  role = "paciente",
  correo,
  contrasena,
  rol,
}) {
  const correoNormalizado = String(correo || username || "").trim();
  const contrasenaNormalizada = contrasena || password || "";
  const rolNormalizado = rol || role;

  if (USAR_MOCK_AUTH) {
    if (!correoNormalizado || !contrasenaNormalizada) {
      throw new Error("Credenciales requeridas");
    }

    const respuesta = {
      // Mock solo para desarrollo: permite probar rutas protegidas sin backend.
      // Debe permanecer apagado en ambientes reales con VITE_MOCK_AUTH=0.
      access_token: crearTokenFalso({ usuario: correoNormalizado, rol: rolNormalizado }),
      token_type: "bearer",
      user: {
        first_name: "Dev",
        last_name: "User",
        email: correoNormalizado,
      },
    };

    guardarSesionAutenticada({ respuesta, correo: correoNormalizado });

    const perfil = JSON.parse(localStorage.getItem("perfil_min") || "{}");
    notificar(`Bienvenido, ${perfil.nombre || "Usuario"}`, {
      body: "Has iniciado sesión en Libersalus.",
      icon: "/vite.svg",
    });

    return respuesta;
  }

  try {
    const formulario = new URLSearchParams();

    formulario.set("grant_type", "password");
    formulario.set("username", correoNormalizado);
    formulario.set("password", contrasenaNormalizada);
    formulario.set("scope", "");
    formulario.set("client_id", "");
    formulario.set("client_secret", "");

    const { data } = await api.post(RUTAS_AUTH.token, formulario, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    guardarSesionAutenticada({ respuesta: data, correo: correoNormalizado });

    const perfil = JSON.parse(localStorage.getItem("perfil_min") || "{}");
    notificar(`Bienvenido, ${perfil.nombre || "Usuario"}`, {
      body: "Has iniciado sesión en Libersalus.",
      icon: "/vite.svg",
    });

    return data;
  } catch (error) {
    throw new Error(obtenerMensajeError(error));
  }
}

// Consulta la sesion vigente decodificando la cookie/token que mantiene el backend.
export async function obtenerSesionActual() {
  try {
    const data = await decodificarToken();
    guardarPerfilMinimo({ usuario: obtenerUsuarioDeRespuesta(data), correo: "" });

    return data;
  } catch (error) {
    throw new Error(obtenerMensajeError(error));
  }
}

// Sincroniza el perfil del dashboard usando el endpoint oficial de decode-token.
export async function sincronizarPerfilSesion() {
  try {
    return await obtenerSesionActual();
  } catch {
    return null;
  }
}

// Pide al backend interpretar el token/cookie actual para diagnostico o datos de sesion.
export const decodificarToken = () =>
  api.get(RUTAS_AUTH.decodeToken, CONFIG_CONSULTA_PERFIL).then((respuesta) => respuesta.data);

// Solicita al backend renovar la sesion cuando el servicio lo permita.
export const refrescarToken = () =>
  api.post(RUTAS_AUTH.refreshToken).then((respuesta) => {
    const token = obtenerTokenDeRespuesta(respuesta.data);

    if (token) setAuthToken(token);
    localStorage.setItem(CLAVE_SESION_LISTA, "1");

    return respuesta.data;
  });

// Cierra la sesion en backend y siempre limpia la sesion local al terminar.
export async function cerrarSesion() {
  try {
    return await api.post(RUTAS_AUTH.logout).then((respuesta) => respuesta.data);
  } finally {
    // Siempre limpiamos la sesión local aunque el endpoint falle, para no dejar
    // al usuario atrapado en el dashboard.
    limpiarSesionAutenticacion();
  }
}
