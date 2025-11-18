// TarjetaCita.jsx
import React from 'react'
import styles from './TarjetaCita.module.css'

// Colores y textos según el estado
const colorEstado = {
  tarde: { bg: "#F7D66F", texto: "Vas tarde para tu cita" },
  aiempo: { bg: "#62CE7B", texto: "A tiempo para tu cita" },
  expirada: { bg: "#DC7368", texto: "Tu cita ha EXPIRADO" },
  cancelada: { bg: "#334155", texto: "Tu cita ha sido cancelada" },
  reprogramada: { bg: "#E4B365", texto: "Tu cita ha sido reprogramada" },
};

const TarjetaCita = ({ nombre, especialidad, fecha, hora, estado }) => {
  // Seleccionamos el color según el estado o el default
  const info = colorEstado[estado] || colorEstado.aiempo;

  return (
    <div className={styles.TarjetaCita}>
      <div className={styles.encabezado}>
        <p className={styles.nombre}>{nombre}</p>
        <p className={styles.especialidad}>{especialidad}</p>
      </div>

      <div className={styles.cuerpo}>
        <p className={styles.fecha}>{fecha}</p>
        <p className={styles.hora}>{hora}</p>
      </div>

      <div
        className={styles.estado}
        style={{ backgroundColor: info.bg }}
      >
        <p>{info.texto}</p>
      </div>
    </div>
  );
};

export default TarjetaCita;
