import iconoCuentaLista from '/icoCuentaLista.svg'
import BotonPrincipal from '../componentes/BotonPrincipal'
import estilos from '../estilos/autenticacion.module.css'

function PasoConfirmacionCuenta({ contenido, onAvanzar }) {
  const { tituloEstado, descripcionEstado, textoBoton } = contenido

  return (
    <section className={`${estilos.pasoGenerico} ${estilos.pasoGenericoCentrado}`}>
      <img
        className={estilos.iconoConfirmacionCuenta}
        src={iconoCuentaLista}
        alt=""
        aria-hidden="true"
      />

      <div className={`${estilos.estadoConfirmacion} ${estilos.estadoConfirmacionExito}`}>
        <strong>{tituloEstado}</strong>
        <p>{descripcionEstado}</p>
      </div>
      <BotonPrincipal onClick={onAvanzar}>{textoBoton}</BotonPrincipal>
    </section>
  )
}

export default PasoConfirmacionCuenta
