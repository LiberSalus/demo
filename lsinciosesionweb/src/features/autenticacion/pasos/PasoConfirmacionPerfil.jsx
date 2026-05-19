import icoCuentaLista from '../assets/icoCuentaLista.svg'
import BotonPrincipal from '../componentes/BotonPrincipal'
import estilos from '../estilos/autenticacion.module.css'

function PasoConfirmacionPerfil({ contenido, onCambiarAInicioSesion }) {
  const { tituloEstado, descripcionEstado, textoBoton } = contenido

  return (
    <section className={`${estilos.pasoGenerico} ${estilos.pasoGenericoCentrado}`}>
      <img
        className={estilos.iconoConfirmacionCuenta}
        src={icoCuentaLista}
        alt=""
        aria-hidden="true"
      />
      <div className={`${estilos.estadoConfirmacion} ${estilos.estadoConfirmacionExito}`}>
        <strong>{tituloEstado}</strong>
        <p>{descripcionEstado}</p>
      </div>
      <BotonPrincipal onClick={onCambiarAInicioSesion}>{textoBoton}</BotonPrincipal>
    </section>
  )
}

export default PasoConfirmacionPerfil
