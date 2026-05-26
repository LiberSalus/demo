import React, { useEffect, useMemo, useState } from "react";
import styles from "./Glucosa.module.css";
import ControlRadio from "../components/Controles/ControlRadio";
import * as GlTxt from "./providersGlucosa.js";
import Boton from "../components/Botones/Boton";
import { InpSelect, InpTexto } from "../components/inputs";
import MedidorGlucosa from "./MedidorGlucosa";
import TarjetaAlertasPresion from "../presion-arterial/TarjetaAlertasPresion";
import GraficaDistribucionGlucosa from "./GraficaDistribucionGlucosa";
import ModalRecordatoriosPresion from "../presion-arterial/ModalRecordatoriosPresion.jsx";

import {
  formatearCuentaRegresivaRecordatorioGlucosa,
  formatearDiasRecordatorioGlucosa,
  formatearHoraRecordatorioGlucosa,
  guardarRecordatoriosGlucosa,
  leerRecordatoriosGlucosa,
  normalizarRecordatorioGlucosa,
  obtenerProximoRecordatorioGlucosa,
} from "./glucosaRecordatorios.utils.js";

import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
  ComposedChart,
  ScatterChart,
  Scatter,
} from "recharts";

const TIPOS_POSTPRANDIAL = [
  "postprandial",
  "preprandial",
  "antesDormir",
  "sintomas",
  "noEspecificado",
];

const CLAVE_STORAGE_GLUCOSA_DIA = "glucosa_registros_dia_v1";
const ABREVIATURAS_DIAS_GLUCOSA = ["L", "M", "M", "J", "V", "S", "D"];
const ABREVIATURAS_MESES_GLUCOSA = [
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
const NOMBRES_MESES_GLUCOSA = [
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
const PERIODOS_PROMEDIO_GLUCOSA = {
  SEMANA: "semana",
  MES: "mes",
  ANIO: "ano",
};
const PERIODOS_PROMEDIO_UI_GLUCOSA = [
  { valor: PERIODOS_PROMEDIO_GLUCOSA.SEMANA, etiqueta: "Semana" },
  { valor: PERIODOS_PROMEDIO_GLUCOSA.MES, etiqueta: "Mes" },
  { valor: PERIODOS_PROMEDIO_GLUCOSA.ANIO, etiqueta: "Año" },
];
const ANCHO_BASE_PROMEDIO_GLUCOSA = 1000;
const ALTO_BASE_PROMEDIO_GLUCOSA = 180;
const ALTO_CARRIL_X_PROMEDIO_GLUCOSA = 78;
const DOMINIO_FALLBACK_PROMEDIO_GLUCOSA = [60, 140];
const TICKS_FALLBACK_PROMEDIO_GLUCOSA = [60, 80, 100, 120, 140];

const crearClaveFecha = (fecha) => {
  const year = fecha.getFullYear();
  const month = `${fecha.getMonth() + 1}`.padStart(2, "0");
  const day = `${fecha.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const crearEtiquetaFiltroGlucosa = (fecha) =>
  fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// Valida lecturas reales y descarta la semilla anterior de maqueta.
const esMedicionRealGlucosa = (medicion) =>
  !["glu-1", "glu-2", "glu-3"].includes(String(medicion?.id ?? "")) &&
  Boolean(medicion?.fechaHoraISO) &&
  Number.isFinite(Number(medicion?.toma)) &&
  Number(medicion?.toma) > 0;

// Crea el contrato diario base sin lecturas simuladas.
const crearContratoGlucosaVacio = (fechaBase = new Date()) => {
  const claveFecha = crearClaveFecha(fechaBase);
  const etiquetaFiltro = crearEtiquetaFiltroGlucosa(fechaBase);

  return {
    metadatos: {
      unidad: "mg/dL",
      resolucion: "hora",
      periodo: "dia",
    },
    filtros: [{ value: claveFecha, label: etiquetaFiltro }],
    seleccionActual: claveFecha,
    medicionesPorFiltro: {
      [claveFecha]: {
        etiquetaFiltro,
        puntos: [],
      },
    },
  };
};

// Normaliza el contrato guardado para que solo entren lecturas reales.
const normalizarContratoGlucosaGuardado = (contrato) => {
  if (!contrato?.medicionesPorFiltro) return crearContratoGlucosaVacio();

  const medicionesPorFiltro = Object.entries(contrato.medicionesPorFiltro).reduce(
    (acumulado, [claveFecha, bloque]) => {
      const puntos = (bloque?.puntos ?? [])
        .filter(esMedicionRealGlucosa)
        .map((medicion) => ({
          ...medicion,
          toma: Number(medicion.toma),
        }))
        .sort(ordenarPorFechaAsc);

      acumulado[claveFecha] = {
        etiquetaFiltro: bloque?.etiquetaFiltro ?? claveFecha,
        puntos,
      };

      return acumulado;
    },
    {},
  );
  const contratoNormalizado = {
    ...contrato,
    medicionesPorFiltro,
  };
  const filtros = obtenerFiltrosDiarios(contratoNormalizado).sort(
    (a, b) => new Date(a.value) - new Date(b.value),
  );
  const claveHoy = crearClaveFecha(new Date());
  const seleccionActual = medicionesPorFiltro[claveHoy]
    ? claveHoy
    : filtros.at(-1)?.value ?? claveHoy;

  if (!medicionesPorFiltro[seleccionActual]) {
    return crearContratoGlucosaVacio();
  }

  return {
    ...contratoNormalizado,
    filtros,
    seleccionActual,
  };
};

// Lee el contrato diario guardado de glucosa sin bloquear la vista si hay datos invalidos.
const leerContratoGlucosaGuardado = () => {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_STORAGE_GLUCOSA_DIA);
    const estadoGuardado = textoGuardado ? JSON.parse(textoGuardado) : null;
    return normalizarContratoGlucosaGuardado(estadoGuardado);
  } catch {
    return crearContratoGlucosaVacio();
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
  });

  return `${fechaTxt.replace(".", "")} ${horaTxt}`;
};

const formatearHoraLabel = (fecha) =>
  fecha.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const formatearFechaTarjetaGlucosa = (fecha) =>
  fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

// Clasifica una lectura de glucosa segun si fue tomada en ayuno o despues de comer.
const obtenerEstadoGlucosa = (toma, esAyuno) => {
  const valor = Number(toma);
  const [hipoglucemia, normal, prediabetes, hiperglucemia] =
    GlTxt.textosGenerales.condiciones;

  if (!Number.isFinite(valor)) {
    return { condicion: "--", bg: "#B5B7BF" };
  }

  if (valor < 70) return hipoglucemia;

  if (esAyuno) {
    if (valor <= 99) return normal;
    if (valor <= 125) return prediabetes;
    return hiperglucemia;
  }

  if (valor < 140) return normal;
  if (valor <= 199) return prediabetes;
  return hiperglucemia;
};

const construirMedicionDiaria = ({
  glucosa,
  tipo,
  contexto,
  metodo,
  fechaHoraISO,
}) => {
  const fecha = new Date(fechaHoraISO);

  return {
    id: `glu-${Date.now()}`,
    fechaHoraISO,
    hora: Number((fecha.getHours() + fecha.getMinutes() / 60).toFixed(2)),
    toma: glucosa,
    horaLabel: formatearHoraLabel(fecha),
    tipo,
    contexto,
    metodo,
  };
};

const obtenerFiltrosDiarios = (contrato) =>
  Object.entries(contrato.medicionesPorFiltro).map(([value, bloque]) => ({
    value,
    label: bloque.etiquetaFiltro,
  }));

const agregarMedicionAlContrato = (contratoAnterior, medicionNueva) => {
  const claveFecha = crearClaveFecha(new Date(medicionNueva.fechaHoraISO));
  const bloqueExistente = contratoAnterior.medicionesPorFiltro[claveFecha];

  const siguienteBloque = {
    etiquetaFiltro:
      bloqueExistente?.etiquetaFiltro ??
      new Date(medicionNueva.fechaHoraISO).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    puntos: [...(bloqueExistente?.puntos ?? []), medicionNueva].sort(
      (a, b) => new Date(a.fechaHoraISO) - new Date(b.fechaHoraISO),
    ),
  };

  const medicionesPorFiltro = {
    ...contratoAnterior.medicionesPorFiltro,
    [claveFecha]: siguienteBloque,
  };

  const filtros = obtenerFiltrosDiarios({ medicionesPorFiltro }).sort(
    (a, b) => new Date(a.value) - new Date(b.value),
  );

  return {
    ...contratoAnterior,
    filtros,
    seleccionActual: claveFecha,
    medicionesPorFiltro,
  };
};

const ordenarPorFechaAsc = (a, b) =>
  new Date(a.fechaHoraISO) - new Date(b.fechaHoraISO);

const obtenerLabelOpcion = (opciones, value) =>
  opciones.find((item) => item.value === value)?.label ?? "--";

// pinta los radios de seleccion segun ayuno
const NavegacionTipoGlucosa = ({ valor, alCambiar }) => {
  const opciones = GlTxt.estadosGlucosa;
  return (
    <div className={styles.cntNavegacion}>
      <ControlRadio
        opciones={opciones}
        className={styles.controlRadioEstilos}
        valor={valor}
        onChange={alCambiar}
      />
    </div>
  );
};

// pinta componente Ultimo valor glucosa

const UltimoValorGlucosa = ({ esAyuno, ultimaLectura, lecturaAnterior }) => {
  const estadoUltimo = obtenerEstadoGlucosa(ultimaLectura?.toma, esAyuno);
  const estadoAnterior = obtenerEstadoGlucosa(lecturaAnterior?.toma, esAyuno);

  return (
    <div className={styles.UltimoValorGlucosa}>
      <div className={styles.ulheader}>
        <h3 className={styles.ultit}>{GlTxt.CompUltimoValor.tit}</h3>
        <p className={styles.ulbase}>
          {esAyuno
            ? GlTxt.textosGenerales.base[0]
            : GlTxt.textosGenerales.base[1]}
        </p>
      </div>
      <div className={styles.uldatos}>
        <div className={styles.ularriba}>
          <div className={styles.ulcntUltimo}>
            <p className={styles.ultxtUltimo}>{GlTxt.CompUltimoValor.ultimo}</p>
            <div className={styles.ulbgcondicion}>
              <div
                className={styles.ulbg}
                style={{ backgroundColor: estadoUltimo.bg }}
              ></div>
              <p className={styles.ulcondicion}>{estadoUltimo.condicion}</p>
            </div>
          </div>
          <p className={styles.ulvalor}>
            {ultimaLectura?.toma ?? "--"} {GlTxt.textosGenerales.unidad}
          </p>
          <div className={styles.ulCntfcha}>
            <p className={styles.ulfcha}>
              {ultimaLectura
                ? formatearFechaTarjetaGlucosa(new Date(ultimaLectura.fechaHoraISO))
                : "--"}
            </p>
            <p className={styles.ulhora}>
              {ultimaLectura
                ? formatearHoraLabel(new Date(ultimaLectura.fechaHoraISO))
                : "--"}
            </p>
          </div>
        </div>

        <div className={styles.ulabajo}>
          <div className={styles.ulcntAnterior}>
            <p className={styles.ultxtAnterior}>
              {GlTxt.CompUltimoValor.anterior}
            </p>
            <div className={styles.ulbgcondicion}>
              <div
                className={styles.ulbg}
                style={{ backgroundColor: estadoAnterior.bg }}
              ></div>
              <p className={styles.ulcondicion}>{estadoAnterior.condicion}</p>
            </div>
          </div>
          <p className={styles.ulvalor}>
            {lecturaAnterior?.toma ?? "--"} {GlTxt.textosGenerales.unidad}
          </p>
          <div className={styles.ulCntfcha}>
            <p className={styles.ulfcha}>
              {lecturaAnterior
                ? formatearFechaTarjetaGlucosa(
                    new Date(lecturaAnterior.fechaHoraISO),
                  )
                : "--"}
            </p>
            <p className={styles.ulhora}>
              {lecturaAnterior
                ? formatearHoraLabel(new Date(lecturaAnterior.fechaHoraISO))
                : "--"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Elementos para los  Mapeos de componente Valores Glucosa   */
//pinta fila de condiciones
const FilaCondiciones = ({ condicion, bg }) => {
  return (
    <div className={styles.vgcondicion}>
      <div className={styles.vgbg} style={{ backgroundColor: bg }}></div>
      <p className={styles.vgcondicion}>{condicion}</p>
    </div>
  );
};

//pinta valores de las condiciones,
const FilaValores = ({ valor }) => {
  return (
    <div className={styles.vgvalores}>
      <p className={styles.vgvalor}>
        {valor} {GlTxt.CompValoresGlucosa.unidad}
      </p>
    </div>
  );
};

// pinta componente Valores Glucosa
const ValoresGlucosa = ({ esAyuno, condiciones = [] }) => {
  const { valoresAyuno, valoresPostpandrial } = GlTxt.CompValoresGlucosa;
  return (
    <div className={styles.ValoresGlucosa}>
      <div className={styles.vgheader}>
        <h3 className={styles.vgtit}>{GlTxt.CompValoresGlucosa.tit}</h3>
        <p className={styles.vgbase}>
          {esAyuno
            ? GlTxt.textosGenerales.base[0]
            : GlTxt.textosGenerales.base[1]}
        </p>
      </div>
      <div className={styles.vgcntValores}>
        {condiciones?.map((item, i) => {
          const valorCorrespondiente = esAyuno
            ? valoresAyuno[i]
            : valoresPostpandrial[i];
          return (
            <div key={i} className={styles.vgfila}>
              <FilaCondiciones condicion={item.condicion} bg={item.bg} />
              <FilaValores valor={valorCorrespondiente} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

//pinta pasos recomendaciones del modal
const PasosRecomendaciones = ({ paso }) => {
  return (
    <li className={styles.pasos} dangerouslySetInnerHTML={{ __html: paso }}>
      {/* {paso} */}
    </li>
  );
};

//Opciones de select en modal
export const opcionesGlucosa = [
  { label: "Ayuno", value: "ayuno" },
  { label: "Después de comer", value: "postprandial" },
  { label: "Preprandial", value: "preprandial" },
  { label: "Antes de dormir", value: "antesDormir" },
  { label: "Durante síntomas", value: "sintomas" },
  { label: "No especificado", value: "noEspecificado" },
];

export const opcionesGlucometro = [
  { label: "Glucómetro capilar", value: "capilar" },
  { label: "Sensor continuo (CGM)", value: "cgm" },
  { label: "Laboratorio", value: "lab" },
];

export const opcionesActividad = [
  { label: "Reposo", value: "reposo" },
  { label: "Actividad física reciente", value: "actividad" },
  { label: "No especificado", value: "desconocido" },
];

// pinta modal de registro de medición
const ModalRegistroGlucosa = ({ tipoInicial = "ayuno", onClose, onConfirm }) => {
  const fechaBase = useMemo(() => new Date(), []);
  const [glucosa, setGlucosa] = useState("");
  const [tipoGlucosa, setTipoGlucosa] = useState(tipoInicial);
  const [tipoGlucometro, setTipoGlucometro] = useState("capilar");
  const [tipoActividad, setTipoActividad] = useState("reposo");

  const fechaHoraTexto = formatearFechaHora(fechaBase);
  const glucosaNormalizada = glucosa.trim();
  const glucosaNumerica = Number(glucosaNormalizada);
  const deshabilitado =
    !glucosaNormalizada || Number.isNaN(glucosaNumerica) || glucosaNumerica <= 0;

  const manejarGuardar = () => {
    if (deshabilitado) return;

    onConfirm?.(
      construirMedicionDiaria({
        glucosa: glucosaNumerica,
        tipo: tipoGlucosa,
        contexto: tipoActividad,
        metodo: tipoGlucometro,
        fechaHoraISO: fechaBase.toISOString(),
      }),
    );
  };

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div className={styles.ModalRegistroGlucosa}>
        <div className={styles.modalHeader}>
          <p>{GlTxt.ModalCaptura.tit}</p>
          <button
            className={styles.modalClose}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className={styles.mdcntCaptura}>
          <div className={styles.mdcntfcha}>
            <p className={styles.mdlabelfcha}>{GlTxt.ModalCaptura.fcha}</p>
            <p className={styles.mdfecha}>{fechaHoraTexto}</p>
          </div>
          <div className={styles.mdcntinput}>
            <p className={styles.mdlabelinput}>{GlTxt.ModalCaptura.label}</p>
            <InpTexto
              placeholder="-- --"
              className={styles.InpTexto}
              value={glucosa}
              inputMode="numeric"
              onChange={(event) =>
                setGlucosa(event.target.value.replace(/[^\d]/g, ""))
              }
            />
          </div>

          <div className={styles.mdcntSelects}>
            <div className={styles.mdcntSelectclase}>
              <p className={styles.mdselectlabel}>Tipo de medición</p>
              <InpSelect
                opciones={opcionesGlucosa}
                value={tipoGlucosa}
                onChange={setTipoGlucosa}
                placeholder="Glucosa"
                estilos={{
                  botonMain: styles.modalSelectBoton,
                  opcion: styles.opcionGlucosa,
                }}
              />
            </div>

            <div className={styles.mdcntSelectclase}>
              <p className={styles.mdselectlabel}>Contexto de medición</p>
              <InpSelect
                opciones={opcionesActividad}
                value={tipoActividad}
                onChange={setTipoActividad}
                placeholder="Actividad"
                estilos={{
                  botonMain: styles.modalSelectBoton,
                  opcion: styles.opcionActividad,
                }}
              />
            </div>
            <div className={styles.mdcntSelectclase}>
              <p className={styles.mdselectlabel}>Método de medición</p>
              <InpSelect
                opciones={opcionesGlucometro}
                value={tipoGlucometro}
                onChange={setTipoGlucometro}
                placeholder="Glucómetro"
                estilos={{
                  botonMain: styles.modalSelectBoton,
                  opcion: styles.opcionGlucometro,
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.mdcntRecomendaciones}>
          <p className={styles.mdRecomendaciones}>
            {GlTxt.ModalCaptura.recomendaciones}
          </p>
          <ol>
            {GlTxt.ModalCaptura.pasos.map((item, i) => (
              <PasosRecomendaciones key={i} paso={item.paso} />
            ))}
          </ol>
        </div>

        <div className={styles.modalActions}>
          <Boton
            variant="primario"
            isLoading={false}
            disabled={deshabilitado}
            onClick={manejarGuardar}
          >
            Guardar
          </Boton>
        </div>
      </div>
    </div>
  );
};

//pinta mensajes de lecturas actualizada

const ConfirmacionRegistro = ({ registro, onClose }) => {
  if (!registro) return null;

  const excede =
    registro.tipo === "ayuno"
      ? registro.toma < 70 || registro.toma > 126
      : registro.toma < 70 || registro.toma > 200;
  const confirmacion = GlTxt.CopmConfirmacionRegistro;

  const mensajeAlerta =
    registro.toma < 70
      ? confirmacion.fueraRango.bajo
      : confirmacion.fueraRango.alto;

  return excede ? (
    <div className={styles.ConfirmacionAlerta}>
      <div className={styles.glCntIcoMsjAlerta}>
        <img
          className={styles.glConficono}
          src={confirmacion.fueraRango.icono}
        ></img>
        <p className={styles.glTxtfuera}>{mensajeAlerta}</p>
      </div>
      <Boton variant="primario" isLoading={false} onClick={onClose}>
        {confirmacion.boton}
      </Boton>
    </div>
  ) : (
    <div className={styles.ConfirmacionRegistro}>
      <div className={styles.glCntIcoMsjRegistro}>
        <img className={styles.glConficono} src={confirmacion.icono}></img>
        <div className={styles.glmsjTexto}>
          <p className={styles.glTxtmsj}>{confirmacion.registro.mensaje}</p>
          <p className={styles.glTxtfcha}>
            {formatearFechaHora(new Date(registro.fechaHoraISO))}
          </p>
        </div>
      </div>
      <Boton variant="primario" isLoading={false} onClick={onClose}>
        {confirmacion.boton}
      </Boton>
    </div>
  );
};

// pinta Alertas de  glucosa
const AlertasGlucosa = ({ color = "verde" }) => {
  const alerta = GlTxt.CompAlertas[color]; // obtiene la rama correcta

  if (!alerta) {
    // fallback para evitar crash si el color no existe
    return <p>No hay alerta definida para "{color}"</p>;
  }

  return (
    <div className={styles.AlertasGlucosa}>
      <img
        className={styles.icono}
        src={alerta.icono}
        alt={`icono ${color}`}
      ></img>
      {alerta.mensaje.map((linea, i) => (
        <p key={i}>{linea}</p>
      ))}
    </div>
  );
};

const InformacionGlucosa = () => {
  const { r1, r2, r3 } = GlTxt.textosGenerales.mensaje;

  return (
    <div className={styles.infoGlucosa}>
      <div className={styles.infoIcono} aria-hidden="true">
        i
      </div>
      <div className={styles.infoTexto}>
        <p>{r1}</p>
        <p>{r2}</p>
        <p>{r3}</p>
      </div>
    </div>
  );
};

//pinta Grafica Glucosa Diaria

const GraficaDiaria = ({ esAyuno, data = [] }) => {
  const puntoActivo = data[data.length - 1];

  return (
    <div className={styles.GraficaDiaria}>
      <div className={styles.ulheader}>
        <h3 className={styles.ultit}>Grafica Diara</h3>
        <p className={styles.ulbase}>
          {esAyuno
            ? GlTxt.textosGenerales.base[0]
            : GlTxt.textosGenerales.base[1]}
        </p>
      </div>

      <div className={styles.glAxisLabel}>mg/dL</div>

      <div className={styles.glDiariaWrap}>
        <div className={styles.glDiariaYAxis}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 0, bottom: -20, left: 0 }}>
              <XAxis
                dataKey="hora"
                type="number"
                domain={[0, 24]}
                tick={false}
                axisLine={false}
                tickLine={false}
                height={64}
              />
              <YAxis
                type="number"
                dataKey="toma"
                domain={[50, 140]}
                ticks={[50, 60, 70, 80, 90, 100, 110, 120, 130, 140]}
                tickLine={false}
                axisLine={false}
                width={44}
                tick={{ fill: "#6B7280", fontSize: 14 }}
              />
              <Area
                type="linear"
                dataKey="toma"
                stroke="transparent"
                fill="transparent"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.glDiariaScrollPane}>
          <div className={styles.glDiariaScroll}>
            <div className={styles.glDiariaInner}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 8, left: 0 }}>
                  <CartesianGrid
                    vertical={false}
                    stroke="#BFD7FF"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    type="number"
                    dataKey="hora"
                    domain={[0, 24]}
                    ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]}
                    tickLine={false}
                    axisLine={false}
                    label={{
                      value: "(Horas)",
                      position: "bottom",
                      offset: -7,
                      fill: "#B5B5B5",
                    }}
                  />

                  <YAxis
                    hide
                    type="number"
                    dataKey="toma"
                    domain={[50, 140]}
                  />

                  {puntoActivo && (
                    <ReferenceLine
                      x={puntoActivo.hora}
                      stroke="#7D8AA5"
                      strokeDasharray="6 6"
                    />
                  )}

                  <Tooltip cursor={true} content={<TooltipGlucosaDiaria />} />

                  <Scatter
                    data={data}
                    fill="#B57B3A"
                    shape={(props) => (
                      <circle cx={props.cx} cy={props.cy} r={10} fill="#B57B3A" />
                    )}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//pinta tooltip en grafica Diaria

const TooltipGlucosaDiaria = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const punto = payload[0].payload;

  return (
    <div className={styles.tooltipDiaria}>
      <span>{punto.toma} mg/dL</span>
      <span>{punto.horaLabel}</span>
    </div>
  );
};

//pinta tooltip en grafica Promedio

const TooltipGlucosa = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltipGlucosa}>
      <span className={styles.tooltipValor}>{payload[0].value} mg/dL</span>
      <span className={styles.tooltipFecha}>{label}</span>
    </div>
  );
};

const graficaPr = GlTxt.CompGraficaProm;

// Obtiene el lunes de una semana para construir filtros estables.
const obtenerInicioSemanaGlucosa = (fechaEntrada) => {
  const fecha = new Date(fechaEntrada);
  const dia = fecha.getDay();
  const desfase = dia === 0 ? -6 : 1 - dia;
  fecha.setHours(0, 0, 0, 0);
  fecha.setDate(fecha.getDate() + desfase);

  return fecha;
};

// Obtiene el domingo de una semana para mostrar el rango del selector.
const obtenerFinSemanaGlucosa = (inicioSemana) => {
  const finSemana = new Date(inicioSemana);
  finSemana.setDate(finSemana.getDate() + 6);
  finSemana.setHours(23, 59, 59, 999);

  return finSemana;
};

// Formatea dia y mes corto para los filtros inferiores.
const formatearDiaMesGlucosa = (fecha) => {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = ABREVIATURAS_MESES_GLUCOSA[fecha.getMonth()];

  return `${dia}, ${mes}`;
};

// Agrupa lecturas por dia y calcula el promedio para la grafica de glucosa.
const construirMapaPromediosGlucosa = (lecturas) => {
  const mapa = new Map();

  lecturas.filter(esMedicionRealGlucosa).forEach((lectura) => {
    const claveDia = crearClaveFecha(new Date(lectura.fechaHoraISO));
    const toma = Number(lectura.toma);
    const existente = mapa.get(claveDia);

    if (!existente) {
      mapa.set(claveDia, { suma: toma, cantidad: 1 });
      return;
    }

    existente.suma += toma;
    existente.cantidad += 1;
  });

  return mapa;
};

// Crea filtros semana/mes/anio desde las lecturas reales disponibles.
const construirOpcionesFiltroPromedioGlucosa = (lecturas) => {
  const mapaSemanas = new Map();
  const mapaMeses = new Map();
  const mapaAnios = new Map();
  const lecturasValidas = lecturas.filter(esMedicionRealGlucosa);
  const fechaActual = new Date();

  lecturasValidas.forEach((lectura) => {
    const fecha = new Date(lectura.fechaHoraISO);
    const inicioSemana = obtenerInicioSemanaGlucosa(fecha);
    const finSemana = obtenerFinSemanaGlucosa(inicioSemana);
    const valorSemana = crearClaveFecha(inicioSemana);
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth();
    const valorMes = `${anio}-${String(mes + 1).padStart(2, "0")}`;

    if (!mapaSemanas.has(valorSemana)) {
      mapaSemanas.set(valorSemana, {
        value: valorSemana,
        label: `Lun ${formatearDiaMesGlucosa(inicioSemana)} - Dom ${formatearDiaMesGlucosa(finSemana)}`,
      });
    }

    if (!mapaMeses.has(valorMes)) {
      mapaMeses.set(valorMes, {
        value: valorMes,
        label: `${NOMBRES_MESES_GLUCOSA[mes]} - ${anio}`,
      });
    }

    if (!mapaAnios.has(String(anio))) {
      mapaAnios.set(String(anio), { value: String(anio), label: String(anio) });
    }
  });

  if (!lecturasValidas.length) {
    const inicioSemana = obtenerInicioSemanaGlucosa(fechaActual);
    const finSemana = obtenerFinSemanaGlucosa(inicioSemana);
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    const valorMes = `${anio}-${String(mes + 1).padStart(2, "0")}`;

    mapaSemanas.set(crearClaveFecha(inicioSemana), {
      value: crearClaveFecha(inicioSemana),
      label: `Lun ${formatearDiaMesGlucosa(inicioSemana)} - Dom ${formatearDiaMesGlucosa(finSemana)}`,
    });
    mapaMeses.set(valorMes, {
      value: valorMes,
      label: `${NOMBRES_MESES_GLUCOSA[mes]} - ${anio}`,
    });
    mapaAnios.set(String(anio), { value: String(anio), label: String(anio) });
  }

  return {
    [PERIODOS_PROMEDIO_GLUCOSA.SEMANA]: [...mapaSemanas.values()].sort(
      (actual, siguiente) => (actual.value < siguiente.value ? 1 : -1),
    ),
    [PERIODOS_PROMEDIO_GLUCOSA.MES]: [...mapaMeses.values()].sort(
      (actual, siguiente) => (actual.value < siguiente.value ? 1 : -1),
    ),
    [PERIODOS_PROMEDIO_GLUCOSA.ANIO]: [...mapaAnios.values()].sort(
      (actual, siguiente) => Number(siguiente.value) - Number(actual.value),
    ),
  };
};

// Construye la serie de promedio para semana, mes o anio usando lecturas reales.
const construirSeriePromedioGlucosa = ({ lecturas, periodo, valorFiltro }) => {
  if (!valorFiltro) return [];

  const mapaPromedios = construirMapaPromediosGlucosa(lecturas);

  if (periodo === PERIODOS_PROMEDIO_GLUCOSA.SEMANA) {
    const inicio = new Date(`${valorFiltro}T00:00:00`);

    return ABREVIATURAS_DIAS_GLUCOSA.map((etiqueta, indice) => {
      const fecha = new Date(inicio);
      fecha.setDate(inicio.getDate() + indice);
      const promedio = mapaPromedios.get(crearClaveFecha(fecha));

      return {
        etiqueta,
        toma: promedio ? Math.round(promedio.suma / promedio.cantidad) : null,
      };
    });
  }

  if (periodo === PERIODOS_PROMEDIO_GLUCOSA.MES) {
    const [anioTxt, mesTxt] = valorFiltro.split("-");
    const anio = Number(anioTxt);
    const mesIndice = Number(mesTxt) - 1;
    const diasMes = new Date(anio, mesIndice + 1, 0).getDate();

    return Array.from({ length: diasMes }, (_, indice) => {
      const dia = indice + 1;
      const fecha = new Date(anio, mesIndice, dia);
      const promedio = mapaPromedios.get(crearClaveFecha(fecha));

      return {
        etiqueta: String(dia),
        toma: promedio ? Math.round(promedio.suma / promedio.cantidad) : null,
      };
    });
  }

  const anio = Number(valorFiltro);

  return ABREVIATURAS_MESES_GLUCOSA.map((etiqueta, mesIndice) => {
    const diasMes = new Date(anio, mesIndice + 1, 0).getDate();
    const valores = [];

    for (let dia = 1; dia <= diasMes; dia += 1) {
      const fecha = new Date(anio, mesIndice, dia);
      const promedio = mapaPromedios.get(crearClaveFecha(fecha));
      if (!promedio) continue;
      valores.push(promedio.suma / promedio.cantidad);
    }

    return {
      etiqueta,
      toma: valores.length
        ? Math.round(valores.reduce((suma, valor) => suma + valor, 0) / valores.length)
        : null,
    };
  });
};

// Normaliza puntos para que solo las lecturas reales entren a la capa de dibujo.
const normalizarSeriePromedioGlucosa = (serie = []) =>
  serie.map((item, indice) => {
    const toma = Number(item?.toma);
    const tieneLectura = Number.isFinite(toma) && toma > 0;

    return {
      indice,
      etiqueta: item?.etiqueta ?? String(indice + 1),
      toma: tieneLectura ? toma : null,
      tieneLectura,
    };
  });

const redondearAbajoGlucosa = (valor, paso) => Math.floor(valor / paso) * paso;
const redondearArribaGlucosa = (valor, paso) => Math.ceil(valor / paso) * paso;

// Calcula una escala Y legible para promedio, sin amontonar ticks.
const construirEscalaPromedioGlucosa = (datos) => {
  const valores = datos
    .filter((dato) => dato.tieneLectura)
    .map((dato) => dato.toma);

  if (!valores.length) {
    return {
      minimo: DOMINIO_FALLBACK_PROMEDIO_GLUCOSA[0],
      maximo: DOMINIO_FALLBACK_PROMEDIO_GLUCOSA[1],
      ticks: TICKS_FALLBACK_PROMEDIO_GLUCOSA,
    };
  }

  const minimoCrudo = Math.min(...valores) - 20;
  const maximoCrudo = Math.max(...valores) + 20;
  const rango = maximoCrudo - minimoCrudo;
  const paso = rango > 120 ? 40 : rango > 70 ? 20 : 10;
  const minimo = Math.max(0, redondearAbajoGlucosa(Math.min(60, minimoCrudo), paso));
  const maximo = redondearArribaGlucosa(Math.max(140, maximoCrudo), paso);
  const ticks = [];

  for (let tick = minimo; tick <= maximo; tick += paso) {
    ticks.push(tick);
  }

  return { minimo, maximo, ticks };
};

// Convierte mg/dL a coordenada Y para el SVG de promedio.
const convertirGlucosaAY = (valor, escala) => {
  const rango = escala.maximo - escala.minimo || 1;

  return ALTO_BASE_PROMEDIO_GLUCOSA -
    ((valor - escala.minimo) / rango) * ALTO_BASE_PROMEDIO_GLUCOSA;
};

// Construye puntos, tramos y area inferior solo con lecturas reales.
const construirTrazosPromedioGlucosa = (datos, escala) => {
  if (!datos.length) return { puntos: [], lineas: [], area: "" };

  const anchoPaso = ANCHO_BASE_PROMEDIO_GLUCOSA / datos.length;
  const puntos = datos
    .filter((dato) => dato.tieneLectura)
    .map((dato) => ({
      indice: dato.indice,
      etiqueta: dato.etiqueta,
      toma: dato.toma,
      x: anchoPaso * dato.indice + anchoPaso / 2,
      y: convertirGlucosaAY(dato.toma, escala),
    }));
  const lineas = [];

  for (let indice = 1; indice < puntos.length; indice += 1) {
    lineas.push({
      origen: puntos[indice - 1],
      destino: puntos[indice],
    });
  }

  const area =
    puntos.length >= 2
      ? [
          `M ${puntos[0].x} ${ALTO_BASE_PROMEDIO_GLUCOSA}`,
          ...puntos.map((punto) => `L ${punto.x} ${punto.y}`),
          `L ${puntos[puntos.length - 1].x} ${ALTO_BASE_PROMEDIO_GLUCOSA}`,
          "Z",
        ].join(" ")
      : "";

  return { puntos, lineas, area };
};

// Ajusta la densidad de etiquetas del eje X segun el periodo activo.
const formatearEtiquetaPromedioGlucosa = (dato, indice, total, periodo) => {
  if (periodo === PERIODOS_PROMEDIO_GLUCOSA.SEMANA) return dato.etiqueta;

  if (periodo === PERIODOS_PROMEDIO_GLUCOSA.MES) {
    const numeroDia = Number(dato.etiqueta);
    const diaVisible =
      Number.isFinite(numeroDia) &&
      (numeroDia === 1 ||
        numeroDia === total ||
        numeroDia % 5 === 0 ||
        numeroDia === 15);

    return diaVisible ? String(numeroDia) : "";
  }

  return String(dato.etiqueta).slice(0, 3);
};

//pinta grafica promedio
const GraficaPromedio = ({ esAyuno, lecturas = [] }) => {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(
    PERIODOS_PROMEDIO_GLUCOSA.SEMANA,
  );
  const opcionesFiltroPorPeriodo = useMemo(
    () => construirOpcionesFiltroPromedioGlucosa(lecturas),
    [lecturas],
  );
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState(() => ({
    [PERIODOS_PROMEDIO_GLUCOSA.SEMANA]:
      opcionesFiltroPorPeriodo[PERIODOS_PROMEDIO_GLUCOSA.SEMANA]?.[0]?.value ?? "",
    [PERIODOS_PROMEDIO_GLUCOSA.MES]:
      opcionesFiltroPorPeriodo[PERIODOS_PROMEDIO_GLUCOSA.MES]?.[0]?.value ?? "",
    [PERIODOS_PROMEDIO_GLUCOSA.ANIO]:
      opcionesFiltroPorPeriodo[PERIODOS_PROMEDIO_GLUCOSA.ANIO]?.[0]?.value ?? "",
  }));
  const seriePromedio = useMemo(
    () =>
      construirSeriePromedioGlucosa({
        lecturas,
        periodo: periodoSeleccionado,
        valorFiltro: filtrosSeleccionados[periodoSeleccionado],
      }),
    [filtrosSeleccionados, lecturas, periodoSeleccionado],
  );
  const datosGrafica = useMemo(
    () => normalizarSeriePromedioGlucosa(seriePromedio),
    [seriePromedio],
  );
  const escalaPromedio = useMemo(
    () => construirEscalaPromedioGlucosa(datosGrafica),
    [datosGrafica],
  );
  const trazosPromedio = useMemo(
    () => construirTrazosPromedioGlucosa(datosGrafica, escalaPromedio),
    [datosGrafica, escalaPromedio],
  );
  const etiquetasEjeX = useMemo(
    () =>
      datosGrafica.map((dato, indice) =>
        formatearEtiquetaPromedioGlucosa(
          dato,
          indice,
          datosGrafica.length,
          periodoSeleccionado,
        ),
      ),
    [datosGrafica, periodoSeleccionado],
  );

  const prGlSelect = {
    contenedor: styles.glSelectControl,
    botonMain: styles.glSelectBoton,
    panelOpciones: styles.glSelectPanel,
    opcion: styles.glSelectOpcion,
  };
  const variablesGrafica = {
    "--alto-svg-promedio": `${ALTO_BASE_PROMEDIO_GLUCOSA + ALTO_CARRIL_X_PROMEDIO_GLUCOSA}px`,
    "--alto-trama-promedio": `${ALTO_BASE_PROMEDIO_GLUCOSA}px`,
    "--columnas-eje-x-promedio": String(Math.max(datosGrafica.length, 1)),
  };

  useEffect(() => {
    // Mantiene el filtro seleccionado dentro de las opciones disponibles.
    const opcionesPeriodo = opcionesFiltroPorPeriodo[periodoSeleccionado] ?? [];
    const valorActual = filtrosSeleccionados[periodoSeleccionado];
    const existeValorActual = opcionesPeriodo.some(
      (opcion) => opcion.value === valorActual,
    );

    if (!existeValorActual) {
      setFiltrosSeleccionados((prev) => ({
        ...prev,
        [periodoSeleccionado]: opcionesPeriodo[0]?.value ?? "",
      }));
    }
  }, [filtrosSeleccionados, opcionesFiltroPorPeriodo, periodoSeleccionado]);

  return (
    <div className={styles.GraficaPromedio}>
      <div className={styles.ulheader}>
        <h3 className={styles.ultit}>{graficaPr.tit}</h3>
        <p className={styles.ulbase}>
          {esAyuno
            ? GlTxt.textosGenerales.base[0]
            : GlTxt.textosGenerales.base[1]}
        </p>
      </div>
      <div className={styles.grnav}>
        {PERIODOS_PROMEDIO_UI_GLUCOSA.map((periodo) => (
          <Boton
            key={periodo.valor}
            variant="grafica"
            forma="redondo"
            isLoading={false}
            onClick={() => setPeriodoSeleccionado(periodo.valor)}
          >
            {periodo.etiqueta}
          </Boton>
        ))}
      </div>
      <div className={styles.glPromedioManual} style={variablesGrafica}>
        <p className={styles.labelY}>{graficaPr.unidad}</p>
        <div className={styles.glPromedioArea}>
          <div className={styles.glPromedioEjeY}>
            {escalaPromedio.ticks
              .slice()
              .reverse()
              .map((tick) => (
                <span key={tick} className={styles.glPromedioTickY}>
                  {tick}
                </span>
              ))}
          </div>

          <div className={styles.glPromedioZona}>
            <svg
              className={styles.glPromedioSvg}
              viewBox={`0 0 ${ANCHO_BASE_PROMEDIO_GLUCOSA} ${
                ALTO_BASE_PROMEDIO_GLUCOSA + ALTO_CARRIL_X_PROMEDIO_GLUCOSA
              }`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="glucosaPromedioArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f8a83a" stopOpacity="0.76" />
                  <stop offset="100%" stopColor="#f8a83a" stopOpacity="0.18" />
                </linearGradient>
              </defs>

              {escalaPromedio.ticks.map((tick) => {
                const y = convertirGlucosaAY(tick, escalaPromedio);
                return (
                  <line
                    key={`glucosa-guia-${tick}`}
                    className={styles.glPromedioGuia}
                    x1="0"
                    y1={y}
                    x2={ANCHO_BASE_PROMEDIO_GLUCOSA}
                    y2={y}
                  />
                );
              })}

              <line
                className={styles.glPromedioBase}
                x1="0"
                y1={ALTO_BASE_PROMEDIO_GLUCOSA}
                x2={ANCHO_BASE_PROMEDIO_GLUCOSA}
                y2={ALTO_BASE_PROMEDIO_GLUCOSA}
              />

              {trazosPromedio.area && (
                <path
                  className={styles.glPromedioAreaRelleno}
                  d={trazosPromedio.area}
                />
              )}

              {trazosPromedio.lineas.map((linea, indice) => (
                <line
                  key={`glucosa-linea-${indice}`}
                  className={styles.glPromedioLinea}
                  x1={linea.origen.x}
                  y1={linea.origen.y}
                  x2={linea.destino.x}
                  y2={linea.destino.y}
                />
              ))}

              {trazosPromedio.puntos.map((punto) => (
                <circle
                  key={`glucosa-punto-${punto.indice}`}
                  className={styles.glPromedioPunto}
                  cx={punto.x}
                  cy={punto.y}
                  r="3"
                />
              ))}
            </svg>

            <div className={styles.glPromedioEjeX}>
              {etiquetasEjeX.map((etiqueta, indice) => (
                <span key={`glucosa-eje-x-${indice}`} className={styles.glPromedioTickX}>
                  {etiqueta}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.glPromedioTituloX}>
          {periodoSeleccionado === PERIODOS_PROMEDIO_GLUCOSA.ANIO
            ? "Meses"
            : "Días"}
        </div>
      </div>
      <div className={styles.glSelectfecha}>
        <InpSelect
          opciones={opcionesFiltroPorPeriodo[periodoSeleccionado] ?? []}
          value={filtrosSeleccionados[periodoSeleccionado]}
          onChange={(valor) =>
            setFiltrosSeleccionados((prev) => ({
              ...prev,
              [periodoSeleccionado]: valor,
            }))
          }
          placeholder="Selecciona un periodo"
          estilos={prGlSelect}
        />
      </div>
    </div>
  );
};

// DASH METRICA GLUCOSA
const Glucosa = () => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState(
    GlTxt.estadosGlucosa[0],
  );
  const [contratoDiario, setContratoDiario] = useState(
    leerContratoGlucosaGuardado,
  );
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoModal, setTipoModal] = useState("ayuno");
  const [registroConfirmado, setRegistroConfirmado] = useState(null);
  const [modalRecordatoriosAbierto, setModalRecordatoriosAbierto] =
    useState(false);
  const [recordatoriosGlucosa, setRecordatoriosGlucosa] = useState(() =>
    leerRecordatoriosGlucosa(),
  );
  const esAyuno = tipoSeleccionado === GlTxt.estadosGlucosa[0];
  const bloqueDiarioActivo =
    contratoDiario.medicionesPorFiltro[contratoDiario.seleccionActual];
  const puntosDiarios = bloqueDiarioActivo?.puntos ?? [];
  const todasLasLecturas = Object.values(contratoDiario.medicionesPorFiltro)
    .flatMap((bloque) => bloque?.puntos ?? [])
    .sort(ordenarPorFechaAsc);

  const lecturasTotalesFiltradas = todasLasLecturas.filter((item) =>
    esAyuno ? item.tipo === "ayuno" : TIPOS_POSTPRANDIAL.includes(item.tipo),
  );

  const lecturasDiariasFiltradas = puntosDiarios.filter((item) =>
    esAyuno ? item.tipo === "ayuno" : TIPOS_POSTPRANDIAL.includes(item.tipo),
  );

  const ultimaLectura =
    lecturasTotalesFiltradas[lecturasTotalesFiltradas.length - 1] ?? null;
  const lecturaAnterior =
    lecturasTotalesFiltradas[lecturasTotalesFiltradas.length - 2] ?? null;
  const tipoMedidor = esAyuno ? "ayunas" : "despuesComer";
  const proximoRecordatorioGlucosa = useMemo(
    () => obtenerProximoRecordatorioGlucosa(recordatoriosGlucosa),
    [recordatoriosGlucosa],
  );
  const resumenRecordatorioGlucosa = useMemo(() => {
    const primerRecordatorioActivo = recordatoriosGlucosa.find(
      (recordatorio) => recordatorio.enabled,
    );

    if (!primerRecordatorioActivo) {
      return {
        hora: "--",
        dias: "Sin recordatorios activos",
        cuentaRegresiva: "--",
      };
    }

    return {
      hora: formatearHoraRecordatorioGlucosa(primerRecordatorioActivo),
      dias: formatearDiasRecordatorioGlucosa(primerRecordatorioActivo),
      cuentaRegresiva: formatearCuentaRegresivaRecordatorioGlucosa(
        proximoRecordatorioGlucosa,
      ),
    };
  }, [proximoRecordatorioGlucosa, recordatoriosGlucosa]);
  const metodoUltimaLectura = ultimaLectura
    ? obtenerLabelOpcion(opcionesGlucometro, ultimaLectura.metodo)
    : "--";
  const colorAlertaActual = ultimaLectura
    ? esAyuno
      ? ultimaLectura.toma < 70 || ultimaLectura.toma > 126
        ? "amarillo"
        : "verde"
      : ultimaLectura.toma < 70 || ultimaLectura.toma > 200
        ? "amarillo"
        : "verde"
    : "amarillo";

  const abrirModalCaptura = (tipoMedidorSolicitado) => {
    setRegistroConfirmado(null);
    setTipoModal(
      tipoMedidorSolicitado === "ayunas" ? "ayuno" : "postprandial",
    );
    setModalAbierto(true);
  };

  const cerrarModalCaptura = () => {
    setModalAbierto(false);
  };

  const abrirModalRecordatorios = () => {
    setModalRecordatoriosAbierto(true);
  };

  const cerrarModalRecordatorios = () => {
    setModalRecordatoriosAbierto(false);
  };

  const confirmarCaptura = (medicionNueva) => {
    setContratoDiario((actual) => agregarMedicionAlContrato(actual, medicionNueva));
    setRegistroConfirmado(medicionNueva);
    setModalAbierto(false);
  };

  const guardarRecordatorioGlucosa = (recordatorio) => {
    const recordatorioNormalizado = normalizarRecordatorioGlucosa(recordatorio);

    setRecordatoriosGlucosa((recordatoriosActuales) => {
      const indiceExistente = recordatoriosActuales.findIndex(
        (item) => item.id === recordatorioNormalizado.id,
      );

      if (indiceExistente === -1) {
        return [...recordatoriosActuales, recordatorioNormalizado];
      }

      return recordatoriosActuales.map((item, indice) =>
        indice === indiceExistente ? recordatorioNormalizado : item,
      );
    });
  };

  const eliminarRecordatorioGlucosa = (recordatorioId) => {
    setRecordatoriosGlucosa((recordatoriosActuales) =>
      recordatoriosActuales.filter(
        (recordatorio) => recordatorio.id !== recordatorioId,
      ),
    );
  };

  const alternarRecordatorioGlucosa = (recordatorioId) => {
    setRecordatoriosGlucosa((recordatoriosActuales) =>
      recordatoriosActuales.map((recordatorio) =>
        recordatorio.id === recordatorioId
          ? { ...recordatorio, enabled: !recordatorio.enabled }
          : recordatorio,
      ),
    );
  };

  useEffect(() => {
    guardarRecordatoriosGlucosa(recordatoriosGlucosa);
  }, [recordatoriosGlucosa]);

  useEffect(() => {
    try {
      localStorage.setItem(
        CLAVE_STORAGE_GLUCOSA_DIA,
        JSON.stringify(contratoDiario)
      );
      window.dispatchEvent(new CustomEvent("metricas_resumen_actualizado"));
    } catch {
      // Si localStorage no esta disponible, mantenemos las lecturas solo en memoria.
    }
  }, [contratoDiario]);

  return (
    <div className={styles.Glucosa}>
      <NavegacionTipoGlucosa
        valor={tipoSeleccionado}
        alCambiar={setTipoSeleccionado}
      />
      <div className={styles.cntPanelGlucosa}>
        <div className={styles.cntGraficaPromedio}>
          <MedidorGlucosa
            tipo={tipoMedidor}
            valor={ultimaLectura?.toma ?? null}
            ultimaActualizacion={
              ultimaLectura ? formatearFechaHora(new Date(ultimaLectura.fechaHoraISO)) : null
            }
            onClickAñadir={abrirModalCaptura}
          />
          <GraficaDiaria
            esAyuno={esAyuno}
            data={lecturasDiariasFiltradas}
          />
        </div>

        <div className={styles.centro}>
          <UltimoValorGlucosa
            esAyuno={esAyuno}
            ultimaLectura={ultimaLectura}
            lecturaAnterior={lecturaAnterior}
          />
            <TarjetaAlertasPresion
              className={styles.tarjetaRecordatoriosGlucosa}
              ultimoRegistro={ultimaLectura}
              fechaActualizacionTexto={
                ultimaLectura
                  ? formatearFechaHora(new Date(ultimaLectura.fechaHoraISO))
                  : "--"
              }
              onAdministrarRecordatorios={abrirModalRecordatorios}
              resumenRecordatorio={resumenRecordatorioGlucosa}
              tituloRecordatorios="Administrar mis recordatorios"
              textoProximaToma="Tu próxima medición de glucosa es en:"
            notaProximaToma="*Recuerda registrar tu glucosa constantemente"
            tituloDetalle="Última medición registrada"
            subtituloDetalle="Método de medición"
            valorDetalle={metodoUltimaLectura}
            etiquetaFechaDetalle="Fecha y hora de medición"
            ocultarDetalle={true}
          />
          <ValoresGlucosa
            esAyuno={esAyuno}
            condiciones={GlTxt.textosGenerales.condiciones}
          />
        </div>
        <div className={styles.abajo}>
          <GraficaPromedio
            esAyuno={esAyuno}
            lecturas={lecturasTotalesFiltradas}
          />
          <GraficaDistribucionGlucosa
            esAyuno={esAyuno}
            lecturas={lecturasTotalesFiltradas}
          />
          <ConfirmacionRegistro
            registro={registroConfirmado}
            onClose={() => setRegistroConfirmado(null)}
          />
        </div>
        <div className={styles.masAbajo}>
          <AlertasGlucosa color={colorAlertaActual} />
          <InformacionGlucosa />
        </div>
      </div>

        {modalAbierto && (
          <ModalRegistroGlucosa
            tipoInicial={tipoModal}
            onClose={cerrarModalCaptura}
            onConfirm={confirmarCaptura}
          />
        )}
        {modalRecordatoriosAbierto && (
          <ModalRecordatoriosPresion
            recordatorios={recordatoriosGlucosa}
            onClose={cerrarModalRecordatorios}
            onSave={guardarRecordatorioGlucosa}
            onDelete={eliminarRecordatorioGlucosa}
            onToggle={alternarRecordatorioGlucosa}
            titulo="Mis recordatorios"
            heroTitle="¡Es hora de cuidarte!"
            heroText="No olvides medir tu glucosa y registrar tu resultado. Cada medición ayuda a cuidar tu salud."
            editorCopy="Elige los días y horarios en los que quieres recibir recordatorios para medir tu glucosa."
            note="* Tus recordatorios aparecerán en la app y ahí mismo te avisaremos cuando sea hora de registrar tu glucosa."
            emptyMessage="No tienes recordatorios de glucosa configurados todavía."
            addButtonLabel="Añadir"
            saveButtonLabel="Aceptar"
            deleteButtonLabel="Eliminar recordatorio"
            idPrefix="recordatorio-glucosa"
          />
        )}
      </div>
    );
  };
export default Glucosa;
