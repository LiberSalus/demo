import React, { useMemo } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./GraficaDistribucionGlucosa.module.css";

const construirBucketsBase = () =>
  Array.from({ length: 19 }, (_, index) => {
    const valor = 40 + index * 10;
    return {
      etiquetaX: String(valor),
      valorX: valor,
      cantidad: 0,
      color: "#6eaf53",
    };
  });

const obtenerColorGlucosa = (valor, esAyuno) => {
  if (esAyuno) {
    if (valor < 70) return "#67b7cc";
    if (valor <= 99) return "#6eaf53";
    if (valor <= 125) return "#eda93b";
    return "#c52d16";
  }

  if (valor < 70) return "#67b7cc";
  if (valor < 140) return "#6eaf53";
  if (valor < 200) return "#eda93b";
  return "#c52d16";
};

const construirSerieDistribucionGlucosa = ({ lecturas = [], esAyuno }) => {
  const bucketsMap = new Map(
    construirBucketsBase().map((item) => [item.valorX, { ...item }]),
  );

  lecturas.forEach((lectura) => {
    const valor = Number(lectura?.toma);
    if (!Number.isFinite(valor)) return;

    const bucket = Math.max(40, Math.min(220, Math.round(valor / 10) * 10));
    const actual = bucketsMap.get(bucket);
    if (!actual) return;

    actual.cantidad += 1;
    actual.color = obtenerColorGlucosa(valor, esAyuno);
  });

  return Array.from(bucketsMap.values());
};

const construirEscalaEjeY = (serie) => {
  const maximo = Math.max(...serie.map((item) => item.cantidad), 0);
  const techo = maximo <= 6 ? 6 : Math.ceil(maximo / 2) * 2 + 2;
  const ticks = [];

  for (let valor = 0; valor <= techo; valor += 2) {
    ticks.push(valor);
  }

  return {
    dominio: [0, techo],
    ticks,
  };
};

const GraficaDistribucionGlucosa = ({ esAyuno, lecturas = [] }) => {
  const serieDistribucion = useMemo(
    () => construirSerieDistribucionGlucosa({ lecturas, esAyuno }),
    [lecturas, esAyuno],
  );

  const escalaEjeY = useMemo(
    () => construirEscalaEjeY(serieDistribucion),
    [serieDistribucion],
  );

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.titulo}>Distribución de frecuencias</h3>
        <p className={styles.base}>{esAyuno ? "Ayuno" : "Después de comer"}</p>
      </div>

      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={serieDistribucion}
            margin={{ top: 8, right: 18, left: -18, bottom: 28 }}
          >
            <defs>
              <linearGradient
                id="rellenoDistribucionGlucosa"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#f2d86d" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#f2d86d" stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#c2c8d1"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="etiquetaX"
              tick={{ fill: "#364152", fontSize: 12 }}
              axisLine={{ stroke: "#a6a8ac" }}
              tickLine={false}
              interval={1}
              tickFormatter={(value) =>
                Number(value) % 20 === 0 ? value : ""
              }
              height={28}
            />

            <YAxis
              domain={escalaEjeY.dominio}
              ticks={escalaEjeY.ticks}
              tick={{ fill: "#364152", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Area
              type="monotone"
              dataKey="cantidad"
              stroke="transparent"
              fill="url(#rellenoDistribucionGlucosa)"
              fillOpacity={1}
              isAnimationActive={false}
            />

            <Bar
              dataKey="cantidad"
              radius={[999, 999, 0, 0]}
              barSize={18}
              isAnimationActive={false}
            >
              {serieDistribucion.map((item) => (
                <Cell key={item.etiquetaX} fill={item.color} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className={styles.etiquetaEjeY}>Número de mediciones</p>
      <p className={styles.etiquetaEjeX}>Glucosa en sangre (mg/dL)</p>

      <p className={styles.descripcion}>
        Distribución de mediciones por rangos para identificar
        concentraciones y variaciones en la glucosa en sangre.
      </p>
    </section>
  );
};

export default GraficaDistribucionGlucosa;
