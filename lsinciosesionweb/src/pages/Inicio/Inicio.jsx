//src\pages\Inicio\Inicio.jsx
import React, { useEffect, useRef, useState } from "react";
import styles from "./inicio.module.css";
import TarjetaAlertas from "@/components/Tarjetas/TarjetaAlertas/TarjetaAlerta";
import TarjetaBienestar from "@/components/Tarjetas/TarjetaBienestar/TarjetaBienestar";
import TarjetaCarrucel from "@/components/Tarjetas/TarjetaCarrucel/TarjetaCarrucel";
import TrjEstadoCuestionario from "@/components/Tarjetas/TarjetaCuestionarios/TrjEstadoCuestionario";
import TarjetaCuestionario from "@/components/Tarjetas/TarjetaCuestionarios/TarjetaCuestionario";
import TarjetaEvaluacion from "@/components/Tarjetas/TarjetaEvaluacion/TarjetaEvaluacion";
import mona from "./monaP.webp";
import mono from "./monoP.webp";
import manchaA from "./manchaA.svg";
import manchaR from "./manchaR.svg";
import cuadro from "./cuadro.svg";
import ProgCora from "@/components/ProgresoCorazon/ProgCora";
import TarjetaPie from "@/components/Tarjetas/TarjetaPie/TarjetaPie";
import Noticia from "./TarjetaNoticia/Noticia";
import Derechos from "@/components/Derechos/Derechos"

import dayjs from "dayjs";
import "dayjs/locale/es";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.locale("es");
dayjs.extend(customParseFormat);

import TarjetaLogro from "@/components/TarjetaLogro/TarjetaLogro";
import TarjetaSalud from "./TarjetaSalud/TarjetaSalud";
import TarjetasMedicamentosIco from "./TarjetaMedicamento/TarjetasMedicamentosIco";
import TarjetaAreas from "./TarjetasAreas/TarjetaAreas";
import TarjetaNoticias from "./TarjetaNoticias/TarjetaNoticias";
import TarjetasCitas from "./TarjetasCitas/TarjetasCitas";

import CalendarioInicio from "./Calendario/CalendarioInicio";

import Mona3d from "./Monos3d/Mona3d";
import Mono3d from "./Monos3d/Mono3d";

// ✅ NUEVO: storage de citas (localStorage)
import {
  loadCitasPorFecha,
  saveCitasPorFecha,
} from "./Calendario/storageCitas";
import {
  buildDailyTimes,
  isTakeDay,
} from "./Calendario/MedicamentoUtils";

import sonidoCitaMp3 from "./Calendario/Sonidos/universfield-new-notification-08-352461.mp3";
import sonidoCitaOgg from "./Calendario/Sonidos/universfield-new-notification-08-352461.ogg";
import sonidoMedicamentoMp3 from "./Calendario/Sonidos/universfield-new-notification-09-352705.mp3";
import sonidoMedicamentoOgg from "./Calendario/Sonidos/universfield-new-notification-09-352705.ogg";
import sonidoHoraMp3 from "./Calendario/Sonidos/universfield-soft-bell-ding-485895.mp3";
import sonidoHoraOgg from "./Calendario/Sonidos/universfield-soft-bell-ding-485895.ogg";

const SOUND_FILES = {
  citaReminder: {
    mp3: sonidoCitaMp3,
    ogg: sonidoCitaOgg,
  },
  medicamentoReminder: {
    mp3: sonidoMedicamentoMp3,
    ogg: sonidoMedicamentoOgg,
  },
  dueNow: {
    mp3: sonidoHoraMp3,
    ogg: sonidoHoraOgg,
  },
};

function resolvePreferredSound(files) {
  if (typeof document === "undefined") return files.mp3;

  const probe = document.createElement("audio");
  const canPlayOgg = typeof probe.canPlayType === "function"
    ? probe.canPlayType('audio/ogg; codecs="vorbis"')
    : "";

  return canPlayOgg ? files.ogg : files.mp3;
}

function parseStartDateTime(dateKey, timeLabel) {
  if (!dateKey || !timeLabel) return null;

  const parsedTime = dayjs(String(timeLabel).trim(), ["h:mm a", "h:mma"], true);
  if (!parsedTime.isValid()) return null;

  return dayjs(dateKey)
    .hour(parsedTime.hour())
    .minute(parsedTime.minute())
    .second(0)
    .millisecond(0);
}

function parseCitaStartDateTime(cita, fallbackDateKey) {
  const baseDateKey = dayjs(cita?.fecha || fallbackDateKey).format("YYYY-MM-DD");
  const horarioStr = String(cita?.horario ?? cita?.hora ?? "");
  const startLabel = horarioStr.split("-")[0]?.trim();

  return parseStartDateTime(baseDateKey, startLabel);
}

export default function Inicio() {
  const [nombre, setNombre] = useState("Usuario");
  const [esMujer, setEsMujer] = useState(false);
  const medsScrollRef = useRef(null);
  const citasScrollRef = useRef(null);
  const audioUnlockedRef = useRef(false);
  const preferredSoundMapRef = useRef({});
  const firedAlertsRef = useRef(new Map());
  const [scrollState, setScrollState] = useState({
    medicamentos: { canLeft: false, canRight: false },
    citas: { canLeft: false, canRight: false },
  });

  // ✅ estado central medicamentos (arriba de todo)
  const [medicamentos, setMedicamentos] = useState(() => {
    try {
      const raw = localStorage.getItem("ls_medicamentos_rules");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [selectedMedId, setSelectedMedId] = useState(null);

  // ✅ con qué tab abre el modal
  const [agendaFocus, setAgendaFocus] = useState("citas");

  // ✅ modal agenda
  const [openAgendaModal, setOpenAgendaModal] = useState(false);
  const [selectedAgendaDay, setSelectedAgendaDay] = useState(dayjs());

  const CITAS_INICIALES = {
    "2025-11-19": [
      {
        id: 1,
        medico: "Dra. Regina Bustos Díaz",
        especialidad: "Cardiología",
        horario: "10:30 am - 11:00 am",
        tipo: "presencial",
        lugar: "Hospital San Ángel Inn, Torre Mitikah piso 17",
        notas: "Llevar resultados de laboratorio.",
      },
    ],
  };

  // ✅ NUEVO: citas desde localStorage (si no hay, usa CITAS_INICIALES)
  const [citasPorFecha, setCitasPorFecha] = useState(() =>
    loadCitasPorFecha(CITAS_INICIALES)
  );

  // ✅ Persistencia medicamentos
  useEffect(() => {
    try {
      localStorage.setItem("ls_medicamentos_rules", JSON.stringify(medicamentos));
    } catch {
      null;
    }
  }, [medicamentos]);

  useEffect(() => {
    if (typeof esMujer !== "boolean") return;

    window.dispatchEvent(
      new CustomEvent("perfil_min_updated", {
        detail: { esMujer },
      })
    );
  }, [esMujer]);

  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-container");

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        e.currentTarget.scrollLeft += e.deltaY;
      }
    };

    elements.forEach((el) => {
      el.addEventListener("wheel", handleWheel, { passive: false });
    });

    return () => {
      elements.forEach((el) => {
        el.removeEventListener("wheel", handleWheel);
      });
    };
  }, []);

  const updateScrollButtons = (key, element) => {
    if (!element) return;

    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    setScrollState((prev) => ({
      ...prev,
      [key]: {
        canLeft: element.scrollLeft > 8,
        canRight: maxScrollLeft - element.scrollLeft > 8,
      },
    }));
  };

  useEffect(() => {
    const configs = [
      { key: "medicamentos", ref: medsScrollRef },
      { key: "citas", ref: citasScrollRef },
    ];

    const cleanups = configs
      .map(({ key, ref }) => {
        const element = ref.current;
        if (!element) return null;

        const handleUpdate = () => updateScrollButtons(key, element);

        handleUpdate();
        element.addEventListener("scroll", handleUpdate, { passive: true });
        window.addEventListener("resize", handleUpdate);

        return () => {
          element.removeEventListener("scroll", handleUpdate);
          window.removeEventListener("resize", handleUpdate);
        };
      })
      .filter(Boolean);

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [medicamentos, citasPorFecha, selectedAgendaDay]);

  const scrollCards = (ref, direction, key) => {
    const element = ref.current;
    if (!element) return;

    const amount = Math.max(element.clientWidth * 0.72, 180);
    element.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });

    window.setTimeout(() => updateScrollButtons(key, element), 260);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("perfil_min");
      if (raw) {
        const p = JSON.parse(raw);

        // nombre
        if (p?.nombre) setNombre(p.nombre);
        if (!p?.nombre && p?.first_name) {
          setNombre(`${p.first_name} ${p.last_name ?? ""}`.trim());
        }

        // género / sexo (ajusta al nombre real que tengan en backend)
        const sexo = p?.sexo || p?.genero || p?.gender;
        if (sexo) {
          const s = String(sexo).toLowerCase();
          const mujer =
            s === "f" || s === "mujer" || s === "femenino" || s === "female";
          setEsMujer(mujer);
        }

        window.dispatchEvent(new Event("perfil_min_updated"));
      }
    } catch {
      null;
    }
  }, []);

  useEffect(() => {
    preferredSoundMapRef.current = {
      citaReminder: resolvePreferredSound(SOUND_FILES.citaReminder),
      medicamentoReminder: resolvePreferredSound(SOUND_FILES.medicamentoReminder),
      dueNow: resolvePreferredSound(SOUND_FILES.dueNow),
    };

    const unlockAudio = () => {
      audioUnlockedRef.current = true;
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };

    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio);
    window.addEventListener("touchstart", unlockAudio, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  useEffect(() => {
    const playSound = async (soundKey, alertMeta = null) => {
      if (!audioUnlockedRef.current) return;

      const src = preferredSoundMapRef.current?.[soundKey];
      if (!src) return;

      window.dispatchEvent(
        new CustomEvent("calendar_alert_triggered", {
          detail: {
            soundKey,
            at: Date.now(),
            ...alertMeta,
          },
        }),
      );

      try {
        const audio = new Audio(src);
        audio.preload = "auto";
        audio.currentTime = 0;
        await audio.play();
      } catch {
        null;
      }
    };

    const registerTrigger = (key, atTs) => {
      const history = firedAlertsRef.current;
      const existing = history.get(key);
      if (existing) return false;

      history.set(key, atTs);

      const cutoff = atTs - 1000 * 60 * 60 * 24 * 3;
      for (const [savedKey, savedTs] of history.entries()) {
        if (savedTs < cutoff) history.delete(savedKey);
      }

      return true;
    };

    const runAlertCheck = () => {
      const nowMinute = dayjs().second(0).millisecond(0);
      const soundsToPlay = new Set();

      Object.entries(citasPorFecha || {}).forEach(([dateKey, citas]) => {
        (citas || []).forEach((cita) => {
          const citaStart = parseCitaStartDateTime(cita, dateKey);
          if (!citaStart?.isValid?.()) return;

          if (cita?.recordar) {
            const reminderAt = citaStart.subtract(1, "day");
            if (reminderAt.isSame(nowMinute, "minute")) {
              const reminderKey = `cita-reminder:${cita.id ?? citaStart.valueOf()}:${reminderAt.valueOf()}`;
              if (registerTrigger(reminderKey, reminderAt.valueOf())) {
                soundsToPlay.add(
                  JSON.stringify({
                    soundKey: "citaReminder",
                    type: "cita",
                    citaTipo: cita?.tipoCita ?? "presencial",
                    title: "Alerta de cita médica",
                    timeLabel: citaStart.format("h:mm a"),
                  }),
                );
              }
            }
          }

          if (citaStart.isSame(nowMinute, "minute")) {
            const dueKey = `cita-due:${cita.id ?? citaStart.valueOf()}:${citaStart.valueOf()}`;
            if (registerTrigger(dueKey, citaStart.valueOf())) {
                soundsToPlay.add(
                  JSON.stringify({
                    soundKey: "dueNow",
                    type: "cita",
                    citaTipo: cita?.tipoCita ?? "presencial",
                    title: "Alerta de cita médica",
                    timeLabel: citaStart.format("h:mm a"),
                  }),
              );
            }
          }
        });
      });

      const dayCandidates = [
        nowMinute.subtract(1, "day"),
        nowMinute,
        nowMinute.add(1, "day"),
      ];

      (medicamentos || []).forEach((rule) => {
        dayCandidates.forEach((dayRef) => {
          const dayKey = dayRef.format("YYYY-MM-DD");
          if (!isTakeDay(rule, dayKey)) return;

          const doseTimes = buildDailyTimes(rule.frecuenciaHoras, rule.horaInicio);
          doseTimes.forEach((timeLabel) => {
            const doseAt = parseStartDateTime(dayKey, timeLabel);
            if (!doseAt?.isValid?.()) return;

            if (rule?.recordatorioMin != null) {
              const reminderAt = doseAt.subtract(Number(rule.recordatorioMin || 0), "minute");
              if (reminderAt.isSame(nowMinute, "minute")) {
                const reminderKey = `med-reminder:${rule.id ?? doseAt.valueOf()}:${reminderAt.valueOf()}`;
                if (registerTrigger(reminderKey, reminderAt.valueOf())) {
                  soundsToPlay.add(
                    JSON.stringify({
                    soundKey: "medicamentoReminder",
                    type: "medicamento",
                    title: "Alerta de medicamento",
                      timeLabel: doseAt.format("h:mm a"),
                    }),
                  );
                }
              }
            }

            if (doseAt.isSame(nowMinute, "minute")) {
              const dueKey = `med-due:${rule.id ?? doseAt.valueOf()}:${doseAt.valueOf()}`;
              if (registerTrigger(dueKey, doseAt.valueOf())) {
                soundsToPlay.add(
                  JSON.stringify({
                    soundKey: "dueNow",
                    type: "medicamento",
                    title: "Alerta de medicamento",
                    timeLabel: doseAt.format("h:mm a"),
                  }),
                );
              }
            }
          });
        });
      });

      soundsToPlay.forEach((payload) => {
        const alertMeta = JSON.parse(payload);
        playSound(alertMeta.soundKey, alertMeta);
      });
    };

    runAlertCheck();
    const timer = window.setInterval(runAlertCheck, 15000);

    return () => window.clearInterval(timer);
  }, [citasPorFecha, medicamentos]);

  // ✅ NUEVO: Persistencia citas
  useEffect(() => {
    saveCitasPorFecha(citasPorFecha);
  }, [citasPorFecha]);

  const avatarImg = esMujer ? mona : mono;
  const manchaImg = esMujer ? manchaR : manchaA;
  const nombreCorto = String(nombre || "Usuario").trim().split(/\s+/)[0];

  // ✅ Helpers para abrir modal desde tarjetas
  const openModalCitas = (tsOrDayjs) => {
    setAgendaFocus("citas");
    if (tsOrDayjs?.$d) setSelectedAgendaDay(tsOrDayjs);
    else if (typeof tsOrDayjs === "number") setSelectedAgendaDay(dayjs(tsOrDayjs));
    setOpenAgendaModal(true);
  };

  const openModalMedicamentos = ({ day, medId } = {}) => {
    setAgendaFocus("medicamento");

    // si te pasan un día específico, lo usamos; si no, usamos el día actual seleccionado
    if (day?.$d) setSelectedAgendaDay(day);
    if (typeof day === "number") setSelectedAgendaDay(dayjs(day));

    // si te pasan el medicamento, lo marcamos seleccionado (para pintar el calendario del modal)
    if (medId != null) setSelectedMedId(medId);

    setOpenAgendaModal(true);
  };

  const handleMedicamentoColorChange = ({ medId, color }) => {
    setMedicamentos((prev) =>
      (prev || []).map((med) =>
        String(med?.id) === String(medId) ? { ...med, colorBarra: color } : med
      )
    );
  };

  return (
    <div className={styles?.wrap || ""}>
      <div className={styles.seccSuperior}>
        <div className={styles.cntMono}>
          <h2 className={styles.saludo}>Hola, {nombreCorto}</h2>
          <img className={styles.cuadro} src={cuadro}></img>
          <img className={styles.mancha} src={manchaImg} alt="" />
          <div className={styles.cntImgMono}>
            <img className={styles.mono} src={avatarImg} />
            {/* <Mono3d /> */}
          </div>

          <div className={styles.cntPie}>
            <TarjetaPie edad="50" peso="90" sangre="A+" estatura="177" />
          </div>

          <div className={styles.cntCora}>
            <div className={styles.cntCoraInfo}>
              <ProgCora porcentaje="50" />
              <div className={styles.mensaje}>
                Tu esfuerzo se nota. Ajusta pequeños hábitos y sigue creciendo.
              </div>
            </div>
            <div className={styles.cntLogros}>
              <TarjetaLogro id="reto4" />
            </div>
          </div>
        </div>

        <div className={styles.cntAgenda}>
          <div className={styles.agenda}>
            <CalendarioInicio
              compact
              citasPorFecha={citasPorFecha}
              setCitasPorFecha={setCitasPorFecha}
              externalSelectedDate={selectedAgendaDay}
              externalOpen={openAgendaModal}
              onExternalClose={() => setOpenAgendaModal(false)}
              onExternalDateChange={setSelectedAgendaDay}
              // ✅ nuevos
              medicamentos={medicamentos}
              setMedicamentos={setMedicamentos}
              selectedMedId={selectedMedId}
              setSelectedMedId={setSelectedMedId}
              focusSection={agendaFocus}
            />
          </div>

          <hr className={styles.hr} />

          <div className={styles.cntTarjetasAlertas}>
            <div className={styles.carruselBloque}>
              <p className={styles.carruselTitulo}>Mis medicamentos</p>

              <div
                className={`${styles.carruselViewport} ${styles.viewportMedicamentos}`}
              >
                <button
                  type="button"
                  className={`${styles.btnCarrusel} ${styles.btnCarruselIzq}`}
                  onClick={() => scrollCards(medsScrollRef, -1, "medicamentos")}
                  disabled={!scrollState.medicamentos.canLeft}
                  aria-label="Desplazar medicamentos a la izquierda"
                >
                  &#8249;
                </button>

                <div
                  ref={medsScrollRef}
                  className={`${styles.cntMedicamentos} scroll-container`}
                >
                  <TarjetasMedicamentosIco
                    medicamentos={medicamentos}
                    day={selectedAgendaDay}
                    onOpenMedicamento={(payload) => openModalMedicamentos(payload || {})}
                    onChangeMedicamentoColor={handleMedicamentoColorChange}
                  />
                </div>

                <button
                  type="button"
                  className={`${styles.btnCarrusel} ${styles.btnCarruselDer}`}
                  onClick={() => scrollCards(medsScrollRef, 1, "medicamentos")}
                  disabled={!scrollState.medicamentos.canRight}
                  aria-label="Desplazar medicamentos a la derecha"
                >
                  &#8250;
                </button>
              </div>
            </div>

            <div className={styles.carruselBloque}>
              <p className={styles.carruselTitulo}>Mis citas</p>

              <div className={`${styles.carruselViewport} ${styles.viewportCitas}`}>
                <button
                  type="button"
                  className={`${styles.btnCarrusel} ${styles.btnCarruselIzq}`}
                  onClick={() => scrollCards(citasScrollRef, -1, "citas")}
                  disabled={!scrollState.citas.canLeft}
                  aria-label="Desplazar citas a la izquierda"
                >
                  &#8249;
                </button>

                <div
                  ref={citasScrollRef}
                  className={`${styles.cntCitas} scroll-container`}
                >
                  <TarjetasCitas
                    citasPorFecha={citasPorFecha}
                    day={selectedAgendaDay}
                    onOpenCita={(cita) => {
                      setSelectedAgendaDay(dayjs(cita._ts));
                      setAgendaFocus("citas");
                      setOpenAgendaModal(true);
                    }}
                  />
                </div>

                <button
                  type="button"
                  className={`${styles.btnCarrusel} ${styles.btnCarruselDer}`}
                  onClick={() => scrollCards(citasScrollRef, 1, "citas")}
                  disabled={!scrollState.citas.canRight}
                  aria-label="Desplazar citas a la derecha"
                >
                  &#8250;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.seccCentro}>
        <TarjetaSalud tipo="Salud Física" />
        <TarjetaSalud tipo="Salud Mental" />
        <TarjetaSalud tipo="Salud Nutricional" />
      </div>

      <div className={styles.seccInfe}>
        <TarjetaAreas />
        {/* <TarjetaNoticias /> */}
        <Noticia />
      </div>

      <div className={styles}></div>

    </div>
  );
}
