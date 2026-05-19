import icoSube from '/icoSube.svg'
import { useCallback, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import BotonPrincipal from '../componentes/BotonPrincipal'
import TarjetaCargaDocumento from '../componentes/TarjetaCargaDocumento'
import estilos from '../estilos/autenticacion.module.css'

function ZonaCargaDocumento({
  bloque,
  estadoCarga,
  onCancelarArchivo,
  onEliminarArchivo,
  onSeleccionarArchivo,
}) {
  const manejarDrop = useCallback(
    (archivosAceptados) => {
      const archivoSeleccionado = archivosAceptados[0]

      if (archivoSeleccionado) {
        onSeleccionarArchivo(bloque.id, archivoSeleccionado)
      }
    },
    [bloque.id, onSeleccionarArchivo],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: manejarDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 2 * 1024 * 1024,
  })

  const hayArchivo = Boolean(estadoCarga?.archivo)

  return (
    <article className={estilos.bloqueCargaDocumentosItem}>
      <h3 className={estilos.bloqueCargaDocumentosTitulo}>{bloque.titulo}</h3>
      <p className={estilos.bloqueCargaDocumentosDescripcion}>{bloque.descripcion}</p>
      {estadoCarga?.error ? (
        <p className={estilos.mensajeFormularioError}>{estadoCarga.error}</p>
      ) : null}

      <div
        {...getRootProps()}
        className={`${estilos.zonaArrastreDocumento} ${
          hayArchivo ? estilos.zonaArrastreDocumentoCargada : ''
        } ${
          isDragActive ? estilos.zonaArrastreDocumentoActiva : ''
        }`}
      >
        <input {...getInputProps()} />
        {hayArchivo ? (
          <TarjetaCargaDocumento
            archivo={estadoCarga.archivo}
            estado={estadoCarga.estado}
            progreso={estadoCarga.progreso}
            onCancelar={() => onCancelarArchivo(bloque.id)}
            onEliminar={() => onEliminarArchivo(bloque.id)}
          />
        ) : (
          <>
            <div className={estilos.zonaArrastreDocumentoIcono} aria-hidden="true">
              <img src={icoSube} alt="" />
            </div>

            <p className={estilos.zonaArrastreDocumentoTexto}>
              <button className={estilos.zonaArrastreDocumentoAccion} type="button">
                {bloque.textoAccion}
              </button>{' '}
              para subir tu archivo o arrástralo aquí.
            </p>
          </>
        )}
      </div>
    </article>
  )
}

function PasoCargaDocumentos({ contenido, preregistro, onAvanzar }) {
  const { bloques, textoBoton } = contenido
  const { subirComprobante, subirInePdf } = preregistro
  const [archivosCargados, setArchivosCargados] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  const seleccionarArchivo = async (idBloque, archivo) => {
    setErrorGeneral('')

    if (idBloque === 'identificacionOficial' && archivo.type !== 'application/pdf') {
      setArchivosCargados((estadoActual) => ({
        ...estadoActual,
        [idBloque]: {
          archivo,
          estado: 'error',
          progreso: 0,
          error:
            'Por ahora la identificación oficial debe subirse en PDF para incluir frente y reverso en un solo archivo.',
        },
      }))
      return
    }

    setArchivosCargados((estadoActual) => ({
      ...estadoActual,
      [idBloque]: {
        archivo,
        estado: 'cargando',
        progreso: 0,
        error: '',
      },
    }))

    try {
      if (idBloque === 'identificacionOficial') {
        await subirInePdf(archivo)
      } else if (idBloque === 'comprobanteDomicilio') {
        await subirComprobante(archivo)
      }

      setArchivosCargados((estadoActual) => ({
        ...estadoActual,
        [idBloque]: {
          archivo,
          estado: 'completado',
          progreso: 100,
          error: '',
        },
      }))
    } catch (error) {
      setArchivosCargados((estadoActual) => ({
        ...estadoActual,
        [idBloque]: {
          archivo,
          estado: 'error',
          progreso: 0,
          error: error.message,
        },
      }))
      setErrorGeneral(
        'No pudimos subir uno o más documentos. Revisa el archivo e inténtalo de nuevo.',
      )
    }
  }

  const cancelarArchivo = (idBloque) => {
    setArchivosCargados((estadoActual) => {
      const siguienteEstado = { ...estadoActual }
      delete siguienteEstado[idBloque]
      return siguienteEstado
    })
  }

  const eliminarArchivo = (idBloque) => {
    setArchivosCargados((estadoActual) => {
      const siguienteEstado = { ...estadoActual }
      delete siguienteEstado[idBloque]
      return siguienteEstado
    })
  }

  const puedeContinuar = useMemo(
    () =>
      bloques.every(
        (bloque) => archivosCargados[bloque.id]?.estado === 'completado',
      ),
    [archivosCargados, bloques],
  )

  return (
    <section className={`${estilos.pasoGenerico} ${estilos.pasoCargaDocumentos}`}>
      <div className={estilos.bloqueCargaDocumentos}>
        {bloques.map((bloque) => (
          <ZonaCargaDocumento
            key={bloque.id}
            bloque={bloque}
            estadoCarga={archivosCargados[bloque.id]}
            onCancelarArchivo={cancelarArchivo}
            onEliminarArchivo={eliminarArchivo}
            onSeleccionarArchivo={seleccionarArchivo}
          />
        ))}
      </div>
      {errorGeneral ? (
        <p className={estilos.mensajeFormularioError}>{errorGeneral}</p>
      ) : null}
      <BotonPrincipal
        className={estilos.botonCargaDocumentos}
        deshabilitado={!puedeContinuar}
        onClick={onAvanzar}
      >
        {textoBoton}
      </BotonPrincipal>
    </section>
  )
}

export default PasoCargaDocumentos
