import BotonPrincipal from '../componentes/BotonPrincipal'
import CampoFormulario from '../componentes/CampoFormulario'
import estilos from '../estilos/autenticacion.module.css'

function PasoRegistroCuenta({
  contenido,
  preregistro,
  onAvanzar,
  onCambiarAInicioSesion,
}) {
  const { datos, estado, actualizarDatos, limpiarMensajes, establecerError } = preregistro

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
    </section>
  )
}

export default PasoRegistroCuenta
