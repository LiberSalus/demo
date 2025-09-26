// src/pages/Cuestionarios/Area.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Principal from "@/Layout/Principal";
import styles from "./area.module.css";

import { findArea } from "@/config/cuestionarios.config";
import { getCurrentProfile } from "@/utils/profile";
import { getProgressSummary, progressState, isUnlocked, computeAreaPercent } from "@/utils/progreso";

const PAGE_SIZE = 12;

export default function Area() {
  const { area } = useParams();
  const areaData = findArea(area);
  const profile = getCurrentProfile();

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("todos"); // todos | no_iniciado | progreso | completado | bloqueado
  const [page, setPage] = useState(1);

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
            const { percent, answeredCount, visiblesCount } = getProgressSummary(meta.key || meta.name);
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

      if (!ok) return;
      setItems(base);
    })();
    return () => { ok = false; };
  }, [areaData, profile]);

  // % del área para tu tarjeta de área
  const areaPercent = useMemo(() => computeAreaPercent(items.filter(i=>i.unlocked)), [items]);

  // filtros UI
  const filtered = useMemo(() => {
    const norm = (s) => (s || "").toLowerCase();
    const qn = norm(q);
    return items.filter(({ meta, state }) => {
      const hitText =
        norm(meta.name).includes(qn) ||
        norm(meta.description).includes(qn) ||
        norm(meta.key).includes(qn);
      const hitTab = tab === "todos" ? true : (state === tab);
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
    <Principal>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <Link to="/cuestionarios" className={styles.back}>← Volver</Link>
          <h2>{areaData.name} · <span className={styles.pctArea}>{areaPercent}%</span></h2>
        </div>

        <div className={styles.controls}>
          <input className={styles.search} placeholder="Buscar…" value={q} onChange={(e)=>setQ(e.target.value)} />
          <div className={styles.tabs}>
            {["todos","no_iniciado","progreso","completado","bloqueado"].map(t => (
              <button
                key={t}
                className={`${styles.tab} ${tab===t ? styles.tabActive : ""}`}
                onClick={()=>setTab(t)}
              >
                {t.replace("_"," ")}
              </button>
            ))}
          </div>
        </div>

        {pageItems.length===0 ? (
          <p className={styles.empty}>No hay cuestionarios con esos filtros.</p>
        ) : (
          <div className={styles.grid}>
            {pageItems.map(({ meta, percent, answeredCount, visiblesCount, state, href, unlocked }) => (
              <div key={meta.key} className={styles.card}>
                <div className={styles.cardHead}>
                  <h3>{meta.name}</h3>
                  <span className={`${styles.badge} ${styles[state]}`}>
                    {state === "completado" ? "Completado" :
                     state === "progreso"   ? "En progreso" :
                     state === "no_iniciado"? "No iniciado" : "Bloqueado"}
                  </span>
                </div>
                <p className={styles.desc}>{meta.description}</p>

                <div className={styles.progressRow}>
                  <div className={styles.progressBar}><div className={styles.progress} style={{width:`${percent}%`}}/></div>
                  <span className={styles.percent}>{percent}%</span>
                </div>
                <div className={styles.metaRow}>
                  <span>{answeredCount}/{visiblesCount} respondidas</span>
                </div>

                <div className={styles.actions}>
                  {unlocked ? (
                    <Link to={href} className={styles.cta}>Continuar</Link>
                  ) : (
                    <button className={styles.ctaDisabled} disabled>Bloqueado</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.pager}>
          <button className={styles.pgBtn} disabled={pageSafe<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Anterior</button>
          <span className={styles.pgInfo}>{pageSafe} / {totalPages}</span>
          <button className={styles.pgBtn} disabled={pageSafe>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Siguiente</button>
        </div>
      </div>
    </Principal>
  );
}
