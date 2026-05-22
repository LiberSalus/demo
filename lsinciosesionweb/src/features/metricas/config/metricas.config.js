import FrecuenciaCardiacaV2 from "../frecuencia-cardiaca/FrecuenciaCardiaca";
import PresionArterialLegacy from "@/pages/SaludFisica/PresionArterial/PresionArterial";
import OxigenacionLegacy from "@/pages/SaludFisica/Oxigenacion/Oxigenacion";
import GlucosaLegacy from "@/pages/SaludFisica/GlucosaEnSangre/Glucosa";
import ActividadFisicaLegacy from "@/pages/SaludFisica/ActividadFisica/ActividadFisica";
import CicloMenstrualLegacy from "@/pages/SaludFisica/CicloMenstrual/CicloMenstrual";

import { AREAS_METRICAS } from "./areas.config";

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
    Component: FrecuenciaCardiacaV2,
  },
  {
    id: IDS_METRICAS.PRESION_ARTERIAL,
    area: AREAS_METRICAS.SALUD_FISICA,
    label: "Presion arterial",
    unidad: "mmHg",
    orden: 20,
    estado: ESTADOS_METRICA.LEGACY,
    Component: PresionArterialLegacy,
  },
  {
    id: IDS_METRICAS.SPO2,
    area: AREAS_METRICAS.SALUD_FISICA,
    label: "Oxigenacion",
    unidad: "%",
    orden: 30,
    estado: ESTADOS_METRICA.LEGACY,
    Component: OxigenacionLegacy,
  },
  {
    id: IDS_METRICAS.GLUCOSA,
    area: AREAS_METRICAS.SALUD_FISICA,
    label: "Glucosa en sangre",
    unidad: "mg/dL",
    orden: 40,
    estado: ESTADOS_METRICA.LEGACY,
    Component: GlucosaLegacy,
  },
  {
    id: IDS_METRICAS.PASOS,
    area: AREAS_METRICAS.SALUD_FISICA,
    label: "Actividad fisica",
    unidad: "pasos",
    orden: 50,
    estado: ESTADOS_METRICA.LEGACY,
    Component: ActividadFisicaLegacy,
  },
  {
    id: IDS_METRICAS.CICLO_MENSTRUAL,
    area: AREAS_METRICAS.SALUD_FISICA,
    label: "Ciclo menstrual",
    unidad: "dias",
    orden: 60,
    estado: ESTADOS_METRICA.LEGACY,
    Component: CicloMenstrualLegacy,
  },
];
