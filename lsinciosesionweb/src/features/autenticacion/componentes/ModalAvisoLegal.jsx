import { createPortal } from 'react-dom'
import BotonPrincipal from './BotonPrincipal'
import estilos from '../estilos/autenticacion.module.css'

function ModalAvisoLegal({
  abierto = false,
  titulo,
  fechaActualizacion,
  contenido,
  etiquetaAceptacion,
  aceptado = false,
  onCambiarAceptacion,
  onCancelar,
  onAceptar,
}) {
  if (!abierto) return null

  return createPortal(
    <section className={estilos.modalAvisoLegalOverlay} role="dialog" aria-modal="true">
      <article className={estilos.modalAvisoLegal}>
        <header className={estilos.modalAvisoLegalEncabezado}>
          <div>
            <h2 className={estilos.modalAvisoLegalTitulo}>{titulo}</h2>
            <p className={estilos.modalAvisoLegalFecha}>
              Última actualización: {fechaActualizacion}
            </p>
          </div>
          <button
            className={estilos.modalAvisoLegalCerrar}
            type="button"
            aria-label="Cerrar modal"
            onClick={onCancelar}
          >
            ×
          </button>
        </header>

        <div className={estilos.modalAvisoLegalContenido}>
          {contenido.map((bloque) => (
            <section className={estilos.modalAvisoLegalBloque} key={bloque.titulo}>
              <h3 className={estilos.modalAvisoLegalSubtitulo}>{bloque.titulo}</h3>
              {bloque.parrafos.map((parrafo, indice) => (
                <p
                  className={estilos.modalAvisoLegalParrafo}
                  key={`${bloque.titulo}-${indice}`}
                >
                  {parrafo}
                </p>
              ))}
            </section>
          ))}
        </div>

        <label className={estilos.modalAvisoLegalAceptacion}>
          <input checked={aceptado} type="checkbox" onChange={onCambiarAceptacion} />
          <span>{etiquetaAceptacion}</span>
        </label>

        <footer className={estilos.modalAvisoLegalAcciones}>
          <button
            className={estilos.modalAvisoLegalBotonCancelar}
            type="button"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <BotonPrincipal
            anchoCompleto={false}
            claseAdicional={estilos.modalAvisoLegalBotonAceptar}
            deshabilitado={!aceptado}
            onClick={onAceptar}
          >
            Aceptar y continuar
          </BotonPrincipal>
        </footer>
      </article>
    </section>,
    document.body,
  )
}

export default ModalAvisoLegal
