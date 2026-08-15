// src/pages/Monitor/Monitor.jsx
// Monitor de salud: panorama completo de indicadores por categoría.
// A diferencia del Inicio (vista personalizada con "Añadir"), aquí se muestran
// TODAS las métricas de cada área con su última lectura, sin modal ni edición.
import React, { useMemo } from "react";
import styles from "./Monitor.module.css";
import { METRICAS_V2 } from "@/features/metricas/config/metricas.config";
import { AREAS_METRICAS } from "@/features/metricas/config/areas.config";
import { obtenerUltimaLecturaMetrica } from "@/features/metricas/services/resumenMetricasInicio";
import { datosPorMedicion } from "@/pages/Inicio/TarjetaSalud/TarjetaMedicion/datosPorMedicion";

import icoFisica from "@/pages/Inicio/TarjetaSalud/icoBienFisico.svg";
import icoMental from "@/pages/Inicio/TarjetaSalud/icoBienMental.svg";
import icoNutri from "@/pages/Inicio/TarjetaSalud/icoBienNutri.svg";

const CATEGORIAS = [
  {
    id: AREAS_METRICAS.SALUD_FISICA,
    nombre: "Salud Física",
    icono: icoFisica,
  },
  {
    id: AREAS_METRICAS.SALUD_MENTAL,
    nombre: "Salud Mental",
    icono: icoMental,
  },
  {
    id: AREAS_METRICAS.SALUD_NUTRICIONAL,
    nombre: "Salud Nutricional",
    icono: icoNutri,
  },
];

// Métricas de una categoría en orden de catálogo.
function metricasDeCategoria(id) {
  return METRICAS_V2.filter((m) => m.area === id).sort((a, b) => a.orden - b.orden);
}

const MonitorDeSalud = () => {
  // Última lectura conocida por métrica (solo lectura; sin edición aquí).
  const lecturas = useMemo(() => {
    const mapa = {};
    METRICAS_V2.forEach((m) => {
      mapa[m.id] = obtenerUltimaLecturaMetrica(m.id);
    });
    return mapa;
  }, []);

  const totalMetricas = METRICAS_V2.length;
  const conLectura = METRICAS_V2.filter((m) => lecturas[m.id] !== "--").length;

  return (
    <div className={styles.wrap}>
      {/* ====== HERO ====== */}
      <header className={styles.hero}>
        <div className={styles.heroTop}>
          <span className={styles.badge}>Monitor de salud</span>
        </div>
        <h1 className={styles.titulo}>Monitor de salud</h1>
        <p className={styles.descripcion}>
          El panorama completo de tus indicadores por categoría. Todas las
          métricas disponibles con su última lectura registrada.
        </p>

        <div className={styles.chips}>
          <div className={styles.chip}>
            <span className={styles.chipLabel}>Categorías</span>
            <span className={styles.chipValor}>{CATEGORIAS.length}</span>
          </div>
          <div className={styles.chip}>
            <span className={styles.chipLabel}>Indicadores</span>
            <span className={styles.chipValor}>{totalMetricas}</span>
          </div>
          <div className={styles.chip}>
            <span className={styles.chipLabel}>Con lectura</span>
            <span className={styles.chipValor}>{conLectura}</span>
          </div>
        </div>
      </header>

      {/* ====== CATEGORÍAS CON TODAS SUS MÉTRICAS ====== */}
      <div className={styles.categorias}>
        {CATEGORIAS.map((categoria, idx) => {
          const metricas = metricasDeCategoria(categoria.id);
          return (
            <section
              key={categoria.id}
              className={styles.categoria}
              style={{ animationDelay: `${0.08 * idx}s` }}
            >
              <header className={styles.categoriaHead}>
                <div className={styles.categoriaIcono}>
                  <img src={categoria.icono} alt="" />
                </div>
                <div className={styles.categoriaInfo}>
                  <h2 className={styles.categoriaTitulo}>{categoria.nombre}</h2>
                  <span className={styles.categoriaMeta}>
                    {metricas.length} indicadores
                  </span>
                </div>
              </header>

              <div className={styles.grid}>
                {metricas.map((metrica) => {
                  const lectura = lecturas[metrica.id];
                  const datos = datosPorMedicion[metrica.label];
                  const tieneLectura = lectura !== "--";
                  return (
                    <div key={metrica.id} className={styles.metricaCard}>
                      <div className={styles.metricaIcono}>
                        {datos?.icono ? (
                          <img src={datos.icono} alt="" />
                        ) : null}
                      </div>
                      <div className={styles.metricaInfo}>
                        <span className={styles.metricaLabel}>
                          {metrica.label}
                        </span>
                        <span className={styles.metricaValor}>
                          {lectura}
                          {metrica.unidad && (
                            <small className={styles.metricaUnidad}>
                              {" "}
                              {metrica.unidad}
                            </small>
                          )}
                        </span>
                      </div>
                      <span
                        className={`${styles.estadoDot} ${
                          tieneLectura ? styles.dotActiva : ""
                        }`}
                        title={
                          tieneLectura
                            ? "Tiene lectura registrada"
                            : "Sin lectura registrada"
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <p className={styles.pie}>
        Vista general de tus indicadores. La personalización con tus métricas
        favoritas vive en tu Inicio.
      </p>
    </div>
  );
};

export default MonitorDeSalud;
