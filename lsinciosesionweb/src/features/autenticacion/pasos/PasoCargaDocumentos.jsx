import { useMemo, useState } from 'react'
import BotonPrincipal from '../componentes/BotonPrincipal'
import estilos from '../estilos/autenticacion.module.css'

const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png']
const maximoBytes = 2 * 1024 * 1024

function formatearPesoArchivo(pesoBytes) {
  if (pesoBytes >= 1024 * 1024) {
    return `${(pesoBytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return `${Math.max(Math.round(pesoBytes / 1024), 1)} KB`
}

function PasoCargaDocumentos({ contenido, onAvanzar }) {
  const { bloques, textoBoton } = contenido
  const [archivos, setArchivos] = useState({})
  const [error, setError] = useState('')

  const seleccionarArchivo = (idBloque, archivo) => {
    setError('')

    if (!archivo) return

    if (!tiposPermitidos.includes(archivo.type)) {
      setError('Solo se permiten archivos PDF, JPG o PNG.')
      return
    }

    if (archivo.size > maximoBytes) {
      setError('El archivo no debe exceder 2 MB.')
      return
    }

    setArchivos((estadoActual) => ({
      ...estadoActual,
      [idBloque]: archivo,
    }))
  }

  const puedeContinuar = useMemo(
    () => bloques.every((bloque) => archivos[bloque.id]),
    [archivos, bloques],
  )

  return (
    <section className={`${estilos.pasoGenerico} ${estilos.pasoCargaDocumentos}`}>
      <div className={estilos.bloqueCargaDocumentos}>
        {bloques.map((bloque) => {
          const archivo = archivos[bloque.id]

          return (
            <article className={estilos.bloqueCargaDocumentosItem} key={bloque.id}>
              <h3 className={estilos.bloqueCargaDocumentosTitulo}>{bloque.titulo}</h3>
              <p className={estilos.bloqueCargaDocumentosDescripcion}>
                {bloque.descripcion}
              </p>
              <label
                className={`${estilos.zonaArrastreDocumento} ${
                  archivo ? estilos.zonaArrastreDocumentoCargada : ''
                }`}
              >
                <input
                  hidden
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(evento) =>
                    seleccionarArchivo(bloque.id, evento.target.files?.[0])
                  }
                />
                {archivo ? (
                  <span className={estilos.zonaArrastreDocumentoArchivo}>
                    {archivo.name} - {formatearPesoArchivo(archivo.size)}
                  </span>
                ) : (
                  <span className={estilos.zonaArrastreDocumentoTexto}>
                    {bloque.textoAccion}
                  </span>
                )}
              </label>
            </article>
          )
        })}
      </div>

      {error ? <p className={estilos.mensajeFormularioError}>{error}</p> : null}

      <BotonPrincipal deshabilitado={!puedeContinuar} onClick={onAvanzar}>
        {textoBoton}
      </BotonPrincipal>
    </section>
  )
}

export default PasoCargaDocumentos
