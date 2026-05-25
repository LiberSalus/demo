import { useMemo } from "react";
import styles from "./GraficaPromediosPresion.module.css";
import { PERIODOS_PROMEDIO } from "../frecuencia-cardiaca/utils/promedioFrecuencias.utils";

const PERIODOS_UI = [
  { valor: PERIODOS_PROMEDIO.SEMANA, etiqueta: "Semana" },
  { valor: PERIODOS_PROMEDIO.MES, etiqueta: "Mes" },
  { valor: PERIODOS_PROMEDIO.ANIO, etiqueta: "Año" },
];

const DOMINIO_FALLBACK = [30, 150];
const TICKS_FALLBACK = [30, 60, 90, 120, 150];
const ANCHO_BASE = 1000;
const ALTO_BASE = 180;
const ALTO_CARRIL_X = 78;

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

  return etiqueta ? etiqueta.trim() : String(indice + 1);
};

const normalizarSerie = (serie = []) =>
  serie.map((item, indice) => {
    const diastolicaOriginal = obtenerNumeroValido(
      item?.diastolica,
      item?.promedioDiastolica,
      item?.presionDiastolica,
      item?.minimo,
      item?.min
    );

    const sistolicaOriginal = obtenerNumeroValido(
      item?.sistolica,
      item?.promedioSistolica,
      item?.presionSistolica,
      item?.maximo,
      item?.max
    );

    const tieneLecturaValida =
      Number.isFinite(diastolicaOriginal) &&
      Number.isFinite(sistolicaOriginal) &&
      diastolicaOriginal > 0 &&
      sistolicaOriginal > 0;

    const diastolica = tieneLecturaValida
      ? Math.min(diastolicaOriginal, sistolicaOriginal)
      : null;

    const sistolica = tieneLecturaValida
      ? Math.max(diastolicaOriginal, sistolicaOriginal)
      : null;

    return {
      indice,
      etiqueta: obtenerTextoEtiqueta(item, indice),
      diastolica,
      sistolica,
      tieneLectura: Number.isFinite(diastolica) && Number.isFinite(sistolica),
    };
  });

const construirEscalaEjeY = (datos) => {
  const valores = datos.flatMap((dato) =>
    dato.tieneLectura ? [dato.diastolica, dato.sistolica] : []
  );

  return {
    minimo: DOMINIO_FALLBACK[0],
    maximo: DOMINIO_FALLBACK[1],
    ticks: TICKS_FALLBACK.filter((tick) => {
      if (!valores.length) return true;
      return tick >= DOMINIO_FALLBACK[0] && tick <= DOMINIO_FALLBACK[1];
    }),
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

const construirLineasReferencia = (datos, escala) => {
  const lecturasValidas = datos.filter((dato) => dato.tieneLectura);

  if (!lecturasValidas.length) return [];

  const promedioSistolica = Math.round(
    lecturasValidas.reduce((suma, dato) => suma + dato.sistolica, 0) /
      lecturasValidas.length
  );
  const promedioDiastolica = Math.round(
    lecturasValidas.reduce((suma, dato) => suma + dato.diastolica, 0) /
      lecturasValidas.length
  );

  return [
    { valor: promedioSistolica, clase: styles.guiaRoja },
    { valor: promedioDiastolica, clase: styles.guiaRoja },
  ].filter(
    (linea) => linea.valor >= escala.minimo && linea.valor <= escala.maximo
  );
};

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
  if (!datos.length) return [];

  const anchoPaso = ANCHO_BASE / datos.length;

  return datos
    .filter((dato) => dato.tieneLectura)
    .map((dato) => ({
      indice: dato.indice,
      anchoPaso,
      x: anchoPaso * dato.indice + anchoPaso / 2,
      ySistolica: convertirValorAY(dato.sistolica, escala),
      yDiastolica: convertirValorAY(dato.diastolica, escala),
    }));
};

function GraficaPromediosPresion({
  titulo = "Promedio presión arterial",
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
    () => construirLineasReferencia(datosGrafica, escalaEjeY),
    [datosGrafica, escalaEjeY]
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
      <h3 className={styles.titulo}>{titulo}</h3>

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

      <div className={styles.unidad}>mmHg</div>

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

            {segmentos
              .filter((segmento) => segmento.indice === indiceSeleccionado)
              .map((segmento) => (
                <rect
                  key={`seleccion-${segmento.indice}`}
                  className={styles.columnaSeleccionada}
                  x={segmento.x - segmento.anchoPaso / 2 + 6}
                  y="0"
                  width={Math.max(segmento.anchoPaso - 12, 22)}
                  height={ALTO_BASE + ALTO_CARRIL_X - 8}
                  rx="14"
                  ry="14"
                />
              ))}

            {segmentos.map((segmento) => (
              <g key={`segmento-${segmento.indice}`}>
                <line
                  className={styles.segmentoLectura}
                  x1={segmento.x}
                  y1={segmento.ySistolica}
                  x2={segmento.x}
                  y2={segmento.yDiastolica}
                />
              </g>
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
                    ? `Seleccionar lectura ${dato.etiqueta}: ${dato.sistolica} sobre ${dato.diastolica} mmHg`
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

export default GraficaPromediosPresion;
