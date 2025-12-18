// src/components/Oxigenacion/ActualizacionOxigenacion.jsx
import React from "react";
import styles from "./ActualizacionOxigenacion.module.css";
import oxigen from "./icoOxigenacion.svg";

const ActualizacionOxigenacion = ({ fechaHora, onClose }) => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.ActualizacionOxigenacion}>
        <img src={oxigen} className={styles.icono} alt="Oxigenación actualizada" />

        <p className={styles.msg}>
          Actualizaste tu oxigenación en sangre
          <br />
          correctamente
        </p>

        <p className={styles.fecha}>{fechaHora}</p>

        <button
          className={styles.btnPri}
          type="button"
          onClick={onClose}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default ActualizacionOxigenacion;

