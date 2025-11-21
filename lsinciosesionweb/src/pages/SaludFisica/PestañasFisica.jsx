// src/pages/SaludFisica/PestañasFisica.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./PestañasFisica.module.css";

const PestañasFisica = ({ tabs }) => {
  const [searchParams] = useSearchParams();

  const metricSelected = searchParams.get("metric");

  const [activa, setActiva] = useState(() => {
    if (!tabs || tabs.length === 0) return "";
    const existe = tabs.some((t) => t.medidor === metricSelected);
    return existe ? metricSelected : tabs[0].medidor;
  });

  useEffect(() => {
    if (!metricSelected) return;
    const existe = tabs.some((t) => t.medidor === metricSelected);
    if (existe) setActiva(metricSelected);
  }, [metricSelected, tabs]);

  const pestañaActiva = tabs.find((t) => t.medidor === activa) || tabs[0];
  const ComponenteActivo = pestañaActiva.Component;

  return (
    <div className={styles.PestañasFisica}>
      {/* 🔹 Tus botones con tus clases */}
      <div className={styles.cntBotones}>
        {tabs.map(({ medidor }) => (
          <button
            key={medidor}
            type="button"
            className={`${styles.tabBtn} ${
              medidor === activa ? styles.tabBtnActiva : ""
            }`}
            onClick={() => setActiva(medidor)}
          >
            {medidor}
          </button>
        ))}
      </div>

      {/* 🔹 Contenido de la pestaña activa */}
      <div>
        <ComponenteActivo />
      </div>
    </div>
  );
};

export default PestañasFisica;
