import React, { useEffect, useState, useRef, useCallback } from "react";
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
import Box from "@mui/material/Box";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import TarjetaLogro from "@/components/TarjetaLogro/TarjetaLogro";
import TarjetaSalud from "./TarjetaSalud/TarjetaSalud";
import TarjetasMedicamentosIco from "./TarjetaMedicamento/TarjetasMedicamentosIco";
import TarjetaAreas from "./TarjetasAreas/TarjetaAreas";
import TarjetaNoticias from "./TarjetaNoticias/TarjetaNoticias";
import TarjetasCitas from "./TarjetasCitas/TarjetasCitas";

import CalendarioInicio from "./Calendario/CalendarioInicio";

export default function Inicio() {
  const [nombre, setNombre] = useState("Usuario");
  const [esMujer, setEsMujer] = useState(true); // false = hombre por defecto

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
        // ejemplos que cubrimos: "M", "F", "Hombre", "Mujer", etc.
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

  const [openAgendaModal, setOpenAgendaModal] = useState(false);
  const [selectedAgendaDay, setSelectedAgendaDay] = useState(dayjs());

  return (
    <div className={styles?.wrap || ""} style={{ padding: "0rem" }}>
      <div className={styles.seccSuperior}>
        <div className={styles.cntMono}>
          <img className={styles.cuadro} src={cuadro} />
          <img className={styles.mancha} src={manchaImg} />
          <div className={styles.cntImgMono}>
            <img className={styles.mono} src={avatarImg} />
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

        {/* <div className={styles.cntAccion}>
          <hr className={styles.hr} />
          <div className={styles.cntAccesos}>
            <div className={styles.acceso}></div>
            <div className={styles.acceso}></div>
            <div className={styles.acceso}></div>
          </div>
        </div> */}

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
            />
          </div>
          <hr className={styles.hr} />

          <div className={styles.cntTarjetasAlertas}>
            <p>Mis Medicamentos</p>
            <div className={`${styles.cntAlertas} scroll-container`}>
              <TarjetasMedicamentosIco />
            </div>
            <p>Mis Citas</p>
            <div className={`${styles.cntCitas} scroll-container`}>
              <TarjetasCitas 
                citasPorFecha={citasPorFecha}
                onOpenCita={(cita) => {
                  setSelectedAgendaDay(dayjs(cita._ts));
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
