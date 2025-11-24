import React, { useEffect, useState, useRef } from "react";
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

export default function Inicio() {
  const [nombre, setNombre] = useState("Usuario");
  const [esMujer, setEsMujer] = useState(true); // false = hombre por defecto
  

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
      }
    } catch {
      null;
    }
  }, []);

  const [fechaSeleccionada, setFechaSeleccionada] = useState(dayjs());

  const avatarImg = esMujer ? mona : mono;
  const manchaImg = esMujer ? manchaR : manchaA;

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
            <ProgCora porcentaje="65" />
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={fechaSeleccionada}
                onChange={(newValue) => setFechaSeleccionada(newValue)}
                showDaysOutsideCurrentMonth
                /* displayWeekNumber */
                sx={{
                  width: "22.75rem",
                  // Contenedor de cada semana (fila)
                  "& .MuiDayCalendar-weekContainer": {
                    minHeight: "1.2rem", // aún más compacto
                    marginBottom: "0.1rem", // reduce espacio entre filas
                    width: "100%",
                  },

                  // Cada día (célula)
                  "& .MuiPickersDay-root": {
                    height: "1.6rem", // reduce altura del botón
                    width: "1.6rem", // opcional: para mantener proporción
                    padding: 0, // elimina espacio interno
                    margin: "0px  12px", // reduce separación entre días
                    fontSize: "0.7rem",
                  },

                  // Texto del día
                  "& .MuiTypography-root": {
                    fontSize: "0.7rem",
                    margin: "0px  7px",
                  },

                  // Encabezado del mes
                  "& .MuiPickersCalendarHeader-label": {
                    fontSize: "0.95rem",
                    fontWeight: "bold",
                    /* transform: "translateY(0.5rem)", */
                  },
                  // Botones de navegación
                  // Contenedor de las flechas
                  "& .MuiPickersArrowSwitcher-root": {
                    justifyContent: "space-between", // o "center" si querés alinearlas distinto
                    marginBottom: "0.5rem",
                    transform: "translateY(0.5rem)",
                  },

                  // Botones de flecha
                  "& .MuiPickersArrowSwitcher-button": {
                    color: "#1976d2", // color del ícono
                    padding: "4px",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                    "& svg": {
                      fontSize: "2rem", // tamaño del ícono
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <hr className={styles.hr} />

          <p>Mis Medicamentos</p>
          <div className={`${styles.cntAlertas} scroll-container`}>
            <TarjetasMedicamentosIco />
          </div>
          <p>Mis Citas</p>
          <div className={`${styles.cntCitas} scroll-container`}>
            <TarjetasCitas />
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
