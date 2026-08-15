// src/pages/MisConsultas/Areas.jsx
// "Mi cuidado diario" — hub de recomendaciones de salud.
// Propuesta de UI: feed diario de recomendaciones accionables ("Hoy"),
// con Mi plan, Avance y Susurros como secciones en desarrollo.
import React, { useEffect, useMemo, useState } from "react";
import styles from "./cuidadoDiario.module.css";
import { AREAS } from "@/config/cuestionarios.config";
import { getCurrentProfile } from "@/utils/profile";
import { getProgressSummary } from "@/utils/progreso";
import EnDesarrollo from "@/components/EnDesarrollo/EnDesarrollo";

import icoResultados from "./icons/icoResultados.svg";
import icoHidratacion from "./icons/icoHidratacion.svg";
import icoCalma from "./icons/icoCalma.svg";
import icoMovimiento from "./icons/icoMovimiento.svg";

const TABS = [
  { id: "hoy", label: "Hoy" },
  { id: "plan", label: "Mi plan" },
  { id: "avance", label: "Avance" },
  { id: "susurros", label: "Susurros" },
];

// Recomendaciones de ejemplo (el motor de reglas se integrará después).
// Cada tarjeta: icono (SVG), titulo, descripcion y accion.
const RECOMENDACIONES_BASE = [
  {
    id: "hidratacion",
    icono: icoHidratacion,
    titulo: "Hidrátate",
    descripcion:
      "Tu consumo de agua puede mejorar. Bebe un vaso de agua ahora y lleva un registro.",
    accion: "Registrar agua",
  },
  {
    id: "bienestar",
    icono: icoCalma,
    titulo: "Momento de calma",
    descripcion:
      "Tómate 5 minutos para respirar. Las pequeñas pausas ayudan a tu bienestar emocional.",
    accion: "Empezar",
  },
  {
    id: "movimiento",
    icono: icoMovimiento,
    titulo: "Muévete un poco",
    descripcion:
      "Moverte un poco más cada día hace la diferencia. Da una caminata corta hoy.",
    accion: "Ver reto",
  },
];

export default function MiCuidadoDiario() {
  const profile = getCurrentProfile();
  const [tab, setTab] = useState("hoy");
  const [resumen, setResumen] = useState(null); // { completados, enProgreso, evaluar }

  // Resumen de evaluaciones para personalizar el feed.
  useEffect(() => {
    let completados = 0;
    let enProgreso = 0;
    for (const area of AREAS) {
      for (const q of area.questionnaires || []) {
        if (q.profiles && !q.profiles.includes(profile)) continue;
        const s = getProgressSummary(q.key || q.name);
        if (s.percent >= 100 && s.answeredCount > 0) completados += 1;
        else if (s.percent > 0) enProgreso += 1;
      }
    }
    setResumen({ completados, enProgreso });
  }, [profile]);

  // Primera tarjeta data-aware: invita a revisar resultados si hay evaluaciones.
  const recomendaciones = useMemo(() => {
    if (!resumen) return RECOMENDACIONES_BASE;
    const primera = {
      id: "resultados",
      icono: icoResultados,
      titulo:
        resumen.completados > 0
          ? "Revisa tus resultados"
          : "Empieza con una evaluación",
      descripcion:
        resumen.completados > 0
          ? `Tienes ${resumen.completados} evaluación(es) completada(s) y ${resumen.enProgreso} en progreso. Conoce lo que dicen sobre tu salud.`
          : "Completa un cuestionario para recibir recomendaciones más precisas para ti.",
      accion: resumen.completados > 0 ? "Ver resultados" : "Ir a cuestionarios",
    };
    return [primera, ...RECOMENDACIONES_BASE];
  }, [resumen]);

  return (
    <div className={styles.wrap}>
      {/* ====== HERO ====== */}
      <header className={styles.hero}>
        <div className={styles.heroTop}>
          <span className={styles.badge}>Recomendaciones de salud</span>
        </div>
        <h1 className={styles.titulo}>Mi cuidado diario</h1>
        <p className={styles.descripcion}>
          Recomendaciones personalizadas para cuidarte hoy. Cada sugerencia
          nace de lo que tu salud te está contando.
        </p>
        <div className={styles.chips}>
          <div className={styles.chip}>
            <span className={styles.chipLabel}>Evaluaciones completadas</span>
            <span className={styles.chipValor}>{resumen?.completados ?? "…"}</span>
          </div>
          <div className={styles.chip}>
            <span className={styles.chipLabel}>En progreso</span>
            <span className={styles.chipValor}>{resumen?.enProgreso ?? "…"}</span>
          </div>
          <div className={styles.chip}>
            <span className={styles.chipLabel}>Recomendaciones hoy</span>
            <span className={styles.chipValor}>{recomendaciones.length}</span>
          </div>
        </div>
      </header>

      {/* ====== TABS ====== */}
      <nav className={styles.tabs} aria-label="Secciones de cuidado diario">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.tab} ${tab === t.id ? styles.tabActiva : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* ====== CONTENIDO ====== */}
      {tab === "hoy" && (
        <section className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>Recomendaciones para ti hoy</h2>
          <div className={styles.feed}>
            {recomendaciones.map((rec) => (
              <article key={rec.id} className={styles.tarjetaRec}>
                <div className={styles.recIcono} aria-hidden="true">
                  <img src={rec.icono} alt={rec.titulo} />
                </div>
                <div className={styles.recInfo}>
                  <h3 className={styles.recTitulo}>{rec.titulo}</h3>
                  <p className={styles.recDescripcion}>{rec.descripcion}</p>
                </div>
                <button type="button" className={styles.recAccion}>
                  {rec.accion}
                </button>
              </article>
            ))}
          </div>
          <p className={styles.pie}>
            El motor de reglas se está construyendo: muy pronto las
            recomendaciones se generarán con tus métricas y evaluaciones.
          </p>
        </section>
      )}

      {tab === "plan" && (
        <section className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>Mi plan de cuidado</h2>
          <EnDesarrollo
            titulo="Plan personalizado"
            descripcion="Aquí se armará tu plan de cuidado con pasos concretos según tu salud."
          />
        </section>
      )}

      {tab === "avance" && (
        <section className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>Mi avance</h2>
          <EnDesarrollo
            titulo="Cómo voy avanzando"
            descripcion="Verás tu progreso en hábitos, retos y metas de salud."
          />
        </section>
      )}

      {tab === "susurros" && (
        <section className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>Susurros de salud</h2>
          <EnDesarrollo
            titulo="Lo que tu salud te dice"
            descripcion="Mensajes y señales que tu cuerpo te envía, explicados con claridad."
          />
        </section>
      )}
    </div>
  );
}
