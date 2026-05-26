import React, { useEffect, useMemo, useState } from "react";
import styles from "./Oxigenacion.module.css";
import * as OxTxt from "./providersOxigenacion.js";
import {
  histogramaOxigenacion,
} from "./dataOxigenacion.js";
import { IDS_METRICAS } from "../config/metricas.config";
import { obtenerUltimaLecturaMetrica } from "../services/resumenMetricasInicio";
import { obtenerClaveDiaLocal } from "../utils/fechasMetricas";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Boton from "../components/Botones/Boton";
import { InpSelect, InpTexto } from "../components/inputs";
import icoAlegre from "./icoAlegre.svg?raw";
import icoFeliz from "./icoFeliz.svg?raw";
import icoNeutral from "./icoNeutral.svg?raw";
import icoTriste from "./icoTriste.svg?raw";
import icoDeprimido from "./icoDeprimido.svg?raw";
import icoMas from './icoAnadir.svg'
import icoOxi from './icoOxigeno.svg'

const iconosSentir = {
  excelente: icoAlegre,
  bien: icoFeliz,
  neutral: icoNeutral,
  mal: icoTriste,
  muyMal: icoDeprimido,
};

const coloresSentir = {
  excelente: "#42B95B",
  bien: "#FFD93D",
  neutral: "#B5B7BF",
  mal: "#F5A623",
  muyMal: "#E25353",
};

const CLAVE_STORAGE_OXIGENACION_DIA = "oxigenacion_registros_dia_v1";

// Valida que la lectura pertenezca a oxigenacion y no a la semilla anterior de maqueta.
const esRegistroRealOxigenacion = (registro) =>
  !String(registro?.id ?? "").startsWith("spo2-inicial-") &&
  Number.isFinite(Number(registro?.valor)) &&
  Boolean(registro?.fechaHoraISO);

// Lee registros guardados de oxigenacion del dia actual sin romper la pantalla si el storage falla.
const leerRegistrosOxigenacionGuardados = () => {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_STORAGE_OXIGENACION_DIA);
    const estadoGuardado = textoGuardado ? JSON.parse(textoGuardado) : null;
    const registrosGuardados = Array.isArray(estadoGuardado?.registrosDelDia)
      ? estadoGuardado.registrosDelDia
      : [];
    const diaActual = obtenerClaveDiaLocal();

    return registrosGuardados
      .filter(
        (registro) =>
          esRegistroRealOxigenacion(registro) &&
          obtenerClaveDiaLocal(registro.fechaHoraISO) === diaActual,
      )
      .map((registro) => ({
        ...registro,
        valor: Number(registro.valor),
      }));
  } catch {
    return [];
  }
};

const formatearFechaHora = (fecha) => {
  const fechaTxt = fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const horaTxt = fecha.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${fechaTxt.replace(".", "")} ${horaTxt}`;
};

const formatearHoraCorta = (fecha) =>
  fecha.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const formatearFechaTarjeta = (fecha) =>
  fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const obtenerEstadoOxigenacion = (valor) => {
  if (valor >= 94) return { etiqueta: "Normal", color: "#3FAD58" };
  if (valor >= 90) return { etiqueta: "Vigilar", color: "#F8A737" };
  if (valor >= 87) return { etiqueta: "Bajo", color: "#FF6A39" };
  return { etiqueta: "Crítico", color: "#FF1F3D" };
};

const obtenerColorAlertaOxigenacion = (valor) => (valor >= 92 ? "verde" : "rojo");

const construirRegistroOxigenacion = ({
  valor,
  contexto,
  sentir,
  fechaHoraISO,
}) => ({
  id: `spo2-${Date.now()}`,
  valor,
  contexto,
  sentir,
  fechaHoraISO,
});

const construirRegistrosIniciales = () => {
  return leerRegistrosOxigenacionGuardados();
};

const construirPuntosDiarios = (registros) =>
  [...registros]
    .filter(
      (registro) =>
        esRegistroRealOxigenacion(registro) &&
        obtenerClaveDiaLocal(registro.fechaHoraISO) === obtenerClaveDiaLocal(),
    )
    .sort((a, b) => new Date(a.fechaHoraISO) - new Date(b.fechaHoraISO))
    .map((registro) => {
      const fecha = new Date(registro.fechaHoraISO);
      const horaDecimal =
        fecha.getHours() + fecha.getMinutes() / 60 + fecha.getSeconds() / 3600;
      return {
        hora: String(fecha.getHours()).padStart(2, "0"),
        horaDecimal,
        horaTooltip: formatearHoraCorta(fecha),
        valor: Number(registro.valor),
        fechaHoraISO: registro.fechaHoraISO,
      };
    });

// Consulta la ultima frecuencia cardiaca conocida para compartirla con la tarjeta de oxigenacion.
const obtenerUltimaFrecuenciaCardiaca = () =>
  obtenerUltimaLecturaMetrica(IDS_METRICAS.FRECUENCIA_CARDIACA);

const LIMITE_MIN_PROMEDIO = 88;
const LIMITE_MAX_PROMEDIO = 100;
const LIMITE_MIN_DIARIO_OXIGENACION = 86;
const LIMITE_MAX_DIARIO_OXIGENACION = 100;
const ABREVIATURAS_MESES_OXIGENACION = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];
const NOMBRES_MESES_OXIGENACION = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const ABREVIATURAS_DIAS_OXIGENACION = ["L", "M", "M", "J", "V", "S", "D"];
const PERIODOS_PROMEDIO_OXIGENACION = {
  SEMANA: "semana",
  MES: "mes",
  ANIO: "anio",
};
const PERIODOS_PROMEDIO_UI_OXIGENACION = [
  { valor: PERIODOS_PROMEDIO_OXIGENACION.SEMANA, etiqueta: "Semana" },
  { valor: PERIODOS_PROMEDIO_OXIGENACION.MES, etiqueta: "Mes" },
  { valor: PERIODOS_PROMEDIO_OXIGENACION.ANIO, etiqueta: "Año" },
];
const ANCHO_BASE_PROMEDIO_OXIGENACION = 1000;
const ALTO_BASE_PROMEDIO_OXIGENACION = 180;
const ALTO_CARRIL_X_PROMEDIO_OXIGENACION = 78;

// Redondea hacia abajo para que el eje Y abra espacio cuando hay lecturas bajas.
const redondearAbajoPorPaso = (valor, paso) =>
  Math.floor(valor / paso) * paso;

// Construye una escala legible para SpO2 sin comprimir valores fuera del rango normal.
const construirEscalaDiariaOxigenacion = (puntos) => {
  const valores = puntos
    .map((punto) => Number(punto.valor))
    .filter((valor) => Number.isFinite(valor));
  const valorMinimo = valores.length
    ? Math.min(...valores, LIMITE_MIN_DIARIO_OXIGENACION)
    : LIMITE_MIN_DIARIO_OXIGENACION;
  const minimo = Math.max(0, redondearAbajoPorPaso(valorMinimo, 5));
  const paso = LIMITE_MAX_DIARIO_OXIGENACION - minimo > 20 ? 5 : 2;
  const ticks = [];

  for (
    let tick = minimo;
    tick <= LIMITE_MAX_DIARIO_OXIGENACION;
    tick += paso
  ) {
    ticks.push(tick);
  }

  if (!ticks.includes(LIMITE_MAX_DIARIO_OXIGENACION)) {
    ticks.push(LIMITE_MAX_DIARIO_OXIGENACION);
  }

  return {
    dominio: [minimo, LIMITE_MAX_DIARIO_OXIGENACION],
    ticks,
  };
};

// Obtiene el lunes de la semana para armar filtros consistentes.
const obtenerInicioSemanaOxigenacion = (fechaEntrada) => {
  const fecha = new Date(fechaEntrada);
  const dia = fecha.getDay();
  const desfase = dia === 0 ? -6 : 1 - dia;
  fecha.setHours(0, 0, 0, 0);
  fecha.setDate(fecha.getDate() + desfase);

  return fecha;
};

// Obtiene el domingo de la semana para mostrar el rango del selector.
const obtenerFinSemanaOxigenacion = (inicioSemana) => {
  const finSemana = new Date(inicioSemana);
  finSemana.setDate(finSemana.getDate() + 6);
  finSemana.setHours(23, 59, 59, 999);

  return finSemana;
};

// Formatea dia y mes corto para las opciones del filtro inferior.
const formatearDiaMesOxigenacion = (fecha) => {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = ABREVIATURAS_MESES_OXIGENACION[fecha.getMonth()];

  return `${dia}, ${mes}`;
};

// Agrupa lecturas por dia y conserva minimo/maximo para la grafica de promedio.
const construirMapaRangosOxigenacion = (registros) => {
  const mapa = new Map();

  registros.filter(esRegistroRealOxigenacion).forEach((registro) => {
    const claveDia = obtenerClaveDiaLocal(registro.fechaHoraISO);
    const valor = Number(registro.valor);
    const existente = mapa.get(claveDia);

    if (!existente) {
      mapa.set(claveDia, { valorMin: valor, valorMax: valor });
      return;
    }

    existente.valorMin = Math.min(existente.valorMin, valor);
    existente.valorMax = Math.max(existente.valorMax, valor);
  });

  return mapa;
};

// Crea filtros por semana, mes y anio desde las lecturas disponibles.
const construirOpcionesFiltroPromedioOxigenacion = (registros) => {
  const mapaSemanas = new Map();
  const mapaMeses = new Map();
  const mapaAnios = new Map();
  const registrosValidos = registros.filter(esRegistroRealOxigenacion);
  const fechaActual = new Date();

  registrosValidos.forEach((registro) => {
    const fecha = new Date(registro.fechaHoraISO);
    const inicioSemana = obtenerInicioSemanaOxigenacion(fecha);
    const finSemana = obtenerFinSemanaOxigenacion(inicioSemana);
    const valorSemana = obtenerClaveDiaLocal(inicioSemana);
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth();
    const valorMes = `${anio}-${String(mes + 1).padStart(2, "0")}`;

    if (!mapaSemanas.has(valorSemana)) {
      mapaSemanas.set(valorSemana, {
        value: valorSemana,
        label: `Lun ${formatearDiaMesOxigenacion(inicioSemana)} - Dom ${formatearDiaMesOxigenacion(finSemana)}`,
      });
    }

    if (!mapaMeses.has(valorMes)) {
      mapaMeses.set(valorMes, {
        value: valorMes,
        label: `${NOMBRES_MESES_OXIGENACION[mes]} - ${anio}`,
      });
    }

    if (!mapaAnios.has(String(anio))) {
      mapaAnios.set(String(anio), { value: String(anio), label: String(anio) });
    }
  });

  if (!registrosValidos.length) {
    const inicioSemana = obtenerInicioSemanaOxigenacion(fechaActual);
    const finSemana = obtenerFinSemanaOxigenacion(inicioSemana);
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();

    mapaSemanas.set(obtenerClaveDiaLocal(inicioSemana), {
      value: obtenerClaveDiaLocal(inicioSemana),
      label: `Lun ${formatearDiaMesOxigenacion(inicioSemana)} - Dom ${formatearDiaMesOxigenacion(finSemana)}`,
    });
    mapaMeses.set(`${anio}-${String(mes + 1).padStart(2, "0")}`, {
      value: `${anio}-${String(mes + 1).padStart(2, "0")}`,
      label: `${NOMBRES_MESES_OXIGENACION[mes]} - ${anio}`,
    });
    mapaAnios.set(String(anio), { value: String(anio), label: String(anio) });
  }

  return {
    [PERIODOS_PROMEDIO_OXIGENACION.SEMANA]: [...mapaSemanas.values()].sort(
      (actual, siguiente) => (actual.value < siguiente.value ? 1 : -1),
    ),
    [PERIODOS_PROMEDIO_OXIGENACION.MES]: [...mapaMeses.values()].sort(
      (actual, siguiente) => (actual.value < siguiente.value ? 1 : -1),
    ),
    [PERIODOS_PROMEDIO_OXIGENACION.ANIO]: [...mapaAnios.values()].sort(
      (actual, siguiente) => Number(siguiente.value) - Number(actual.value),
    ),
  };
};

// Construye la serie visible para el periodo seleccionado en promedio.
const construirSeriePromedioOxigenacion = ({ registros, periodo, valorFiltro }) => {
  if (!valorFiltro) return [];

  const mapaRangos = construirMapaRangosOxigenacion(registros);

  if (periodo === PERIODOS_PROMEDIO_OXIGENACION.SEMANA) {
    const inicio = new Date(`${valorFiltro}T00:00:00`);

    return ABREVIATURAS_DIAS_OXIGENACION.map((etiqueta, indice) => {
      const fecha = new Date(inicio);
      fecha.setDate(inicio.getDate() + indice);
      const rango = mapaRangos.get(obtenerClaveDiaLocal(fecha));

      return {
        etiqueta,
        valorMin: rango?.valorMin ?? null,
        valorMax: rango?.valorMax ?? null,
      };
    });
  }

  if (periodo === PERIODOS_PROMEDIO_OXIGENACION.MES) {
    const [anioTxt, mesTxt] = valorFiltro.split("-");
    const anio = Number(anioTxt);
    const mesIndice = Number(mesTxt) - 1;
    const diasMes = new Date(anio, mesIndice + 1, 0).getDate();

    return Array.from({ length: diasMes }, (_, indice) => {
      const dia = indice + 1;
      const fecha = new Date(anio, mesIndice, dia);
      const rango = mapaRangos.get(obtenerClaveDiaLocal(fecha));

      return {
        etiqueta: String(dia),
        valorMin: rango?.valorMin ?? null,
        valorMax: rango?.valorMax ?? null,
      };
    });
  }

  const anio = Number(valorFiltro);

  return ABREVIATURAS_MESES_OXIGENACION.map((etiqueta, mesIndice) => {
    const diasMes = new Date(anio, mesIndice + 1, 0).getDate();
    const minimos = [];
    const maximos = [];

    for (let dia = 1; dia <= diasMes; dia += 1) {
      const fecha = new Date(anio, mesIndice, dia);
      const rango = mapaRangos.get(obtenerClaveDiaLocal(fecha));
      if (!rango) continue;
      minimos.push(rango.valorMin);
      maximos.push(rango.valorMax);
    }

    if (!minimos.length || !maximos.length) {
      return { etiqueta, valorMin: null, valorMax: null };
    }

    return {
      etiqueta,
      valorMin: Math.round(
        minimos.reduce((suma, valor) => suma + valor, 0) / minimos.length,
      ),
      valorMax: Math.round(
        maximos.reduce((suma, valor) => suma + valor, 0) / maximos.length,
      ),
    };
  });
};

// Calcula una escala Y dinamica para promedio sin ocultar lecturas bajas.
const construirEscalaPromedioOxigenacion = (puntos) => {
  const valores = puntos.flatMap((punto) =>
    Number.isFinite(Number(punto.valorMin)) &&
    Number.isFinite(Number(punto.valorMax))
      ? [Number(punto.valorMin), Number(punto.valorMax)]
      : [],
  );
  const valorMinimo = valores.length
    ? Math.min(...valores, LIMITE_MIN_PROMEDIO)
    : LIMITE_MIN_PROMEDIO;
  const margenInferior = valores.length ? 4 : 0;
  const minimoTentativo = Math.max(0, valorMinimo - margenInferior);
  const rangoTentativo = LIMITE_MAX_PROMEDIO - minimoTentativo;
  const paso =
    rangoTentativo > 60
      ? 20
      : rangoTentativo > 30
        ? 10
        : rangoTentativo > 16
          ? 5
          : 2;
  const minimo = Math.max(0, redondearAbajoPorPaso(minimoTentativo, paso));
  const ticks = [];

  for (let tick = minimo; tick <= LIMITE_MAX_PROMEDIO; tick += paso) {
    ticks.push(tick);
  }

  if (!ticks.includes(LIMITE_MAX_PROMEDIO)) {
    ticks.push(LIMITE_MAX_PROMEDIO);
  }

  return {
    minimo,
    maximo: LIMITE_MAX_PROMEDIO,
    ticks,
  };
};

const construirPuntosPromedio = (puntos, escala) =>
  puntos.map((item) => {
    const valorMin = Number(item.valorMin);
    const valorMax = Number(item.valorMax);
    const tieneLectura =
      Number.isFinite(valorMin) && Number.isFinite(valorMax);

    if (!tieneLectura) {
      return {
        ...item,
        tieneLectura: false,
        base: 0,
        rango: null,
      };
    }

    return {
      ...item,
      tieneLectura: true,
      valorMin,
      valorMax,
      base: valorMin - escala.minimo,
      rango: Math.max(valorMax - valorMin, 0.35),
    };
  });

// Normaliza la serie de promedio para dibujar solo lecturas reales en SVG.
const normalizarSeriePromedioOxigenacion = (serie = []) =>
  serie.map((item, indice) => {
    const minimoOriginal = Number(item?.valorMin);
    const maximoOriginal = Number(item?.valorMax);
    const tieneLectura =
      Number.isFinite(minimoOriginal) &&
      Number.isFinite(maximoOriginal) &&
      minimoOriginal > 0 &&
      maximoOriginal > 0;

    return {
      indice,
      etiqueta: item?.etiqueta ?? String(indice + 1),
      minimo: tieneLectura ? Math.min(minimoOriginal, maximoOriginal) : null,
      maximo: tieneLectura ? Math.max(minimoOriginal, maximoOriginal) : null,
      tieneLectura,
    };
  });

// Convierte un valor SpO2 a coordenada Y dentro del SVG del promedio.
const convertirValorPromedioAY = (valor, escala) => {
  const rango = escala.maximo - escala.minimo || 1;

  return (
    ALTO_BASE_PROMEDIO_OXIGENACION -
    ((valor - escala.minimo) / rango) * ALTO_BASE_PROMEDIO_OXIGENACION
  );
};

// Construye un segmento vertical por cada periodo que si tiene registro.
const construirSegmentosPromedioOxigenacion = (datos, escala) => {
  if (!datos.length) return [];

  const anchoPaso = ANCHO_BASE_PROMEDIO_OXIGENACION / datos.length;

  return datos
    .filter((dato) => dato.tieneLectura)
    .map((dato) => ({
      indice: dato.indice,
      x: anchoPaso * dato.indice + anchoPaso / 2,
      y1: convertirValorPromedioAY(dato.maximo, escala),
      y2: convertirValorPromedioAY(dato.minimo, escala),
    }));
};

// Ajusta la densidad de etiquetas del eje X segun semana, mes o anio.
const formatearEtiquetaPromedioOxigenacion = (
  dato,
  indice,
  total,
  periodo,
) => {
  if (periodo === PERIODOS_PROMEDIO_OXIGENACION.SEMANA) return dato.etiqueta;

  if (periodo === PERIODOS_PROMEDIO_OXIGENACION.MES) {
    const numeroDia = Number(dato.etiqueta);
    const diaVisible =
      Number.isFinite(numeroDia) &&
      (numeroDia === 1 ||
        numeroDia === total ||
        numeroDia % 5 === 0 ||
        numeroDia === 15);

    return diaVisible ? String(numeroDia) : "";
  }

  if (periodo === PERIODOS_PROMEDIO_OXIGENACION.ANIO) {
    return String(dato.etiqueta).slice(0, 3);
  }

  return indice === 0 || indice === total - 1 ? dato.etiqueta : "";
};

const TooltipOxigenacionDiaria = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const punto = payload[0]?.payload;

  return (
    <div className={styles.tooltipOxigenacion}>
      <span>
        {payload[0].value}
        {OxTxt.textosGenerales.abreviatura}
      </span>
      <span>{punto?.horaTooltip ?? `${label}:00`}</span>
    </div>
  );
};

const TooltipPromedioOxigenacion = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const punto = payload[0]?.payload;

  return (
    <div className={styles.tooltipPromedioOxigenacion}>
      <div className={styles.tooltipPromedioFila}>
        <strong>{punto?.valorMax}%</strong>
        <span>{punto?.horaMax ?? "--"}</span>
      </div>
      <div className={styles.tooltipPromedioFila}>
        <strong>{punto?.valorMin}%</strong>
        <span>{punto?.horaMin ?? "--"}</span>
      </div>
    </div>
  );
};

const TooltipHistogramaOxigenacion = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const punto = payload[0]?.payload;

  return (
    <div className={styles.tooltipHistogramaOxigenacion}>
      <strong>{label}</strong>
      <span>{punto?.valor} mediciones</span>
    </div>
  );
};

const BarraRangoPromedio = ({ x, y, width, height, fill, payload }) => {
  if (!payload?.tieneLectura || !Number.isFinite(height) || height <= 0) {
    return null;
  }

  const ancho = 10;
  const altoVisual = Math.max(height, 10);
  const posicionX = x + width / 2 - ancho / 2;
  const posicionY = y - (altoVisual - height) / 2;
  const radio = Math.min(ancho / 2, altoVisual / 2, 4);

  return (
    <rect
      x={posicionX}
      y={posicionY}
      width={ancho}
      height={altoVisual}
      rx={radio}
      ry={radio}
      fill={fill}
    />
  );
};

const PasoRecomendacion = ({ paso }) => (
  <li
    className={styles.pasoRecomendacion}
    dangerouslySetInnerHTML={{ __html: paso }}
  />
);

const ModalRegistroOxigenacion = ({ onClose, onConfirm }) => {
  const fechaBase = useMemo(() => new Date(), []);
  const [oxigenacion, setOxigenacion] = useState("");
  const [contexto, setContexto] = useState("noEspecificado");
  const [sentir, setSentir] = useState("");

  const fechaHoraTexto = formatearFechaHora(fechaBase);
  const oxigenacionNormalizada = oxigenacion.trim();
  const oxigenacionNumerica = Number(oxigenacionNormalizada);
  const deshabilitado =
    !oxigenacionNormalizada ||
    Number.isNaN(oxigenacionNumerica) ||
    oxigenacionNumerica <= 0 ||
    oxigenacionNumerica > 100 ||
    !sentir;

  const manejarGuardar = () => {
    if (deshabilitado) return;

    onConfirm?.(
      construirRegistroOxigenacion({
        valor: oxigenacionNumerica,
        contexto,
        sentir,
        fechaHoraISO: fechaBase.toISOString(),
      }),
    );
  };

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div className={styles.modalRegistroOxigenacion}>
        <div className={styles.modalHeader}>
          <p>{OxTxt.modalCaptura.titulo}</p>
          <button
            className={styles.modalClose}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className={styles.modalContenido}>
          <div className={styles.filaModal}>
            <p className={styles.etiquetaModal}>{OxTxt.modalCaptura.fecha}</p>
            <p className={styles.valorFecha}>{fechaHoraTexto}</p>
          </div>

          <div className={styles.filaModal}>
            <p className={styles.etiquetaModal}>{OxTxt.modalCaptura.etiquetaSpO2}</p>
            <InpTexto
              placeholder="-- --"
              className={styles.inputOxigenacion}
              value={oxigenacion}
              inputMode="numeric"
              onChange={(event) =>
                setOxigenacion(event.target.value.replace(/[^\d]/g, ""))
              }
            />
          </div>

          <div className={styles.bloqueSelect}>
            <p className={styles.etiquetaSelect}>{OxTxt.modalCaptura.etiquetaContexto}</p>
            <InpSelect
              opciones={OxTxt.opcionesContexto}
              value={contexto}
              onChange={setContexto}
              placeholder="Contexto"
              estilos={{
                botonMain: styles.botonSelectModal,
                opcion: styles.opcionSelectModal,
              }}
            />
          </div>

          <div className={styles.bloqueSentir}>
            <p className={styles.etiquetaSentir}>{OxTxt.modalCaptura.etiquetaSentir}</p>
            <div className={styles.listaSentir}>
              {OxTxt.opcionesSentir.map((item) => {
                const activo = sentir === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    className={styles.botonSentir}
                    onClick={() => setSentir(item.value)}
                    >
                      <span
                        className={`${styles.iconoSentir} ${
                          activo ? styles.iconoSentirActivo : ""
                        }`}
                        style={{ color: activo ? coloresSentir[item.value] : "transparent" }}
                      >
                        <span
                          aria-hidden="true"
                          className={styles.imagenSentir}
                          dangerouslySetInnerHTML={{ __html: iconosSentir[item.value] }}
                        />
                      </span>
                      <span className={styles.textoSentir}>{item.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          <div className={styles.bloqueRecomendaciones}>
            <p className={styles.tituloRecomendaciones}>
              {OxTxt.modalCaptura.recomendacionesTitulo}
            </p>
            <ul className={styles.listaRecomendaciones}>
              {OxTxt.modalCaptura.recomendaciones.map((paso, index) => (
                <PasoRecomendacion key={index} paso={paso} />
              ))}
            </ul>
            <p className={styles.notaRecomendaciones}>{OxTxt.modalCaptura.nota}</p>
          </div>
        </div>

        <div className={styles.modalActions}>
          <Boton
            variant="primario"
            isLoading={false}
            disabled={deshabilitado}
            onClick={manejarGuardar}
          >
            {OxTxt.modalCaptura.boton}
          </Boton>
        </div>
      </div>
    </div>
  );
};

const ConfirmacionRegistroOxigenacion = ({ registro, onClose }) => {
  if (!registro) return null;

  const esBajo = registro.valor <= 91;
  const copia = esBajo
    ? OxTxt.confirmacionRegistro.alerta
    : OxTxt.confirmacionRegistro.exito;

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div
        className={esBajo ? styles.confirmacionAlerta : styles.confirmacionRegistro}
      >
        <div
          className={
            esBajo ? styles.contenidoConfirmacionAlerta : styles.contenidoConfirmacion
          }
        >
          <div className={esBajo ? styles.iconoAdvertencia : styles.iconoExito}>
            {esBajo ? "!" : "O2"}
          </div>
          <div className={styles.textoConfirmacion}>
            <p className={styles.mensajeConfirmacion}>{copia.mensaje}</p>
            <p className={styles.fechaConfirmacion}>
              {formatearFechaHora(new Date(registro.fechaHoraISO))}
            </p>
          </div>
        </div>

        <Boton variant="primario" isLoading={false} onClick={onClose}>
          {OxTxt.confirmacionRegistro.boton}
        </Boton>
      </div>
    </div>
  );
};

const EncabezadoOxigenacion = () => (
  <div className={styles.encabezado}>
    <h3 className={styles.tituloPrincipal}>{OxTxt.textosGenerales.encabezado}</h3>
    <button type="button" className={styles.botonRegistros}>
      Ver Registros
    </button>
  </div>
);

const GraficaDiariaOxigenacion = ({ data, resumenActual, onAgregar }) => {
  const [puntoActivo, setPuntoActivo] = useState(null);
  const escalaOxigenacion = useMemo(
    () => construirEscalaDiariaOxigenacion(data),
    [data],
  );

  return (
    <div className={styles.tarjetaAncha}>
      <div className={styles.cabeceraTarjeta}>
        <h2 className={styles.tituloTarjeta}>{OxTxt.graficaDiaria.titulo}</h2>
        <div className={styles.resumenActual}>
        <p className={styles.resumenActualValor}>
          {resumenActual.valor}
          {OxTxt.textosGenerales.abreviatura}
        </p>
        <p className={styles.resumenActualMeta}>Última actualización:</p>
        <p className={styles.resumenActualMeta}>{resumenActual.fecha}</p>
      </div>
    </div>

    <div className={styles.lienzoGrafica}>
        <span className={styles.etiquetaUnidad}>{OxTxt.textosGenerales.unidad}</span>
        <div className={styles.graficaBase}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 16, left: 0, bottom: 27 }}
              onMouseMove={(state) => {
                setPuntoActivo(state?.activePayload?.[0]?.payload ?? null);
              }}
              onMouseLeave={() => setPuntoActivo(null)}
            >
            <defs>
              <linearGradient id="rellenoOxigenacionDiaria" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0FDBFF" stopOpacity="0.95" />
                <stop offset="95%" stopColor="#0FDBFF" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#9ed8f7"
              strokeDasharray="3 3"
            />

              <XAxis
                type="number"
                dataKey="horaDecimal"
                domain={[0, 24]}
                ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]}
              axisLine={true}
              tickLine={false}
              tick={{ fill: "#33415c", fontSize: 12 }}
              tickMargin={10}
                tickFormatter={(valor) => String(valor).padStart(2, "0")}
                label={{
                  value: "(Horas)",
                  position: "insideBottom",
                  offset: -16,
                  fill: "#b1b7c1",
                }}
              />

              <YAxis
                domain={escalaOxigenacion.dominio}
                axisLine={false}
                tickLine={false}
                ticks={escalaOxigenacion.ticks}
                tickFormatter={(valor) => `${valor}%`}
                tick={{ fill: "#33415c", fontSize: 12 }}
                width={46}
              />

                {puntoActivo && (
                  <ReferenceLine
                    x={puntoActivo.horaDecimal}
                    stroke="#15c3ee"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    ifOverflow="extendDomain"
                  />
                )}

              <Tooltip
                content={<TooltipOxigenacionDiaria />}
                cursor={{stroke:"#007CBA", strokeWidth:"1px", strokeDasharray: "3 3"}}
              />

            <Area
              type="monotone"
              dataKey="valor"
              stroke="#15c3ee"
              strokeWidth={2}
              fill="url(#rellenoOxigenacionDiaria)"
              dot={{ r: 3.5, fill: "#15c3ee", stroke: "#ffffff", strokeWidth: 2 }}
              activeDot={{ r: 4, fill: "#15c3ee", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
        <div className={styles.accionesSuperior}>
          <Boton  
            variant="primario"
            forma="redondo"
            isLoading={false}
            icono={icoMas}
          onClick={onAgregar}>
            {OxTxt.graficaDiaria.boton}
          </Boton>
        </div>
      </div>
    </div>
  );
};
const TarjetaRangoOxigenacion = ({ ultimaFrecuenciaCardiaca }) => (
  <div className={styles.tarjetaRango}>
    <div className={styles.bloqueRangoTexto}>
      <p className={styles.rangoTitulo}>{OxTxt.tarjetaRango.titulo}</p>
      <p className={styles.rangoValor}>
        {ultimaFrecuenciaCardiaca ?? "--"}{" "}
        <span>{OxTxt.tarjetaRango.unidad}</span>
      </p>
    </div>
    <img src={icoOxi} className={styles.insigniaOxigeno}></img>
  </div>
);

const TarjetaValoresOxigenacion = () => (
  <div className={styles.tarjetaValores}>
    <h3 className={styles.tituloSecundario}>{OxTxt.valoresReferencia.titulo}</h3>
    <div className={styles.listaValores}>
      {OxTxt.valoresReferencia.items.map((item) => (
        <div key={`${item.nombre}-${item.rango}`} className={styles.filaValor}>
          <span
            className={styles.colorValor}
            style={{ backgroundColor: item.color }}
          />
          <span className={styles.nombreValor}>{item.nombre}</span>
          <span className={styles.rangoValorTexto}>{item.rango}</span>
        </div>
      ))}
    </div>
  </div>
);

const TarjetaUltimoValorOxigenacion = ({ ultimoRegistro, valorAnterior }) => {
  const estadoUltimo = ultimoRegistro
    ? obtenerEstadoOxigenacion(ultimoRegistro.valor)
    : null;
  const estadoAnterior = valorAnterior
    ? obtenerEstadoOxigenacion(valorAnterior.valor)
    : null;

  return (
  <div className={styles.tarjetaUltimo}>
    <h3 className={styles.tituloSecundario}>{OxTxt.ultimoValor.titulo}</h3>

    <div className={styles.ultimoGrupo}>
      <div>
        <p className={styles.ultimoEtiqueta}>{OxTxt.ultimoValor.etiquetas.ultimo}</p>
        <div className={styles.ultimoFila}>
          <span
            className={styles.ultimoBarra}
            style={{ backgroundColor: estadoUltimo?.color ?? "#3FAD58" }}
          />
          <span className={styles.ultimoEstado}>
            {estadoUltimo?.etiqueta ?? "--"}
          </span>
          <span className={styles.ultimoNumero}>
            {ultimoRegistro?.valor ?? "--"}%
          </span>
          <span className={styles.ultimoFecha}>
            {ultimoRegistro
              ? formatearFechaTarjeta(new Date(ultimoRegistro.fechaHoraISO))
              : "--"}
            <br />
            {ultimoRegistro
              ? formatearHoraCorta(new Date(ultimoRegistro.fechaHoraISO))
              : "--"}
          </span>
        </div>
      </div>

      <div>
        <p className={styles.ultimoEtiqueta}>
          {OxTxt.ultimoValor.etiquetas.anterior}
        </p>
        <div className={styles.ultimoFila}>
          <span
            className={styles.ultimoBarra}
            style={{ backgroundColor: estadoAnterior?.color ?? "#F8A737" }}
          />
          <span className={styles.ultimoEstado}>
            {estadoAnterior?.etiqueta ?? "--"}
          </span>
          <span className={styles.ultimoNumero}>
            {valorAnterior?.valor ?? "--"}%
          </span>
          <span className={styles.ultimoFecha}>
            {valorAnterior
              ? formatearFechaTarjeta(new Date(valorAnterior.fechaHoraISO))
              : "--"}
            <br />
            {valorAnterior
              ? formatearHoraCorta(new Date(valorAnterior.fechaHoraISO))
              : "--"}
          </span>
        </div>
      </div>
    </div>
  </div>
  );
};

const TarjetaPromedioOxigenacion = ({ registros }) => {
  const [periodoActivo, setPeriodoActivo] = useState(
    PERIODOS_PROMEDIO_OXIGENACION.SEMANA,
  );
  const opcionesFiltro = useMemo(
    () => construirOpcionesFiltroPromedioOxigenacion(registros),
    [registros],
  );
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState(() => ({
    [PERIODOS_PROMEDIO_OXIGENACION.SEMANA]:
      opcionesFiltro[PERIODOS_PROMEDIO_OXIGENACION.SEMANA]?.[0]?.value ?? "",
    [PERIODOS_PROMEDIO_OXIGENACION.MES]:
      opcionesFiltro[PERIODOS_PROMEDIO_OXIGENACION.MES]?.[0]?.value ?? "",
    [PERIODOS_PROMEDIO_OXIGENACION.ANIO]:
      opcionesFiltro[PERIODOS_PROMEDIO_OXIGENACION.ANIO]?.[0]?.value ?? "",
  }));
  const seriePromedio = useMemo(
    () =>
      construirSeriePromedioOxigenacion({
        registros,
        periodo: periodoActivo,
        valorFiltro: filtrosSeleccionados[periodoActivo],
      }),
    [filtrosSeleccionados, periodoActivo, registros],
  );
  const escalaPromedio = useMemo(
    () => construirEscalaPromedioOxigenacion(seriePromedio),
    [seriePromedio],
  );
  const datosGrafica = useMemo(
    () => normalizarSeriePromedioOxigenacion(seriePromedio),
    [seriePromedio],
  );
  const segmentosPromedio = useMemo(
    () => construirSegmentosPromedioOxigenacion(datosGrafica, escalaPromedio),
    [datosGrafica, escalaPromedio],
  );
  const etiquetasEjeX = useMemo(
    () =>
      datosGrafica.map((dato, indice) =>
        formatearEtiquetaPromedioOxigenacion(
          dato,
          indice,
          datosGrafica.length,
          periodoActivo,
        ),
      ),
    [datosGrafica, periodoActivo],
  );

  const etiquetaEjeX =
    periodoActivo === PERIODOS_PROMEDIO_OXIGENACION.ANIO ? "Meses" : "Días";
  const variablesGrafica = {
    "--alto-svg-promedio": `${ALTO_BASE_PROMEDIO_OXIGENACION + ALTO_CARRIL_X_PROMEDIO_OXIGENACION}px`,
    "--alto-trama-promedio": `${ALTO_BASE_PROMEDIO_OXIGENACION}px`,
    "--columnas-eje-x-promedio": String(Math.max(datosGrafica.length, 1)),
  };

  useEffect(() => {
    // Mantiene el filtro actual dentro de las opciones disponibles del periodo.
    const opcionesPeriodo = opcionesFiltro[periodoActivo] ?? [];
    const valorActual = filtrosSeleccionados[periodoActivo];
    const existeValorActual = opcionesPeriodo.some(
      (opcion) => opcion.value === valorActual,
    );

    if (!existeValorActual) {
      setFiltrosSeleccionados((prev) => ({
        ...prev,
        [periodoActivo]: opcionesPeriodo[0]?.value ?? "",
      }));
    }
  }, [filtrosSeleccionados, opcionesFiltro, periodoActivo]);

  return (
    <div className={styles.tarjetaPromedio}>
      <h3 className={styles.tituloSecundario}>{OxTxt.graficaPromedio.titulo}</h3>

      <div className={styles.navegacionPromedio}>
        {PERIODOS_PROMEDIO_UI_OXIGENACION.map((periodo) => {
          const activo = periodoActivo === periodo.valor;
          return (
            <button
              key={periodo.valor}
              type="button"
              className={activo ? styles.chipPeriodoActivo : styles.chipPeriodo}
              onClick={() => setPeriodoActivo(periodo.valor)}
            >
              {periodo.etiqueta}
            </button>
          );
        })}
      </div>

      <span className={styles.etiquetaUnidadPromedio}>{OxTxt.textosGenerales.unidad}</span>

      <div className={styles.graficaPromedioManual} style={variablesGrafica}>
        <div className={styles.ejeYPromedio}>
          {escalaPromedio.ticks
            .slice()
            .reverse()
            .map((tick) => (
              <span key={tick} className={styles.tickEjeYPromedio}>
                {tick}%
              </span>
            ))}
        </div>

        <div className={styles.zonaPromedio}>
          <svg
            className={styles.svgPromedio}
            viewBox={`0 0 ${ANCHO_BASE_PROMEDIO_OXIGENACION} ${
              ALTO_BASE_PROMEDIO_OXIGENACION + ALTO_CARRIL_X_PROMEDIO_OXIGENACION
            }`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {escalaPromedio.ticks.map((tick) => {
              const y = convertirValorPromedioAY(tick, escalaPromedio);
              return (
                <line
                  key={`promedio-guia-${tick}`}
                  className={styles.guiaPromedio}
                  x1="0"
                  y1={y}
                  x2={ANCHO_BASE_PROMEDIO_OXIGENACION}
                  y2={y}
                />
              );
            })}

            <line
              className={styles.lineaBasePromedio}
              x1="0"
              y1={ALTO_BASE_PROMEDIO_OXIGENACION}
              x2={ANCHO_BASE_PROMEDIO_OXIGENACION}
              y2={ALTO_BASE_PROMEDIO_OXIGENACION}
            />

            {segmentosPromedio.map((segmento) => (
              <line
                key={`promedio-segmento-${segmento.indice}`}
                className={styles.segmentoPromedio}
                x1={segmento.x}
                y1={segmento.y1}
                x2={segmento.x}
                y2={segmento.y2}
              />
            ))}
          </svg>

          <div className={styles.ejeXPromedio}>
            {etiquetasEjeX.map((etiqueta, indice) => (
              <span key={`promedio-eje-x-${indice}`} className={styles.tickEjeXPromedio}>
                {etiqueta}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.tituloEjeXPromedio}>{etiquetaEjeX}</div>

      <div className={styles.selectorPeriodoWrap}>
        <select
          className={styles.selectorPeriodo}
          value={filtrosSeleccionados[periodoActivo]}
          onChange={(event) =>
            setFiltrosSeleccionados((prev) => ({
              ...prev,
              [periodoActivo]: event.target.value,
            }))
          }
        >
          {(opcionesFiltro[periodoActivo] ?? []).map((filtro) => (
            <option key={filtro.value} value={filtro.value}>
              {filtro.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const TarjetaHistogramaOxigenacion = () => {
  const maximoValor = Math.max(...histogramaOxigenacion.map((item) => item.valor), 0);
  const tickSuperior = Math.ceil(maximoValor / 20) * 20;
  const ticks = Array.from({ length: Math.max(tickSuperior / 20, 1) + 1 }, (_, index) => index * 20);

  return (
    <section className={styles.tarjetaHistograma}>
      <div className={styles.chartWrapHistograma}>
        <h3 className={styles.tituloHistograma}>{OxTxt.histograma.titulo}</h3>

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={histogramaOxigenacion}
            margin={{ top: 10, right: 18, left: -8, bottom: 42 }}
          >
            <defs>
              <linearGradient id="rellenoHistogramaOxigenacion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f2d86d" stopOpacity={0.58} />
                <stop offset="100%" stopColor="#f2d86d" stopOpacity={0.06} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#c2c8d1"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="etiqueta"
              tick={{ fill: "#364152", fontSize: 10 }}
              axisLine={{ stroke: "#a6a8ac" }}
              tickLine={false}
              interval={0}
            />

            <YAxis
              domain={[0, tickSuperior]}
              ticks={ticks}
              tick={{ fill: "#364152", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip cursor={false} content={<TooltipHistogramaOxigenacion />} />

            <Area
              type="monotone"
              dataKey="valor"
              stroke="transparent"
              fill="url(#rellenoHistogramaOxigenacion)"
              fillOpacity={1}
              isAnimationActive={false}
            />

            <Bar
              dataKey="valor"
              radius={[999, 999, 0, 0]}
              barSize={18}
              isAnimationActive={false}
            >
              {histogramaOxigenacion.map((item) => (
                <Cell key={`${item.etiqueta}-${item.valor}`} fill={item.color ?? "#52b85d"} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className={styles.etiquetaEjeYHistograma}>Número de mediciones</p>
      <p className={styles.etiquetaEjeXHistograma}>Rango de Oxigenación SpO2</p>
      <p className={styles.descripcionHistograma}>{OxTxt.histograma.descripcion}</p>
    </section>
  );
};

const TarjetaAlertaOxigenacion = ({ color = "verde" }) => {
  const alertaActual = OxTxt.alerta[color] ?? OxTxt.alerta.verde;

  return (
    <div className={styles.tarjetaAlerta}>
      <img
        src={alertaActual.icono}
        alt={alertaActual.alt}
        className={styles.iconoAlertaImagen}
      />
      <div className={styles.mensajeAlerta}>
        {alertaActual.mensaje.map((linea, index) => (
          <p key={`${color}-${index}`}>{linea}</p>
        ))}
      </div>
    </div>
  );
};

const TarjetaContextoOxigenacion = () => {
  const { r1, r2, r3 } = OxTxt.textosGenerales.mensaje;

  return (
    <div className={styles.tarjetaContexto}>
      <img src={OxTxt.contexto.icono}></img>
      <div className={styles.contenidoContexto}>
        <h3>{OxTxt.contexto.titulo}</h3>
        <p>{r1}</p>
        <p>{r2}</p>
        <p>{r3}</p>
      </div>
    </div>
  );
};

const Oxigenacion = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [registroConfirmado, setRegistroConfirmado] = useState(null);
  const [registrosOxigenacion, setRegistrosOxigenacion] = useState(
    construirRegistrosIniciales,
  );
  const [ultimaFrecuenciaCardiaca, setUltimaFrecuenciaCardiaca] = useState(
    obtenerUltimaFrecuenciaCardiaca,
  );

  const puntosDiarios = useMemo(
    () => construirPuntosDiarios(registrosOxigenacion),
    [registrosOxigenacion],
  );

  const registrosOrdenados = useMemo(
    () =>
      [...registrosOxigenacion].sort(
        (a, b) => new Date(a.fechaHoraISO) - new Date(b.fechaHoraISO),
      ),
    [registrosOxigenacion],
  );

  const ultimoRegistro = registrosOrdenados.at(-1) ?? null;
  const valorAnterior = registrosOrdenados.at(-2) ?? null;
  const resumenActual = useMemo(
    () => ({
      valor: ultimoRegistro?.valor ?? "--",
      fecha: ultimoRegistro
        ? formatearFechaHora(new Date(ultimoRegistro.fechaHoraISO))
        : "Sin registros de hoy",
    }),
    [ultimoRegistro],
  );
  const colorAlertaActual = useMemo(
    () =>
      ultimoRegistro
        ? obtenerColorAlertaOxigenacion(ultimoRegistro.valor)
        : "verde",
    [ultimoRegistro],
  );

  const abrirModalCaptura = () => {
    setRegistroConfirmado(null);
    setModalAbierto(true);
  };

  const cerrarModalCaptura = () => {
    setModalAbierto(false);
  };

  const confirmarCaptura = (registro) => {
    setRegistrosOxigenacion((actuales) => [...actuales, registro]);
    setRegistroConfirmado(registro);
    setModalAbierto(false);
  };

  useEffect(() => {
    try {
      localStorage.setItem(
        CLAVE_STORAGE_OXIGENACION_DIA,
        JSON.stringify({ registrosDelDia: registrosOxigenacion })
      );
      window.dispatchEvent(new CustomEvent("metricas_resumen_actualizado"));
    } catch {
      // Si localStorage no esta disponible, mantenemos la lectura solo en memoria.
    }
  }, [registrosOxigenacion]);

  useEffect(() => {
    // Sincroniza la tarjeta cuando frecuencia cardiaca cambia en otra metrica.
    const actualizarUltimaFrecuenciaCardiaca = () => {
      setUltimaFrecuenciaCardiaca(obtenerUltimaFrecuenciaCardiaca());
    };

    window.addEventListener(
      "metricas_resumen_actualizado",
      actualizarUltimaFrecuenciaCardiaca,
    );
    window.addEventListener("storage", actualizarUltimaFrecuenciaCardiaca);
    window.addEventListener("focus", actualizarUltimaFrecuenciaCardiaca);

    return () => {
      window.removeEventListener(
        "metricas_resumen_actualizado",
        actualizarUltimaFrecuenciaCardiaca,
      );
      window.removeEventListener("storage", actualizarUltimaFrecuenciaCardiaca);
      window.removeEventListener("focus", actualizarUltimaFrecuenciaCardiaca);
    };
  }, []);

  return (
    <div className={styles.Oxigenacion}>
      {/* <EncabezadoOxigenacion /> */}

      <div className={styles.panel}>
        <div className={styles.superior}>
          <GraficaDiariaOxigenacion
            data={puntosDiarios}
            resumenActual={resumenActual}
            onAgregar={abrirModalCaptura}
          />
        </div>

        <div className={styles.centro}>
          <TarjetaRangoOxigenacion
            ultimaFrecuenciaCardiaca={ultimaFrecuenciaCardiaca}
          />
          <TarjetaValoresOxigenacion />
          <TarjetaUltimoValorOxigenacion
            ultimoRegistro={ultimoRegistro}
            valorAnterior={valorAnterior}
          />
        </div>

        <div className={styles.abajo}>
          <TarjetaPromedioOxigenacion registros={registrosOxigenacion} />
          <TarjetaHistogramaOxigenacion />
        </div>

        <div className={styles.masAbajo}>
          <TarjetaAlertaOxigenacion color={colorAlertaActual} />
          <TarjetaContextoOxigenacion />
        </div>
      </div>

      {modalAbierto && (
        <ModalRegistroOxigenacion
          onClose={cerrarModalCaptura}
          onConfirm={confirmarCaptura}
        />
      )}
      {registroConfirmado && (
        <ConfirmacionRegistroOxigenacion
          registro={registroConfirmado}
          onClose={() => setRegistroConfirmado(null)}
        />
      )}
    </div>
  );
};

export default Oxigenacion;
