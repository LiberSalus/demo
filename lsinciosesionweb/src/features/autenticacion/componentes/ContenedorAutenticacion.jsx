import PanelLateralAutenticacion from './PanelLateralAutenticacion'
import estilos from '../estilos/autenticacion.module.css'

function ContenedorAutenticacion({
  children,
  mostrarPanelLateral = false,
  panelLateral,
}) {
  const clasesMarco = [
    estilos.autenticacionMarco,
    mostrarPanelLateral
      ? estilos.autenticacionMarcoConPanel
      : estilos.autenticacionMarcoSinPanel,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <main className={estilos.autenticacion}>
      <section className={clasesMarco}>
        {mostrarPanelLateral && panelLateral ? (
          <PanelLateralAutenticacion {...panelLateral} />
        ) : null}
        <section className={estilos.autenticacionContenido}>{children}</section>
      </section>
    </main>
  )
}

export default ContenedorAutenticacion
