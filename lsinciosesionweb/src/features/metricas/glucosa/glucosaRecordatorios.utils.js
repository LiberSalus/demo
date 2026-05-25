export const CLAVE_STORAGE_RECORDATORIOS_GLUCOSA =
  "glucosa_recordatorios_v1";

const DIAS_RECORDATORIO = ["D", "L", "M", "M", "J", "V", "S"];
const ETIQUETAS_DIAS_SEMANA = [
  "Dom",
  "Lun",
  "Mar",
  "Mier",
  "Jue",
  "Vie",
  "Sab",
];

const RECORDATORIOS_GLUCOSA_DEFAULT = [
  {
    id: "recordatorio-glucosa-1",
    hour: 7,
    minute: 0,
    meridiem: "AM",
    days: [1, 2, 3, 4, 5],
    enabled: true,
  },
];

export const crearRecordatorioGlucosaVacio = () => ({
  id: null,
  hour: 7,
  minute: 0,
  meridiem: "AM",
  days: [1, 2, 3, 4, 5],
  enabled: true,
});

const normalizarDaysRecordatorio = (days) => {
  if (!Array.isArray(days)) return [1, 2, 3, 4, 5];

  const normalizados = [...new Set(
    days
      .map((day) => Number(day))
      .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6),
  )].sort((a, b) => a - b);

  return normalizados.length ? normalizados : [1, 2, 3, 4, 5];
};

export const normalizarRecordatorioGlucosa = (recordatorio) => {
  const hour = Number(recordatorio?.hour);
  const minute = Number(recordatorio?.minute);
  const meridiem = recordatorio?.meridiem === "PM" ? "PM" : "AM";

  return {
    id:
      typeof recordatorio?.id === "string" && recordatorio.id.trim()
        ? recordatorio.id.trim()
        : `recordatorio-glucosa-${Date.now()}`,
    hour: Number.isInteger(hour) && hour >= 1 && hour <= 12 ? hour : 7,
    minute:
      Number.isInteger(minute) && minute >= 0 && minute <= 59 ? minute : 0,
    meridiem,
    days: normalizarDaysRecordatorio(recordatorio?.days),
    enabled: recordatorio?.enabled !== false,
  };
};

export const leerRecordatoriosGlucosa = () => {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_STORAGE_RECORDATORIOS_GLUCOSA);
    if (!textoGuardado) {
      return RECORDATORIOS_GLUCOSA_DEFAULT.map(normalizarRecordatorioGlucosa);
    }

    const recordatoriosGuardados = JSON.parse(textoGuardado);
    if (!Array.isArray(recordatoriosGuardados)) {
      return RECORDATORIOS_GLUCOSA_DEFAULT.map(normalizarRecordatorioGlucosa);
    }

    return recordatoriosGuardados.map(normalizarRecordatorioGlucosa);
  } catch {
    return RECORDATORIOS_GLUCOSA_DEFAULT.map(normalizarRecordatorioGlucosa);
  }
};

export const guardarRecordatoriosGlucosa = (recordatorios) => {
  try {
    localStorage.setItem(
      CLAVE_STORAGE_RECORDATORIOS_GLUCOSA,
      JSON.stringify(recordatorios.map(normalizarRecordatorioGlucosa)),
    );
  } catch {
    // Si localStorage falla, mantenemos solo el estado en memoria.
  }
};

export const obtenerEtiquetasDiasRecordatorioGlucosa = () =>
  DIAS_RECORDATORIO.map((etiqueta, indice) => ({ etiqueta, indice }));

export const formatearHoraRecordatorioGlucosa = (recordatorio) => {
  const normalizado = normalizarRecordatorioGlucosa(recordatorio);
  return `${String(normalizado.hour).padStart(2, "0")}:${String(
    normalizado.minute,
  ).padStart(2, "0")} ${normalizado.meridiem.toLowerCase()}`;
};

export const formatearDiasRecordatorioGlucosa = (recordatorio) => {
  const dias = normalizarRecordatorioGlucosa(recordatorio).days;
  return dias.map((day) => ETIQUETAS_DIAS_SEMANA[day]).join(", ");
};

const convertirHora24 = (hour, meridiem) => {
  if (meridiem === "AM") {
    return hour === 12 ? 0 : hour;
  }

  return hour === 12 ? 12 : hour + 12;
};

const obtenerSiguienteFechaRecordatorio = (
  recordatorio,
  fechaBase = new Date(),
) => {
  const normalizado = normalizarRecordatorioGlucosa(recordatorio);
  const hora24 = convertirHora24(normalizado.hour, normalizado.meridiem);

  for (let offset = 0; offset < 7; offset += 1) {
    const candidata = new Date(fechaBase);
    candidata.setSeconds(0, 0);
    candidata.setDate(fechaBase.getDate() + offset);
    candidata.setHours(hora24, normalizado.minute, 0, 0);

    if (!normalizado.days.includes(candidata.getDay())) continue;
    if (candidata.getTime() <= fechaBase.getTime()) continue;

    return candidata;
  }

  return null;
};

export const obtenerProximoRecordatorioGlucosa = (
  recordatorios,
  fechaBase = new Date(),
) => {
  const candidatos = (Array.isArray(recordatorios) ? recordatorios : [])
    .map(normalizarRecordatorioGlucosa)
    .filter((recordatorio) => recordatorio.enabled)
    .map((recordatorio) => ({
      ...recordatorio,
      nextAt: obtenerSiguienteFechaRecordatorio(recordatorio, fechaBase),
    }))
    .filter((recordatorio) => recordatorio.nextAt instanceof Date);

  if (!candidatos.length) return null;

  return candidatos.sort((a, b) => a.nextAt.getTime() - b.nextAt.getTime())[0];
};

export const formatearCuentaRegresivaRecordatorioGlucosa = (recordatorio) => {
  if (!recordatorio?.nextAt) return "--";

  const diffMs = recordatorio.nextAt.getTime() - Date.now();
  if (diffMs <= 0) return "menos de 1 hr.";

  const totalMinutes = Math.round(diffMs / 60000);
  const horas = Math.floor(totalMinutes / 60);
  const minutos = totalMinutes % 60;

  if (horas <= 0) return `${minutos} min.`;
  if (minutos === 0) return `${horas} hrs.`;
  return `${horas} h ${minutos} min.`;
};
