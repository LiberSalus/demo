//src\pages\Inicio\Calendario\PanelCalendarioCitas.jsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Tabs,
  Tab,
  Card,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import "dayjs/locale/es-mx";
import styles from "./PanelCalendarioCitas.module.css";

import horario from "./icoHorario.svg";
import lugar from "./icoLugar.svg";
import profesion from "./icoProfesion.svg";
import linea from "./icoEnlinea.svg";
import notas from "./icoNotas.svg"

dayjs.locale("es-mx");

const PanelCalendarioCitas = ({
  selectedDate: selectedDateProp,
  onChangeDate,
  citasPorFecha = {}, 
  isMobile,
}) => {
  const [tab, setTab] = useState("cita");

  const [internalDate, setInternalDate] = useState(dayjs("2025-11-19"));
  const selectedDate = selectedDateProp || internalDate;

  const handleDateChange = (newValue) => {
    if (onChangeDate) onChangeDate(newValue);
    else setInternalDate(newValue);
  };

  const selectedKey = useMemo(
    () => selectedDate.format("YYYY-MM-DD"),
    [selectedDate]
  );

  const citasDelDia = citasPorFecha[selectedKey] || [];

  const handleTabChange = (_e, value) => setTab(value);

  const tieneCitas = (day) => {
    const key = day.format("YYYY-MM-DD");
    return !!citasPorFecha[key];
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: isMobile ? "100%" : 580,
        borderRadius: 7,
        bgcolor: "#FFF",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Tabs tipo switch */}
      {/* Tabs tipo switch */}
      <Box
        sx={{
          display: "inline-flex",
          padding: "0.3rem",
          borderRadius: 999,
          border: "1px solid #BFDBFE",
          backgroundColor: "#fff",
          width: "fit-content",
          minWidth: 287,
          margin: "0 auto",
        }}
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}
          TabIndicatorProps={{ style: { display: "none" } }} // sin línea inferior
          sx={{
            minHeight: 0,
            "& .MuiTabs-flexContainer": {
              gap: 0.5,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              minHeight: 32,
              minWidth: 0,
              padding: "0.25rem 1.5rem",
              borderRadius: 999,
              fontSize: "0.9rem",
              color: "#9CA3AF",
              display: "flex",
              justifyContent: "center",
            },
            "& .MuiTab-root.Mui-selected": {
              backgroundColor: "#007CBA", // azul activo
              color: "#FFFFFF",
            },
            "& .MuiTab-root:not(.Mui-selected)": {
              backgroundColor: "#E5F0FB", // pastilla inactiva
            },
          }}
        >
          <Tab label="Medicamento" value="medicamento" disableRipple />
          <Tab label="Cita médica" value="cita" disableRipple />
        </Tabs>
      </Box>

      {/* Calendario */}
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
        <DateCalendar
          className={styles.calendario}
          value={selectedDate}
          onChange={handleDateChange}
          showDaysOutsideCurrentMonth
          dayOfWeekFormatter={(day) =>
            ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][day.day()]
          }
          sx={{
            "& .MuiDayCalendar-header": {
              justifyContent: "space-between",
              px: 1,
            },
            "& .MuiDayCalendar-weekContainer": {
              justifyContent: "space-between",
            },
            "& .MuiPickersDay-root": {
              fontSize: "0.9rem",
              marginX: 0.1,
              position: "relative",
            },
            "& .MuiPickersDay-dayOutsideMonth": {
              opacity: 0.4,
            },
            "& .MuiPickersCalendarHeader-root": {
              mb: 1,
            },
            "& .MuiPickersCalendarHeader-label": {
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "capitalize",
            },
            "& .MuiPickersArrowSwitcher-button": {
              color: "#007CBA",
              padding: "4px",
              marginInline: 0.25,
            },
            zoom: 0.6
          }}
          slotProps={{
            day: (ownerState) => {
              const day = ownerState.day;
              const hayCitas = tieneCitas(day);
              return {
                sx: hayCitas
                  ? {
                      "&::after": {
                        content: '""',
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "#0EA5E9",
                        position: "absolute",
                        bottom: 4,
                      },
                    }
                  : undefined,
              };
            },
          }}
        />
      </LocalizationProvider>

      {/* Detalle + carrusel horizontal */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #E2E8F0",
          p: 2,
          mt: 1,
          height: 260,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 420,
          margin: "0 auto",
        }}
      >
        {tab === "cita" ? (
          <>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#64748B",
                mb: 0.2,
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.2px",
              }}
            >
              {citasDelDia.length
                ? "Citas médicas del día"
                : "Sin citas médicas para este día"}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#007CBA",
                fontSize: "0.75rem",
                fontWeight: 700,
                mt: -0.2, // Ajuste fino para acercar las líneas
                letterSpacing: "0.1px", // Hace que se lea más nítido
              }}
            >
              {selectedDate.format("D [de] MMMM [de] YYYY")}
            </Typography>

            <Box
              sx={{
                mt: 1,
                flex: 1,
                display: "flex",
                overflowX: "auto",
                overflowY: "hidden",
                gap: 1.5,
                pb: 0.5,
              }}
            >
              {citasDelDia.length > 0 ? (
                citasDelDia.map((cita) => (
                  <Card
                    key={cita.id}
                    elevation={0}
                    sx={{
                      flex: "0 0 auto",
                      minWidth: 360,
                      maxWidth: 360,
                      borderRadius: 2,
                      border: "1px solid #E5E7EB",
                      p: 1.5,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      {/* Nombre del médico */}
                      <Typography
                        variant="subtitle2"
                        sx={{ fontSize: "0.95rem", mb: 0.5 }}
                      >
                        {cita.medico}
                      </Typography>

                      {/* Especialidad */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <img src={profesion} alt="" width={16} height={16} />
                        <Typography variant="body2" sx={{  fontSize:"0.75rem" }}>
                          {cita.especialidad}
                        </Typography>
                      </Box>

                      {/* Horario */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <img src={horario} alt="" width={16} height={16} />
                        <Typography variant="body2" sx={{  fontSize:"0.75rem", color:"#007CBA" }}>{cita.horario}</Typography>
                      </Box>

                      {/* notas de cita */}

                      {cita.notas && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <img
                            src={notas}
                            alt="Ubicación"
                            width={16}
                            height={16}
                            style={{ marginTop: 0 }}
                          />
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {cita.notas}
                        </Typography>
                        </Box>
                      )}

                      {/* Lugar / En línea */}
                      {cita.tipo === "presencial" ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <img
                            src={lugar}
                            alt="Ubicación"
                            width= {16}
                            height={16}
                            style={{ marginTop: 0 }}
                          />
                          <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>{cita.lugar}</Typography>
                        </Box>
                      ) : (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <img
                              src={linea}
                              alt="En línea"
                              width={16}
                              height={16}
                            />
                            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                              Cita en línea
                            </Typography>
                          </Box>

                          <MuiLink
                            href={cita.enlace || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline={cita.enlace ? "hover" : "none"}
                            sx={{
                              fontSize: "0.9rem",
                              ml: 4,
                              color: cita.enlace ? "#007CBA" : "#94A3B8",
                              pointerEvents: cita.enlace ? "auto" : "none", // si no hay enlace, no es clickeable
                            }}
                          >
                            Accede a tu consulta aquí
                          </MuiLink>
                        </>
                      )}
                      
                    </Box>
                  </Card>
                ))
              ) : (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                    No hay citas registradas para este día.
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        ) : (
          <>
            <Typography variant="subtitle2" sx={{ color: "#64748B", mb: 0.5 }}>
              Recordatorios de medicamento
            </Typography>
            <Typography variant="body2">
              Aquí mostraremos los medicamentos y horarios asociados a la fecha
              seleccionada.
            </Typography>
          </>
        )}
      </Card>
    </Box>
  );
};

export default PanelCalendarioCitas;
