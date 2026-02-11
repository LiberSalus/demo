//src\pages\Inicio\Calendario\citasUtils.js

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/es-mx";

dayjs.extend(customParseFormat);
dayjs.locale("es-mx");

const cap = (s = "") => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Convierte "10:30 am - 11:00 am" -> { hour, minute, label }
function parseHorarioStart(horario = "") {
  const start = String(horario).split("-")[0]?.trim(); // "10:30 am"
  if (!start) return null;

  const t = dayjs(start, ["h:mm a", "h:mma"], "es-mx", true);
  if (!t.isValid()) return { label: start };
  return { hour: t.hour(), minute: t.minute(), label: start };
}

export function buildTarjetasCitas(citasPorFecha = {}) {
  const now = dayjs();
  const out = [];

  Object.entries(citasPorFecha || {}).forEach(([key, citas]) => {
    (citas || []).forEach((c) => {
      const dBase = dayjs(c?.fecha || key); // fecha ISO o key "YYYY-MM-DD"

      // ✅ compat: horario/hora
      const horarioStr = c?.horario ?? c?.hora ?? "";
      const parsed = parseHorarioStart(horarioStr);

      let dt = dBase;
      let hora =
        parsed?.label ||
        (horarioStr ? String(horarioStr) : dBase.format("h:mma"));

      if (parsed?.hour != null) {
        dt = dBase.hour(parsed.hour).minute(parsed.minute).second(0);
      }

      // Estado automático (si viene ya definido, respétalo)
      let estado = c?.estado;
      if (!estado) {
        if (dt.isBefore(now)) {
          const minsLate = now.diff(dt, "minute");
          estado = minsLate > 30 ? "expirada" : "tarde";
        } else {
          estado = "aiempo";
        }
      }

      const fechaTxt = cap(dBase.format("dddd DD MMM")); // "Jueves 06 nov"

      // ✅ id: preferir UUID guardado; fallback estable por ts+key
      const safeId =
        c?.id ??
        (dt.isValid()
          ? `cita-${key}-${dt.valueOf()}`
          : `cita-${key}-${Math.random().toString(16).slice(2)}`);

      out.push({
        id: safeId,
        nombre: c?.medico ?? c?.nombre ?? "Cita médica",
        especialidad: c?.especialidad ?? "",
        fecha: fechaTxt,
        hora,
        estado,
        _ts: c?._ts ?? dt.valueOf(),
      });
    });
  });

  return out.sort((a, b) => (a._ts ?? 0) - (b._ts ?? 0));
}
