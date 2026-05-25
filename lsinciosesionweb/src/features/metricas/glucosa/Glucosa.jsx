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
  DataGlucosaContrato,
  DataGlucosaDiariaContrato,
} from "./dataGlucosa";
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
  AreaChart,
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

// Lee el contrato diario guardado de glucosa sin bloquear la vista si hay datos invalidos.
const leerContratoGlucosaGuardado = () => {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_STORAGE_GLUCOSA_DIA);
    const estadoGuardado = textoGuardado ? JSON.parse(textoGuardado) : null;
    return estadoGuardado?.medicionesPorFiltro ? estadoGuardado : null;
  } catch {
    return null;
  }
};

const crearClaveFecha = (fecha) => {
  const year = fecha.getFullYear();
  const month = `${fecha.getMonth() + 1}`.padStart(2, "0");
  const day = `${fecha.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
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

const UltimoValorGlucosa = ({ esAyuno }) => {
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
              <div className={styles.ulbg}></div>
              <p className={styles.ulcondicion}>Hiperglusemia crítica</p>
            </div>
          </div>
          <p className={styles.ulvalor}>75 {GlTxt.textosGenerales.unidad}</p>
          <div className={styles.ulCntfcha}>
            <p className={styles.ulfcha}>13 - abril - 2026</p>
            <p className={styles.ulhora}>08:55 am</p>
          </div>
        </div>

        <div className={styles.ulabajo}>
          <div className={styles.ulcntAnterior}>
            <p className={styles.ultxtAnterior}>
              {GlTxt.CompUltimoValor.anterior}
            </p>
            <div className={styles.ulbgcondicion}>
              <div className={styles.ulbg}></div>
              <p className={styles.ulcondicion}>Hiperglusemia crítica</p>
            </div>
          </div>
          <p className={styles.ulvalor}>75 {GlTxt.textosGenerales.unidad}</p>
          <div className={styles.ulCntfcha}>
            <p className={styles.ulfcha}>13 - abril - 2026</p>
            <p className={styles.ulhora}>08:55 am</p>
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
//pinta grafica promedio
const GraficaPromedio = ({ esAyuno }) => {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("semana");
  const [etiquetaActiva, setEtiquetaActiva] = useState(null);

  const bloqueInicial = DataGlucosaContrato.semana;
  const [valorFiltro, setValorFiltro] = useState(
    bloqueInicial?.seleccionActual ?? bloqueInicial?.filtros?.[0]?.value ?? "",
  );

  const bloquePeriodo = DataGlucosaContrato[periodoSeleccionado];
  const filtrosPeriodo = bloquePeriodo?.filtros ?? [];

  const puntosPeriodo =
    bloquePeriodo?.seriesPorFiltro?.[valorFiltro]?.puntos ?? [];

  const datosFiltrados = puntosPeriodo.filter((item) =>
    esAyuno
      ? item.tipo === "ayuno"
      : TIPOS_POSTPRANDIAL.includes(item.tipo),
  );

  const opcionesFiltro = filtrosPeriodo.map((item) => ({
    label: item.label,
    value: item.value,
  }));

  const cambiarPeriodo = (periodo) => {
    const siguienteBloque = DataGlucosaContrato[periodo];
    if (!siguienteBloque) return;

    setPeriodoSeleccionado(periodo);
    setValorFiltro(
      siguienteBloque?.seleccionActual ??
        siguienteBloque?.filtros?.[0]?.value ??
        "",
    );
  };

  const prGlSelect = {
    contenedor: styles.glSelectControl,
    botonMain: styles.glSelectBoton,
    panelOpciones: styles.glSelectPanel,
    opcion: styles.glSelectOpcion,
  };

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
        <Boton
          variant="grafica"
          forma="redondo"
          isLoading={false}
          onClick={() => cambiarPeriodo("semana")}
        >
          {graficaPr.botones[0]}
        </Boton>
        <Boton
          variant="grafica"
          forma="redondo"
          isLoading={false}
          onClick={() => cambiarPeriodo("mes")}
        >
          {graficaPr.botones[1]}
        </Boton>
        <Boton
          variant="grafica"
          forma="redondo"
          isLoading={false}
          onClick={() => cambiarPeriodo("ano")}
        >
          {graficaPr.botones[2]}
        </Boton>
      </div>
      <div className={styles.glPromedioChart}>
        <p className={styles.labelY}>{graficaPr.unidad}</p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={datosFiltrados}
            margin={{ top: 28, right: 8, left: 30, bottom: 13 }}
          >
            <defs>
              <linearGradient id="gradiente" x1="0" y1="0" x2="0" y2="1">
                <stop offset="15%" stopColor="#f8aa3d" stopOpacity="0.8"></stop>
                <stop offset="95%" stopColor="#f8aa3d" stopOpacity="0.10"></stop>
              </linearGradient>
            </defs>
            <Area
              type="linear"
              dataKey="toma"
              stroke="#f8a83a"
              fill="url(#gradiente)"
            />
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="etiqueta"
              axisLine={true}
              tickLine={false}
              height={42}
              tickMargin={10}
              tick={{ dy: 5, fill: "#4B5563", fontSize: 12 }}
              label={{
                value: periodoSeleccionado === "ano" ? "Meses" : "Días",
                position: "insideBottom",
                offset: -10,
                fill: "#B5B5B5",
              }}
            />
            <YAxis
              domain={[
                (dataMin) => Math.min(60, Math.floor((dataMin - 20) / 10) * 10),
                (dataMax) => Math.max(140, Math.ceil((dataMax + 20) / 10) * 10),
              ]}
              axisLine={false}
              tickLine={false}
              ticks={[60, 70, 80, 90, 100, 110, 120, 130, 140]}
              width={40}
              tickMargin={8}
              tick={{ dy: -3, fill: "#4B5563", fontSize: 12 }}
            />
            <Tooltip
              content={TooltipGlucosa}
              cursor={true}
              onMouseMove={(state) => {
                if (state?.activeLabel) {
                  setEtiquetaActiva(state.activeLabel);
                }
              }}
            />
            <ReferenceLine
              x={etiquetaActiva}
              stroke="#7D8AA5"
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.glSelectfecha}>
        <InpSelect
          opciones={opcionesFiltro}
          value={valorFiltro}
          onChange={setValorFiltro}
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
    () => leerContratoGlucosaGuardado() ?? DataGlucosaDiariaContrato
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
          <UltimoValorGlucosa esAyuno={esAyuno} />
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
          <GraficaPromedio esAyuno={esAyuno} />
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
