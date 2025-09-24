import React from 'react'
import styles from './tarjetaProgresoArea.module.css'

const TarjetaProgresoArea = () => {
  return (
    <div className={styles.cntTarjetaProgresoArea}> 
        <p>Seguimiento por Área</p>
        <p>Progreso de cuestionarios por Área</p>
        <div className={styles.barra}>
            <div className={styles.progreso}></div>
        </div>
        <p>35%</p>
        <p>Texto para agradecer y apoyar al usuario</p>
    </div>
  )
}

export default TarjetaProgresoArea