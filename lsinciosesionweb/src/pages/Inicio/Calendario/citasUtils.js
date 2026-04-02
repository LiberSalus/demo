//src\pages\Inicio\Calendario\citasUtils.js

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/es-mx";

dayjs.extend(customParseFormat);
dayjs.locale("es-mx");

const capitalizar = (texto = "") =>
  texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;

function parsearInicioHorario(horario = "") {
  const horaInicio = String(horario).split("-")[0]?.trim();
  if (!horaInicio) return null;

  const horaParseada = dayjs(horaInicio, ["h:mm a", "h:mma"], "es-mx", true);
  if (!horaParseada.isValid()) return { label: horaInicio };

  return {
    hour: horaParseada.hour(),
    minute: horaParseada.minute(),
    label: horaInicio,
  };
}

export function buildTarjetasCitas(citasPorFecha = {}) {
  const ahora = dayjs();
  const tarjetas = [];

  Object.entries(citasPorFecha || {}).forEach(([claveFecha, citas]) => {
    (citas || []).forEach((cita) => {
      const fechaBase = dayjs(cita?.fecha || claveFecha);

      const horarioTexto = cita?.horario ?? cita?.hora ?? "";
      const horarioParseado = parsearInicioHorario(horarioTexto);

      let fechaHoraCita = fechaBase;
      let hora = horarioParseado?.label || (horarioTexto ? String(horarioTexto) : fechaBase.format("h:mma"));

      if (horarioParseado?.hour != null) {
        fechaHoraCita = fechaBase
          .hour(horarioParseado.hour)
          .minute(horarioParseado.minute)
          .second(0);
      }

      // Si backend no manda estado, se infiere a partir de la hora de inicio.
      let estado = cita?.estado;
      if (!estado) {
        if (fechaHoraCita.isBefore(ahora)) {
          const minutosRetraso = ahora.diff(fechaHoraCita, "minute");
          estado = minutosRetraso > 30 ? "expirada" : "tarde";
        } else {
          estado = "aiempo";
        }
      }

      const fechaTexto = capitalizar(fechaBase.format("dddd DD MMM"));

      const idSeguro =
        cita?.id ??
        (fechaHoraCita.isValid()
          ? `cita-${claveFecha}-${fechaHoraCita.valueOf()}`
          : `cita-${claveFecha}-${Math.random().toString(16).slice(2)}`);

      tarjetas.push({
        id: idSeguro,
        nombre: cita?.medico ?? cita?.nombre ?? "Cita médica",
        especialidad: cita?.especialidad ?? "",
        fecha: fechaTexto,
        hora,
        estado,
        _ts: cita?._ts ?? fechaHoraCita.valueOf(),
      });
    });
  });

  return tarjetas.sort((a, b) => (a._ts ?? 0) - (b._ts ?? 0));
}
