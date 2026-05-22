export const PERIODOS_PROMEDIO = {
  SEMANA: 'semana',
  MES: 'mes',
  ANIO: 'anio',
}

const NOMBRES_MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const ABREVIATURAS_MESES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

const ABREVIATURAS_DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const esPpmValido = (ppm) => Number.isFinite(ppm) && ppm > 0

const obtenerClaveDiaLocal = (fechaEntrada) => {
  const fecha = fechaEntrada instanceof Date ? fechaEntrada : new Date(fechaEntrada)
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

const formatearDiaMes = (fecha) => {
  const dia = String(fecha.getDate()).padStart(2, '0')
  const mes = ABREVIATURAS_MESES[fecha.getMonth()]
  return `${dia}, ${mes}`
}

const obtenerInicioSemanaLunes = (fechaEntrada) => {
  const fecha = new Date(fechaEntrada)
  const dia = fecha.getDay()
  const desfase = dia === 0 ? -6 : 1 - dia
  const inicio = new Date(fecha)
  inicio.setHours(0, 0, 0, 0)
  inicio.setDate(inicio.getDate() + desfase)
  return inicio
}

const obtenerFinSemanaDomingo = (inicioSemana) => {
  const fin = new Date(inicioSemana)
  fin.setDate(fin.getDate() + 6)
  fin.setHours(23, 59, 59, 999)
  return fin
}

const construirMapaRangosDiarios = (registros) => {
  const mapa = new Map()

  registros.forEach((registro) => {
    const claveDia = obtenerClaveDiaLocal(registro.fechaHoraISO)
    const ppm = registro.ppm
    if (!esPpmValido(ppm)) return

    const existente = mapa.get(claveDia)
    if (!existente) {
      mapa.set(claveDia, { minimo: ppm, maximo: ppm })
      return
    }

    existente.minimo = Math.min(existente.minimo, ppm)
    existente.maximo = Math.max(existente.maximo, ppm)
  })

  return mapa
}

const obtenerOpcionesSemana = (registros) => {
  const mapa = new Map()

  registros.filter((registro) => esPpmValido(registro.ppm)).forEach((registro) => {
    const fecha = new Date(registro.fechaHoraISO)
    const inicio = obtenerInicioSemanaLunes(fecha)
    const fin = obtenerFinSemanaDomingo(inicio)
    const valor = obtenerClaveDiaLocal(inicio)

    if (!mapa.has(valor)) {
      mapa.set(valor, {
        valor,
        etiqueta: `Lun ${formatearDiaMes(inicio)} - Dom ${formatearDiaMes(fin)}`,
      })
    }
  })

  return [...mapa.values()].sort((a, b) => (a.valor < b.valor ? 1 : -1))
}

const obtenerOpcionesMes = (registros) => {
  const mapa = new Map()

  registros.filter((registro) => esPpmValido(registro.ppm)).forEach((registro) => {
    const fecha = new Date(registro.fechaHoraISO)
    const anio = fecha.getFullYear()
    const mesIndice = fecha.getMonth()
    const valor = `${anio}-${String(mesIndice + 1).padStart(2, '0')}`
    if (!mapa.has(valor)) {
      mapa.set(valor, { valor, etiqueta: `${NOMBRES_MESES[mesIndice]} - ${anio}` })
    }
  })

  return [...mapa.values()].sort((a, b) => (a.valor < b.valor ? 1 : -1))
}

const obtenerOpcionesAnio = (registros) => {
  const conjunto = new Set(
    registros
      .filter((registro) => esPpmValido(registro.ppm))
      .map((registro) => String(new Date(registro.fechaHoraISO).getFullYear()))
  )

  return [...conjunto]
    .sort((a, b) => Number(b) - Number(a))
    .map((anio) => ({ valor: anio, etiqueta: anio }))
}

export const construirOpcionesFiltroPromedio = (registros) => ({
  [PERIODOS_PROMEDIO.SEMANA]: obtenerOpcionesSemana(registros),
  [PERIODOS_PROMEDIO.MES]: obtenerOpcionesMes(registros),
  [PERIODOS_PROMEDIO.ANIO]: obtenerOpcionesAnio(registros),
})

export const construirSeriePromedioSemana = (registros, valorSemana) => {
  const inicio = new Date(`${valorSemana}T00:00:00`)
  const mapaRangos = construirMapaRangosDiarios(registros)

  return ABREVIATURAS_DIAS.map((etiqueta, indice) => {
    const fecha = new Date(inicio)
    fecha.setDate(inicio.getDate() + indice)
    const claveDia = obtenerClaveDiaLocal(fecha)
    const rango = mapaRangos.get(claveDia)

    return {
      etiquetaX: etiqueta,
      minimo: rango?.minimo ?? null,
      maximo: rango?.maximo ?? null,
    }
  })
}

export const construirSeriePromedioMes = (registros, valorMes) => {
  const [anioTxt, mesTxt] = valorMes.split('-')
  const anio = Number(anioTxt)
  const mesIndice = Number(mesTxt) - 1
  const diasMes = new Date(anio, mesIndice + 1, 0).getDate()
  const mapaRangos = construirMapaRangosDiarios(registros)

  return Array.from({ length: diasMes }, (_, indice) => {
    const dia = indice + 1
    const fecha = new Date(anio, mesIndice, dia)
    const claveDia = obtenerClaveDiaLocal(fecha)
    const rango = mapaRangos.get(claveDia)

    return {
      etiquetaX: String(dia),
      minimo: rango?.minimo ?? null,
      maximo: rango?.maximo ?? null,
    }
  })
}

export const construirSeriePromedioAnio = (registros, valorAnio) => {
  const anio = Number(valorAnio)
  const mapaRangos = construirMapaRangosDiarios(registros)

  return ABREVIATURAS_MESES.map((abreviatura, mesIndice) => {
    const diasMes = new Date(anio, mesIndice + 1, 0).getDate()
    const minimos = []
    const maximos = []

    for (let dia = 1; dia <= diasMes; dia += 1) {
      const fecha = new Date(anio, mesIndice, dia)
      const claveDia = obtenerClaveDiaLocal(fecha)
      const rango = mapaRangos.get(claveDia)
      if (!rango) continue
      minimos.push(rango.minimo)
      maximos.push(rango.maximo)
    }

    if (!minimos.length || !maximos.length) {
      return { etiquetaX: abreviatura, minimo: null, maximo: null }
    }

    const promedioMinimo =
      minimos.reduce((suma, valor) => suma + valor, 0) / minimos.length
    const promedioMaximo =
      maximos.reduce((suma, valor) => suma + valor, 0) / maximos.length

    return {
      etiquetaX: abreviatura,
      minimo: Math.round(promedioMinimo),
      maximo: Math.round(promedioMaximo),
    }
  })
}

export const construirSeriePromedio = ({ registros, periodo, valorFiltro }) => {
  if (!valorFiltro) return []

  if (periodo === PERIODOS_PROMEDIO.SEMANA) {
    return construirSeriePromedioSemana(registros, valorFiltro)
  }
  if (periodo === PERIODOS_PROMEDIO.MES) {
    return construirSeriePromedioMes(registros, valorFiltro)
  }
  return construirSeriePromedioAnio(registros, valorFiltro)
}
