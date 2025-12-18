// src/components/Oxigenacion/MedidorOxigenacion.jsx

import React, { useState } from "react";
import styles from "./MedidorOxigenacion.module.css";
import ActualizacionOxigenacion from "./ActualizacionOxigenacion";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
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
      <div className={styles.card}>
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
        <div className={styles.chartArea}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                type="number"
                dataKey="hora"
                domain={[0, 24]}
                ticks={[0, 6, 12, 18, 24]}
                tick={{ fontSize: "0.85rem", fill: "#333" }}
              />
              <YAxis
                type="number"
                dataKey="spo2"
                domain={[90, 100]}
                ticks={[90, 92, 94, 96, 98, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: "0.85rem", fill: "#333" }}
              />
              <Tooltip
                formatter={(value) => `${value}%`}
                labelFormatter={(hora) => `Hora: ${hora}:00`}
              />
              <Scatter data={mediciones} fill="#0284c7" />
            </ScatterChart>
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
