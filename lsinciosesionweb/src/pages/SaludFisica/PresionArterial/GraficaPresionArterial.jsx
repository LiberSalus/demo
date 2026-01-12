// mesat/src/components/PresionArterial/GraficaPresionArterial.jsx
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
} from "recharts";

import styles from "./GraficaPresionArterial.module.css";
import DatePill from "./DatePill/DatePill";
import ModalDescargaPresionArterial from "./ModalDescargaPresionArterial";

// ajusta la ruta según dónde tengas DatePill

// ====== MOCK para pruebas (luego lo cambias por datos reales) ======
function generarLecturasPresionMock({
  dias = 30,
  porDia = 3,
  baseDate = new Date(),
} = {}) {
  const res = [];
  for (let i = 0; i < dias; i++) {
    for (let j = 0; j < porDia; j++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - i);
      d.setHours(7 + j * 6, Math.floor(Math.random() * 60), 0, 0);

      // valores simulados
      const sist = 100 + Math.round(Math.random() * 50); // 100–150
      const dias = 60 + Math.round(Math.random() * 25); // 60–85

      res.push({
        ts: d,
        sistolica: sist,
        diastolica: dias,
      });
    }
  }
  return res.sort((a, b) => new Date(a.ts) - new Date(b.ts));
}

// ====== Helpers de fechas ======
const normalizarFecha = (ts) => {
  const d = new Date(ts);
  d.setSeconds(0, 0);
  return d;
};

const mismoDia = (a, b) => {
  const da = normalizarFecha(a);
  const db = normalizarFecha(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
};

const lecturasDelDia = (lecturas, fecha) =>
  lecturas.filter((r) => mismoDia(r.ts, fecha));

const rangoDias = (inicio, dias) => {
  const res = [];
  for (let i = 0; i < dias; i++) {
    const d = new Date(inicio);
    d.setDate(d.getDate() + i);
    res.push(d);
  }
  return res;
};

// ====== Agregadores por vista ======
function vistaDiaPA(lecturas, fecha) {
  // aquí devolvemos crudo; se usa en puntosDia
  return lecturasDelDia(lecturas, fecha);
}

function vistaSemanaPA(lecturas, inicio, fin) {
  const inicioDia = new Date(inicio);
  inicioDia.setHours(0, 0, 0, 0);
  const dias = rangoDias(inicioDia, 7);
  return dias.map((dia) => {
    const delDia = lecturasDelDia(lecturas, dia);
    if (!delDia.length) {
      return {
        fecha: dia.toLocaleDateString("es-MX", {
          weekday: "short",
          day: "2-digit",
        }),
        min: null,
        max: null,
      };
    }
    let minDias = Infinity;
    let maxSis = -Infinity;
    let sumaSis = 0,
      sumaDias = 0;
    for (const r of delDia) {
      if (r.diastolica < minDias) minDias = r.diastolica;
      if (r.sistolica > maxSis) maxSis = r.sistolica;
      sumaSis += r.sistolica;
      sumaDias += r.diastolica;
    }
    const promSis = sumaSis / delDia.length;
    const promDias = sumaDias / delDia.length;

    return {
      fecha: dia.toLocaleDateString("es-MX", {
        weekday: "short",
        day: "2-digit",
      }),
      min: minDias,
      max: maxSis,
      promSis,
      promDias,
    };
  });
}

function vistaMesPA(lecturas, fechaMes) {
  const year = fechaMes.getFullYear();
  const month = fechaMes.getMonth();
  const inicio = new Date(year, month, 1);
  const fin = new Date(year, month + 1, 0);
  const dias = rangoDias(inicio, fin.getDate());

  return dias.map((dia) => {
    const delDia = lecturasDelDia(lecturas, dia);
    if (!delDia.length) {
      return {
        fecha: dia.toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "short",
        }),
        min: null,
        max: null,
      };
    }
    let minDias = Infinity;
    let maxSis = -Infinity;
    let sumaSis = 0,
      sumaDias = 0;
    for (const r of delDia) {
      if (r.diastolica < minDias) minDias = r.diastolica;
      if (r.sistolica > maxSis) maxSis = r.sistolica;
      sumaSis += r.sistolica;
      sumaDias += r.diastolica;
    }
    const promSis = sumaSis / delDia.length;
    const promDias = sumaDias / delDia.length;

    return {
      fecha: dia.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
      }),
      min: minDias,
      max: maxSis,
      promSis,
      promDias,
    };
  });
}

function vistaAnioPA(lecturas, anio) {
  const res = [];
  for (let m = 0; m < 12; m++) {
    const delMes = lecturas.filter((r) => {
      const d = new Date(r.ts);
      return d.getFullYear() === anio && d.getMonth() === m;
    });

    if (!delMes.length) {
      res.push({
        fecha: new Date(anio, m, 1).toLocaleDateString("es-MX", {
          month: "short",
        }),
        min: null,
        max: null,
      });
      continue;
    }

    let minDias = Infinity;
    let maxSis = -Infinity;
    let sumaSis = 0,
      sumaDias = 0;

    for (const r of delMes) {
      if (r.diastolica < minDias) minDias = r.diastolica;
      if (r.sistolica > maxSis) maxSis = r.sistolica;
      sumaSis += r.sistolica;
      sumaDias += r.diastolica;
    }
    const promSis = sumaSis / delMes.length;
    const promDias = sumaDias / delMes.length;

    res.push({
      fecha: new Date(anio, m, 1).toLocaleDateString("es-MX", {
        month: "short",
      }),
      min: minDias,
      max: maxSis,
      promSis,
      promDias,
    });
  }
  return res;
}

// ====== Tooltip personalizado para vistas agregadas ======
function TooltipPA({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const pmin = payload.find((p) => p.dataKey === "min");
  const prango = payload.find((p) => p.dataKey === "rango");
  const min = pmin?.value ?? 0; // diastólica mínima
  const max = min + (prango?.value ?? 0); // sistólica máxima

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>{label}</div>
      <div className={styles.tooltipRow}>
        <span>Diastólica mín</span>
        <b>{min} mmHg</b>
      </div>
      <div className={styles.tooltipRow}>
        <span>Sistólica máx</span>
        <b>{max} mmHg</b>
      </div>
    </div>
  );
}

// ====== Componente principal ======
export default function GraficaPresionArterial({ readings }) {
  const [vista, setVista] = useState("mes"); // "dia" | "semana" | "mes" | "anio"
  const [anio, setAnio] = useState(() => new Date().getFullYear());

  const [modalAbierto, setModalAbierto] = useState(false);

  const [fechaDia, setFechaDia] = useState(() => new Date());
  const [semanaInicio, setSemanaInicio] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [fechaMes, setFechaMes] = useState(() => new Date());

  // Datos base: reales o mock
  const lecturas = useMemo(
    () =>
      readings && readings.length
        ? readings
        : generarLecturasPresionMock({
            dias: 40,
            porDia: 3,
            baseDate: new Date(),
          }),
    [readings]
  );

  // Agregación por vista
  const datos = useMemo(() => {
    let arr = [];
    if (vista === "dia") {
      // esta vista usa puntosDia, aquí no agregamos
      return [];
    } else if (vista === "semana") {
      const fin = new Date(
        semanaInicio.getFullYear(),
        semanaInicio.getMonth(),
        semanaInicio.getDate() + 6
      );
      arr = vistaSemanaPA(lecturas, semanaInicio, fin);
    } else if (vista === "mes") {
      arr = vistaMesPA(lecturas, fechaMes);
    } else {
      arr = vistaAnioPA(lecturas, anio);
    }

    return arr.map((d) => {
      if (d.min == null || d.max == null) {
        return { ...d, rango: 0, prom: null };
      }
      const rango = Math.max(0, d.max - d.min);
      const prom = (d.max + d.min) / 2;
      return { ...d, rango, prom };
    });
  }, [lecturas, vista, fechaDia, semanaInicio, fechaMes, anio]);

  // Puntos crudos del día
  const puntosDia = useMemo(() => {
    if (vista !== "dia") return [];
    return vistaDiaPA(lecturas, fechaDia)
      .map((r) => ({
        hora: horaDecimal(r.ts),
        sistolica: r.sistolica,
        diastolica: r.diastolica,
      }))
      .sort((a, b) => a.hora - b.hora);
  }, [vista, lecturas, fechaDia]);

  // Título opcional
  const titulo =
    vista === "dia"
      ? "Presión arterial — Día"
      : vista === "semana"
      ? "Presión arterial — Semana"
      : vista === "mes"
      ? "Presión arterial — Mes"
      : "Presión arterial — Año";

  // Colores según riesgo (simplificado)
  function colorPorPresion(min, max) {
    if (min == null || max == null) return ["#9CA3AF", "#E5E7EB"];

    // normal
    if (max < 120 && min < 80) return ["#22C55E", "#86EFAC"]; // verde
    // elevada
    if (max < 140 && min < 90) return ["#FBBF24", "#FDE68A"]; // amarillo
    // hipertensión
    return ["#EF4444", "#FCA5A5"]; // rojo
  }

  function horaDecimal(ts) {
    const d = new Date(ts);
    return d.getHours() + d.getMinutes() / 60;
  }

  // Rango dinámico eje Y
  const [minY, maxY] = useMemo(() => {
    const PADDING = 5;
    let minVal = Infinity;
    let maxVal = -Infinity;

    if (vista === "dia" && puntosDia.length) {
      for (const p of puntosDia) {
        if (Number.isFinite(p.diastolica))
          minVal = Math.min(minVal, p.diastolica);
        if (Number.isFinite(p.sistolica))
          maxVal = Math.max(maxVal, p.sistolica);
      }
    } else if (datos.length) {
      for (const d of datos) {
        if (Number.isFinite(d.min)) minVal = Math.min(minVal, d.min);
        if (Number.isFinite(d.max)) maxVal = Math.max(maxVal, d.max);
      }
    }

    if (!Number.isFinite(minVal) || !Number.isFinite(maxVal)) {
      return [60, 200];
    }

    minVal = Math.min(minVal, 60);
    maxVal = Math.max(maxVal, 140);

    const lo = Math.max(40, Math.floor(minVal) - PADDING);
    const hi = Math.min(220, Math.ceil(maxVal) + PADDING);
    if (hi <= lo) return [60, 200];
    return [lo, hi];
  }, [vista, puntosDia, datos]);

  return (
    <div className={styles.card}>
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

      <div className={styles.chartWrap}>
        <ResponsiveContainer>
          {vista === "dia" ? (
            // ===== Día: líneas de sistólica y diastólica =====
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
                tickFormatter={(h) => `${h}h`}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickMargin={8}
              />
              <YAxis
                type="number"
                domain={[minY, maxY]}
                allowDecimals={false}
                tickCount={6}
                tickFormatter={(v) => `${Math.round(v)} `}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickMargin={8}
              />
              {/* líneas de referencia: 80/120 */}
              <ReferenceLine y={80} stroke="#60A5FA" strokeDasharray="4 4" />
              <ReferenceLine y={120} stroke="#F97316" strokeDasharray="4 4" />

              <Tooltip
                cursor={{ stroke: "rgba(0,0,0,0.2)", strokeDasharray: "3 3" }}
                formatter={(value, name) => [
                  `${value} mmHg`,
                  name === "sistolica"
                    ? "Sistólica"
                    : name === "diastolica"
                    ? "Diastólica"
                    : name,
                ]}
                labelFormatter={(v) => `Hora: ${v.toFixed(2)} h`}
              />

              <Line
                dataKey="sistolica"
                name="Sistólica"
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={{ r: 3 }}
                isAnimationActive
              />
              <Line
                dataKey="diastolica"
                name="Diastólica"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ r: 3 }}
                isAnimationActive
              />
            </ComposedChart>
          ) : (
            // ===== Semana/Mes/Año: barras de rango Diastólica–Sistólica =====
            <BarChart
              data={datos}
              margin={{ top: 10, right: 16, bottom: 8, left: 0 }}
            >
              <defs>
                {datos.map((d, i) => {
                  const [c1, c2] = colorPorPresion(d.min, d.max);
                  return (
                    <linearGradient
                      key={i}
                      id={`gradPA-${i}`}
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
                tickCount={6}
                tickFormatter={(v) => `${Math.round(v)} `}
                tick={{ fontSize: 11, fill: "#6B7280" }}
                tickMargin={8}
              />

              <ReferenceLine y={80} stroke="#60A5FA" strokeDasharray="4 4" />
              <ReferenceLine y={120} stroke="#F97316" strokeDasharray="4 4" />

              <Tooltip
                content={<TooltipPA />}
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
              />

              {/* min (diastólica) + rango (hasta sistólica) */}
              <Bar dataKey="min" stackId="pa" fill="transparent" />
              <Bar
                dataKey="rango"
                stackId="pa"
                radius={[28, 28, 28, 28]}
                maxBarSize={10}
                isAnimationActive
                animationBegin={150}
                animationDuration={900}
                animationEasing="ease-out"
                fillOpacity={0.95}
              >
                {datos.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={`url(#gradPA-${i})`} />
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

        {/* Controles de fecha */}
        <div className={styles.bottomBar}>
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

          <button
            type="button"
            className={styles.linkReg}
            onClick={() => setModalAbierto(true)}
          >
            Ver registros
          </button>
          <ModalDescargaPresionArterial
            abierto={modalAbierto}
            onClose={() => setModalAbierto(false)}
          />
        </div>
      </div>
    </div>
  );
}
