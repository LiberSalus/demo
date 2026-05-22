import React from 'react'
import styles from './ValoresReferencia.module.css'

import arriba from '../assets/icoArriba.svg'
import abajo  from '../assets/icoAbajo.svg'
import paloma from '../assets/icoPaloma.svg'

const ValoresReferencia = () => {
  return (
    <div className={styles.ValoresReferencia}>
      <p>Valores de referencia</p>

      <div className={styles.referencias}>
        <div className={styles.valores}>
          <p>Mayor a 120</p>
        <p>101 - 120</p>
        <p>60 - 100</p>
        <p>Menor a 60</p>
        </div>
        <div className={styles.nombres}>
          <p>Taquicardia (Severa)</p>
          <p>Taquicardia (Leve)</p>
          <p>Frecuencia cardiaca normal</p>
          <p>Bradicardia</p>
        </div>
        <div className={styles.iconos}>
          <img src={arriba} alt="Referencia alta"/>
          <img src={arriba} alt="Referencia leve"/>
          <img src={paloma} alt="Referencia normal"/>
          <img src={abajo}  alt="Referencia baja"/>
        </div>
      </div>
    </div>
  )
}

export default ValoresReferencia
