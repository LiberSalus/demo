export const VALORES_REFERENCIA_PRESION = [
  { key: "val1", bg: "#007CBA", condicion: "Hipotensión", rango: { dia: "menor a 90", sis: "menor a 60" } },
  { key: "val2", bg: "#3FAD58", condicion: "Normal", rango: { dia: "90 - 119", sis: "60 - 79" } },
  { key: "val3", bg: "#F8A737", condicion: "Elevada", rango: { dia: "120 - 129", sis: "80 - 89" } },
  { key: "val4", bg: "#C72611", condicion: "Hipertensión 1", rango: { dia: "130 - 139", sis: "90 - 99" } },
  { key: "val5", bg: "#C72611", condicion: "Hipertensión 2", rango: { dia: "140 - 179", sis: "90 - 119" } },
  { key: "val6", bg: "#C72611", condicion: "Crisis Hipertensiva", rango: { dia: "mayor a 180", sis: "mayor a 120" } },
];

export const CLAVE_STORAGE_PRESION_DIA = "presion_arterial_registros_dia_v1";
export const CLAVE_STORAGE_FRECUENCIA_DIA = "frecuencia_cardiaca_registros_dia_v1";
export const CLAVE_STORAGE_RECORDATORIOS_PRESION =
  "presion_arterial_recordatorios_v1";
export const PERIODOS_PROMEDIO_PRESION = {
  SEMANA: "semana",
  MES: "mes",
  ANIO: "anio",
};
import {
  REGISTROS_PRESION_DIARIA_MOCK,
  REGISTROS_PRESION_HISTORIAL_MOCK,
} from "./presionArterial.mock";

const NOMBRES_MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const ABREVIATURAS_MESES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

const ABREVIATURAS_DIAS = ["L", "M", "M", "J", "V", "S", "D"];
const DIAS_RECORDATORIO = ["D", "L", "M", "M", "J", "V", "S"];
const ETIQUETAS_DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mier", "Jue", "Vie", "Sab"];
const RECORDATORIOS_PRESION_DEFAULT = [
  {
    id: "recordatorio-presion-1",
    hour: 7,
    minute: 0,
    meridiem: "AM",
    days: [1, 2, 3, 4, 5],
    enabled: true,
  },
];


export const crearLecturaVacia = () => ({
  sistolica: null,
  diastolica: null,
  medicamento: null,
  fechaHoraISO: null,
});

export const crearRecordatorioPresionVacio = () => ({
  id: null,
  hour: 7,
  minute: 0,
  meridiem: "AM",
  days: [1, 2, 3, 4, 5],
  enabled: true,
});

export const obtenerClaveDiaLocal = (fechaEntrada) => {
  const fecha = fechaEntrada instanceof Date ? fechaEntrada : new Date(fechaEntrada);
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
};

const filtrarRegistrosPorDia = (registros, claveDia) =>
  registros.filter((registro) => obtenerClaveDiaLocal(registro.fechaHoraISO) === claveDia);

const filtrarRegistrosHastaAhora = (registros) => {
  const ahora = Date.now();
  return registros.filter((registro) => new Date(registro.fechaHoraISO).getTime() <= ahora);
};

export const normalizarRegistroPresion = (registro) => ({
  ...registro,
  sistolica: Number(registro.sistolica),
  diastolica: Number(registro.diastolica),
  createdAtMs: Number.isFinite(Number(registro.createdAtMs))
    ? Number(registro.createdAtMs)
    : new Date(registro.fechaHoraISO).getTime(),
  medicamento:
    typeof registro.medicamento === "string" && registro.medicamento.trim()
      ? registro.medicamento.trim()
      : null,
});

export const ordenarRegistrosCronologicamente = (registros) =>
  [...registros].sort((a, b) => new Date(a.fechaHoraISO).getTime() - new Date(b.fechaHoraISO).getTime());

export const obtenerRegistrosBaseDelDia = (claveDiaActual) =>
  ordenarRegistrosCronologicamente(
    filtrarRegistrosHastaAhora(
      filtrarRegistrosPorDia(REGISTROS_PRESION_DIARIA_MOCK, claveDiaActual),
    ).map(normalizarRegistroPresion),
  );

export const obtenerUltimosRegistros = (registros) => {
  const registrosOrdenados = ordenarRegistrosCronologicamente(registros);
  const registrosPorCaptura = [...registros].sort(
    (a, b) => (a.createdAtMs ?? 0) - (b.createdAtMs ?? 0),
  );

  return {
    registrosOrdenados,
    ultimoRegistro: registrosPorCaptura.at(-1) ?? null,
    valorDiaAnterior: registrosPorCaptura.at(-2) ?? null,
  };
};

export const formatearFechaHora = (fechaHoraISO) => {
  if (!fechaHoraISO) return "--";

  const fecha = new Date(fechaHoraISO);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  const hora = String(fecha.getHours()).padStart(2, "0");
  const minuto = String(fecha.getMinutes()).padStart(2, "0");

  return `${dia}-${mes}-${anio} ${hora}:${minuto}`;
};

export const formatearHoraTexto = (fechaHoraISO) => {
  if (!fechaHoraISO) return "—";

  return new Date(fechaHoraISO).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatearFechaTexto = (fechaHoraISO) => {
  if (!fechaHoraISO) return "—";

  return new Date(fechaHoraISO).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const normalizarDaysRecordatorio = (days) => {
  if (!Array.isArray(days)) return [1, 2, 3, 4, 5];

  const normalizados = [...new Set(
    days
      .map((day) => Number(day))
      .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6),
  )].sort((a, b) => a - b);

  return normalizados.length ? normalizados : [1, 2, 3, 4, 5];
};

export const normalizarRecordatorioPresion = (recordatorio) => {
  const hour = Number(recordatorio?.hour);
  const minute = Number(recordatorio?.minute);
  const meridiem = recordatorio?.meridiem === "PM" ? "PM" : "AM";

  return {
    id:
      typeof recordatorio?.id === "string" && recordatorio.id.trim()
        ? recordatorio.id.trim()
        : `recordatorio-presion-${Date.now()}`,
    hour: Number.isInteger(hour) && hour >= 1 && hour <= 12 ? hour : 7,
    minute:
      Number.isInteger(minute) && minute >= 0 && minute <= 59 ? minute : 0,
    meridiem,
    days: normalizarDaysRecordatorio(recordatorio?.days),
    enabled: recordatorio?.enabled !== false,
  };
};

export const leerRecordatoriosPresion = () => {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_STORAGE_RECORDATORIOS_PRESION);
    if (!textoGuardado) {
      return RECORDATORIOS_PRESION_DEFAULT.map(normalizarRecordatorioPresion);
    }

    const recordatoriosGuardados = JSON.parse(textoGuardado);
    if (!Array.isArray(recordatoriosGuardados)) {
      return RECORDATORIOS_PRESION_DEFAULT.map(normalizarRecordatorioPresion);
    }

    return recordatoriosGuardados.map(normalizarRecordatorioPresion);
  } catch {
    return RECORDATORIOS_PRESION_DEFAULT.map(normalizarRecordatorioPresion);
  }
};

export const guardarRecordatoriosPresion = (recordatorios) => {
  try {
    localStorage.setItem(
      CLAVE_STORAGE_RECORDATORIOS_PRESION,
      JSON.stringify(recordatorios.map(normalizarRecordatorioPresion)),
    );
  } catch {
    // Si localStorage falla, mantenemos solo el estado en memoria.
  }
};

export const obtenerEtiquetasDiasRecordatorio = () =>
  DIAS_RECORDATORIO.map((etiqueta, indice) => ({ etiqueta, indice }));

export const formatearHoraRecordatorio = (recordatorio) => {
  const normalizado = normalizarRecordatorioPresion(recordatorio);
  return `${String(normalizado.hour).padStart(2, "0")}:${String(
    normalizado.minute,
  ).padStart(2, "0")} ${normalizado.meridiem.toLowerCase()}`;
};

export const formatearDiasRecordatorio = (recordatorio) => {
  const dias = normalizarRecordatorioPresion(recordatorio).days;
  return dias.map((day) => ETIQUETAS_DIAS_SEMANA[day]).join(", ");
};

const convertirHora24 = (hour, meridiem) => {
  if (meridiem === "AM") {
    return hour === 12 ? 0 : hour;
  }

  return hour === 12 ? 12 : hour + 12;
};

const obtenerSiguienteFechaRecordatorio = (recordatorio, fechaBase = new Date()) => {
  const normalizado = normalizarRecordatorioPresion(recordatorio);
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

export const obtenerProximoRecordatorioPresion = (
  recordatorios,
  fechaBase = new Date(),
) => {
  const candidatos = (Array.isArray(recordatorios) ? recordatorios : [])
    .map(normalizarRecordatorioPresion)
    .filter((recordatorio) => recordatorio.enabled)
    .map((recordatorio) => ({
      ...recordatorio,
      nextAt: obtenerSiguienteFechaRecordatorio(recordatorio, fechaBase),
    }))
    .filter((recordatorio) => recordatorio.nextAt instanceof Date);

  if (!candidatos.length) return null;

  return candidatos.sort((a, b) => a.nextAt.getTime() - b.nextAt.getTime())[0];
};

export const formatearCuentaRegresivaRecordatorio = (recordatorio) => {
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

export const leerEstadoPersistido = (claveDiaActual) => {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_STORAGE_PRESION_DIA);
    if (!textoGuardado) {
      return {
        claveDiaRegistros: claveDiaActual,
        registrosDelDia: obtenerRegistrosBaseDelDia(claveDiaActual),
      };
    }

    const estadoGuardado = JSON.parse(textoGuardado);
    if (
      estadoGuardado?.claveDiaRegistros === claveDiaActual &&
      Array.isArray(estadoGuardado?.registrosDelDia)
    ) {
      return {
        claveDiaRegistros: claveDiaActual,
        registrosDelDia: ordenarRegistrosCronologicamente(
          estadoGuardado.registrosDelDia.map(normalizarRegistroPresion),
        ),
      };
    }
  } catch {
    // Si hay error de storage o parseo, usamos fallback local.
  }

  return {
    claveDiaRegistros: claveDiaActual,
    registrosDelDia: obtenerRegistrosBaseDelDia(claveDiaActual),
  };
};

const obtenerUltimoPorFecha = (registros) =>
  [...registros].sort(
    (a, b) => new Date(a?.fechaHoraISO ?? 0).getTime() - new Date(b?.fechaHoraISO ?? 0).getTime(),
  ).at(-1) ?? null;

export const obtenerUltimaFrecuenciaCardiaca = () => {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_STORAGE_FRECUENCIA_DIA);
    if (!textoGuardado) return null;

    const estadoGuardado = JSON.parse(textoGuardado);
    const registrosDelDia = Array.isArray(estadoGuardado?.registrosDelDia)
      ? estadoGuardado.registrosDelDia
      : [];

    const ultimoRegistro = obtenerUltimoPorFecha(registrosDelDia);
    const ppm = Number(ultimoRegistro?.ppm);

    if (!Number.isFinite(ppm)) return null;

    return {
      ppm: Math.round(ppm),
      fechaHoraISO: ultimoRegistro.fechaHoraISO ?? null,
    };
  } catch {
    return null;
  }
};

export const obtenerEstadoPresion = (sistolica, diastolica) => {
  if (sistolica >= 180 || diastolica >= 120) return { texto: "Crisis Hipertensiva", color: "#C72611" };
  if (sistolica >= 140 || diastolica >= 90) return { texto: "Hipertensión 2", color: "#C72611" };
  if ((sistolica >= 130 && sistolica <= 139) || (diastolica >= 80 && diastolica <= 89)) {
    return { texto: "Hipertensión 1", color: "#C72611" };
  }
  if (sistolica >= 120 && sistolica <= 129 && diastolica < 80) {
    return { texto: "Elevada", color: "#F8A737" };
  }
  if (sistolica < 90 || diastolica < 60) return { texto: "Hipotensión", color: "#007CBA" };
  return { texto: "Normal", color: "#3FAD58" };
};

export const construirSeriePorHora = (registrosDelDia) =>
  [...registrosDelDia]
    .sort((a, b) => new Date(a.fechaHoraISO).getTime() - new Date(b.fechaHoraISO).getTime())
    .map((registro) => {
      const fecha = new Date(registro.fechaHoraISO);
      const horaDecimal = fecha.getHours() + fecha.getMinutes() / 60 + fecha.getSeconds() / 3600;

      return {
        hora: horaDecimal,
        sistolica: registro.sistolica,
        diastolica: registro.diastolica,
        base: registro.diastolica,
        rango: registro.sistolica - registro.diastolica,
        fechaHoraISO: registro.fechaHoraISO,
      };
    });

export const obtenerRegistrosPresionHistorial = () =>
  ordenarRegistrosCronologicamente(
    REGISTROS_PRESION_HISTORIAL_MOCK.map(normalizarRegistroPresion),
  );

const esRegistroPresionValido = (registro) =>
  Number.isFinite(Number(registro?.sistolica)) &&
  Number.isFinite(Number(registro?.diastolica)) &&
  Number(registro.sistolica) > 0 &&
  Number(registro.diastolica) > 0;

const obtenerInicioSemanaLunes = (fechaEntrada) => {
  const fecha = new Date(fechaEntrada);
  const dia = fecha.getDay();
  const desfase = dia === 0 ? -6 : 1 - dia;
  const inicio = new Date(fecha);
  inicio.setHours(0, 0, 0, 0);
  inicio.setDate(inicio.getDate() + desfase);
  return inicio;
};

const obtenerFinSemanaDomingo = (inicioSemana) => {
  const fin = new Date(inicioSemana);
  fin.setDate(fin.getDate() + 6);
  fin.setHours(23, 59, 59, 999);
  return fin;
};

const construirMapaPromediosDiarios = (registros) => {
  const mapa = new Map();

  registros.forEach((registro) => {
    if (!esRegistroPresionValido(registro)) return;

    const claveDia = obtenerClaveDiaLocal(registro.fechaHoraISO);
    const existente = mapa.get(claveDia);

    if (!existente) {
      mapa.set(claveDia, {
        sumaSistolica: Number(registro.sistolica),
        sumaDiastolica: Number(registro.diastolica),
        cantidad: 1,
      });
      return;
    }

    existente.sumaSistolica += Number(registro.sistolica);
    existente.sumaDiastolica += Number(registro.diastolica);
    existente.cantidad += 1;
  });

  return mapa;
};

const obtenerOpcionesSemanaPresion = (registros) => {
  const mapa = new Map();

  registros.filter(esRegistroPresionValido).forEach((registro) => {
    const fecha = new Date(registro.fechaHoraISO);
    const inicio = obtenerInicioSemanaLunes(fecha);
    const fin = obtenerFinSemanaDomingo(inicio);
    const valor = obtenerClaveDiaLocal(inicio);

    if (!mapa.has(valor)) {
      const diaInicio = String(inicio.getDate()).padStart(2, "0");
      const diaFin = String(fin.getDate()).padStart(2, "0");
      const mesInicio = ABREVIATURAS_MESES[inicio.getMonth()];
      const mesFin = ABREVIATURAS_MESES[fin.getMonth()];
      mapa.set(valor, {
        valor,
        etiqueta: `Lun ${diaInicio} ${mesInicio} - Dom ${diaFin} ${mesFin}`,
      });
    }
  });

  return [...mapa.values()].sort((a, b) => (a.valor < b.valor ? 1 : -1));
};

const obtenerOpcionesMesPresion = (registros) => {
  const mapa = new Map();

  registros.filter(esRegistroPresionValido).forEach((registro) => {
    const fecha = new Date(registro.fechaHoraISO);
    const anio = fecha.getFullYear();
    const mesIndice = fecha.getMonth();
    const valor = `${anio}-${String(mesIndice + 1).padStart(2, "0")}`;

    if (!mapa.has(valor)) {
      mapa.set(valor, {
        valor,
        etiqueta: `${NOMBRES_MESES[mesIndice]} - ${anio}`,
      });
    }
  });

  return [...mapa.values()].sort((a, b) => (a.valor < b.valor ? 1 : -1));
};

const obtenerOpcionesAnioPresion = (registros) => {
  const conjunto = new Set(
    registros
      .filter(esRegistroPresionValido)
      .map((registro) => String(new Date(registro.fechaHoraISO).getFullYear())),
  );

  return [...conjunto]
    .sort((a, b) => Number(b) - Number(a))
    .map((anio) => ({ valor: anio, etiqueta: anio }));
};

export const construirOpcionesFiltroPromedioPresion = (registros) => ({
  [PERIODOS_PROMEDIO_PRESION.SEMANA]: obtenerOpcionesSemanaPresion(registros),
  [PERIODOS_PROMEDIO_PRESION.MES]: obtenerOpcionesMesPresion(registros),
  [PERIODOS_PROMEDIO_PRESION.ANIO]: obtenerOpcionesAnioPresion(registros),
});

const construirSeriePromedioSemanaPresion = (registros, valorSemana) => {
  const inicio = new Date(`${valorSemana}T00:00:00`);
  const mapaPromedios = construirMapaPromediosDiarios(registros);

  return ABREVIATURAS_DIAS.map((etiqueta, indice) => {
    const fecha = new Date(inicio);
    fecha.setDate(inicio.getDate() + indice);
    const promedio = mapaPromedios.get(obtenerClaveDiaLocal(fecha));

    return {
      etiquetaX: etiqueta,
      sistolica: promedio ? Math.round(promedio.sumaSistolica / promedio.cantidad) : null,
      diastolica: promedio ? Math.round(promedio.sumaDiastolica / promedio.cantidad) : null,
    };
  });
};

const construirSeriePromedioMesPresion = (registros, valorMes) => {
  const [anioTxt, mesTxt] = valorMes.split("-");
  const anio = Number(anioTxt);
  const mesIndice = Number(mesTxt) - 1;
  const diasMes = new Date(anio, mesIndice + 1, 0).getDate();
  const mapaPromedios = construirMapaPromediosDiarios(registros);

  return Array.from({ length: diasMes }, (_, indice) => {
    const dia = indice + 1;
    const fecha = new Date(anio, mesIndice, dia);
    const promedio = mapaPromedios.get(obtenerClaveDiaLocal(fecha));

    return {
      etiquetaX: String(dia),
      sistolica: promedio ? Math.round(promedio.sumaSistolica / promedio.cantidad) : null,
      diastolica: promedio ? Math.round(promedio.sumaDiastolica / promedio.cantidad) : null,
    };
  });
};

const construirSeriePromedioAnioPresion = (registros, valorAnio) => {
  const anio = Number(valorAnio);
  const mapaPromedios = construirMapaPromediosDiarios(registros);

  return ABREVIATURAS_MESES.map((abreviatura, mesIndice) => {
    const diasMes = new Date(anio, mesIndice + 1, 0).getDate();
    const sistolicas = [];
    const diastolicas = [];

    for (let dia = 1; dia <= diasMes; dia += 1) {
      const fecha = new Date(anio, mesIndice, dia);
      const promedio = mapaPromedios.get(obtenerClaveDiaLocal(fecha));
      if (!promedio) continue;
      sistolicas.push(promedio.sumaSistolica / promedio.cantidad);
      diastolicas.push(promedio.sumaDiastolica / promedio.cantidad);
    }

    return {
      etiquetaX: abreviatura,
      sistolica: sistolicas.length
        ? Math.round(sistolicas.reduce((suma, valor) => suma + valor, 0) / sistolicas.length)
        : null,
      diastolica: diastolicas.length
        ? Math.round(diastolicas.reduce((suma, valor) => suma + valor, 0) / diastolicas.length)
        : null,
    };
  });
};

export const construirSeriePromedioPresion = ({ registros, periodo, valorFiltro }) => {
  if (!valorFiltro) return [];

  if (periodo === PERIODOS_PROMEDIO_PRESION.SEMANA) {
    return construirSeriePromedioSemanaPresion(registros, valorFiltro);
  }

  if (periodo === PERIODOS_PROMEDIO_PRESION.MES) {
    return construirSeriePromedioMesPresion(registros, valorFiltro);
  }

  return construirSeriePromedioAnioPresion(registros, valorFiltro);
};
