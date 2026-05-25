import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./GraficaDistribucionPresion.module.css";

const PASO_BIN = 5;
const DOMINIO_FALLBACK = { minimo: 70, maximo: 150 };
const COLOR_SISTOLICA = "#4A80BC";
const COLOR_DIASTOLICA = "#66B8C9";
const PASO_EJE_Y = 2;
const TOTAL_TABULACIONES_EJE_Y = 8;

const redondearAbajo = (valor, paso) => Math.floor(valor / paso) * paso;
const redondearArriba = (valor, paso) => Math.ceil(valor / paso) * paso;

const obtenerLecturasValidas = (registros = []) =>
  registros
    .map((registro) => ({
      sistolica: Number(registro?.sistolica),
      diastolica: Number(registro?.diastolica),
    }))
    .filter(
      (registro) =>
        Number.isFinite(registro.sistolica) &&
        Number.isFinite(registro.diastolica) &&
        registro.sistolica > 0 &&
        registro.diastolica > 0
    );

const construirBins = (lecturas = []) => {
  const valores = lecturas.flatMap((lectura) => [
    lectura.sistolica,
    lectura.diastolica,
  ]);

  const minimo =
    valores.length > 0
      ? Math.min(
          DOMINIO_FALLBACK.minimo,
          redondearAbajo(Math.min(...valores) - PASO_BIN, 10)
        )
      : DOMINIO_FALLBACK.minimo;

  const maximo =
    valores.length > 0
      ? Math.max(
          DOMINIO_FALLBACK.maximo,
          redondearArriba(Math.max(...valores) + PASO_BIN, 10)
        )
      : DOMINIO_FALLBACK.maximo;

  const bins = [];

  for (let valor = minimo; valor <= maximo; valor += PASO_BIN) {
    const limiteSuperior = valor + PASO_BIN;
    const esUltimoBin = valor + PASO_BIN > maximo;

    bins.push({
      valor,
      etiqueta: String(valor),
      sistolica: lecturas.filter((lectura) =>
        esUltimoBin
          ? lectura.sistolica >= valor && lectura.sistolica <= limiteSuperior
          : lectura.sistolica >= valor && lectura.sistolica < limiteSuperior
      ).length,
      diastolica: lecturas.filter((lectura) =>
        esUltimoBin
          ? lectura.diastolica >= valor && lectura.diastolica <= limiteSuperior
          : lectura.diastolica >= valor && lectura.diastolica < limiteSuperior
      ).length,
    });
  }

  return bins;
};

const construirTicksEjeY = (serie) => {
  const maximoConteo = Math.max(
    0,
    ...serie.flatMap((item) => [item.sistolica, item.diastolica])
  );
  const maximoMinimoVisible = (TOTAL_TABULACIONES_EJE_Y - 1) * PASO_EJE_Y;
  const maximo = Math.max(
    maximoMinimoVisible,
    redondearArriba(maximoConteo + 1, PASO_EJE_Y)
  );
  const ticks = [];

  for (let tick = 0; tick <= maximo; tick += PASO_EJE_Y) {
    ticks.push(tick);
  }

  return { maximo, ticks };
};

const TooltipDistribucion = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const sistolica = payload.find((item) => item.dataKey === "sistolica")?.value ?? 0;
  const diastolica = payload.find((item) => item.dataKey === "diastolica")?.value ?? 0;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipTitulo}>{label} - {Number(label) + PASO_BIN} mmHg</p>
      <p>Sistólica: {sistolica}</p>
      <p>Diastólica: {diastolica}</p>
    </div>
  );
};

const GraficaDistribucionPresion = ({ registros = [] }) => {
  const lecturas = useMemo(() => obtenerLecturasValidas(registros), [registros]);
  const serieDistribucion = useMemo(() => construirBins(lecturas), [lecturas]);
  const escalaEjeY = useMemo(
    () => construirTicksEjeY(serieDistribucion),
    [serieDistribucion]
  );

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.titulo}>Distribución de presiones</h3>

        <div className={styles.leyenda}>
          <p>
            <span
              className={styles.puntoLeyenda}
              style={{ backgroundColor: COLOR_SISTOLICA }}
            ></span>
            Sistólica
          </p>
          <p>
            <span
              className={styles.puntoLeyenda}
              style={{ backgroundColor: COLOR_DIASTOLICA }}
            ></span>
            Diastólica
          </p>
        </div>
      </header>

      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={serieDistribucion}
            margin={{ top: 16, right: 28, left: 6, bottom: 26 }}
            barCategoryGap="38%"
            barGap={-12}
          >
            <CartesianGrid
              stroke="#CBD5E1"
              strokeDasharray="4 6"
              vertical={false}
            />

            <XAxis
              dataKey="etiqueta"
              tick={{ fill: "#344054", fontSize: 12 }}
              tickFormatter={(valor) => (Number(valor) % 10 === 0 ? valor : "")}
              axisLine={{ stroke: "#98A2B3" }}
              tickLine={false}
              interval={0}
              height={36}
            />

            <YAxis
              domain={[0, escalaEjeY.maximo]}
              ticks={escalaEjeY.ticks}
              tick={{ fill: "#344054", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={42}
            />

            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
              content={<TooltipDistribucion />}
            />

            <Bar
              dataKey="sistolica"
              fill={COLOR_SISTOLICA}
              radius={[10, 10, 10, 10]}
              barSize={18}
              isAnimationActive={false}
            />

            <Bar
              dataKey="diastolica"
              fill={COLOR_DIASTOLICA}
              radius={[10, 10, 10, 10]}
              barSize={18}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className={styles.etiquetaEjeY}>Número de mediciones</p>
      <p className={styles.etiquetaEjeX}>Presión Arterial (mmHg)</p>

      <p className={styles.descripcion}>
        Distribución de mediciones por rangos para identificar concentraciones y
        variaciones en la presión arterial.
      </p>
    </section>
  );
};

export default GraficaDistribucionPresion;
