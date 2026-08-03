import BotonPrincipal from '../componentes/BotonPrincipal'
import CampoFormulario from '../componentes/CampoFormulario'
import { camposInicioSesion } from '../datos/camposInicioSesion'
import estilos from '../estilos/autenticacion.module.css'
import icoGoogle from '../assets/icoGoogle.svg'

function PasoInicioSesion({
  datos,
  error,
  cargando,
  onCambiarARegistro,
  onEnviar,
  onInputChange,
}) {
  return (
    <form className={estilos.pasoFormulario} onSubmit={onEnviar} noValidate>
      <button className={estilos.botonGoogle} type="button">
        <img className={estilos.botonGoogleIcono} src={icoGoogle} alt="Google" />
        <span className={estilos.botonGoogleTexto}>Inicia sesión con Google</span>
      </button>

      <div className={estilos.separadorFormulario}>
        <span />
        <small>O</small>
        <span />
      </div>

      <div className={estilos.rejillaFormulario}>
        {camposInicioSesion.map((campo) => (
          <CampoFormulario
            key={campo.nombre}
            {...campo}
            valor={datos[campo.nombre]}
            onChange={onInputChange}
          />
        ))}
      </div>

      {error ? (
        <p className={estilos.mensajeFormularioError} role="alert" aria-live="assertive">
          {error}
        </p>
      ) : null}

      <BotonPrincipal tipo="submit" cargando={cargando}>
        {cargando ? 'Iniciando...' : 'Iniciar sesión'}
      </BotonPrincipal>

      <div className={estilos.accionesSecundarias}>
        <button className={estilos.accionTexto} type="button">
          Olvidé mi contraseña
        </button>
        <p className={estilos.aun}>
          Aún no tienes una cuenta.{' '}
          <button className={estilos.accionTexto} type="button" onClick={onCambiarARegistro}>
            Regístrate
          </button>
        </p>
      </div>
    </form>
  )
}

export default PasoInicioSesion
