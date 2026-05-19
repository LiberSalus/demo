import icoBasura from '/icoBasura.svg'
import icoCancel from '/icoCancel.svg'
import icoDOC from '/icoDOC.svg'
import icoJPG from '/icoJPG.svg'
import icoPDF from '/icoPDF.svg'
import icoPNG from '/icoPNG.svg'
import estilos from '../estilos/autenticacion.module.css'

const iconosPorExtension = {
  doc: icoDOC,
  docx: icoDOC,
  jpg: icoJPG,
  jpeg: icoJPG,
  pdf: icoPDF,
  png: icoPNG,
}

function obtenerExtensionArchivo(nombreArchivo) {
  return nombreArchivo.split('.').pop()?.toLowerCase() ?? ''
}

function formatearPesoArchivo(pesoBytes) {
  if (pesoBytes >= 1024 * 1024) {
    return `${(pesoBytes / (1024 * 1024)).toFixed(1)}MB`
  }

  return `${Math.round(pesoBytes / 1024)}kb`
}

function TarjetaCargaDocumento({ archivo, estado, progreso, onCancelar, onEliminar }) {
  const extension = obtenerExtensionArchivo(archivo.name)
  const iconoArchivo = iconosPorExtension[extension] ?? icoDOC
  const accionEsCancelar = estado === 'cargando'
  const iconoAccion = accionEsCancelar ? icoCancel : icoBasura
  const textoAccion = accionEsCancelar ? 'Cancelar carga' : 'Eliminar archivo'
  const manejarAccion = (evento) => {
    evento.preventDefault()
    evento.stopPropagation()

    if (accionEsCancelar) {
      onCancelar()
      return
    }

    onEliminar()
  }

  return (
    <div className={estilos.tarjetaCargaDocumento}>
      <div className={estilos.tarjetaCargaDocumentoEncabezado}>
        <div className={estilos.tarjetaCargaDocumentoArchivo}>
          <img
            className={estilos.tarjetaCargaDocumentoArchivoIcono}
            src={iconoArchivo}
            alt=""
            aria-hidden="true"
          />

          <div className={estilos.tarjetaCargaDocumentoArchivoInfo}>
            <p className={estilos.tarjetaCargaDocumentoArchivoNombre}>{archivo.name}</p>
            <p className={estilos.tarjetaCargaDocumentoArchivoPeso}>
              {formatearPesoArchivo(archivo.size)}
            </p>
          </div>
        </div>

        <button
          className={estilos.tarjetaCargaDocumentoAccion}
          type="button"
          onClick={manejarAccion}
          aria-label={textoAccion}
        >
          <img src={iconoAccion} alt="" aria-hidden="true" />
        </button>
      </div>

      <div className={estilos.tarjetaCargaDocumentoProgreso}>
        <div className={estilos.tarjetaCargaDocumentoBarra}>
          <span
            className={estilos.tarjetaCargaDocumentoBarraValor}
            style={{ width: `${progreso}%` }}
          />
        </div>
        <span className={estilos.tarjetaCargaDocumentoPorcentaje}>
          {String(progreso).padStart(3, '0')}%
        </span>
      </div>
    </div>
  )
}

export default TarjetaCargaDocumento
