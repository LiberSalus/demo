// mesat/src/components/RangoFrecuencias/RangoFrecuencias.jsx
import React from 'react'
import styles from "./RangoFrecuencias.module.css";
import "./FrecuenciaAmina.css"

import IconFrecuencia from "./icoFrecuencia.svg?react";

const RangoFrecuencias = ({ minDia, maxDia }) => {
  const formatRango = () => {
    if (typeof minDia !== "number" || typeof maxDia !== "number") {
      return "-- -- bpm";
    }
    return `${minDia} - ${maxDia} bpm`;
  };

  return (
    <div className={styles.RangoFrecuencias}>
      <div className={styles.txt}>
        <p>Rango de frecuencia cardiaca</p>
        <p>{formatRango()}</p>
      </div>

      <div className={styles.icon}>
        <IconFrecuencia />
      </div>
    </div>
  )
}

export default RangoFrecuencias
