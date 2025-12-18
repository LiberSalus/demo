import React from "react";
import styles from "./TolesGlucosa.module.css";

const RANGOS_GLUCOSA = [
  {
    id: "hipo",
    estado: "Hipoglucemia",
    color: "#3DCDF5",
    ayunas: "< 60 mg/dL",
    comida: "< 60 mg/dL",
  },
  {
    id: "normal",
    estado: "Niveles normales",
    color: "#98DBD3",
    ayunas: "70 - 110 mg/dL",
    comida: "70 - 140 mg/dL",
  },
  {
    id: "prediabetes",
    estado: "Prediabetes",
    color: "#F6E68B",
    ayunas: "110 - 125 mg/dL",
    comida: "140 - 199 mg/dL",
  },
  {
    id: "diabetes",
    estado: "Diabetes",
    color: "#FD8D8D",
    ayunas: "> 126 mg/dL",
    comida: "> 200 mg/dL",
  },
];

const TolesGlucosa = () => {
  return (
    <div className={styles.TolesGlucosa}>
      <div className={styles.columnas}>
        {/* Columna: En ayunas */}
        <div className={styles.columna}>
          <h4 className={styles.titulo}>
            Rangos de glucosa en sangre <span>(En ayunas)</span>
          </h4>

          {RANGOS_GLUCOSA.map((item) => (
            <div key={item.id} className={styles.fila}>
              <span
                className={styles.color}
                style={{ backgroundColor: item.color }}
              />
              <p className={styles.estado}>{item.estado}</p>
              <p className={styles.valor}>{item.ayunas}</p>
            </div>
          ))}
        </div>

        <hr className={styles.hr}></hr>
        
        <div className={styles.columna}>
          <h4 className={styles.titulo}>
            Rangos de glucosa en sangre <span>(Después de comer)</span>
          </h4>

          {RANGOS_GLUCOSA.map((item) => (
            <div key={item.id} className={styles.fila}>
              <span
                className={styles.color}
                style={{ backgroundColor: item.color }}
              />
              <p className={styles.estado}>{item.estado}</p>
              <p className={styles.valor}>{item.comida}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TolesGlucosa;

