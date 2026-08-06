import React from "react";
import styles from "./VistaTodos.module.css";

import ListaCuestionarios from "../ListaCuestionarios";
import { obtenerTarjetasTodas } from "../catalogoCuestionarios";

// Muestra el listado conjunto de cuestionarios de todas las areas de salud.
const VistaTodos = () => {
  const items = obtenerTarjetasTodas();

  return (
    <div className={styles.VistaTodos}>
      <h3>Mis Cuestionarios</h3>
      <p>
        Todos tus cuestionarios de salud en un solo lugar. Selecciona uno para
        consultar su avance.
      </p>
      <ListaCuestionarios items={items} />
    </div>
  );
};

export default VistaTodos;
