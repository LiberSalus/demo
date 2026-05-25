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
];
