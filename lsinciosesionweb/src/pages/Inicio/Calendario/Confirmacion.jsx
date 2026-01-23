// src/components/Calendario/Confirmacion.jsx
import React from "react";
import styles from "./Confirmacion.module.css";
import confirmacion from "./icoConfirmacion.svg";

const mensajes = {
  cita: "Tu cita ha sido agendada correctamente",
  medicamento: "Tu recordatorio ha sido agendado correctamente",
};

const Confirmacion = ({ tipo = "cita", onClose }) => {
  const texto = mensajes[tipo] || mensajes.cita;

  return (
    <div className={styles.cntConfirmacion}>
      <img
        className={styles.ico}
        src={confirmacion}
        alt="Alerta registrada con éxito"
      />
      <p>{texto}</p>
      <button className={styles.boton} onClick={onClose}>
        Aceptar
      </button>
    </div>
  );
};

export default Confirmacion;
