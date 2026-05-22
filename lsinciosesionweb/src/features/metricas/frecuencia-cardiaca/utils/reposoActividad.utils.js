export const PERIODOS_REPOSO_ACTIVIDAD = {
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

const convertirAFechaLocal = (fechaISO) => new Date(`${fechaISO}T00:00:00`)

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
  const fecha = fechaEntrada instanceof Date ? new Date(fechaEntrada) : convertirAFechaLocal(fechaEntrada)
  const diaSemana = fecha.getDay()
  const desfase = diaSemana === 0 ? -6 : 1 - diaSemana
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

const construirMapaPorFecha = (registros) => {
  const mapa = new Map()

  registros.forEach((registro) => {
    const reposo = Number(registro.fcReposo)
    const actividad = Number(registro.fcActividad)
    if (!Number.isFinite(reposo) || !Number.isFinite(actividad)) return

    mapa.set(registro.fecha, {
      fcReposo: reposo,
      fcActividad: actividad,
    })
  })

  return mapa
}

const obtenerOpcionesSemana = (registros) => {
  const mapa = new Map()

  registros.forEach((registro) => {
    const inicio = obtenerInicioSemanaLunes(registro.fecha)
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

  registros.forEach((registro) => {
    const fecha = convertirAFechaLocal(registro.fecha)
    const anio = fecha.getFullYear()
    const mesIndice = fecha.getMonth()
    const valor = `${anio}-${String(mesIndice + 1).padStart(2, '0')}`

    if (!mapa.has(valor)) {
      mapa.set(valor, {
        valor,
        etiqueta: `${NOMBRES_MESES[mesIndice]} - ${anio}`,
      })
    }
  })

  return [...mapa.values()].sort((a, b) => (a.valor < b.valor ? 1 : -1))
}

const obtenerOpcionesAnio = (registros) => {
  const anios = new Set(
    registros.map((registro) => String(convertirAFechaLocal(registro.fecha).getFullYear()))
  )

  return [...anios]
    .sort((a, b) => Number(b) - Number(a))
    .map((anio) => ({ valor: anio, etiqueta: anio }))
}

export const construirOpcionesFiltroReposoActividad = (registros) => ({
  [PERIODOS_REPOSO_ACTIVIDAD.SEMANA]: obtenerOpcionesSemana(registros),
  [PERIODOS_REPOSO_ACTIVIDAD.MES]: obtenerOpcionesMes(registros),
  [PERIODOS_REPOSO_ACTIVIDAD.ANIO]: obtenerOpcionesAnio(registros),
})

export const construirSerieReposoActividadSemana = (registros, valorSemana) => {
  const inicioSemana = convertirAFechaLocal(valorSemana)
  const mapaPorFecha = construirMapaPorFecha(registros)

  return ABREVIATURAS_DIAS.map((etiqueta, indice) => {
    const fecha = new Date(inicioSemana)
    fecha.setDate(inicioSemana.getDate() + indice)
    const claveDia = obtenerClaveDiaLocal(fecha)
    const valores = mapaPorFecha.get(claveDia)

    return {
      etiquetaX: etiqueta,
      fcReposo: valores?.fcReposo ?? null,
      fcActividad: valores?.fcActividad ?? null,
    }
  })
}

export const construirSerieReposoActividadMes = (registros, valorMes) => {
  const [anioTxt, mesTxt] = valorMes.split('-')
  const anio = Number(anioTxt)
  const mesIndice = Number(mesTxt) - 1
  const diasMes = new Date(anio, mesIndice + 1, 0).getDate()
  const mapaPorFecha = construirMapaPorFecha(registros)

  return Array.from({ length: diasMes }, (_, indice) => {
    const dia = indice + 1
    const fecha = new Date(anio, mesIndice, dia)
    const claveDia = obtenerClaveDiaLocal(fecha)
    const valores = mapaPorFecha.get(claveDia)

    return {
      etiquetaX: String(dia),
      fcReposo: valores?.fcReposo ?? null,
      fcActividad: valores?.fcActividad ?? null,
    }
  })
}

export const construirSerieReposoActividadAnio = (registros, valorAnio) => {
  const anio = Number(valorAnio)
  const mapaPorFecha = construirMapaPorFecha(registros)

  return ABREVIATURAS_MESES.map((abreviatura, mesIndice) => {
    const diasMes = new Date(anio, mesIndice + 1, 0).getDate()
    const reposos = []
    const actividades = []

    for (let dia = 1; dia <= diasMes; dia += 1) {
      const fecha = new Date(anio, mesIndice, dia)
      const claveDia = obtenerClaveDiaLocal(fecha)
      const valores = mapaPorFecha.get(claveDia)
      if (!valores) continue

      reposos.push(valores.fcReposo)
      actividades.push(valores.fcActividad)
    }

    if (!reposos.length || !actividades.length) {
      return {
        etiquetaX: abreviatura,
        fcReposo: null,
        fcActividad: null,
      }
    }

    const promedioReposo =
      reposos.reduce((acumulado, valor) => acumulado + valor, 0) / reposos.length
    const promedioActividad =
      actividades.reduce((acumulado, valor) => acumulado + valor, 0) / actividades.length

    return {
      etiquetaX: abreviatura,
      fcReposo: Math.round(promedioReposo),
      fcActividad: Math.round(promedioActividad),
    }
  })
}

export const construirSerieReposoActividad = ({ registros, periodo, valorFiltro }) => {
  if (!valorFiltro) return []

  if (periodo === PERIODOS_REPOSO_ACTIVIDAD.SEMANA) {
    return construirSerieReposoActividadSemana(registros, valorFiltro)
  }

  if (periodo === PERIODOS_REPOSO_ACTIVIDAD.MES) {
    return construirSerieReposoActividadMes(registros, valorFiltro)
  }

  return construirSerieReposoActividadAnio(registros, valorFiltro)
}
