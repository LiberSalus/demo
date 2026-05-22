import styles from "./SaludFisica.module.css";

import MetricasTabs from "@/features/metricas/components/MetricasTabs/MetricasTabs";
import { AREAS_METRICAS } from "@/features/metricas/config/areas.config";
import { useMetricasArea } from "@/features/metricas/hooks/useMetricasArea";

// Contenedor de Salud Fisica conectado al registro nuevo de metricas v2.
const SaludFisica = () => {
  const metricas = useMetricasArea(AREAS_METRICAS.SALUD_FISICA);

  return (
    <div className={styles.SaludFisica}>
      <MetricasTabs tituloSeccion="Salud Fisica" metricas={metricas} />
    </div>
  );
};

export default SaludFisica;
