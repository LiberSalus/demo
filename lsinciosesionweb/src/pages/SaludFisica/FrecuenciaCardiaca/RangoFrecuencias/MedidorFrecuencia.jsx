// src/pages/SaludFisica/FrecuenciaCardiaca/RangoFrecuencias/MedidorFrecuencia.jsx

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Scatter,
  Line,
} from "recharts";

import styles from "./MedidorFrecuenica.module.css";
import ModalFrecuenciaDiaria from "./ModalFrecuenciaDiaria";
import { buildDailyMetrics, FREC_MIN } from "./FrecuenciaUtils";

const CustomDot = ({ cx, cy }) => {
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={3.5} fill="#ffffff" />
      <circle cx={cx} cy={cy} r={2.6} fill="#fd908d" />
    </g>
  );
};

const FrecuenciaDiaria = ({
  readings = [],
  onAddReading = () => {},
  date = new Date(),
  title = "Frecuencia cardiaca diaria",
}) => {
  const {
    dayReadings,
    mean,
    ultimoRegistro,
    ultimaLecturaOriginal,
  } = useMemo(() => buildDailyMetrics(readings, date), [readings, date]);

  const [open, setOpen] = useState(false);

  const formatFecha = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatHora = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.FrecuenciaDiaria}>
      {/* HEADER */}
      <div className={styles.header}>
        <h3 className={styles.titulo}>{title}</h3>

        <div className={styles.medi}>
          <p className={styles.valor}>
            {ultimoRegistro ? `${ultimoRegistro.bpm}` : "—"}
            <span className={styles.simbolo}> ppm</span>
          </p>

          <p className={styles.sub}>
            Última lectura registrada:
            <br />
            <span className={styles.tiempo}>
              {ultimaLecturaOriginal
                ? `${formatFecha(ultimaLecturaOriginal.ts)} — ${formatHora(
                    ultimaLecturaOriginal.ts
                  )}`
                : "—"}
            </span>
          </p>
        </div>
      </div>

      {/* CHART */}
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart
            data={dayReadings}
            margin={{ top: 10, right: 20, bottom: 0, left: -20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              type="number"
              dataKey="hora"
              domain={[0, 24]}
              ticks={[0, 6, 12, 18, 24]}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={true}
              tickLine={false}
              className={styles.font}
            />

            <YAxis
              domain={[40, 190]}
              allowDecimals={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              className={styles.font}
              tickFormatter={(v) => `${v}`}
            />

            {/* Reference: mínimo teórico */}
            {/* <ReferenceLine y={FREC_MIN} stroke="#ef4444" strokeWidth={1.5} /> */}
            <ReferenceLine y={100} stroke="#16a34a" strokeWidth={1.9} strokeDasharray="10 10" />
            <ReferenceLine y={60}  stroke="#f97373" strokeWidth={1.9} strokeDasharray="10 10" />

            {/* Reference: promedio */}
            {mean > 0 && (
              <ReferenceLine
                y={mean}
                stroke="#007cba"
                strokeDasharray="4 4"
                ifOverflow="extendDomain"
              />
            )}

            <Tooltip
              formatter={(val) => [`${val} ppm`, "Lectura"]}
              labelFormatter={(v) => `Hora: ${v.toFixed(2)} h`}
              labelStyle={{ fontSize: "0.75rem" }}
              contentStyle={{ fontSize: "0.75rem", borderRadius: "0.5rem" }}
            />

            {/* ✅ Línea patrón (rosa) */}
            <Line
              type="monotone"
              dataKey="bpm"
              stroke="#fd908d"
              strokeWidth={2}
              dot={false}
              connectNulls
            />

            {/* ✅ Puntos pequeños con borde blanco */}
            <Scatter
              dataKey="bpm"
              name="Lectura"
              fill="#fd908d"
              stroke="#fd908d"
              strokeWidth={1}
              shape={({ cx, cy }) => <CustomDot cx={cx} cy={cy} />}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER (botón pill, sin margin-left raro) */}
      <div className={styles.footer}>
        <button type="button" className={styles.btnAdd} onClick={() => setOpen(true)}>
          <span className={styles.icoMas}>＋</span>
          <span>Añadir</span>
        </button>
      </div>

      {/* MODAL */}
      {open && (
        <ModalFrecuenciaDiaria
          onClose={() => setOpen(false)}
          onConfirm={(bpm, ts) => {
            onAddReading({ bpm, ts });
            setOpen(false);
          }}
          defaultDate={date}
        />
      )}
    </div>
  );
};

export default FrecuenciaDiaria;
