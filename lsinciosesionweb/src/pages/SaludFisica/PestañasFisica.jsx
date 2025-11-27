// src/pages/SaludFisica/PestañasFisica.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./PestañasFisica.module.css";

/**
 * Alias:
 * - Cómo viene de afuera (URL, panel principal)
 * - Cómo lo queremos manejar adentro (nombre del medidor/tab)
 */
const aliasMetricToInterna = {
  SpO2: "Oxigenación",
  Pasos: "Actividad física",
  // si mañana cambian nombres externos, los agregas aquí:
  // "Ritmo cardiaco": "Frecuencia cardiaca",
};

/**
 * Dado un medidor interno ("Oxigenación", "Actividad física"),
 * obtenemos la etiqueta que queremos mostrar en el botón.
 * Por defecto, usamos el mismo texto si no hay alias inverso.
 */
function labelParaMedidorInterno(medidorInterno) {
  // buscar si este medidor interno tiene un alias externo
  const entrada = Object.entries(aliasMetricToInterna).find(
    ([externo, interno]) => interno === medidorInterno
  );
  return entrada ? entrada[0] : medidorInterno;
}

/**
 * Normaliza lo que viene del query param ?metric=
 * a un nombre interno de medidor.
 */
function normalizarMetric(metric) {
  if (!metric) return metric;
  return aliasMetricToInterna[metric] || metric;
}

const PestañasFisica = ({ tabs }) => {
  const [searchParams] = useSearchParams();

  // lo que viene en la URL, ej: "SpO2", "Pasos", "Frecuencia cardiaca"
  const metricSelected = searchParams.get("metric");

  // lo convertimos a nuestro nombre interno
  const metricSelectedInterna = normalizarMetric(metricSelected);

  const [activa, setActiva] = useState(() => {
    if (!tabs || tabs.length === 0) return "";

    // normalizamos la métrica seleccionada
    const candidata = metricSelectedInterna || tabs[0].medidor;

    const existe = tabs.some((t) => t.medidor === candidata);
    return existe ? candidata : tabs[0].medidor;
  });

  // si cambia la URL (?metric=...), actualizamos pestaña activa
  useEffect(() => {
    if (!metricSelectedInterna) return;
    const existe = tabs.some((t) => t.medidor === metricSelectedInterna);
    if (existe) setActiva(metricSelectedInterna);
  }, [metricSelectedInterna, tabs]);

  const pestañaActiva = tabs.find((t) => t.medidor === activa) || tabs[0] || {};
  const ComponenteActivo = pestañaActiva.Component;

  return (
    <div className={styles.PestañasFisica}>
      {/* 🔹 Botones de pestañas */}
      <div className={styles.cntBotones}>
        {tabs.map(({ medidor }) => {
          const etiquetaBtn = labelParaMedidorInterno(medidor);

          return (
            <button
              key={medidor}
              type="button"
              className={`${styles.tabBtn} ${
                medidor === activa ? styles.tabBtnActiva : ""
              }`}
              onClick={() => setActiva(medidor)}
            >
              {labelParaMedidorInterno(medidor)}
            </button>
          );
        })}
      </div>

      {/* 🔹 Contenido de la pestaña activa */}
      <div>
        {ComponenteActivo ? <ComponenteActivo /> : <p>Sin componente</p>}
      </div>
    </div>
  );
};

export default PestañasFisica;
