import React from 'react'
import styles from './tarjetaBienestar.module.css'
import { NavLink } from 'react-router-dom'

const TarjetaBienestar = () => {
  return (
    <div className={styles.cntTarjetaBienestar}>
        <p>Áreas de Bienestar</p>
        <div className={styles.cntAccesos}>
            <NavLink className={styles.link} to="/cuestionarios/fisico">Bienestar físico</NavLink>
            <NavLink className={styles.link} to="/cuestionarios/mental">Bienestar mental</NavLink>
            <NavLink className={styles.link} to="/cuestionarios/social">Bienestar social</NavLink>
            <NavLink className={styles.link} to="/cuestionarios/nutricional">Bienestar nutricional</NavLink>
        </div>
    </div>
  )
}

export default TarjetaBienestar
