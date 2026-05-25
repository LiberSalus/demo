//src\pages\SaludNutricional\SaludNutricional.jsx
import MetricasTabs from "@/features/metricas/components/MetricasTabs/MetricasTabs";
import { AREAS_METRICAS } from "@/features/metricas/config/areas.config";
import { useMetricasArea } from "@/features/metricas/hooks/useMetricasArea";

// Contenedor de Salud Nutricional conectado al registro compartido de metricas.
const SaludNutricional = () => {
  const metricas = useMetricasArea(AREAS_METRICAS.SALUD_NUTRICIONAL);

  return (
    <MetricasTabs tituloSeccion="Salud Nutricional" metricas={metricas} />
  );
};

export default SaludNutricional;
