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
  { label: "0:00", valor: 61 },
  { label: "01:00", valor: 95 },
  { label: "02:00", valor: 85 },
  { label: "03:00", valor: 77 },
  { label: "04:00", valor: 82 },
  { label: "05:00", valor: 72 },
  { label: "06:00", valor: 65 },
  { label: "07:00", valor: 60 },
  { label: "08:00", valor: 70 },
  { label: "09:00", valor: 60 },
  { label: "10:00", valor: 85 },
  { label: "11:00", valor: 90 },
  { label: "12:00", valor: 100 },
  { label: "13:00", valor: 83 },
  { label: "14:00", valor: 92 },
  { label: "15:00", valor: 61 },
  { label: "16:00", valor: 108 },
  { label: "17:00", valor: 74 },
  { label: "18:00", valor: 89 },
  { label: "19:00", valor: 66 },
  { label: "20:00", valor: 100 },
  { label: "21:00", valor: 79 },
  { label: "22:00", valor: 63 },
  { label: "23:00", valor: 84 },
  { label: "24:00", valor: 84 },
];

const MOCK_SEMANA = [
  { label: "Lun", valor: 73 },
  { label: "Mar", valor: 84 },
  { label: "Mié", valor: 99 },
  { label: "Jue", valor: 88 },
  { label: "Vie", valor: 75 },
  { label: "Sáb", valor: 85 },
  { label: "Dom", valor: 79 },
];

const MOCK_MES = [
  { label: "día 1", valor: 82 },
  { label: "día 2", valor: 95 },
  { label: "día 3", valor: 67 },
  { label: "día 4", valor: 108 },
  { label: "día 5", valor: 74 },
  { label: "día 6", valor: 90 },
  { label: "día 7", valor: 63 },
  { label: "día 8", valor: 100 },
  { label: "día 9", valor: 79 },
  { label: "día 10", valor: 85 },
  { label: "día 11", valor: 92 },
  { label: "día 12", valor: 61 },
  { label: "día 13", valor: 106 },
  { label: "día 14", valor: 70 },
  { label: "día 15", valor: 88 },
  { label: "día 16", valor: 97 },
  { label: "día 17", valor: 76 },
  { label: "día 18", valor: 110 },
  { label: "día 19", valor: 64 },
  { label: "día 20", valor: 83 },
  { label: "día 21", valor: 91 },
  { label: "día 22", valor: 68 },
  { label: "día 23", valor: 102 },
  { label: "día 24", valor: 73 },
  { label: "día 25", valor: 80 },
  { label: "día 26", valor: 89 },
  { label: "día 27", valor: 66 },
  { label: "día 28", valor: 107 },
  { label: "día 29", valor: 75 },
  { label: "día 30", valor: 84 },
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


const CustomDot = (props) => {
  const { cx, cy, vista } = props; // Extraemos 'vista' de las props
  if (cx == null || cy == null) return null;

  // Si es DÍA, dibujamos el círculo que ya tenías
  if (vista === "dia") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill="#ffffff" />
        <circle cx={cx} cy={cy} r={3} fill="#007cba" />
      </g>
    );
  }
  // Si es SEMANA, MES o AÑO, dibujamos la línea vertical (cápsula)
  // Ajustamos el 'y' para que el punto 'cy' quede en el centro de la línea
  const altoLinea = 35; // Altura de la barrita
  const anchoLinea = 5; // Grosor de la barrita

  return (


    <rect
      x={cx - anchoLinea / 2}
      y={cy - altoLinea / 2}
      width={anchoLinea}
      height={altoLinea}
      fill="url(#gradient)"
      rx={3.5} // Redondeado para que parezca cápsula
    />

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

  const domainY = [30, 150];

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
        <ResponsiveContainer width="100%" height={180}> { }
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
            <defs>

              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007cba" stopOpacity="{1}" />
                <stop offset="95%" stopColor="#9AC4FF" stopOpacity="{0.2}" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={true} />
            <ReferenceLine y={100} stroke="#f97373" strokeWidth={.9} strokeDasharray="" />
            <ReferenceLine y={60} stroke="#f97373" strokeWidth={.9} strokeDasharray="" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              // Si es día salta de 5 en 5, si es mes quizás de 6 en 6, etc.
              interval={vista === "dia" ? 5 : (vista === "mes" ? 6 : 0)}
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
              stroke="transparent"
              strokeWidth={2}
              // Pasamos la prop vista aquí:
              dot={(props) => <CustomDot {...props} vista={vista} />}
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
