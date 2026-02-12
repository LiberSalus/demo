import React, { useMemo } from "react";
import styles from "./tarjetaBsEdoQs.module.css";

import paloma from "./palomaV.svg";
import habilitado from "./habilitado.svg";
import bloqueado from "./bloqueado.svg";
import confetti from "./confetti.svg";

import ProgresoTarjeta from "./ProgresoTarjeta";
import { ESTADOSQS } from "./estadosQs.config";

// edo1: completado
// edo2: iniciado
// edo3: no iniciado
// edo4: bloqueado

const TarjetaBsEdoQs = ({
  titQs,
  desQs,
  edoQs, // codigo
  n_items = 0,
  n_responses = 0,
}) => {
  // Convierte ESTADOSQS a lista (sirve si viene como array o como objeto)
  const estadosList = useMemo(
    () => (Array.isArray(ESTADOSQS) ? ESTADOSQS : Object.values(ESTADOSQS)),
    []
  );

  // Lookup seguro por id
  const estadoQs = useMemo(() => {
    const found = estadosList.find((e) => e?.id === edoQs);
    const fallback = estadosList.find((e) => e?.id === "edo4") || estadosList[0];
    return found || fallback;
  }, [edoQs, estadosList]);

  const centro = (estado) => {
    switch (estado) {
      case "edo1":
        return <img src={paloma} alt="Completado" />;
      case "edo2": {
        const pct = n_items > 0 ? (n_responses * 100) / n_items : 0;
        return <ProgresoTarjeta porcentaje={pct} />;
      }
      case "edo3":
        return <img src={habilitado} alt="Habilitado" />;
      case "edo4":
        return <img src={bloqueado} alt="Bloqueado" />;
      default:
        return null;
    }
  };

  const botonBG = edoQs === "edo4" ? "#ccc" : "#007cba";

  return (
    <div className={styles.cntTarjetaBsEdoQs}>
      <p>{titQs}</p>
      <p>{desQs}</p>

      {edoQs === "edo1" && (
        <img className={styles.confeti} src={confetti} alt="Confetti" />
      )}

      <div className={styles.info}>
        <div className={styles.cntEdoQs}>{centro(edoQs)}</div>

        <p>{estadoQs?.ed}</p>

        <p>
          {estadoQs?.ac?.[0]}
          <br />
          {estadoQs?.ac?.[1]}
        </p>

        <button style={{ backgroundColor: botonBG }}>
          {estadoQs?.bt}
        </button>
      </div>
    </div>
  );
};

export default TarjetaBsEdoQs;
