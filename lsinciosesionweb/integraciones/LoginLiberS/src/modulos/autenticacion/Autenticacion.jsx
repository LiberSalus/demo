import { useEffect, useState } from 'react'
import { consultarCodigoPostal } from '../../servicios/catalogos'
import ContenedorAutenticacion from './componentes/ContenedorAutenticacion'
import VistaInicioSesion from './vistas/VistaInicioSesion'
import VistaRegistro from './vistas/VistaRegistro'
import { configuracionInicioSesion } from './configuracion/flujoAutenticacion'
import { pasosRegistro, secuenciaPasoRegistro } from './configuracion/pasosRegistro'
import { panelesLaterales } from './configuracion/panelesLaterales'
import { obtenerConfiguracionPaso } from './utilidades/obtenerConfiguracionPaso'
import {
  enviarCodigoCorreo,
  guardarDireccion,
  reenviarCodigo,
  registrarUsuario,
  subirComprobante,
  subirInePdf,
  validarCodigoCorreo,
} from './servicios/preregistro'
import {
  iniciarSesion,
  limpiarSesionLocalDesdeLogoutDev,
  obtenerDashboardUrl,
} from './servicios/sesion'

const estadoInicialPreregistro = {
  correo: '',
  telefono: '',
  codeTelefono: '+52',
  contrasena: '',
  confirmarContrasena: '',
  metodoEnvioCodigo: 'correo',
  codigoVerificacion: '',
  codigoEnviado: false,
  correoValidado: false,
  datosPersonales: {
    curp: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    sexo: '',
    nacionalidad: 'MEX',
    entidadNacimiento: '',
    abrEntidad: '',
    municipioRegistro: '',
  },
  domicilio: {
    codigoPostal: '',
    colonia: '',
    estado: '',
    municipio: '',
    ciudad: '',
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    referencia: '',
  },
}

const VALOR_PENDIENTE_CURP = 'PENDIENTE'
const OMITIR_VALIDACION_Y_GUARDADO_CURP = true

function enmascararCorreo(correo) {
  if (!correo.includes('@')) {
    return correo
  }

  const [usuario, dominio] = correo.split('@')
  const usuarioVisible = usuario.slice(-3)
  const mascara = '*'.repeat(Math.max(usuario.length - usuarioVisible.length, 0))

  return `${mascara}${usuarioVisible}@${dominio}`
}

function obtenerRolBackend(tipoPerfil) {
  return tipoPerfil === 'medico' ? 0 : 1
}

function obtenerValorCurpConFallback(valor, fallback = VALOR_PENDIENTE_CURP) {
  const valorNormalizado = String(valor ?? '').trim().toUpperCase()

  return valorNormalizado || fallback
}

function Autenticacion() {
  // Estos estados viven arriba para mantener las vistas y pasos lo más limpios posible.
  const [vistaActual, setVistaActual] = useState('inicioSesion') // 'inicioSesion' | 'registro'
  const [pasoRegistroActual, setPasoRegistroActual] = useState('registroCuenta') // Clave del paso activo dentro de pasosRegistro
  const [tipoPerfil, setTipoPerfil] = useState('paciente')
  const [datosInicioSesion, setDatosInicioSesion] = useState({
    correoElectronico: '',
    contrasena: '',
  })
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
  const [estadoDatosPersonales, setEstadoDatosPersonales] = useState({
    cargando: false,
    error: '',
    exito: '',
  })
  const [estadoDomicilio, setEstadoDomicilio] = useState({
    cargando: false,
    error: '',
    exito: '',
  })

  const configuracionPasoRegistro = obtenerConfiguracionPaso(
    pasosRegistro,
    pasoRegistroActual,
  )

  // El panel lateral se resuelve desde la clave del paso activo para que la vista
  // principal solo reciba el contenido que necesita pintar.
  const panelLateralRegistro = panelesLaterales[configuracionPasoRegistro.clavePanel]

  useEffect(() => {
    limpiarSesionLocalDesdeLogoutDev()
  }, [])

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

  const limpiarMensajesDatosPersonales = () => {
    setEstadoDatosPersonales({
      cargando: false,
      error: '',
      exito: '',
    })
  }

  const limpiarMensajesDomicilio = () => {
    setEstadoDomicilio({
      cargando: false,
      error: '',
      exito: '',
    })
  }

  const establecerErrorPreregistro = (mensaje) => {
    setEstadoPreregistro((estadoActual) => ({
      ...estadoActual,
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

  const retrocederPasoRegistro = () => {
    limpiarMensajesPreregistro()
    limpiarMensajesDatosPersonales()
    limpiarMensajesDomicilio()

    const indiceActual = secuenciaPasoRegistro.indexOf(pasoRegistroActual)
    const pasoAnterior = secuenciaPasoRegistro[indiceActual - 1]

    if (pasoAnterior) {
      setPasoRegistroActual(pasoAnterior)
    }
  }

  const irAPasoRegistro = (paso) => {
    if (pasosRegistro[paso]) {
      setVistaActual('registro')
      setPasoRegistroActual(paso)
    }
  }

  const cambiarAVistaRegistro = () => {
    setVistaActual('registro')
    setPasoRegistroActual('registroCuenta')
    setDatosPreregistro(estadoInicialPreregistro)
    limpiarMensajesPreregistro()
    limpiarMensajesDatosPersonales()
    limpiarMensajesDomicilio()
  }

  const cambiarAVistaInicioSesion = () => {
    setVistaActual('inicioSesion')
  }

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

    const correo = datosInicioSesion.correoElectronico.trim()
    const contrasena = datosInicioSesion.contrasena

    if (!correo) {
      setEstadoInicioSesion({ cargando: false, error: 'El correo es obligatorio.' })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setEstadoInicioSesion({ cargando: false, error: 'Formato de correo inválido.' })
      return
    }

    if (!contrasena) {
      setEstadoInicioSesion({ cargando: false, error: 'La contraseña es obligatoria.' })
      return
    }

    setEstadoInicioSesion({ cargando: true, error: '' })

    try {
      const respuesta = await iniciarSesion({
        correo,
        contrasena,
        rol: tipoPerfil,
      })
      window.location.assign(obtenerDashboardUrl({ respuesta, correo }))
    } catch (error) {
      setEstadoInicioSesion({
        cargando: false,
        error: error.message || 'No fue posible iniciar sesión. Inténtalo de nuevo.',
      })
    }
  }

  const enviarCodigoPorCorreo = async () => {
    setEstadoPreregistro({
      cargando: true,
      error: '',
      exito: '',
    })

    try {
      await enviarCodigoCorreo({ identificador: datosPreregistro.correo })
      setDatosPreregistro((estadoActual) => ({
        ...estadoActual,
        codigoEnviado: true,
        metodoEnvioCodigo: 'correo',
      }))
      setEstadoPreregistro({
        cargando: false,
        error: '',
        exito: 'Enviamos el código de verificación a tu correo.',
      })
      avanzarPasoRegistro()
    } catch (error) {
      setEstadoPreregistro({
        cargando: false,
        error: error.message,
        exito: '',
      })
    }
  }

  const confirmarCodigoYRegistrar = async (codigo) => {
    setEstadoPreregistro({
      cargando: true,
      error: '',
      exito: '',
    })

    try {
      await validarCodigoCorreo({
        identificador: datosPreregistro.correo,
        codigo,
      })

      await registrarUsuario({
        rol: obtenerRolBackend(tipoPerfil),
        correo: datosPreregistro.correo,
        telefono: datosPreregistro.telefono,
        codeTelefono: datosPreregistro.codeTelefono,
        contrasena: datosPreregistro.contrasena,
      })

      setDatosPreregistro((estadoActual) => ({
        ...estadoActual,
        codigoVerificacion: codigo,
        correoValidado: true,
      }))
      setEstadoPreregistro({
        cargando: false,
        error: '',
        exito: 'Tu correo quedó validado y la cuenta fue registrada.',
      })
      avanzarPasoRegistro()
    } catch (error) {
      setEstadoPreregistro({
        cargando: false,
        error: error.message,
        exito: '',
      })
    }
  }

  const reenviarCodigoCorreoRegistro = async () => {
    setEstadoPreregistro({
      cargando: true,
      error: '',
      exito: '',
    })

    try {
      await reenviarCodigo({ identificador: datosPreregistro.correo })
      setEstadoPreregistro({
        cargando: false,
        error: '',
        exito: 'Reenviamos un nuevo código a tu correo.',
      })
    } catch (error) {
      setEstadoPreregistro({
        cargando: false,
        error: error.message,
        exito: '',
      })
    }
  }

  const validarCurpPreregistro = async () => {
    const curp = datosPreregistro.datosPersonales.curp.trim().toUpperCase()

    if (!curp) {
      setEstadoDatosPersonales({
        cargando: false,
        error: 'Captura tu CURP para intentar extraer los datos.',
        exito: '',
      })
      return
    }

    setEstadoDatosPersonales({
      cargando: true,
      error: '',
      exito: '',
    })

    if (OMITIR_VALIDACION_Y_GUARDADO_CURP) {
      actualizarDatosPersonales({ curp })
      setEstadoDatosPersonales({
        cargando: false,
        error: '',
        exito:
          'La validación automática de CURP está pausada por ahora. Puedes capturar tus datos manualmente y continuar.',
      })

      return
    }
  }

  const guardarDatosPersonalesPreregistro = async () => {
    const datos = datosPreregistro.datosPersonales
    const camposRequeridos = [
      datos.curp,
      datos.nombre,
      datos.apellidoPaterno,
      datos.apellidoMaterno,
      datos.fechaNacimiento,
      datos.sexo,
    ]

    if (camposRequeridos.some((valor) => !String(valor ?? '').trim())) {
      setEstadoDatosPersonales({
        cargando: false,
        error: 'Completa todos los datos personales para continuar.',
        exito: '',
      })
      return
    }

    setEstadoDatosPersonales({
      cargando: true,
      error: '',
      exito: '',
    })

    if (OMITIR_VALIDACION_Y_GUARDADO_CURP) {
      setEstadoDatosPersonales({
        cargando: false,
        error: '',
        exito:
          'Guardamos tus datos de forma local para continuar con el domicilio mientras se restablece el servicio de CURP.',
      })
      avanzarPasoRegistro()

      return
    }

    try {
      setEstadoDatosPersonales({
        cargando: false,
        error: '',
        exito: 'Los datos personales se guardaron correctamente.',
      })
      avanzarPasoRegistro()
    } catch (error) {
      setEstadoDatosPersonales({
        cargando: false,
        error: error.message,
        exito: '',
      })
    }
  }

  const guardarDomicilioPreregistro = async () => {
    const datos = datosPreregistro.domicilio
    const camposRequeridos = [
      datos.codigoPostal,
      datos.colonia,
      datos.estado,
      datos.municipio,
      datos.ciudad,
      datos.calle,
    ]

    if (camposRequeridos.some((valor) => !String(valor ?? '').trim())) {
      setEstadoDomicilio({
        cargando: false,
        error: 'Completa los datos obligatorios del domicilio para continuar.',
        exito: '',
      })
      return
    }

    setEstadoDomicilio({
      cargando: true,
      error: '',
      exito: '',
    })

    try {
      await guardarDireccion({
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

      setEstadoDomicilio({
        cargando: false,
        error: '',
        exito: 'El domicilio se guardó correctamente.',
      })
      avanzarPasoRegistro()
    } catch (error) {
      setEstadoDomicilio({
        cargando: false,
        error: error.message,
        exito: '',
      })
    }
  }

  const consultarCodigoPostalDomicilio = async (codigoPostal) => {
    const codigoPostalNormalizado = String(codigoPostal ?? '').trim()

    if (!/^\d{5}$/.test(codigoPostalNormalizado)) {
      setEstadoDomicilio({
        cargando: false,
        error: 'Ingresa un código postal válido de 5 dígitos.',
        exito: '',
      })

      return []
    }

    setEstadoDomicilio({
      cargando: true,
      error: '',
      exito: '',
    })

    try {
      const respuesta = await consultarCodigoPostal(codigoPostalNormalizado)
      const coincidencias = Array.isArray(respuesta) ? respuesta : []

      if (coincidencias.length === 0) {
        setEstadoDomicilio({
          cargando: false,
          error: 'No encontramos resultados para ese código postal.',
          exito: '',
        })

        return []
      }

      const coloniasNormalizadas = coincidencias.map((item, indice) => ({
        id: item.ID_ASENTA_CPcons ?? `${codigoPostalNormalizado}-${indice}`,
        colonia: item.D_ASENTA ?? '',
        estado: item.D_ESTADO ?? '',
        municipio: item.D_MNPIO ?? '',
        ciudad: item.D_CIUDAD ?? item.D_ESTADO ?? '',
      }))

      const primerResultado = coloniasNormalizadas[0]

      actualizarDomicilio({
        codigoPostal: codigoPostalNormalizado,
        estado: (primerResultado.estado ?? '').toUpperCase(),
        municipio: (primerResultado.municipio ?? '').toUpperCase(),
        ciudad: (primerResultado.ciudad ?? '').toUpperCase(),
        colonia:
          coloniasNormalizadas.length === 1
            ? (primerResultado.colonia ?? '').toUpperCase()
            : '',
      })

      setEstadoDomicilio({
        cargando: false,
        error: '',
        exito:
          coloniasNormalizadas.length === 1
            ? 'Autocompletamos tu domicilio con el código postal capturado.'
            : 'Encontramos varias colonias para ese código postal. Selecciona la correcta para continuar.',
      })

      return coloniasNormalizadas
    } catch (error) {
      setEstadoDomicilio({
        cargando: false,
        error: error.message,
        exito: '',
      })

      return []
    }
  }

  const preregistro = {
    datos: datosPreregistro,
    estado: estadoPreregistro,
    estadoDatosPersonales,
    estadoDomicilio,
    opcionesEnvioCodigo: [
      {
        id: 'correo',
        etiqueta: 'Enviar código por correo electrónico a:',
        valorMascara: enmascararCorreo(datosPreregistro.correo),
      },
    ],
    actualizarDatos: actualizarDatosPreregistro,
    actualizarDatosPersonales,
    actualizarDomicilio,
    limpiarMensajes: limpiarMensajesPreregistro,
    limpiarMensajesDatosPersonales,
    limpiarMensajesDomicilio,
    establecerError: establecerErrorPreregistro,
    enviarCodigoPorCorreo,
    confirmarCodigoYRegistrar,
    reenviarCodigoCorreo: reenviarCodigoCorreoRegistro,
    validarCurp: validarCurpPreregistro,
    guardarDatosPersonales: guardarDatosPersonalesPreregistro,
    consultarCodigoPostal: consultarCodigoPostalDomicilio,
    guardarDomicilio: guardarDomicilioPreregistro,
    subirInePdf,
    subirComprobante,
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
          onCambiarARegistro={cambiarAVistaRegistro}
          onEnviarInicioSesion={enviarInicioSesion}
          onInputInicioSesionChange={actualizarDatosInicioSesion}
        />
      ) : (
        <VistaRegistro
          configuracionPaso={configuracionPasoRegistro}
          preregistro={preregistro}
          tipoPerfil={tipoPerfil}
          onCambiarTipoPerfil={setTipoPerfil}
          onAvanzar={avanzarPasoRegistro}
          onRetroceder={retrocederPasoRegistro}
          onIrAPaso={irAPasoRegistro}
          onCambiarAInicioSesion={cambiarAVistaInicioSesion}
        />
      )}
    </ContenedorAutenticacion>
  )
}

export default Autenticacion
