import { useState } from 'react'
import BotonPrincipal from '../componentes/BotonPrincipal'
import CampoFormulario from '../componentes/CampoFormulario'
import ModalAvisoLegal from '../componentes/ModalAvisoLegal'
import estilos from '../estilos/autenticacion.module.css'

const avisoLegalRegistro = {
  titulo: 'Términos y aviso de privacidad',
  fechaActualizacion: '04 - Julio - 2025',
  etiquetaAceptacion:
    'He leído y acepto los Términos y condiciones y el Aviso de privacidad.',
  contenido: [
    {
      titulo: 'Términos y condiciones',
      parrafos: [
        'El usuario es responsable de proporcionar datos reales, resguardar sus credenciales y mantener actualizada la información necesaria para su afiliación.',
        'El uso de la plataforma implica la aceptación de futuras actualizaciones publicadas por Liber Salus en sus canales oficiales.',
      ],
    },
    {
      titulo: 'Aviso de privacidad integral',
      parrafos: [
        'Liber Salus S.A. de C.V. es responsable del tratamiento, uso, almacenamiento y protección de los datos personales que proporciones durante tu registro y uso de la plataforma.',
        'La información recopilada podrá incluir datos personales sensibles relacionados con tu proceso de afiliación y será tratada conforme a la legislación aplicable en materia de protección de datos y salud.',
      ],
    },
    {
      titulo: 'Finalidades del tratamiento',
      parrafos: [
        'Tus datos serán utilizados para validar tu identidad, gestionar tu cuenta, dar seguimiento a tu afiliación y ofrecerte una experiencia segura y personalizada.',
      ],
    },
  ],
}

const opcionesLadaTelefono = [
  { valor: '+52', etiqueta: 'MX +52', longitud: 10 },
  { valor: '+1', etiqueta: 'US +1', longitud: 10 },
  { valor: '+57', etiqueta: 'CO +57', longitud: 10 },
  { valor: '+34', etiqueta: 'ES +34', longitud: 9 },
]

function obtenerErrorContrasena(contrasena) {
  if (!contrasena) return ''
  if (contrasena.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
  if (contrasena.length > 20) return 'La contraseña debe tener máximo 20 caracteres.'
  if (/\s/.test(contrasena)) return 'La contraseña no debe contener espacios.'
  if (!/[A-Za-z]/.test(contrasena)) return 'La contraseña debe incluir al menos una letra.'
  if (!/\d/.test(contrasena)) return 'La contraseña debe incluir al menos un número.'

  return ''
}

function obtenerErrorConfirmacion(contrasena, confirmacion) {
  if (!confirmacion) return ''
  if (contrasena !== confirmacion) return 'Las contraseñas no coinciden.'

  return ''
}

function obtenerConfiguracionLada(codeTelefono) {
  return (
    opcionesLadaTelefono.find((opcion) => opcion.valor === codeTelefono) ||
    opcionesLadaTelefono[0]
  )
}

function obtenerErrorTelefono(telefono, codeTelefono) {
  if (!telefono) return ''

  const configuracionLada = obtenerConfiguracionLada(codeTelefono)

  if (telefono.length !== configuracionLada.longitud) {
    return `El teléfono debe tener ${configuracionLada.longitud} dígitos.`
  }

  return ''
}

function PasoRegistroCuenta({
  contenido,
  preregistro,
  onAvanzar,
  onCambiarAInicioSesion,
}) {
  const { datos, estado, actualizarDatos, limpiarMensajes, establecerError } = preregistro
  const [avisoLegalAceptado, setAvisoLegalAceptado] = useState(false)
  const [modalLegalAbierto, setModalLegalAbierto] = useState(false)
  const [confirmacionModal, setConfirmacionModal] = useState(false)
  const errorContrasena = obtenerErrorContrasena(datos.contrasena)
  const errorConfirmacion = obtenerErrorConfirmacion(
    datos.contrasena,
    datos.confirmarContrasena,
  )
  const errorTelefono = obtenerErrorTelefono(datos.telefono, datos.codeTelefono)

  const abrirModalLegal = () => {
    setModalLegalAbierto(true)
    setConfirmacionModal(false)
  }

  const cerrarModalLegal = () => {
    setModalLegalAbierto(false)
    setConfirmacionModal(false)
  }

  const aceptarDocumentoLegal = () => {
    if (!confirmacionModal) return

    setAvisoLegalAceptado(true)
    cerrarModalLegal()
  }

  const manejarCrearCuenta = () => {
    limpiarMensajes()

    if (!datos.correo.trim()) {
      establecerError('Captura tu correo para continuar.')
      return
    }

    if (!datos.telefono.trim()) {
      establecerError('Captura tu teléfono para continuar.')
      return
    }

    if (errorTelefono) {
      establecerError(errorTelefono)
      return
    }

    if (!datos.contrasena.trim() || !datos.confirmarContrasena.trim()) {
      establecerError('Captura y confirma tu contraseña para continuar.')
      return
    }

    if (errorContrasena) {
      establecerError(errorContrasena)
      return
    }

    if (errorConfirmacion) {
      establecerError(errorConfirmacion)
      return
    }

    if (!avisoLegalAceptado) {
      establecerError('Debes aceptar los términos y el aviso de privacidad para continuar.')
      return
    }

    onAvanzar()
  }

  return (
    <section className={`${estilos.pasoFormulario} ${estilos.pasoRegistroCuenta}`}>
      <div className={`${estilos.rejillaFormulario} ${estilos.rejillaFormularioDosColumnas}`}>
        <CampoFormulario
          etiqueta="Correo electrónico"
          nombre="correo"
          tipo="email"
          marcador="Tu correo electrónico"
          valor={datos.correo}
          onChange={(evento) => {
            limpiarMensajes()
            actualizarDatos({ correo: evento.target.value.trim() })
          }}
        />

        <div className={estilos.grupoTelefono}>
          <div className={estilos.grupoTelefonoEtiquetas}>
            <span className={estilos.campoFormularioEtiqueta}>Lada</span>
            <span className={estilos.campoFormularioEtiqueta}>Teléfono celular</span>
          </div>
          <div className={estilos.telefonoInternacional}>
            <select
              className={estilos.telefonoInternacionalSelector}
              name="codeTelefono"
              value={datos.codeTelefono}
              onChange={(evento) => {
                limpiarMensajes()
                actualizarDatos({ codeTelefono: evento.target.value })
              }}
            >
              {opcionesLadaTelefono.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.etiqueta}
                </option>
              ))}
            </select>
            <input
              className={`${estilos.telefonoInternacionalInput} ${
                errorTelefono ? estilos.telefonoInternacionalInputError : ''
              }`}
              inputMode="numeric"
              name="telefono"
              placeholder="Tu teléfono"
              type="tel"
              value={datos.telefono}
              onChange={(evento) => {
                limpiarMensajes()
                const longitudMaxima = obtenerConfiguracionLada(
                  datos.codeTelefono,
                ).longitud
                actualizarDatos({
                  telefono: evento.target.value.replace(/\D/g, '').slice(0, longitudMaxima),
                })
              }}
            />
          </div>
          {errorTelefono ? (
            <span className={estilos.campoFormularioError} role="alert" aria-live="polite">
              {errorTelefono}
            </span>
          ) : null}
        </div>

        <CampoFormulario
          etiqueta="Contraseña"
          nombre="contrasena"
          tipo="password"
          marcador="Tu contraseña"
          permiteMostrarContrasena
          valor={datos.contrasena}
          error={errorContrasena}
          onChange={(evento) => {
            limpiarMensajes()
            actualizarDatos({ contrasena: evento.target.value })
          }}
        />

        <CampoFormulario
          etiqueta="Confirmar contraseña"
          nombre="confirmarContrasena"
          tipo="password"
          marcador="Confirma tu contraseña"
          permiteMostrarContrasena
          valor={datos.confirmarContrasena}
          error={errorConfirmacion}
          onChange={(evento) => {
            limpiarMensajes()
            actualizarDatos({ confirmarContrasena: evento.target.value })
          }}
        />
      </div>

      {estado.error ? (
        <p className={estilos.mensajeFormularioError}>{estado.error}</p>
      ) : null}

      <div className={estilos.aceptacionTerminos}>
        <input checked={avisoLegalAceptado} readOnly type="checkbox" />
        <span>
          {contenido.textoAceptacionInicial}{' '}
          <button
            className={estilos.accionTexto}
            type="button"
            onClick={abrirModalLegal}
          >
            {contenido.textoTerminos}
          </button>{' '}
          {contenido.textoConectorPoliticas}{' '}
          <button
            className={estilos.accionTexto}
            type="button"
            onClick={abrirModalLegal}
          >
            {contenido.textoPoliticas}
          </button>
          .
        </span>
      </div>

      <div className={estilos.cuentaExistente}>
        <p>
          {contenido.textoCuentaExistente}{' '}
          <button
            className={estilos.accionTexto}
            type="button"
            onClick={onCambiarAInicioSesion}
          >
            {contenido.textoAccionInicioSesion}
          </button>
        </p>
      </div>

      <BotonPrincipal cargando={estado.cargando} onClick={manejarCrearCuenta}>
        {estado.cargando ? 'Procesando...' : contenido.textoBoton}
      </BotonPrincipal>

      <ModalAvisoLegal
        abierto={modalLegalAbierto}
        aceptado={confirmacionModal}
        contenido={avisoLegalRegistro.contenido}
        etiquetaAceptacion={avisoLegalRegistro.etiquetaAceptacion}
        fechaActualizacion={avisoLegalRegistro.fechaActualizacion}
        titulo={avisoLegalRegistro.titulo}
        onAceptar={aceptarDocumentoLegal}
        onCambiarAceptacion={(evento) => setConfirmacionModal(evento.target.checked)}
        onCancelar={cerrarModalLegal}
      />
    </section>
  )
}

export default PasoRegistroCuenta
