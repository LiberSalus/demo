import { API_KEYS } from '../../../servicios/apiConfig'
import { crearApiClient } from '../../../servicios/apiClient'
import { API_ROUTES } from '../../../servicios/apiRoutes'

const preregistroApi = crearApiClient(API_KEYS.preregistro)
const sesionApi = crearApiClient(API_KEYS.sesion)
const rutasPreregistro = API_ROUTES.preregistro
const rutasSesion = API_ROUTES.sesion

export function enviarCodigoCorreo({ identificador }) {
  return preregistroApi(rutasPreregistro.enviarCodigoCorreo, {
    method: 'POST',
    body: { identificador },
  })
}

export function validarCodigoCorreo({ identificador, codigo }) {
  return preregistroApi(rutasPreregistro.validarCodigoCorreo, {
    method: 'POST',
    body: { identificador, codigo },
  })
}

export function reenviarCodigo({ identificador }) {
  return preregistroApi(rutasPreregistro.reenviarCodigo, {
    method: 'POST',
    body: { identificador },
  })
}

export function registrarUsuario({
  correo,
  codeTelefono,
  contrasena,
  rol,
  telefono,
}) {
  return preregistroApi(rutasPreregistro.registrarUsuario, {
    method: 'POST',
    body: {
      rol,
      correo,
      telefono,
      code_telefono: codeTelefono,
      contrasena,
    },
  })
}

export function extraerCurp(curp) {
  return sesionApi(rutasSesion.extraerCurp(curp))
}

export function guardarCurp(datosCurp) {
  return sesionApi(rutasSesion.guardarCurp, {
    method: 'POST',
    body: datosCurp,
  })
}

export function guardarDireccion(datosDireccion) {
  return sesionApi(rutasSesion.guardarDireccion, {
    method: 'POST',
    body: datosDireccion,
  })
}

export function subirInePdf(archivo) {
  const formData = new FormData()
  formData.append('file', archivo)

  return sesionApi(rutasSesion.subirInePdf, {
    method: 'POST',
    body: formData,
  })
}

export function subirIneImagenes(archivos) {
  const formData = new FormData()

  archivos.forEach((archivo) => {
    formData.append('files', archivo)
  })

  return sesionApi(rutasSesion.subirIneImagenes, {
    method: 'POST',
    body: formData,
  })
}

export function subirComprobante(archivo) {
  const formData = new FormData()
  formData.append('file', archivo)

  return sesionApi(rutasSesion.subirComprobante, {
    method: 'POST',
    body: formData,
  })
}
