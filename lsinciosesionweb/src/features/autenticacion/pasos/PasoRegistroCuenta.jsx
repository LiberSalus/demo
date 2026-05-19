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

    if (!datos.contrasena.trim() || !datos.confirmarContrasena.trim()) {
      establecerError('Captura y confirma tu contraseña para continuar.')
      return
    }

    if (datos.contrasena !== datos.confirmarContrasena) {
      establecerError('Las contraseñas no coinciden.')
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

        <CampoFormulario
          etiqueta="Teléfono celular"
          nombre="telefono"
          tipo="tel"
          marcador="Tu teléfono"
          valor={datos.telefono}
          onChange={(evento) => {
            limpiarMensajes()
            actualizarDatos({ telefono: evento.target.value.replace(/\D/g, '').slice(0, 10) })
          }}
        />

        <CampoFormulario
          etiqueta="Contraseña"
          nombre="contrasena"
          tipo="password"
          marcador="Tu contraseña"
          permiteMostrarContrasena
          valor={datos.contrasena}
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
