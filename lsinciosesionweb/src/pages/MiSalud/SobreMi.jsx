// src/pages/MiSalud/SobreMi.jsx
// "Mi salud a través del tiempo" — hub de Historia clínica.
// Propuesta de UI: resumen del paciente, línea de tiempo cronológica con
// eventos reales (cuestionarios con sus fechas de inicio/finalización),
// familia (en desarrollo) y resultados (puntaje + interpretación).
import React, { useEffect, useMemo, useState } from "react";
import styles from "./sobreMi.module.css";
import { AREAS } from "@/config/cuestionarios.config";
import { getCurrentProfile } from "@/utils/profile";
import { getProgressSummary } from "@/utils/progreso";
import { loadAnswers, storageKeyFor } from "@/utils/logicPreg";
import { obtenerDatosPaciente, calcularPuntaje } from "@/utils/exportarExcel";
import EnDesarrollo from "@/components/EnDesarrollo/EnDesarrollo";

const TABS = [
  { id: "resumen", label: "Resumen" },
  { id: "linea", label: "Línea de tiempo" },
  { id: "familia", label: "Familia" },
  { id: "resultados", label: "Resultados" },
];

const MESES_CORTOS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

// "14/08/2026" → "14 ago 2026"
const fechaLegible = (fecha) => {
  if (!fecha) return "";
  const [d, m, a] = String(fecha).split("/");
  return `${d} ${MESES_CORTOS[Number(m) - 1] || m} ${a}`;
};

// "14/08/2026" → Date comparable
const fechaAComparable = (fecha) => {
  const [d, m, a] = String(fecha).split("/");
  return new Date(`${a}-${m}-${d}`).getTime();
};

export default function SobreMi() {
  const profile = getCurrentProfile();
  const [tab, setTab] = useState("resumen");
  const [estado, setEstado] = useState(null); // { eventos, resultados }

  // Arma la línea de tiempo y los resultados desde las respuestas guardadas.
  useEffect(() => {
    let ok = true;
    (async () => {
      const eventos = [];
      const resultados = [];

      for (const area of AREAS) {
        const elegibles = (area.questionnaires || []).filter(
          (q) => !q.profiles || q.profiles.includes(profile)
        );
        for (const meta of elegibles) {
          const resumen = getProgressSummary(meta.key || meta.name);

          // Eventos de la línea de tiempo (cuando hay fecha registrada)
          if (resumen.fecha) {
            eventos.push({
              fecha: resumen.fecha,
              tipo: "completado",
              titulo: meta.name,
              area: area.name,
            });
          } else if (resumen.inicio) {
            eventos.push({
              fecha: resumen.inicio,
              tipo: "iniciado",
              titulo: meta.name,
              area: area.name,
            });
          }

          // Resultados con puntaje + interpretación (solo si hay respuestas)
          const respuestas = loadAnswers(storageKeyFor(meta.key || meta.name));
          if (!Object.keys(respuestas).length) continue;

          const mod = await meta.file();
          const json = mod.default || mod;
          const completo = resumen.percent === 100 && resumen.answeredCount > 0;
          calcularPuntaje(json, respuestas, { completo }).forEach((r) => {
            resultados.push({
              area: area.name,
              instrumento: json.key || json.id || meta.name,
              subescala: r.subescalaId,
              puntaje: r.puntaje,
              maximo: r.maximo,
              interpretacion: r.interpretacion,
              estado: completo ? "Completado" : "En progreso",
              fecha: resumen.fecha || "",
            });
          });
        }
      }

      eventos.sort((a, b) => fechaAComparable(b.fecha) - fechaAComparable(a.fecha));
      if (!ok) return;
      setEstado({ eventos, resultados });
    })();
    return () => {
      ok = false;
    };
  }, [profile]);

  const paciente = useMemo(() => obtenerDatosPaciente(), []);

  const datosResumen = [
    { etiqueta: "Nombre", valor: paciente.nombre || "—" },
    { etiqueta: "Edad", valor: paciente.edad ? `${paciente.edad} años` : "—" },
    { etiqueta: "Sexo", valor: paciente.sexo || "—" },
    { etiqueta: "Perfil", valor: paciente.perfil || "—" },
    { etiqueta: "Peso", valor: paciente.peso ? `${paciente.peso} kg` : "—" },
    { etiqueta: "Estatura", valor: paciente.estatura ? `${paciente.estatura} cm` : "—" },
    { etiqueta: "Sangre", valor: paciente.sangre || "—" },
    { etiqueta: "Correo", valor: paciente.correo || "—" },
  ];

  return (
    <div className={styles.wrap}>
      {/* ====== HERO ====== */}
      <header className={styles.hero}>
        <div className={styles.heroTop}>
          <span className={styles.badge}>Historia clínica</span>
        </div>
        <h1 className={styles.titulo}>Mi salud a través del tiempo</h1>
        <p className={styles.descripcion}>
          Tu expediente de salud en orden cronológico: quién eres, qué has
          hecho por tu bienestar y cómo ha evolucionado tu salud.
        </p>
      </header>

      {/* ====== TABS ====== */}
      <nav className={styles.tabs} aria-label="Secciones de historia clínica">
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
      {tab === "resumen" && (
        <section className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>Resumen del paciente</h2>
          <div className={styles.gridResumen}>
            {datosResumen.map((dato) => (
              <div key={dato.etiqueta} className={styles.datoCard}>
                <span className={styles.datoLabel}>{dato.etiqueta}</span>
                <span className={styles.datoValor}>{dato.valor}</span>
              </div>
            ))}
          </div>
          <EnDesarrollo
            titulo="Antecedentes y alergias"
            descripcion="Los antecedentes médicos, alergias y datos de contacto de emergencia se integrarán aquí."
          />
        </section>
      )}

      {tab === "linea" && (
        <section className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>Línea de tiempo</h2>
          {!estado ? (
            <p className={styles.cargando}>Cargando tu historial…</p>
          ) : estado.eventos.length === 0 ? (
            <EnDesarrollo
              titulo="Aún no hay eventos"
              descripcion="Cuando completes cuestionarios, registres métricas o agendes citas, aparecerán aquí en orden cronológico."
            />
          ) : (
            <div className={styles.timeline}>
              {estado.eventos.map((evento, i) => (
                <div key={`${evento.fecha}-${i}`} className={styles.evento}>
                  <div
                    className={`${styles.punto} ${
                      evento.tipo === "completado" ? styles.puntoCompletado : ""
                    }`}
                  />
                  <div className={styles.eventoCuerpo}>
                    <span className={styles.eventoFecha}>
                      {fechaLegible(evento.fecha)}
                    </span>
                    <p className={styles.eventoTitulo}>{evento.titulo}</p>
                    <span className={styles.eventoDetalle}>
                      {evento.tipo === "completado"
                        ? "Cuestionario completado"
                        : "Cuestionario iniciado"}
                      {" · "}
                      {evento.area}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "familia" && (
        <section className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>Familia y herencia</h2>
          <EnDesarrollo
            titulo="Árbol genealógico"
            descripcion="Aquí verás los antecedentes de salud de tu familia para entender mejor tu herencia."
          />
        </section>
      )}

      {tab === "resultados" && (
        <section className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>Resultados de evaluaciones</h2>
          {!estado ? (
            <p className={styles.cargando}>Cargando resultados…</p>
          ) : estado.resultados.length === 0 ? (
            <EnDesarrollo
              titulo="Sin evaluaciones todavía"
              descripcion="Completa un cuestionario y su puntaje con interpretación aparecerá aquí."
            />
          ) : (
            <div className={styles.cntTabla}>
              <table className={styles.tabla}>
                <thead>
                  <tr>
                    <th>Área</th>
                    <th>Instrumento</th>
                    <th>Puntaje</th>
                    <th>Interpretación</th>
                    <th>Estado</th>
                    <th>Finalizado</th>
                  </tr>
                </thead>
                <tbody>
                  {estado.resultados.map((r, i) => (
                    <tr key={`${r.instrumento}-${r.subescala}-${i}`}>
                      <td>{r.area}</td>
                      <td>
                        {r.subescala
                          ? `${r.instrumento}-${r.subescala}`
                          : r.instrumento}
                      </td>
                      <td>
                        {r.maximo != null ? `${r.puntaje}/${r.maximo}` : r.puntaje}
                      </td>
                      <td>{r.interpretacion || "—"}</td>
                      <td>
                        <span
                          className={`${styles.estadoPill} ${
                            r.estado === "Completado"
                              ? styles.estadoOk
                              : styles.estadoProceso
                          }`}
                        >
                          {r.estado}
                        </span>
                      </td>
                      <td>{fechaLegible(r.fecha) || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
