import React, { useEffect, useMemo, useState } from "react";
import styles from "./Oxigenacion.module.css";
import * as OxTxt from "./providersOxigenacion.js";
import {
  datosOxigenacionDiaria,
  histogramaOxigenacion,
  promedioOxigenacion,
  resumenOxigenacion,
} from "./dataOxigenacion.js";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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

// Lee registros guardados de oxigenacion sin romper la pantalla si el storage falla.
const leerRegistrosOxigenacionGuardados = () => {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_STORAGE_OXIGENACION_DIA);
    const estadoGuardado = textoGuardado ? JSON.parse(textoGuardado) : null;
    return Array.isArray(estadoGuardado?.registrosDelDia)
      ? estadoGuardado.registrosDelDia
      : null;
  } catch {
    return null;
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
  const registrosGuardados = leerRegistrosOxigenacionGuardados();
  if (registrosGuardados) return registrosGuardados;

  const base = new Date();

  return datosOxigenacionDiaria.map((item, index) => {
    const fecha = new Date(base);
    fecha.setHours(Number(item.hora), index % 2 === 0 ? 0 : 25, 0, 0);

    return {
      id: `spo2-inicial-${item.hora}-${index}`,
      valor: item.valor,
      contexto: "noEspecificado",
      sentir: "bien",
      fechaHoraISO: fecha.toISOString(),
    };
  });
};

const construirPuntosDiarios = (registros) =>
  [...registros]
    .sort((a, b) => new Date(a.fechaHoraISO) - new Date(b.fechaHoraISO))
    .map((registro) => {
      const fecha = new Date(registro.fechaHoraISO);
      const horaDecimal =
        fecha.getHours() + fecha.getMinutes() / 60 + fecha.getSeconds() / 3600;
      return {
        hora: String(fecha.getHours()).padStart(2, "0"),
        horaDecimal,
        horaTooltip: formatearHoraCorta(fecha),
        valor: registro.valor,
        fechaHoraISO: registro.fechaHoraISO,
      };
    });

const LIMITE_MIN_PROMEDIO = 88;
const LIMITE_MAX_PROMEDIO = 100;

const construirPuntosPromedio = (puntos) =>
  puntos.map((item) => {
    const valorMin = Math.max(LIMITE_MIN_PROMEDIO, item.valorMin);
    const valorMax = Math.min(LIMITE_MAX_PROMEDIO, item.valorMax);
    return {
      ...item,
      base: valorMin - LIMITE_MIN_PROMEDIO,
      rango: Math.max(valorMax - valorMin, 0.35),
    };
  });

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

const BarraRangoPromedio = ({ x, y, width, height, fill }) => {
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
                domain={[86, 100]}
                axisLine={false}
                tickLine={false}
                ticks={[86, 88, 90, 92, 94, 96, 98, 100]}
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
              stroke="transparent"
              strokeWidth={2}
              fill="url(#rellenoOxigenacionDiaria)"
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
const TarjetaRangoOxigenacion = () => (
  <div className={styles.tarjetaRango}>
    <div className={styles.bloqueRangoTexto}>
      <p className={styles.rangoTitulo}>{OxTxt.tarjetaRango.titulo}</p>
      <p className={styles.rangoValor}>
        {resumenOxigenacion.rangoDiario.minimo}-{resumenOxigenacion.rangoDiario.maximo}{" "}
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

const TarjetaPromedioOxigenacion = () => {
  const periodos = ["semana", "mes", "anio"];
  const [periodoActivo, setPeriodoActivo] = useState("semana");
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState({
    semana: promedioOxigenacion.semana.seleccionActual,
    mes: promedioOxigenacion.mes.seleccionActual,
    anio: promedioOxigenacion.anio.seleccionActual,
  });

  const bloqueActivo = promedioOxigenacion[periodoActivo];
  const puntos = useMemo(
    () => construirPuntosPromedio(bloqueActivo.puntos),
    [bloqueActivo],
  );

  const etiquetaEjeX = periodoActivo === "anio" ? "Meses" : "Días";

  return (
    <div className={styles.tarjetaPromedio}>
      <h3 className={styles.tituloSecundario}>{OxTxt.graficaPromedio.titulo}</h3>

      <div className={styles.navegacionPromedio}>
        {periodos.map((periodo, index) => {
          const activo = periodoActivo === periodo;
          return (
            <button
              key={periodo}
              type="button"
              className={activo ? styles.chipPeriodoActivo : styles.chipPeriodo}
              onClick={() => setPeriodoActivo(periodo)}
            >
              {OxTxt.graficaPromedio.botones[index]}
            </button>
          );
        })}
      </div>

      <span className={styles.etiquetaUnidadPromedio}>{OxTxt.textosGenerales.unidad}</span>

      <div className={styles.graficaPromedioBase}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={puntos}
            margin={{ top: 10, right: 6, left: 6, bottom: 22 }}
            barCategoryGap="36%"
          >
            <CartesianGrid
              vertical={false}
              stroke="#c9cfdb"
              strokeDasharray="8 8"
              strokeWidth={1.5}
            />
            <XAxis
              dataKey="etiqueta"
              axisLine={true}
              tickLine={false}
              tick={{ fill: "#3f4b63", fontSize: 12, fontWeight: 500 }}
              tickMargin={14}
              label={{
                value: etiquetaEjeX,
                position: "insideBottom",
                offset: -18,
                fill: "#c1c1c1",
              }}
            />
            <YAxis
              domain={[0, LIMITE_MAX_PROMEDIO - LIMITE_MIN_PROMEDIO]}
              ticks={[0, 2, 4, 6, 8, 10, 12]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#3f4b63", fontSize: 14 }}
              tickMargin={12}
              width={54}
              tickFormatter={(valor) => `${valor + LIMITE_MIN_PROMEDIO}%`}
            />
            <Tooltip cursor={false} content={<TooltipPromedioOxigenacion />} />
            {<Bar dataKey="base" stackId="promedio" fill="transparent" isAnimationActive={false} />}
            {<Bar
              dataKey="rango"
              stackId="promedio"
              fill="#6ed3f7"
              shape={(props) => <BarraRangoPromedio {...props} />}
              isAnimationActive={false}
            />}
          </BarChart>
        </ResponsiveContainer>
      </div>

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
          {bloqueActivo.filtros.map((filtro) => (
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
      valor: ultimoRegistro?.valor ?? resumenOxigenacion.actual.valor,
      fecha: ultimoRegistro
        ? formatearFechaHora(new Date(ultimoRegistro.fechaHoraISO))
        : resumenOxigenacion.actual.fecha,
    }),
    [ultimoRegistro],
  );
  const colorAlertaActual = useMemo(
    () => obtenerColorAlertaOxigenacion(ultimoRegistro?.valor ?? resumenOxigenacion.actual.valor),
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
          <TarjetaRangoOxigenacion />
          <TarjetaValoresOxigenacion />
          <TarjetaUltimoValorOxigenacion
            ultimoRegistro={ultimoRegistro}
            valorAnterior={valorAnterior}
          />
        </div>

        <div className={styles.abajo}>
          <TarjetaPromedioOxigenacion />
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
