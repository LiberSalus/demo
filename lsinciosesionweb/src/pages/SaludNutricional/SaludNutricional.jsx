//src\pages\SaludNutricional\SaludNutricional.jsx
import React from "react";
import { METRICAS_SALUD } from "@/config/metricasSalud";
import PestañasSalud from "../SaludCompartida/PestañasSalud";

import Peso from "./Peso/Peso";
import Hidratacion from "./Hidratacion/Hidratacion";
import KcalQuemadas from "./KcalQuemadas/KcalQuemadas";
import KcalConsumidas from "./KcalConsumidas/KcalConsumidas";


const mapComponentByMetric = {
  "Peso": Peso,
  "kCal consumidas": KcalConsumidas,
  "kCal quemadas": KcalQuemadas,
  "Hidratación": Hidratacion,
};

const SaludNutricional = () => {
  const metricas = METRICAS_SALUD["Salud Nutricional"] || [];

  const tabs = metricas.map((nombre) => ({
    medidor: nombre,
    Component: mapComponentByMetric[nombre] || (() => (
      <div>
        <h4>{nombre}</h4>
        <p>Contenido pendiente para esta métrica.</p>
      </div>
    )),
  }));

  return (
    <PestañasSalud
      tituloSeccion="Salud Nutricional"
      tabs={tabs}
    />
  );
};

export default SaludNutricional;
