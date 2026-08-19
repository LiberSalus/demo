import React from 'react'
import styles from './TarjetasAreas.module.css'
import TarjetaAreaCard from './TarjetaAreaCard'

const TarjetaAreas = () => {
  return (
    <div className={styles.cntTarjetaAreas}>
      <h3>Áreas de la salud</h3>

      <div className={styles.cntCards}>
        <TarjetaAreaCard area="fisico" />
        <TarjetaAreaCard area="emocional" />
        <TarjetaAreaCard area="social" />
      </div>

    </div>
  )
}

export default TarjetaAreas
