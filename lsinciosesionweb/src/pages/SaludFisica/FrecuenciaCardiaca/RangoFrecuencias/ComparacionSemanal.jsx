import React from 'react'
import styles from "./ComparacionSemanal.module.css"

const ComparacionSemanal = () => {
  return (
    <div className={styles.ComparacionSemanal}>
      <p>Comparación semanal</p>
      <div className={styles.info}>
        <p>PP media</p>
        <p>Actual<br/><span className={styles.valor}>86 ppm</span></p>
        <p>Semana Anterior<br/><span className={styles.valor}>86 ppm</span></p> 
        <p>↑</p>
        <p>+3</p>
      </div>
    </div>
  )
}

export default ComparacionSemanal
