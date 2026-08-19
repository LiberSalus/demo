// src/pages/Cuestionarios/PlantillaQs.jsx
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import propuesta2 from "./propuesta2.json"; // JSON con show_if (respaldo)
import PreguntasQs from "./PreguntasQs";
import styles from "./plantillaQs.module.css";
import ModalGlass from "@/components/ModalGlass/ModalGlass";
import { _pickShowIf } from "@/utils/logicPreg";

// helpers de lógica/progreso/storage
import {
  evalShowIf,
  pruneHidden,
  computeProgressPercent,
  storageKeyFor,
  loadAnswers,
  saveAnswers,
  saveFecha,
  loadFecha,
  removeFecha,
  loadFechaInicio,
  loadFechaFinalizacion,
} from "@/utils/logicPreg";
import {
  construirWorkbookArea,
  descargarXlsx,
  obtenerDatosPaciente,
  fechaArchivo,
} from "@/utils/exportarExcel";

// Recibe el cuestionario por props (Run.jsx carga el JSON real). Si no llega,
// se mantiene el import local de propuesta2.json como respaldo.
const PlantillaQs = ({ cuestionario: cuestionarioProp, forceArea }) => {
  const navigate = useNavigate();
  const cuestionario = cuestionarioProp || propuesta2;

  // clave única para guardar respuestas (usa key > id > name del cuestionario)
  const storageKey = storageKeyFor(
    cuestionario.key || cuestionario.id || cuestionario.name || "default"
  );

  const [respuestas, setRespuestas] = useState({});
  const respuestasOriginales = useRef(null);
  const timerAutoSave = useRef(null);

  // Estados para modales y notificaciones
  const [modalGuardarAbierto, setModalGuardarAbierto] = useState(false);
  const [modalSalirAbierto, setModalSalirAbierto] = useState(false);
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false);
  const [modalCompletadoAbierto, setModalCompletadoAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState("");
  // Estado: true solo DESPUÉS de que el usuario confirma guardar al 100%
  // Se persiste en localStorage para que al volver se mantenga
  const [guardado, setGuardado] = useState(() => {
    return localStorage.getItem(`${storageKey}:guardado`) === "true";
  });

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

  // completado = 100% + YA GUARDADO por el usuario
  const completado = guardado && percent === 100 && answeredCount > 0;
  // sinGuardar = 100% pero AÚN NO ha guardado (puede seguir editando)
  const sinGuardar = !guardado && percent === 100 && answeredCount > 0;
  // soloLectura = solo cuando ya guardó y completó
  const soloLectura = completado;
  const enProgreso = percent < 100;

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
    const iniciales = loadAnswers(storageKey);
    setRespuestas(iniciales);
    respuestasOriginales.current = iniciales;
  }, [storageKey]);

  // Detectar si hay cambios sin guardar
  const hayCambiosSinGuardar = useMemo(() => {
    if (!respuestasOriginales.current) return false;
    const originales = JSON.stringify(respuestasOriginales.current);
    const actuales = JSON.stringify(respuestas);
    return originales !== actuales;
  }, [respuestas]);

  // Alertar al cerrar la pestana/navegador con cambios sin guardar
  useEffect(() => {
    const manejarBeforeUnload = (e) => {
      if (hayCambiosSinGuardar) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", manejarBeforeUnload);
    return () => window.removeEventListener("beforeunload", manejarBeforeUnload);
  }, [hayCambiosSinGuardar]);

  // Persiste tambien el resumen de progreso que leen Area/Inicio (:pct, :ans, :vis)
  const guardarResumenProgreso = useCallback(() => {
    const { percent, answeredCount, visiblesCount } = computeProgressPercent(
      cuestionario.list_questions,
      respuestas
    );
    localStorage.setItem(`${storageKey}:pct`, String(percent));
    localStorage.setItem(`${storageKey}:ans`, String(answeredCount));
    localStorage.setItem(`${storageKey}:vis`, String(visiblesCount));
  }, [cuestionario.list_questions, respuestas, storageKey]);

  // Detectar cuando el usuario llega al 100% y mostrar modal
  // Solo si NO ha guardado aún (sinGuardar)
  useEffect(() => {
    if (sinGuardar && !modalCompletadoAbierto && !modalExitoAbierto) {
      setModalCompletadoAbierto(true);
    }
  }, [sinGuardar]);

  // Auto-guardar progreso con debounce (2 segundos despues del ultimo cambio)
  useEffect(() => {
    if (!hayCambiosSinGuardar) return;
    if (completado) return; // No auto-guardar si ya esta completado

    if (timerAutoSave.current) clearTimeout(timerAutoSave.current);

    timerAutoSave.current = setTimeout(() => {
      saveAnswers(storageKey, respuestas);
      guardarResumenProgreso();
      respuestasOriginales.current = { ...respuestas };

      // Fecha de inicio: se fija con el primer guardado que tenga respuestas
      if (answeredCount > 0 && !loadFecha(storageKey, "inicio")) {
        saveFecha(storageKey, "inicio");
      }

      // Mostrar notificacion
      setNotificacion("Progreso guardado automaticamente");
      setTimeout(() => setNotificacion(""), 3000);
    }, 2000);

    return () => {
      if (timerAutoSave.current) clearTimeout(timerAutoSave.current);
    };
  }, [respuestas, hayCambiosSinGuardar, completado, storageKey, guardarResumenProgreso, answeredCount]);

  // Guardar respuestas (despues de confirmar en modal)
  const ejecutarGuardar = () => {
    saveAnswers(storageKey, respuestas);
    guardarResumenProgreso();
    respuestasOriginales.current = { ...respuestas };

    // Fecha de inicio: se fija con el primer guardado que tenga respuestas
    if (answeredCount > 0 && !loadFecha(storageKey, "inicio")) {
      saveFecha(storageKey, "inicio");
    }
    // Fecha de finalizacion: se fija la primera vez que se completa.
    if (percent === 100 && answeredCount > 0 && !loadFecha(storageKey, "fecha")) {
      saveFecha(storageKey, "fecha");
    }

    setGuardado(true); // Marcar como guardado → activa solo lectura
    localStorage.setItem(`${storageKey}:guardado`, "true"); // Persistir estado
    setModalGuardarAbierto(false);
    setModalExitoAbierto(true);
  };

  // Abrir modal de confirmar guardar
  const abrirModalGuardar = () => {
    setModalGuardarAbierto(true);
  };

  // Cerrar modal de exito y navegar
  const cerrarExitoYNavigate = () => {
    setModalExitoAbierto(false);
    navigate(`/cuestionarios/${areaSlug}`);
  };

  // Confirmar salir (auto-guarda y cierra el modal)
  const confirmarSalir = () => {
    // Auto-guardar progreso antes de salir
    saveAnswers(storageKey, respuestas);
    guardarResumenProgreso();
    respuestasOriginales.current = { ...respuestas };

    if (answeredCount > 0 && !loadFecha(storageKey, "inicio")) {
      saveFecha(storageKey, "inicio");
    }

    setModalSalirAbierto(false);
    navigate(`/cuestionarios/${areaSlug}`);
  };

  // Cancelar salir
  const cancelarSalir = () => {
    setModalSalirAbierto(false);
  };

  const limpiarRespuestas = () => {
    setRespuestas({});
    setGuardado(false);
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${storageKey}:pct`);
    localStorage.removeItem(`${storageKey}:ans`);
    localStorage.removeItem(`${storageKey}:vis`);
    localStorage.removeItem(`${storageKey}:guardado`);
    removeFecha(storageKey, "inicio");
    removeFecha(storageKey, "fecha");
  };

  // Exporta el cuestionario a Excel (hoja paciente + resumen + hoja del instrumento)
  const descargarExcel = () => {
    if (answeredCount === 0) return;
    const perfil = obtenerDatosPaciente();
    const wb = construirWorkbookArea({
      areaName: cuestionario.area || area,
      perfil,
      instrumentos: [
        {
          json: cuestionario,
          respuestas,
          completo: percent === 100 && answeredCount > 0,
          inicio: loadFechaInicio(storageKey),
          fecha: loadFechaFinalizacion(storageKey),
        },
      ],
    });
    descargarXlsx(
      wb,
      `Reporte_${cuestionario.key || cuestionario.id}_${fechaArchivo()}.xlsx`
    );
  };

  // Asegurar campos de área mientras definen definitivo en el JSON
  const area = forceArea || cuestionario.area || "Físico";
  const areaSlug = area.toLowerCase();
  const areaDesc =
    cuestionario.area_desc ||
    "Explora esta área para conocer hábitos y oportunidades de mejora.";

  return (
    <div className={styles.cntPlantillaQs}>
      {/* ====== HERO: identidad del cuestionario ====== */}
      <header className={styles.hero}>
        <Link
          to={`/cuestionarios/${areaSlug}`}
          className={styles.volver}
          onClick={(e) => {
            // Si completó pero no guardó, mostrar modal de guardar
            if (sinGuardar) {
              e.preventDefault();
              setModalSalirAbierto(true);
              return;
            }
            // Si tiene progreso (no completado ni guardado), mostrar modal informativo
            if (answeredCount > 0 && !completado) {
              e.preventDefault();
              setModalSalirAbierto(true);
            }
          }}
        >
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
                  sinRespuesta={!soloLectura && (respuestas[pregunta.id] === undefined || respuestas[pregunta.id] === null || respuestas[pregunta.id] === '')}
                  soloLectura={soloLectura}
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
              {/* Botón Guardar: SOLO visible al 100% y sin guardar aún */}
              {percent === 100 && !completado && (
                <button
                  type="button"
                  className={styles.btnGuardar}
                  onClick={abrirModalGuardar}
                >
                  Guardar respuestas
                </button>
              )}

              {/* Botón Limpiar: visible mientras no esté completado */}
              {!completado && (
                <button
                  type="button"
                  className={styles.btnLimpiar}
                  onClick={limpiarRespuestas}
                >
                  Limpiar
                </button>
              )}

              {/* Mensaje cuando está completado y guardado */}
              {completado && (
                <p className={styles.mensajeCompletado}>
                  Este cuestionario esta completado y no puede editarse.
                </p>
              )}

              {/* Botón Descargar Excel: SOLO visible al 100% */}
              <button
                type="button"
                className={styles.btnDescargar}
                onClick={descargarExcel}
                disabled={!completado}
                title={
                  !completado
                    ? "Completa el 100% del cuestionario para descargar"
                    : "Descargar respuestas en Excel"
                }
              >
                Descargar Excel
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ====== NOTIFICACION ====== */}
      {notificacion && (
        <div className={styles.notificacion}>
          <span className={styles.notificacionIcono}>✓</span>
          {notificacion}
        </div>
      )}

      {/* ====== MODALES ====== */}

      {/* Modal al llegar al 100% (auto-aparece) */}
      <ModalGlass
        abierto={modalCompletadoAbierto}
        onCerrar={() => setModalCompletadoAbierto(false)}
        titulo="🎉 ¡Completaste tu cuestionario!"
        textoBotonConfirmar="Sí, guardar"
        textoBotonCancelar="Revisar respuestas"
        onConfirmar={() => {
          setModalCompletadoAbierto(false);
          ejecutarGuardar();
        }}
        variante="info"
      >
        <p>
          Has respondido todas las preguntas. ¿Deseas guardar tus respuestas ahora?
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          Respondiste <strong>{answeredCount}</strong> de {visiblesCount} preguntas ({percent}%).
        </p>
      </ModalGlass>

      {/* Modal confirmar guardar (botón Guardar) */}
      <ModalGlass
        abierto={modalGuardarAbierto}
        onCerrar={() => setModalGuardarAbierto(false)}
        titulo="⚠️ ¿Estás seguro de guardar?"
        textoBotonConfirmar="Sí, guardar"
        textoBotonCancelar="Revisar respuestas"
        onConfirmar={ejecutarGuardar}
        variante="advertencia"
      >
        <p>
          Al guardar, <strong>no podrás editar</strong> este cuestionario nuevamente.
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          Verifica que tus respuestas sean correctas antes de continuar.
        </p>
      </ModalGlass>

      {/* Modal éxito al guardar */}
      <ModalGlass
        abierto={modalExitoAbierto}
        onCerrar={cerrarExitoYNavigate}
        titulo="✅ ¡Respuestas guardadas!"
        textoBotonConfirmar="Continuar"
        onConfirmar={cerrarExitoYNavigate}
        variante="info"
      >
        <p>Tu cuestionario ha sido guardado y finalizado exitosamente.</p>
        <p style={{ marginTop: "0.5rem" }}>
          Progreso: <strong>{percent}%</strong> · {answeredCount} de {visiblesCount} reactivos
        </p>
      </ModalGlass>

      {/* Modal al salir sin completar (progreso incompleto) */}
      <ModalGlass
        abierto={modalSalirAbierto && !completado}
        onCerrar={cancelarSalir}
        titulo="📋 ¿Salir del cuestionario?"
        textoBotonConfirmar="Salir"
        textoBotonCancelar="Quedarme aquí"
        onConfirmar={confirmarSalir}
        variante="advertencia"
      >
        <p>
          Tu progreso se guardará automáticamente y podrás reanudar cuando quieras.
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          Progreso actual: <strong>{percent}%</strong> · {answeredCount} de {visiblesCount} preguntas respondidas
        </p>
      </ModalGlass>

      {/* Modal al salir con 100% sin guardar */}
      <ModalGlass
        abierto={modalSalirAbierto && completado}
        onCerrar={cancelarSalir}
        titulo="⚠️ Tienes respuestas sin guardar"
        textoBotonConfirmar="Sí, guardar"
        textoBotonCancelar="No guardar"
        onConfirmar={() => {
          setModalSalirAbierto(false);
          ejecutarGuardar();
        }}
        variante="advertencia"
      >
        <p>
          Completaste el cuestionario pero aún no lo has guardado. ¿Deseas guardarlo ahora?
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          Si no guardas, podrás volver a editar tus respuestas más tarde.
        </p>
      </ModalGlass>
    </div>
  );
};

export default PlantillaQs;
