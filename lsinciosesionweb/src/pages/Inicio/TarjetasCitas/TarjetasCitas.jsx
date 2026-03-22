import React, { useMemo } from "react";
import dayjs from "dayjs";
import TarjetaCita from "./TarjetaCita";
import styles from "./TarjetasCitas.module.css";
import { buildTarjetasCitas } from "../Calendario/citasUtils";
import { citas } from "./datosCita";

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

      {citas.length === 0 && (
        <div style={{ padding: "3.5rem 3rem", color: "#94A3B8", fontSize: 13, textAlign: "center" }}>
          No hay medicamentos para este día.
        </div>
      )}
    </div>
  );
};

export default TarjetasCitas;
