import React from 'react'
import styles from './Boton.module.css'

const Loader = () => {

    const Carga = ({ count = 8 }) => {
      return (
        <div className={styles.Carga}>
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} className={styles.palitos}></span>
          ))}
        </div>
      )
    }


  return (
    <div>
      <Carga />
    </div>
  )
}

export default Loader
