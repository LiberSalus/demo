import React, {useMemo} from "react";
import styles from "./botonesQs.module.css";
import { ESTADOSQS } from "./estadosQs.config";

/* iconos BonoesQs */

import btnCompletado from "./btnCompletado.svg";
import btnProgreso from "./btnProgreso.svg";
import btnHabilitado from "./btbHabilitado.svg";
import btnBloqueado from "./btnBloqueado.svg";

const BotonesQs = ({titulo, edoQs, av, activo, onClick}) => {

  let porcentaje = av;

  const BarraProgreso = ({porcentaje}) => {

    // 1) % de avance (clamp)
      const p = Math.max(0, Math.min(100, porcentaje));
    
      // 2) valores de stroke-dasharray (track y progreso)
      const dashProgress = useMemo(() => `${p} ${100 - p}`, [p]);


    return (
      <div className={styles.cntBarraProgreso}>
        <svg
          viewBox="0 0 290 15"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: "90%", height: "100%" }}
          className={styles.progreso}
        >
          <line
            x1="5"
            y1="7.5"
            x2="205"
            y2="7.5"
            stroke="#ececec"
            strokeWidth={10}
            strokeDasharray="100"
            pathLength="100"
            strokeLinecap="round"
          />
          <line
            x1="5"
            y1="7.5"
            x2="205"
            y2="7.5"
            stroke="#007CBA"
            strokeWidth={10}
            strokeDasharray={dashProgress}
            pathLength="100"
            strokeLinecap="round"
            style={{
              transition:
                "stroke-dasharray 2.95s ease, stroke-dashoffset 2.95s ease-out",
            }}
          />
        </svg>
        <p className={styles.val}>{porcentaje} %</p>
      </div>
    );
  };

  const estadoQs = ESTADOSQS[edoQs];

  const texto = (estado) => {
    switch (estado) {
      case "edo1":
        return <p>Completado el: DD/MM/AAAA</p>;
      case "edo2":
        return <BarraProgreso porcentaje={porcentaje} />;
      case "edo3":
        return <p>Puedes comenzar con otros cuestionarios</p>;
      case "edo4":
        return <p>Primero debes terminar otros cuestionarios</p>;
      default:
        return null;
    }
  };

  const icono = (estado) => {
    switch (estado) {
      case "edo1":
        return <img src={btnCompletado} alt="Cuestionario Completado" />;
      case "edo2":
        return <img src={btnProgreso} alt="Cuestionario en Progreso" />;
      case "edo3":
        return <img src={btnHabilitado} alt="Cuestionario Habilitado" />;
      case "edo4":
        return <img src={btnBloqueado} alt="Cuestionario Bloqueado" />;
      default:
        return null;
    }
  };

   const btnbg = (estado) => {
    switch (estado) {
      case "edo1": return "rgba(98, 210, 71, 0.2)";
      case "edo2": return "rgba(0, 124, 186, 0.2)";
      case "edo3": return "rgba(255, 255, 255, 0.35)"
      case "edo4": return "rgba(0, 0, 0, 0.1)";
      default: "transparent";
        return null;
    }
  };
   const brdcolor = (estado) => {
    switch (estado) {
      case "edo1": return "#62D247";
      case "edo2": return "#007CBA";
      case "edo3": return "#D3D3D3"
      case "edo4": return "#D3D3D3";
      default: "transparent";
        return null;
    }
  };

  return (
    <div 
    onClick={onClick}
    style={{backgroundColor:btnbg(edoQs)}}
    className={`${styles.cntBotonesQs} ${styles[edoQs] || ""} ${activo ? styles.activo : ""}`}
>
      <div 
      className={styles.info}
      style={{borderColor:brdcolor(edoQs)}}
      >
        <p className={styles.titulo}>{titulo || "Cuestionario"}</p>
        {texto(edoQs)}
      </div>
      <div className={styles.icono}>{icono(edoQs)}</div>
    </div>
  );
};

export default BotonesQs;
