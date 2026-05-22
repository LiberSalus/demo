// mesat/src/components/RangoFrecuencias/RegistroAlertas.jsx
import React from "react";
import styles from "./RegistroAlerta.module.css";

const formatRangoDia = (minDia, maxDia) => {
  if (typeof minDia !== "number" || typeof maxDia !== "number") {
    return "-- -- ppm";
  }
  return `${maxDia} - ${minDia} ppm`;
};

const formatValor = (valor) => {
  if (typeof valor !== "number") return "-- -- ppm";
  return `${valor} ppm`;
};

const RegistroAlertas = ({ minDia, maxDia, alertaAlta, alertaBaja }) => {
  return (
    <div className={styles.RegistroAlertas}>
      <div className={styles.rango}>
        <p>Rango de frecuencia cardiaca</p>
        <p>{formatRangoDia(minDia, maxDia)}</p>
      </div>
      <div className={styles.rango}>
        <p>Alerta de frecuencia cardiaca alta</p>
        <p>{formatValor(alertaAlta)}</p>
      </div>
      <div className={styles.rango}>
        <p>Alerta de frecuencia cardiaca baja</p>
        <p>{formatValor(alertaBaja)}</p>
      </div>
    </div>
  );
};

export default RegistroAlertas;
