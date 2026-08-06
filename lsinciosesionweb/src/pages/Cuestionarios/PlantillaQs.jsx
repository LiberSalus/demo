// src/pages/Cuestionarios/PlantillaQs.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import propuesta2 from "./propuesta2.json"; // JSON con show_if (respaldo)
import PreguntasQs from "./PreguntasQs";
import styles from "./plantillaQs.module.css";
import { _pickShowIf } from "@/utils/logicPreg";

// helpers de lógica/progreso/storage
import {
  evalShowIf,
  pruneHidden,
  computeProgressPercent,
  storageKeyFor,
  loadAnswers,
  saveAnswers,
} from "@/utils/logicPreg";

// Recibe el cuestionario por props (Run.jsx carga el JSON real). Si no llega,
// se mantiene el import local de propuesta2.json como respaldo.
const PlantillaQs = ({ cuestionario: cuestionarioProp, forceArea }) => {
  const cuestionario = cuestionarioProp || propuesta2;

  // clave única para guardar respuestas (usa id o name del cuestionario)
  const storageKey = storageKeyFor(
    cuestionario.id || cuestionario.name || "default"
  );

  const [respuestas, setRespuestas] = useState({});

  // Preguntas visibles según condiciones + respuestas actuales
  const visibleQuestions = useMemo(
    () =>
      cuestionario.list_questions.filter((q) =>
        evalShowIf(respuestas, _pickShowIf(q))
      ),
    [respuestas]
  );

  // Progreso (solo sobre visibles)
  const { percent, answeredCount, visiblesCount } = useMemo(
    () => computeProgressPercent(cuestionario.list_questions, respuestas),
    [respuestas]
  );

  // Tiempo estimado (tu regla: ~1 min por cada 4 preguntas visibles)
  const minutos = Math.max(1, Math.round(visiblesCount / 4));

  // Cambios en respuestas + limpieza recursiva de preguntas que queden ocultas
  const manejarCambioRespuesta = (preguntaId, valorRespuesta) => {
    setRespuestas((prev) => {
      let next = { ...prev, [preguntaId]: valorRespuesta };
      next = pruneHidden(next, cuestionario.list_questions);
      return next;
    });
  };

  // Carga inicial de respuestas (si existen)
  useEffect(() => {
    setRespuestas(loadAnswers(storageKey));
  }, [storageKey]);

  // Persiste tambien el resumen de progreso que leen Area/Inicio (:pct, :ans, :vis)
  const guardarResumenProgreso = () => {
    const { percent, answeredCount, visiblesCount } = computeProgressPercent(
      cuestionario.list_questions,
      respuestas
    );
    localStorage.setItem(`${storageKey}:pct`, String(percent));
    localStorage.setItem(`${storageKey}:ans`, String(answeredCount));
    localStorage.setItem(`${storageKey}:vis`, String(visiblesCount));
  };

  // Guardar / Limpiar
  const guardarRespuestas = () => {
    saveAnswers(storageKey, respuestas);
    guardarResumenProgreso();
    alert("Respuestas guardadas.");
  };

  const limpiarRespuestas = () => {
    setRespuestas({});
    localStorage.removeItem(storageKey);
  };

  // Asegurar campos de área mientras definen definitivo en el JSON
  const area = forceArea || cuestionario.area || "Físico";
  const areaSlug = area.toLowerCase();
  const areaDesc =
    cuestionario.area_desc ||
    "Explora esta área para conocer hábitos y oportunidades de mejora.";

  const completado = percent === 100 && answeredCount > 0;

  return (
    <div className={styles.cntPlantillaQs}>
      {/* ====== HERO: identidad del cuestionario ====== */}
      <header className={styles.hero}>
        <Link to={`/cuestionarios/${areaSlug}`} className={styles.volver}>
          ← Volver a {cuestionario.area || area}
        </Link>

        <div className={styles.heroTop}>
          <span className={styles.badgeArea}>Bienestar {area}</span>
          {completado && (
            <span className={styles.badgeOk}>✓ Completado</span>
          )}
        </div>

        <h1 className={styles.titulo}>{cuestionario.name}</h1>
        <p className={styles.descripcion}>{cuestionario.description}</p>

        <div className={styles.metricas}>
          <div className={styles.metrica}>
            <span className={styles.metricaLabel}>Reactivos</span>
            <span className={styles.metricaValor}>{visiblesCount}</span>
          </div>
          <div className={styles.metrica}>
            <span className={styles.metricaLabel}>Tiempo estimado</span>
            <span className={styles.metricaValor}>
              {minutos} <small>min</small>
            </span>
          </div>
          <div className={styles.metrica}>
            <span className={styles.metricaLabel}>Respondidas</span>
            <span className={styles.metricaValor}>
              {answeredCount}<small>/{visiblesCount}</small>
            </span>
          </div>
        </div>
      </header>

      {/* ====== CUERPO: formulario + panel de progreso ====== */}
      <div className={styles.cuerpo}>
        <form className={styles.formulario} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.instrucciones}>
            <strong className={styles.instruccionesTitulo}>Instrucciones</strong>
            <p className={styles.instruccionesTexto}>
              Contesta cada una de las siguientes preguntas. Algunas aparecerán
              según tus respuestas. Al finalizar, da clic en{" "}
              <strong>Guardar</strong>.
            </p>
          </div>

          <div className={styles.cntPreguntas}>
            {visibleQuestions.map((pregunta, i) => (
              <div key={pregunta.id} className={styles.qAppear}>
                <PreguntasQs
                  pregunta={pregunta}
                  numero={i + 1}
                  respuesta={respuestas[pregunta.id]}
                  alCambiarRespuesta={manejarCambioRespuesta}
                />
              </div>
            ))}
          </div>
        </form>

        {/* Panel lateral sticky con progreso y acciones */}
        <aside className={styles.panel}>
          <div className={styles.panelCard}>
            <p className={styles.progresoTitulo}>Progreso</p>
            <div
              className={styles.barra}
              aria-label="Progreso del cuestionario"
            >
              <div
                className={styles.progreso}
                style={{ width: `${percent}%` }}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                role="progressbar"
              />
            </div>
            <p className={styles.porcentaje}>
              {percent}%
              <small className={styles.porcentajeDetalle}>
                {" "}
                · {answeredCount} de {visiblesCount} reactivos
              </small>
            </p>

            <div className={styles.cntBotones}>
              <button
                type="button"
                className={styles.btnGuardar}
                onClick={guardarRespuestas}
              >
                Guardar respuestas
              </button>
              <button
                type="button"
                className={styles.btnLimpiar}
                onClick={limpiarRespuestas}
              >
                Limpiar
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PlantillaQs;
