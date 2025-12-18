import React from "react";
import styles from "./rangoOxigenacion.module.css";
import oxigen from "./icoOxigenacion.svg";

const RangoOxigenacion = ({ oxi }) => {
  const hayDato = oxi !== null && oxi !== undefined;

  return (
    <div className={styles.RangoOxigenacion}>
      <div className={styles.info}>
        <p>Rango de Oxigenación</p>
        {hayDato ? (
          <p>
            {oxi} % - {oxi + 3} %
          </p>
        ) : (
          <p>Sin registro</p>
        )}
      </div>
      <div className={styles.cntIco}>
        <img className={styles.ico} src={oxigen} alt="Presión Arterial" />
      </div>
    </div>
  );
};


export default RangoOxigenacion;
