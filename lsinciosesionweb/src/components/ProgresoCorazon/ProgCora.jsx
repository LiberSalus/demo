import React from "react";
import styles from "./ProgCora.module.css";
import cora from './icoCora.svg'

const ProgCora = ({porcentaje=100}) => {

  let grados = 2.8 * porcentaje - 140;

  return (
    <div className={styles.ProgCora}>
      <svg
        viewBox="0 0 110 110"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%" }}
        className={styles.progreso}
      >
        <defs >
          <linearGradient
            id="gradiente"
            x1="100%"
            y1="100%"
            x2="0%"
            y2="0%"
            
          >
            <stop offset="0%" stopColor="#FD8D8D" />
            <stop offset="22%" stopColor="#FD8D8D" />
            <stop offset="47%" stopColor="#F6E68B" />
            <stop offset="55%" stopColor="#F6E68B" />
            <stop offset="76%" stopColor="#98DBD3" />
            <stop offset="100%" stopColor="#98DBD3" />
          </linearGradient>
        </defs>

        <circle
          cx="55"
          cy="55"
          r="45"
          fill="none"
          stroke="url(#gradiente)"
          strokeWidth=".65rem"
          strokeDasharray="75 25"
          pathLength="100"
          transform="rotate(135) translate(-57.5 -130)"
          transformOrigin="50%"
          strokeLinecap="round"
        />
      </svg>
      <img className={styles.cora} src={cora} alt="Tu salud Actual"/>
      <div 
      className={styles.indicador}
      style={{transform:`rotate(${grados}deg)`}}
      ></div>

    </div>
  );
};

export default ProgCora;
