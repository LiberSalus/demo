//mesat\src\components\SaludFisica\SaludFisica.jsx
//import React from 'react'
//import styles from './SaludFisica.module.css'
//import PestañasFisica from './PestañasFisica'
//
//import Oxigenacion from './Oxigenacion/Oxigenacion'
//import CicloMenstrual from './CicloMenstrual/CicloMenstrual'
//import PresionArterial from './PresionArterial/PresionArterial'
//import GlucosaEnSangre from './GlucosaEnSangre/GlucosaEnSangre'
//import ActividadFisica from './ActividadFisica/ActividadFisica'
//import FrecuenciaCardiaca from './FrecuenciaCardiaca/FrecuenciaCardiaca'
//
//
//const SaludFisica = () => {
//  return (
//    <div className={styles.SaludFisica}>
//      <PestañasFisica 
//        tabs={[
//          {
//            medidor:"Frecuencia Cardiaca",
//            Component: FrecuenciaCardiaca,
//          },
//          {
//            medidor:"Presión Arterial",
//            Component: PresionArterial,
//          },
//          {
//            medidor:"Oxigenación",
//            Component: Oxigenacion,
//          },
//          {
//            medidor:"Glucosa en Sangre",
//            Component: GlucosaEnSangre,
//          },
//          {
//            medidor:"Actividad Física",
//            Component: ActividadFisica,
//          },
//          {
//            medidor:"Ciclo Menstrual",
//            Component: CicloMenstrual,
//          },
//        ]}
//      
//      />
//    </div>
//  )
//}
//
//export default SaludFisica;
//
//


// src/pages/SaludFisica/SaludFisica.jsx
import React from "react";
import styles from "./SaludFisica.module.css";

import { METRICAS_SALUD } from "@/config/metricasSalud";
import PestañasSalud from "../SaludCompartida/PestañasSalud";

import FrecuenciaCardiaca from "./FrecuenciaCardiaca/FrecuenciaCardiaca";
import GlucosaEnSangre from "./GlucosaEnSangre/GlucosaEnSangre";
import PresionArterial from "./PresionArterial/PresionArterial";
import Oxigenacion from "./Oxigenacion/Oxigenacion";
import ActividadFisica from "./ActividadFisica/ActividadFisica";
import CicloMenstrual from "./CicloMenstrual/CicloMenstrual";

const mapComponentByMetric = {
  "Presión arterial": PresionArterial,
  "Glucosa en sangre": GlucosaEnSangre,
  "Ciclo menstrual": CicloMenstrual,
  "SpO2": Oxigenacion,
  "Actividad Física": ActividadFisica,
  "Frecuencia cardiaca": FrecuenciaCardiaca,
};

const SaludFisica = () => {
  const metricas = METRICAS_SALUD["Salud Física"] || [];

  const tabs = metricas.map((nombre) => ({
    medidor: nombre,
    Component:
      mapComponentByMetric[nombre] ||
      (() => (
        <div>
          <h4>{nombre}</h4>
          <p>Contenido pendiente para esta métrica.</p>
        </div>
      )),
  }));

  return (
    <div className={styles.SaludFisica}>
      <PestañasSalud tituloSeccion="Salud Física" tabs={tabs} />
    </div>
  );
};

export default SaludFisica;
