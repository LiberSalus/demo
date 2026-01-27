// src/components/FrecuenciaCardiaca/GraficaFrecuenciaCardiaca.jsx
import React, { useMemo, useState } from "react";
import styles from "./GraficaFrecuenciaCardiaca.module.css";
import ModalDescargaFrecuenciaCardiaca from "./ModalDescargaFrecuenciaCardiaca";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

// ✅ MOCKS (mismo patrón que Glucosa)
const MOCK_DIA = [
  { label: "00:00", valor: 62 },
  { label: "06:00", valor: 78 },
  { label: "09:00", valor: 92 },
  { label: "12:00", valor: 85 },
  { label: "18:00", valor: 74 },
  { label: "21:00", valor: 68 },
];

const MOCK_SEMANA = [
  { label: "Lun", valor: 78 },
  { label: "Mar", valor: 84 },
  { label: "Mié", valor: 73 },
  { label: "Jue", valor: 88 },
  { label: "Vie", valor: 82 },
  { label: "Sáb", valor: 76 },
  { label: "Dom", valor: 90 },
];

const MOCK_MES = [
  { label: "1", valor: 80 },
  { label: "5", valor: 83 },
  { label: "10", valor: 86 },
  { label: "15", valor: 79 },
  { label: "20", valor: 84 },
  { label: "25", valor: 88 },
  { label: "30", valor: 82 },
];

const MOCK_ANIO = [
  { label: "Ene", valor: 82 },
  { label: "Feb", valor: 80 },
  { label: "Mar", valor: 84 },
  { label: "Abr", valor: 86 },
  { label: "May", valor: 85 },
  { label: "Jun", valor: 83 },
  { label: "Jul", valor: 82 },
  { label: "Ago", valor: 81 },
  { label: "Sep", valor: 80 },
  { label: "Oct", valor: 79 },
  { label: "Nov", valor: 81 },
  { label: "Dic", valor: 82 },
];

// ✅ Dot estilo Glucosa (borde blanco + dot color)
const CustomDot = ({ cx, cy }) => {
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="#ffffff" />
      <circle cx={cx} cy={cy} r={4} fill="#fd908d" />
    </g>
  );
};

const GraficaFrecuenciaCardiaca = ({
  dataDia = MOCK_DIA,
  dataSemana = MOCK_SEMANA,
  dataMes = MOCK_MES,
  dataAnio = MOCK_ANIO,
}) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vista, setVista] = useState("dia");

  const data = useMemo(() => {
    switch (vista) {
      case "dia":
        return dataDia;
      case "semana":
        return dataSemana;
      case "mes":
        return dataMes;
      case "anio":
        return dataAnio;
      default:
        return dataDia;
    }
  }, [vista, dataDia, dataSemana, dataMes, dataAnio]);

  const domainY = [40, 180];

  return (
    <div className={styles.GraficaFrecuenciaCardiaca}>
      {/* Tabs */}
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

      {/* Gráfica */}
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <ReferenceLine y={100} stroke="#16a34a" strokeWidth={1.9} strokeDasharray="10 10" />
            <ReferenceLine y={60}  stroke="#f97373" strokeWidth={1.9} strokeDasharray="10 10" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={true}
              tickLine={false}
              className={styles.font}
            />
            <YAxis
              domain={domainY}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              className={styles.font}
            />
            <Tooltip
              formatter={(value) => [`${value} bpm`, "Frecuencia"]}
              labelStyle={{ fontSize: "0.75rem" }}
              contentStyle={{ fontSize: "0.75rem", borderRadius: "0.5rem" }}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#fd908d"
              strokeWidth={2}
              dot={(props) => {
                const { key, ...rest } = props;
                return <CustomDot {...rest} />;
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
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

      <ModalDescargaFrecuenciaCardiaca
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
      />
    </div>
  );
};

export default GraficaFrecuenciaCardiaca;
