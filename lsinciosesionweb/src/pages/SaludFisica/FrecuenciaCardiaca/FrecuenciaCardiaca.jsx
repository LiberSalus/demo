//mesat\src\components\SaludFisica\FrecuenciaCardiaca\FrecuenciaCardiaca.jsx

import React, { useState, useMemo } from "react";
import { buildDailyMetrics } from "./RangoFrecuencias/FrecuenciaUtils";

import sytles from "./FrecuenciaCardiaca.module.css";
import Alertas from "./RangoFrecuencias/Alertas";
import RegistroAlertas from "./RangoFrecuencias/RegistroAlertas";
import FrecuenciaDiaria from "./RangoFrecuencias/FrecuenicaDiaria";
import RangoFrecuencias from "./RangoFrecuencias/RangoFrecuencias";
import ComparacionSemanal from "./RangoFrecuencias/ComparacionSemanal";
import GraficaFrecuenciaCardiaca from "../../../components/GraficaFrecuenciaCardiaca/GraficaFrecuenciaCardiaca";

//import icoAzul from "./icoAzul.svg";
import alver from "./icoAlver.svg";
import icoRojo from "./icoRojo.svg";

const FrecuenciaCardiaca = () => {
  const [readings, setReadings] = useState([
    { ts: new Date(), bpm: 72 },
    { ts: new Date(new Date().setHours(8, 15)), bpm: 68 },
    { ts: new Date(new Date().setHours(12, 45)), bpm: 88 },
  ]);

  // Día que se muestra (de momento, hoy)
  const [date] = useState(new Date());

  // Cuando el modal de FrecuenciaDiaria confirme una lectura
  const handleAddReading = ({ bpm, ts }) => {
    setReadings((prev) => [...prev, { bpm, ts }]);
  };

  // Métricas para la tarjeta de alertas
  const metrics = useMemo(
    () => buildDailyMetrics(readings, date),
    [readings, date]
  );

  return (
    <div className={sytles.FrecuenciaCardiaca}>
      <h3 className={sytles.tit}>Frecuencia Cardiaca</h3>
      <div className={sytles.cnt}>
        <div className={sytles.col}>
          <RangoFrecuencias minDia={metrics.minDia} maxDia={metrics.maxDia} />
          <GraficaFrecuenciaCardiaca />
        </div>

        <div className={sytles.col}>
          <FrecuenciaDiaria
            readings={readings}
            date={date}
            onAddReading={handleAddReading}
          />

          <RegistroAlertas
            minDia={metrics.minDia}
            maxDia={metrics.maxDia}
            alertaAlta={metrics.alertaAlta}
            alertaBaja={metrics.alertaBaja}
          />
        </div>

        <div className={sytles.col}>
          <ComparacionSemanal />
          <Alertas
            icono={icoRojo}
            txtA="Tu Frecuencia cardiaca está por encima del promedio de las 2 semanas."
            txtB="Podría deberse a estrés o falta de sueño."
          />
          <div className={sytles.alver}>
            <div className={sytles.sup}>
              <img src={alver} alt="Información" />
              <p>
                Recuerda que tu frecuencia cardiaca puede cambiar según tu nivel
                de actividad, el estrés, el sueño o incluso si tomas café o
                fumas. Es normal que varíe a lo largo del día.
              </p>
            </div>
            <p>* PPM: Pulsaciones por minuto</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrecuenciaCardiaca;
