import { PERIODOS_REPOSO_ACTIVIDAD } from './reposoActividad.utils'

export const RANGOS_DISTRIBUCION = [
  { etiquetaX: '40-60 ppm', minimo: 40, maximo: 60, color: '#df4a58' },
  { etiquetaX: '60-80 ppm', minimo: 60, maximo: 80, color: '#8bb64d' },
  { etiquetaX: '80-100 ppm', minimo: 80, maximo: 100, color: '#8bb64d' },
  { etiquetaX: '100-120 ppm', minimo: 100, maximo: 120, color: '#eba933' },
  { etiquetaX: '120-140 ppm', minimo: 120, maximo: 140, color: '#eba933' },
  { etiquetaX: '140-160 ppm', minimo: 140, maximo: 160, color: '#df4a58' },
  { etiquetaX: '160-180 ppm', minimo: 160, maximo: 180, color: '#df4a58' },
  { etiquetaX: '180-200 ppm', minimo: 180, maximo: 200, color: '#df4a58' },
  { etiquetaX: '200-220 ppm', minimo: 200, maximo: 220, color: '#df4a58' },
]

const convertirAFechaLocal = (fechaISO) => new Date(`${fechaISO}T00:00:00`)

const obtenerFinSemanaDomingo = (inicioSemana) => {
  const fin = new Date(inicioSemana)
  fin.setDate(fin.getDate() + 6)
  fin.setHours(23, 59, 59, 999)
  return fin
}

const obtenerRegistrosDelPeriodo = ({ registros, periodo, valorFiltro }) => {
  if (!valorFiltro) return []

  if (periodo === PERIODOS_REPOSO_ACTIVIDAD.SEMANA) {
    const inicioSemana = convertirAFechaLocal(valorFiltro)
    const finSemana = obtenerFinSemanaDomingo(inicioSemana)

    return registros.filter((registro) => {
      const fecha = convertirAFechaLocal(registro.fecha)
      return fecha >= inicioSemana && fecha <= finSemana
    })
  }

  if (periodo === PERIODOS_REPOSO_ACTIVIDAD.MES) {
    return registros.filter((registro) => registro.fecha.startsWith(valorFiltro))
  }

  return registros.filter((registro) => registro.fecha.startsWith(`${valorFiltro}-`))
}

const extraerLecturas = (registrosDelPeriodo) =>
  registrosDelPeriodo.flatMap((registro) => {
    const lecturas = [Number(registro.fcReposo), Number(registro.fcActividad)]
    return lecturas.filter((lectura) => Number.isFinite(lectura) && lectura > 0)
  })

const perteneceARango = (lectura, minimo, maximo) => {
  if (lectura == null) return false
  if (maximo === 220) return lectura >= minimo && lectura <= maximo
  return lectura >= minimo && lectura < maximo
}

export const construirSerieDistribucion = ({ registros, periodo, valorFiltro }) => {
  const registrosDelPeriodo = obtenerRegistrosDelPeriodo({ registros, periodo, valorFiltro })
  const lecturas = extraerLecturas(registrosDelPeriodo)

  return RANGOS_DISTRIBUCION.map((rango) => {
    const cantidad = lecturas.filter((lectura) =>
      perteneceARango(lectura, rango.minimo, rango.maximo)
    ).length

    return {
      ...rango,
      cantidad,
    }
  })
}

const obtenerPasoTicks = (maximoConteo) => {
  if (maximoConteo <= 10) return 2
  if (maximoConteo <= 30) return 5
  if (maximoConteo <= 60) return 10
  return 20
}

export const construirEscalaEjeYDistribucion = (serie) => {
  const maximoConteo = Math.max(...serie.map((item) => item.cantidad), 0)

  if (!maximoConteo) {
    return {
      dominio: [0, 10],
      ticks: [0, 2, 4, 6, 8, 10],
    }
  }

  const paso = obtenerPasoTicks(maximoConteo)
  const maximoRedondeado = Math.ceil(maximoConteo / paso) * paso
  const ticks = []

  for (let valor = 0; valor <= maximoRedondeado; valor += paso) {
    ticks.push(valor)
  }

  return {
    dominio: [0, maximoRedondeado],
    ticks,
  }
}
