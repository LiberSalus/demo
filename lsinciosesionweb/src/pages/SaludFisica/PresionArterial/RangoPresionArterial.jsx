// mesat/src/components/PresionArterial/RangoPresionArterial.jsx
import React from "react";
import styles from "./RangoPresionArterial.module.css";

import presion from "./icoPresionArterial.svg";

const RangoPresionArterial = ({
  sistolica = null,
  diastolica = null,
}) => {
  
  const mostrar = sistolica !== null && diastolica !== null;

  return (
    <div className={styles.RangoPresionArterial}>
      <div className={styles.info}>
        <p>Rango de presión arterial</p>

        {mostrar ? (
          <p>
            {sistolica} - {diastolica}{" "}
            <span>mmHg</span>
          </p>
        ) : (
          <p className={styles.sinDatos}>
            Sin registro
          </p>
        )}
      </div>

      <div className={styles.cntIco}>
        <img
          className={styles.ico}
          src={presion}
          alt="Presión Arterial"
        />
      </div>
    </div>
  );
};

export default RangoPresionArterial;
