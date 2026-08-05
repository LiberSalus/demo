import React, {useState} from'react'
import styles from './VistaSocial.module.css'

import BotonesQs from "../TarjetasEstadosQs/BotonesQs";
import TarjetaBsEdoQs from "../TarjetasEstadosQs/TarjetaBsEdoQs";
import { obtenerTarjetasPorArea } from "../catalogoCuestionarios";

const VistaSocial = () => {
  const tarjetas = obtenerTarjetasPorArea("social");
  const [tarjetaActiva, setTarjetaActiva] = useState(0);

  return (
    <div className={styles.VistaSocial}>
      <h3>Mis Cuestionarios</h3>
      <p>
        Tus relaciones y tu entorno también construyen salud. Con estos
        cuestionarios conoces tus vínculos, tu apoyo y tu participación social
        para fortalecer tu red.
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

export default VistaSocial