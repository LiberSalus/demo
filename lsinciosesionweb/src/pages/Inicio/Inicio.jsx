import React, { useEffect, useState } from "react";
import styles from "./inicio.module.css";
import TarjetaAlertas from "@/components/Tarjetas/TarjetaAlertas/TarjetaAlerta";
import TarjetaBienestar from "@/components/Tarjetas/TarjetaBienestar/TarjetaBienestar";
import TarjetaCarrucel from "@/components/Tarjetas/TarjetaCarrucel/TarjetaCarrucel";
import TrjEstadoCuestionario from "@/components/Tarjetas/TarjetaCuestionarios/TrjEstadoCuestionario";
import TarjetaCuestionario from "@/components/Tarjetas/TarjetaCuestionarios/TarjetaCuestionario";
import TarjetaEvaluacion from "@/components/Tarjetas/TarjetaEvaluacion/TarjetaEvaluacion";
import mono from "./mono.png";
import ProgCora from "@/components/ProgresoCorazon/ProgCora";
import TarjetaPie from "@/components/Tarjetas/TarjetaPie/TarjetaPie";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Box from '@mui/material/Box';

import TarjetaLogro from "@/components/TarjetaLogro/TarjetaLogro";

export default function Inicio() {
  const [nombre, setNombre] = useState("Usuario");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("perfil_min");
      if (raw) {
        const p = JSON.parse(raw);
        if (p?.nombre) setNombre(p.nombre);
        // si guardas first/last_name:
        if (!p?.nombre && p?.first_name) {
          setNombre(`${p.first_name} ${p.last_name ?? ""}`.trim());
        }
      }
    } catch { }
  }, []);

  const [fechaSeleccionada, setFechaSeleccionada] = useState(dayjs());

  return (
    <div className={styles?.wrap || ""} style={{ padding: "0rem" }}>
      <div className={styles.seccSuperior}>
        <div className={styles.cntMono}>
          <div className={styles.cntCora}>
            <ProgCora porcentaje="65" />
            <div className={styles.mensaje}>
              Tu esfuerzo se nota. Ajusta pequeños hábitos y sigue creciendo.
            </div>
          </div>

          <img className={styles.mono} src={mono}></img>

          <div className={styles.cntPie}>
            <TarjetaPie edad="50" peso="90" sangre="A+" estatura="177" />
          </div>
        </div>

        <div className={styles.cntAccion}>
          <div className={styles.cntLogros}>
            <TarjetaLogro id="reto1"/>
          </div>
          <hr className={styles.hr} />
          <div className={styles.cntAccesos}>
            <div className={styles.acceso}></div>
            <div className={styles.acceso}></div>
            <div className={styles.acceso}></div>
          </div>
        </div>
        
        <div className={styles.cntAgenda}>
          <div className={styles.agenda}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={fechaSeleccionada}
                  onChange={(newValue) => setFechaSeleccionada(newValue)}
                  showDaysOutsideCurrentMonth
                  displayWeekNumber
                  sx={{ width: '100%', height: '100%' }}
                />
              </LocalizationProvider>
            </Box>
          </div>
          <hr className={styles.hr} />
        </div>
      </div>
    </div>
  );
}
