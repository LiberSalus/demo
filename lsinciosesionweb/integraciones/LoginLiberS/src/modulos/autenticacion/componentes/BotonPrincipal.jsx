import estilos from '../estilos/autenticacion.module.css'

function BotonPrincipal({
  children,
  tipo = 'button',
  variante = 'primario',
  anchoCompleto = false,
  className = '',
  claseAdicional = '',
  deshabilitado = false,
  cargando = false,
  onClick,
}) {
  const clases = [
    estilos.botonPrincipal,
    variante === 'secundario' ? estilos.botonPrincipalSecundario : '',
    anchoCompleto ? estilos.botonPrincipalAnchoCompleto : '',
    className,
    claseAdicional,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={clases}
      disabled={deshabilitado || cargando}
      type={tipo}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default BotonPrincipal
