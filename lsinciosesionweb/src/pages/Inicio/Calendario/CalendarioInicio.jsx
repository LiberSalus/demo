import React, { useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import "dayjs/locale/es-mx";
import ModalCitaMedica from "./ModalCitaMedica";

dayjs.locale("es-mx");

const CalendarioInicio = ({ compact = false }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [openModal, setOpenModal] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");

  const openForDay = (day) => {
    setSelectedDate(day);
    setOpenModal(true);
  };

  const CalendarOnly = (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
      <DateCalendar
        value={selectedDate}
        onChange={(newDate) => setSelectedDate(newDate)}
        slotProps={{
          day: (ownerState) => ({
            // 👇 móvil: tap / desktop: doble click
            onClick: isMobile ? () => openForDay(ownerState.day) : undefined,
            onDoubleClick: !isMobile ? () => openForDay(ownerState.day) : undefined,
          }),
        }}
        sx={{ 
          width: "85%",
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
  );

  return (
    <>
      {compact ? (
        <Box sx={{ width: "90%" }}>{CalendarOnly}</Box>
      ) : (
        <Box sx={{ borderRadius: 3, bgcolor: "#F9FAFB", p: 2, width: "90%", maxWidth: isMobile ? 360 : 520, mx: "auto" }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Calendario
          </Typography>
          {CalendarOnly}
          <Typography variant="body2" sx={{ mt: 1, color: "#64748B" }}>
            Doble clic en un día para crear o revisar una cita.
          </Typography>
        </Box>
      )}

      <ModalCitaMedica
        open={openModal}
        onClose={() => setOpenModal(false)}
        selectedDate={selectedDate}
        onChangeDate={setSelectedDate}
      />
    </>
  );
};

export default CalendarioInicio;
