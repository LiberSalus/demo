import React from "react";
import styles from "./ActualizacionPresion.module.css";

import presion from "./icoPresionArterial.svg";

const ActualizacionPresion = () => {
  return (
    <div className={styles.ActualizacionPresion}>
      <img src={presion} className={styles.icono}></img>
      <p>
        Actualizaste tu presion arterial
        <br /> correctamente
      </p>
      <p>19/11/2025 - 03:46pm</p>

      <button className={styles.btnPri} type="button"> Aceptar
      </button>
    </div>
  );
};

export default ActualizacionPresion;
