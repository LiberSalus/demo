import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { buildDailyTimes, isTakeDay } from "./medicamentoUtils";

import sonidoCitaMp3 from "./Sonidos/universfield-new-notification-08-352461.mp3";
import sonidoCitaOgg from "./Sonidos/universfield-new-notification-08-352461.ogg";
import sonidoMedicamentoMp3 from "./Sonidos/universfield-new-notification-09-352705.mp3";
import sonidoMedicamentoOgg from "./Sonidos/universfield-new-notification-09-352705.ogg";
import sonidoHoraMp3 from "./Sonidos/universfield-soft-bell-ding-485895.mp3";
import sonidoHoraOgg from "./Sonidos/universfield-soft-bell-ding-485895.ogg";

dayjs.locale("es");
dayjs.extend(customParseFormat);

const ARCHIVOS_SONIDO = {
  recordatorioCita: {
    mp3: sonidoCitaMp3,
    ogg: sonidoCitaOgg,
  },
  recordatorioMedicamento: {
    mp3: sonidoMedicamentoMp3,
    ogg: sonidoMedicamentoOgg,
  },
  vencimientoAhora: {
    mp3: sonidoHoraMp3,
    ogg: sonidoHoraOgg,
  },
};

function resolverSonidoPreferido(archivos) {
  if (typeof document === "undefined") return archivos.mp3;

  const audioPrueba = document.createElement("audio");
  const puedeReproducirOgg =
    typeof audioPrueba.canPlayType === "function"
      ? audioPrueba.canPlayType('audio/ogg; codecs="vorbis"')
      : "";

  return puedeReproducirOgg ? archivos.ogg : archivos.mp3;
}

function obtenerFechaHoraInicio(claveFecha, etiquetaHora) {
  if (!claveFecha || !etiquetaHora) return null;

  const horaParseada = dayjs(
    String(etiquetaHora).trim(),
    ["h:mm a", "h:mma"],
    true
  );
  if (!horaParseada.isValid()) return null;

  return dayjs(claveFecha)
    .hour(horaParseada.hour())
    .minute(horaParseada.minute())
    .second(0)
    .millisecond(0);
}

function obtenerInicioCita(cita, claveFechaRespaldo) {
  const claveFechaBase = dayjs(cita?.fecha || claveFechaRespaldo).format(
    "YYYY-MM-DD"
  );
  const horarioTexto = String(cita?.horario ?? cita?.hora ?? "");
  const etiquetaInicio = horarioTexto.split("-")[0]?.trim();

  return obtenerFechaHoraInicio(claveFechaBase, etiquetaInicio);
}

export default function useAgendaAlerts(citasPorFecha, medicamentos) {
  const refAudioDesbloqueado = useRef(false);
  const refMapaSonidosPreferidos = useRef({});
  const refAlertasDisparadas = useRef(new Map());

  useEffect(() => {
    refMapaSonidosPreferidos.current = {
      recordatorioCita: resolverSonidoPreferido(ARCHIVOS_SONIDO.recordatorioCita),
      recordatorioMedicamento: resolverSonidoPreferido(
        ARCHIVOS_SONIDO.recordatorioMedicamento
      ),
      vencimientoAhora: resolverSonidoPreferido(ARCHIVOS_SONIDO.vencimientoAhora),
    };

    const desbloquearAudio = () => {
      refAudioDesbloqueado.current = true;
      window.removeEventListener("pointerdown", desbloquearAudio);
      window.removeEventListener("keydown", desbloquearAudio);
      window.removeEventListener("touchstart", desbloquearAudio);
    };

    window.addEventListener("pointerdown", desbloquearAudio, { passive: true });
    window.addEventListener("keydown", desbloquearAudio);
    window.addEventListener("touchstart", desbloquearAudio, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", desbloquearAudio);
      window.removeEventListener("keydown", desbloquearAudio);
      window.removeEventListener("touchstart", desbloquearAudio);
    };
  }, []);

  useEffect(() => {
    const reproducirSonido = async (claveSonido, metaAlerta = null) => {
      if (!refAudioDesbloqueado.current) return;

      const origen = refMapaSonidosPreferidos.current?.[claveSonido];
      if (!origen) return;

      window.dispatchEvent(
        new CustomEvent("calendar_alert_triggered", {
          detail: {
            soundKey: claveSonido,
            at: Date.now(),
            ...metaAlerta,
          },
        })
      );

      try {
        const audio = new Audio(origen);
        audio.preload = "auto";
        audio.currentTime = 0;
        await audio.play();
      } catch {
        null;
      }
    };

    const registrarDisparo = (clave, marcaTiempo) => {
      const historial = refAlertasDisparadas.current;
      const existente = historial.get(clave);
      if (existente) return false;

      historial.set(clave, marcaTiempo);

      const corte = marcaTiempo - 1000 * 60 * 60 * 24 * 3;
      for (const [claveGuardada, tiempoGuardado] of historial.entries()) {
        if (tiempoGuardado < corte) historial.delete(claveGuardada);
      }

      return true;
    };

    const agregarAlertasCitas = (minutoActual, sonidosPorReproducir) => {
      Object.entries(citasPorFecha || {}).forEach(([claveFecha, citas]) => {
        (citas || []).forEach((cita) => {
          const inicioCita = obtenerInicioCita(cita, claveFecha);
          if (!inicioCita?.isValid?.()) return;

          if (cita?.recordar) {
            const momentoRecordatorio = inicioCita.subtract(1, "day");
            if (momentoRecordatorio.isSame(minutoActual, "minute")) {
              const claveRecordatorio = `cita-reminder:${cita.id ?? inicioCita.valueOf()}:${momentoRecordatorio.valueOf()}`;
              if (registrarDisparo(claveRecordatorio, momentoRecordatorio.valueOf())) {
                sonidosPorReproducir.add(
                  JSON.stringify({
                    soundKey: "recordatorioCita",
                    type: "cita",
                    citaTipo: cita?.tipoCita ?? "presencial",
                    title: "Alerta de cita médica",
                    timeLabel: inicioCita.format("h:mm a"),
                  })
                );
              }
            }
          }

          if (inicioCita.isSame(minutoActual, "minute")) {
            const claveVencimiento = `cita-due:${cita.id ?? inicioCita.valueOf()}:${inicioCita.valueOf()}`;
            if (registrarDisparo(claveVencimiento, inicioCita.valueOf())) {
              sonidosPorReproducir.add(
                JSON.stringify({
                  soundKey: "vencimientoAhora",
                  type: "cita",
                  citaTipo: cita?.tipoCita ?? "presencial",
                  title: "Alerta de cita médica",
                  timeLabel: inicioCita.format("h:mm a"),
                })
              );
            }
          }
        });
      });
    };

    const agregarAlertasMedicamentos = (minutoActual, sonidosPorReproducir) => {
      // Se evalúan ayer, hoy y mañana para cubrir cambios de día y tratamientos cercanos.
      const diasCandidatos = [
        minutoActual.subtract(1, "day"),
        minutoActual,
        minutoActual.add(1, "day"),
      ];

      (medicamentos || []).forEach((regla) => {
        diasCandidatos.forEach((diaRef) => {
          const claveDia = diaRef.format("YYYY-MM-DD");
          if (!isTakeDay(regla, claveDia)) return;

          const horasDosis = buildDailyTimes(
            regla.frecuenciaHoras,
            regla.horaInicio
          );
          horasDosis.forEach((etiquetaHora) => {
            const momentoDosis = obtenerFechaHoraInicio(claveDia, etiquetaHora);
            if (!momentoDosis?.isValid?.()) return;

            if (regla?.recordatorioMin != null) {
              const momentoRecordatorio = momentoDosis.subtract(
                Number(regla.recordatorioMin || 0),
                "minute"
              );
              if (momentoRecordatorio.isSame(minutoActual, "minute")) {
                const claveRecordatorio = `med-reminder:${regla.id ?? momentoDosis.valueOf()}:${momentoRecordatorio.valueOf()}`;
                if (registrarDisparo(claveRecordatorio, momentoRecordatorio.valueOf())) {
                  sonidosPorReproducir.add(
                    JSON.stringify({
                      soundKey: "recordatorioMedicamento",
                      type: "medicamento",
                      title: "Alerta de medicamento",
                      timeLabel: momentoDosis.format("h:mm a"),
                    })
                  );
                }
              }
            }

            if (momentoDosis.isSame(minutoActual, "minute")) {
              const claveVencimiento = `med-due:${regla.id ?? momentoDosis.valueOf()}:${momentoDosis.valueOf()}`;
              if (registrarDisparo(claveVencimiento, momentoDosis.valueOf())) {
                sonidosPorReproducir.add(
                  JSON.stringify({
                    soundKey: "vencimientoAhora",
                    type: "medicamento",
                    title: "Alerta de medicamento",
                    timeLabel: momentoDosis.format("h:mm a"),
                  })
                );
              }
            }
          });
        });
      });
    };

    const ejecutarRevisionAlertas = () => {
      const minutoActual = dayjs().second(0).millisecond(0);
      const sonidosPorReproducir = new Set();

      agregarAlertasCitas(minutoActual, sonidosPorReproducir);
      agregarAlertasMedicamentos(minutoActual, sonidosPorReproducir);

      sonidosPorReproducir.forEach((payload) => {
        const metaAlerta = JSON.parse(payload);
        reproducirSonido(metaAlerta.soundKey, metaAlerta);
      });
    };

    ejecutarRevisionAlertas();
    const temporizador = window.setInterval(ejecutarRevisionAlertas, 15000);

    return () => window.clearInterval(temporizador);
  }, [citasPorFecha, medicamentos]);
}
