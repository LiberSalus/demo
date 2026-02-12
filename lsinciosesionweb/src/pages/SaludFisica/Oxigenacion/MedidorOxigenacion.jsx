// src/components/Oxigenacion/MedidorOxigenacion.jsx

import React, { useState } from "react";
import styles from "./MedidorOxigenacion.module.css";
import ActualizacionOxigenacion from "./ActualizacionOxigenacion";
import {
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// datos iniciales de ejemplo
const dataInicial = [
  { hora: 1, spo2: 92 },
  { hora: 3, spo2: 94 },
  { hora: 5, spo2: 97 },
  { hora: 7, spo2: 93 },
  { hora: 9, spo2: 95 },
  { hora: 11, spo2: 98 },
  { hora: 15, spo2: 94 },
];

const MedidorOxigenacion = ({ onUpdateOxi }) => {
  const [openModal, setOpenModal] = useState(false);
  const [spo2, setSpo2] = useState(96);

  const [mediciones, setMediciones] = useState(dataInicial);
  const [valorActual, setValorActual] = useState(94);
  const [ultimaActualizacion, setUltimaActualizacion] = useState("Hace 1 hora");

  const [showConfirm, setShowConfirm] = useState(false);
  const [fechaConfirm, setFechaConfirm] = useState("");

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const valorNum = Number(spo2);
    if (Number.isNaN(valorNum)) return;

    const ahora = new Date();
    const nuevaMedicion = {
      hora: ahora.getHours(),
      spo2: valorNum,
    };

    setMediciones((prev) => [...prev, nuevaMedicion]);
    setValorActual(valorNum);
    setUltimaActualizacion("Hace unos segundos");

    // 🔥 avisamos al padre
    if (onUpdateOxi) {
      console.log("enviando a padre", valorNum);
      onUpdateOxi(valorNum);
    }

    const fechaTexto = ahora.toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setFechaConfirm(fechaTexto);
    setOpenModal(false);
    setShowConfirm(true);
  };

  const fechaMostrar = new Date().toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <div className={styles.MedidorOxigenacion}>
        {/* Header */}
        <div className={styles.header}>
          <p className={styles.titulo}>Oxigenación diaria</p>

          <div className={styles.cntValor}>
            <p className={styles.valor}>
              {valorActual}
              <span className={styles.simbolo}> %</span>
            </p>
            <p className={styles.sub}>
              Última actualización:
              <br />
              <span className={styles.tiempo}>{ultimaActualizacion}</span>
            </p>
          </div>
        </div>

        {/* Chart */}
        {/* Chart */}
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart
              data={mediciones}
              margin={{ top: 10, right: 20, bottom: 0, left: -20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <ReferenceLine
                y={100}
                stroke="#16a34a"
                strokeWidth={1.9}
                strokeDasharray="10 10"
              />
              <ReferenceLine
                y={95}
                stroke="#ffd93d"
                strokeWidth={1.9}
                strokeDasharray="10 10"
              />
              <ReferenceLine
                y={90}
                stroke="#ff9f1c"
                strokeWidth={1.9}
                strokeDasharray="10 10"
              />
              <ReferenceLine
                y={100}
                stroke="#16a34a"
                strokeWidth={1.9}
                strokeDasharray="10 10"
              />

              <XAxis
                type="number"
                dataKey="hora"
                domain={[0, 24]}
                ticks={[0, 6, 12, 18, 24]}
                tickFormatter={(v) => `${String(v).padStart(2, "0")}:00`}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={true}
                tickLine={false}
                className={styles.font}
              />

              <YAxis
                type="number"
                domain={[90, 100]}
                ticks={[90, 92, 94, 96, 98, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                className={styles.font}
              />

              <Tooltip
                formatter={(value) => [`${value}%`, "SpO₂"]}
                labelFormatter={(hora) =>
                  `Hora: ${String(hora).padStart(2, "0")}:00`
                }
                labelStyle={{ fontSize: "0.75rem" }}
                contentStyle={{ fontSize: "0.75rem", borderRadius: "0.5rem" }}
              />

              {/* ✅ Línea de unión (igual patrón) */}
              <Line
                type="monotone"
                dataKey="spo2"
                stroke="#fd908d"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />

              {/* ✅ Puntos pequeños con borde blanco */}
              <Scatter
                dataKey="spo2"
                fill="#fd908d"
                stroke="#fd908d"
                strokeWidth={1}
                shape={({ cx, cy }) => {
                  if (cx == null || cy == null) return null;
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={3.5} fill="#ffffff" />
                      <circle cx={cx} cy={cy} r={2.6} fill="#fd908d" />
                    </g>
                  );
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Footer botón */}
        <div className={styles.footer}>
          <button type="button" className={styles.btnAdd} onClick={handleOpen}>
            <span className={styles.icoMas}>＋</span>
            <span>Añadir</span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <button
              type="button"
              className={styles.btnCerrar}
              onClick={handleClose}
            >
              ×
            </button>

            <h2 className={styles.modalTit}>Ingresa tus datos</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.campo}>
                <label className={styles.label}>Fecha y hora:</label>
                <p className={styles.fecha}>{fechaMostrar}</p>
              </div>

              <div className={styles.campo}>
                <label className={styles.label}>
                  Oxigenación en sangre SpO₂:
                </label>
                <div className={styles.pastillaInput}>
                  <input
                    type="number"
                    min={70}
                    max={100}
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    className={styles.inputSpo2}
                  />
                  <span className={styles.unidad}>%</span>
                </div>
              </div>

              <div className={styles.recomendaciones}>
                <p className={styles.recTit}>Recomendaciones:</p>
                <p className={styles.recSub}>
                  Antes de medir tu SpO₂ manualmente:
                </p>
                <ol className={styles.recLista}>
                  <li>Mantén las manos limpias y tibias.</li>
                  <li>Procura no moverte durante la lectura.</li>
                  <li>
                    Asegúrate de que tus uñas estén libres de esmalte o uñas
                    postizas.
                  </li>
                </ol>
                <p className={styles.recPie}>
                  Descansa al menos 5 minutos antes de tomar la lectura.
                </p>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnAceptar}
                  onClick={handleSubmit}
                >
                  Aceptar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Mensaje de actualización correcta */}
      {showConfirm && (
        <ActualizacionOxigenacion
          fechaHora={fechaConfirm}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};

export default MedidorOxigenacion;
