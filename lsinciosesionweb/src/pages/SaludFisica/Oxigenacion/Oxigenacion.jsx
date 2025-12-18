import React, { useState } from "react";
import styles from "./Oxigenacion.module.css";
import InfoBase from "./InfoBase";
import AdverOxigeno from "./AdverOxigeno";
import TolesOxigenacion from "./TolesOxigenacion";
import RangoOxigenacion from "./RangoOxigenacion";
import GraficaOxigenacion from "./GraficaOxigenacion";
import MedidorOxigenacion from "./MedidorOxigenacion";
import ComparacionSemanalOxigeno from "./ComparacionSemanalOxigeno";

const Oxigenacion = () => {
  const [oxiActual, setOxiActual] = useState(null);
  return (
    <div className={styles.Oxigenacion}>
      <div className={styles.izq}>
        <RangoOxigenacion oxi={oxiActual} />
        <GraficaOxigenacion />
      </div>
      <div className={styles.cen}>
        <MedidorOxigenacion onUpdateOxi={setOxiActual} />
        <TolesOxigenacion />
      </div>
      <div className={styles.der}>
        
        <ComparacionSemanalOxigeno
          promedioActual={92.3}
          promedioAnterior={90.0}
        />
        <AdverOxigeno />
        <InfoBase />
      </div>
    </div>
  );
};

export default Oxigenacion;
