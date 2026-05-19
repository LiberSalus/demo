import icoConfirmacion from '/icoConfirmacion.png'
import BotonPrincipal from '../componentes/BotonPrincipal'
import estilos from '../estilos/autenticacion.module.css'

function PasoConfirmacionPerfil({ contenido }) {
  const { tituloEstado, descripcionEstado, textoBoton } = contenido

  return (
    <section
      className={`${estilos.pasoGenerico} ${estilos.pasoGenericoCentrado} ${estilos.pasoConfirmacionPerfil}`}
    >
      <div className={estilos.confirmacionPerfilContenido}>
        <div className={`${estilos.estadoConfirmacion} ${estilos.estadoConfirmacionExito}`}>
          <strong className={estilos.confirmacionPerfilTitulo}>{tituloEstado}</strong>
          <p className={estilos.confirmacionPerfilDescripcion}>{descripcionEstado}</p>
        </div>

        <img
          className={estilos.confirmacionPerfilIcono}
          src={icoConfirmacion}
          alt=""
          aria-hidden="true"
        />
      </div>

      <BotonPrincipal className={estilos.confirmacionPerfilBoton}>
        {textoBoton}
      </BotonPrincipal>
    </section>
  )
}

export default PasoConfirmacionPerfil
