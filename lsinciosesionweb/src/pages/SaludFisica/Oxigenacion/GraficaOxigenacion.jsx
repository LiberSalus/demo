// src/pages/SaludFisica/Oxigenacion/GraficaOxigenacion.jsx
// (o src/components/Oxigenacion/GraficaOxigenacion.jsx)
import React, { useState, useMemo } from "react";
import styles from "./GraficaOxigenacion.module.css";
import ModalDescargaOxigenacion from "./ModalDescargaOxigenacion";

import {
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  AreaChart, Area,
} from "recharts";

const MOCK_DIA = [
  { x: 1, spo2: 91 },
  { x: 3, spo2: 93 },
  { x: 4, spo2: 95 },
  { x: 6, spo2: 97 },
  { x: 8, spo2: 92 }, 
  { x: 10, spo2: 94 },
  { x: 12, spo2: 98 },
  { x: 16, spo2: 90 },
  { x: 20, spo2: 92 },
  { x: 22, spo2: 105 },
  
];

const MOCK_SEMANA = [
  { x: 1, spo2: 94 },
  { x: 2, spo2: 95 },
  { x: 3, spo2: 93 },
  { x: 4, spo2: 96 },
  { x: 5, spo2: 92 },
  { x: 6, spo2: 94 },
  { x: 7, spo2: 95 },
];

const MOCK_MES = [
  { x: 1, spo2: 93 },
  { x: 5, spo2: 94 },
  { x: 9, spo2: 92 },
  { x: 12, spo2: 95 },
  { x: 18, spo2: 96 },
  { x: 22, spo2: 94 },
  { x: 28, spo2: 93 },
];

const MOCK_ANIO = [
  { x: 1, spo2: 94 },
  { x: 2, spo2: 93 },
  { x: 3, spo2: 95 },
  { x: 4, spo2: 96 },
  { x: 6, spo2: 94 },
  { x: 9, spo2: 93 },
  { x: 12, spo2: 95 },
];

const GraficaOxigenacion = ({
  dataDia = MOCK_DIA,
  dataSemana = MOCK_SEMANA,
  dataMes = MOCK_MES,
  dataAnio = MOCK_ANIO,
}) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vista, setVista] = useState("semana");

  const { data, xDomain, xTicks, xLabelFormatter } = useMemo(() => {
    switch (vista) {
      case "semana":
        return {
          data: dataSemana,
          xDomain: [1, 7],
          xTicks: [1, 2, 3, 4, 5, 6, 7],
          xLabelFormatter: (v) => {
            const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
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
          xLabelFormatter: (v) => `${String(v).padStart(2, "0")}:00`,
        };
    }
  }, [vista, dataDia, dataSemana, dataMes, dataAnio]);

  const domainY = [70, 100];

  return (
    <div className={styles.GraficaOxigenacion}>
      {/* Tabs */}
      <div className={styles.tabs}>
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

      {/* Chart */}
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={180}>
  <ComposedChart
    data={data}
    margin={{ top: 10, right: 20, bottom: 0, left: -20 }}
  >
    <CartesianGrid strokeDasharray="3 3" vertical={false} />

    <XAxis
      type="number"
      dataKey="x"
      domain={xDomain}
      ticks={xTicks}
      tickFormatter={xLabelFormatter}
      tick={{ fontSize: 10, fill: "#94a3b8" }}
      axisLine={true}
      tickLine={false}
      className={styles.font}
    />

    <YAxis
      type="number"
      domain={domainY}
      tickFormatter={(v) => `${v}%`}
      tick={{ fontSize: 10, fill: "#94a3b8" }}
      axisLine={false}
      tickLine={false}
      className={styles.font}
    />

    <ReferenceLine y={100} stroke="#16a34a" strokeWidth={1.9} strokeDasharray="10 10" />
    <ReferenceLine y={95}  stroke="#FFD93D" strokeWidth={1.9} strokeDasharray="10 10" />
    <ReferenceLine y={90}  stroke="#FF9F1C" strokeWidth={1.9} strokeDasharray="10 10" />
    <ReferenceLine y={85}  stroke="#f97373" strokeWidth={1.9} strokeDasharray="10 10" />

    <Tooltip
      formatter={(value) => [`${value}%`, "SpO₂"]}
      labelFormatter={(v) =>
        vista === "dia" ? `Hora: ${xLabelFormatter(v)}` : `Punto: ${v}`
      }
      labelStyle={{ fontSize: "0.75rem" }}
      contentStyle={{ fontSize: "0.75rem", borderRadius: "0.5rem" }}
    />

    {/* ✅ Línea de unión */}
    <Line
      type="monotone"
      dataKey="spo2"
      stroke="#fd908d"
      strokeWidth={2}
      dot={false}
      activeDot={{ r: 5 }}
    />

    {/* ✅ Puntos pequeños */}
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

      {/* Footer (patrón Glucosa) */}
      <div className={styles.footer}>
        <button type="button" className={styles.btnFecha}>
          Martes 21, Oct 2025
          <span className={styles.chevron}>▾</span>
        </button>

        <button
          type="button"
          className={styles.btnRegistros}
          onClick={() => setModalAbierto(true)}
        >
          Ver registros
        </button>
      </div>

      <ModalDescargaOxigenacion
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
      />
    </div>
  );
};

export default GraficaOxigenacion;
