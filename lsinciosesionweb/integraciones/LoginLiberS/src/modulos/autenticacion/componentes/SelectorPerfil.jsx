import estilos from '../estilos/autenticacion.module.css'

function SelectorPerfil({ opciones, valorActivo, onCambiar }) {
  return (
    <div className={estilos.selectorPerfil} role="tablist" aria-label="Tipo de perfil">
      {opciones.map((opcion) => (
        <button
          key={opcion.valor}
          className={[
            estilos.selectorPerfilOpcion,
            valorActivo === opcion.valor ? estilos.selectorPerfilOpcionActiva : '',
          ]
            .filter(Boolean)
            .join(' ')}
          type="button"
          role="tab"
          aria-selected={valorActivo === opcion.valor}
          onClick={() => onCambiar(opcion.valor)}
        >
          {opcion.etiqueta}
        </button>
      ))}
    </div>
  )
}

export default SelectorPerfil
