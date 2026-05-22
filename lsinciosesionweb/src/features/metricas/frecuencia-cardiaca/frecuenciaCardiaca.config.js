import { AREAS_METRICAS } from "../config/areas.config";
import { ESTADOS_METRICA, IDS_METRICAS } from "../config/metricas.config";
import FrecuenciaCardiaca from "./FrecuenciaCardiaca";

export const frecuenciaCardiacaConfig = {
  id: IDS_METRICAS.FRECUENCIA_CARDIACA,
  area: AREAS_METRICAS.SALUD_FISICA,
  label: "Frecuencia cardiaca",
  unidad: "ppm",
  estado: ESTADOS_METRICA.EN_PREPARACION,
  Component: FrecuenciaCardiaca,
};
