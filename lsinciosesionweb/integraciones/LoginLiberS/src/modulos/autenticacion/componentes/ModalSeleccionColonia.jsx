import BotonPrincipal from './BotonPrincipal'
import estilos from '../estilos/autenticacion.module.css'

function ModalSeleccionColonia({
  abierto,
  busqueda,
  colonias,
  coloniaSeleccionada,
  marcadorBusqueda,
  textoBoton,
  titulo,
  onCambiarBusqueda,
  onCerrar,
  onContinuar,
  onSeleccionarColonia,
}) {
  if (!abierto) {
    return null
  }

  return (
    <div className={estilos.modalColoniasOverlay} onClick={onCerrar} role="presentation">
      <div
        className={estilos.modalColonias}
        onClick={(evento) => evento.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <h3 className={estilos.modalColoniasTitulo}>{titulo}</h3>

        <label className={estilos.modalColoniasBusqueda}>
          <span className={estilos.modalColoniasBusquedaIcono} aria-hidden="true">
            ○
          </span>
          <input
            className={estilos.modalColoniasBusquedaInput}
            type="text"
            placeholder={marcadorBusqueda}
            value={busqueda}
            onChange={onCambiarBusqueda}
          />
        </label>

        <div className={estilos.modalColoniasLista}>
          {colonias.map((colonia) => (
            <button
              key={colonia}
              className={`${estilos.modalColoniasOpcion} ${
                coloniaSeleccionada === colonia ? estilos.modalColoniasOpcionActiva : ''
              }`}
              type="button"
              onClick={() => onSeleccionarColonia(colonia)}
            >
              {colonia}
            </button>
          ))}
        </div>

        <BotonPrincipal
          className={estilos.modalColoniasBoton}
          deshabilitado={!coloniaSeleccionada}
          onClick={onContinuar}
        >
          {textoBoton}
        </BotonPrincipal>
      </div>
    </div>
  )
}

export default ModalSeleccionColonia
