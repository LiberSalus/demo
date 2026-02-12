import React, { useMemo } from "react";
import styles from "./progresoTarjeta.module.css";

const ProgresoTarjeta = ({ porcentaje }) => {
  porcentaje = Math.round(porcentaje);
  const p = Math.max(0, Math.min(100, porcentaje));
  const progresoVisible = (p * 80) / 100; // escala el % al rango 0–80

  const dashProgress = useMemo(
    () => `${progresoVisible} ${100 - progresoVisible}`,
    [progresoVisible],
  );

  return (
    <div className={styles.cntProgreso}>
      {[
        <svg
          key="svg-progreso"
          viewBox="0 0 290 290"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: "100%", height: "100%" }}
          className={styles.progreso}
        >
          <defs>
            <marker
              id="circle-end"
              markerWidth="10"
              markerHeight="10"
              refX="5"
              refY="5"
            >
              <circle cx="5" cy="5" r="4" fill="blue" />
            </marker>
          </defs>

          <circle
            cx="145"
            cy="145"
            r="125"
            fill="none"
            stroke="#e8e6e6ff"
            strokeWidth="2rem"
            strokeDasharray="80 20"
            pathLength="100"
            transform="rotate(0)"
            style={{ transformOrigin: "50% 50%" }}
          />

          <circle
            cx="145"
            cy="145"
            r="125"
            fill="none"
            stroke="#007CBA"
            strokeWidth="2rem"
            strokeDasharray={dashProgress}
            pathLength="100"
            markerEnd="url(#circle-end)"
            className={styles.progresoLinea}
            style={{
              transition:
                "stroke-dasharray 2.95s ease, stroke-dashoffset 2.95s ease-out",
            }}
          />

          <rect />
        </svg>,

        <p key="txt-progreso" className={styles.prstxt}>
          {porcentaje} %
        </p>,
      ]}
    </div>
  );
};

export default ProgresoTarjeta;
