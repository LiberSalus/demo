//src\pages\SaludMental\SaludMental.jsx
import MetricasTabs from "@/features/metricas/components/MetricasTabs/MetricasTabs";
import { AREAS_METRICAS } from "@/features/metricas/config/areas.config";
import { useMetricasArea } from "@/features/metricas/hooks/useMetricasArea";

// Contenedor de Salud Mental conectado al registro compartido de metricas.
const SaludMental = () => {
  const metricas = useMetricasArea(AREAS_METRICAS.SALUD_MENTAL);

  return (
    <MetricasTabs tituloSeccion="Salud Mental" metricas={metricas} />
  );
};

export default SaludMental;
