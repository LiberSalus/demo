// NOTA:
// Este archivo es JavaScript (no JSON puro) porque aqui generamos datos mock
// de forma automatica y tambien los validamos antes de exportarlos.


// Regex para validar el formato de fecha "YYYY-MM-DD".
const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/

// Fecha inicial del historico mock (incluida).
const fechaInicio = '2024-01-01'
// Fecha final del historico mock (incluida).
const fechaFin = '2026-03-11'

// Convierte una fecha ISO (YYYY-MM-DD) a Date en UTC (evita desfases por zona horaria local).
const convertirAFechaUTC = (fechaISO) => new Date(`${fechaISO}T00:00:00Z`)

// Recibe un Date en UTC y lo regresa como string "YYYY-MM-DD".
const formatearFechaUTC = (fechaUTC) => {
  // Obtiene el anio UTC.
  const anio = fechaUTC.getUTCFullYear()
  // Obtiene el mes UTC (0-11), por eso se suma 1, y se rellena con cero.
  const mes = String(fechaUTC.getUTCMonth() + 1).padStart(2, '0')
  // Obtiene el dia UTC y se rellena con cero.
  const dia = String(fechaUTC.getUTCDate()).padStart(2, '0')
  // Arma la fecha final en formato ISO corto.
  return `${anio}-${mes}-${dia}`
}

// Asegura que un valor quede dentro de un rango [minimo, maximo].
const limitar = (valor, minimo, maximo) => Math.min(maximo, Math.max(minimo, valor))

// Construye un arreglo de registros diarios desde inicioISO hasta finISO (inclusive).
const construirRegistrosDiarios = (inicioISO, finISO) => {
  // Convierte el inicio a Date UTC.
  const inicio = convertirAFechaUTC(inicioISO)
  // Convierte el fin a Date UTC.
  const fin = convertirAFechaUTC(finISO)
  // Arreglo acumulador de registros.
  const registros = []

  // Recorre dia por dia desde inicio hasta fin.
  for (
    // Cursor inicia en la fecha de inicio.
    let cursor = new Date(inicio);
    // Condicion: mientras cursor sea menor o igual a la fecha final.
    cursor.getTime() <= fin.getTime();
    // Avanza exactamente 1 dia en UTC.
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  ) {
    // Indice de dia relativo al inicio (0, 1, 2, ...).
    const indiceDia = Math.floor((cursor.getTime() - inicio.getTime()) / 86_400_000)
    // Dia de semana en UTC: 0=domingo ... 6=sabado.
    const diaSemana = cursor.getUTCDay()
    // Marcamos si es fin de semana para variar comportamiento.
    const esFinDeSemana = diaSemana === 0 || diaSemana === 6

    // Variacion suave de largo periodo para simular tendencia.
    const variacionLenta = Math.sin(indiceDia / 14) * 4
    // Variacion corta para simular fluctuacion diaria/semanal.
    const variacionRapida = Math.cos(indiceDia / 5) * 3
    // Ajuste base: fin de semana un poco menor en reposo.
    const ajusteFinDeSemana = esFinDeSemana ? -2 : 1

    // FC de reposo estimada antes de redondear/limitar.
    const fcReposoCalculada = 66 + variacionLenta + ajusteFinDeSemana
    // Incremento por actividad sobre reposo.
    const incrementoActividad = 34 + variacionRapida + (esFinDeSemana ? 3 : 0)

    // FC reposo final: entero y acotado.
    const fcReposo = limitar(Math.round(fcReposoCalculada), 52, 90)
    // FC actividad final: entero y acotado.
    const fcActividad = limitar(Math.round(fcReposo + incrementoActividad), 88, 155)

    // Guardamos el registro con la estructura acordada.
    registros.push({
      // Fecha del registro.
      fecha: formatearFechaUTC(cursor),
      // Valor de frecuencia cardiaca en reposo.
      fcReposo,
      // Valor de frecuencia cardiaca en actividad.
      fcActividad,
    })
  }

  // Regresa el arreglo completo de registros.
  return registros
}

// Valida que todos los registros cumplan estructura y reglas basicas.
const validarRegistrosFrecuencia = (registros) => {
  // every devuelve true solo si todos los elementos pasan la validacion.
  return registros.every((registro) => {
    // Debe existir y ser objeto.
    if (!registro || typeof registro !== 'object') return false

    // Extraemos campos esperados.
    const { fecha, fcReposo, fcActividad } = registro
    // Fecha debe ser string y cumplir formato ISO corto.
    const fechaValida = typeof fecha === 'string' && FORMATO_FECHA.test(fecha)
    // FC reposo debe ser numero finito.
    const reposoValido = Number.isFinite(fcReposo)
    // FC actividad debe ser numero finito.
    const actividadValida = Number.isFinite(fcActividad)
    // Regla de coherencia: actividad no debe ser menor a reposo.
    const relacionValida = reposoValido && actividadValida ? fcActividad >= fcReposo : false

    // Registro valido solo si todo lo anterior es true.
    return fechaValida && reposoValido && actividadValida && relacionValida
  })
}

// Fuente unica de datos para el componente (paso 1).
export const registrosFrecuenciaMock = construirRegistrosDiarios(fechaInicio, fechaFin)

// Falla temprano si el mock no cumple la estructura esperada.
if (!validarRegistrosFrecuencia(registrosFrecuenciaMock)) {
  throw new Error('datosFrecuencia.mock.js contiene registros invalidos.')
}
