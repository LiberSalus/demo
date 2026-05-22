export const TIPOS_REGISTRO_FRECUENCIA = {
  REPOSO: 'reposo',
  ACTIVIDAD: 'actividad',
}

export const PERIODOS_FRECUENCIA = {
  SEMANA: 'semana',
  MES: 'mes',
  ANIO: 'anio',
}

// Contrato para lecturas puntuales del dia.
// Sirve para:
// - GraficaFrecuenciaCardiacaDiaria
// - captura manual de registros
//
// Campos esperados:
// {
//   id: string,
//   fechaHoraISO: string, // ISO 8601. Ej: "2026-03-12T15:30:00Z"
//   ppm: number, // entero recomendado, rango esperado 30-220
//   tipoRegistro: 'reposo' | 'actividad'
// }
export const dataFrecuenciaCardiacaDiariaEjemplo = {
  pacienteId: 'pac-001',
  fecha: '2026-03-12',
  ultimaActualizacionISO: '2026-03-12T15:30:00Z',
  registros: [
    {
      id: 'reg-001',
      fechaHoraISO: '2026-03-12T06:10:00Z',
      ppm: 62,
      tipoRegistro: TIPOS_REGISTRO_FRECUENCIA.REPOSO,
    },
    {
      id: 'reg-002',
      fechaHoraISO: '2026-03-12T08:45:00Z',
      ppm: 104,
      tipoRegistro: TIPOS_REGISTRO_FRECUENCIA.ACTIVIDAD,
    },
    {
      id: 'reg-003',
      fechaHoraISO: '2026-03-12T15:30:00Z',
      ppm: 71,
      tipoRegistro: TIPOS_REGISTRO_FRECUENCIA.REPOSO,
    },
  ],
}

// Contrato recomendado para historial crudo.
// Sirve para:
// - promedioFrecuencias.utils
// - calculo de min/max por dia, semana, mes y anio
//
// El frontend actual construye desde aqui:
// - opciones de filtro
// - promedio semanal
// - promedio mensual
// - promedio anual
export const dataFrecuenciaCardiacaHistorialEjemplo = {
  pacienteId: 'pac-001',
  fechaInicio: '2026-01-01',
  fechaFin: '2026-03-31',
  registros: [
    {
      id: 'hist-001',
      fechaHoraISO: '2026-03-10T06:00:00Z',
      ppm: 58,
      tipoRegistro: TIPOS_REGISTRO_FRECUENCIA.REPOSO,
    },
    {
      id: 'hist-002',
      fechaHoraISO: '2026-03-10T13:20:00Z',
      ppm: 118,
      tipoRegistro: TIPOS_REGISTRO_FRECUENCIA.ACTIVIDAD,
    },
    {
      id: 'hist-003',
      fechaHoraISO: '2026-03-11T07:15:00Z',
      ppm: 63,
      tipoRegistro: TIPOS_REGISTRO_FRECUENCIA.REPOSO,
    },
    {
      id: 'hist-004',
      fechaHoraISO: '2026-03-11T18:05:00Z',
      ppm: 126,
      tipoRegistro: TIPOS_REGISTRO_FRECUENCIA.ACTIVIDAD,
    },
  ],
}

// Contrato recomendado para agregados diarios.
// Sirve para:
// - GraficaReposoActividad
// - GraficaDistribucion
//
// Cada elemento representa un dia ya resumido por backend.
// Reglas esperadas:
// - fecha en formato YYYY-MM-DD
// - fcActividad >= fcReposo
// - si un dia no tiene datos, puede omitirse o enviarse null en ambos campos
export const dataFrecuenciaCardiacaAgregadaEjemplo = {
  pacienteId: 'pac-001',
  fechaInicio: '2026-03-01',
  fechaFin: '2026-03-31',
  registros: [
    {
      fecha: '2026-03-10',
      fcReposo: 62,
      fcActividad: 116,
    },
    {
      fecha: '2026-03-11',
      fcReposo: 65,
      fcActividad: 124,
    },
    {
      fecha: '2026-03-12',
      fcReposo: 60,
      fcActividad: 109,
    },
  ],
}

// Resumen corto para compartir con backend.
export const contratosFrecuenciaCardiaca = {
  diaria: {
    endpointSugerido: '/frecuencia-cardiaca/diaria?fecha=YYYY-MM-DD',
    usaRegistros: 'registros',
    shape: {
      pacienteId: 'string',
      fecha: 'YYYY-MM-DD',
      ultimaActualizacionISO: 'ISO-8601',
      registros: [
        {
          id: 'string',
          fechaHoraISO: 'ISO-8601',
          ppm: 'number',
          tipoRegistro: "'reposo' | 'actividad'",
        },
      ],
    },
  },
  historial: {
    endpointSugerido: '/frecuencia-cardiaca/historial?desde=YYYY-MM-DD&hasta=YYYY-MM-DD',
    usaRegistros: 'registros',
    shape: {
      pacienteId: 'string',
      fechaInicio: 'YYYY-MM-DD',
      fechaFin: 'YYYY-MM-DD',
      registros: [
        {
          id: 'string',
          fechaHoraISO: 'ISO-8601',
          ppm: 'number',
          tipoRegistro: "'reposo' | 'actividad'",
        },
      ],
    },
  },
  agregadaDiaria: {
    endpointSugerido: '/frecuencia-cardiaca/agregados-diarios?periodo=mes',
    usaRegistros: 'registros',
    shape: {
      pacienteId: 'string',
      fechaInicio: 'YYYY-MM-DD',
      fechaFin: 'YYYY-MM-DD',
      registros: [
        {
          fecha: 'YYYY-MM-DD',
          fcReposo: 'number',
          fcActividad: 'number',
        },
      ],
    },
  },
}

export default contratosFrecuenciaCardiaca
