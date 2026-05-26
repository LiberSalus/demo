// src/pages/SaludFisica/PestañasFisica.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
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
  // "Ritmo cardiaco": "Frecuencia cardiaca",
};

/** Normaliza lo que viene del query param o tabs a nombre interno */
function normalizarMetric(metric) {
  if (!metric) return metric;
  return aliasMetricToInterna[metric] || metric;
}

/** Convierte interno → externo (solo si existe alias), útil para URL */
function externaParaInterna(medidorInterno) {
  const entrada = Object.entries(aliasMetricToInterna).find(
    ([, interno]) => interno === medidorInterno
  );
  return entrada ? entrada[0] : medidorInterno;
}

const PestañasFisica = ({ tabs = [] }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ 1) Normalizamos los tabs para que la UI use SIEMPRE nombres internos “bonitos”
  const tabsNorm = useMemo(() => {
    return (tabs || []).map((t) => {
      const medidorInterno = normalizarMetric(t.medidor);
      return {
        ...t,
        medidorInterno,
      };
    });
  }, [tabs]);

  // lo que viene en la URL, ej: "SpO2", "Pasos", "Frecuencia cardiaca"
  const metricSelected = searchParams.get("metric");
  const metricSelectedInterna = useMemo(
    () => normalizarMetric(metricSelected),
    [metricSelected]
  );

  // ✅ 2) Estado activo SIEMPRE en interno
  const initialActiva = useMemo(() => {
    if (!tabsNorm.length) return "";
    const candidata = metricSelectedInterna || tabsNorm[0].medidorInterno;
    const existe = tabsNorm.some((t) => t.medidorInterno === candidata);
    return existe ? candidata : tabsNorm[0].medidorInterno;
  }, [tabsNorm, metricSelectedInterna]);

  const [activa, setActiva] = useState(initialActiva);

  useEffect(() => {
    if (!tabsNorm.length) return;
    setActiva(initialActiva);
  }, [tabsNorm, initialActiva]);

  // ✅ 3) Click: activa interno + actualiza URL (opcionalmente con alias externo)
  const onSelectTab = useCallback(
    (medidorInterno) => {
      setActiva(medidorInterno);

      // Para URL: si tiene alias externo, lo usamos; si no, dejamos el interno
      const metricForUrl = externaParaInterna(medidorInterno);

      const next = new URLSearchParams(searchParams);
      next.set("metric", metricForUrl);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const pestañaActiva =
    tabsNorm.find((t) => t.medidorInterno === activa) || tabsNorm[0];

  const ComponenteActivo = pestañaActiva?.Component;

  return (
    <div className={styles.PestañasFisica}>
      {/* 🔹 Botones de pestañas */}
      <div className={styles.cntBotones}>
        {tabsNorm.map((t) => (
          <button
            key={t.medidorInterno}
            type="button"
            className={`${styles.tabBtn} ${
              t.medidorInterno === activa ? styles.tabBtnActiva : ""
            }`}
            onClick={() => onSelectTab(t.medidorInterno)}
          >
            {/* ✅ Aquí SIEMPRE se verá “Oxigenación” y “Actividad física” */}
            {t.medidorInterno}
          </button>
        ))}
      </div>

      {/* 🔹 Contenido de la pestaña activa */}
      <div>{ComponenteActivo ? <ComponenteActivo /> : <p>Sin componente</p>}</div>
    </div>
  );
};

export default PestañasFisica;
