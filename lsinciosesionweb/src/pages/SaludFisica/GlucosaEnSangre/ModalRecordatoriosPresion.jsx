// mesat/src/components/PresionArterial/ModalRecordatoriosPresion.jsx
import { useState } from "react";
import styles from "./ModalRecordatoriosPresion.module.css";

/**
 * recordatorios: [
 *  {
 *    id: string,
 *    hora: { h: number, m: number, periodo: "AM"|"PM" },
 *    dias: number[], // 0=Dom, 1=Lun, ...
 *    activo: boolean
 *  }
 * ]
 *
 * Props:
 *  - recordatorios
 *  - onChange(nuevaLista)
 *  - onClose()
 */
const horas = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
const minutos = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];
const periodos = ["AM", "PM"];
const diasLabels = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

const formatearDias = (dias) => {
  if (!dias || !dias.length) return "Sin días";
  // opcional: siempre ordenados
  const ordenados = [...dias].sort((a, b) => a - b);
  return ordenados.map((d) => diasLabels[d]).join(" ");
};

export default function ModalRecordatoriosPresion({
  recordatorios = [],
  onChange,
  onClose,
}) {
  const [vista, setVista] = useState("lista"); // "lista" | "config"
  const [modo, setModo] = useState("nuevo"); // "nuevo" | "editar"
  const [editandoId, setEditandoId] = useState(null);

  // estado interno para el nuevo recordatorio
  const [horaSel, setHoraSel] = useState(7);
  const [minSel, setMinSel] = useState("00");
  const [periodoSel, setPeriodoSel] = useState("AM");
  const [diasSel, setDiasSel] = useState([1]); // por defecto lunes

  // --- helpers ---
  const formatearHora = ({ h, m, periodo }) =>
    `${String(h).padStart(2, "0")}:${m} ${periodo.toLowerCase()}`;

  const toggleDia = (idx) => {
    setDiasSel((prev) =>
      prev.includes(idx) ? prev.filter((d) => d !== idx) : [...prev, idx]
    );
  };

  const manejarToggleActivo = (id) => {
    const nueva = recordatorios.map((r) =>
      r.id === id ? { ...r, activo: !r.activo } : r
    );
    onChange?.(nueva);
  };

  const manejarGuardar = () => {
    if (!diasSel.length) return;

    if (modo === "editar" && editandoId) {
      // editar existente
      const nueva = recordatorios.map((r) =>
        r.id === editandoId
          ? {
              ...r,
              hora: { h: horaSel, m: minSel, periodo: periodoSel },
              dias: diasSel.slice().sort(),
            }
          : r
      );
      onChange?.(nueva);
    } else {
      // crear nuevo
      const nuevo = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        hora: { h: horaSel, m: minSel, periodo: periodoSel },
        dias: diasSel.slice().sort(),
        activo: true,
      };
      onChange?.([...recordatorios, nuevo]);
    }

    setVista("lista");
    setModo("nuevo");
    setEditandoId(null);
  };

  const manejarEliminar = () => {
    if (!editandoId) return;
    const nueva = recordatorios.filter((r) => r.id !== editandoId);
    onChange?.(nueva);
    setVista("lista");
    setModo("nuevo");
    setEditandoId(null);
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h4>Mis recordatorios</h4>
          <button className={styles.close} onClick={onClose}>
            ×
          </button>
        </div>
        {vista === "lista" ? (
          <>
            <div className={styles.textoIntro}>
              <h5>¡Es hora de cuidarte!</h5>
              <p>
                No olvides tomarte la presión arterial y anotar tu resultado.
                Cada medición ayuda a cuidar tu salud.
              </p>
            </div>

            <div className={styles.lista}>
              {recordatorios.length === 0 && (
                <p className={styles.sinDatos}>
                  Aún no tienes recordatorios configurados.
                </p>
              )}

              {recordatorios.map((r) => (
                <div
                  key={r.id}
                  className={`${styles.item} ${
                    !r.activo ? styles.itemOff : ""
                  }`}
                >
                  <div className={styles.infoItem}>
                    <button
                      type="button"
                      className={styles.horaItemBtn}
                      onClick={() => {
                        setHoraSel(r.hora.h);
                        setMinSel(r.hora.m);
                        setPeriodoSel(r.hora.periodo);
                        setDiasSel(r.dias);
                        setModo("editar");
                        setEditandoId(r.id);
                        setVista("config");
                      }}
                    >
                      {formatearHora(r.hora)}
                    </button>

                    <span
                      className={styles.diasItem}
                      onClick={() => {
                        // que también abra edición si dale clic a los días
                        setHoraSel(r.hora.h);
                        setMinSel(r.hora.m);
                        setPeriodoSel(r.hora.periodo);
                        setDiasSel(r.dias);
                        setModo("editar");
                        setEditandoId(r.id);
                        setVista("config");
                      }}
                    >
                      {formatearDias(r.dias)}
                    </span>
                  </div>

                  <button
                    className={`${styles.switch} ${
                      r.activo ? styles.switchOn : ""
                    }`}
                    onClick={() => manejarToggleActivo(r.id)}
                  >
                    <span className={styles.switchThumb} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <button
                className={styles.btnSec}
                type="button"
                onClick={() => {
                  // modo NUEVO: reseteamos campos
                  setHoraSel(7);
                  setMinSel("00");
                  setPeriodoSel("AM");
                  setDiasSel([1]);
                  setModo("nuevo");
                  setEditandoId(null);
                  setVista("config");
                }}
              >
                Añadir
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.textoIntro}>
              <p>
                Elige los días y horarios en los que quieres recibir
                recordatorios para tomar tu presión.
              </p>
            </div>

            {/* Hora */}
            <div className={styles.rowCampo}>
              <span className={styles.label}>Hora:</span>
              <div className={styles.timePicker}>
                {/* horas */}
                <div className={styles.timeCol}>
                  <div className={styles.timeScroller}>
                    {horas.map((h) => (
                      <button
                        key={h}
                        type="button"
                        className={`${styles.timeItem} ${
                          horaSel === h ? styles.timeItemSel : ""
                        }`}
                        onClick={() => setHoraSel(h)}
                      >
                        {String(h).padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>

                <span className={styles.timeSep}>:</span>

                {/* minutos */}
                <div className={styles.timeCol}>
                  <div className={styles.timeScroller}>
                    {minutos.map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={`${styles.timeItem} ${
                          minSel === m ? styles.timeItemSel : ""
                        }`}
                        onClick={() => setMinSel(m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* periodo */}
                <div className={styles.timeCol}>
                  <div className={styles.timeScroller}>
                    {periodos.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`${styles.timeItem} ${
                          periodoSel === p ? styles.timeItemSel : ""
                        }`}
                        onClick={() => setPeriodoSel(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Días */}
            <div className={styles.rowCampo}>
              <span className={styles.label}>Días:</span>
              <div className={styles.diasRow}>
                {diasLabels.map((label, idx) => {
                  const activo = diasSel.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.diaBtn} ${
                        activo ? styles.diaBtnActivo : ""
                      }`}
                      onClick={() => toggleDia(idx)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className={styles.nota}>
              * Tus recordatorios aparecerán en la app y ahí mismo te avisaremos
              cuando sea hora de medir tu presión.
            </p>

            <div className={styles.footer}>
              {modo === "editar" && (
                <button
                  type="button"
                  className={styles.btnEliminar}
                  onClick={manejarEliminar}
                >
                  Eliminar
                </button>
              )}

              <button
                className={styles.btnPri}
                type="button"
                onClick={manejarGuardar}
              >
                {modo === "editar" ? "Guardar cambios" : "Aceptar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
