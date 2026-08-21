import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./cuestionarios.module.css";

import { AREAS } from "@/config/cuestionarios.config";
import { getCurrentProfile } from "@/utils/profile";
import { loadAnswers, storageKeyFor } from "@/utils/logicPreg";
import {
  getProgressSummary,
  progressState,
  isUnlocked,
  computeAreaPercent,
} from "@/utils/progreso";
import {
  descargarZipTodo,
  obtenerDatosPaciente,
} from "@/utils/exportarExcel";

import TarjetaListadoAvance from "./TarjetaListadoAvance/TarjetaListadoAvance";
import TarjetaEvaluacion from "@/components/Tarjetas/TarjetaEvaluacion/TarjetaEvaluacion";

// Iconos de áreas (mismos SVGs del Home en public/icons/)
const ICONOS_AREA = {
  fisico: `${import.meta.env.BASE_URL}icons/icoFisico.svg`,
  emocional: `${import.meta.env.BASE_URL}icons/icoEmocional.svg`,
  social: `${import.meta.env.BASE_URL}icons/icoSocial.svg`,
};

// Lee el progreso real de un área (elegibilidad por perfil + desbloqueo).
async function cargarArea(areaData, profile) {
  const byKey = Object.fromEntries(
    (areaData.questionnaires || []).map((q) => [q.key, q])
  );
  const items = await Promise.all(
    (areaData.questionnaires || [])
      .filter((q) => !q.profiles || q.profiles.includes(profile))
      .map(async (meta) => {
        const { percent, answeredCount, visiblesCount, guardado } = getProgressSummary(
          meta.key || meta.name
        );
        const unlocked = await isUnlocked(meta, byKey);
        return {
          meta,
          href: `/cuestionarios/${areaData.id}/${meta.key}`,
          percent,
          answeredCount,
          visiblesCount,
          guardado,
          state: unlocked ? progressState(percent, guardado) : "bloqueado",
          unlocked,
        };
      })
  );
  return {
    id: areaData.id,
    name: areaData.name,
    items,
    percent: computeAreaPercent(items.filter((i) => i.unlocked)),
  };
}

const Cuestionarios = () => {
  const navigate = useNavigate();
  const profile = getCurrentProfile();
  const [exportando, setExportando] = useState(false);

  // áreas con progreso real (loading → null) — excluye nutricional
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ok = true;
    (async () => {
      const areasFiltradas = AREAS.filter((a) => a.id !== "nutricional");
      const loaded = await Promise.all(areasFiltradas.map((a) => cargarArea(a, profile)));
      if (!ok) return;
      setAreas(loaded);
    })();
    return () => {
      ok = false;
    };
  }, [profile]);

  // ¿existe alguna respuesta guardada en alguna categoría? (para habilitar el ZIP)
  const hayRespuestas = useMemo(() =>
    AREAS.some((area) =>
      (area.questionnaires || [])
        .filter((q) => !q.profiles || q.profiles.includes(profile))
        .some((meta) => Object.keys(loadAnswers(storageKeyFor(meta.key || meta.name))).length > 0)
    ),
    [profile]
  );

  // Descarga un .xlsx por categoría con respuestas, empaquetado en ZIP.
  const descargarTodo = async () => {
    if (!hayRespuestas || exportando) return;
    setExportando(true);
    try {
      const incluidos = await descargarZipTodo({ perfil: obtenerDatosPaciente() });
      if (incluidos === 0) {
        alert("No hay respuestas guardadas para exportar.");
      }
    } finally {
      setExportando(false);
    }
  };

  // métricas globales
  const resumen = useMemo(() => {
    if (!areas) return null;
    const total = areas.reduce((acc, a) => acc + a.items.length, 0);
    const completados = areas.reduce(
      (acc, a) =>
        acc + a.items.filter((i) => i.unlocked && (i.state === "completado" || i.state === "pendiente")).length,
      0
    );
    const enProgreso = areas.reduce(
      (acc, a) => acc + a.items.filter((i) => i.unlocked && i.state === "progreso").length,
      0
    );
    return { total, completados, enProgreso };
  }, [areas]);

  // evaluación a destacar: la de mayor progreso (en curso o completada)
  const evaluacionDestacada = useMemo(() => {
    if (!areas) return null;
    const candidatos = [];
    areas.forEach((a) =>
      a.items.forEach((i) => {
        if (i.unlocked) candidatos.push({ ...i, areaName: a.name });
      })
    );
    if (!candidatos.length) return null;
    // prioriza en progreso; entre iguales, el mayor percent
    candidatos.sort((x, y) => {
      if ((x.state === "proceso") !== (y.state === "proceso"))
        return x.state === "proceso" ? -1 : 1;
      return y.percent - x.percent;
    });
    return candidatos[0];
  }, [areas]);

  // área con más actividad para el listado de avance
  const areaActiva = useMemo(() => {
    if (!areas) return null;
    return [...areas].sort((a, b) => b.items.length - a.items.length)[0] || null;
  }, [areas]);

  if (!areas) {
    return (
      <div className={styles.cntCuestionarios}>
        <p className={styles.cargando}>Cargando cuestionarios…</p>
      </div>
    );
  }

  return (
    <div className={styles.cntCuestionarios}>
      {/* ====== HERO ====== */}
      <header className={styles.hero}>
        <div className={styles.heroTop}>
          <span className={styles.badge}>Cuestionarios de bienestar</span>
          <button
            type="button"
            className={styles.btnDescargar}
            onClick={descargarTodo}
            disabled={!hayRespuestas || exportando}
            title={
              hayRespuestas
                ? "Descargar un Excel por categoría (ZIP)"
                : "No hay respuestas para exportar"
            }
          >
            {exportando ? "Generando…" : "Descargar todo (ZIP)"}
          </button>
        </div>
        <h1 className={styles.titulo}>Cuestionarios</h1>
        <p className={styles.descripcion}>
          Responde cuestionarios para comprender mejor tu estado físico,
          emocional, social y nutricional. Tu progreso se guarda
          automáticamente para que lo retomes cuando quieras.
        </p>
        {resumen && (
          <div className={styles.metricas}>
            <div className={styles.metrica}>
              <span className={styles.metricaLabel}>Disponibles</span>
              <span className={styles.metricaValor}>{resumen.total}</span>
            </div>
            <div className={styles.metrica}>
              <span className={styles.metricaLabel}>Completados</span>
              <span className={styles.metricaValor}>{resumen.completados}</span>
            </div>
            <div className={styles.metrica}>
              <span className={styles.metricaLabel}>En progreso</span>
              <span className={styles.metricaValor}>{resumen.enProgreso}</span>
            </div>
          </div>
        )}
      </header>

      {/* ====== ÁREAS ====== */}
      <section className={styles.seccion}>
        <h2 className={styles.seccionTitulo}>Elige un área</h2>
        <div className={styles.gridAreas}>
          {areas.map((area, idx) => {
            const completadas = area.items.filter(
              (i) => i.unlocked && i.state === "completado"
            ).length;
            const colores = {
              fisico: { bg: "#fce4ec", border: "#f8bbd0", accent: "#e91e63" },
              emocional: { bg: "#e3f2fd", border: "#bbdefb", accent: "#2196f3" },
              social: { bg: "#f3e5f5", border: "#e1bee7", accent: "#9c27b0" },
            };
            const color = colores[area.id] || colores.fisico;
            return (
              <div key={area.id} className={styles.areaBloque}>
                <Link
                  to={`/cuestionarios/${area.id}`}
                  className={styles.tarjetaAreaGlass}
                  style={{
                    "--card-bg": color.bg,
                    "--card-border": color.border,
                    "--card-accent": color.accent,
                    animationDelay: `${0.08 * idx}s`,
                  }}
                >
                  <div className={styles.tarjetaAreaIcono}>
                    <img src={ICONOS_AREA[area.id]} alt={area.name} />
                  </div>
                  <div className={styles.tarjetaAreaInfo}>
                    <h3 className={styles.tarjetaAreaNombre}>{area.name}</h3>
                    <p className={styles.tarjetaAreaDesc}>
                      {area.descripcion}
                    </p>
                  </div>
                  <span className={styles.tarjetaAreaFlecha} aria-hidden="true">
                    →
                  </span>
                </Link>

                {/* Progreso justo debajo de la card */}
                <div className={styles.progresoInline}>
                  <div className={styles.progresoInlineHeader}>
                    <span className={styles.progresoInlineNombre}>Progreso</span>
                    <span className={styles.progresoInlinePct}>{area.percent}%</span>
                  </div>
                  <div className={styles.progresoInlineBarra}>
                    <div
                      className={styles.progresoInlineFill}
                      style={{
                        width: `${area.percent}%`,
                        background: color.accent,
                      }}
                    />
                  </div>
                  <p className={styles.progresoInlineMeta}>
                    {completadas} de {area.items.length} cuestionarios completados
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ====== EVALUACIÓN EN CURSO + AVANCE (2 columnas) ====== */}
      <div className={styles.gridInferior}>
        {/* Mi evaluación */}
        {evaluacionDestacada && (
          <section className={styles.seccionGlass}>
            <h2 className={styles.seccionTitulo}>Mi evaluación</h2>
            <div className={styles.cntEvaluacion}>
              <TarjetaEvaluacion
                titulo={evaluacionDestacada.areaName}
                nombreCuestionario={evaluacionDestacada.meta.name}
                percent={evaluacionDestacada.percent}
                estado={
                  evaluacionDestacada.state === "completado"
                    ? "Completado"
                    : "En proceso"
                }
                onContinuar={() => navigate(evaluacionDestacada.href)}
                etiquetaBoton={
                  evaluacionDestacada.state === "completado"
                    ? "Ver respuestas"
                    : "Continuar respondiendo"
                }
              />
            </div>
          </section>
        )}

        {/* Detalle de avance */}
        {areaActiva && areaActiva.items.length > 0 && (
          <section className={styles.seccionGlass}>
            <h2 className={styles.seccionTitulo}>Detalle de avance</h2>
            <div className={styles.cntListado}>
              <TarjetaListadoAvance
                titulo={areaActiva.name}
                items={areaActiva.items.map((i) => ({
                  key: i.meta.key,
                  name: i.meta.name,
                  description: i.meta.description,
                  percent: i.percent,
                  state: i.state,
                  href: i.href,
                }))}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Cuestionarios;
