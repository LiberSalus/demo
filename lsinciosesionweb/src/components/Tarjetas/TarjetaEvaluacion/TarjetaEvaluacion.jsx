import React from "react";
import styles from "./tarjetaEvaluacion.module.css";

// Tarjeta de evaluación de un cuestionario con gráfica circular de progreso.
// Uso: <TarjetaEvaluacion titulo="GAD-7" resultado="Ansiedad leve" percent={65}
//        estado="En proceso" onContinuar={() => navigate(...)} />
const TarjetaEvaluacion = ({
  titulo = "Mi Evaluación",
  nombreCuestionario = "Cuestionario",
  resultado = "",
  percent = 0,
  estado = "En proceso",
  descripcion = "Completa tu cuestionario para obtener resultados",
  onContinuar,
  etiquetaBoton = "Continuar respondiendo",
}) => {
  const pct = Math.max(0, Math.min(100, Number(percent) || 0));

  return (
    <div className={styles.cntTarjetaEvaluacion}>
      <div className={styles.cntInfo}>
        <div className={styles.cntTxt}>
          <h3>{titulo}</h3>
          <p className={styles.nombreCuestionario}>{nombreCuestionario}</p>
          {resultado && <p className={styles.resultado}>{resultado}</p>}
          <p className={styles.descripcion}>{descripcion}</p>
        </div>
        <div className={styles.cntGrafica}>
          <div
            className={styles.grafica}
            style={{ "--pct": `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span className={styles.valor}>{pct}%</span>
          </div>
          <p>Progreso</p>
        </div>
      </div>

      <div className={styles.cntEstado}>
        <div className={styles.cntDesc}>
          <p className={styles.estadoLabel}>Estado de la Evaluación</p>
          <p className={styles.estadoValor}>{estado}</p>
        </div>
        {onContinuar && (
          <div className={styles.cntBtn}>
            <button className={styles.btn} onClick={onContinuar}>
              <span>{etiquetaBoton}</span>
              <span className={styles.flecha} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TarjetaEvaluacion;
