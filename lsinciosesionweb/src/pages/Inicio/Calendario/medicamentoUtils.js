// src/pages/Inicio/Calendario/MedicamentoUtils.js
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import minMax from "dayjs/plugin/minMax";


dayjs.extend(minMax);
dayjs.extend(customParseFormat);

/**
 * Convierte "11:30 am" => { h: 11, m: 30 }
 */
export function parseTimeLabel(timeLabel = "8:00 am") {
  const d = dayjs(timeLabel, "h:mm a");
  return { h: d.hour(), m: d.minute() };
}

/**
 * Genera etiquetas "h:mm a" en intervalos de 30 minutos (como citas)
 */
export function generarHorarios(inicioHora = 0, finHora = 24) {
  const slots = [];
  for (let h = inicioHora; h < finHora; h++) {
    for (let m = 0; m < 60; m += 30) {
      const start = dayjs().hour(h).minute(m).second(0);
      slots.push(start.format("h:mm a"));
    }
  }
  return slots;
}

/**
 * Itera días inclusivo [startKey..endKey]
 */
export function eachDayInclusive(startKey, endKey) {
  const start = dayjs(startKey).startOf("day");
  const end = dayjs(endKey).startOf("day");
  const days = [];
  let cur = start;

  while (cur.isSame(end, "day") || cur.isBefore(end, "day")) {
    days.push(cur);
    cur = cur.add(1, "day");
  }

  return days;
}

/**
 * Determina si un día (YYYY-MM-DD) es "día de toma" según patrón.
 * Regla completa (tratamiento).
 */
export function isTakeDay(rule, dayKey) {
  const day = dayjs(dayKey).startOf("day");
  const start = dayjs(rule.startDate).startOf("day");
  const end = dayjs(rule.endDate).startOf("day");

  if (day.isBefore(start, "day")) return false;
  if (day.isAfter(end, "day")) return false;

  const patron = rule.patron;

  // diaria temporal / diaria permanente (pero aquí igual hay endDate, así que es igual)
  if (patron === "daily_temp" || patron === "daily_perm") return true;

  // cada cierto número de días
  if (patron === "every_n_days") {
    const n = Number(rule.everyNDays || 1);
    const diff = day.diff(start, "day");
    return diff % Math.max(n, 1) === 0;
  }

  // tomar con pausas (toma X días, descansa Y días, y repite)
  if (patron === "with_pauses") {
    const take = Math.max(Number(rule.takeDays || 1), 1);
    const rest = Math.max(Number(rule.restDays || 0), 0);
    const cycle = take + rest;

    const diff = day.diff(start, "day");
    const pos = diff % Math.max(cycle, 1);
    return pos < take;
  }

  return false;
}

/**
 * Construye la info para pintar el calendario del modal:
 * - sombreado suave: periodo total start..end
 * - círculos: set de days con toma según patrón
 *
 * monthStartKey / monthEndKey son límites del mes visible
 */
export function buildCalendarPaint(rule, monthStartKey, monthEndKey) {
  const start = dayjs(rule.startDate);
  const end = dayjs(rule.endDate);

  const shadeStart = dayjs.max(start, dayjs(monthStartKey)).format("YYYY-MM-DD");
  const shadeEnd = dayjs.min(end, dayjs(monthEndKey)).format("YYYY-MM-DD");

  const takeDays = new Set();
  eachDayInclusive(shadeStart, shadeEnd).forEach((d) => {
    const k = d.format("YYYY-MM-DD");
    if (isTakeDay(rule, k)) takeDays.add(k);
  });

  return { shadeStart, shadeEnd, takeDays };
}

/**
 * Genera las horas de toma para un día, según:
 * - frecuenciaHoras: 6|8|12|24
 * - horaInicioLabel: "11:30 am"
 *
 * Devuelve array ["11:30 am", "7:30 pm", ...] (cantidad = 24/freq)
 */
export function buildDailyTimes(frecuenciaHoras = 24, horaInicioLabel = "8:00 am") {
  const freq = Number(frecuenciaHoras || 24);
  const perDay = Math.max(Math.floor(24 / freq), 1);

  const base = dayjs(horaInicioLabel, "h:mm a");
  const times = [];

  for (let i = 0; i < perDay; i++) {
    const t = base.add(i * freq, "hour");
    times.push(t.format("h:mm a"));
  }

  return times;
}

/**
 * Duración en días inclusive (start y end cuentan)
 */
export function durationDays(startKey, endKey) {
  const start = dayjs(startKey).startOf("day");
  const end = dayjs(endKey).startOf("day");
  const diff = end.diff(start, "day");
  return diff >= 0 ? diff + 1 : 0;
}
