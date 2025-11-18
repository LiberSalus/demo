//mesat\src\components\TarjetaSalud\TarjetaCategoria.jsx
import TarjetaMedicion from './TarjetaMedicion/TarjetaMedicion';
import styles from './TarjetaCategoria.module.css'

import { mediciones } from './mediciones';


export default function TarjetaCategoria({ titulo, icono, mediciones, nota }){
  
  const tarjetaSalud = {
    "Salud Física": {titulo: "Salud Física"},
    "Salud Mental": {titulo: "Salud Mental"},
    "Salud Nutricional": {titulo: "Salud Nutricional"},
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


/*  TarjetaCategoria__  representa la configuración de botones en
    el dashboard principal de salud, cada tarjeta tiene un conjunto
    de mediciones asociadas que se muestran en forma de tarjetas
    individuales.
    Props:
    - titulo: El título de la categoría de salud (e.g., "Salud Física").
    - icono: El icono representativo de la categoría.
    - mediciones: Un array de objetos que representan las mediciones
      asociadas a la categoría. Cada objeto debe tener:
        - titulo: El título de la medición (e.g., "Peso", "Pasos").
        - valor: El valor actual de la medición (e.g., "70", "5000").
    - nota: Una nota adicional o mensaje relacionado con la categoría.

    componentes utilizados:
    - TarjetaMedicion: Componente que representa una medición individual
*/