const crearSeparador = (valor = "-") => ({
  tipo: "texto",
  valor,
});

const crearListaRangos = (items) =>
  items.map((item) => ({
    titulo: item.titulo,
    lineas: item.lineas,
  }));

const limpiarValorResumen = (valor = "") =>
  valor.replace(/^Max\s*-\s*/i, "").replace(/^Min\s*-\s*/i, "").trim();

const construirFechaHora = (fecha, hora) =>
  [fecha, hora].filter(Boolean).join(" - ");

const construirDetallePredeterminado = (config, diaRegistro, registroHora, tituloDia) => {
  if (registroHora?.detalle?.length) {
    return registroHora.detalle;
  }

  if (diaRegistro?.detalle?.length) {
    return diaRegistro.detalle;
  }

  return [
    {
      etiqueta: config.nombreCorto,
      valor: registroHora?.principal ?? limpiarValorResumen(diaRegistro?.principal),
    },
    {
      etiqueta: "Fecha y hora",
      valor: construirFechaHora(tituloDia, registroHora?.hora ?? "09:00 am"),
    },
    {
      etiqueta: "Dispositivo",
      valor: "Agregado manualmente",
    },
  ];
};

export const METRICAS_REGISTROS = {
  FrecuenciaCardiaca: {
    key: "FrecuenciaCardiaca",
    nombre: "Frecuencia Cardiaca",
    nombreCorto: "Frecuencia Cardiaca",
    vistaPeriodoDefecto: "Dia",
    tituloPeriodo: {
      Dia: "31 Marzo 2026",
      Semana: "Semana del 31 Marzo 2026",
      Mes: "Marzo 2026",
      Anio: "2026",
    },
    valoresTitulo: "Valores de Frecuencia cardiaca",
    valoresReferencia: [
      { color: "#FF4040", nombre: "Taquicardia (Severa)", valor: "> 120 ppm" },
      { color: "#F8A737", nombre: "Taquicardia (Leve)", valor: "101 - 120 ppm" },
      { color: "#3FAD58", nombre: "FC normal", valor: "60 - 100 ppm" },
      { color: "#FF4040", nombre: "Bradicardia", valor: "< 60 ppm" },
    ],
    resumen: crearListaRangos([
      {
        titulo: "Rangos ppm P10",
        lineas: ["Número de mediciones:", "• 12 mediciones", "• < 60 ppm"],
      },
      {
        titulo: "Rangos ppm Actividad",
        lineas: ["Max 120 ppm", "Min 100 ppm"],
      },
      {
        titulo: "Rangos ppm P90",
        lineas: ["Número de mediciones:", "• 20 mediciones", "• > 120 ppm"],
      },
      {
        titulo: "Rangos ppm Reposo",
        lineas: ["Max 89 ppm", "Min 68 ppm"],
      },
    ]),
    filtros: ["Dia", "Semana", "Mes", "Anio"],
    registros: {
      Dia: [
        {
          id: "fc-dia-1",
          principal: "Max - 120 ppm",
          secundaria: "Min - 68 ppm",
          fecha: "31 Marzo 2026",
          registrosDelDia: [
            {
              id: "fc-hora-1",
              principal: "89 ppm",
              hora: "09:00 am",
              acento: "#3FAD58",
              detalle: [
                { etiqueta: "Frecuencia Cardiaca", valor: "89 ppm" },
                { etiqueta: "Fecha y hora", valor: "Martes 31 de marzo 2026 - 09:00 am" },
                { etiqueta: "Contexto de medición", valor: "Reposo" },
                { etiqueta: "Dispositivo", valor: "Agregado manualmente" },
              ],
            },
            { id: "fc-hora-2", principal: "78 ppm", hora: "09:14 am", acento: "#3FAD58" },
            { id: "fc-hora-3", principal: "120 ppm", hora: "09:36 am", acento: "#F8A737" },
            { id: "fc-hora-4", principal: "130 ppm", hora: "09:48 am", acento: "#FF4040" },
            { id: "fc-hora-5", principal: "140 ppm", hora: "09:59 am", acento: "#FF4040" },
            { id: "fc-hora-6", principal: "74 ppm", hora: "10:11 am", acento: "#3FAD58" },
            { id: "fc-hora-7", principal: "79 ppm", hora: "10:25 am", acento: "#3FAD58" },
            { id: "fc-hora-8", principal: "69 ppm", hora: "10:36 am", acento: "#3FAD58" },
            { id: "fc-hora-9", principal: "89 ppm", hora: "10:48 am", acento: "#3FAD58" },
            { id: "fc-hora-10", principal: "86 ppm", hora: "10:57 am", acento: "#3FAD58" },
            { id: "fc-hora-11", principal: "120 ppm", hora: "11:14 am", acento: "#F8A737" },
            { id: "fc-hora-12", principal: "116 ppm", hora: "11:26 am", acento: "#F8A737" },
            { id: "fc-hora-13", principal: "96 ppm", hora: "11:32 am", acento: "#3FAD58" },
            { id: "fc-hora-14", principal: "89 ppm", hora: "11:40 am", acento: "#3FAD58" },
            { id: "fc-hora-15", principal: "112 ppm", hora: "11:49 am", acento: "#F8A737" },
            { id: "fc-hora-16", principal: "126 ppm", hora: "11:59 am", acento: "#FF4040" },
            { id: "fc-hora-17", principal: "110 ppm", hora: "12:09 pm", acento: "#F8A737" },
            { id: "fc-hora-18", principal: "89 ppm", hora: "12:18 pm", acento: "#3FAD58" },
            { id: "fc-hora-19", principal: "68 ppm", hora: "12:26 pm", acento: "#3FAD58" },
            { id: "fc-hora-20", principal: "76 ppm", hora: "12:29 pm", acento: "#3FAD58" },
          ],
          detalle: [
            { etiqueta: "Frecuencia Cardiaca", valor: "89 ppm" },
            { etiqueta: "Fecha y hora", valor: "Martes 31 de marzo 2026 - 09:00 am" },
            { etiqueta: "Contexto de medición", valor: "Reposo" },
            { etiqueta: "Dispositivo", valor: "Agregado manualmente" },
          ],
        },
        {
          id: "fc-dia-2",
          principal: "Max - 116 ppm",
          secundaria: "Min - 72 ppm",
          fecha: "30 Marzo 2026",
        },
        {
          id: "fc-dia-3",
          principal: "Max - 140 ppm",
          secundaria: "Min - 74 ppm",
          fecha: "29 Marzo 2026",
        },
        {
          id: "fc-dia-4",
          principal: "Max - 112 ppm",
          secundaria: "Min - 69 ppm",
          fecha: "28 Marzo 2026",
        },
      ],
      Semana: [
        {
          id: "fc-semana-1",
          periodo: "Semana 30 Marzo al 5 de Abril",
        },
        {
          id: "fc-semana-2",
          periodo: "Semana 23 al 29 de Marzo",
        },
        {
          id: "fc-semana-3",
          periodo: "Semana 16 al 22 de Marzo",
        },
        {
          id: "fc-semana-4",
          periodo: "Semana 09 al 15 de Marzo",
        },
      ],
      Mes: [
        {
          id: "fc-mes-1",
          periodo: "Marzo 2026",
        },
        {
          id: "fc-mes-2",
          periodo: "Febrero 2026",
        },
        {
          id: "fc-mes-3",
          periodo: "Enero 2026",
        },
        {
          id: "fc-mes-4",
          periodo: "Diciembre 2025",
        },
      ],
      Anio: [
        {
          id: "fc-anio-1",
          periodo: "2026",
        },
        {
          id: "fc-anio-2",
          periodo: "2025",
        },
        {
          id: "fc-anio-3",
          periodo: "2024",
        },
      ],
    },
  },
  PresionArterial: {
    key: "PresionArterial",
    nombre: "Presión Arterial",
    nombreCorto: "Presión Arterial",
    vistaPeriodoDefecto: "Mes",
    tituloPeriodo: {
      Dia: "31 Marzo 2026",
      Semana: "Semana del 31 Marzo 2026",
      Mes: "Marzo 2026",
      Anio: "2026",
    },
    valoresTitulo: "Valores de presión arterial",
    valoresReferencia: [
      { color: "#00A0E3", nombre: "Hipotensión", valor: "<90 / <60 mmHg" },
      { color: "#3FAD58", nombre: "Normal", valor: "<120 / <80 mmHg" },
      { color: "#F8A737", nombre: "Elevada", valor: "120 - 129 / < 80 mmHg" },
      { color: "#C93624", nombre: "Hipertensión 1", valor: "130 - 139 / 80 - 89 mmHg" },
      { color: "#C93624", nombre: "Hipertensión 2", valor: "≥140 / ≥90 mmHg" },
      { color: "#C93624", nombre: "Crisis hipertensiva", valor: "≥180 / ≥120 mmHg" },
    ],
    resumen: crearListaRangos([
      {
        titulo: "Rangos mmHg P10",
        lineas: ["Número de mediciones:", "• 12 mediciones", "• < 90/ <60 mmHg"],
      },
      {
        titulo: "Rangos mmHg P90",
        lineas: ["Número de mediciones:", "• 20 mediciones", "• 120 - 129 / <80 mmHg"],
      },
    ]),
    filtros: ["Dia", "Semana", "Mes", "Anio"],
    registros: {
      Dia: [
        {
          id: "pa-dia-1",
          acento: "#C93624",
          principal: "Max - 140/100 mmHg",
          secundaria: "Min - 120/80 mmHg",
          fecha: "31 Marzo 2026",
          detalle: [
            { etiqueta: "Presión Arterial", valor: "140/100 mmHg" },
            { etiqueta: "Frecuencia Cardiaca", valor: "78 ppm" },
            { etiqueta: "Medicamento", valor: "Enalapril" },
            { etiqueta: "Fecha y hora", valor: "Martes 31 de marzo 2026 - 07:15 pm" },
            { etiqueta: "Contexto de medición", valor: "No especificado" },
            { etiqueta: "Dispositivo", valor: "Agregado manualmente" },
          ],
        },
        {
          id: "pa-dia-2",
          acento: "#C93624",
          principal: "Max - 140/100 mmHg",
          secundaria: "Min - 120/80 mmHg",
          fecha: "30 Marzo 2026",
        },
        {
          id: "pa-dia-3",
          acento: "#C93624",
          principal: "Max - 140/100 mmHg",
          secundaria: "Min - 120/80 mmHg",
          fecha: "29 Marzo 2026",
        },
        {
          id: "pa-dia-4",
          acento: "#C93624",
          principal: "Max - 140/100 mmHg",
          secundaria: "Min - 120/80 mmHg",
          fecha: "28 Marzo 2026",
        },
        {
          id: "pa-dia-5",
          acento: "#C93624",
          principal: "Max - 140/100 mmHg",
          secundaria: "Min - 120/80 mmHg",
          fecha: "27 Marzo 2026",
        },
      ],
      Semana: [
        {
          id: "pa-semana-1",
          periodo: "Semana 30 Marzo al 5 de Abril",
        },
        {
          id: "pa-semana-2",
          periodo: "Semana 23 al 29 de Marzo",
        },
        {
          id: "pa-semana-3",
          periodo: "Semana 16 al 22 de Marzo",
        },
        {
          id: "pa-semana-4",
          periodo: "Semana 09 al 15 de Marzo",
        },
        {
          id: "pa-semana-5",
          periodo: "Semana 02 al 08 de Marzo",
        },
      ],
      Mes: [
        {
          id: "pa-mes-1",
          periodo: "Marzo 2026",
        },
        {
          id: "pa-mes-2",
          periodo: "Febrero 2026",
        },
        {
          id: "pa-mes-3",
          periodo: "Enero 2026",
        },
        {
          id: "pa-mes-4",
          periodo: "Diciembre 2025",
        },
        {
          id: "pa-mes-5",
          periodo: "Noviembre 2025",
        },
      ],
      Anio: [
        {
          id: "pa-anio-1",
          periodo: "2026",
        },
        {
          id: "pa-anio-2",
          periodo: "2025",
        },
        {
          id: "pa-anio-3",
          periodo: "2024",
        },
        {
          id: "pa-anio-4",
          periodo: "2023",
        },
      ],
    },
  },
  Oxigenacion: {
    key: "Oxigenacion",
    nombre: "Oxigenación",
    nombreCorto: "Oxigenación",
    detalleOrdenLateral: ["valores", "resumen"],
    vistaPeriodoDefecto: "Dia",
    tituloPeriodo: {
      Dia: "31 Marzo 2026",
      Semana: "Semana del 31 Marzo 2026",
      Mes: "Marzo 2026",
      Anio: "2026",
    },
    valoresTitulo: "Valores de oxigenación SpO2",
    valoresReferencia: [
      { color: "#3FAD58", nombre: "Excelente", valor: "94 - 100%" },
      { color: "#53B96B", nombre: "Aceptable", valor: "92 - 93%" },
      { color: "#F8A737", nombre: "Vigilar", valor: "90 - 91%" },
      { color: "#FF6A39", nombre: "Bajo", valor: "87 - 89%" },
      { color: "#FF4040", nombre: "Muy bajo", valor: "83 - 86%" },
      { color: "#FF1F3D", nombre: "Crítico", valor: "< 83%" },
    ],
    resumen: crearListaRangos([
      {
        titulo: "Mediciones totales",
        lineas: [
          "• 12 mediciones",
          "Rangos P10",
          "Número de mediciones",
          "• 12 mediciones",
          "• 92%",
          "Rangos P90",
          "Número de mediciones",
          "• 20 mediciones",
          "• 96%",
        ],
      },
      {
        titulo: "Porcentaje de oxigenación",
        lineas: [
          "P10  1%",
          "Normal  98%",
          "P90  1%",
          "Tus niveles de oxigenación han estado ligeramente por debajo de las mediciones normales.",
          "De seguir así consulta a tu médico.",
        ],
      },
    ]),
    filtros: ["Dia", "Semana", "Mes", "Anio"],
    registros: {
      Dia: [
        {
          id: "ox-dia-1",
          principal: "Max - 100%",
          secundaria: "Min - 93%",
          fecha: "31 Marzo 2026",
          detalle: [
            { etiqueta: "Oxigenación SpO2", valor: "94%" },
            { etiqueta: "Fecha y hora", valor: "Martes 31 de marzo 2026 - 08:55 am" },
            { etiqueta: "Dispositivo", valor: "Agregado manualmente" },
            { etiqueta: "Estado físico", valor: "Excelente" },
            { etiqueta: "Contexto de medición", valor: "No especificado" },
          ],
        },
        {
          id: "ox-dia-2",
          principal: "Max - 99%",
          secundaria: "Min - 92%",
          fecha: "30 Marzo 2026",
        },
        {
          id: "ox-dia-3",
          principal: "Max - 98%",
          secundaria: "Min - 91%",
          fecha: "29 Marzo 2026",
        },
      ],
      Semana: [
        {
          id: "ox-semana-1",
          periodo: "Semana 30 Marzo al 5 de Abril",
        },
        {
          id: "ox-semana-2",
          periodo: "Semana 23 al 29 de Marzo",
        },
        {
          id: "ox-semana-3",
          periodo: "Semana 16 al 22 de Marzo",
        },
      ],
      Mes: [
        {
          id: "ox-mes-1",
          periodo: "Marzo 2026",
        },
        {
          id: "ox-mes-2",
          periodo: "Febrero 2026",
        },
        {
          id: "ox-mes-3",
          periodo: "Enero 2026",
        },
      ],
      Anio: [
        {
          id: "ox-anio-1",
          periodo: "2026",
        },
        {
          id: "ox-anio-2",
          periodo: "2025",
        },
      ],
    },
  },
  Glucosa: {
    key: "Glucosa",
    nombre: "Glucosa en Sangre",
    nombreCorto: "Glucosa",
    detalleOrdenLateral: ["valores", "resumen"],
    vistaPeriodoDefecto: "Dia",
    tituloPeriodo: {
      Dia: "31 Marzo 2026",
      Semana: "Semana del 31 Marzo 2026",
      Mes: "Marzo 2026",
      Anio: "2026",
    },
    valoresTitulo: "Valores de glucosa",
    valoresGrupos: [
      {
        titulo: "Ayunas",
        items: [
          { color: "#6BC7D5", nombre: "Hipoglucemia", valor: "< 69 mg/dL" },
          { color: "#69B357", nombre: "Normal en ayuno", valor: "70 - 99 mg/dL" },
          { color: "#F0A637", nombre: "Prediabetes", valor: "100 - 125 mg/dL" },
          { color: "#C93624", nombre: "Hiperglucemia", valor: "> 126 mg/dL" },
        ],
      },
      {
        titulo: "Después de comer",
        items: [
          { color: "#6BC7D5", nombre: "Hipoglucemia", valor: "< 70 mg/dL" },
          { color: "#69B357", nombre: "Normal", valor: "70 - 140 mg/dL" },
          { color: "#F0A637", nombre: "Prediabetes", valor: "140 - 199 mg/dL" },
          { color: "#C93624", nombre: "Hiperglucemia", valor: "> 200 mg/dL" },
        ],
      },
    ],
    valoresReferencia: [
      { color: "#6BC7D5", nombre: "Hipoglucemia", valor: "< 69 mg/dL" },
      { color: "#69B357", nombre: "Normal en ayuno", valor: "70 - 99 mg/dL" },
      { color: "#F0A637", nombre: "Prediabetes", valor: "100 - 125 mg/dL" },
      { color: "#C93624", nombre: "Hiperglucemia", valor: "> 126 mg/dL" },
    ],
    resumen: crearListaRangos([
      {
        titulo: "Mediciones totales",
        lineas: [
          "• 12 mediciones",
          "Rangos P10",
          "Número de mediciones",
          "• 12 mediciones",
          "• 68 mg/dL",
          "Rangos P90",
          "Número de mediciones",
          "• 20 mediciones",
          "• 130 mg/dL",
        ],
      },
      {
        titulo: "Porcentaje de glucosa",
        lineas: [
          "P10  1%",
          "Normal  98%",
          "P90  1%",
          "Tus niveles de glucosa se han mantenido normales en más del 90% de las mediciones.",
          "¡Excelente! Sigue así y cuida tu salud.",
        ],
      },
    ]),
    filtros: ["Dia", "Semana", "Mes", "Anio"],
    registros: {
      Dia: [
        {
          id: "gl-dia-1",
          principal: "Max - 126 mg/dL",
          secundaria: "Min - 79 mg/dL",
          fecha: "31 Marzo 2026",
          detalle: [
            { etiqueta: "Glucosa en Sangre", valor: "94 mg/dL" },
            { etiqueta: "Estado", valor: "Normal", color: "#69B357" },
            { etiqueta: "Fecha y hora", valor: "Martes 31 de marzo 2026 - 06:04 pm" },
            { etiqueta: "Tipo de medición", valor: "Ayuno" },
            { etiqueta: "Dispositivo", valor: "Agregado manualmente" },
            { etiqueta: "Contexto de medición", valor: "N/A" },
          ],
        },
        {
          id: "gl-dia-2",
          principal: "Max - 120 mg/dL",
          secundaria: "Min - 82 mg/dL",
          fecha: "30 Marzo 2026",
        },
        {
          id: "gl-dia-3",
          principal: "Max - 118 mg/dL",
          secundaria: "Min - 76 mg/dL",
          fecha: "29 Marzo 2026",
        },
      ],
      Semana: [
        {
          id: "gl-semana-1",
          periodo: "Semana 30 Marzo al 5 de Abril",
        },
        {
          id: "gl-semana-2",
          periodo: "Semana 23 al 29 de Marzo",
        },
        {
          id: "gl-semana-3",
          periodo: "Semana 16 al 22 de Marzo",
        },
      ],
      Mes: [
        {
          id: "gl-mes-1",
          periodo: "Marzo 2026",
        },
        {
          id: "gl-mes-2",
          periodo: "Febrero 2026",
        },
        {
          id: "gl-mes-3",
          periodo: "Enero 2026",
        },
      ],
      Anio: [
        {
          id: "gl-anio-1",
          periodo: "2026",
        },
        {
          id: "gl-anio-2",
          periodo: "2025",
        },
      ],
    },
  },
  ActividadFisica: {
    key: "ActividadFisica",
    nombre: "Actividad Física",
    nombreCorto: "Actividad Física",
    vistaPeriodoDefecto: "Mes",
    tituloPeriodo: {
      Dia: "31 Marzo 2026",
      Semana: "Semana del 31 Marzo 2026",
      Mes: "Marzo 2026",
      Anio: "2026",
    },
    valoresTitulo: "Resumen de actividad física",
    valoresReferencia: [
      { color: "#3FAD58", nombre: "Meta cumplida", valor: "≥ 30 min / día" },
      { color: "#F8A737", nombre: "Meta parcial", valor: "15 - 29 min / día" },
      { color: "#FF4040", nombre: "Sin actividad", valor: "< 15 min / día" },
    ],
    resumen: crearListaRangos([
      {
        titulo: "Actividad semanal",
        lineas: ["Número de sesiones:", "• 5 sesiones", "• 185 min totales"],
      },
    ]),
    filtros: ["Dia", "Semana", "Mes", "Anio"],
    registros: {
      Dia: [
        {
          id: "af-dia-1",
          principal: "Max - 60 min",
          secundaria: "Min - 20 min",
          fecha: "31 Marzo 2026",
        },
        {
          id: "af-dia-2",
          principal: "Max - 45 min",
          secundaria: "Min - 15 min",
          fecha: "30 Marzo 2026",
        },
      ],
      Semana: [
        { id: "af-semana-1", periodo: "Semana 30 Marzo al 5 de Abril" },
        { id: "af-semana-2", periodo: "Semana 23 al 29 de Marzo" },
      ],
      Mes: [
        { id: "af-mes-1", periodo: "Marzo 2026" },
        { id: "af-mes-2", periodo: "Febrero 2026" },
      ],
      Anio: [
        { id: "af-anio-1", periodo: "2026" },
        { id: "af-anio-2", periodo: "2025" },
      ],
    },
  },
  CicloMenstrual: {
    key: "CicloMenstrual",
    nombre: "Ciclo Menstrual",
    nombreCorto: "Ciclo Menstrual",
    vistaPeriodoDefecto: "Mes",
    tituloPeriodo: {
      Dia: "31 Marzo 2026",
      Semana: "Semana del 31 Marzo 2026",
      Mes: "Marzo 2026",
      Anio: "2026",
    },
    valoresTitulo: "Resumen de ciclo menstrual",
    valoresReferencia: [
      { color: "#E25353", nombre: "Periodo", valor: "Días registrados" },
      { color: "#F8A737", nombre: "Ovulación", valor: "Ventana fértil" },
      { color: "#6BC7D5", nombre: "Síntomas", valor: "Eventos registrados" },
    ],
    resumen: crearListaRangos([
      {
        titulo: "Ciclo actual",
        lineas: ["Duración estimada:", "• 28 días", "• Próximo periodo: 12 Abr 2026"],
      },
    ]),
    filtros: ["Dia", "Semana", "Mes", "Anio"],
    registros: {
      Dia: [
        {
          id: "cm-dia-1",
          principal: "Max - 3 eventos",
          secundaria: "Min - 1 evento",
          fecha: "31 Marzo 2026",
        },
        {
          id: "cm-dia-2",
          principal: "Max - 2 eventos",
          secundaria: "Min - 0 eventos",
          fecha: "30 Marzo 2026",
        },
      ],
      Semana: [
        { id: "cm-semana-1", periodo: "Semana 30 Marzo al 5 de Abril" },
        { id: "cm-semana-2", periodo: "Semana 23 al 29 de Marzo" },
      ],
      Mes: [
        { id: "cm-mes-1", periodo: "Marzo 2026" },
        { id: "cm-mes-2", periodo: "Febrero 2026" },
      ],
      Anio: [
        { id: "cm-anio-1", periodo: "2026" },
        { id: "cm-anio-2", periodo: "2025" },
      ],
    },
  },
};

export const METRICA_POR_DEFECTO = "PresionArterial";

export const obtenerConfigRegistros = (metrica) =>
  METRICAS_REGISTROS[metrica] ?? METRICAS_REGISTROS[METRICA_POR_DEFECTO];

export const construirItemsLista = (config, filtroActivo) =>
  config.registros[filtroActivo] ?? config.registros[config.vistaPeriodoDefecto] ?? [];

export const construirRegistrosDelDia = (config, registroDiaId) => {
  const registrosDia = construirItemsLista(config, "Dia");
  const diaRegistro =
    registrosDia.find((registro) => registro.id === registroDiaId) ??
    registrosDia[0] ??
    null;

  if (!diaRegistro) {
    return {
      titulo: "",
      items: [],
    };
  }

  if (diaRegistro.registrosDelDia?.length) {
    return {
      titulo: diaRegistro.fecha ?? config.tituloPeriodo.Dia,
      items: diaRegistro.registrosDelDia,
    };
  }

  return {
    titulo: diaRegistro.fecha ?? config.tituloPeriodo.Dia,
    items: [
      {
        id: `${diaRegistro.id}-hora-1`,
        principal: limpiarValorResumen(diaRegistro.principal),
        secundaria: "",
        hora: "09:00 am",
        acento: diaRegistro.acento ?? "#3FAD58",
        detalle: construirDetallePredeterminado(
          config,
          diaRegistro,
          {
            principal: limpiarValorResumen(diaRegistro.principal),
            hora: "09:00 am",
          },
          diaRegistro.fecha ?? config.tituloPeriodo.Dia,
        ),
      },
    ],
  };
};

export const construirDetalleRegistro = (
  config,
  filtroActivo,
  registroId,
  registroDiaId,
) => {
  if (registroDiaId) {
    const { items, titulo } = construirRegistrosDelDia(config, registroDiaId);
    const registroHora = items.find((registro) => registro.id === registroId) ?? items[0] ?? null;

    if (!registroHora) {
      return {
        breadcrumbIntermedio: "Registros del día",
        titulo: config.nombreCorto,
        campos: [],
      };
    }

    return {
      breadcrumbIntermedio: "Registros del día",
      titulo: config.nombreCorto,
      campos: construirDetallePredeterminado(config, null, registroHora, titulo),
    };
  }

  const items = construirItemsLista(config, filtroActivo);
  const item = items.find((registro) => registro.id === registroId) ?? items[0] ?? null;

  if (!item) {
    return {
      breadcrumbIntermedio: "Registros",
      titulo: config.nombreCorto,
      campos: [],
    };
  }

  return {
    breadcrumbIntermedio:
      filtroActivo === "Dia"
        ? "Registros del día"
        : filtroActivo === "Semana"
          ? "Registros de la semana"
          : filtroActivo === "Mes"
            ? "Registros del mes"
            : "Registros del año",
    titulo: config.nombreCorto,
    campos: item.detalle ?? (
      item.periodo
        ? [
            { etiqueta: "Periodo", valor: item.periodo },
          ]
        : [
            { etiqueta: config.nombreCorto, valor: item.principal },
            crearSeparador(),
            { etiqueta: "Resumen", valor: item.secundaria },
            ...(item.fecha ? [{ etiqueta: "Fecha", valor: item.fecha }] : []),
          ]
    ),
  };
};
