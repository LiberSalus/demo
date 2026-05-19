import estilos from '../estilos/autenticacion.module.css'
import icoLibersalus from '../assets/icoLibersalus.svg'

function EncabezadoAutenticacion({
  titulo,
  subtitulo,
  alineacion = 'centrado',
  mostrarBotonRegreso = false,
  onRegresar,
}) {
  const subtituloFormateado =
    subtitulo && typeof subtitulo === 'object' && !Array.isArray(subtitulo) ? (
      <>
        <span>{subtitulo.inicio}</span>
        <strong>{subtitulo.destacado}</strong>{' '}
        <span>{subtitulo.cierre}</span>
      </>
    ) : (
      subtitulo
    )

  return (
    <header
      className={[
        estilos.encabezadoAutenticacion,
        mostrarBotonRegreso ? estilos.encabezadoAutenticacionConRegreso : '',
        alineacion === 'izquierda' ? estilos.encabezadoAutenticacionIzquierda : '',
      ].join(' ')}
    >
      {mostrarBotonRegreso ? (
        <button
          type="button"
          className={estilos.botonRegresoEncabezado}
          onClick={onRegresar}
          aria-label="Regresar al paso anterior"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M14.5 5L8 11.5L14.5 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}
      <div className={estilos.logotipoLibersalus} aria-label="LiberSalus">
        <img className={estilos.logotipoLibersalusImagen} src={icoLibersalus} alt="LiberSalus" />
      </div>
      {titulo ? <h1 className={estilos.encabezadoAutenticacionTitulo}>{titulo}</h1> : null}
      {subtitulo ? (
        <p className={estilos.encabezadoAutenticacionSubtitulo}>{subtituloFormateado}</p>
      ) : null}
    </header>
  )
}

export default EncabezadoAutenticacion
