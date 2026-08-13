import EncabezadoAutenticacion from '../componentes/EncabezadoAutenticacion'
import PieAutenticacion from '../componentes/PieAutenticacion'
import BotonPrincipal from '../componentes/BotonPrincipal'
import CampoFormulario from '../componentes/CampoFormulario'
import { camposInicioSesion } from '../datos/camposInicioSesion'
import estilos from '../estilos/autenticacion.module.css'

// Inicio de sesion con la cuenta registrada localmente en el modo demo.
function VistaDemoLogin({
  datosInicioSesion,
  estadoInicioSesion,
  onEnviarInicioSesion,
  onInputInicioSesionChange,
  onPerfilPrueba,
  onCrearCuenta,
  onVolver,
}) {
  return (
    <section
      className={`${estilos.vistaAutenticacion} ${estilos.vistaAutenticacionInicio} ${estilos.vistaAutenticacionCentrada} ${estilos.seleccionDemoVista}`}
    >
      <div className={estilos.vistaAutenticacionPrincipal}>
        <EncabezadoAutenticacion />

        <div className={estilos.seleccionDemo}>
          <h3 className={estilos.seleccionDemoTitulo}>Entra con tu cuenta demo</h3>
          <p className={estilos.seleccionDemoTexto}>
            Usa el correo y la contraseña que registraste en esta demo. La cuenta se
            guarda solo en este navegador.
          </p>

          <form className={estilos.pasoFormulario} onSubmit={onEnviarInicioSesion} noValidate>
            <div className={estilos.rejillaFormulario}>
              {camposInicioSesion.map((campo) => (
                <CampoFormulario
                  key={campo.nombre}
                  {...campo}
                  valor={datosInicioSesion[campo.nombre]}
                  onChange={onInputInicioSesionChange}
                />
              ))}
            </div>

            {estadoInicioSesion.error ? (
              <p className={estilos.mensajeFormularioError} role="alert" aria-live="assertive">
                {estadoInicioSesion.error}
              </p>
            ) : null}

            <BotonPrincipal tipo="submit" cargando={estadoInicioSesion.cargando}>
              {estadoInicioSesion.cargando ? 'Entrando...' : 'Entrar con mi cuenta'}
            </BotonPrincipal>
          </form>

          <div className={estilos.accionesSecundarias}>
            <p className={estilos.aun}>
              ¿Aún no tienes cuenta?{' '}
              <button className={estilos.accionTexto} type="button" onClick={onCrearCuenta}>
                Créala aquí
              </button>
            </p>
            <p className={estilos.aun}>
              ¿Prefieres no registrar?{' '}
              <button className={estilos.accionTexto} type="button" onClick={onPerfilPrueba}>
                Entrar con un perfil de prueba
              </button>
            </p>
          </div>

          {!estadoInicioSesion.cargando ? (
            <button
              type="button"
              className={estilos.seleccionDemoVolver}
              onClick={onVolver}
            >
              Volver al inicio de sesión
            </button>
          ) : null}
        </div>

        <PieAutenticacion />
      </div>
    </section>
  )
}

export default VistaDemoLogin
