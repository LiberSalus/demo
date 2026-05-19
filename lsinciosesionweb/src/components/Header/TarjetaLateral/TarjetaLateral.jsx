import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Cropper from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import styles from './tarjetaLateral.module.css'
import { ESTADOS } from './estados.config'
import ProgresoTU from './ProgresoTU'
import ProgresoCuestionario from './ProgresoCuestionario'
import getCroppedImage from './cropImage'

import icoLapiz from './icoLapiz.svg'
import perfil from './Usuario.png'
import any from './iconNull.svg'
import cerrar from './icoCerrar.svg'
import resta from './icoZoomResta.svg'
import suma  from './icoZoomSuma.svg'

const TarjetaLateral = ({
  estados,
  onClose,
  fotoPerfil = perfil,
  onGuardarFoto,
  onLogout = () => {},
}) => {
  const MIN_ZOOM = 0.5
  const BASE_ZOOM = 1
  const MAX_ZOOM = 2
  const DEFAULT_ZOOM_PERCENT = 50

  const percentToZoom = (percent) => {
    if (percent <= 50) {
      return MIN_ZOOM + (percent / 50) * (BASE_ZOOM - MIN_ZOOM)
    }
    return BASE_ZOOM + ((percent - 50) / 50) * (MAX_ZOOM - BASE_ZOOM)
  }

  const zoomToPercent = (zoomValue) => {
    if (zoomValue <= BASE_ZOOM) {
      return ((zoomValue - MIN_ZOOM) / (BASE_ZOOM - MIN_ZOOM)) * 50
    }
    return 50 + ((zoomValue - BASE_ZOOM) / (MAX_ZOOM - BASE_ZOOM)) * 50
  }

  const fileInputRef = useRef(null)
  const dialogRef = useRef(null)
  const dialogFirstActionRef = useRef(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [nombreArchivo, setNombreArchivo] = useState('')
  const [sourceImage, setSourceImage] = useState(fotoPerfil)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(BASE_ZOOM)
  const [zoomPercent, setZoomPercent] = useState(DEFAULT_ZOOM_PERCENT)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const conexion = Array.from(new Set(estados)).filter((e) => ESTADOS[e])
  const cuestionariosActivos = [
    { id: 'c2', titulo: 'Cuestionario 2', porcentaje: 45 },
    { id: 'c3', titulo: 'Cuestionario 3', porcentaje: 35 },
    { id: 'c4', titulo: 'Cuestionario 4', porcentaje: 60 },
    { id: 'c5', titulo: 'Cuestionario 5', porcentaje: 20 },
    { id: 'c6', titulo: 'Cuestionario 6', porcentaje: 70 },
    { id: 'c7', titulo: 'Cuestionario 7', porcentaje: 50 },
  ]

  const abrirDialogoFoto = () => {
    setSourceImage(fotoPerfil)
    setCrop({ x: 0, y: 0 })
    setZoom(BASE_ZOOM)
    setZoomPercent(DEFAULT_ZOOM_PERCENT)
    setCroppedAreaPixels(null)
    setNombreArchivo('')
    setIsDialogOpen(true)
  }

  const cerrarDialogoFoto = () => {
    setIsDialogOpen(false)
    setCrop({ x: 0, y: 0 })
    setZoom(BASE_ZOOM)
    setZoomPercent(DEFAULT_ZOOM_PERCENT)
    setCroppedAreaPixels(null)
    setNombreArchivo('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSeleccionarFoto = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setNombreArchivo(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      setSourceImage(String(reader.result || ''))
      setCrop({ x: 0, y: 0 })
      setZoom(BASE_ZOOM)
      setZoomPercent(DEFAULT_ZOOM_PERCENT)
    }
    reader.readAsDataURL(file)
  }

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const guardarNuevaFoto = async () => {
    if (!sourceImage || !croppedAreaPixels) return
    const croppedImage = await getCroppedImage(sourceImage, croppedAreaPixels)
    onGuardarFoto?.(croppedImage)
    cerrarDialogoFoto()
  }

  useEffect(() => {
    if (!isDialogOpen) return

    dialogFirstActionRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        cerrarDialogoFoto()
        return
      }

      if (event.key !== 'Tab') return

      const dialogElement = dialogRef.current
      if (!dialogElement) return

      const focusableElements = dialogElement.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )

      if (focusableElements.length === 0) {
        event.preventDefault()
        dialogElement.focus()
        return
      }

      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey && activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable.focus()
      } else if (!event.shiftKey && activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [isDialogOpen])

  return (
    <div className={styles.cntTarjetaLateral}>
      <div className={styles.cntEstado}>
        <button type="button" className={styles.cerrar} onClick={onClose} aria-label="Cerrar panel">
          ×
        </button>
        {conexion.map((code) => {
          const cfg = ESTADOS[code]

          return (
            <div
              key={cfg.id}
              className={`${styles.pill} ${styles.porDefecto}`}
              style={cfg.color ? { color: cfg.color } : undefined}
            >
              <p className={styles.txto}>
                {cfg.txt} <span className={styles.bola}>•</span>
              </p>
            </div>
          )
        })}
      </div>

      <div className={styles.cntFoto}>
        <ProgresoTU porcentaje={40} />
        <div className={styles.foto}>
          <div className={styles.avatarMask}>
            <img src={fotoPerfil} alt="foto de perfil de usuario" />
          </div>
          <button
            type="button"
            className={styles.lapiz}
            onClick={abrirDialogoFoto}
            aria-label="Cambiar foto de perfil"
          >
            <img src={icoLapiz} alt="" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={styles.cntInfo}>
        <p>Última sesión</p>
        <p>02/10/2025 01:27pm</p>
        <p>Buenos días Alex</p>
        <p>Tu perfil está 40% completado</p>
      </div>

      <hr className={styles.hr} />

      <nav className={styles.cntOpciones}>
        <ul>
          <li>
            <a href="">Mi cuenta</a>
            <img src={any} />
          </li>
          <li>
            <a href="">Mi Perfil</a>
            <img src={any} />
          </li>
          <li>
            <a href="">Vinculación con ANI</a>
            <img src={any} />
          </li>
        </ul>
      </nav>

      <hr className={styles.hr} />

      <div className={styles.cntAccesos}>
        <p>Continúa tu perfil</p>
        <p>Completa tus cuestionarios para mejorar tu perfil</p>
        <div className={styles.cntAccesosLista}>
          {cuestionariosActivos.map((cuestionario) => (
            <ProgresoCuestionario
              key={cuestionario.id}
              cuesTit={cuestionario.titulo}
              porcentaje={cuestionario.porcentaje}
            />
          ))}
        </div>
      </div>

      <div className={styles.cntCierre}>
        <button type="button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>

      {isDialogOpen &&
        createPortal(
          <div className={styles.dialogBackdrop} onClick={cerrarDialogoFoto}>
            <div
              ref={dialogRef}
              tabIndex={-1}
              className={styles.dialogFoto}
              role="dialog"
              aria-modal="true"
              aria-label="Cambiar foto de perfil"
              onClick={(event) => event.stopPropagation()}
            >
              <div className={styles.dialogHeader}>
                <h3>Cambiar foto de perfil</h3>
                <button
                  type="button"
                  className={styles.dialogClose}
                  onClick={cerrarDialogoFoto}
                  aria-label="Cerrar diálogo"
                >
                  <img src={cerrar}/>
                </button>
              </div>

              <div className={styles.dialogUploadRow}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className={styles.inputFile}
                  onChange={onSeleccionarFoto}
                />
                <button
                  ref={dialogFirstActionRef}
                  type="button"
                  className={styles.btnUpload}
                  onClick={() => fileInputRef.current?.click()}
                >
                  cargar archivos
                </button>
                <span className={styles.archivoNombre}>{nombreArchivo || 'Foto_Perfil_02.png'}</span>
              </div>

              <div className={styles.cropFrame}>
                <Cropper
                  image={sourceImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={(value) => {
                    setZoom(value)
                    setZoomPercent(zoomToPercent(value))
                  }}
                  onCropComplete={onCropComplete}
                  objectFit="cover"
                  minZoom={MIN_ZOOM}
                  maxZoom={MAX_ZOOM}
                  style={{
                    mediaStyle: {opacity: 1, blur:"12px"},
                    containerStyle: {
                      bacground: 'rgba(0,0,0, 0.7)'
                    }
                  }}
                />
                <div className={styles.cropBlurOverlay} aria-hidden="true" />
              </div>

              <div className={styles.dialogFooter}>
                <div className={styles.zoomControl}>
                  <button
                    type="button"
                    className={styles.zoomBtn}
                    onClick={() => {
                      const nextPercent = Math.max(0, zoomPercent - 5)
                      setZoomPercent(nextPercent)
                      setZoom(percentToZoom(nextPercent))
                    }}
                  >
                  <img src={resta} alt="Alejar imagen"/>
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={zoomPercent}
                    onChange={(e) => {
                      const nextPercent = Number(e.target.value)
                      setZoomPercent(nextPercent)
                      setZoom(percentToZoom(nextPercent))
                    }}
                  />
                  <button
                    type="button"
                    className={styles.zoomBtn}
                    onClick={() => {
                      const nextPercent = Math.min(100, zoomPercent + 5)
                      setZoomPercent(nextPercent)
                      setZoom(percentToZoom(nextPercent))
                    }}
                  >
                    <img src={suma} alt="Acercar imagen"/>
                  </button>
                </div>
                <div className={styles.dialogAcciones}>
                  <button type="button" className={styles.btnSecundario} onClick={cerrarDialogoFoto}>
                    Cancelar
                  </button>
                  <button type="button" className={styles.btnPrimario} onClick={guardarNuevaFoto}>
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}

export default TarjetaLateral
