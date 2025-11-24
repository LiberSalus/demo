//src\pages\SaludMental\SaludMental.jsx
import React from "react";
import { METRICAS_SALUD } from "@/config/metricasSalud";
import PestañasSalud from "../SaludCompartida/PestañasSalud";

import Estres from "./Estres/Estres";
import Energia from "./Energia/Energia";
import Descanso from "./Descanso/Descanso";
import EstadoAnimo from "./EstadoAnimo/EstadoAnimo";

const mapComponentByMetric = {
    "Estrés": Estres,
    "Energía": Energia,
    "Descanso": Descanso,
    "Estado de ánimo": EstadoAnimo,

};

const SaludMental = () => {
  const metricas = METRICAS_SALUD["Salud Mental"] || [];

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
      tituloSeccion="Salud Mental"
      tabs={tabs}
    />
  );
};

export default SaludMental;
