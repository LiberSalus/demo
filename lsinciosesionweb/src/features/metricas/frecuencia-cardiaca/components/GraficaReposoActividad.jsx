import React, { useEffect, useMemo, useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import styles from './GraficaReposoActividad.module.css'
import { registrosFrecuenciaMock } from '../mocks/datosFrecuencia.mock'
import {
  construirOpcionesFiltroReposoActividad,
  construirSerieReposoActividad,
  PERIODOS_REPOSO_ACTIVIDAD,
} from '../utils/reposoActividad.utils'

const PERIODOS_UI = [
  { valor: PERIODOS_REPOSO_ACTIVIDAD.SEMANA, etiqueta: 'Semana' },
  { valor: PERIODOS_REPOSO_ACTIVIDAD.MES, etiqueta: 'Mes' },
  { valor: PERIODOS_REPOSO_ACTIVIDAD.ANIO, etiqueta: 'Año' },
]

const TICKS_EJE_Y = [40, 60, 80, 100, 120, 140, 160]

const PuntoGrafica = ({ cx, cy, stroke, fill }) => {
  if (!Number.isFinite(cx) || !Number.isFinite(cy)) return null

  return (
    <circle
      cx={cx}
      cy={cy}
      r={1.7}
      fill={fill}
      stroke={stroke}
      strokeWidth={1.25}
    />
  )
}

const GraficaReposoActividad = ({
  periodoSeleccionado: periodoSeleccionadoProp,
  valorFiltro: valorFiltroProp,
  onPeriodoChange,
  onFiltroChange,
  registros = registrosFrecuenciaMock,
}) => {
  const [periodoInterno, setPeriodoInterno] = useState(
    PERIODOS_REPOSO_ACTIVIDAD.MES
  )

  const opcionesFiltro = useMemo(
    () => construirOpcionesFiltroReposoActividad(registros),
    [registros]
  )

  const [valorFiltroInterno, setValorFiltroInterno] = useState(
    opcionesFiltro[PERIODOS_REPOSO_ACTIVIDAD.MES]?.[0]?.valor ?? ''
  )

  const periodoSeleccionado = periodoSeleccionadoProp ?? periodoInterno
  const valorFiltro = valorFiltroProp ?? valorFiltroInterno

  // Mantiene estable la lista de filtros disponibles para el periodo activo.
  const opcionesFiltroActuales = useMemo(
    () => opcionesFiltro[periodoSeleccionado] ?? [],
    [opcionesFiltro, periodoSeleccionado]
  )

  const serieGrafica = useMemo(
    () =>
      construirSerieReposoActividad({
        registros,
        periodo: periodoSeleccionado,
        valorFiltro,
      }),
    [registros, periodoSeleccionado, valorFiltro]
  )

  const tituloEjeX =
    periodoSeleccionado === PERIODOS_REPOSO_ACTIVIDAD.ANIO ? 'Meses' : 'Días'

  useEffect(() => {
    const filtroVigente = opcionesFiltroActuales.some((opcion) => opcion.valor === valorFiltro)

    if (!filtroVigente) {
      const siguienteFiltro = opcionesFiltroActuales[0]?.valor ?? ''

      if (onFiltroChange) {
        onFiltroChange(siguienteFiltro)
      } else {
        setValorFiltroInterno(siguienteFiltro)
      }
    }
  }, [onFiltroChange, opcionesFiltroActuales, valorFiltro])

  return (
    <section className={styles.card}>
      <h3>Comparativa Reposo vs Actividad</h3>

      <div className={styles.periodos}>
        {PERIODOS_UI.map((periodo) => (
          <button
            key={periodo.valor}
            type="button"
            className={
              periodoSeleccionado === periodo.valor ? styles.periodoActivo : styles.periodo
            }
            onClick={() => {
              if (onPeriodoChange) {
                onPeriodoChange(periodo.valor)
              } else {
                setPeriodoInterno(periodo.valor)
              }
            }}
          >
            {periodo.etiqueta}
          </button>
        ))}
      </div>

      <div className={styles.leyenda}>
        <div className={styles.leyendaItem}>
          <span className={styles.puntoLeyendaReposo} />
          <span>FC en Reposo</span>
        </div>

        <div className={styles.leyendaItem}>
          <span className={styles.puntoLeyendaActividad} />
          <span>FC en Actividad</span>
        </div>
      </div>

      <div className={styles.ejeYTitulo}>PPM</div>

      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={serieGrafica} margin={{ top: 10, right: 10, left: -8, bottom: 20 }} className={styles.ComposedChart}>
            <defs>
              <linearGradient id="rellenoReposo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#70b2ef" stopOpacity={0.26} />
                <stop offset="100%" stopColor="#70b2ef" stopOpacity={0.08} />
              </linearGradient>
              <linearGradient id="rellenoActividad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e7a836" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#e7a836" stopOpacity={0.06} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#c2c8d1" strokeDasharray="4 4" vertical={false} />

            <XAxis
              dataKey="etiquetaX"
              tick={{ fill: '#364152', fontSize: 11 }}
              axisLine={{ stroke: '#a6a8ac' }}
              tickLine={false}
              interval={periodoSeleccionado === PERIODOS_REPOSO_ACTIVIDAD.MES ? 4 : 0}
              className={styles.XAxis}
            />

            <YAxis
              domain={[40, 160]}
              ticks={TICKS_EJE_Y}
              tick={{ fill: '#364152', fontSize: 8 }}
              axisLine={false}
              tickLine={false}
              className={styles.YAxis}
            />

            <ReferenceLine y={60} stroke="#58a75b" strokeDasharray="2 2" />
            <ReferenceLine y={100} stroke="#58a75b" strokeDasharray="2 2" />
            <ReferenceLine y={120} stroke="#d08f48" strokeDasharray="2 2" />

            <Area
              type="monotone"
              dataKey="fcActividad"
              stroke="transparent"
              fill="url(#rellenoActividad)"
              fillOpacity={1}
              isAnimationActive={false}
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="fcReposo"
              stroke="transparent"
              fill="url(#rellenoReposo)"
              fillOpacity={1}
              isAnimationActive={false}
              connectNulls={false}
            />

            <Line
              type="monotone"
              dataKey="fcReposo"
              stroke="#67aef0"
              strokeWidth={1.5}
              dot={<PuntoGrafica stroke="#67aef0"  fill="#67aef0"  />}
              activeDot={false}
              connectNulls={false}
              isAnimationActive
              animationDuration={350}
              animationEasing="ease-out"
            />

            <Line
              type="monotone"
              dataKey="fcActividad"
              stroke="#e5a332"
              strokeWidth={1.5}
              dot={<PuntoGrafica stroke="#e5a332" fill="#e5a332" />}
              activeDot={false}
              connectNulls={false}
              isAnimationActive
              animationDuration={350}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className={styles.ejeXTitulo}>{tituloEjeX}</p>

      <div className={styles.filtroInferior}>
        <select
          value={valorFiltro}
          onChange={(evento) => {
            if (onFiltroChange) {
              onFiltroChange(evento.target.value)
            } else {
              setValorFiltroInterno(evento.target.value)
            }
          }}
        >
          {opcionesFiltroActuales.length ? (
            opcionesFiltroActuales.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))
          ) : (
            <option value="">Sin opciones</option>
          )}
        </select>
      </div>
    </section>
  )
}

export default GraficaReposoActividad
