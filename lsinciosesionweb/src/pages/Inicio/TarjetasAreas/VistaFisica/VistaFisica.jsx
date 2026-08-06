import React from "react";
import styles from "./VistaFisica.module.css";

import ListaCuestionarios from "../ListaCuestionarios";
import { obtenerTarjetasPorArea } from "../catalogoCuestionarios";

const VistaFisica = () => {
  const items = obtenerTarjetasPorArea("fisica");

  return (
    <div className={styles.VistaFisica}>
      <h3>Mis Cuestionarios</h3>
      <p>
        Tu bienestar físico en un solo panel. Completa estos cuestionarios para
        conocer tu rutina de actividad, descanso y movilidad, y consultar tu
        avance en cada uno.
      </p>
      <ListaCuestionarios items={items} />
    </div>
  );
};

export default VistaFisica;
