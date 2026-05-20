import api from "./apiClient";

const RUTAS_DASHBOARD = {
  pacienteHome: "sesion/auth/paciente/home",
  medicoHome: "sesion/auth/medico/home",
};

const CONFIG_CONSULTA_DASHBOARD = {
  omitirLimpiezaSesion: true,
};

// Localiza el objeto útil cuando el backend envía el home anidado en distintas llaves.
function obtenerObjetoPrincipal(datos) {
  if (!datos || typeof datos !== "object") return {};

  return datos.paciente || datos.usuario || datos.user || datos.data || datos;
}

// Busca el primer campo disponible, incluso si viene dentro de objetos anidados.
function buscarPrimerValor(objeto, llaves) {
  if (!objeto || typeof objeto !== "object") return undefined;

  for (const llave of llaves) {
    const valor = objeto[llave];
    if (valor !== undefined && valor !== null && valor !== "") return valor;
  }

  for (const valor of Object.values(objeto)) {
    if (!valor || typeof valor !== "object" || Array.isArray(valor)) continue;

    const valorAnidado = buscarPrimerValor(valor, llaves);
    if (valorAnidado !== undefined && valorAnidado !== null && valorAnidado !== "") {
      return valorAnidado;
    }
  }

  return undefined;
}

// Arma un nombre completo a partir de los campos más comunes del backend.
function unirNombre(datos) {
  const nombreCompleto = buscarPrimerValor(datos, ["nombre_completo", "full_name", "name"]);
  if (nombreCompleto) return String(nombreCompleto).trim();

  const nombre = buscarPrimerValor(datos, ["nombre", "first_name"]);
  const apellidoPaterno = buscarPrimerValor(datos, ["apellido_paterno", "last_name"]);
  const apellidoMaterno = buscarPrimerValor(datos, ["apellido_materno"]);

  return [nombre, apellidoPaterno, apellidoMaterno].filter(Boolean).join(" ").trim();
}

// Convierte la respuesta del home de paciente a una forma estable para Inicio.jsx.
function normalizarHomePaciente(datos) {
  const principal = obtenerObjetoPrincipal(datos);
  const nombre = unirNombre(principal);

  return {
    raw: datos,
    perfil: {
      nombre,
      sexo: buscarPrimerValor(principal, ["sexo", "genero", "gender"]),
      correo: buscarPrimerValor(principal, ["correo", "email", "username"]),
      telefono: buscarPrimerValor(principal, ["telefono", "phone"]),
    },
    resumenSalud: {
      edad: buscarPrimerValor(principal, ["edad", "age"]),
      peso: buscarPrimerValor(principal, ["peso", "weight"]),
      sangre: buscarPrimerValor(principal, ["tipo_sangre", "sangre", "blood_type"]),
      estatura: buscarPrimerValor(principal, ["estatura", "altura", "height"]),
    },
    mensaje:
      buscarPrimerValor(principal, ["mensaje", "frase", "recomendacion", "summary"]) ||
      "",
  };
}

// Consulta el home del paciente y devuelve datos listos para pintar en el dashboard.
export async function obtenerHomePaciente() {
  const { data } = await api.get(
    RUTAS_DASHBOARD.pacienteHome,
    CONFIG_CONSULTA_DASHBOARD
  );

  return normalizarHomePaciente(data);
}

// Consulta el home del médico; queda preparado para cuando integremos esa vista.
export async function obtenerHomeMedico() {
  const { data } = await api.get(
    RUTAS_DASHBOARD.medicoHome,
    CONFIG_CONSULTA_DASHBOARD
  );

  return data;
}
