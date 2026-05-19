import IndicadorPasos from './IndicadorPasos'
import estilos from '../estilos/autenticacion.module.css'

function PanelLateralAutenticacion({
  titular,
  descripcion,
  nota,
  pasos,
  pasoActivo,
}) {
  return (
    <aside className={estilos.panelLateral}>
      <div className={estilos.panelLateralContenido}>
        <div>
          <h2 className={estilos.panelLateralTitulo}>{titular}</h2>
          <p className={estilos.panelLateralDescripcion}>{descripcion}</p>
          <p className={estilos.panelLateralNota}>{nota}</p>
        </div>
        <IndicadorPasos pasos={pasos} pasoActivo={pasoActivo} />
      </div>
      <div className={`${estilos.panelLateralOla} ${estilos.panelLateralOlaUno}`} />
      <div className={`${estilos.panelLateralOla} ${estilos.panelLateralOlaDos}`} />
      <div className={`${estilos.panelLateralOla} ${estilos.panelLateralOlaTres}`} />
    </aside>
  )
}

export default PanelLateralAutenticacion
