import React from 'react'
import styles from './MarcoTarjeta.module.css'

const MarcoTarjeta = ({ children }) => {
  return (
    <div className={styles.MarcoTarjeta}>
      { children }
    </div>
  )
}

export default MarcoTarjeta
