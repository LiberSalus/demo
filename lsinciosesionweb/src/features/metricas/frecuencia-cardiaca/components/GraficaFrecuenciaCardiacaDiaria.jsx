import React, { useRef } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import styles from './GraficaFrecuenciaCardiacaDiaria.module.css'
import add from '../assets/icoAdd.svg'

const formathoraTick = (value) => String(Math.floor(value % 24)).padStart(2, '0')

const formatearHoraMinuto = (valorHoraDecimal) => {
  if (typeof valorHoraDecimal !== 'number' || Number.isNaN(valorHoraDecimal)) return '--:--'

  const minutosTotales = Math.round(valorHoraDecimal * 60)
  const hora = Math.floor((minutosTotales / 60) % 24)
  const minuto = minutosTotales % 60

  return `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length || payload[0]?.value == null) return null
  return (
    <div className={styles.tooltip}>
      {payload[0].value} ppm {formatearHoraMinuto(label)}
    </div>
  )
}

const GraficaFrecuenciaCardiacaDiaria = ({
  serieGrafica = [],
  valorDestacado = null,
  fechaActualizacionTexto = '--',
  onHoraActivaChange = () => {},
  onAgregarClick = () => {},
}) => {
  const chartScrollRef = useRef(null)

  const chartData = serieGrafica

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
  }

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h3>Frecuencia cardiaca diaria</h3>
        <div className={styles.metric}>
          <p className={styles.metricValue}>{valorDestacado ?? '--'} ppm</p>
          <p className={styles.metricLabel}>Ultima actualizacion:</p>
          <p className={styles.metricDate}>{fechaActualizacionTexto}</p>
        </div>
      </header>

      <div className={styles.axisLabel}>PPM</div>

      <div className={styles.chartWrap}>
        <div className={styles.yAxisFixed}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 14, right: 0, left: 0, bottom: 26 }}>
              <XAxis
                dataKey="hora"
                type="number"
                domain={[0, 24]}
                tick={false}
                axisLine={false}
                tickLine={false}
                height={26}
              />
              <YAxis
                className={styles.YAxis}
                domain={[0, 160]}
                ticks={[0, 20, 40, 60, 80, 100, 120, 140, 160]}
                interval={0}
                tick={{ fill: '#334155', fontSize: 10, dy: -3 }}
                axisLine={false}
                tickLine={false}
                width={46}
              />
              <Area
                type="monotone"
                dataKey="ppm"
                stroke="transparent"
                fill="transparent"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartScrollPane}>
          <div
            ref={chartScrollRef}
            className={styles.chartScroll}
            onWheel={handleChartWheel}
          >
            <div className={styles.chartInner}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 14, right: 12, left: 0, bottom: 26 }}
                  onMouseMove={(state) => {
                    const hovered = state?.activePayload?.[0]?.payload
                    if (hovered?.ppm != null) {
                      onHoraActivaChange(hovered.hora)
                    }
                  }}
                >
                  <defs>
                    <linearGradient id="afAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF0022" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#FF415A" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke="#b9d3f2" strokeDasharray="2 2" vertical={false} />
                  <XAxis
                    className={styles.XAxis}
                    dataKey="hora"
                    type="number"
                    domain={[0, 24]}
                    ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]}
                    tickFormatter={formathoraTick}
                    tick={{ fill: '#4b5563', fontSize: 8 }}
                    axisLine={{ stroke: '#a7a7a7' }}
                    tickLine={false}
                  />
                  <YAxis hide domain={[0, 160]} />

                  <ReferenceLine y={60} stroke="#58a75b" strokeDasharray="2 2" />
                  <ReferenceLine y={100} stroke="#58a75b" strokeDasharray="2 2" />
                  <ReferenceLine y={120} stroke="#d08f48" strokeDasharray="2 2" />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: '#4a88d1', strokeDasharray: '3 3' }}
                  />

                  {<Area
                    type="monotone"
                    dataKey="ppm"
                    stroke="#df5f78"
                    strokeWidth={0.1}
                    fill="url(#afAreaGradient)"
                    connectNulls={false}
                    isAnimationActive={false}
                    dot={({ cx, cy, payload }) =>
                      payload?.ppm == null ? null : (
                        <circle cx={cx} cy={cy} r={2.8} fill="#df5f78" stroke="#ffffff" strokeWidth={1.2} />
                      )
                    }
                    activeDot={{ r: 3, stroke: '#344054', strokeWidth: 2, fill: '#ffffff' }}
                  />}
                  {/* <Area
                    type="linear"
                    dataKey="avgBand"
                    stroke="#4a88d1"
                    strokeDasharray="4 3"
                    strokeWidth={2}
                    fillOpacity={0}
                    connectNulls={false}
                    dot={false}
                    activeDot={false}
                    isAnimationActive={false}
                  /> */}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.xLabel}>(Horas)</p>

      <button type="button" className={styles.addBtn} onClick={onAgregarClick}>
        <img src={add} alt="Añadir"/>
        Anadir
      </button>
    </section>
  )
}

export default GraficaFrecuenciaCardiacaDiaria
