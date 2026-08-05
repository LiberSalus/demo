import React, { useState } from "react";
import styles from "./VistaFisica.module.css";

import BotonesQs from "../TarjetasEstadosQs/BotonesQs";
import TarjetaBsEdoQs from "../TarjetasEstadosQs/TarjetaBsEdoQs";
import { obtenerTarjetasPorArea } from "../catalogoCuestionarios";

const VistaFisica = () => {
  const tarjetas = obtenerTarjetasPorArea("fisica");
  const [tarjetaActiva, setTarjetaActiva] = useState(2);

  return (
    <div className={styles.VistaFisica}>
      <h3>Mis Cuestionarios</h3>
      <p>
        Tu bienestar físico en un solo panel. Completa estos cuestionarios para
        conocer tu rutina de actividad, descanso y movilidad, y consultar tu
        avance en cada uno.
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

export default VistaFisica;