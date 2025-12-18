// src/components/Glucosa/PanelGlucosa.jsx
import React, { useState } from "react";
import MedidorGlucosa from "./MedidorGlucosa";
import ModalGlucosa from "./ModalGlucosa";
import styles from "./PanelGlucosa.module.css";

import izquierda from "./icoIzquierda.svg";
import derecha from "./icoDerecha.svg";

const PanelGlucosa = ({ ayunas, comida, onActualizar }) => {
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoModal, setTipoModal] = useState("ayunas");

  const medidores = [
    { id: "ayunas", tipo: "ayunas", valor: ayunas },
    { id: "comida", tipo: "comida", valor: comida },
  ];

  const irAnterior = () => {
    setIndiceActivo((prev) => (prev === 0 ? medidores.length - 1 : prev - 1));
  };

  const irSiguiente = () => {
    setIndiceActivo((prev) =>
      prev === medidores.length - 1 ? 0 : prev + 1
    );
  };

  const handleClickAñadir = (tipo) => {
    setTipoModal(tipo);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
  };

  const handleGuardar = ({ valor, tipo }) => {
    // avisamos al padre (Glucosa.jsx)
    onActualizar && onActualizar({ valor, tipo });
    setModalAbierto(false);
  };

  return (
    <div className={styles.PanelGlucosa}>
      {/* Flecha izquierda */}
      <button
        type="button"
        className={`${styles.flecha} ${styles.izquierda}`}
        onClick={irAnterior}
      >
        <img src={izquierda} alt="izquierda" />
      </button>

      {/* Carrusel */}
      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${indiceActivo * 100}%)` }}
        >
          {medidores.map((item) => (
            <div key={item.id} className={styles.slide}>
              <MedidorGlucosa
                tipo={item.tipo}
                valor={item.valor}
                ultimaActualizacion={
                  item.valor != null ? "Hace 1 hora" : "Sin registro"
                }
                onClickAñadir={handleClickAñadir}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Flecha derecha */}
      <button
        type="button"
        className={`${styles.flecha} ${styles.derecha}`}
        onClick={irSiguiente}
      >
        <img src={derecha} alt="derecha" />
      </button>

      {/* Modal único */}
      <ModalGlucosa
        abierto={modalAbierto}
        tipo={tipoModal}
        onClose={handleCerrarModal}
        onGuardar={handleGuardar}
      />
    </div>
  );
};

export default PanelGlucosa;
