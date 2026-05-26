import React from 'react'
import styles from './historial.module.css';
import Principal from '@/Layout/Principal';
import TarjetaBienestar from '@/components/Tarjetas/TarjetaBienestar/TarjetaBienestar';
const Historial = () => {
  return (
    <Principal>
      <h1 className={styles.tit}>Historial Page</h1>
      <TarjetaBienestar></TarjetaBienestar>
    </Principal>
  )
}

export default Historial
