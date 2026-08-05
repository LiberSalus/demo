import React, { useState } from "react";
import styles from "./VistaTodos.module.css";

import BotonesQs from "../TarjetasEstadosQs/BotonesQs";
import TarjetaBsEdoQs from "../TarjetasEstadosQs/TarjetaBsEdoQs";
import { obtenerTarjetasTodas } from "../catalogoCuestionarios";

// Muestra el listado conjunto de cuestionarios de todas las areas de salud.
const VistaTodos = () => {
  const tarjetas = obtenerTarjetasTodas();
  const [tarjetaActiva, setTarjetaActiva] = useState(0);

  return (
    <div className={styles.VistaTodos}>
      <h3>Mis Cuestionarios</h3>
      <p>
        Todos tus cuestionarios de salud en un solo lugar. Selecciona uno para
        consultar su avance.
      </p>
      <div className={styles.cntDin}>
        <div className={styles.cntCmp}>
          {tarjetas.map((tarjeta, i) => (
            <BotonesQs
              key={tarjeta.id}
              edoQs={tarjeta.edoQs}
              av={tarjeta.av}
              activo={tarjetaActiva === i}
              onClick={() => setTarjetaActiva(i)}
            />
          ))}
        </div>
        <div className={styles.cntStd}>
          {tarjetas[tarjetaActiva] && (
            <TarjetaBsEdoQs {...tarjetas[tarjetaActiva]} />
          )}
        </div>
      </div>
    </div>
  );
};

export default VistaTodos;