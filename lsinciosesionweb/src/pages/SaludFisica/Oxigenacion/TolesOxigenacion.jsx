import React from 'react'
import styles from './TolesOxigenacion.module.css'

const tolerancias = [
  {
    key: "normal",
    color: "#10D429",
    txt: "Normal",
    valor: "95% - 100%"
  },
  {
    key: "moderada",
    color: "#FF9F1C",
    txt: "Hipoxemia moderada",
    valor: "90% - 94%"
  },
  {
    key: "leve",
    color: "#FFD93D",
    txt: "Hipoxemia leve",
    valor: "85% - 89%"
  },
  {
    key: "severa",
    color: "#FF3737",
    txt: "Hipoxemia severa",
    valor: "< 85%"
  },
];

const TolesOxigenacion = () => {
  return (
    <div className={styles.TolesOxigenacion}>
      <p className={styles.tit}>Rangos de Oxigenación SpO2</p>

      <div className={styles.cntToles}>
        {tolerancias.map((tole) => (
          <div key={tole.key} className={styles.item}>
            <span
              className={styles.circulo}
              style={{ backgroundColor: tole.color }}
            ></span>

            <div className={styles.dat}>
              <p className={styles.nombre}>{tole.txt}</p>
              <p className={styles.valor}>{tole.valor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TolesOxigenacion
