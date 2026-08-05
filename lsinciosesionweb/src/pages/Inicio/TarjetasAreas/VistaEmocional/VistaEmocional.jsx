import React, { useState } from 'react'
import styles from './VistaEmocional.module.css'

import BotonesQs from "../TarjetasEstadosQs/BotonesQs";
import TarjetaBsEdoQs from "../TarjetasEstadosQs/TarjetaBsEdoQs";
import { obtenerTarjetasPorArea } from "../catalogoCuestionarios";

const VistaEmocional = () => {
  const tarjetas = obtenerTarjetasPorArea("emocional");
  const [tarjetaActiva, setTarjetaActiva] = useState(1);

  return (
    <div className={styles.VistaEmocional}>
      <h3>Mis Cuestionarios</h3>
      <p>
        Tu bienestar emocional también importa. Estos cuestionarios te ayudan
        a reconocer cómo te sientes, manejar el estrés y mantenerte en
        equilibrio contigo mismo.
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
  )
}

export default VistaEmocional