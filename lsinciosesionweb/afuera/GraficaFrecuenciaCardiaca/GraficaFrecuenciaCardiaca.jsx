import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
  ComposedChart,
  Scatter,
} from "recharts";

import {
  generarLecturasMock,
  vistaDia,
  vistaSemana,
  vistaMes,
  lecturasDelDia,
  vistaAnio,
} from "@/utils/hrAgregadores";

import styles from "./GraficaFrecuenciaCardiaca.module.css";
import DatePill from "./DatePill/DatePill.jsx";

// Tooltip personalizado
function TooltipHR({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const pmin = payload.find((p) => p.dataKey === "min");
  const prango = payload.find((p) => p.dataKey === "rango");
  const min = pmin?.value ?? 0;
  const max = min + (prango?.value ?? 0);

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>{label}</div>
      <div className={styles.tooltipRow}>
        <span>Mín</span>
        <b>{min} bpm</b>
      </div>
      <div className={styles.tooltipRow}>
        <span>Máx</span>
        <b>{max} bpm</b>
      </div>
    </div>
  );
}

/**
 * Props:
 * - readings?: Array<{ ts: Date|string|number, bpm: number }>
 *   (si no llega, usa mock)
 */
export default function GraficaFrecuenciaCardiaca({ readings }) {
  // Vista actual
  const [vista, setVista] = useState("mes"); // "dia" | "semana" | "mes" | "anio"
  const [anio, setAnio] = useState(() => new Date().getFullYear());

  // Fechas pivote para cada vista
  const [fechaDia, setFechaDia] = useState(() => new Date());
  const [semanaInicio, setSemanaInicio] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d;
  });
  const [fechaMes, setFechaMes] = useState(() => new Date());

  // Datos base (si no hay prop, genera mock)
  const lecturas = useMemo(
    () =>
      readings && readings.length
        ? readings
        : generarLecturasMock({ dias: 35, porDia: 6, baseDate: new Date() }),
    [readings]
  );

  // Filtrado/Agregación según vista
  const datos = useMemo(() => {
    let arr = [];
    if (vista === "dia") {
      arr = vistaDia(lecturas, fechaDia);
    } else if (vista === "semana") {
      const fin = new Date(
        semanaInicio.getFullYear(),
        semanaInicio.getMonth(),
        semanaInicio.getDate() + 6
      );
      arr = vistaSemana(lecturas, semanaInicio, fin);
    } else if (vista === "mes") {
      arr = vistaMes(lecturas, fechaMes);
    } else {
      arr = vistaAnio(lecturas, anio);
    }
    return arr.map((d) => ({
      ...d,
      rango: Math.max(0, (d.max ?? 0) - (d.min ?? 0)),
      prom: d.prom ?? Math.round(((d.max ?? 0) + (d.min ?? 0)) / 2),
    }));
  }, [lecturas, vista, fechaDia, semanaInicio, fechaMes, anio]);

  // Puntos crudos del día (para Scatter)
  const puntosDia = useMemo(() => {
    if (vista !== "dia") return [];
    return lecturasDelDia(lecturas, fechaDia)
      .map((r) => ({ hora: horaDecimal(r.ts), bpm: r.bpm }))
      .sort((a, b) => a.hora - b.hora);
  }, [vista, lecturas, fechaDia]);

  // Etiqueta título según vista
  const titulo =
    vista === "dia"
      ? "Frecuencia cardiaca — Día"
      : vista === "semana"
      ? "Frecuencia cardiaca — Semana"
      : vista === "mes"
      ? "Frecuencia cardiaca — Mes"
      : "Frecuencia cardiaca — Año";

  // Calcula color según promedio
  function colorPorPromedio(min, max) {
    const prom = (min + max) / 2;
    if (prom <= 100) return ["#007CBA", "#9AC4FF"]; // verde
    if (prom <= 130) return ["#007CBA", "#9AC4FF"]; // amarillo
    return ["#ef4444", "#fca5a5"]; // rojo
  }

  // Convierte timestamp a hora decimal (0..24)
  function horaDecimal(ts) {
    const d = new Date(ts);
    return d.getHours() + d.getMinutes() / 60;
  }

  // Rango dinámico del eje Y (incluye 60 y 100 para que las ReferenceLine siempre queden visibles)
  const [minY, maxY] = useMemo(() => {
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const PADDING = 10;
    let minVal = 999,
      maxVal = -999;

    if (vista === "dia" && puntosDia.length) {
      for (const p of puntosDia) {
        if (Number.isFinite(p.bpm)) {
          if (p.bpm < minVal) minVal = p.bpm;
          if (p.bpm > maxVal) maxVal = p.bpm;
        }
      }
    } else if (datos.length) {
      for (const d of datos) {
        if (Number.isFinite(d.min)) minVal = Math.min(minVal, d.min);
        if (Number.isFinite(d.max)) maxVal = Math.max(maxVal, d.max);
      }
    } else {
      return [40, 190];
    }

    // asegúrate de cubrir 60 y 100 bpm
    minVal = Math.min(minVal, 60);
    maxVal = Math.max(maxVal, 100);

    // padding y límites de seguridad
    const lo = clamp(Math.floor(minVal) - PADDING, 30, 180);
    const hi = clamp(Math.ceil(maxVal) + PADDING, 60, 200);
    if (hi <= lo) return [40, 190];
    return [lo, hi];
  }, [vista, puntosDia, datos]);

  return (
    <div className={styles.card}>
      {/* Header + Tabs */}
      <div className={styles.header}>
        {/* <h3>{titulo}</h3> */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${vista === "dia" ? styles.active : ""}`}
            onClick={() => setVista("dia")}
          >
            Día
          </button>
          <button
            className={`${styles.tab} ${
              vista === "semana" ? styles.active : ""
            }`}
            onClick={() => setVista("semana")}
          >
            Semana
          </button>
          <button
            className={`${styles.tab} ${vista === "mes" ? styles.active : ""}`}
            onClick={() => setVista("mes")}
          >
            Mes
          </button>
          <button
            className={`${styles.tab} ${vista === "anio" ? styles.active : ""}`}
            onClick={() => setVista("anio")}
          >
            Año
          </button>
        </div>
      </div>

      {/* Gráfica */}
      <div className={styles.chartWrap}>
        {/* Gradientes para barras (semana/mes/año) */}
        {vista !== "dia" && (
          <svg width="0" height="0" aria-hidden>
            <defs>
              {datos.map((d, i) => {
                const [c1, c2] = colorPorPromedio(d.min, d.max);
                return (
                  <linearGradient
                    key={i}
                    id={`gradHR-${i}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={c1} />
                    <stop offset="100%" stopColor={c2} />
                  </linearGradient>
                );
              })}
            </defs>
          </svg>
        )}

        <ResponsiveContainer>
          {vista === "dia" ? (
            /* ===== Día: puntos en Scatter (0..24 h) ===== */
            <ComposedChart
              data={puntosDia}
              margin={{ top: 10, right: 16, bottom: 8, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="hora"
                domain={[0, 24]}
                ticks={[0, 6, 12, 18, 24]}
                tickFormatter={(h) => String(h)}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickMargin={8}
              />
              <YAxis
                dataKey="bpm"
                type="number"
                domain={[minY, maxY]}
                allowDecimals={false}
                tickCount={5}
                tickFormatter={(v) => `${Math.round(v)} `}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickMargin={8}
              />
              <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="1 0" />
              <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="1 0" />
              <Tooltip
                cursor={{ stroke: "rgba(0,0,0,0.2)", strokeDasharray: "3 3" }}
                formatter={(value, name) => [
                  `${value} bpm`,
                  name === "bpm" ? "Lectura" : name,
                ]}
                labelFormatter={(v) => `Hora: ${v.toFixed(2)} h`}
              />
              <Scatter dataKey="bpm" name="Lectura" />
            </ComposedChart>
          ) : (
            /* ===== Semana/Mes/Año: barras min–max ===== */
            <BarChart
              data={datos}
              margin={{ top: 10, right: 16, bottom: 8, left: 0 }}
            >
              <defs>
                {datos.map((d, i) => {
                  const [c1, c2] = colorPorPromedio(d.min, d.max);
                  return (
                    <linearGradient
                      key={i}
                      id={`gradHR-${i}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={c1} />
                      <stop offset="100%" stopColor={c2} />
                    </linearGradient>
                  );
                })}
              </defs>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="fecha"
                tick={{ fontSize: 11, fill: "#6B7280" }}
                tickMargin={8}
              />
              <YAxis
                domain={[minY, maxY]}
                allowDecimals={false}
                tickCount={5}
                tickFormatter={(v) => `${Math.round(v)} `}
                tick={{ fontSize: 11, fill: "#6B7280" }}
                tickMargin={8}
              />
              <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="1 0" />
              <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="1 0" />
              <Tooltip
                content={<TooltipHR />}
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
              />
              <Bar dataKey="min" stackId="hr" fill="transparent" />
              <Bar
                dataKey="rango"
                stackId="hr"
                radius={[28, 28, 28, 28]}
                maxBarSize={10}
                isAnimationActive
                animationBegin={150}
                animationDuration={900}
                animationEasing="ease-out"
                fillOpacity={0.9}
              >
                {datos.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={`url(#gradHR-${i})`} />
                ))}
              </Bar>

              {vista === "anio" && (
                <Line
                  type="monotone"
                  dataKey="prom"
                  stroke="#111827"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 3 }}
                  isAnimationActive
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
        {/* Controles de fecha, según vista */}
        <div className={styles.controls}>
          {vista === "dia" && (
            <DatePill type="date" value={fechaDia} onChange={setFechaDia} />
          )}
          {vista === "semana" && (
            <DatePill
              type="date"
              value={semanaInicio}
              onChange={setSemanaInicio}
            />
          )}
          {vista === "mes" && (
            <DatePill type="month" value={fechaMes} onChange={setFechaMes} />
          )}
          {vista === "anio" && (
            <DatePill
              type="year"
              value={new Date(anio, 0, 1)}
              onChange={(d) => setAnio(d.getFullYear())}
            />
          )}
        </div>
      </div>

      {/* --- Lecturas individuales del día --- */}
      {/* {vista === "dia" && (
        <div className={styles.dayReadings}>
          <h4>Lecturas del día</h4>
          <ul>
            {lecturasDelDia(lecturas, fechaDia).map((r, i) => {
              const hora = new Date(r.ts).toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <li key={i}>
                  <span>{hora}</span>
                  <span>{r.bpm} bpm</span>
                </li>
              );
            })}
          </ul>
        </div>
      )} */}

      {/* <div className={styles.legend}>
        <span className={styles.badge} data-variant="danger" />
        <small>60 bpm</small>
        <span className={styles.badge} data-variant="success" />
        <small>100 bpm</small>
      </div> */}
    </div>
  );
}

// Helpers para inputs tipo date/month
function toInputDate(d) {
  const x = new Date(d);
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${x.getFullYear()}-${m}-${day}`;
}
function fromInputDate(v) {
  const [y, m, d] = v.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function toInputMonth(d) {
  const x = new Date(d);
  const m = String(x.getMonth() + 1).padStart(2, "0");
  return `${x.getFullYear()}-${m}`;
}
function fromInputMonth(v) {
  const [y, m] = v.split("-").map(Number);
  return new Date(y, m - 1, 1);
}
