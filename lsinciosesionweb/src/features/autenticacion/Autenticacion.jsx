import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { iniciarSesion } from '@/services/auth'
import {
  enviarCodigoCorreo,
  reenviarCodigo,
  registrarUsuario,
  validarCodigoCorreo,
} from '@/services/preregistro'
import ContenedorAutenticacion from './componentes/ContenedorAutenticacion'
import { configuracionInicioSesion } from './configuracion/flujoAutenticacion'
import { panelesLaterales } from './configuracion/panelesLaterales'
import { pasosRegistro, secuenciaPasoRegistro } from './configuracion/pasosRegistro'
import { obtenerConfiguracionPaso } from './utilidades/obtenerConfiguracionPaso'
import VistaInicioSesion from './vistas/VistaInicioSesion'
import VistaRegistro from './vistas/VistaRegistro'

const datosInicioSesionIniciales = {
  correoElectronico: '',
  contrasena: '',
}

const estadoInicialPreregistro = {
  correo: '',
  telefono: '',
  codeTelefono: '+52',
  contrasena: '',
  confirmarContrasena: '',
}

function validarInicioSesion({ correoElectronico, contrasena }) {
  const correo = correoElectronico.trim()

  if (!correo) return 'El correo es obligatorio.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return 'Formato de correo invalido.'
  if (!contrasena) return 'La contraseña es obligatoria.'

  return ''
}

function Autenticacion() {
  const navigate = useNavigate()
  const location = useLocation()
  const rutaDestino = location.state?.from?.pathname || ROUTES.INICIO

  const [vistaActual, setVistaActual] = useState('inicioSesion')
  const [pasoRegistroActual, setPasoRegistroActual] = useState('registroCuenta')
  const [datosInicioSesion, setDatosInicioSesion] = useState(datosInicioSesionIniciales)
  const [estadoInicioSesion, setEstadoInicioSesion] = useState({
    cargando: false,
    error: '',
  })
  const [datosPreregistro, setDatosPreregistro] = useState(estadoInicialPreregistro)
  const [estadoPreregistro, setEstadoPreregistro] = useState({
    cargando: false,
    error: '',
    exito: '',
  })

  const configuracionPasoRegistro = obtenerConfiguracionPaso(pasosRegistro, pasoRegistroActual)
  const panelLateralRegistro = panelesLaterales[configuracionPasoRegistro.clavePanel]

  const actualizarDatosInicioSesion = (evento) => {
    const { name, value } = evento.target

    setDatosInicioSesion((estadoActual) => ({
      ...estadoActual,
      [name]: value,
    }))
    setEstadoInicioSesion((estadoActual) => ({
      ...estadoActual,
      error: '',
    }))
  }

  const enviarInicioSesion = async (evento) => {
    evento.preventDefault()

    const errorValidacion = validarInicioSesion(datosInicioSesion)

    if (errorValidacion) {
      setEstadoInicioSesion({ cargando: false, error: errorValidacion })
      return
    }

    setEstadoInicioSesion({ cargando: true, error: '' })

    try {
      await iniciarSesion({
        correo: datosInicioSesion.correoElectronico,
        contrasena: datosInicioSesion.contrasena,
      })

      navigate(rutaDestino, { replace: true })
    } catch (error) {
      setEstadoInicioSesion({
        cargando: false,
        error: error.message || 'No fue posible iniciar sesión. Inténtalo de nuevo.',
      })
    }
  }

  const cambiarARegistro = () => {
    setVistaActual('registro')
    setPasoRegistroActual('registroCuenta')
    setDatosPreregistro(estadoInicialPreregistro)
    setEstadoPreregistro({ cargando: false, error: '', exito: '' })
  }

  const cambiarAInicioSesion = () => {
    setVistaActual('inicioSesion')
    setEstadoInicioSesion({ cargando: false, error: '' })
  }

  const actualizarDatosPreregistro = (parcial) => {
    setDatosPreregistro((estadoActual) => ({
      ...estadoActual,
      ...parcial,
    }))
  }

  const limpiarMensajesPreregistro = () => {
    setEstadoPreregistro((estadoActual) => ({
      ...estadoActual,
      error: '',
      exito: '',
    }))
  }

  const establecerErrorPreregistro = (mensaje) => {
    setEstadoPreregistro((estadoActual) => ({
      ...estadoActual,
      cargando: false,
      error: mensaje,
      exito: '',
    }))
  }

  const avanzarPasoRegistro = () => {
    limpiarMensajesPreregistro()
    const indiceActual = secuenciaPasoRegistro.indexOf(pasoRegistroActual)
    const siguientePaso = secuenciaPasoRegistro[indiceActual + 1]

    if (siguientePaso) {
      setPasoRegistroActual(siguientePaso)
    }
  }

  const enviarCodigoPorCorreo = async () => {
    setEstadoPreregistro({ cargando: true, error: '', exito: '' })

    try {
      await enviarCodigoCorreo({ identificador: datosPreregistro.correo })
      setEstadoPreregistro({
        cargando: false,
        error: '',
        exito: 'Enviamos el código de verificación a tu correo.',
      })
      avanzarPasoRegistro()
    } catch (error) {
      establecerErrorPreregistro(error.message)
    }
  }

  const confirmarCodigoYRegistrar = async (codigo) => {
    setEstadoPreregistro({ cargando: true, error: '', exito: '' })

    try {
      await validarCodigoCorreo({
        identificador: datosPreregistro.correo,
        codigo,
      })
      await registrarUsuario({
        rol: 1,
        correo: datosPreregistro.correo,
        telefono: datosPreregistro.telefono,
        codeTelefono: datosPreregistro.codeTelefono,
        contrasena: datosPreregistro.contrasena,
      })
      setEstadoPreregistro({
        cargando: false,
        error: '',
        exito: 'Tu correo quedó validado y la cuenta fue registrada.',
      })
      avanzarPasoRegistro()
    } catch (error) {
      establecerErrorPreregistro(error.message)
    }
  }

  const reenviarCodigoCorreo = async () => {
    setEstadoPreregistro({ cargando: true, error: '', exito: '' })

    try {
      await reenviarCodigo({ identificador: datosPreregistro.correo })
      setEstadoPreregistro({
        cargando: false,
        error: '',
        exito: 'Reenviamos un nuevo código a tu correo.',
      })
    } catch (error) {
      establecerErrorPreregistro(error.message)
    }
  }

  const preregistro = {
    datos: datosPreregistro,
    estado: estadoPreregistro,
    actualizarDatos: actualizarDatosPreregistro,
    limpiarMensajes: limpiarMensajesPreregistro,
    establecerError: establecerErrorPreregistro,
    enviarCodigoPorCorreo,
    confirmarCodigoYRegistrar,
    reenviarCodigoCorreo,
  }

  return (
    <ContenedorAutenticacion
      mostrarPanelLateral={
        vistaActual === 'registro' && configuracionPasoRegistro.mostrarPanelLateral
      }
      panelLateral={panelLateralRegistro}
    >
      {vistaActual === 'inicioSesion' ? (
        <VistaInicioSesion
          configuracion={configuracionInicioSesion}
          datosInicioSesion={datosInicioSesion}
          estadoInicioSesion={estadoInicioSesion}
          onCambiarARegistro={cambiarARegistro}
          onEnviarInicioSesion={enviarInicioSesion}
          onInputInicioSesionChange={actualizarDatosInicioSesion}
        />
      ) : (
        <VistaRegistro
          configuracionPaso={configuracionPasoRegistro}
          preregistro={preregistro}
          onAvanzar={avanzarPasoRegistro}
          onCambiarAInicioSesion={cambiarAInicioSesion}
        />
      )}
    </ContenedorAutenticacion>
  )
}

export default Autenticacion
