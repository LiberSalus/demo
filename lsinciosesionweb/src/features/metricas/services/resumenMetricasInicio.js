import { IDS_METRICAS } from "../config/metricas.config";

const CLAVE_STORAGE_FRECUENCIA_CARDIACA = "frecuencia_cardiaca_registros_dia_v1";
const CLAVE_STORAGE_PRESION_ARTERIAL = "presion_arterial_registros_dia_v1";
const CLAVE_STORAGE_OXIGENACION = "oxigenacion_registros_dia_v1";
const CLAVE_STORAGE_GLUCOSA = "glucosa_registros_dia_v1";

// Lee JSON desde localStorage sin romper la pantalla si el valor viene dañado.
function leerJsonStorage(clave) {
  try {
    const textoGuardado = localStorage.getItem(clave);
    return textoGuardado ? JSON.parse(textoGuardado) : null;
  } catch {
    return null;
  }
}

// Obtiene el registro mas reciente de una lista de mediciones con fecha ISO.
function obtenerRegistroMasReciente(registros = []) {
  return registros
    .filter((registro) => registro?.fechaHoraISO && Number.isFinite(registro?.ppm))
    .sort(
      (actual, siguiente) =>
        new Date(siguiente.fechaHoraISO).getTime() -
        new Date(actual.fechaHoraISO).getTime()
    )[0];
}

// Construye el resumen visible para frecuencia cardiaca desde las capturas locales.
function obtenerResumenFrecuenciaCardiaca() {
  const estadoGuardado = leerJsonStorage(CLAVE_STORAGE_FRECUENCIA_CARDIACA);
  const ultimoRegistro = obtenerRegistroMasReciente(
    estadoGuardado?.registrosDelDia
  );

  return ultimoRegistro ? String(ultimoRegistro.ppm) : "--";
}

// Construye el resumen visible para presion arterial desde las capturas locales.
function obtenerResumenPresionArterial() {
  const estadoGuardado = leerJsonStorage(CLAVE_STORAGE_PRESION_ARTERIAL);
  const registrosGuardados = Array.isArray(estadoGuardado)
    ? estadoGuardado
    : estadoGuardado?.registrosDelDia;

  const ultimoRegistro = Array.isArray(registrosGuardados)
    ? registrosGuardados
        .filter(
          (registro) =>
            Number.isFinite(Number(registro?.sistolica)) &&
            Number.isFinite(Number(registro?.diastolica))
        )
        .sort((actual, siguiente) => {
          const fechaSiguiente =
            Number(siguiente?.createdAtMs) ||
            new Date(siguiente?.fechaHoraISO ?? siguiente?.ts).getTime();
          const fechaActual =
            Number(actual?.createdAtMs) ||
            new Date(actual?.fechaHoraISO ?? actual?.ts).getTime();

          return fechaSiguiente - fechaActual;
        })[0]
    : null;

  return ultimoRegistro
    ? `${ultimoRegistro.sistolica}/${ultimoRegistro.diastolica}`
    : "--";
}

// Construye el resumen visible para oxigenacion desde las capturas locales.
function obtenerResumenOxigenacion() {
  const estadoGuardado = leerJsonStorage(CLAVE_STORAGE_OXIGENACION);
  const registrosGuardados = estadoGuardado?.registrosDelDia;
  const ultimoRegistro = Array.isArray(registrosGuardados)
    ? registrosGuardados
        .filter(
          (registro) =>
            !String(registro?.id ?? "").startsWith("spo2-inicial-") &&
            Number.isFinite(Number(registro?.valor))
        )
        .sort(
          (actual, siguiente) =>
            new Date(siguiente?.fechaHoraISO).getTime() -
            new Date(actual?.fechaHoraISO).getTime()
        )[0]
    : null;

  return ultimoRegistro ? String(ultimoRegistro.valor) : "--";
}

// Construye el resumen visible para glucosa desde el contrato diario local.
function obtenerResumenGlucosa() {
  const contratoGuardado = leerJsonStorage(CLAVE_STORAGE_GLUCOSA);
  const lecturas = contratoGuardado?.medicionesPorFiltro
    ? Object.values(contratoGuardado.medicionesPorFiltro).flatMap(
        (bloque) => bloque?.puntos ?? []
      )
    : [];

  const ultimaLectura = lecturas
    .filter((lectura) => Number.isFinite(Number(lectura?.toma)))
    .sort(
      (actual, siguiente) =>
        new Date(siguiente?.fechaHoraISO).getTime() -
        new Date(actual?.fechaHoraISO).getTime()
    )[0];

  return ultimaLectura ? String(ultimaLectura.toma) : "--";
}

const LECTORES_RESUMEN = {
  [IDS_METRICAS.FRECUENCIA_CARDIACA]: obtenerResumenFrecuenciaCardiaca,
  [IDS_METRICAS.PRESION_ARTERIAL]: obtenerResumenPresionArterial,
  [IDS_METRICAS.SPO2]: obtenerResumenOxigenacion,
  [IDS_METRICAS.GLUCOSA]: obtenerResumenGlucosa,
};

// Devuelve la ultima lectura conocida para pintar tarjetas del Inicio.
export function obtenerUltimaLecturaMetrica(metricaId) {
  const lectorResumen = LECTORES_RESUMEN[metricaId];
  return lectorResumen ? lectorResumen() : "--";
}
