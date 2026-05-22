// Mock historico base (datos crudos) para graficas de promedio/rangos.
// Estructura de cada registro:
// { id, fechaHoraISO, ppm, tipoRegistro }

const limitar = (valor, minimo, maximo) => Math.min(maximo, Math.max(minimo, valor))

const obtenerFechaLocalISO = (fecha) => {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

const crearRegistrosHistoricos = (fechaInicio, fechaFin) => {
  const inicio = new Date(`${fechaInicio}T00:00:00`)
  const fin = new Date(`${fechaFin}T00:00:00`)
  const registros = []

  let indiceDia = 0
  for (
    let cursor = new Date(inicio);
    cursor.getTime() <= fin.getTime();
    cursor.setDate(cursor.getDate() + 1), indiceDia += 1
  ) {
    // Dejamos huecos reales para validar el caso "sin datos".
    if (indiceDia % 5 === 0) continue

    const lecturasDia = 1 + (indiceDia % 3) // 1 a 3 lecturas por dia.

    for (let indiceLectura = 0; indiceLectura < lecturasDia; indiceLectura += 1) {
      const hora = 6 + indiceLectura * 6 + ((indiceDia + indiceLectura) % 2)
      const minuto = (indiceDia * 13 + indiceLectura * 17) % 60

      const tendencia = Math.sin(indiceDia / 10) * 11
      const variacionLectura = indiceLectura === 0 ? -5 : indiceLectura === 1 ? 8 : 14
      const ppmCalculado = 86 + tendencia + variacionLectura
      const ppm = Math.round(limitar(ppmCalculado, 52, 148))

      const fechaHoraLocal = new Date(
        cursor.getFullYear(),
        cursor.getMonth(),
        cursor.getDate(),
        hora,
        minuto,
        0
      )

      registros.push({
        id: `hist-${indiceDia}-${indiceLectura}`,
        fechaHoraISO: fechaHoraLocal.toISOString(),
        ppm,
        tipoRegistro: ppm > 100 ? 'actividad' : 'reposo',
      })
    }
  }

  return registros
}

export const registrosFrecuenciaHistorialMock = crearRegistrosHistoricos(
  '2025-01-01',
  obtenerFechaLocalISO(new Date())
)
