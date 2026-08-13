import PanelLateralAutenticacion from './PanelLateralAutenticacion'
import estilos from '../estilos/autenticacion.module.css'

function ContenedorAutenticacion({
  children,
  mostrarPanelLateral = false,
  panelLateral,
  demoActivo = false,
  demoCargando = false,
  onEntrarDemo,
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
      {demoActivo ? (
        <button
          type="button"
          className={estilos.botonModoDemo}
          disabled={demoCargando}
          onClick={onEntrarDemo}
          aria-label="Entrar en modo demo"
        >
          {demoCargando ? 'Entrando...' : 'Iniciar demo'}
        </button>
      ) : null}
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
