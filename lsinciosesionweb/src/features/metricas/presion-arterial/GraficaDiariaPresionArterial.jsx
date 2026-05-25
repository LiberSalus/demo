import { useEffect, useRef, useState } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import styles from './PresionArterial.module.css'

const TICKS_HORAS = Array.from({ length: 24 }, (_, hora) => hora)
const TICKS_EJE_Y = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180]
const BAR_SIZE = 20
const BAR_VISIBLE_WIDTH = 14
const BAR_RADIUS = 8

const formatearHoraTick = (valor) => String(Math.floor(valor % 24)).padStart(2, '0')

const TickXAxisPresion = ({ x, y, payload, visibleEvery = 1 }) => {
  if (typeof x !== 'number' || typeof y !== 'number') return null

  const valor = Number(payload?.value ?? 0)
  if (visibleEvery > 1 && valor % visibleEvery !== 0) {
    return null
  }

  return (
    <text
      x={x}
      y={y}
      dy={10}
      textAnchor="middle"
      fill="#475569"
      fontSize="12"
    >
      {formatearHoraTick(valor)}
    </text>
  )
}

const formatearHoraMinuto = (valorHoraDecimal) => {
  if (typeof valorHoraDecimal !== 'number' || Number.isNaN(valorHoraDecimal)) return '--:--'

  const minutosTotales = Math.round(valorHoraDecimal * 60)
  const hora = Math.floor((minutosTotales / 60) % 24)
  const minuto = minutosTotales % 60

  return `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`
}

const construirEscalaHoras = (serie = []) => {
  const horas = serie
    .map((item) => Number(item?.hora))
    .filter((valor) => Number.isFinite(valor))

  if (!horas.length) {
    return {
      dominio: [0, 24],
      ticks: TICKS_HORAS,
    }
  }

  const minimoBase = Math.floor(Math.min(...horas))
  const maximoBase = Math.ceil(Math.max(...horas))
  const minimo = Math.max(0, minimoBase - 2)
  const maximo = Math.min(24, Math.max(maximoBase + 1, minimo + 6))
  const ticks = []

  for (let hora = minimo; hora <= maximo; hora += 1) {
    ticks.push(hora)
  }

  return {
    dominio: [minimo, maximo],
    ticks,
  }
}

const TooltipPresion = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  const base = payload.find((item) => item.dataKey === 'base')?.value
  const rango = payload.find((item) => item.dataKey === 'rango')?.value
  const sistolica = base != null && rango != null ? base + rango : null

  if (base == null || sistolica == null) return null

  return (
    <div className={styles.chartTooltip}>
      <p className={styles.chartTooltipTitle}>{formatearHoraMinuto(label)} hrs</p>
      <p>Sistólica: {sistolica} mmHg</p>
      <p>Diastólica: {base} mmHg</p>
    </div>
  )
}

const BarraRangoFija = (props) => {
  const { fill, x, y, width, height } = props

  if (
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    typeof width !== 'number' ||
    typeof height !== 'number' ||
    height <= 0
  ) {
    return null
  }

  const xAjustada = x + (width - BAR_VISIBLE_WIDTH) / 2
  const radio = Math.min(BAR_RADIUS, BAR_VISIBLE_WIDTH / 2, Math.max(height / 2.4, 0))

  return (
    <rect
      x={xAjustada}
      y={y}
      width={BAR_VISIBLE_WIDTH}
      height={height}
      rx={radio}
      ry={radio}
      fill={fill}
    />
  )
}

const GraficaDiariaPresionArterial = ({
  serieGrafica = [],
  fechaActualizacionTexto = '--',
}) => {
  const chartScrollRef = useRef(null)
  const [zoom, setZoom] = useState(1)
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1280 : window.innerWidth
  )

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const handleResize = () => setViewportWidth(window.innerWidth)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const chartBaseWidth =
    viewportWidth <= 360 ? 390 : viewportWidth <= 440 ? 460 : viewportWidth <= 768 ? 620 : 720
  const chartMinWidth = Math.round(chartBaseWidth * zoom)
  const escalaHoras = construirEscalaHoras(serieGrafica)

  const handleChartWheel = (event) => {
    const container = chartScrollRef.current
    if (!container) return

    const delta =
      Math.abs(event.deltaY) > Math.abs(event.deltaX)
        ? event.deltaY
        : event.deltaX

    if (delta === 0) return

    container.scrollLeft += delta
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <section className={styles.chartCard}>
      <header className={styles.chartHeader}>
        <div className={styles.chartInfo}>
          <h3>Presión Arterial</h3>
          <p>Última actualización: {fechaActualizacionTexto}</p>
        </div>

        <div className={styles.chartHeaderSide}>
          <div className={styles.chartLegend}>
            <p><span className={styles.bolita}></span>Sistólica</p>
            <p><span className={styles.bolita}></span>Diastólica</p>
          </div>

          <div className={styles.chartZoom} style={{display:"none"}}>
            <button
              type="button"
              onClick={() => setZoom((valorActual) => Math.max(1, Number((valorActual - 0.5).toFixed(1))))}
            >
              -
            </button>
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
            <button
              type="button"
              onClick={() => setZoom((valorActual) => Math.min(4, Number((valorActual + 0.5).toFixed(1))))}
            >
              +
            </button>
            <span>{zoom.toFixed(1)}x</span>
          </div>
        </div>
      </header>

      <div className={styles.chartWrap}>
        <p className={styles.mmhg}>mmHg</p>
        <div className={styles.chartBody}>
          <div className={styles.chartYAxis}>
            {TICKS_EJE_Y.slice().reverse().map((tick) => (
              <span key={tick} className={styles.chartYAxisTick}>
                {tick}
              </span>
            ))}
          </div>

          <div className={styles.chartScrollPane}>
          <div
            ref={chartScrollRef}
            className={styles.chartScroll}
            onWheel={handleChartWheel}
          >
            <div
              className={styles.chartInner}
              style={{ minWidth: `${chartMinWidth}px` }}
            >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={serieGrafica} margin={{ top: 12, right: 12, left: 0, bottom: 8 }}>
                    <defs>
                      <linearGradient id="presionRangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#007CBA" />
                        <stop offset="100%" stopColor="#00B7C8" />
                      </linearGradient>
                    </defs>

                    <CartesianGrid stroke="#d9e2ec" strokeDasharray="3 3" vertical={false} />

                    <XAxis
                      dataKey="hora"
                      type="number"
                      domain={escalaHoras.dominio}
                      ticks={escalaHoras.ticks}
                      tick={<TickXAxisPresion visibleEvery={1} />}
                      axisLine={false}
                      tickLine={false}
                      tickMargin={4}
                    />

                    <YAxis
                      domain={[0, 180]}
                      ticks={TICKS_EJE_Y}
                      tick={false}
                      axisLine={false}
                      tickLine={false}
                      width={1}
                    />

                    <Tooltip content={<TooltipPresion />} cursor={{ stroke: '#94a3b8', strokeDasharray: '3 3' }} />

                    <ReferenceLine y={140} stroke="#d62828" strokeDasharray="3 3" />
                    <ReferenceLine y={120} stroke="#2f9e44" strokeDasharray="3 3" />
                    <ReferenceLine y={80} stroke="#2f9e44" strokeDasharray="3 3" />

                    <Bar
                      dataKey="base"
                      stackId="presion"
                      fill="transparent"
                      stroke="transparent"
                      isAnimationActive={false}
                      legendType="none"
                      barSize={BAR_SIZE}
                    />

                    <Bar
                      dataKey="rango"
                      stackId="presion"
                      fill="url(#presionRangeGradient)"
                      radius={[999, 999, 999, 999]}
                      isAnimationActive={false}
                      barSize={BAR_SIZE}
                      shape={<BarraRangoFija />}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <p className={styles.horas}>(Horas)</p>
      </div>
    </section>
  )
}

export default GraficaDiariaPresionArterial
