// Contrato base del registro diario de frecuencia cardiaca.
// Este es el formato que despues puede venir desde backend.
//
// {
//   id: string,
//   fechaHoraISO: string,
//   ppm: number,
//   tipoRegistro: 'reposo' | 'actividad'
// }

const diaMock = '2026-03-12'

const crearFechaHoraISO = (hora, minuto = 0) => {
  const horaTxt = String(hora).padStart(2, '0')
  const minutoTxt = String(minuto).padStart(2, '0')
  return `${diaMock}T${horaTxt}:${minutoTxt}:00`
}

// Registros de ejemplo del dia (solo lecturas reales, sin horas vacias).
export const registrosFrecuenciaDiariaMock = [
  { id: 'reg-001', fechaHoraISO: crearFechaHoraISO(0), ppm: 60, tipoRegistro: 'reposo' },
  { id: 'reg-002', fechaHoraISO: crearFechaHoraISO(1), ppm: 95, tipoRegistro: 'actividad' },
  { id: 'reg-003', fechaHoraISO: crearFechaHoraISO(2), ppm: 112, tipoRegistro: 'actividad' },
  { id: 'reg-004', fechaHoraISO: crearFechaHoraISO(3), ppm: 72, tipoRegistro: 'reposo' },
  { id: 'reg-005', fechaHoraISO: crearFechaHoraISO(4), ppm: 70, tipoRegistro: 'reposo' },
  { id: 'reg-006', fechaHoraISO: crearFechaHoraISO(5), ppm: 138, tipoRegistro: 'actividad' },
  { id: 'reg-007', fechaHoraISO: crearFechaHoraISO(6), ppm: 122, tipoRegistro: 'actividad' },
  { id: 'reg-008', fechaHoraISO: crearFechaHoraISO(7), ppm: 119, tipoRegistro: 'actividad' },
  { id: 'reg-009', fechaHoraISO: crearFechaHoraISO(8), ppm: 66, tipoRegistro: 'reposo' },
  { id: 'reg-010', fechaHoraISO: crearFechaHoraISO(9), ppm: 64, tipoRegistro: 'reposo' },
  { id: 'reg-011', fechaHoraISO: crearFechaHoraISO(10), ppm: 108, tipoRegistro: 'actividad' },
  { id: 'reg-012', fechaHoraISO: crearFechaHoraISO(11), ppm: 136, tipoRegistro: 'actividad' },
  { id: 'reg-013', fechaHoraISO: crearFechaHoraISO(12), ppm: 78, tipoRegistro: 'reposo' },
  { id: 'reg-014', fechaHoraISO: crearFechaHoraISO(13), ppm: 140, tipoRegistro: 'actividad' },
  { id: 'reg-015', fechaHoraISO: crearFechaHoraISO(14), ppm: 78, tipoRegistro: 'reposo' },
  { id: 'reg-016', fechaHoraISO: crearFechaHoraISO(15), ppm: 69, tipoRegistro: 'reposo' },
]

