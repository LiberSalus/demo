import React from 'react'
import styles from './InfoBase.module.css'

import info from './icoInfo.svg'

const InfoBase = () => {
  return (
    <div className={styles.InfoBase}>
      <div className={styles.cntIco}>
        <img src={info} alt="Información Importante"></img>
      </div>
      <div className={styles.cntInfo}>
        <p className={styles.tit}> ¿Qué es la saturación de oxígeno?</p>
        <p className={styles.txt}> 
          Es un parámetro vital para definir el contenido en oxígeno de la sangre y el lanzamiento del oxígeno. Se mide con un oxímetro de pulso.
          <br/><br/>
          Es importante mencionar que hay factores como la edad, el tabaquismo o la altura sobre el nivel del mar que influyen en los niveles de saturación.
        </p>
        <p>* SpO<span className={styles.dos}>2</span>: saturación periférica de oxígeno</p>

      </div>
    </div>
  )
}

export default InfoBase
