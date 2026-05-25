import { Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { ROUTES } from "@/config/routes";
import styles from "./MetricasTabs.module.css";

const METRICAS_REGISTROS = {
  frecuencia_cardiaca: "FrecuenciaCardiaca",
  presion_arterial: "PresionArterial",
  spo2: "Oxigenacion",
  glucosa: "Glucosa",
};

// Define que metrica debe mostrarse al entrar segun la URL o el orden configurado.
const obtenerMetricaInicial = (metricas, metricaUrl) => {
  if (!metricas.length) return null;
  return metricas.find((metrica) => metrica.id === metricaUrl) || metricas[0];
};

// Renderiza las pestañas de metricas y mantiene sincronizada la metrica activa con la URL.
export default function MetricasTabs({ metricas = [], tituloSeccion }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const metricaUrl = searchParams.get("metric");
  const metricaInicial = useMemo(
    () => obtenerMetricaInicial(metricas, metricaUrl),
    [metricas, metricaUrl]
  );

  const [metricaActivaId, setMetricaActivaId] = useState(
    metricaInicial?.id || ""
  );

  useEffect(() => {
    if (metricaInicial?.id) {
      setMetricaActivaId(metricaInicial.id);
    }
  }, [metricaInicial]);

  // Cambia la metrica visible y guarda el id en query params para URLs compartibles.
  const seleccionarMetrica = (metricaId) => {
    setMetricaActivaId(metricaId);

    const siguientesParams = new URLSearchParams(searchParams);
    siguientesParams.set("metric", metricaId);
    setSearchParams(siguientesParams, { replace: true });
  };

  if (!metricas.length) {
    return (
      <section className={styles.MetricasTabs}>
        {tituloSeccion && <h3 className={styles.titulo}>{tituloSeccion}</h3>}
        <div className={styles.panelVacio}>No hay metricas configuradas.</div>
      </section>
    );
  }

  const metricaActiva =
    metricas.find((metrica) => metrica.id === metricaActivaId) || metricas[0];
  const ComponenteActivo = metricaActiva.Component;
  const metricaRegistros = METRICAS_REGISTROS[metricaActiva.id];

  // Navega al listado de registros usando la clave esperada por BorradorDos.
  const verRegistros = () => {
    if (!metricaRegistros) return;
    navigate(`${ROUTES.REGISTROS}?metrica=${metricaRegistros}`);
  };

  return (
    <section className={styles.MetricasTabs}>
      <div className={styles.encabezado}>
        {tituloSeccion && <h3 className={styles.titulo}>{tituloSeccion}</h3>}
        {metricaRegistros && (
          <button
            type="button"
            className={styles.btnRegistros}
            onClick={verRegistros}
          >
            Ver Registros
            <span className={styles.btnRegistrosIcono} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        )}
      </div>

      <div className={styles.contenedor}>
        <div className={styles.mobileSelectWrap}>
          <select
            className={styles.mobileSelect}
            value={metricaActiva.id}
            onChange={(event) => seleccionarMetrica(event.target.value)}
            aria-label={`Selecciona una metrica de ${tituloSeccion || "salud"}`}
          >
            {metricas.map((metrica) => (
              <option key={metrica.id} value={metrica.id}>
                {metrica.label}
              </option>
            ))}
          </select>
          <span className={styles.mobileSelectIcon} aria-hidden="true">
            v
          </span>
        </div>

        <div className={styles.tabs} role="tablist" aria-label={tituloSeccion}>
          {metricas.map((metrica) => (
            <button
              key={metrica.id}
              type="button"
              role="tab"
              aria-selected={metrica.id === metricaActiva.id}
              className={`${styles.tabBtn} ${
                metrica.id === metricaActiva.id ? styles.tabBtnActiva : ""
              }`}
              onClick={() => seleccionarMetrica(metrica.id)}
            >
              {metrica.label}
            </button>
          ))}
        </div>

        <div className={styles.contenido}>
          <Suspense
            fallback={
              <div className={styles.cargandoMetrica}>Cargando metrica...</div>
            }
          >
            <ComponenteActivo metrica={metricaActiva} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
