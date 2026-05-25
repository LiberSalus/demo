const crearFechaHaceMinutos = (minutos) => {
  const fecha = new Date();
  fecha.setMinutes(fecha.getMinutes() - minutos, 0, 0);
  return fecha.toISOString();
};

const NOMBRES_MEDICAMENTOS = ["Losartán", "Amlodipino", "Captopril"];

const crearRegistroHistoricoDiasAtras = (
  id,
  diasAtras,
  hora,
  minutos,
  sistolica,
  diastolica,
  medicamento = null
) => {
  const fecha = new Date();
  fecha.setHours(hora, minutos, 0, 0);
  fecha.setDate(fecha.getDate() - diasAtras);

  return {
    id,
    fechaHoraISO: fecha.toISOString(),
    createdAtMs: fecha.getTime(),
    sistolica,
    diastolica,
    medicamento,
  };
};

export const REGISTROS_PRESION_DIARIA_MOCK = [
  {
    id: "pa-1",
    fechaHoraISO: crearFechaHaceMinutos(180),
    sistolica: 126,
    diastolica: 80,
    medicamento: NOMBRES_MEDICAMENTOS[0],
  },
  {
    id: "pa-2",
    fechaHoraISO: crearFechaHaceMinutos(90),
    sistolica: 130,
    diastolica: 90,
    medicamento: NOMBRES_MEDICAMENTOS[1],
  },
  {
    id: "pa-3",
    fechaHoraISO: crearFechaHaceMinutos(30),
    sistolica: 114,
    diastolica: 79,
    medicamento: NOMBRES_MEDICAMENTOS[2],
  },
];

export const REGISTROS_PRESION_HISTORIAL_MOCK = [
  crearRegistroHistoricoDiasAtras("pah-1", 2, 8, 10, 118, 76, NOMBRES_MEDICAMENTOS[0]),
  crearRegistroHistoricoDiasAtras("pah-2", 3, 21, 20, 122, 79, NOMBRES_MEDICAMENTOS[0]),
  crearRegistroHistoricoDiasAtras("pah-3", 5, 7, 45, 128, 82, NOMBRES_MEDICAMENTOS[1]),
  crearRegistroHistoricoDiasAtras("pah-4", 6, 20, 5, 124, 80, NOMBRES_MEDICAMENTOS[1]),
  crearRegistroHistoricoDiasAtras("pah-5", 8, 8, 0, 116, 74, NOMBRES_MEDICAMENTOS[2]),
  crearRegistroHistoricoDiasAtras("pah-6", 10, 19, 30, 134, 88, NOMBRES_MEDICAMENTOS[2]),
  crearRegistroHistoricoDiasAtras("pah-7", 12, 8, 15, 129, 84, NOMBRES_MEDICAMENTOS[0]),
  crearRegistroHistoricoDiasAtras("pah-8", 14, 18, 50, 121, 78, NOMBRES_MEDICAMENTOS[0]),
  crearRegistroHistoricoDiasAtras("pah-9", 18, 7, 55, 126, 81, NOMBRES_MEDICAMENTOS[1]),
  crearRegistroHistoricoDiasAtras("pah-10", 22, 20, 10, 132, 86, NOMBRES_MEDICAMENTOS[1]),
  crearRegistroHistoricoDiasAtras("pah-11", 27, 8, 35, 119, 77, NOMBRES_MEDICAMENTOS[2]),
  crearRegistroHistoricoDiasAtras("pah-12", 31, 20, 0, 124, 82, NOMBRES_MEDICAMENTOS[2]),
  crearRegistroHistoricoDiasAtras("pah-13", 37, 8, 25, 136, 89, NOMBRES_MEDICAMENTOS[0]),
  crearRegistroHistoricoDiasAtras("pah-14", 44, 19, 15, 127, 83, NOMBRES_MEDICAMENTOS[0]),
  crearRegistroHistoricoDiasAtras("pah-15", 52, 7, 40, 117, 75, NOMBRES_MEDICAMENTOS[1]),
  crearRegistroHistoricoDiasAtras("pah-16", 61, 20, 20, 131, 85, NOMBRES_MEDICAMENTOS[1]),
  crearRegistroHistoricoDiasAtras("pah-17", 73, 8, 5, 123, 79, NOMBRES_MEDICAMENTOS[2]),
  crearRegistroHistoricoDiasAtras("pah-18", 86, 21, 0, 138, 91, NOMBRES_MEDICAMENTOS[2]),
  crearRegistroHistoricoDiasAtras("pah-19", 102, 8, 50, 120, 78, NOMBRES_MEDICAMENTOS[0]),
  crearRegistroHistoricoDiasAtras("pah-20", 118, 19, 40, 126, 82, NOMBRES_MEDICAMENTOS[0]),
  crearRegistroHistoricoDiasAtras("pah-21", 136, 8, 30, 129, 84, NOMBRES_MEDICAMENTOS[1]),
  crearRegistroHistoricoDiasAtras("pah-22", 154, 20, 25, 133, 87, NOMBRES_MEDICAMENTOS[1]),
  crearRegistroHistoricoDiasAtras("pah-23", 184, 7, 35, 121, 77, NOMBRES_MEDICAMENTOS[2]),
  crearRegistroHistoricoDiasAtras("pah-24", 218, 20, 10, 128, 83, NOMBRES_MEDICAMENTOS[2]),
  crearRegistroHistoricoDiasAtras("pah-25", 246, 8, 20, 135, 88, NOMBRES_MEDICAMENTOS[0]),
  crearRegistroHistoricoDiasAtras("pah-26", 280, 19, 55, 124, 80, NOMBRES_MEDICAMENTOS[0]),
  crearRegistroHistoricoDiasAtras("pah-27", 315, 8, 45, 118, 76, NOMBRES_MEDICAMENTOS[1]),
];
