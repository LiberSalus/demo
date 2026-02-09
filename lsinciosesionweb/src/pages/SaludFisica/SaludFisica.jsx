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
import Glucosa from "./GlucosaEnSangre/Glucosa";
import PresionArterial from "./PresionArterial/PresionArterial";
import Oxigenacion from "./Oxigenacion/Oxigenacion";
import ActividadFisica from "./ActividadFisica/ActividadFisica";
import CicloMenstrual from "./CicloMenstrual/CicloMenstrual";


const ordenMetricas = [
  "Frecuencia cardiaca",
  "Presión arterial",
  "SpO2",
  "Glucosa en sangre",
  "Pasos",
  "Ciclo menstrual",
];

const mapComponentByMetric = {
  "Frecuencia cardiaca": FrecuenciaCardiaca,
  "Presión arterial": PresionArterial,
  "SpO2": Oxigenacion,
  "Glucosa en sangre": Glucosa,
  "Pasos": ActividadFisica,
  "Ciclo menstrual": CicloMenstrual,
};

const SaludFisica = () => {
  const metricasConfig = METRICAS_SALUD["Salud Física"] || [];

  const tabs = ordenMetricas
    .filter((nombre) => metricasConfig.includes(nombre))
    .map((nombre) => ({
      medidor: nombre,
      Component: mapComponentByMetric[nombre] || (() => <div>Pendiente</div>),
    }));

  return (
    <div className={styles.SaludFisica}>
      <PestañasSalud tituloSeccion="Salud Física" tabs={tabs} />
    </div>
  );
};

export default SaludFisica;
