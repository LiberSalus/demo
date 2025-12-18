//mesat\src\components\TarjetaSalud\TarjetaMedicion\TarjetaMedicion.jsx

import React from 'react'
import styles from './TarjetaMedicon.module.css'
import { datosPorMedicion } from './datosPorMedicion';


/* 
*******titulos y unidades de tarjetas:

"Peso":  "kg"
"Pasos":  "pasos"
"Feliz":  ""
"Estrés":  "%"
"Triste":  ""
"Energía":  "%"
"Neutral":  ""
"Calorías":  "kcal"
"Descanso":  "hrs"
"Contento":  ""
"Depresión":  ""
"Hidratación":  "ml"
"Oxigenación":  "%"
"Estado de ánimo":  ""
"Presión arterial":  "mmHg"
"Glucosa en sangre":  "mg/dL"
"Frecuencia cardiaca":  "ppm"

*/


const TarjetaMedicion = ({ titulo, valor }) => {
  const datos = titulo === ""
  ? datosPorMedicion[valor] // usa el estado como clave
  : datosPorMedicion[titulo];
  const icono = datos?.icono;
  const unidad = datos?.unidad || "";

  return (
    <div className={styles.TarjetaMedicion}>
      {icono && <img src={icono} alt={titulo} className={styles.icono} />}
      <div className={styles.data}>
        <p>{titulo}</p>
        <p>{valor} {unidad && <span>{unidad}</span>}</p>
      </div>
    </div>
  );
};

export default TarjetaMedicion