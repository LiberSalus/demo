import { AREAS_METRICAS } from "../config/areas.config";
import { ESTADOS_METRICA, IDS_METRICAS } from "../config/metricas.config";
import PresionArterial from "./PresionArterial";

export const presionArterialConfig = {
  id: IDS_METRICAS.PRESION_ARTERIAL,
  area: AREAS_METRICAS.SALUD_FISICA,
  label: "Presion arterial",
  unidad: "mmHg",
  estado: ESTADOS_METRICA.EN_PREPARACION,
  Component: PresionArterial,
};
