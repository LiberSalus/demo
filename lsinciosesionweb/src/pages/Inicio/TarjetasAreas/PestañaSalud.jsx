import React, { useState } from "react";
import styles from "./PestañaSalud.module.css";

const PestañaSalud = ({ tabs }) => {
  const [activa, setActiva] = useState(0);

  return (
    <div className={styles.contenedor}>
      <div className={styles.encabezado}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`${styles.boton} ${activa === i ? tab.estilo : ""}`}
            onClick={() => setActiva(i)}
          >
            {tab.titulo}
          </button>
        ))}
      </div>

      <div className={styles.contenido}>{tabs[activa].componente}</div>
    </div>
  );
};

export default PestañaSalud;
