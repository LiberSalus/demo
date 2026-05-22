import React, { useMemo } from "react";
import styles from "./GraficaPromedioFrecuencia.module.css";
import { PERIODOS_PROMEDIO } from "../utils/promedioFrecuencias.utils";

const PERIODOS_UI = [
  { valor: PERIODOS_PROMEDIO.SEMANA, etiqueta: "Semana" },
  { valor: PERIODOS_PROMEDIO.MES, etiqueta: "Mes" },
  { valor: PERIODOS_PROMEDIO.ANIO, etiqueta: "Año" },
];

const DOMINIO_FALLBACK = [40, 160];
const TICKS_FALLBACK = [40, 60, 80, 100, 120, 140, 160];
const MARGEN_EJE_Y = 10;
const PASO_TICK = 10;
const ANCHO_BASE = 1000;
const ALTO_BASE = 180;
const ALTO_CARRIL_X = 78;

const redondearHaciaAbajo = (valor, paso) =>
  Math.floor(valor / paso) * paso;

const redondearHaciaArriba = (valor, paso) =>
  Math.ceil(valor / paso) * paso;

const obtenerNumeroValido = (...valores) => {
  for (const valor of valores) {
    const numero = Number(valor);
    if (Number.isFinite(numero)) {
      return numero;
    }
  }

  return null;
};

const obtenerTextoEtiqueta = (item, indice) => {
  const posiblesEtiquetas = [
    item?.etiquetaX,
    item?.etiqueta,
    item?.label,
    item?.nombre,
    item?.dia,
    item?.mes,
    item?.periodo,
  ];

  const etiqueta = posiblesEtiquetas.find(
    (valor) => typeof valor === "string" && valor.trim()
  );

  if (etiqueta) {
    return etiqueta.trim();
  }

  return String(indice + 1);
};

const normalizarSerie = (serie = []) =>
  serie.map((item, indice) => {
    const minimoOriginal = obtenerNumeroValido(
      item?.minimo,
      item?.valorMinimo,
      item?.ppmMinimo,
      item?.min
    );

    const maximoOriginal = obtenerNumeroValido(
      item?.maximo,
      item?.valorMaximo,
      item?.ppmMaximo,
      item?.max
    );

    const tieneLecturaValida =
      Number.isFinite(minimoOriginal) &&
      Number.isFinite(maximoOriginal) &&
      minimoOriginal > 0 &&
      maximoOriginal > 0;

    const minimo = tieneLecturaValida
      ? Math.min(minimoOriginal, maximoOriginal)
      : null;

    const maximo = tieneLecturaValida
      ? Math.max(minimoOriginal, maximoOriginal)
      : null;

    return {
      indice,
      etiqueta: obtenerTextoEtiqueta(item, indice),
      minimo,
      maximo,
      tieneLectura: Number.isFinite(minimo) && Number.isFinite(maximo),
    };
  });

const construirEscalaEjeY = (datos) => {
  const valores = datos.flatMap((dato) =>
    dato.tieneLectura ? [dato.minimo, dato.maximo] : []
  );

  if (!valores.length) {
    return {
      minimo: DOMINIO_FALLBACK[0],
      maximo: DOMINIO_FALLBACK[1],
      ticks: TICKS_FALLBACK,
    };
  }

  const minimo = redondearHaciaAbajo(
    Math.min(...valores) - MARGEN_EJE_Y,
    PASO_TICK
  );
  const maximo = redondearHaciaArriba(
    Math.max(...valores) + MARGEN_EJE_Y,
    PASO_TICK
  );

  const minimoSeguro = Math.max(0, minimo);
  const maximoSeguro =
    maximo <= minimoSeguro ? minimoSeguro + PASO_TICK * 4 : maximo;

  const ticks = [];
  for (let tick = minimoSeguro; tick <= maximoSeguro; tick += PASO_TICK) {
    ticks.push(tick);
  }

  return {
    minimo: minimoSeguro,
    maximo: maximoSeguro,
    ticks,
  };
};

const formatearEtiquetaX = (dato, indice, total, periodoSeleccionado) => {
  if (periodoSeleccionado === PERIODOS_PROMEDIO.SEMANA) {
    return dato.etiqueta;
  }

  if (periodoSeleccionado === PERIODOS_PROMEDIO.MES) {
    const numeroDia = Number(dato.etiqueta);
    const esNumeroDia = Number.isFinite(numeroDia);
    const diaVisible =
      esNumeroDia &&
      (numeroDia === 1 ||
        numeroDia === total ||
        numeroDia % 5 === 0 ||
        numeroDia === 15);

    return diaVisible ? String(numeroDia) : "";
  }

  if (periodoSeleccionado === PERIODOS_PROMEDIO.ANIO) {
    return dato.etiqueta.slice(0, 3);
  }

  return indice === 0 || indice === total - 1 ? dato.etiqueta : "";
};

const construirLineasReferencia = (escala) =>
  [
    { valor: 60, clase: styles.guiaVerde },
    { valor: 100, clase: styles.guiaVerde },
    { valor: 120, clase: styles.guiaNaranja },
  ].filter(
    (linea) => linea.valor >= escala.minimo && linea.valor <= escala.maximo
  );

const normalizarOpcionesFiltro = (opciones = []) =>
  opciones.map((opcion, indice) => {
    const valorOriginal =
      opcion?.valor ?? opcion?.value ?? opcion?.id ?? opcion ?? indice;
    const etiqueta =
      opcion?.etiqueta ??
      opcion?.label ??
      opcion?.nombre ??
      String(valorOriginal);

    return {
      clave: `${indice}-${String(valorOriginal)}`,
      valorOriginal,
      valorSelect: String(valorOriginal),
      etiqueta: String(etiqueta),
    };
  });

const convertirValorAY = (valor, escala) => {
  const rango = escala.maximo - escala.minimo || 1;
  return ALTO_BASE - ((valor - escala.minimo) / rango) * ALTO_BASE;
};

const construirSegmentos = (datos, escala) => {
  if (!datos.length) {
    return [];
  }

  const anchoPaso = ANCHO_BASE / datos.length;

  return datos
    .filter((dato) => dato.tieneLectura)
    .map((dato) => ({
      x: anchoPaso * dato.indice + anchoPaso / 2,
      y1: convertirValorAY(dato.maximo, escala),
      y2: convertirValorAY(dato.minimo, escala),
    }));
};

function GraficaPromedioFrecuencia({
  periodoSeleccionado = PERIODOS_PROMEDIO.SEMANA,
  opcionesFiltro = [],
  valorFiltro = "",
  serie = [],
  onPeriodoChange = () => {},
  onFiltroChange = () => {},
  indiceSeleccionado = null,
  onLecturaSelect = () => {},
}) {
  const datosGrafica = useMemo(() => normalizarSerie(serie), [serie]);
  const escalaEjeY = useMemo(
    () => construirEscalaEjeY(datosGrafica),
    [datosGrafica]
  );
  const lineasReferencia = useMemo(
    () => construirLineasReferencia(escalaEjeY),
    [escalaEjeY]
  );
  const segmentos = useMemo(
    () => construirSegmentos(datosGrafica, escalaEjeY),
    [datosGrafica, escalaEjeY]
  );
  const opcionesNormalizadas = useMemo(
    () => normalizarOpcionesFiltro(opcionesFiltro),
    [opcionesFiltro]
  );

  const valorFiltroSelect =
    opcionesNormalizadas.find(
      (opcion) => String(opcion.valorOriginal) === String(valorFiltro)
    )?.valorSelect ?? opcionesNormalizadas[0]?.valorSelect ?? "";
  const etiquetasEjeX = datosGrafica.map((dato, indice) =>
    formatearEtiquetaX(dato, indice, datosGrafica.length, periodoSeleccionado)
  );

  const variablesGrafica = {
    "--alto-svg": `${ALTO_BASE + ALTO_CARRIL_X}px`,
    "--alto-trama": `${ALTO_BASE}px`,
    "--alto-carril-x": `${ALTO_CARRIL_X}px`,
    "--columnas-eje-x": String(Math.max(datosGrafica.length, 1)),
  };

  return (
    <article className={styles.card} style={variablesGrafica}>
      <h3 className={styles.titulo}>Promedio Frecuencia cardiaca</h3>

      <div className={styles.periodos}>
        {PERIODOS_UI.map((periodo) => (
          <button
            key={periodo.valor}
            type="button"
            className={`${styles.periodo} ${
              periodoSeleccionado === periodo.valor ? styles.periodoActivo : ""
            }`}
            onClick={() => onPeriodoChange(periodo.valor)}
          >
            {periodo.etiqueta}
          </button>
        ))}
      </div>

      <div className={styles.ppm}>PPM</div>

      <div className={styles.areaGrafica}>
        <div className={styles.ejeYMarco}>
          <div className={styles.ejeY}>
            {escalaEjeY.ticks
              .slice()
              .reverse()
              .map((tick) => (
                <span key={tick} className={styles.tickEjeY}>
                  {tick}
                </span>
              ))}
          </div>
        </div>

        <div className={styles.zonaGrafica}>
          <svg
            className={styles.svgGrafica}
            viewBox={`0 0 ${ANCHO_BASE} ${ALTO_BASE + ALTO_CARRIL_X}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {escalaEjeY.ticks.map((tick) => {
              const y = convertirValorAY(tick, escalaEjeY);
              return (
                <line
                  key={`tick-${tick}`}
                  className={styles.guiaHorizontal}
                  x1="0"
                  y1={y}
                  x2={ANCHO_BASE}
                  y2={y}
                />
              );
            })}

            {lineasReferencia.map((linea) => {
              const y = convertirValorAY(linea.valor, escalaEjeY);
              return (
                <line
                  key={`referencia-${linea.valor}`}
                  className={linea.clase}
                  x1="0"
                  y1={y}
                  x2={ANCHO_BASE}
                  y2={y}
                />
              );
            })}

            <line
              className={styles.lineaBase}
              x1="0"
              y1={ALTO_BASE}
              x2={ANCHO_BASE}
              y2={ALTO_BASE}
            />

            {segmentos.map((segmento, indice) => (
              <line
                key={`segmento-${indice}`}
                className={`${styles.segmentoLectura} ${
                  segmento.indice === indiceSeleccionado
                    ? styles.segmentoLecturaActivo
                    : ""
                }`}
                x1={segmento.x}
                y1={segmento.y1}
                x2={segmento.x}
                y2={segmento.y2}
              />
            ))}
          </svg>

          <div className={styles.ejeXHtml}>
            {etiquetasEjeX.map((etiqueta, indice) => (
              <span key={`etiqueta-x-${indice}`} className={styles.tickEjeX}>
                {etiqueta}
              </span>
            ))}
          </div>

          <div className={styles.capaInteractiva}>
            {datosGrafica.map((dato) => (
              <button
                key={`lectura-${dato.indice}`}
                type="button"
                className={`${styles.hitArea} ${
                  dato.indice === indiceSeleccionado ? styles.hitAreaActiva : ""
                }`}
                onClick={() => {
                  if (dato.tieneLectura) {
                    onLecturaSelect(dato.indice);
                  }
                }}
                disabled={!dato.tieneLectura}
                aria-pressed={dato.indice === indiceSeleccionado}
                aria-label={
                  dato.tieneLectura
                    ? `Seleccionar lectura ${dato.etiqueta}: ${dato.minimo} a ${dato.maximo} ppm`
                    : `Sin lectura en ${dato.etiqueta}`
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.ejeXTitulo}>
        {periodoSeleccionado === PERIODOS_PROMEDIO.ANIO ? "Meses" : "Días"}
      </div>

      <label className={styles.filtroInferior}>
        <select
          value={valorFiltroSelect}
          onChange={(event) => {
            const opcionSeleccionada = opcionesNormalizadas.find(
              (opcion) => opcion.valorSelect === event.target.value
            );

            if (opcionSeleccionada) {
              onFiltroChange(opcionSeleccionada.valorOriginal);
            }
          }}
        >
          {opcionesNormalizadas.map((opcion) => (
            <option key={opcion.clave} value={opcion.valorSelect}>
              {opcion.etiqueta}
            </option>
          ))}
        </select>
      </label>
    </article>
  );
}

export default GraficaPromedioFrecuencia;
