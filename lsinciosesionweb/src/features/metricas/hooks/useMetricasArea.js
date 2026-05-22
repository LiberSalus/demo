import { useMemo } from "react";

import { METRICAS_V2 } from "../config/metricas.config";

// Devuelve las metricas registradas para un area en el orden definido por configuracion.
export function useMetricasArea(area) {
  return useMemo(() => {
    return METRICAS_V2.filter((metrica) => metrica.area === area).sort(
      (actual, siguiente) => actual.orden - siguiente.orden
    );
  }, [area]);
}
