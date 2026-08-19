// src/pages/Cuestionarios/Area.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import styles from "./area.module.css";

import { findArea } from "@/config/cuestionarios.config";
import { getCurrentProfile } from "@/utils/profile";
import { getProgressSummary, progressState, isUnlocked, computeAreaPercent } from "@/utils/progreso";
import {
  storageKeyFor,
  loadAnswers,
  computeProgressPercent,
  loadFecha,
} from "@/utils/logicPreg";
import { construirWorkbookArea, descargarXlsx, obtenerDatosPaciente, fechaArchivo } from "@/utils/exportarExcel";

const PAGE_SIZE = 12;

const ETIQUETAS_TAB = {
  todos: "Todos",
  no_iniciado: "No iniciado",
  progreso: "En progreso",
  completado: "Completados",
  bloqueado: "Bloqueados",
};

const ETIQUETA_ESTADO = {
  completado: "Completado",
  pendiente: "Pendiente",
  progreso: "En progreso",
  no_iniciado: "No iniciado",
  bloqueado: "Bloqueado",
};

export default function Area() {
  const { area } = useParams();
  const areaData = findArea(area);
  const profile = getCurrentProfile();

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("todos"); // todos | no_iniciado | progreso | completado | bloqueado
  const [page, setPage] = useState(1);
  const [exportando, setExportando] = useState(false);

  const hayRespuestas = items.some((i) => i.answeredCount > 0);

  // Arma el workbook con las hojas de los instrumentos del área que tengan respuestas.
  const descargarExcel = async () => {
    if (!hayRespuestas || exportando) return;
    setExportando(true);
    try {
      const elegibles = (areaData.questionnaires || []).filter(
        (q) => !q.profiles || q.profiles.includes(profile)
      );
      const instrumentos = [];
      for (const meta of elegibles) {
        const mod = await meta.file();
        const json = mod.default || mod;
        const respuestas = loadAnswers(storageKeyFor(meta.key || meta.name));
        if (!Object.keys(respuestas).length) continue;
        const { percent, answeredCount } = computeProgressPercent(
          json.list_questions,
          respuestas
        );
        const completo = percent === 100 && answeredCount > 0;
        // Solo incluir cuestionarios completados (excluir en progreso)
        if (!completo) continue;
        const baseKey = storageKeyFor(meta.key || meta.name);
        instrumentos.push({
          json,
          respuestas,
          completo,
          inicio: loadFecha(baseKey, "inicio"),
          fecha: loadFecha(baseKey, "fecha"),
        });
      }
      if (!instrumentos.length) return;
      const wb = construirWorkbookArea({
        areaName: areaData.name,
        perfil: obtenerDatosPaciente(),
        instrumentos,
      });
      descargarXlsx(
        wb,
        `Reporte_Cuestionarios_${areaData.name.replace(/\s+/g, "_")}_${fechaArchivo()}.xlsx`
      );
    } finally {
      setExportando(false);
    }
  };

  useEffect(() => {
    let ok = true;
    (async () => {
      if (!areaData) return;

      // index por key para desbloqueo
      const byKey = Object.fromEntries(areaData.questionnaires.map(q => [q.key, q]));

      const base = await Promise.all(
        areaData.questionnaires
          .filter(q => !q.profiles || q.profiles.includes(profile)) // elegibles por perfil
          .map(async (meta) => {
            const { percent, answeredCount, visiblesCount, guardado } = getProgressSummary(meta.key || meta.name);
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

      if (!ok) return;
      setItems(base);
    })();
    return () => { ok = false; };
  }, [areaData, profile]);

  // % del área para la tarjeta/hero
  const areaPercent = useMemo(() => computeAreaPercent(items.filter(i=>i.unlocked)), [items]);

  // métricas del hero
  const completados = items.filter(i => i.unlocked && (i.state === "completado" || i.state === "pendiente")).length;
  const enProgreso = items.filter(i => i.unlocked && i.state === "progreso").length;

  // filtros UI
  const filtered = useMemo(() => {
    const norm = (s) => (s || "").toLowerCase();
    const qn = norm(q);
    return items.filter(({ meta, state }) => {
      const hitText =
        norm(meta.name).includes(qn) ||
        norm(meta.description).includes(qn) ||
        norm(meta.key).includes(qn);
      const hitTab = tab === "todos"
        ? true
        : tab === "completado"
          ? (state === "completado" || state === "pendiente")
          : (state === tab);
      return hitText && hitTab;
    });
  }, [items, q, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (pageSafe - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pageSafe]);

  useEffect(()=>{ setPage(1);} , [q, tab]);

  if (!areaData) return <Navigate to="/cuestionarios" replace />;

  return (
      <div className={styles.wrap}>
        {/* ====== HERO del área ====== */}
        <header className={styles.hero}>
          <Link to="/cuestionarios" className={styles.volver}>Ver todos los cuestionarios</Link>
          <div className={styles.heroTop}>
            <span className={styles.badge}>Área de bienestar</span>
            <button
              type="button"
              className={styles.btnDescargar}
              onClick={descargarExcel}
              disabled={!hayRespuestas || exportando}
              title={
                hayRespuestas
                  ? "Descargar respuestas en Excel"
                  : "No hay respuestas para exportar"
              }
            >
              {exportando ? "Generando…" : "Descargar Excel"}
            </button>
          </div>
          <h1 className={styles.titulo}>{areaData.name}</h1>
          <p className={styles.descripcion}>{areaData.descripcion}</p>
          <div className={styles.metricas}>
            <div className={styles.metrica}>
              <span className={styles.metricaLabel}>Instrumentos</span>
              <span className={styles.metricaValor}>{items.length}</span>
            </div>
            <div className={styles.metrica}>
              <span className={styles.metricaLabel}>Completados</span>
              <span className={styles.metricaValor}>{completados}</span>
            </div>
            <div className={styles.metrica}>
              <span className={styles.metricaLabel}>En progreso</span>
              <span className={styles.metricaValor}>{enProgreso}</span>
            </div>
            <div className={styles.metrica}>
              <span className={styles.metricaLabel}>Avance del área</span>
              <span className={styles.metricaValor}>{areaPercent}%</span>
            </div>
          </div>
        </header>

        {/* ====== CONTROLES ====== */}
        <div className={styles.controls}>
          <input
            className={styles.search}
            placeholder="Buscar instrumento…"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
          <div className={styles.tabs}>
            {Object.entries(ETIQUETAS_TAB).map(([clave, etiqueta]) => (
              <button
                key={clave}
                className={`${styles.tab} ${tab===clave ? styles.tabActive : ""}`}
                onClick={()=>setTab(clave)}
              >
                {etiqueta}
              </button>
            ))}
          </div>
        </div>

        {/* ====== LISTA ====== */}
        {pageItems.length===0 ? (
          <p className={styles.empty}>No hay cuestionarios con esos filtros.</p>
        ) : (
          <div className={styles.grid}>
            {pageItems.map(({ meta, percent, answeredCount, visiblesCount, state, href, unlocked }) => (
              <div key={meta.key} className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.pill}>{meta.key}</span>
                  <span className={`${styles.badge} ${styles[state]}`}>
                    {ETIQUETA_ESTADO[state]}
                  </span>
                </div>
                <h3 className={styles.cardTitulo}>{meta.name}</h3>
                <p className={styles.desc}>{meta.description}</p>

                <div className={styles.progressRow}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progress}
                      style={{ width: `${percent}%` }}
                      role="progressbar"
                      aria-valuenow={percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Progreso de ${meta.name}`}
                    />
                  </div>
                  <span className={styles.percent}>{percent}%</span>
                </div>
                <div className={styles.metaRow}>
                  <span>{answeredCount}/{visiblesCount} respondidas</span>
                </div>

                <div className={styles.actions}>
                  {unlocked ? (
                    <Link to={href} className={styles.cta}>
                      {percent === 100 ? "Ver respuestas" : percent > 0 ? "Continuar" : "Iniciar"}
                    </Link>
                  ) : (
                    <button className={styles.ctaDisabled} disabled>Bloqueado</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ====== PAGINACIÓN ====== */}
        {totalPages > 1 && (
          <div className={styles.pager}>
            <button
              className={styles.pgBtn}
              disabled={pageSafe<=1}
              onClick={()=>setPage(p=>Math.max(1,p-1))}
            >
              ← Anterior
            </button>
            <span className={styles.pgInfo}>{pageSafe} / {totalPages}</span>
            <button
              className={styles.pgBtn}
              disabled={pageSafe>=totalPages}
              onClick={()=>setPage(p=>Math.min(totalPages,p+1))}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
  );
}
