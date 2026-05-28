// src/components/TarjetaMedicamento/TarjetasMedicamentosIco.jsx
import React, { useMemo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es-mx";
import TarjetaMedicamentoIco from "./TarjetaMedicamentoIco";
import styles from "./TarjetasMedicamentos.module.css";
import "./animaIcoMedicamentos.css";

import { isTakeDay, buildDailyTimes } from "@/pages/Inicio/Calendario/medicamentoUtils";

// SVGs como componentes
import JarabeIcon from "./icoJarabe.svg?react";
import TabletaIcon from "./icoTableta.svg?react";
import CapsulaIcon from "./icoCapsula.svg?react";
import InyeccionIcon from "./icoInyeccion.svg?react";

dayjs.locale("es-mx");

const iconos = {
  jarabe: JarabeIcon,
  tableta: TabletaIcon,
  inyeccion: InyeccionIcon,
  capsula: CapsulaIcon,
};

// Normaliza ids (evita bug string vs number)
const normId = (v) => (v == null ? "" : String(v));

function inferTipoIcono(rule) {
  // usa presentacion o algún campo que tengas (ajústalo a tu data real)
  const p = String(rule.presentacion || "").toLowerCase();
  if (p.includes("jarabe")) return "jarabe";
  if (p.includes("cáps") || p.includes("caps")) return "capsula";
  if (p.includes("inye")) return "inyeccion";
  return "tableta";
}

function computeHoraYEstado(rule, dayObj) {
  // dayObj: dayjs (día seleccionado en agenda)
  const now = dayjs();
  const isToday = dayObj.isSame(now, "day");

  const times = buildDailyTimes(rule.frecuenciaHoras, rule.horaInicio); // ["8:00 am", ...]
  if (!times.length) return { hora: "", estado: "aiempo" };

  // construimos datetimes del día para cada toma
  const dtList = times.map((tLabel) => {
    const t = dayjs(tLabel, "h:mm a");
    return dayObj.hour(t.hour()).minute(t.minute()).second(0);
  });

  // si es hoy, buscamos la próxima
  let target = dtList[0];
  if (isToday) {
    target = dtList.find((d) => d.isAfter(now)) || dtList[dtList.length - 1];
  }

  const hora = target.format("h:mm a");

  // estado simple:
  // - ahora: faltan <= 30 min
  // - aiempo: falta más
  // - vencida: ya pasó (y no hay siguiente hoy)
  if (isToday) {
    const diffMin = target.diff(now, "minute");
    if (diffMin < -30) return { hora, estado: "vencida" };
    if (diffMin <= 30 && diffMin >= -10) return { hora, estado: "ahora" };
    if (diffMin > 30) return { hora, estado: "aiempo" };
  }

  // si no es hoy, lo dejamos en aiempo
  return { hora, estado: "aiempo" };
}

const TarjetasMedicamentosIco = ({
  medicamentos = [],
  day, // dayjs seleccionado en agenda
  onOpenMedicamento, // fn({ day, medId })
  onChangeMedicamentoColor,
}) => {
  const dayObj = useMemo(() => (day?.$d ? day : dayjs()), [day]);
  const dayKey = useMemo(() => dayObj.format("YYYY-MM-DD"), [dayObj]);

  const medsDelDia = useMemo(() => {
    return (medicamentos || []).filter((r) => isTakeDay(r, dayKey));
  }, [medicamentos, dayKey]);

  return (
    <div className={styles.cntTarjetasMedicamentos}>
      {medsDelDia.map((rule) => {
        const tipoIcono = inferTipoIcono(rule);
        const IconComp = iconos[tipoIcono] || TabletaIcon;
        const { hora, estado } = computeHoraYEstado(rule, dayObj);

        return (
          <TarjetaMedicamentoIco
            key={normId(rule.id)}
            medicamento={rule.medicamento}
            dosis={rule.dosis}
            padecimiento={""} // si no lo usas, déjalo vacío
            hora={hora}
            timer={""} // por ahora no
            estado={estado}
            colorBarra={rule.colorBarra || "#59EDFE"}
            icono={<IconComp />}
            tipoIcono={tipoIcono}
            onChangeColor={(color) =>
              onChangeMedicamentoColor?.({ medId: rule.id, color })
            }
            onOpen={() => onOpenMedicamento?.({ day: dayObj, medId: rule.id })}
          />
        );
      })}

      {medsDelDia.length === 0 && (
        <div style={{ padding: "4.5rem", color: "#94A3B8", fontSize: 13, textAlign: "center" }}>
          No hay medicamentos para este día.
        </div>
      )}
    </div>
  );
};

export default TarjetasMedicamentosIco;
