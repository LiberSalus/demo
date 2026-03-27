// src/components/Glucosa/GraficaGlucosa.jsx
import React, { useState, useMemo } from "react";
import ModalDescargaGlucosa from "./ModalDescargaGlucosa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getEstadoGlucosa } from "./utilsGlucosa";
import styles from "./GraficaGlucosa.module.css";

const MOCK_DIA = [
  { label: "00:00", valor: 85 },
  { label: "06:00", valor: 110 },
  { label: "09:00", valor: 150 },
  { label: "12:00", valor: 105 },
  { label: "18:00", valor: 95 },
  { label: "21:00", valor: 80 },
];

const MOCK_SEMANA = [
  { label: "Lun", valor: 100 },
  { label: "Mar", valor: 110 },
  { label: "Mié", valor: 85 },
  { label: "Jue", valor: 125 },
  { label: "Vie", valor: 110 },
  { label: "Sáb", valor: 80 },
  { label: "Dom", valor: 190 },
];

const MOCK_MES = [
  { label: "1", valor: 100 },
  { label: "5", valor: 110 },
  { label: "10", valor: 120 },
  { label: "15", valor: 108 },
  { label: "20", valor: 102 },
  { label: "25", valor: 115 },
  { label: "30", valor: 105 },
];

const MOCK_AÑO = [
  { label: "Ene", valor: 105 },
  { label: "Feb", valor: 110 },
  { label: "Mar", valor: 115 },
  { label: "Abr", valor: 112 },
  { label: "May", valor: 118 },
  { label: "Jun", valor: 120 },
  { label: "Jul", valor: 115 },
  { label: "Ago", valor: 110 },
  { label: "Sep", valor: 108 },
  { label: "Oct", valor: 104 },
  { label: "Nov", valor: 100 },
  { label: "Dic", valor: 102 },
];

const CustomDot = ({ cx, cy, payload, modo = "ayunas" }) => {
  const info = getEstadoGlucosa(payload.valor, modo);
  const color = info?.color || "#007CBA";

  if (cx == null || cy == null) return null;

  return (
    <g>
      {/* borde blanco para que resalte sobre la línea */}
      <circle cx={cx} cy={cy} r={5} fill="#ffffff" />
      <circle cx={cx} cy={cy} r={4} fill={color} />
    </g>
  );
};

const GraficaGlucosa = ({
  dataDia = MOCK_DIA,
  dataSemana = MOCK_SEMANA,
  dataMes = MOCK_MES,
  dataAnio = MOCK_AÑO,
  modo = "ayunas",
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

  const domainY = [60, 200];

  return (
    <div className={styles.GraficaGlucosa}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            vista === "semana" ? styles.tabActiva : ""
          }`}
          onClick={() => setVista("semana")}
        >
          Semana
        </button>
        <button
          className={`${styles.tab} ${vista === "mes" ? styles.tabActiva : ""}`}
          onClick={() => setVista("mes")}
        >
          Mes
        </button>
        <button
          className={`${styles.tab} ${
            vista === "anio" ? styles.tabActiva : ""
          }`}
          onClick={() => setVista("anio")}
        >
          Año
        </button>
      </div>

      {/* Gráfica */}
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, bottom: 0, left: -20 }}
          >
            <ReferenceLine y={126} stroke="#fd8d8d" strokeWidth={1.9} strokeDasharray="10 10" />
            <ReferenceLine y={110} stroke="#f6e68b" strokeWidth={1.9} strokeDasharray="10 10" />
            <ReferenceLine y={70}  stroke="#98dbd3" strokeWidth={1.9} strokeDasharray="10 10" />
            {/* <ReferenceLine y={60}  stroke="#3dcdf5" strokeWidth={1.9} strokeDasharray="10 10" /> */}

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
              formatter={(value) => [`${value} mg/dL`, "Glucosa"]}
              labelStyle={{ fontSize: "0.75rem" }}
              contentStyle={{
                fontSize: "0.75rem",
                borderRadius: "0.5rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#fd908d"
              strokeWidth={2}
              dot={(props) => {
                const { key, ...rest } = props;
                return <CustomDot {...rest} modo={modo} />;
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.btnFecha}>
          Martes 21, Oct 2025
          <span className={styles.chevron}>▾</span>
        </button>
        <button
          className={styles.btnRegistros}
          onClick={() => setModalAbierto(true)}
        >
          Ver registros
        </button>
      </div>

      <ModalDescargaGlucosa
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        modo={modo}
      />
    </div>
  );
};

export default GraficaGlucosa;
