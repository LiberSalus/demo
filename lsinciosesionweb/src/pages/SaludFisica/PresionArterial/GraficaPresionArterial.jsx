// mesat/src/components/PresionArterial/GraficaPresionArterial.jsx
import React, { useMemo, useState } from "react";
import styles from "./GraficaPresionArterial.module.css";
import ModalDescargaPresionArterial from "./ModalDescargaPresionArterial";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
  Tooltip,
} from "recharts";

// ===== MOCKS patrón Glucosa =====
// Día: puntos por hora
const MOCK_DIA = [
  { label: "00:00", sis: 118, dias: 76 },
  { label: "06:00", sis: 122, dias: 78 },
  { label: "09:00", sis: 135, dias: 84 },
  { label: "12:00", sis: 128, dias: 80 },
  { label: "18:00", sis: 124, dias: 79 },
  { label: "21:00", sis: 120, dias: 77 },
];

const MOCK_SEMANA = [
  { label: "Lun", sis: 124, dias: 78 },
  { label: "Mar", sis: 130, dias: 82 },
  { label: "Mié", sis: 118, dias: 75 },
  { label: "Jue", sis: 136, dias: 86 },
  { label: "Vie", sis: 128, dias: 80 },
  { label: "Sáb", sis: 122, dias: 77 },
  { label: "Dom", sis: 140, dias: 90 },
];

const MOCK_MES = [
  { label: "1", sis: 126, dias: 79 },
  { label: "5", sis: 132, dias: 83 },
  { label: "10", sis: 128, dias: 81 },
  { label: "15", sis: 120, dias: 76 },
  { label: "20", sis: 134, dias: 85 },
  { label: "25", sis: 129, dias: 82 },
  { label: "30", sis: 125, dias: 78 },
];

const MOCK_ANIO = [
  { label: "Ene", sis: 128, dias: 80 },
  { label: "Feb", sis: 126, dias: 79 },
  { label: "Mar", sis: 130, dias: 82 },
  { label: "Abr", sis: 132, dias: 84 },
  { label: "May", sis: 134, dias: 85 },
  { label: "Jun", sis: 131, dias: 83 },
  { label: "Jul", sis: 129, dias: 81 },
  { label: "Ago", sis: 127, dias: 80 },
  { label: "Sep", sis: 125, dias: 78 },
  { label: "Oct", sis: 128, dias: 80 },
  { label: "Nov", sis: 126, dias: 79 },
  { label: "Dic", sis: 127, dias: 80 },
];

// Dot estilo Glucosa (borde blanco + color)
const CustomDot = ({ cx, cy, color }) => {
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="#ffffff" />
      <circle cx={cx} cy={cy} r={4} fill={color} />
    </g>
  );
};

const GraficaPresionArterial = ({
  dataDia = MOCK_DIA,
  dataSemana = MOCK_SEMANA,
  dataMes = MOCK_MES,
  dataAnio = MOCK_ANIO,
}) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vista, setVista] = useState("semana");

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

  // Dominio sugerido PA (ajústalo si quieres)
  const domainY = [50, 200];

  return (
    <div className={styles.GraficaPresionArterial}>
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

      {/* Gráfica */}
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <ReferenceArea
              y1={80} y2={120}
              fill="#22c55e"
              fillOpacity={0.1}
              
            />
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
              formatter={(value, name) => {
                if (name === "sis") return [`${value} mmHg`, "Sistólica"];
                if (name === "dias") return [`${value} mmHg`, "Diastólica"];
                return [`${value}`, name];
              }}
              labelStyle={{ fontSize: "0.75rem" }}
              contentStyle={{ fontSize: "0.75rem", borderRadius: "0.5rem" }}
            />

            {/* Sistólica */}
            <Line
              type="monotone"
              dataKey="sis"
              stroke="#fd908d"
              strokeWidth={2}
              dot={(props) => {
                const { key, ...rest } = props;
                return <CustomDot {...rest} color="#fd908d" />;
              }}
              activeDot={{ r: 6 }}
            />

            {/* Diastólica */}
            <Line
              type="monotone"
              dataKey="dias"
              stroke="#22c55e"
              strokeWidth={2}
              dot={(props) => {
                const { key, ...rest } = props;
                return <CustomDot {...rest} color="#22c55e" />;
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

      <ModalDescargaPresionArterial
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
      />
    </div>
  );
};

export default GraficaPresionArterial;
