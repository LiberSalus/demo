import React from "react";
import TarjetaCita from "./TarjetaCita";
import { citas } from "./datosCita.js";
import styles from "./TarjetasCitas.module.css";

const TarjetasCitas = () => {
  return (
    <div className={styles.cntTarjetasCitas}>

      <h3>Mis Citas</h3>
      {citas.map((cita) => (
        <TarjetaCita key={cita.id} {...cita} />
      ))}
    </div>
  );
};

export default TarjetasCitas;
