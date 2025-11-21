// mesat/src/components/RangoFrecuencias/frecuenciaUtils.js

export const FREC_MIN = 60;
export const FREC_MAX = 100;

export const hdec = (ts) => {
  const d = new Date(ts);
  return d.getHours() + d.getMinutes() / 60;
};

export function buildDailyMetrics(readings = [], date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end   = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

  // 🔹 Filtrar lecturas del día (originales, con ts)
  const lecturasDelDiaOriginal = readings.filter((r) => {
    const d = new Date(r.ts);
    return d >= start && d < end;
  });

  // 🔹 Versión para la gráfica (hora decimal + bpm)
  const dayReadings = lecturasDelDiaOriginal
    .map((r) => ({ hora: hdec(r.ts), bpm: r.bpm }))
    .sort((a, b) => a.hora - b.hora);

  // 🔹 Última lectura original (ts + bpm)
  const ultimaLecturaOriginal =
    lecturasDelDiaOriginal.length
      ? [...lecturasDelDiaOriginal]
          .sort((a, b) => new Date(a.ts) - new Date(b.ts))
          .at(-1)
      : null;

  // 🔹 Último registro para la gráfica (último punto del día)
  const ultimoRegistro = dayReadings.length
    ? dayReadings[dayReadings.length - 1]
    : null;

  const mean =
    dayReadings.length > 0
      ? Math.round(
          dayReadings.reduce((s, r) => s + r.bpm, 0) / dayReadings.length
        )
      : 0;

  const minDia = dayReadings.length
    ? Math.min(...dayReadings.map((r) => r.bpm))
    : null;

  const maxDia = dayReadings.length
    ? Math.max(...dayReadings.map((r) => r.bpm))
    : null;

  const altas = dayReadings.filter((r) => r.bpm > FREC_MAX);
  const bajas = dayReadings.filter((r) => r.bpm < FREC_MIN);

  const alertaAlta = altas.length
    ? Math.max(...altas.map((r) => r.bpm))
    : null;

  const alertaBaja = bajas.length
    ? Math.min(...bajas.map((r) => r.bpm))
    : null;

  const ultimaHora = dayReadings.length
    ? Math.max(...dayReadings.map((r) => r.hora))
    : null;

  return {
    dayReadings,
    mean,
    minDia,
    maxDia,
    alertaAlta,
    alertaBaja,
    ultimaHora,
    ultimoRegistro,        // { hora, bpm }
    ultimaLecturaOriginal, // { ts, bpm }
  };
}
