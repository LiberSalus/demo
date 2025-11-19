import React from 'react'
import styles from './TarjetaNoticias.module.css'
import news from './news1.png'
const TarjetaNoticias = () => {

  return (
    <div className={styles.TarjetaNoticias}>
      <div className={styles.cntImg}>
        <img src={news} alt="news" />
      </div>
      <div className={styles.cntInfo}>
      <h3>El empleo en el sector farmacéutico crece.</h3>
      <p>Este crecimiento supone un aumento del 37 por ciento respecto a 2019, el año antes de la pandemia.</p>  
      </div>
    </div>
  )
}


export default TarjetaNoticias