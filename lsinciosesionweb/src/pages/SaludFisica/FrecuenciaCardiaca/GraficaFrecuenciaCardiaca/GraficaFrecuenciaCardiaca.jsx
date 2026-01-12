// src/components/GraficaFrecuenciaCardiaca/GraficaFrecuenciaCardiaca.jsx

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

import RangeDropdown from "./RangeDropdown";
import styles from "./GraficaFrecuenciaCardiaca.module.css";
import ModalDescargaFrecuenciaCardiaca from "./ModalDescargaFrecuenciaCardiaca";

// Tooltip personalizado para semana/mes/año
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

  const [modalAbierto, setModalAbierto] = useState(false);

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

  // Filtrado / agregación según vista
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

  // Rango dinámico del eje Y (incluye 60 y 100)
  const [minY, maxY] = useMemo(() => {
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const PADDING = 10;
    let minVal = 999;
    let maxVal = -999;

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

    // cubrir 60 y 100 bpm
    minVal = Math.min(minVal, 60);
    maxVal = Math.max(maxVal, 100);

    const lo = clamp(Math.floor(minVal) - PADDING, 30, 180);
    const hi = clamp(Math.ceil(maxVal) + PADDING, 60, 200);
    if (hi <= lo) return [40, 190];
    return [lo, hi];
  }, [vista, puntosDia, datos]);

  // === Opciones para selectores de rango ===

  // Día: últimos 7 días
  const opcionesDia = useMemo(() => {
    const base = fechaDia;
    const dias = [];
    const NUM_DIAS = 7;

    for (let i = 0; i < NUM_DIAS; i++) {
      const d = addDays(base, -i);
      dias.push({
        value: toISODate(d),
        label: formatDayLabel(d),
      });
    }
    return dias;
  }, [fechaDia]);

  // Semana: últimas 6 semanas
  const opcionesSemana = useMemo(() => {
    const base = semanaInicio;
    const semanas = [];
    const NUM_SEMANAS = 6;

    for (let i = 0; i < NUM_SEMANAS; i++) {
      const inicio = addDays(base, -7 * i);
      semanas.push({
        value: toISODate(inicio),
        label: formatWeekLabel(inicio),
      });
    }
    return semanas;
  }, [semanaInicio]);

  // Mes: últimos 6 rangos tipo "Ago - Sep 2025"
  const opcionesMes = useMemo(() => {
    const base = fechaMes;
    const meses = [];
    const NUM_MESES = 6;

    for (let i = 0; i < NUM_MESES; i++) {
      const fin = addMonths(base, -i);
      meses.push({
        value: toISODate(fin),
        label: formatMonthRangeLabel(fin),
      });
    }
    return meses;
  }, [fechaMes]);

  // Años para la vista anual
  const opcionesAnio = useMemo(() => {
    const actual = new Date().getFullYear();
    const A = [];
    for (let y = actual; y >= actual - 5; y--) {
      A.push({ value: String(y), label: String(y) });
    }
    return A;
  }, []);

  return (
    <div className={styles.card}>
      {/* Header + Tabs */}
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              vista === "dia" ? styles.tabActive : ""
            }`}
            onClick={() => setVista("dia")}
          >
            Día
          </button>
          <button
            className={`${styles.tab} ${
              vista === "semana" ? styles.tabActive : ""
            }`}
            onClick={() => setVista("semana")}
          >
            Semana
          </button>
          <button
            className={`${styles.tab} ${
              vista === "mes" ? styles.tabActive : ""
            }`}
            onClick={() => setVista("mes")}
          >
            Mes
          </button>
          <button
            className={`${styles.tab} ${
              vista === "anio" ? styles.tabActive : ""
            }`}
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
            // ===== Día: puntos sueltos =====
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
            // ===== Semana / Mes / Año: barras min–max =====
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

        {/* Controles de rango según vista */}
        <div className={styles.bottomBar}>
          <div className={styles.controls}>
            {vista === "dia" && (
              <RangeDropdown
                options={opcionesDia}
                value={toISODate(fechaDia)}
                onChange={(v) => setFechaDia(new Date(v))}
              />
            )}

            {vista === "semana" && (
              <RangeDropdown
                options={opcionesSemana}
                value={toISODate(semanaInicio)}
                onChange={(v) => setSemanaInicio(new Date(v))}
              />
            )}

            {vista === "mes" && (
              <RangeDropdown
                options={opcionesMes}
                value={toISODate(fechaMes)}
                onChange={(v) => setFechaMes(new Date(v))}
              />
            )}

            {vista === "anio" && (
              <RangeDropdown
                options={opcionesAnio}
                value={String(anio)}
                onChange={(v) => setAnio(Number(v))}
              />
            )}
          </div>

          <ModalDescargaFrecuenciaCardiaca
  abierto={modalAbierto}
  onClose={() => setModalAbierto(false)}
/>


          <button
            type="button"
            className={styles.linkReg}
            onClick={() => setModalAbierto(true)}
          >
            Ver registros
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== HELPERS ===================== */

// Conversión TS → hora decimal
function horaDecimal(ts) {
  const d = new Date(ts);
  return d.getHours() + d.getMinutes() / 60;
}

// Color de barras según promedio
function colorPorPromedio(min, max) {
  const prom = (min + max) / 2;
  if (prom <= 100) return ["#007CBA", "#9AC4FF"]; // rango “ok”
  if (prom <= 130) return ["#007CBA", "#9AC4FF"]; // puedes cambiar si quieres distinto
  return ["#ef4444", "#fca5a5"]; // alto
}

// "Martes 21, Oct 2025"
function formatDayLabel(date) {
  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// "Lun 20 - Lun 27, Oct 2025"
function formatWeekLabel(startDate) {
  const inicio = new Date(startDate);
  const fin = addDays(inicio, 7);

  const inicioTxt = inicio.toLocaleDateString("es-MX", {
    weekday: "short",
    day: "2-digit",
  });
  const finTxt = fin.toLocaleDateString("es-MX", {
    weekday: "short",
    day: "2-digit",
  });
  const mesAnio = fin.toLocaleDateString("es-MX", {
    month: "short",
    year: "numeric",
  });

  return `${inicioTxt} - ${finTxt}, ${mesAnio}`;
}

// "Ago - Sep 2025"
function formatMonthRangeLabel(endDate) {
  const fin = new Date(endDate);
  const ini = addMonths(fin, -1);

  const mesIni = ini.toLocaleDateString("es-MX", { month: "short" });
  const mesFin = fin.toLocaleDateString("es-MX", {
    month: "short",
    year: "numeric",
  });

  return `${mesIni} - ${mesFin}`;
}

// Helpers de fecha genéricos
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function toISODate(d) {
  return new Date(d).toISOString();
}
