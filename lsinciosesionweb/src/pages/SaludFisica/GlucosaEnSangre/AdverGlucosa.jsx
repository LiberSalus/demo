import React from 'react'
import styles from './AdverGlucosa.module.css'


import bien from "./icobien.svg";
import cuidado from "./icoCuidado.svg";
import alert from "./icoAlert.svg";


const ALERTA = {
  normal: {
    icon: bien,
    alt: "Glucosa Normal",
    txt1: "Tu Glucosa en sangre se mantiene estable",
    txt2: "Buen trabajo, estas procuroando tu bienestar",
  },
  alerta: {
    icon: alert,
    alt: "Glucosa Preventiva",
    txt1: "Tu Glucosa debe mantenerse estable",
    txt2: "Procura tu Glucosa para mantenerte dentro de parametros",
  },
  cuidado: {
    icon: cuidado,
    alt: "Cuidado, Glucosa fuera de rangos",
    txt1: "Tu Glucosa esta fuera del rango promedio",
    txt2: "Puede variar por xxxxxxxx xxxxxx xxxx xxx xxx",
  },
};


const AdverGlucosa = ({ estado = "normal", className = "" }) => {
  const config = ALERTA[estado] ?? ALERTA.normal;
  const { icon, alt, txt1, txt2 } = config;

  return (
    <div className={styles.AdverGlucosa}>
      <img src={icon} alt={alt}></img>
      <p>{txt1}</p>
      <p>{txt2}</p>
    </div>
  );
};

export default AdverGlucosa
