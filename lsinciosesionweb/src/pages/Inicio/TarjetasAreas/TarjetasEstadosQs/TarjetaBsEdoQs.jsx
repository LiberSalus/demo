import React from "react";
import styles from "./tarjetaBsEdoQs.module.css";
import paloma from "./palomaV.svg";
import habilitado from './habilitado.svg'
import bloqueado from './bloqueado.svg'
import confetti from "./confetti.svg";
import ProgresoTarjeta from "./ProgresoTarjeta";
import { ESTADOSQS } from "./estadosQs.config";

// estados de tarjetas:
// edo1: completado
// edo2: iniciado
// edo3: no iniciado
// edo4: bloqueado

const TarjetaBsEdoQs = ({
  titQs,
  desQs,
  edoQs,//codigo
  n_items = 0,
  n_responses = 0
}) => {
  const estadoQs = ESTADOSQS[edoQs]

  console.warn("mi estadoQs", estadoQs)

  const centro = (estado) => {
  switch (estado) {
    case "edo1":
      return <img src={paloma} alt="Completado" />;
    case "edo2":
      return <ProgresoTarjeta porcentaje={n_responses * 100 / n_items} />;
    case "edo3":
      return <img src={habilitado} alt="Habilitado" />;
    case "edo4":
      return <img src={bloqueado} alt="Bloqueado" />;
    default:
      return null;
  }
};

  const botonBG = edoQs == "edo4" ? "#ccc" : "#007cba";

  console.error("backgroudm color", botonBG)

   console.log("Renderizando TarjetaBsEdoQs:", { titQs, edoQs })

  return (
    <div className={styles.cntTarjetaBsEdoQs}>
      <p>{titQs}</p>
      <p>{desQs}</p>
      
      {edoQs === "edo1" && <img className={styles.confeti} src={confetti} alt="Confetti" />}

          <div key={estadoQs.id} className={styles.info}>
            <div className={styles.cntEdoQs}>
              {centro(edoQs)}
            </div>

            <p>{estadoQs.ed}</p> 
            <p>
              {estadoQs.ac[0]}
              <br />
              {estadoQs.ac[1]}
            </p>
            <button  style={{backgroundColor:botonBG}}>{estadoQs.bt}</button>
          </div>
    </div>
  );
};

export default TarjetaBsEdoQs;
