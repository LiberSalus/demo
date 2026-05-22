// Obtiene clave de dia local en formato YYYY-MM-DD para agrupar lecturas diarias.
export function obtenerClaveDiaLocal(fechaEntrada = new Date()) {
  const fecha =
    fechaEntrada instanceof Date ? fechaEntrada : new Date(fechaEntrada);
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

// Filtra registros que pertenecen a la clave de dia indicada.
export function filtrarRegistrosPorDia(registros, claveDia) {
  return registros.filter(
    (registro) => obtenerClaveDiaLocal(registro.fechaHoraISO) === claveDia
  );
}

// Transforma registros diarios a escala continua de tiempo expresada en hora decimal.
export function construirSeriePorHora(registrosDelDia) {
  if (!registrosDelDia.length) {
    return [
      { hora: 0, ppm: null },
      { hora: 24, ppm: null },
    ];
  }

  return [...registrosDelDia]
    .sort(
      (actual, siguiente) =>
        new Date(actual.fechaHoraISO).getTime() -
        new Date(siguiente.fechaHoraISO).getTime()
    )
    .map((registro) => {
      const fecha = new Date(registro.fechaHoraISO);
      const horaDecimal =
        fecha.getHours() + fecha.getMinutes() / 60 + fecha.getSeconds() / 3600;

      return {
        hora: horaDecimal,
        ppm: registro.ppm,
        fechaHoraISO: registro.fechaHoraISO,
      };
    });
}

// Formatea fecha y hora para mostrar "dd-mm-yyyy hh:mm".
export function formatearFechaHora(fechaHoraISO) {
  const fecha = new Date(fechaHoraISO);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  const hora = String(fecha.getHours()).padStart(2, "0");
  const minuto = String(fecha.getMinutes()).padStart(2, "0");

  return `${dia}-${mes}-${anio} ${hora}:${minuto}`;
}

// Normaliza una lectura de promedio para asegurar min y max numericos ordenados.
export function normalizarLecturaPromedio(lectura) {
  const minimo = Number(lectura?.minimo);
  const maximo = Number(lectura?.maximo);

  if (!Number.isFinite(minimo) || !Number.isFinite(maximo)) {
    return null;
  }

  return {
    min: Math.min(minimo, maximo),
    max: Math.max(minimo, maximo),
  };
}

// Calcula el rango minimo y maximo de las lecturas validas del dia.
export function obtenerRangoDiario(registrosDelDia) {
  const lecturasValidas = registrosDelDia
    .map((registro) => registro.ppm)
    .filter((ppm) => Number.isFinite(ppm));

  if (!lecturasValidas.length) {
    return { minDia: undefined, maxDia: undefined };
  }

  return {
    minDia: Math.min(...lecturasValidas),
    maxDia: Math.max(...lecturasValidas),
  };
}

// Obtiene el valor destacado de la grafica diaria usando la hora activa o la ultima lectura.
export function obtenerValorDestacado(serieGraficaDiaria, horaActiva) {
  const registroActivo = serieGraficaDiaria.find(
    (item) => item.hora === horaActiva
  );
  if (registroActivo?.ppm != null) return registroActivo.ppm;

  const ultimoConLectura = [...serieGraficaDiaria]
    .reverse()
    .find((item) => item.ppm != null);

  return ultimoConLectura?.ppm ?? null;
}

// Construye el registro diario que se agrega desde el modal de captura.
export function crearRegistroFrecuencia({ fechaHoraISO, ppm, fueActividad }) {
  return {
    id: `reg-${Date.now()}`,
    fechaHoraISO,
    ppm: Math.round(ppm),
    tipoRegistro: fueActividad ? "actividad" : "reposo",
  };
}
