import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./cuestionarios.module.css";

import { AREAS } from "@/config/cuestionarios.config";
import { getCurrentProfile } from "@/utils/profile";
import {
  getProgressSummary,
  progressState,
  isUnlocked,
  computeAreaPercent,
} from "@/utils/progreso";

import TarjetaListadoAvance from "./TarjetaListadoAvance/TarjetaListadoAvance";
import TarjetaEvaluacion from "@/components/Tarjetas/TarjetaEvaluacion/TarjetaEvaluacion";
import TarjetaProgresoArea from "@/components/Tarjetas/TarjetaProgresoArea/TarjetaProgresoArea";

// iconos por id de área (assets de la sección de cuestionarios)
import fisico from "./fisico.png";
import mental from "./mental.png";
import social from "./social.png";
import nutricional from "./nutricional.png";

const ICONOS_AREA = {
  fisico,
  emocional: mental,
  social,
  nutricional,
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
        const { percent, answeredCount, visiblesCount } = getProgressSummary(
          meta.key || meta.name
        );
        const unlocked = await isUnlocked(meta, byKey);
        return {
          meta,
          href: `/cuestionarios/${areaData.id}/${meta.key}`,
          percent,
          answeredCount,
          visiblesCount,
          state: unlocked ? progressState(percent) : "bloqueado",
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

  // áreas con progreso real (loading → null)
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ok = true;
    (async () => {
      const loaded = await Promise.all(AREAS.map((a) => cargarArea(a, profile)));
      if (!ok) return;
      setAreas(loaded);
    })();
    return () => {
      ok = false;
    };
  }, [profile]);

  // métricas globales
  const resumen = useMemo(() => {
    if (!areas) return null;
    const total = areas.reduce((acc, a) => acc + a.items.length, 0);
    const completados = areas.reduce(
      (acc, a) =>
        acc + a.items.filter((i) => i.unlocked && i.state === "completado").length,
      0
    );
    const enProgreso = areas.reduce(
      (acc, a) => acc + a.items.filter((i) => i.unlocked && i.state === "proceso").length,
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
          {areas.map((area) => {
            const completadas = area.items.filter(
              (i) => i.unlocked && i.state === "completado"
            ).length;
            return (
              <Link
                key={area.id}
                to={`/cuestionarios/${area.id}`}
                className={styles.tarjetaArea}
              >
                <div className={styles.tarjetaAreaHead}>
                  <div className={styles.cntIcon}>
                    <img src={ICONOS_AREA[area.id]} alt={area.name} />
                  </div>
                  <div className={styles.tarjetaAreaTitulo}>
                    <strong>{area.name.split(" ")[0]}</strong>
                    <span>{area.name.split(" ")[1]}</span>
                  </div>
                  <span className={styles.flecha} aria-hidden="true">
                    →
                  </span>
                </div>
                <p className={styles.tarjetaAreaDesc}>
                  {area.descripcion}
                </p>
                <div className={styles.tarjetaAreaPie}>
                  <div
                    className={styles.miniBarra}
                    role="progressbar"
                    aria-valuenow={area.percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progreso de ${area.name}`}
                  >
                    <div
                      className={styles.miniProgreso}
                      style={{ width: `${area.percent}%` }}
                    />
                  </div>
                  <span className={styles.tarjetaAreaPct}>
                    {area.percent}%
                  </span>
                </div>
                <p className={styles.tarjetaAreaMeta}>
                  {completadas} de {area.items.length} completados
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ====== EVALUACIÓN EN CURSO ====== */}
      {evaluacionDestacada && (
        <section className={styles.seccion}>
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

      {/* ====== SEGUIMIENTO POR ÁREA ====== */}
      <section className={styles.seccion}>
        <h2 className={styles.seccionTitulo}>Seguimiento por área</h2>
        <div className={styles.gridSeguimiento}>
          {areas.map((area) => (
            <TarjetaProgresoArea
              key={area.id}
              titulo={area.name}
              percent={area.percent}
              subtitulo={`${area.items.length} instrumentos disponibles`}
              mensaje={
                area.percent === 100
                  ? "¡Completaste todos los cuestionarios de esta área!"
                  : "Completa tus cuestionarios para conocer mejor esta área."
              }
            />
          ))}
        </div>
      </section>

      {/* ====== LISTADO DE AVANCE ====== */}
      {areaActiva && areaActiva.items.length > 0 && (
        <section className={styles.seccion}>
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
  );
};

export default Cuestionarios;
