//src\pages\Inicio\Inicio.jsx
import React, { useEffect, useState } from "react";
import styles from "./inicio.module.css";
import TarjetaAlertas from "@/components/Tarjetas/TarjetaAlertas/TarjetaAlerta";
import TarjetaBienestar from "@/components/Tarjetas/TarjetaBienestar/TarjetaBienestar";
import TarjetaCarrucel from "@/components/Tarjetas/TarjetaCarrucel/TarjetaCarrucel";
import TrjEstadoCuestionario from "@/components/Tarjetas/TarjetaCuestionarios/TrjEstadoCuestionario";
import TarjetaCuestionario from "@/components/Tarjetas/TarjetaCuestionarios/TarjetaCuestionario";
import TarjetaEvaluacion from "@/components/Tarjetas/TarjetaEvaluacion/TarjetaEvaluacion";
import mona from "./monaP.png";
import mono from "./monoP.png";
import manchaA from "./manchaA.svg";
import manchaR from "./manchaR.svg";
import cuadro from "./cuadro.svg";
import ProgCora from "@/components/ProgresoCorazon/ProgCora";
import TarjetaPie from "@/components/Tarjetas/TarjetaPie/TarjetaPie";

import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

import TarjetaLogro from "@/components/TarjetaLogro/TarjetaLogro";
import TarjetaSalud from "./TarjetaSalud/TarjetaSalud";
import TarjetasMedicamentosIco from "./TarjetaMedicamento/TarjetasMedicamentosIco";
import TarjetaAreas from "./TarjetasAreas/TarjetaAreas";
import TarjetaNoticias from "./TarjetaNoticias/TarjetaNoticias";
import TarjetasCitas from "./TarjetasCitas/TarjetasCitas";

import CalendarioInicio from "./Calendario/CalendarioInicio";

import Mona3d from "./Monos3d/Mona3d";
import Mono3d from "./Monos3d/Mono3d";

export default function Inicio() {
  const [nombre, setNombre] = useState("Usuario");
  const [esMujer, setEsMujer] = useState(false);

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

  // ✅ Persistencia (ahora sí, ya existe medicamentos)
  useEffect(() => {
    try {
      localStorage.setItem(
        "ls_medicamentos_rules",
        JSON.stringify(medicamentos),
      );
    } catch {
      null;
    }
  }, [medicamentos]);

  useEffect(() => {
    if (typeof esMujer !== "boolean") return;

    window.dispatchEvent(
      new CustomEvent("perfil_min_updated", {
        detail: { esMujer },
      }),
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

  const [citasPorFecha, setCitasPorFecha] = useState(CITAS_INICIALES);

  const avatarImg = esMujer ? mona : mono;
  const manchaImg = esMujer ? manchaR : manchaA;

  // ✅ Helpers para abrir modal desde tarjetas
  const openModalCitas = (tsOrDayjs) => {
    setAgendaFocus("citas");
    if (tsOrDayjs?.$d) setSelectedAgendaDay(tsOrDayjs);
    else if (typeof tsOrDayjs === "number")
      setSelectedAgendaDay(dayjs(tsOrDayjs));
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

  return (
    <div className={styles?.wrap || ""} style={{ padding: "0rem" }}>
      <div className={styles.seccSuperior}>
        <div className={styles.cntMono}>
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
            <ProgCora porcentaje="50" />
            <div className={styles.mensaje}>
              Tu esfuerzo se nota. Ajusta pequeños hábitos y sigue creciendo.
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
            <p>Mis Medicamentos</p>
            <div className={`${styles.cntAlertas} scroll-container`}>
              {/* En la siguiente iteración conectamos esto para abrir modal en “medicamento”
                 y seleccionar medId. Por ahora NO rompe nada. */}
              <TarjetasMedicamentosIco
                medicamentos={medicamentos}
                day={selectedAgendaDay} // ✅ usa el día actual de agenda
                onOpenMedicamento={(payload) =>
                  openModalMedicamentos(payload || {})
                }
              />
            </div>

            <p>Mis Citas</p>
            <div className={`${styles.cntCitas} scroll-container`}>
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
        <TarjetaNoticias />
      </div>

      <div className={styles}></div>
    </div>
  );
}
