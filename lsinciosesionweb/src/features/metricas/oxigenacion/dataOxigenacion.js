export const datosOxigenacionDiaria = [
  { hora: "00", valor: 92 },
  { hora: "01", valor: 95 },
  { hora: "02", valor: 97 },
  { hora: "03", valor: 95 },
  { hora: "04", valor: 93 },
  { hora: "05", valor: 94 },
  { hora: "06", valor: 100 },
  { hora: "07", valor: 98 },
  { hora: "08", valor: 98 },
  { hora: "09", valor: 95 },
  { hora: "10", valor: 92 },
  { hora: "11", valor: 96 },
  { hora: "12", valor: 100 },
  { hora: "13", valor: 95 },
  { hora: "14", valor: 94 },
  { hora: "15", valor: 100 },
  { hora: "16", valor: 93 },
  { hora: "17", valor: 93 },
];

export const resumenOxigenacion = {
  actual: {
    valor: 93,
    fecha: "19-02-2026",
  },
  rangoDiario: {
    minimo: 65,
    maximo: 118,
  },
  ultimoValor: {
    estado: "Normal",
    valor: 98,
    fecha: "14 - abril - 2026",
    hora: "08:55 am",
  },
  valorAnterior: {
    estado: "Vigilar",
    valor: 91,
    fecha: "13 - abril - 2026",
    hora: "09:35 pm",
  },
};

export const promedioOxigenacion = {
  semana: {
    seleccionActual: "2026-semana-17",
    filtros: [
      { label: "Lun 20 - Dom 26, Oct", value: "2026-semana-17" },
      { label: "Lun 27 - Dom 03, Nov", value: "2026-semana-18" },
    ],
    puntos: [
      { etiqueta: "L", valorMin: 91, horaMin: "08:05 am", valorMax: 93, horaMax: "11:56 pm" },
      { etiqueta: "M", valorMin: 92, horaMin: "07:40 am", valorMax: 94, horaMax: "10:15 pm" },
      { etiqueta: "M", valorMin: 94, horaMin: "08:05 am", valorMax: 96, horaMax: "11:56 pm" },
      { etiqueta: "J", valorMin: 93, horaMin: "09:10 am", valorMax: 94, horaMax: "08:35 pm" },
      { etiqueta: "V", valorMin: 92, horaMin: "07:55 am", valorMax: 93, horaMax: "09:45 pm" },
      { etiqueta: "S", valorMin: 93, horaMin: "10:20 am", valorMax: 94, horaMax: "06:50 pm" },
      { etiqueta: "D", valorMin: 92, horaMin: "08:30 am", valorMax: 93, horaMax: "07:15 pm" },
    ],
  },
  mes: {
    seleccionActual: "2026-10",
    filtros: [
      { label: "Octubre 2026", value: "2026-10" },
      { label: "Noviembre 2026", value: "2026-11" },
    ],
    puntos: [
      { etiqueta: "1", valorMin: 92, horaMin: "08:10 am", valorMax: 93, horaMax: "09:25 pm" },
      { etiqueta: "5", valorMin: 93, horaMin: "07:45 am", valorMax: 94, horaMax: "10:05 pm" },
      { etiqueta: "10", valorMin: 94, horaMin: "08:20 am", valorMax: 95, horaMax: "11:10 pm" },
      { etiqueta: "15", valorMin: 95, horaMin: "09:00 am", valorMax: 96, horaMax: "08:55 pm" },
      { etiqueta: "20", valorMin: 93, horaMin: "07:30 am", valorMax: 95, horaMax: "10:40 pm" },
      { etiqueta: "25", valorMin: 92, horaMin: "08:15 am", valorMax: 94, horaMax: "09:50 pm" },
      { etiqueta: "30", valorMin: 93, horaMin: "07:55 am", valorMax: 94, horaMax: "08:45 pm" },
    ],
  },
  anio: {
    seleccionActual: "2026",
    filtros: [
      { label: "2026", value: "2026" },
      { label: "2025", value: "2025" },
    ],
    puntos: [
      { etiqueta: "ene", valorMin: 92, horaMin: "08:05 am", valorMax: 94, horaMax: "09:40 pm" },
      { etiqueta: "feb", valorMin: 93, horaMin: "08:10 am", valorMax: 95, horaMax: "10:20 pm" },
      { etiqueta: "mar", valorMin: 94, horaMin: "07:55 am", valorMax: 96, horaMax: "11:15 pm" },
      { etiqueta: "abr", valorMin: 95, horaMin: "08:25 am", valorMax: 97, horaMax: "10:05 pm" },
      { etiqueta: "may", valorMin: 95, horaMin: "08:15 am", valorMax: 98, horaMax: "11:30 pm" },
      { etiqueta: "jun", valorMin: 94, horaMin: "07:50 am", valorMax: 97, horaMax: "09:55 pm" },
      { etiqueta: "jul", valorMin: 94, horaMin: "08:05 am", valorMax: 96, horaMax: "10:10 pm" },
      { etiqueta: "ago", valorMin: 93, horaMin: "08:30 am", valorMax: 95, horaMax: "09:35 pm" },
      { etiqueta: "sep", valorMin: 94, horaMin: "07:45 am", valorMax: 96, horaMax: "10:00 pm" },
      { etiqueta: "oct", valorMin: 93, horaMin: "08:20 am", valorMax: 95, horaMax: "09:25 pm" },
      { etiqueta: "nov", valorMin: 92, horaMin: "08:10 am", valorMax: 94, horaMax: "08:50 pm" },
      { etiqueta: "dic", valorMin: 91, horaMin: "07:40 am", valorMax: 93, horaMax: "08:15 pm" },
    ],
  },
};

export const histogramaOxigenacion = [
  { etiqueta: "93%", valor: 30, color: "#52b85d" },
  { etiqueta: "94%", valor: 48, color: "#52b85d" },
  { etiqueta: "95%", valor: 54, color: "#52b85d" },
  { etiqueta: "96%", valor: 70, color: "#81b53f" },
  { etiqueta: "97%", valor: 54, color: "#52b85d" },
  { etiqueta: "98%", valor: 42, color: "#52b85d" },
  { etiqueta: "99%", valor: 24, color: "#52b85d" },
  { etiqueta: "100%", valor: 6, color: "#52b85d" },
];
