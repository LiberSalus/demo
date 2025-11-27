// src/pages/SaludFisica/FrecuenciaCardiaca/FrecuenciaCardiaca.jsx

import React, { useState, useMemo } from "react";
import { buildDailyMetrics } from "./RangoFrecuencias/FrecuenciaUtils";

import styles from "./FrecuenciaCardiaca.module.css";

import RangoFrecuencias from "./RangoFrecuencias/RangoFrecuencias";
import GraficaFrecuenciaCardiaca from "./GraficaFrecuenciaCardiaca/GraficaFrecuenciaCardiaca";
import FrecuenciaDiaria from "./RangoFrecuencias/FrecuenicaDiaria";
import RegistroAlertas from "./RangoFrecuencias/RegistroAlertas";
import ComparacionSemanal from "./RangoFrecuencias/ComparacionSemanal";
import Alertas from "./RangoFrecuencias/Alertas";

import alver from "./icoAlver.svg";

const FrecuenciaCardiaca = () => {
  // Lecturas base (de momento mock para probar)
  const [readings, setReadings] = useState([
    { ts: new Date(), bpm: 72 },
    { ts: new Date(new Date().setHours(8, 15)), bpm: 68 },
    { ts: new Date(new Date().setHours(12, 45)), bpm: 88 },
  ]);

  // Día que se está visualizando (hoy)
  const [date] = useState(new Date());

  // Cuando el modal de FrecuenciaDiaria confirme una lectura
  const handleAddReading = ({ bpm, ts }) => {
    setReadings((prev) => [...prev, { bpm, ts }]);
  };

  // Métricas para el día (min, max, alertas, etc.)
  const metrics = useMemo(
    () => buildDailyMetrics(readings, date),
    [readings, date]
  );

  // Saber si el rango del día está fuera de 60–100 ppm
  const fueraDeRango =
    typeof metrics.minDia === "number" &&
    typeof metrics.maxDia === "number" &&
    (metrics.minDia < 60 || metrics.maxDia > 100);

  return (
    <div className={styles.FrecuenciaCardiaca}>
      <h3 className={styles.tit}>Frecuencia cardiaca</h3>

      <div className={styles.cnt}>
        {/* Columna 1: rango + gráfica histórica */}
        <div className={styles.col}>
          <RangoFrecuencias minDia={metrics.minDia} maxDia={metrics.maxDia} />

          {/* Si quieres que la gráfica use estas mismas lecturas, pásalas */}
          <GraficaFrecuenciaCardiaca readings={readings} />
        </div>

        {/* Columna 2: frecuencia diaria + registro de alertas */}
        <div className={styles.col}>
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

        {/* Columna 3: comparación semanal + alertas + texto educativo */}
        <div className={styles.col}>
          <ComparacionSemanal readings={readings} today={date} />

          <Alertas
            fueraDeRango={fueraDeRango}
            minDia={metrics.minDia}
            maxDia={metrics.maxDia}
          />

          <div className={styles.alver}>
            <div className={styles.sup}>
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
