import React from 'react'
import styles from './ModalConfirmacionFrecuencia.module.css'
import icoFrecuencia from '../assets/icoFrecuencia.svg'

const ModalConfirmacionFrecuencia = ({
  abierto,
  fechaHoraTexto,
  onCerrar,
}) => {
  if (!abierto) return null

  return (
    <div className={styles.overlay} role="presentation" onClick={onCerrar}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Actualizacion de frecuencia cardiaca"
        onClick={(evento) => evento.stopPropagation()}
      >
        <img src={icoFrecuencia} alt= "Frecuencia cardiaca registrada"/>
        <p className={styles.titulo}>Actualizaste tu frecuencia cardiaca correctamente</p>
        <p className={styles.fecha}>{fechaHoraTexto}</p>

        <button type="button" className={styles.botonAceptar} onClick={onCerrar}>
          Aceptar
        </button>
      </div>
    </div>
  )
}

export default ModalConfirmacionFrecuencia
