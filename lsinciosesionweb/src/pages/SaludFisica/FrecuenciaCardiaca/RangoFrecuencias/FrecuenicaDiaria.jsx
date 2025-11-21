// mesat/src/components/RangoFrecuencias/FrecuenciaDiaria.jsx
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
import styles from "./FrecuenciaDiaria.module.css";
import ModalFrecuenciaDiaria from "./ModalFrecuenciaDiaria";

import { buildDailyMetrics, FREC_MIN } from "./frecuenciaUtils";



const FrecuenciaDiaria = ({
  readings = [], // [{ ts, bpm }]
  onAddReading = () => {},
  date = new Date(),
  title = "Frecuencia cardiaca diaria",
}) => {
  const {
    dayReadings,
    mean,
    ultimaHora,
    ultimoRegistro,
    ultimaLecturaOriginal,
  } = useMemo(() => buildDailyMetrics(readings, date), [readings, date]);

  const [open, setOpen] = useState(false);

  const formatFecha = (ts) => {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleDateString("es-MX", {
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
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.cntTxt}>
          <h3>{title}</h3>
          <div className={styles.medi}>
            <p>
              <b>
                {ultimoRegistro
                  ? `${ultimoRegistro.bpm} ppm`
                  : "—"}
              </b>
            </p>

            <p>Última lectura registrada:</p>

            <p>
              {ultimaLecturaOriginal
                ? `${formatFecha(ultimaLecturaOriginal.ts)} — ${formatHora(
                    ultimaLecturaOriginal.ts
                  )}`
                : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer>
          <ComposedChart
            data={dayReadings}
            margin={{ top: 10, right: 10, bottom: 8, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="hora"
              domain={[0, 24]}
              ticks={[0, 6, 12, 18, 24]}
              tick={{ fontSize: 11, fill: "#6B7280" }}
            />
            <YAxis
              domain={[40, 190]}
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickFormatter={(v) => `${v}`}
            />
            {/* referencia baja teórica */}
            <ReferenceLine y={FREC_MIN} stroke="#ef4444" strokeWidth={1.5} />
            {mean > 0 && (
              <ReferenceLine
                y={mean}
                stroke="#007cba"
                strokeDasharray="4 4"
                ifOverflow="extendDomain"
              />
            )}
            <Tooltip
              cursor={{ stroke: "rgba(0,0,0,0.2)", strokeDasharray: "3 3" }}
              formatter={(val, name) =>
                name === "bpm" ? [`${val} ppm`, "Lectura"] : [val, name]
              }
              labelFormatter={(v) => `Hora: ${v.toFixed(2)} h`}
            />
            <Line
              type="monotone"
              dataKey="bpm"
              stroke="#93c5fd"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Scatter dataKey="bpm" name="Lectura" fill="#007cba" />
          </ComposedChart>

          <button className={styles.addBtn} onClick={() => setOpen(true)}>
            <span className={styles.dot} /> Añadir
          </button>
        </ResponsiveContainer>
      </div>

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
