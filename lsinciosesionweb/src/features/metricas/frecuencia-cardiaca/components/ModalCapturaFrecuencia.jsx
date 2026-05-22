import React from 'react'
import styles from './ModalCapturaFrecuencia.module.css'
import cerrar from '../assets/icoCerrar.svg'

const formatearFechaHoraVisual = (fechaHoraISO) => {
  if (!fechaHoraISO) return '--'
  const fecha = new Date(fechaHoraISO)
  const dia = String(fecha.getDate()).padStart(2, '0')
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const anio = fecha.getFullYear()
  const hora = String(fecha.getHours()).padStart(2, '0')
  const minuto = String(fecha.getMinutes()).padStart(2, '0')
  return `${dia}/${mes}/${anio} ${hora}:${minuto}`
}

const ModalCapturaFrecuencia = ({
  abierto,
  fechaHoraISO,
  ppmCaptura,
  fueActividad,
  mensajeError,
  onPpmChange,
  onFueActividadChange,
  onCerrar,
  onAceptar,
}) => {
  if (!abierto) return null

  return (
    <div className={styles.overlay} role="presentation" onClick={onCerrar}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Ingresa tus datos"
        onClick={(evento) => evento.stopPropagation()}
      >
        <button type="button" className={styles.botonCerrar} onClick={onCerrar}>
          <img src={cerrar} alt="Cerrar"/>
        </button>

        <p className={styles.titulo}>Ingresa tus datos</p>

        <div className={styles.fila}>
          <span>Fecha y hora:</span>
          <strong>{formatearFechaHoraVisual(fechaHoraISO)}</strong>
        </div>

        <div className={styles.fila}>
          <label htmlFor="ppm-captura">Pulsaciones por minuto:</label>
          <input
            id="ppm-captura"
            type="number"
            min="0"
            step="1"
            value={ppmCaptura}
            onChange={(evento) => onPpmChange(evento.target.value)}
          />
            <span className={styles.ppm}>ppm</span>
          
        </div>

        <div className={styles.fila}>
          <label htmlFor="actividad-captura">¿Realizaste alguna <br/> actividad fisica?</label>
          <input
            id="actividad-captura"
            type="checkbox"
            checked={fueActividad}
            onChange={(evento) => onFueActividadChange(evento.target.checked)}
          />
        </div>

        <div className={styles.indicaciones}>
          <p>Indicaciones:</p>
          <p>Mide tu frecuencia cardiaca manualmente</p>
          <ol>
            <li>Coloca dos dedos (índice y medio) sobre tu muñeca o cuello.</li>
            <li>Cuenta los latidos durante 15 segundos.</li>
            <li>Multiplica tu resultado por 4.</li>
          </ol>
        </div>

        <button type="button" className={styles.botonAceptar} onClick={onAceptar}>
          Aceptar
        </button>

        {mensajeError ? <p className={styles.mensajeError}>{mensajeError}</p> : null}
      </div>
    </div>
  )
}

export default ModalCapturaFrecuencia
