import React from "react";
import styles from "./backgroundPanel.module.css";
import lineas from "./line.svg";

const BackgroundPanel = ({ esMujer = true }) => {
  const vars = esMujer
    ? {
        "--bgTop": "rgba(239, 241, 243, 0.5)",
        "--bgBottom": "rgba(255, 177, 251, 0.5)",
      }
    : {
        "--bgTop": "rgba(239, 241, 243, 0.5)",
        "--bgBottom": "rgba(177, 191, 255, 0.5)", // tu azul hombre
      };

  return (
    <div className={styles.backgroundPanel}>
      <img src={lineas} className={styles.lineas} alt="Background Lines" />
      <div className={styles.capa} style={vars} />
    </div>
  );
};

export default BackgroundPanel;
