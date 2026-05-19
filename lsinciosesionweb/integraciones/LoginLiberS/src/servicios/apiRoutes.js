export const API_ROUTES = {
  catalogos: {
    consultarCodigoPostal: (codigoPostal) =>
      `/codigos_postales?codigo_postal=${encodeURIComponent(codigoPostal)}`,
  },
  preregistro: {
    enviarCodigoCorreo: '/preregistro/preregistro/enviar-codigo-correo/',
    validarCodigoCorreo: '/preregistro/preregistro/validar-correo/',
    reenviarCodigo: '/preregistro/preregistro/reenviar-codigo/',
    registrarUsuario: '/preregistro/preregistro/registro/',
  },
  sesion: {
    extraerCurp: (curp) => `/preregistro/curp/extraer/${curp}`,
    guardarCurp: '/preregistro/curp/subir',
    guardarDireccion: '/preregistro/direccion/guardar',
    subirIneImagenes: '/preregistro/ine/subir/imagenes',
    subirInePdf: '/preregistro/ine/subir-pdf',
    subirComprobante: '/preregistro/comprobante/subir',
    authToken: '/auth/token',
    authMe: '/auth/me',
    authLogout: '/auth/logout',
    authRefreshToken: '/auth/refresh-token',
    medicionesIniciarSesion: '/autenticacion/mediciones/iniciar-sesion',
    medicionesMiSesion: '/autenticacion/mediciones/mi-sesion',
  },
}
