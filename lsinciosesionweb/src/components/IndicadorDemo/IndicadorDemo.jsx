import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import styles from "./IndicadorDemo.module.css";
import { DEMO_ACTIVO } from "@/config/demo.config";
import { ROUTES } from "@/config/routes";
import { cerrarSesion } from "@/services/auth";

// Indicador flotante del modo demo presente mientras se recorre el panel.
// Si el flag DEMO no esta activo, no renderiza nada.
const IndicadorDemo = () => {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);

  if (!DEMO_ACTIVO) return null;

  const salirDelModoDemo = async () => {
    setAbierto(false);
    await cerrarSesion();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <>
      <button
        type="button"
        className={styles.badge}
        onClick={() => setAbierto(true)}
        aria-label="Estás en modo demo. Pulsa para opciones."
      >
        DEMO MODE
      </button>

      <Modal
        isOpen={abierto}
        onRequestClose={() => setAbierto(false)}
        className={styles.modal}
        overlayClassName={styles.modalFondo}
      >
        <h3 className={styles.modalTitulo}>Modo demo</h3>
        <p className={styles.modalTexto}>
          Estás viendo la plataforma en modo demo con datos de ejemplo.
        </p>
        <div className={styles.modalAcciones}>
          <button
            type="button"
            className={styles.modalSalir}
            onClick={salirDelModoDemo}
          >
            Salir del modo demo
          </button>
          <button
            type="button"
            className={styles.modalCerrar}
            onClick={() => setAbierto(false)}
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </>
  );
};

export default IndicadorDemo;