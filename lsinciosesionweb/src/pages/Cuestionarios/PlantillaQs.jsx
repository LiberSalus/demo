// src/components/Cuestionarios/PlantillaQs.jsx
import React, { useEffect, useMemo, useState } from "react";
import cuestionario from "./propuesta2.json"; // JSON con show_if
import PreguntasQs from "./PreguntasQs";
import styles from "./plantillaQS.module.css";
import { _pickShowIf } from "@/utils/logicPreg";

// assets (ajusta rutas si cambian)
import lista from "./lista.png";
import tiempo from "./tiempo.png";

// helpers de lógica/progreso/storage
import {
  evalShowIf,
  pruneHidden,
  computeProgressPercent,
  storageKeyFor,
  loadAnswers,
  saveAnswers,
} from "@/utils/logicPreg";

const PlantillaQs = () => {
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
  const { percent, visiblesCount } = useMemo(
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

  // Guardar / Limpiar
  const guardarRespuestas = () => {
    saveAnswers(storageKey, respuestas);
    console.log("Respuestas:", respuestas);
    alert("Respuestas guardadas.");
  };

  const limpiarRespuestas = () => {
    setRespuestas({});
    localStorage.removeItem(storageKey);
  };

  // Asegurar campos de área mientras definen definitivo en el JSON
  const area = cuestionario.area || "Físico";
  const areaDesc =
    cuestionario.area_desc ||
    "Explora esta área para conocer hábitos y oportunidades de mejora.";

  return (
    <div className={styles.cntPlantillaQs}>
      {/* ====== BLOQUE DE INFO (manteniendo tu estructura y estilos) ====== */}
      <div className={styles.cntInfo}>
        <h3>Cuestionarios</h3>

        <div className={styles.cntDescripcion}>
          <p>NOMBRE DE CUESTIONARIO:</p>
          <h3>{cuestionario.name}</h3>
          <p>{cuestionario.description}</p>
        </div>

        <div className={styles.cntReactivos}>
          <p>REACTIVOS</p>
          <img src={lista} alt="lista" />
          <p>{visiblesCount}</p>
        </div>

        <div className={styles.cntTiempo}>
          <p>TIEMPO</p>
          <img src={tiempo} alt="tiempo" />
          <p>
            {minutos}
            <span>MIN</span>
          </p>
        </div>

        <div className={styles.cntMono}>
          <button>Bienestar {area}</button>
          <div className={styles.cntModelo}>
            <img src={lista} alt={`Bienestar ${area}`} />
          </div>
          <p>{areaDesc}</p>
        </div>
      </div>

      {/* ====== FORM + PROGRESO ====== */}
      <div className={styles.cntFormulario}>
        <form className={styles.Form}>
          <p>INSTRUCCIONES</p>
          <p>
            Contesta cada una de las siguientes preguntas. Algunas aparecerán
            según tus respuestas. Al finalizar, da clic en{" "}
            <strong>Guardar</strong>.
          </p>

          <div className={styles.cntPreguntas}>
            {visibleQuestions.map((pregunta) => (
              <div key={pregunta.id} className={styles.qAppear}>
                <PreguntasQs
                  pregunta={pregunta}
                  respuesta={respuestas[pregunta.id]}
                  alCambiarRespuesta={manejarCambioRespuesta}
                />
              </div>
            ))}
          </div>
        </form>

        <div className={styles.cntProgreso}>
          <div className={styles.cntBarra}>
            <p className={styles.progresoTxt}>PROGRESO</p>
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
          </div>

          <div className={styles.cntBotones}>
            <button type="button" onClick={guardarRespuestas}>
              Guardar
            </button>
            <button type="button" onClick={limpiarRespuestas}>
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantillaQs;
