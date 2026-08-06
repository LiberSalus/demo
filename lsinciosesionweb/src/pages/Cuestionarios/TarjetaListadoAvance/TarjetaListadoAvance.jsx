import React from "react";
import styles from "./tarjetaListadoAvance.module.css";
import TrjEstadoCuestionario from "@/components/Tarjetas/TarjetaCuestionarios/TrjEstadoCuestionario";

// Listado reutilizable de cuestionarios con su estado y progreso.
// Uso:
//   <TarjetaListadoAvance
//     titulo="Bienestar Emocional"
//     items={[{ key, name, description, percent, state, href }]}
//   />
const TarjetaListadoAvance = ({ titulo, items = [] }) => {
  if (!items.length) {
    return (
      <div className={styles.cntListado}>
        <p className={styles.titulo}>{titulo}</p>
        <p className={styles.vacio}>Aún no hay cuestionarios disponibles en esta área.</p>
      </div>
    );
  }

  return (
    <div className={styles.cntListado}>
      <p className={styles.titulo}>{titulo}</p>
      <div className={styles.lista}>
        {items.map((item) => (
          <TrjEstadoCuestionario
            key={item.key}
            nombre={item.name}
            descripcion={item.description}
            estado={item.state}
            percent={item.percent}
            href={item.href}
          />
        ))}
      </div>
    </div>
  );
};

export default TarjetaListadoAvance;
