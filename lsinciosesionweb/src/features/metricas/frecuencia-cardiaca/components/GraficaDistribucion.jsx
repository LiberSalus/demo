import React, { useMemo, useState } from 'react'
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import styles from './GraficaDistribucion.module.css'
import { registrosFrecuenciaMock } from '../mocks/datosFrecuencia.mock'
import {
  construirEscalaEjeYDistribucion,
  construirSerieDistribucion,
} from '../utils/distribucionFrecuencia.utils'
import {
  construirOpcionesFiltroReposoActividad,
  PERIODOS_REPOSO_ACTIVIDAD,
} from '../utils/reposoActividad.utils'

const GraficaDistribucion = ({
  periodoSeleccionado: periodoSeleccionadoProp,
  valorFiltro: valorFiltroProp,
  registros = registrosFrecuenciaMock,
}) => {
  const opcionesFiltro = useMemo(
    () => construirOpcionesFiltroReposoActividad(registros),
    [registros]
  )

  const [periodoInterno] = useState(PERIODOS_REPOSO_ACTIVIDAD.MES)
  const [valorFiltroInterno] = useState(
    opcionesFiltro[PERIODOS_REPOSO_ACTIVIDAD.MES]?.[0]?.valor ?? ''
  )

  const periodoSeleccionado = periodoSeleccionadoProp ?? periodoInterno
  const valorFiltro = valorFiltroProp ?? valorFiltroInterno

  const serieDistribucion = useMemo(
    () =>
      construirSerieDistribucion({
        registros,
        periodo: periodoSeleccionado,
        valorFiltro,
      }),
    [registros, periodoSeleccionado, valorFiltro]
  )

  const escalaEjeY = useMemo(
    () => construirEscalaEjeYDistribucion(serieDistribucion),
    [serieDistribucion]
  )

  return (
    <section className={styles.card}>
      
      <div className={styles.chartWrap}>
        <p className={styles.titGraf}>Histograma de dsitribución</p>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={serieDistribucion} margin={{ top: 8, right: 18, left: -18, bottom: 38 }}>
            <defs>
              <linearGradient id="rellenoDistribucion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f2d86d" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#f2d86d" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#c2c8d1" strokeDasharray="4 4" vertical={false} />
            
            <XAxis
              dataKey="etiquetaX"
              tick={{ fill: '#364152', fontSize: 8 }}
              axisLine={{ stroke: '#a6a8ac' }}
              tickLine={false}
              interval={0}
              angle={-90}
              textAnchor="end"
              height={72}
              className={styles.XAxis}
            />

            <YAxis
              domain={escalaEjeY.dominio}
              ticks={escalaEjeY.ticks}
              tick={{ fill: '#364152', fontSize: 8 }}
              axisLine={false}
              tickLine={false}
            />

            <Area
              type="monotone"
              dataKey="cantidad"
              stroke="transparent"
              fill="url(#rellenoDistribucion)"
              fillOpacity={1}
              isAnimationActive={false}
            />

            <Bar
              dataKey="cantidad"
              radius={[999, 999, 0, 0]}
              barSize={22}
              isAnimationActive
              animationDuration={350}
              animationEasing="ease-out"
            >
              {serieDistribucion.map((item) => (
                <Cell key={item.etiquetaX} fill={item.color} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <p className={styles.etiquetaEjeY}>Número de mediciones</p>
      <p className={styles.etiquetaEjeX}>Rango de Frecuencia Cardiaca</p>

      <p className={styles.descripcion}>
        Distribución de mediciones por rangos para identificar concentraciones y variaciones en la frecuencia cardiaca.
      </p>
    </section>
  )
}

export default GraficaDistribucion
