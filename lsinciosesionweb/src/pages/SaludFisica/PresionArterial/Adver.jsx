//mesat\src\components\PresionArterial\Adver.jsx
import React from 'react'
import styles from './Adver.module.css'

import bien from './icobien.svg'
import cuidado from './icoCuidado.svg'
import alert from './icoAlert.svg'

const ALERTA = {
  normal: {
      icon: bien,
      alt: "Presion Normal",
      txt1: "Tu presión arterial se mantiene estable",
      txt2: "Buen trabajo, estas procuroando tu bienestar",
    },
    alerta: {
      icon: alert,
      alt: "Presion Preventiva",
      txt1: "Tu presión arterial debe mantenerse estable",
      txt2: "Procura tu presión para mantenerte dentro de parametros",
      
    },
    cuidado: {
      icon: cuidado,
      alt: "Cuidado, presion fuera de rangos",
      txt1: "Tu presión arterial esta fuera del rango promedio",
      txt2: "Pude variar por tension emocional café o ejercicio reciente",
    },
}

const Adver = ({estado="normal", className=""}) => {

  const config = ALERTA[estado] ?? ALERTA.normal;
  const { icon, alt, txt1, txt2 } =config;

  return (
    <div className={styles.Adver}>
      <img src={icon} alt={alt}></img>
      <p>{txt1}</p>
      <p>{txt2}</p>
    </div>
  )
}

export default Adver
