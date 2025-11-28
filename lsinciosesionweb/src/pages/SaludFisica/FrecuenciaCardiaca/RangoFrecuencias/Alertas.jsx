// src/pages/SaludFisica/FrecuenciaCardiaca/RangoFrecuencias/Alertas.jsx
import React from "react";
import styles from "./Alertas.module.css";

import iconRojo from "./icoRojo.svg";
import iconAzul from "./icoAzul.svg";

const Alertas = ({ fueraDeRango, minDia, maxDia }) => {
  const icono = fueraDeRango ? iconRojo : iconAzul;

  // Textos placeholder: tus compas de salud luego los ajustan
  const titulo = fueraDeRango
    ? "Tu frecuencia cardiaca está fuera del rango recomendado."
    : "Tu frecuencia cardiaca se encuentra dentro del rango recomendado.";

  const detalle = fueraDeRango
    ? "Podría deberse a estrés o falta de sueño."
    : "Sigue monitoreando tu frecuencia cardiaca de forma regular.";

  const rangoTxt =
    typeof minDia === "number" && typeof maxDia === "number"
      ? `${minDia} - ${maxDia} ppm`
      : "Sin datos suficientes para hoy.";

  return (
    <div className={styles.Alertas}>
      <div className={styles.iconWrapper}>
        <img src={icono} alt="Estado de alerta" />
      </div>

      <p className={styles.titulo}>{titulo}</p>

      <p className={styles.detalle}>{detalle}</p>

      {/* <p className={styles.rango}>Rango: <span className={styles.valor}>{rangoTxt}</span></p> */}
    </div>
  );
};

export default Alertas;

