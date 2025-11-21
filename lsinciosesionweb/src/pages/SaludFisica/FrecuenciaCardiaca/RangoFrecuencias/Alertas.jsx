import React from 'react'
import styles from './Alertas.module.css'

import iconRojo from "./icoRojo.svg";
import icoAzul from "./icoAzul.svg";

const Alertas = ({txtA, icono, txtB }) => {
  return (
    <div className={styles.Alertas}>
      <p></p>
      <img src={icono} alt="Alerta"></img>
      <p>{txtA}</p>
      <p>{txtB}</p>
    </div>
  )
}

export default Alertas
