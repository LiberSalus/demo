// src/pages/Inicio/Calendario/CalendarioInicio.jsx
import React, { useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

import dayjs from "dayjs";
import "dayjs/locale/es-mx";

import ModalCitaMedica from "./ModalCitaMedica";

dayjs.locale("es-mx");

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



/**
 * Día custom:
 * - Puntito si hay citas
 * - Tooltip (hover) en desktop con lista: horario + médico
 * - En móvil no hay hover => no tooltip
 */
function CustomDay(props) {
  const {
    day,
    outsideCurrentMonth,
    citasPorFecha,
    isMobile,
    onOpenDay, // handler para abrir modal (tap o doble click)
    ...other
  } = props;

  const key = day.format("YYYY-MM-DD");
  const citas = citasPorFecha?.[key] || [];
  const hayCitas = citas.length > 0;

  const dayNode = (
    <PickersDay
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      {...other}
      onClick={isMobile ? () => onOpenDay?.(day) : undefined}
      onDoubleClick={!isMobile ? () => onOpenDay?.(day) : undefined}
      sx={{
        ...(other.sx || {}),
        ...(hayCitas && {
          position: "relative",
          "&::after": {
            content: '""',
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "#0EA5E9",
            position: "absolute",
            bottom: 2,
            left: "50%",
            transform: "translateX(-50%)",
          },
        }),
      }}
    />
  );

  // Si no hay citas o es móvil -> regresamos normal (sin tooltip)
  if (!hayCitas || isMobile) return dayNode;

  const contenidoTooltip = (
    <Box sx={{ p: 0.5 }}>
      <Typography sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 0.5 }}>
        {citas.length} cita{citas.length > 1 ? "s" : ""} | {day.format("D MMM")} 
      </Typography>

      {citas.slice(0, 2).map((c) => (
        <Typography key={c.id} sx={{ fontSize: "0.75rem", lineHeight: 1.2 }}>
          • {c.medico} {c.horario} 
        </Typography>
      ))}

      {citas.length > 2 && (
        <Typography sx={{ fontSize: "0.7rem", opacity: 0.85, mt: 0.5 }}>
          +{citas.length - 2} más…
        </Typography>
      )}
    </Box>
  );

  

  return (
    <Tooltip
      title={contenidoTooltip}
      arrow
      placement="top"
      enterDelay={120}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "white",
            color: "#0f172a",
            border: "1px solid rgba(15,23,42,0.12)",
            boxShadow: "0 12px 35px rgba(15,23,42,0.18)",
            borderRadius: 2,
            maxWidth: 320,
            p: 1,
          },
        },
        arrow: { sx: { color: "white" } },
      }}
    >
      {/* span para que Tooltip funcione bien con children */}
      <span>{dayNode}</span>
    </Tooltip>
  );
}

const CalendarioInicio = ({ 
  compact = false,
  citasPorFecha = CITAS_INICIALES, 
  setCitasPorFecha = () => {},
  externalSelectedDate,
  externalOpen,
  onExternalClose,
  onExternalDateChange,
}) => {
  
  const [selectedDate, setSelectedDate] = useState(externalSelectedDate || dayjs());
  const [openModal, setOpenModal] = useState(false);

  // sincroniza si viene desde afuera (tarjetas)
  React.useEffect(() => {
    if (externalSelectedDate) setSelectedDate(externalSelectedDate);
  }, [externalSelectedDate]);

  React.useEffect(() => {
    if (typeof externalOpen === "boolean") setOpenModal(externalOpen);
  }, [externalOpen]);


  const isMobile = useMediaQuery("(max-width:600px)");

  const openForDay = (day) => {
    setSelectedDate(day);
    setOpenModal(true);
    onExternalDateChange?.(day)
  };

  const CalendarOnly = (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
      <DateCalendar
        value={selectedDate}
        onChange={(newDate) => setSelectedDate(newDate)}
        // ✅ aquí metemos nuestro día custom
        slots={{ day: CustomDay }}
        slotProps={{
          day: (ownerState) => ({
            citasPorFecha,
            isMobile,
            onOpenDay: openForDay,
            // 👇 MUI necesita day/outsideCurrentMonth en el slot day
            day: ownerState.day,
            outsideCurrentMonth: ownerState.outsideCurrentMonth,
          }),
        }}
        sx={{
          width: "85%",

          "& .MuiDayCalendar-weekContainer": {
            minHeight: "1.2rem",
            marginBottom: "0.1rem",
            width: "100%",
          },

          "& .MuiPickersDay-root": {
            height: "1.6rem",
            width: "1.6rem",
            padding: 0,
            margin: "0px 12px",
            fontSize: "0.7rem",
          },

          "& .MuiTypography-root": {
            fontSize: "0.7rem",
            margin: "0px 7px",
          },

          "& .MuiPickersCalendarHeader-label": {
            fontSize: "0.95rem",
            fontWeight: "bold",
          },

          "& .MuiPickersArrowSwitcher-root": {
            justifyContent: "space-between",
            marginBottom: "0.5rem",
            transform: "translateY(0.5rem)",
          },

          "& .MuiPickersArrowSwitcher-button": {
            color: "#1976d2",
            padding: "4px",
            "&:hover": { backgroundColor: "transparent" },
            "& svg": { fontSize: "2rem" },
          },
        }}
      />
    </LocalizationProvider>
  );

  return (
    <>
      {compact ? (
        <Box sx={{ width: "90%" }}>{CalendarOnly}</Box>
      ) : (
        <Box
          sx={{
            borderRadius: 3,
            bgcolor: "#F9FAFB",
            p: 2,
            width: "90%",
            maxWidth: isMobile ? 360 : 520,
            mx: "auto",
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Calendario
          </Typography>

          {CalendarOnly}

          <Typography variant="body2" sx={{ mt: 1, color: "#64748B" }}>
            {isMobile
              ? "Toca un día para crear o revisar una cita."
              : "Pasa el mouse para ver citas. Doble clic para abrir."}
          </Typography>
        </Box>
      )}

      <ModalCitaMedica
        open={openModal}
        selectedDate={selectedDate}
        onClose={() => {
          setOpenModal(false);
          onExternalClose?.();
        }}
        onChangeDate={setSelectedDate}
        citasPorFecha={citasPorFecha}
        setCitasPorFecha={setCitasPorFecha}
        focusSection="citas"
      />
    </>
  );
};

export default CalendarioInicio;
