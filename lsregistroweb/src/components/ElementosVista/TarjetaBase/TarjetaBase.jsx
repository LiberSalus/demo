import React from "react";
import styles from "./tarjetaBase.module.css";
import BotonA from "../../Botones/BotonA";

const TarjetaBase = ({ accion, descripcion, srcIcon, textoBoton, onClick }) => {
  return (
    <div className={styles.cntTarjetaBase}>
      <div className={styles.cntImg}>
        <img src={srcIcon} className={styles.icon}></img>
      </div>
      <div className={styles.cntTxt}>
        <p>{accion}</p>
        <p>{descripcion}</p>
        <a type="button" onClick={onClick} className={styles.btn}>
          {textoBoton}
        </a>
      </div>
    </div>
  );
};

export default TarjetaBase;
