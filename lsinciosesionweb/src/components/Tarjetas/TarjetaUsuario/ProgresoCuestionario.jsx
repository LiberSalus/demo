import React, { useMemo } from 'react'
import styles from './progresoCuestionario.module.css'

const ProgresoCuestionario = ({ porcentaje, cuesTit }) => {

  // 1) % de avance (clamp)
  const p = Math.max(0, Math.min(100, porcentaje));

  // 2) valores de stroke-dasharray (track y progreso)
  const dashProgress = useMemo(() => `${p} ${100 - p}`, [p]);       // ej. "25 75"

  return (
    <div className={styles.cntTrjCuesAvance}>
      <p>{cuesTit}</p>
      <div className={styles.cntProgreso}>
        <svg viewBox='0 0 290 15' preserveAspectRatio="xMidYMid meet" style={{ width: "85%", height: "100%" }} className={styles.progreso}>
          <line
            x1="5" y1="7.5" x2="205" y2="7.5"
            stroke="#ececec"
            strokeWidth={10}
            strokeDasharray="100"
            pathLength="100"
            strokeLinecap='round' />
          <line
            x1="5" y1="7.5" x2="205" y2="7.5"
            stroke="#007CBA"
            strokeWidth={10}
            strokeDasharray={dashProgress}
            pathLength="100"
            strokeLinecap='round'
            style={{ transition: "stroke-dasharray 2.95s ease, stroke-dashoffset 2.95s ease-out" }} />

        </svg>
        <p>{porcentaje} %</p>
      </div>
      <a href="">Continuar</a>
    </div>
  )
}

export default ProgresoCuestionario