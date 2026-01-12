// src/pages/SaludFisica/Oxigenacion/GraficaOxigenacion.jsx
// src/components/Oxigenacion/GraficaOxigenacion.jsx
import React, { useState, useMemo } from "react";
import styles from "./GraficaOxigenacion.module.css";
import ModalDescargaOxigenacion from "./ModalDescargaOxigenacion"; // ✅ ruta a pages

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

const dataDia = [
  { x: 1, spo2: 91 },
  { x: 3, spo2: 93 },
  { x: 4, spo2: 95 },
  { x: 6, spo2: 97 },
  { x: 8, spo2: 92 },
  { x: 10, spo2: 94 },
  { x: 12, spo2: 98 },
  { x: 16, spo2: 90 },
  { x: 20, spo2: 92 },
];

const dataSemana = [
  { x: 1, spo2: 94 },
  { x: 2, spo2: 95 },
  { x: 3, spo2: 93 },
  { x: 4, spo2: 96 },
  { x: 5, spo2: 92 },
  { x: 6, spo2: 94 },
  { x: 7, spo2: 95 },
];

const dataMes = [
  { x: 1, spo2: 93 },
  { x: 5, spo2: 94 },
  { x: 9, spo2: 92 },
  { x: 12, spo2: 95 },
  { x: 18, spo2: 96 },
  { x: 22, spo2: 94 },
  { x: 28, spo2: 93 },
];

const dataAnio = [
  { x: 1, spo2: 94 },
  { x: 2, spo2: 93 },
  { x: 3, spo2: 95 },
  { x: 4, spo2: 96 },
  { x: 6, spo2: 94 },
  { x: 9, spo2: 93 },
  { x: 12, spo2: 95 },
];

const GraficaOxigenacion = () => {
  const [vista, setVista] = useState("dia");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("2025-10-21");
  const [modalAbierto, setModalAbierto] = useState(false); // ✅

  const { data, xDomain, xTicks, xLabelFormatter } = useMemo(() => {
    switch (vista) {
      case "semana":
        return {
          data: dataSemana,
          xDomain: [1, 7],
          xTicks: [1, 2, 3, 4, 5, 6, 7],
          xLabelFormatter: (v) => {
            const dias = ["L", "M", "X", "J", "V", "S", "D"];
            return dias[v - 1] || v;
          },
        };
      case "mes":
        return {
          data: dataMes,
          xDomain: [1, 31],
          xTicks: [1, 5, 10, 15, 20, 25, 30],
          xLabelFormatter: (v) => v,
        };
      case "anio":
        return {
          data: dataAnio,
          xDomain: [1, 12],
          xTicks: [1, 3, 6, 9, 12],
          xLabelFormatter: (v) => {
            const meses = { 1: "Ene", 3: "Mar", 6: "Jun", 9: "Sep", 12: "Dic" };
            return meses[v] || v;
          },
        };
      case "dia":
      default:
        return {
          data: dataDia,
          xDomain: [0, 24],
          xTicks: [0, 6, 12, 18, 24],
          xLabelFormatter: (v) => v,
        };
    }
  }, [vista]);

  const opcionesFecha = [
    { value: "2025-10-21", label: "Mar 21, Oct 2025" },
    { value: "2025-10-20", label: "Lun 20, Oct 2025" },
    { value: "2025-10-19", label: "Dom 19, Oct 2025" },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${vista === "dia" ? styles.tabActiva : ""}`}
          onClick={() => setVista("dia")}
        >
          Día
        </button>
        <button
          type="button"
          className={`${styles.tab} ${vista === "semana" ? styles.tabActiva : ""}`}
          onClick={() => setVista("semana")}
        >
          Semana
        </button>
        <button
          type="button"
          className={`${styles.tab} ${vista === "mes" ? styles.tabActiva : ""}`}
          onClick={() => setVista("mes")}
        >
          Mes
        </button>
        <button
          type="button"
          className={`${styles.tab} ${vista === "anio" ? styles.tabActiva : ""}`}
          onClick={() => setVista("anio")}
        >
          Año
        </button>
      </div>

      <div className={styles.chartArea}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              domain={xDomain}
              ticks={xTicks}
              tickFormatter={xLabelFormatter}
              tick={{ fontSize: "0.85rem", fill: "#333" }}
            />
            <YAxis
              type="number"
              dataKey="spo2"
              domain={[70, 100]}
              ticks={[70, 75, 80, 85, 90, 92, 94, 96, 98, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: "0.85rem", fill: "#333" }}
            />

            <ReferenceLine y={92} stroke="#16a34a" strokeWidth={2} strokeDasharray="3 0" />
            <ReferenceLine y={85} stroke="#fbbf24" strokeWidth={2} strokeDasharray="4 4" />
            <ReferenceLine y={75} stroke="#f97373" strokeWidth={2} strokeDasharray="3 0" />

            <Tooltip formatter={(value) => `${value}%`} labelFormatter={(v) => `Punto: ${v}`} />

            <Scatter data={data} fill="#0284c7" stroke="#0284c7" strokeWidth={1.4} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.fechaSelectWrapper}>
          <select
            className={styles.fechaSelect}
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
          >
            {opcionesFecha.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ aquí ya abre modal */}
        <button
          type="button"
          className={styles.linkReg}
          onClick={() => setModalAbierto(true)}
        >
          Ver registros
        </button>
      </div>

      {/* ✅ aquí renderizamos el modal */}
      <ModalDescargaOxigenacion
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
      />
    </div>
  );
};

export default GraficaOxigenacion;
