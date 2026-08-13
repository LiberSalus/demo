import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { iniciarSesion } from '@/services/auth'
import {
  DEMO_ACTIVO,
  DEMO_CREDENCIALES,
} from '@/config/demo.config'
import {
  enviarCodigoCorreo,
  buscarPreregistroPorCorreo,
  guardarCurp,
  guardarDireccion,
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
import VistaSeleccionDemo from './vistas/VistaSeleccionDemo'
import VistaDemoLogin from './vistas/VistaDemoLogin'
import ModalDemoHub from './vistas/ModalDemoHub'

const datosInicioSesionIniciales = {
  correoElectronico: '',
  contrasena: '',
}

const estadoInicialPreregistro = {
  idPreregistro: null,
  correo: '',
  telefono: '',
  codeTelefono: '+52',
  contrasena: '',
  confirmarContrasena: '',
  datosPersonales: {
    curp: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    sexo: '',
    nacionalidad: 'MEX',
    estadoNacimiento: '',
    abrEntidad: '',
  },
  domicilio: {
    codigoPostal: '',
    estado: '',
    municipio: '',
    ciudad: '',
    colonia: '',
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    referencia: '',
  },
}

function validarInicioSesion({ correoElectronico, contrasena }) {
  const correo = correoElectronico.trim()

  if (!correo) return 'El correo es obligatorio.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return 'Formato de correo invalido.'
  if (!contrasena) return 'La contraseña es obligatoria.'

  return ''
}

function buscarIdEnRespuesta(valor) {
  if (!valor || typeof valor !== 'object') return null

  // El backend puede envolver el identificador en distintas llaves segun el endpoint.
  const posiblesLlaves = ['id', 'id_user', 'idUser', 'id_preregistro', 'idPreregistro']

  for (const llave of posiblesLlaves) {
    const id = Number(valor[llave])
    if (id > 0) return id
  }

  for (const item of Object.values(valor)) {
    const id = buscarIdEnRespuesta(item)
    if (id) return id
  }

  return null
}

function convertirFechaIsoADiaMesAnio(fecha) {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(fecha || '').trim())

  if (!coincidencia) return fecha

  const [, anio, mes, dia] = coincidencia

  return `${dia}/${mes}/${anio}`
}

function Autenticacion() {
  const navigate = useNavigate()
  const location = useLocation()
  const rutaDestino = location.state?.from?.pathname || ROUTES.INICIO

  const [vistaActual, setVistaActual] = useState('inicioSesion')
  const [demoHubAbierto, setDemoHubAbierto] = useState(false)
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
    setDemoHubAbierto(false)
    setVistaActual('registro')
    setPasoRegistroActual('registroCuenta')
    setDatosPreregistro(estadoInicialPreregistro)
    setEstadoPreregistro({ cargando: false, error: '', exito: '' })
  }

  // Abre el modal del hub del modo demo (perfil de prueba / iniciar sesion / crear cuenta).
  const abrirDemoHub = () => {
    setDemoHubAbierto(true)
    setEstadoInicioSesion({ cargando: false, error: '' })
  }

  const cerrarDemoHub = () => {
    setDemoHubAbierto(false)
  }

  const irADemoLogin = () => {
    setDemoHubAbierto(false)
    setVistaActual('demoLogin')
    setEstadoInicioSesion({ cargando: false, error: '' })
  }

  // Abre la pantalla en la que el usuario elige con que persona entrar a la demo.
  const abrirSeleccionDemo = () => {
    setDemoHubAbierto(false)
    setVistaActual('seleccionDemo')
    setEstadoInicioSesion({ cargando: false, error: '' })
  }

  // Entra al panel con la persona demo elegida por el usuario.
  const entrarEnModoDemo = async (clavePersona) => {
    setEstadoInicioSesion({ cargando: true, error: '' })

    try {
      await iniciarSesion({
        correo: DEMO_CREDENCIALES.correo,
        contrasena: DEMO_CREDENCIALES.contrasena,
        persona: clavePersona,
      })

      navigate(rutaDestino, { replace: true })
    } catch (error) {
      setEstadoInicioSesion({
        cargando: false,
        error: error.message || 'No fue posible entrar en modo demo.',
      })
    }
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

  const actualizarDatosPersonales = (parcial) => {
    setDatosPreregistro((estadoActual) => ({
      ...estadoActual,
      datosPersonales: {
        ...estadoActual.datosPersonales,
        ...parcial,
      },
    }))
  }

  const actualizarDomicilio = (parcial) => {
    setDatosPreregistro((estadoActual) => ({
      ...estadoActual,
      domicilio: {
        ...estadoActual.domicilio,
        ...parcial,
      },
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

  const irAPasoRegistro = (paso) => {
    if (pasosRegistro[paso]) {
      limpiarMensajesPreregistro()
      setPasoRegistroActual(paso)
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
      const respuestaRegistro = await registrarUsuario({
        rol: 1,
        correo: datosPreregistro.correo,
        telefono: datosPreregistro.telefono,
        codeTelefono: datosPreregistro.codeTelefono,
        contrasena: datosPreregistro.contrasena,
      })
      const idPreregistro = buscarIdEnRespuesta(respuestaRegistro)

      if (idPreregistro) {
        actualizarDatosPreregistro({ idPreregistro })
      }

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

  const obtenerIdPreregistro = async () => {
    if (Number(datosPreregistro.idPreregistro) > 0) {
      return Number(datosPreregistro.idPreregistro)
    }

    // Si registro no regresa id, se consulta por correo antes de guardar CURP/domicilio.
    const respuesta = await buscarPreregistroPorCorreo(datosPreregistro.correo)
    const idPreregistro = buscarIdEnRespuesta(respuesta)

    if (!idPreregistro) {
      throw new Error('No pudimos obtener el identificador del preregistro.')
    }

    actualizarDatosPreregistro({ idPreregistro })

    return idPreregistro
  }

  const guardarDatosPersonales = async () => {
    const datos = datosPreregistro.datosPersonales
    const camposRequeridos = [
      datos.curp,
      datos.nombre,
      datos.apellidoPaterno,
      datos.apellidoMaterno,
      datos.fechaNacimiento,
      datos.sexo,
      datos.nacionalidad,
      datos.estadoNacimiento,
      datos.abrEntidad,
    ]

    if (camposRequeridos.some((valor) => !String(valor || '').trim())) {
      establecerErrorPreregistro('Completa todos los datos personales para continuar.')
      return
    }

    setEstadoPreregistro({ cargando: true, error: '', exito: '' })

    try {
      const id = await obtenerIdPreregistro()

      await guardarCurp({
        id,
        curp: datos.curp.trim().toUpperCase(),
        first_name: datos.nombre.trim(),
        last_name: datos.apellidoPaterno.trim(),
        second_last_name: datos.apellidoMaterno.trim(),
        sex_curp: datos.sexo,
        birthdate: convertirFechaIsoADiaMesAnio(datos.fechaNacimiento),
        nacionalidad: datos.nacionalidad.trim().toUpperCase(),
        state: datos.estadoNacimiento.trim(),
        abr_entidad: datos.abrEntidad.trim().toUpperCase(),
      })

      setEstadoPreregistro({
        cargando: false,
        error: '',
        exito: 'Guardamos tus datos personales.',
      })
      avanzarPasoRegistro()
    } catch (error) {
      establecerErrorPreregistro(error.message)
    }
  }

  const guardarDomicilioPreregistro = async () => {
    const datos = datosPreregistro.domicilio
    const camposRequeridos = [
      datos.codigoPostal,
      datos.estado,
      datos.municipio,
      datos.ciudad,
      datos.colonia,
      datos.calle,
    ]

    if (camposRequeridos.some((valor) => !String(valor || '').trim())) {
      establecerErrorPreregistro('Completa los datos obligatorios del domicilio.')
      return
    }

    setEstadoPreregistro({ cargando: true, error: '', exito: '' })

    try {
      const id = await obtenerIdPreregistro()

      await guardarDireccion({
        id,
        calle: datos.calle.trim(),
        numero_int: datos.numeroInterior.trim() || null,
        numero_ext: datos.numeroExterior.trim() || null,
        codigo_postal: datos.codigoPostal.trim(),
        delegacion: datos.municipio.trim(),
        colonia: datos.colonia.trim(),
        estado: datos.estado.trim(),
        ciudad: datos.ciudad.trim(),
        referencia: datos.referencia.trim() || null,
      })

      setEstadoPreregistro({
        cargando: false,
        error: '',
        exito: 'Guardamos tu domicilio.',
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
    actualizarDatosPersonales,
    actualizarDomicilio,
    limpiarMensajes: limpiarMensajesPreregistro,
    establecerError: establecerErrorPreregistro,
    enviarCodigoPorCorreo,
    confirmarCodigoYRegistrar,
    reenviarCodigoCorreo,
    guardarDatosPersonales,
    guardarDomicilio: guardarDomicilioPreregistro,
  }

  return (
    <>
      <ContenedorAutenticacion
      mostrarPanelLateral={
        vistaActual === 'registro' && configuracionPasoRegistro.mostrarPanelLateral
      }
      panelLateral={panelLateralRegistro}
      demoActivo={DEMO_ACTIVO}
      demoCargando={estadoInicioSesion.cargando}
      onEntrarDemo={abrirDemoHub}
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
      ) : vistaActual === 'demoLogin' ? (
        <VistaDemoLogin
          datosInicioSesion={datosInicioSesion}
          estadoInicioSesion={estadoInicioSesion}
          onEnviarInicioSesion={enviarInicioSesion}
          onInputInicioSesionChange={actualizarDatosInicioSesion}
          onPerfilPrueba={abrirSeleccionDemo}
          onCrearCuenta={cambiarARegistro}
          onVolver={cambiarAInicioSesion}
        />
      ) : vistaActual === 'seleccionDemo' ? (
        <VistaSeleccionDemo
          estadoDemo={estadoInicioSesion}
          onEntrarDemo={entrarEnModoDemo}
          onVolver={cambiarAInicioSesion}
        />
      ) : (
        <VistaRegistro
          configuracionPaso={configuracionPasoRegistro}
          preregistro={preregistro}
          onAvanzar={avanzarPasoRegistro}
          onIrAPaso={irAPasoRegistro}
          onCambiarAInicioSesion={cambiarAInicioSesion}
        />
      )}
    </ContenedorAutenticacion>

    {demoHubAbierto ? (
      <ModalDemoHub
        onPerfilPrueba={abrirSeleccionDemo}
        onIniciarSesion={irADemoLogin}
        onCrearCuenta={cambiarARegistro}
        onCerrar={cerrarDemoHub}
      />
      ) : null}
    </>
  )
}

export default Autenticacion
