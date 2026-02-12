import React, { useMemo } from "react";
import styles from "./progresoTU.module.css";

const ProgresoTU = ({ porcentaje }) => {
  const p = Math.max(0, Math.min(100, porcentaje));
  const progresoVisible = (p * 80) / 100; // escala el % al rango 0–80
  const dashProgress = useMemo(
    () => `${progresoVisible} ${100 - progresoVisible}`,
    [progresoVisible]
  );

  const grados = 2.9 * p - 55;

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
            r="142"
            fill="none"
            stroke="#e8e6e6ff"
            strokeWidth=".25rem"
            strokeDasharray="80 20"
            pathLength="100"
            transform="rotate(0)"
            style={{ transformOrigin: "50% 50%" }}
          />

          <circle
            cx="145"
            cy="145"
            r="142"
            fill="none"
            stroke="#007CBA"
            strokeWidth="0.25rem"
            strokeDasharray={dashProgress}
            pathLength="100"
            strokeLinecap="round"
            markerEnd="url(#circle-end)"
            className={styles.progresoLinea}
            style={{
              transformOrigin: "50% 50%",
              transition:
                "stroke-dasharray 2.95s ease, stroke-dashoffset 2.95s ease-out",
            }}
          />

          <rect />
        </svg>,

        <div
          key="bola-progreso"
          className={styles.bola}
          style={{ transform: `rotate(${grados}deg)` }}
        />,
      ]}
    </div>
  );
};

export default ProgresoTU;
