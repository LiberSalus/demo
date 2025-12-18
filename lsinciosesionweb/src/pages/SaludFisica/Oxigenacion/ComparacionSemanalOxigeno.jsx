import React from "react";
import styles from "./ComparacionSemanalOxigeno.module.css";

const ComparacionSemanalOxigeno = ({
  promedioActual = null,
  promedioAnterior = null,
}) => {
  const hayDatos =
    promedioActual !== null &&
    promedioAnterior !== null &&
    promedioActual !== undefined &&
    promedioAnterior !== undefined;

  let icono = "–";
  let color = "#6b7280"; // gris
  let textoDiff = "Sin datos";

  if (hayDatos) {
    const diferencia = promedioActual - promedioAnterior;

    if (diferencia > 0) {
      icono = "↑";
      color = "#16a34a"; // verde
      textoDiff = `+${diferencia.toFixed(1)} %`;
    } else if (diferencia < 0) {
      icono = "↓";
      color = "#dc2626"; // rojo
      textoDiff = `${diferencia.toFixed(1)} %`;
    } else {
      icono = "✓";
      color = "#0f766e"; // verde azulado
      textoDiff = "Sin cambio";
    }
  }

  return (
    <div className={styles.ComparacionSemanalOxigeno}>
      <p>Comparación semanal</p>

      <div className={styles.info}>
        <p>
          SpO<span className={styles.sub}>2</span>
        </p>

        <p>
          Actual
          <br />
          <span className={styles.valor}>
            {hayDatos ? `${promedioActual.toFixed(1)} %` : "--"}
          </span>
        </p>

        <p>
          Semana anterior
          <br />
          <span className={styles.valor}>
            {hayDatos ? `${promedioAnterior.toFixed(1)} %` : "--"}
          </span>
        </p>

        <p style={{ color }}>{icono}</p>
        <p style={{ color }}>{textoDiff}</p>
      </div>
    </div>
  );
};

export default ComparacionSemanalOxigeno;
