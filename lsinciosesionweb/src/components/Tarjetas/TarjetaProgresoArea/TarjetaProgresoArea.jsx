import React from "react";
import styles from "./tarjetaProgresoArea.module.css";

// Tarjeta de seguimiento de progreso por área.
// Uso: <TarjetaProgresoArea titulo="Bienestar Físico" percent={65} />
const TarjetaProgresoArea = ({
  titulo = "Seguimiento por Área",
  subtitulo = "Progreso de cuestionarios por Área",
  percent = 0,
  mensaje = "Sigue completando tus cuestionarios para conocer mejor tu bienestar.",
}) => {
  const pct = Math.max(0, Math.min(100, Number(percent) || 0));

  return (
    <div className={styles.cntTarjetaProgresoArea}>
      <p className={styles.titulo}>{titulo}</p>
      <p className={styles.subtitulo}>{subtitulo}</p>
      <div className={styles.barra} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className={styles.progreso} style={{ width: `${pct}%` }} />
      </div>
      <p className={styles.porcentaje}>{pct}%</p>
      <p className={styles.mensaje}>{mensaje}</p>
    </div>
  );
};

export default TarjetaProgresoArea;
