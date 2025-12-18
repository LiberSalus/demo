import React, { useState } from "react";
import styles from "./TabMedicamento.module.css";

import campana from "./icoCampana.svg";

// importa el modal que hicimos
import ModalRecordatoriosPresion from "./ModalRecordatoriosPresion";

const TabMedicamento = () => {

  // 🔵 estado para mostrar el modal
  const [mostrarModal, setMostrarModal] = useState(false);

  // 🟢 estado para guardar recordatorios
  const [recordatorios, setRecordatorios] = useState([
    /* si quieres puedes empezar vacío [] */
    // {
    //   id: "1",
    //   hora: { h: 7, m: "00", periodo: "AM" },
    //   dias: [1,3,5],
    //   activo: true
    // }
  ]);

  return (
    <div className={styles.TabMedicamento}>
      <div className={styles.medicamento}>
        <p>Medicamento tomado</p>
        <p>Nombre del medicamento</p>
        <p>Medicamento 1</p>
        <p>Fecha y hora de toma</p>
        <p>08/12/2025 - 12:35 pm</p>
      </div>

      <div className={styles.derecha}>

        {/* 🔔 ICONO DE CAMPANA: abre el modal */}
        <div
          className={styles.campana}
          onClick={() => setMostrarModal(true)}
        >
          <img
            className={styles.campanita}
            src={campana}
            alt="Administrar recordatorios"
          />
          <p>Administrar recordatorios</p>
        </div>

        <div className={styles.prox}>
          <p>Tu próxima toma de presión es en:</p>
          <p>6 hrs</p>
          <p>*Recuerda tomar tu presión constantemente</p>
        </div>
      </div>

      {/* 🪟 aquí renderizamos el modal si mostrarModal es true */}
      {mostrarModal && (
        <ModalRecordatoriosPresion
          recordatorios={recordatorios}
          onChange={setRecordatorios}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
};

export default TabMedicamento;
