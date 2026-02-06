import React, { useMemo } from "react";
import dayjs from "dayjs";
import TarjetaCita from "./TarjetaCita";
import styles from "./TarjetasCitas.module.css";
import { buildTarjetasCitas } from "../Calendario/citasUtils";

const TarjetasCitas = ({ citasPorFecha = {}, day, onOpenCita }) => {
  const key = useMemo(
    () => (day ? dayjs(day).format("YYYY-MM-DD") : null),
    [day]
  );

  const citasDelDia = useMemo(() => {
    if (!key) return {};
    return { [key]: citasPorFecha?.[key] ?? [] };
  }, [citasPorFecha, key]);

  const tarjetas = useMemo(
    () => buildTarjetasCitas(citasDelDia),
    [citasDelDia]
  );

  return (
    <div className={styles.cntTarjetasCitas}>
      {tarjetas.map((cita) => (
        <TarjetaCita
          key={cita.id}
          {...cita}
          onClick={() => onOpenCita?.(cita)}
        />
      ))}
    </div>
  );
};

export default TarjetasCitas;
