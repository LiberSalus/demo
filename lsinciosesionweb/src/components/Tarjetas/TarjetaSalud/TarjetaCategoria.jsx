//mesat\src\components\TarjetaSalud\TarjetaCategoria.jsx
import TarjetaMedicion from './TarjetaMedicion/TarjetaMedicion';
import styles from './TarjetaCategoria.module.css'

import { mediciones } from './mediciones';

export default function TarjetaCategoria({ titulo, icono, mediciones, nota }){
  
  const tarjetaSalud = {
    "Salud Física": {titulo: "Salud Física"}
  }


  return (
    <div className={styles.cntTarjetaCategoria}>
      <div className={styles.header}>
        <h3>{titulo}</h3>
        <img src={icono} alt={`${titulo} icono`} />
      </div>

      <div className={styles.mediciones}>
        {mediciones.map((m, i) => (
          <TarjetaMedicion key={i} {...m} />
        ))}
      </div>

      <div className={styles.acciones}>
        <button>Editar</button>
        <button>Ver Todo</button>
      </div>

      <p className={styles.nota}>{nota}</p>
    </div>
  );
}