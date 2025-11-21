/**
 * Lectura cruda de FC (frecuencia cardiaca).
 * @typedef {{ ts: string | number | Date, bpm: number }} HRReading
 *
 * Salida agregada para Recharts (una barra = un día).
 * @typedef {{ fecha: string, keyISO: string, min: number, max: number }} HRDayAgg
 */

// --------- Utilidades de fecha ---------
const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const toDate = (d) => (d instanceof Date ? d : new Date(d));

const ymd = (d) => {
  const dt = toDate(d);
  const m = String(dt.getMonth()+1).padStart(2,"0");
  const day = String(dt.getDate()).padStart(2,"0");
  return `${dt.getFullYear()}-${m}-${day}`; // ISO YYYY-MM-DD
};

const etiquetaDia = (d) => {
  const dt = toDate(d);
  return `${MESES[dt.getMonth()]} ${String(dt.getDate()).padStart(2,"0")}`; // "Oct 22"
};

const startOfDay = (d) => {
  const dt = toDate(d);
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
};

const addDays = (d, n) => {
  const dt = toDate(d);
  const r = new Date(dt);
  r.setDate(r.getDate() + n);
  return r;
};

// --------- Agregador por día (min/max) ---------
/** @param {HRReading[]} readings */
export function agregarPorDia(readings = []) {
  const mapa = new Map(); // key: YYYY-MM-DD -> {min,max,date}
  for (const r of readings) {
    if (!r || !Number.isFinite(r.bpm)) continue;
    const dt = toDate(r.ts);
    const key = ymd(dt);
    if (!mapa.has(key)) {
      mapa.set(key, { min: r.bpm, max: r.bpm, date: startOfDay(dt) });
    } else {
      const o = mapa.get(key);
      o.min = Math.min(o.min, r.bpm);
      o.max = Math.max(o.max, r.bpm);
    }
  }

  return Array.from(mapa.entries())
    .sort((a,b) => a[0].localeCompare(b[0]))
    .map(([key, {min, max, date}]) => ({
      fecha: etiquetaDia(date), // etiqueta para el eje X
      keyISO: key,              // útil para filtros
      min,
      max,
    }));
}

// --------- Vistas (día / semana / mes) ---------
/** @returns {HRDayAgg[]} 0..1 barras */
export function vistaDia(readings, dia) {
  const key = ymd(dia);
  const agg = agregarPorDia(readings);
  return agg.filter(d => d.keyISO === key);
}

/** 7 días desde 'inicio' (o hasta 'fin' si lo pasas) */
export function vistaSemana(readings, inicio, fin) {
  const start = startOfDay(inicio);
  const end = fin ? startOfDay(fin) : addDays(start, 6);
  const agg = agregarPorDia(readings);
  return agg.filter(d => {
    const dt = toDate(d.keyISO);
    return dt >= start && dt <= end;
  });
}

/** Todo el mes de la fecha dada */
export function vistaMes(readings, cualquierFechaDelMes) {
  const dt = toDate(cualquierFechaDelMes);
  const first = new Date(dt.getFullYear(), dt.getMonth(), 1);
  const nextMonth = new Date(dt.getFullYear(), dt.getMonth()+1, 1);
  const last = addDays(nextMonth, -1);
  const agg = agregarPorDia(readings);
  return agg.filter(d => {
    const x = toDate(d.keyISO);
    return x >= first && x <= last;
  });
}

// --------- Mock para pruebas rápidas ---------
/** Genera lecturas aleatorias (50–160 bpm) durante N días */
export function generarLecturasMock({ dias=30, porDia=4, baseDate=new Date() } = {}) {
  const out = [];
  for (let i = dias-1; i >= 0; i--) {
    const day = addDays(baseDate, -i);
    for (let j = 0; j < porDia; j++) {
      const hora = 6 + Math.floor((12*j)/Math.max(1, porDia-1)); // esparcidas
      const dt = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hora);
      const bpm = Math.round(50 + Math.random()*110);
      out.push({ ts: dt, bpm });
    }
  }
  return out;
}

/** Devuelve todas las lecturas de un día específico */
export function lecturasDelDia(readings, dia) {
  const target = new Date(dia);
  const start = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate() + 1);
  return readings.filter((r) => {
    const d = new Date(r.ts);
    return d >= start && d < end;
  });
}


// --- Vista anual: barras por mes (min/max) + promedio ---
const MESES_CORTOS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

/** Agrega lecturas por mes de un año dado */
export function vistaAnio(readings, year) {
  const y = typeof year === "number" ? year : new Date(year || Date.now()).getFullYear();
  // Prepara 12 contenedores
  const buckets = Array.from({ length: 12 }, (_, i) => ({
    mesIdx: i, min: Infinity, max: -Infinity, sum: 0, count: 0
  }));

  for (const r of readings || []) {
    if (!r || !Number.isFinite(r.bpm)) continue;
    const d = new Date(r.ts);
    if (d.getFullYear() !== y) continue;
    const m = d.getMonth();
    const b = buckets[m];
    b.min = Math.min(b.min, r.bpm);
    b.max = Math.max(b.max, r.bpm);
    b.sum += r.bpm;
    b.count += 1;
  }

  // Formato para la gráfica
  return buckets
    .filter(b => b.count > 0) // solo meses con datos
    .map(b => {
      const prom = b.count ? b.sum / b.count : 0;
      return {
        fecha: MESES_CORTOS[b.mesIdx],      // etiqueta eje X
        keyISO: `${y}-${String(b.mesIdx+1).padStart(2,"0")}`,
        min: b.min === Infinity ? 0 : b.min,
        max: b.max === -Infinity ? 0 : b.max,
        prom: Math.round(prom)
      };
    });
}

