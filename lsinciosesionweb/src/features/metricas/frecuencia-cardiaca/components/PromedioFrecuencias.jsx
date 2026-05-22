import React, { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import styles from './PromedioFrecuencias.module.css'
import { PERIODOS_PROMEDIO } from '../utils/promedioFrecuencias.utils'

const PERIODOS_UI = [
  { valor: PERIODOS_PROMEDIO.SEMANA, etiqueta: 'Semana' },
  { valor: PERIODOS_PROMEDIO.MES, etiqueta: 'Mes' },
  { valor: PERIODOS_PROMEDIO.ANIO, etiqueta: 'Año' },
]

const PASO_TICK_Y = 10
const TOLERANCIA_Y = 10
const ESCALA_FALLBACK = {
  dominio: [40, 160],
  ticks: [40, 60, 80, 100, 120, 140, 160],
}

const redondearHaciaAbajo = (valor, paso) => Math.floor(valor / paso) * paso
const redondearHaciaArriba = (valor, paso) => Math.ceil(valor / paso) * paso

const PromedioFrecuencias = ({
  periodoSeleccionado,
  opcionesFiltro,
  valorFiltro,
  serie,
  onPeriodoChange,
  onFiltroChange,
}) => {
  const tituloEjeX =
    periodoSeleccionado === PERIODOS_PROMEDIO.ANIO ? 'Meses' : 'Días'

  const datosGrafica = useMemo(
    () =>
      serie.map((item) => ({
        ...item,
        // Normalizamos por si minimo/maximo llegan como string desde mocks/back.
        base: (() => {
          const minimo = Number(item.minimo)
          const maximo = Number(item.maximo)
          if (!Number.isFinite(minimo) || !Number.isFinite(maximo)) return null
          if (minimo <= 0 || maximo <= 0 || maximo < minimo) return null
          return minimo
        })(),
        rango: (() => {
          const minimo = Number(item.minimo)
          const maximo = Number(item.maximo)
          if (!Number.isFinite(minimo) || !Number.isFinite(maximo)) return null
          if (minimo <= 0 || maximo <= 0 || maximo < minimo) return null
          return Math.max(maximo - minimo, 1)
        })(),
      })),
    [serie]
  )

  // Ajuste dinamico del eje Y segun el rango real de lecturas visibles.
  const escalaEjeY = useMemo(() => {
    const minimos = datosGrafica
      .map((item) => item.base)
      .filter((valor) => Number.isFinite(valor))
    const maximos = datosGrafica
      .map((item) =>
        Number.isFinite(item.base) && Number.isFinite(item.rango)
          ? item.base + item.rango
          : null
      )
      .filter((valor) => Number.isFinite(valor))

    if (!minimos.length || !maximos.length) return ESCALA_FALLBACK

    const minimoSerie = Math.min(...minimos)
    const maximoSerie = Math.max(...maximos)
    const yMin = redondearHaciaAbajo(minimoSerie - TOLERANCIA_Y, PASO_TICK_Y)
    const yMax = redondearHaciaArriba(maximoSerie + TOLERANCIA_Y, PASO_TICK_Y)

    if (!Number.isFinite(yMin) || !Number.isFinite(yMax) || yMin >= yMax) {
      return ESCALA_FALLBACK
    }

    const ticks = []
    for (let valor = yMin; valor <= yMax; valor += PASO_TICK_Y) {
      ticks.push(valor)
    }

    return {
      dominio: [yMin, yMax],
      ticks,
    }
  }, [datosGrafica])

  return (
    <section className={styles.card}>
      <h3>Promedio Frecuencia cardiaca</h3>

      <div className={styles.periodos}>
        {PERIODOS_UI.map((periodo) => (
          <button
            key={periodo.valor}
            type="button"
            className={
              periodoSeleccionado === periodo.valor ? styles.periodoActivo : styles.periodo
            }
            onClick={() => onPeriodoChange(periodo.valor)}
          >
            {periodo.etiqueta}
          </button>
        ))}
      </div>

      <div className={styles.ejeYTitulo}>PPM</div>

      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datosGrafica} margin={{ top: 8, right: 10, left: -16, bottom: 18 }}>
            <CartesianGrid stroke="#b5bcc6" strokeDasharray="4 4" vertical={false} />
            <XAxis
              className={styles.XAxis}
              dataKey="etiquetaX"
              tick={{ fill: '#364152', fontSize: 12 }}
              axisLine={{ stroke: '#a6a8ac' }}
              tickLine={false}
            />
            <YAxis
              className={styles.YAxis}
              domain={escalaEjeY.dominio}
              ticks={escalaEjeY.ticks}
              tick={{ fill: '#364152', fontSize: 8 }}
              axisLine={false}
              tickLine={false}
            />

            <ReferenceLine y={60} stroke="#58a75b" strokeDasharray="2 2" />
            <ReferenceLine y={100} stroke="#58a75b" strokeDasharray="2 2" />
            <ReferenceLine y={120} stroke="#d08f48" strokeDasharray="2 2" />

            <Bar dataKey="base" stackId="rango" fill="transparent" isAnimationActive={false} />
            <Bar
              dataKey="rango"
              stackId="rango"
              fill="#de4861"
              radius={[99, 99, 99, 99]}
              maxBarSize={6}
              isAnimationActive
              animationDuration={350}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className={styles.ejeXTitulo}>{tituloEjeX}</p>

      <div className={styles.filtroInferior}>
        <select
          value={valorFiltro}
          onChange={(evento) => onFiltroChange(evento.target.value)}
        >
          {opcionesFiltro.length ? (
            opcionesFiltro.map((opcion) => (
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

export default PromedioFrecuencias
