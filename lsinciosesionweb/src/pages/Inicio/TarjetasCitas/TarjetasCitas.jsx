import React, { useMemo } from "react";
import TarjetaCita from "./TarjetaCita";
import styles from "./TarjetasCitas.module.css";
import { buildTarjetasCitas } from "../Calendario/citasUtils";

const TarjetasCitas = ({ citasPorFecha = {} }) => {

  

  const tarjetas = useMemo(
    () => buildTarjetasCitas(citasPorFecha),
    [citasPorFecha]
  );

  return (
    <div className={styles.cntTarjetasCitas}>
      {tarjetas.map((cita) => (
        <TarjetaCita key={cita.id} {...cita} />
      ))}
    </div>
  );
};

export default TarjetasCitas;
