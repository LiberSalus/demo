//mesat\src\components\Oxigenacion\AdverOxigeno.jsx
import React from "react";
import styles from "./AdverOxigeno.module.css";

import bien from "./icobien.svg";
import cuidado from "./icoCuidado.svg";
import alert from "./icoAlert.svg";

const ALERTA = {
  normal: {
    icon: bien,
    alt: "Oxigenación Normal",
    txt1: "Tu Oxigenacion en sangre se mantiene estable",
    txt2: "Buen trabajo, estas procuroando tu bienestar",
  },
  alerta: {
    icon: alert,
    alt: "Oxigenación Preventiva",
    txt1: "Tu Oxigenación debe mantenerse estable",
    txt2: "Procura tu presión para mantenerte dentro de parametros",
  },
  cuidado: {
    icon: cuidado,
    alt: "Cuidado, Oxigenación fuera de rangos",
    txt1: "Tu presión arterial esta fuera del rango promedio",
    txt2: "Puede variar por tension emocional café o ejercicio reciente",
  },
};

const AdverOxigeno = ({ estado = "normal", className = "" }) => {
  const config = ALERTA[estado] ?? ALERTA.normal;
  const { icon, alt, txt1, txt2 } = config;

  return (
    <div className={styles.Adver}>
      <img src={icon} alt={alt}></img>
      <p>{txt1}</p>
      <p>{txt2}</p>
    </div>
  );
};

export default AdverOxigeno;
