import { lazy } from "react";

import { AREAS_METRICAS } from "./areas.config";

// Carga la metrica nueva de frecuencia cardiaca solo cuando el usuario la abre.
function cargarFrecuenciaCardiaca() {
  return import("../frecuencia-cardiaca/FrecuenciaCardiaca");
}

// Carga la metrica legacy de presion arterial mientras termina su migracion v2.
function cargarPresionArterialLegacy() {
  return import("@/pages/SaludFisica/PresionArterial/PresionArterial");
}

// Carga la metrica legacy de oxigenacion mientras termina su migracion v2.
function cargarOxigenacionLegacy() {
  return import("@/pages/SaludFisica/Oxigenacion/Oxigenacion");
}

// Carga la metrica legacy de glucosa mientras termina su migracion v2.
function cargarGlucosaLegacy() {
  return import("@/pages/SaludFisica/GlucosaEnSangre/Glucosa");
}

// Carga la metrica legacy de actividad fisica mientras termina su migracion v2.
function cargarActividadFisicaLegacy() {
  return import("@/pages/SaludFisica/ActividadFisica/ActividadFisica");
}

// Carga la metrica legacy de ciclo menstrual mientras termina su migracion v2.
function cargarCicloMenstrualLegacy() {
  return import("@/pages/SaludFisica/CicloMenstrual/CicloMenstrual");
}

// Carga la metrica legacy de estres mientras se prepara su version v2.
function cargarEstresLegacy() {
  return import("@/pages/SaludMental/Estres/Estres");
}

// Carga la metrica legacy de energia mientras se prepara su version v2.
function cargarEnergiaLegacy() {
  return import("@/pages/SaludMental/Energia/Energia");
}

// Carga la metrica legacy de descanso mientras se prepara su version v2.
function cargarDescansoLegacy() {
  return import("@/pages/SaludMental/Descanso/Descanso");
}

// Carga la metrica legacy de estado de animo mientras se prepara su version v2.
function cargarEstadoAnimoLegacy() {
  return import("@/pages/SaludMental/EstadoAnimo/EstadoAnimo");
}

// Carga la metrica legacy de peso mientras se prepara su version v2.
function cargarPesoLegacy() {
  return import("@/pages/SaludNutricional/Peso/Peso");
}

// Carga la metrica legacy de hidratacion mientras se prepara su version v2.
function cargarHidratacionLegacy() {
  return import("@/pages/SaludNutricional/Hidratacion/Hidratacion");
}

// Carga la metrica legacy de calorias quemadas mientras se prepara su version v2.
function cargarKcalQuemadasLegacy() {
  return import("@/pages/SaludNutricional/KcalQuemadas/KcalQuemadas");
}

// Carga la metrica legacy de calorias consumidas mientras se prepara su version v2.
function cargarKcalConsumidasLegacy() {
  return import("@/pages/SaludNutricional/KcalConsumidas/KcalConsumidas");
}

export const ESTADOS_METRICA = {
  ACTIVA: "activa",
  LEGACY: "legacy",
  EN_PREPARACION: "en_preparacion",
};

export const IDS_METRICAS = {
  FRECUENCIA_CARDIACA: "frecuencia_cardiaca",
  PRESION_ARTERIAL: "presion_arterial",
  SPO2: "spo2",
  GLUCOSA: "glucosa",
  PASOS: "pasos",
  CICLO_MENSTRUAL: "ciclo_menstrual",
  ESTRES: "estres",
  ENERGIA: "energia",
  DESCANSO: "descanso",
  ESTADO_ANIMO: "estado_animo",
  PESO: "peso",
  HIDRATACION: "hidratacion",
  KCAL_QUEMADAS: "kcal_quemadas",
  KCAL_CONSUMIDAS: "kcal_consumidas",
};

// Puente temporal: mantiene viva la vista actual mientras migramos metricas desde BorradorDos.
export const METRICAS_V2 = [
  {
    id: IDS_METRICAS.FRECUENCIA_CARDIACA,
    area: AREAS_METRICAS.SALUD_FISICA,
    label: "Frecuencia cardiaca",
    unidad: "ppm",
    orden: 10,
    estado: ESTADOS_METRICA.ACTIVA,
    Component: lazy(cargarFrecuenciaCardiaca),
  },
  {
    id: IDS_METRICAS.PRESION_ARTERIAL,
    area: AREAS_METRICAS.SALUD_FISICA,
    label: "Presion arterial",
    unidad: "mmHg",
    orden: 20,
    estado: ESTADOS_METRICA.LEGACY,
    Component: lazy(cargarPresionArterialLegacy),
  },
  {
    id: IDS_METRICAS.SPO2,
    area: AREAS_METRICAS.SALUD_FISICA,
    label: "Oxigenacion",
    unidad: "%",
    orden: 30,
    estado: ESTADOS_METRICA.LEGACY,
    Component: lazy(cargarOxigenacionLegacy),
  },
  {
    id: IDS_METRICAS.GLUCOSA,
    area: AREAS_METRICAS.SALUD_FISICA,
    label: "Glucosa en sangre",
    unidad: "mg/dL",
    orden: 40,
    estado: ESTADOS_METRICA.LEGACY,
    Component: lazy(cargarGlucosaLegacy),
  },
  {
    id: IDS_METRICAS.PASOS,
    area: AREAS_METRICAS.SALUD_FISICA,
    label: "Actividad fisica",
    unidad: "pasos",
    orden: 50,
    estado: ESTADOS_METRICA.LEGACY,
    Component: lazy(cargarActividadFisicaLegacy),
  },
  {
    id: IDS_METRICAS.CICLO_MENSTRUAL,
    area: AREAS_METRICAS.SALUD_FISICA,
    label: "Ciclo menstrual",
    unidad: "dias",
    orden: 60,
    estado: ESTADOS_METRICA.LEGACY,
    Component: lazy(cargarCicloMenstrualLegacy),
  },
  {
    id: IDS_METRICAS.ESTRES,
    area: AREAS_METRICAS.SALUD_MENTAL,
    label: "Estrés",
    unidad: "",
    orden: 10,
    estado: ESTADOS_METRICA.LEGACY,
    Component: lazy(cargarEstresLegacy),
  },
  {
    id: IDS_METRICAS.ENERGIA,
    area: AREAS_METRICAS.SALUD_MENTAL,
    label: "Energía",
    unidad: "",
    orden: 20,
    estado: ESTADOS_METRICA.LEGACY,
    Component: lazy(cargarEnergiaLegacy),
  },
  {
    id: IDS_METRICAS.DESCANSO,
    area: AREAS_METRICAS.SALUD_MENTAL,
    label: "Descanso",
    unidad: "",
    orden: 30,
    estado: ESTADOS_METRICA.LEGACY,
    Component: lazy(cargarDescansoLegacy),
  },
  {
    id: IDS_METRICAS.ESTADO_ANIMO,
    area: AREAS_METRICAS.SALUD_MENTAL,
    label: "Estado de ánimo",
    unidad: "",
    orden: 40,
    estado: ESTADOS_METRICA.LEGACY,
    Component: lazy(cargarEstadoAnimoLegacy),
  },
  {
    id: IDS_METRICAS.PESO,
    area: AREAS_METRICAS.SALUD_NUTRICIONAL,
    label: "Peso",
    unidad: "kg",
    orden: 10,
    estado: ESTADOS_METRICA.LEGACY,
    Component: lazy(cargarPesoLegacy),
  },
  {
    id: IDS_METRICAS.HIDRATACION,
    area: AREAS_METRICAS.SALUD_NUTRICIONAL,
    label: "Hidratación",
    unidad: "ml",
    orden: 20,
    estado: ESTADOS_METRICA.LEGACY,
    Component: lazy(cargarHidratacionLegacy),
  },
  {
    id: IDS_METRICAS.KCAL_QUEMADAS,
    area: AREAS_METRICAS.SALUD_NUTRICIONAL,
    label: "kCal quemadas",
    unidad: "kcal",
    orden: 30,
    estado: ESTADOS_METRICA.LEGACY,
    Component: lazy(cargarKcalQuemadasLegacy),
  },
  {
    id: IDS_METRICAS.KCAL_CONSUMIDAS,
    area: AREAS_METRICAS.SALUD_NUTRICIONAL,
    label: "kCal consumidas",
    unidad: "kcal",
    orden: 40,
    estado: ESTADOS_METRICA.LEGACY,
    Component: lazy(cargarKcalConsumidasLegacy),
  },
];
