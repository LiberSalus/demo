import React from "react";
import styles from "./VistaSocial.module.css";

import ListaCuestionarios from "../ListaCuestionarios";
import { obtenerTarjetasPorArea } from "../catalogoCuestionarios";

const VistaSocial = () => {
  const items = obtenerTarjetasPorArea("social");

  return (
    <div className={styles.VistaSocial}>
      <h3>Mis Cuestionarios</h3>
      <p>
        Tus relaciones y tu entorno también construyen salud. Con estos
        cuestionarios conoces tus vínculos, tu apoyo y tu participación social
        para fortalecer tu red.
      </p>
      <ListaCuestionarios items={items} />
    </div>
  );
};

export default VistaSocial;
