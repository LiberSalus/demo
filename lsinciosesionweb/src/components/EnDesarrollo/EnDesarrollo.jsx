// src/components/EnDesarrollo/EnDesarrollo.jsx
// Estado vacío elegante para secciones que ya existen en la navegación pero
// cuya experiencia final aún está en desarrollo.
import React from "react";
import styles from "./enDesarrollo.module.css";

const EnDesarrollo = ({
  titulo = "En desarrollo",
  descripcion =
    "Esta sección se está construyendo. Muy pronto tendrás contenido aquí.",
}) => {
  return (
    <div className={styles.contenedor} role="status">
      <span className={styles.badge}>En desarrollo</span>
      <div className={styles.icono} aria-hidden="true">
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L13.8 8.6L20 10L13.8 11.4L12 18L10.2 11.4L4 10L10.2 8.6L12 2Z"
            fill="#007cba"
          />
          <path
            d="M19 15L19.9 18.1L23 19L19.9 19.9L19 23L18.1 19.9L15 19L18.1 18.1L19 15Z"
            fill="#7cb8dd"
          />
        </svg>
      </div>
      <h3 className={styles.titulo}>{titulo}</h3>
      <p className={styles.descripcion}>{descripcion}</p>
    </div>
  );
};

export default EnDesarrollo;
