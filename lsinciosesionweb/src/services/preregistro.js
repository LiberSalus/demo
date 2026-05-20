import api from "./apiClient";

const RUTAS_PREREGISTRO = {
  enviarCodigoTelefono: "preregistro/preregistro/preregistro/enviar-codigo-telefono/",
  validarTelefono: "preregistro/preregistro/preregistro/validar-telefono/",
  enviarCodigoCorreo: "preregistro/preregistro/preregistro/enviar-codigo-correo/",
  validarCorreo: "preregistro/preregistro/preregistro/validar-correo/",
  reenviarCodigo: "preregistro/preregistro/preregistro/reenviar-codigo/",
  registrarUsuario: "preregistro/preregistro/preregistro/registro/",
  guardarCurp: "preregistro/preregistro/preregistro/guardar-curp",
  guardarDireccion: "preregistro/preregistro/guardar-direccion",
  registrarDireccion: "preregistro/preregistro/direccion/registrar",
  buscarPorCorreo: "preregistro/inicio-sesion/buscar-correo/",
  buscarPorTelefono: "preregistro/inicio-sesion/buscar-telefono/",
};

const CONFIG_PREREGISTRO_PUBLICO = {
  withCredentials: false,
};

function obtenerMensajeError(error) {
  const detalle = error?.response?.data?.detail;
  const mensaje = error?.response?.data?.message;

  if (typeof detalle === "string") return detalle;
  if (Array.isArray(detalle) && detalle[0]?.msg) return detalle[0].msg;
  if (typeof mensaje === "string") return mensaje;

  return error?.message || "No fue posible completar la solicitud.";
}

function validarCorreoFormato(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(correo || "").trim());
}

function normalizarTelefono(telefono) {
  return String(telefono || "").replace(/\D/g, "");
}

function validarIdentificador(identificador, mensaje = "El identificador es obligatorio.") {
  if (!String(identificador || "").trim()) {
    throw new Error(mensaje);
  }
}

function validarCodigo(codigo) {
  if (!String(codigo || "").trim()) {
    throw new Error("El código de validación es obligatorio.");
  }
}

async function ejecutarSolicitud(solicitud) {
  try {
    const { data } = await solicitud();
    return data;
  } catch (error) {
    throw new Error(obtenerMensajeError(error));
  }
}

export function enviarCodigoCorreo({ identificador }) {
  if (!validarCorreoFormato(identificador)) {
    throw new Error("Captura un correo electrónico válido.");
  }

  return ejecutarSolicitud(() =>
    api.post(
      RUTAS_PREREGISTRO.enviarCodigoCorreo,
      { identificador: identificador.trim() },
      CONFIG_PREREGISTRO_PUBLICO
    )
  );
}

export function validarCodigoCorreo({ identificador, codigo }) {
  if (!validarCorreoFormato(identificador)) {
    throw new Error("Captura un correo electrónico válido.");
  }
  validarCodigo(codigo);

  return ejecutarSolicitud(() =>
    api.post(
      RUTAS_PREREGISTRO.validarCorreo,
      {
        identificador: identificador.trim(),
        codigo: String(codigo).trim(),
      },
      CONFIG_PREREGISTRO_PUBLICO
    )
  );
}

export function enviarCodigoTelefono({ identificador }) {
  const telefono = normalizarTelefono(identificador);

  if (telefono.length !== 10) {
    throw new Error("Captura un teléfono de 10 dígitos.");
  }

  return ejecutarSolicitud(() =>
    api.post(
      RUTAS_PREREGISTRO.enviarCodigoTelefono,
      { identificador: telefono },
      CONFIG_PREREGISTRO_PUBLICO
    )
  );
}

export function validarCodigoTelefono({ identificador, codigo }) {
  const telefono = normalizarTelefono(identificador);

  if (telefono.length !== 10) {
    throw new Error("Captura un teléfono de 10 dígitos.");
  }
  validarCodigo(codigo);

  return ejecutarSolicitud(() =>
    api.post(
      RUTAS_PREREGISTRO.validarTelefono,
      {
        identificador: telefono,
        codigo: String(codigo).trim(),
      },
      CONFIG_PREREGISTRO_PUBLICO
    )
  );
}

export function reenviarCodigo({ identificador }) {
  validarIdentificador(identificador);

  return ejecutarSolicitud(() =>
    api.post(
      RUTAS_PREREGISTRO.reenviarCodigo,
      { identificador: String(identificador).trim() },
      CONFIG_PREREGISTRO_PUBLICO
    )
  );
}

export function registrarUsuario({ correo, telefono, codeTelefono = "+52", contrasena, rol = 1 }) {
  const telefonoNormalizado = normalizarTelefono(telefono);

  if (!validarCorreoFormato(correo)) {
    throw new Error("Captura un correo electrónico válido.");
  }
  if (telefonoNormalizado.length !== 10) {
    throw new Error("Captura un teléfono de 10 dígitos.");
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d)\S{8,20}$/.test(String(contrasena || ""))) {
    throw new Error("La contraseña debe tener de 8 a 20 caracteres, letras y números.");
  }

  return ejecutarSolicitud(() =>
    api.post(
      RUTAS_PREREGISTRO.registrarUsuario,
      {
        rol,
        correo: correo.trim(),
        telefono: telefonoNormalizado,
        code_telefono: codeTelefono,
        contrasena,
      },
      CONFIG_PREREGISTRO_PUBLICO
    )
  );
}

export function guardarCurp(datosCurp) {
  // El backend exige el id del preregistro para asociar CURP con la cuenta creada.
  if (!Number(datosCurp?.id)) {
    throw new Error("Falta el identificador del preregistro para guardar CURP.");
  }

  return ejecutarSolicitud(() =>
    api.post(RUTAS_PREREGISTRO.guardarCurp, datosCurp, CONFIG_PREREGISTRO_PUBLICO)
  );
}

export function guardarDireccion(datosDireccion) {
  if (!Number(datosDireccion?.id)) {
    throw new Error("Falta el identificador del preregistro para guardar dirección.");
  }

  return ejecutarSolicitud(() =>
    api.post(RUTAS_PREREGISTRO.guardarDireccion, datosDireccion, CONFIG_PREREGISTRO_PUBLICO)
  );
}

export function registrarDireccion({ id, direccion }) {
  if (!Number(id)) {
    throw new Error("Falta el identificador del preregistro para registrar dirección.");
  }

  return ejecutarSolicitud(() =>
    api.post(RUTAS_PREREGISTRO.registrarDireccion, direccion, {
      ...CONFIG_PREREGISTRO_PUBLICO,
      params: { id },
    })
  );
}

export function buscarPreregistroPorCorreo(correo) {
  if (!validarCorreoFormato(correo)) {
    throw new Error("Captura un correo electrónico válido.");
  }

  return ejecutarSolicitud(() =>
    api.get(RUTAS_PREREGISTRO.buscarPorCorreo, {
      ...CONFIG_PREREGISTRO_PUBLICO,
      params: { correo: correo.trim() },
    })
  );
}

export function buscarPreregistroPorTelefono(telefono) {
  const telefonoNormalizado = normalizarTelefono(telefono);

  if (telefonoNormalizado.length !== 10) {
    throw new Error("Captura un teléfono de 10 dígitos.");
  }

  return ejecutarSolicitud(() =>
    api.get(RUTAS_PREREGISTRO.buscarPorTelefono, {
      ...CONFIG_PREREGISTRO_PUBLICO,
      params: { telefono: telefonoNormalizado },
    })
  );
}
