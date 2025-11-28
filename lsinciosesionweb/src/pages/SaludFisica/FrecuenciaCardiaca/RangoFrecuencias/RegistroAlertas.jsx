// mesat/src/components/RangoFrecuencias/RegistroAlertas.jsx
import React from "react";
import styles from "./RegistroAlerta.module.css";

import arriba from "./icoFlechaRojaArr.svg";
import abajo from "./icoFlechaRojaAba.svg";
import paloma from "./icoPaloma.svg";

const formatRangoDia = (minDia, maxDia) => {
  if (typeof minDia !== "number" || typeof maxDia !== "number") {
    return "-- -- ppm";
  }
  return `${minDia} - ${maxDia} ppm`;
};

const formatValor = (valor) => {
  if (typeof valor !== "number") return "-- -- ppm";
  return `${valor} ppm`;
};

const RegistroAlertas = ({ minDia, maxDia, alertaAlta, alertaBaja }) => {
  return (
    <div className={styles.RegistroAlertas}>
      {/* <div className={styles.rango}>
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
      </div> */}

      <p className={styles.tit}>Rangos de frecuencia cardiaca</p>
      <div className={styles.container}>
        <div className={styles.cntValores}>
          <p> {`>`} 100</p>
          <p>80 - 100</p>
          <p> {`< `} 80</p>
        </div>
        <div className={styles.cntDescrip}>
          <p>Taquicardia</p>
          <p>Frecuencia cardiaca normal</p>
          <p>Bradicardia</p>
        </div>
        <div className={styles.icos}>
          <img src={arriba} alt="Frecuencia cardiaca alta" />
          <img src={paloma} alt="Frecuencia cardiaca estable" />
          <img src={abajo} alt="Frecuencia cardiaca baja" />
        </div>
      </div>
    </div>
  );
};

export default RegistroAlertas;
