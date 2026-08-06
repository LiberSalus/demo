import React from "react";
import styles from "./VistaNutricional.module.css";

import ListaCuestionarios from "../ListaCuestionarios";
import { obtenerTarjetasPorArea } from "../catalogoCuestionarios";

const VistaNutricional = () => {
  const items = obtenerTarjetasPorArea("nutricional");

  return (
    <div className={styles.VistaNutricional}>
      <h3>Mis Cuestionarios</h3>
      <p>
        Tu alimentación es parte esencial de tu cuidado. Estos cuestionarios te
        permiten revisar tus hábitos, hidratación y porciones para comer mejor
        cada día.
      </p>
      <ListaCuestionarios items={items} />
    </div>
  );
};

export default VistaNutricional;
