// src/pages/Inicio/Calendario/PanelCalendarioCitas.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
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
import notasIco from "./icoNotas.svg";

import {
  buildCalendarPaint,
  isTakeDay,
  buildDailyTimes,
} from "./MedicamentoUtils";

dayjs.locale("es-mx");

const normId = (v) => (v == null ? "" : String(v));

const PanelCalendarioCitas = ({
  selectedDate: selectedDateProp,
  onChangeDate,
  citasPorFecha = {},
  isMobile,
  tab: tabProp,
  onTabChange,
  medicamentos = [],
  selectedMedId: selectedMedIdProp,
  onSelectMedId,

  focusSection = "citas",
}) => {
  const [internalTab, setInternalTab] = useState("cita");
  const tab = tabProp ?? internalTab;

  const [internalDate, setInternalDate] = useState(dayjs("2025-11-19"));
  const selectedDate = selectedDateProp || internalDate;

  const [internalSelectedMedId, setInternalSelectedMedId] = useState(null);
  const selectedMedId = selectedMedIdProp ?? internalSelectedMedId;

  const citasHeaderRef = useRef(null);

  const handleTabChange = (_e, value) => {
    if (onTabChange) onTabChange(value);
    else setInternalTab(value);
  };

  const handleDateChange = (newValue) => {
    if (onChangeDate) onChangeDate(newValue);
    else setInternalDate(newValue);
  };

  const selectedKey = useMemo(
    () => selectedDate.format("YYYY-MM-DD"),
    [selectedDate],
  );

  const citasDelDia = citasPorFecha[selectedKey] || [];

  // scroll hacia lista (citas) cuando se abre en esa sección
  useEffect(() => {
    if (focusSection !== "citas") return;
    if (tab !== "cita") return;

    const t = setTimeout(() => {
      citasHeaderRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);

    return () => clearTimeout(t);
  }, [focusSection, tab, selectedKey]);

  // --- Medicamentos del día (tratamientos que tienen toma en selectedKey)
  const medsDelDia = useMemo(() => {
    return (medicamentos || []).filter((r) => isTakeDay(r, selectedKey));
  }, [medicamentos, selectedKey]);

  const selectedMedRule = useMemo(() => {
    const sel = normId(selectedMedId);
    if (!sel) return null;

    return (medicamentos || []).find((r) => normId(r.id) === sel) || null;
  }, [medicamentos, selectedMedId]);

  // --- Pintado del calendario del modal (solo en tab medicamento)
  const monthStartKey = useMemo(
    () => selectedDate.startOf("month").format("YYYY-MM-DD"),
    [selectedDate],
  );
  const monthEndKey = useMemo(
    () => selectedDate.endOf("month").format("YYYY-MM-DD"),
    [selectedDate],
  );

  const paint = useMemo(() => {
    if (tab !== "medicamento") return null;
    if (!selectedMedId) return null; // ✅ NUEVO: hasta que haya selección
    if (!selectedMedRule) return null;
    return buildCalendarPaint(selectedMedRule, monthStartKey, monthEndKey);
  }, [tab, selectedMedId, selectedMedRule, monthStartKey, monthEndKey]);

  // Citas: puntito en el calendario del modal
  const tieneCitas = (day) => {
    const key = day.format("YYYY-MM-DD");
    const arr = citasPorFecha[key] || [];
    return arr.length > 0;
  };

  const handleSelectMed = (id) => {
    const next = id;
    if (onSelectMedId) onSelectMedId(id);
    else setInternalSelectedMedId(id);
  };

  const renderHorasResumen = (rule) => {
    const times = buildDailyTimes(rule.frecuenciaHoras, rule.horaInicio);
    if (times.length <= 3) return times.join(", ");
    return `${times.slice(0, 2).join(", ")} +${times.length - 2} más`;
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
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            minHeight: 0,
            "& .MuiTabs-flexContainer": { gap: 0.5 },
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
              backgroundColor: "#007CBA",
              color: "#FFFFFF",
            },
            "& .MuiTab-root:not(.Mui-selected)": {
              backgroundColor: "#E5F0FB",
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
            "& .MuiPickersDay-dayOutsideMonth": { opacity: 0.4 },
            "& .MuiPickersCalendarHeader-root": { mb: 1 },
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
            zoom: 0.6,
          }}
          slotProps={{
            day: (ownerState) => {
              const day = ownerState.day;
              const key = day.format("YYYY-MM-DD");

              // --- Citas (puntito)
              const hayCitas = tieneCitas(day);

              // --- Medicamentos (sombreado + círculo según tratamiento seleccionado)
              const inShade =
                tab === "medicamento" &&
                paint &&
                key >= paint.shadeStart &&
                key <= paint.shadeEnd;

              const isCircle =
                tab === "medicamento" && paint && paint.takeDays?.has(key);

              // Estilos combinados
              const sx = {
                ...(hayCitas && tab === "cita"
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
                  : null),

                ...(tab === "medicamento" && inShade
                  ? {
                      backgroundColor: "rgba(14,165,233,0.12)",
                      borderRadius: 2,
                    }
                  : null),

                ...(tab === "medicamento" && isCircle
                  ? {
                      outline: "2px solid #0EA5E9",
                      outlineOffset: "-2px",
                      borderRadius: "999px",
                    }
                  : null),
              };

              return { sx };
            },
          }}
        />
      </LocalizationProvider>

      {/* Detalle + carrusel horizontal (tarjetitas inferiores) */}
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
              ref={citasHeaderRef}
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
                mt: -0.2,
                letterSpacing: "0.1px",
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
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.75rem" }}
                        >
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
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.75rem", color: "#007CBA" }}
                        >
                          {cita.horario}
                        </Typography>
                      </Box>

                      {/* notas */}
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
                            src={notasIco}
                            alt="Notas"
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
                            width={16}
                            height={16}
                            style={{ marginTop: 0 }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.75rem" }}
                          >
                            {cita.lugar}
                          </Typography>
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
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.75rem" }}
                            >
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
                              pointerEvents: cita.enlace ? "auto" : "none",
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
              {medsDelDia.length
                ? "Recordatorios de medicamento del día"
                : "Sin recordatorios para este día"}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#007CBA",
                fontSize: "0.75rem",
                fontWeight: 700,
                mt: -0.2,
                letterSpacing: "0.1px",
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
              {medsDelDia.length > 0 ? (
                medsDelDia.map((m) => {
                  const selected = normId(m.id) === normId(selectedMedId);
                  const times = buildDailyTimes(
                    m.frecuenciaHoras,
                    m.horaInicio,
                  );

                  return (
                    <Card
                      key={m.id}
                      elevation={0}
                      onClick={() => handleSelectMed(m.id)}
                      sx={{
                        cursor: "pointer",
                        flex: "0 0 auto",
                        minWidth: 360,
                        maxWidth: 360,
                        borderRadius: 2,
                        border: selected
                          ? "2px solid rgba(14,165,233,0.9)"
                          : "1px solid #E5E7EB",
                        p: 1.5,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        backgroundColor: selected
                          ? "rgba(14,165,233,0.06)"
                          : "white",
                        transition: "transform 120ms ease",
                        "&:active": { transform: "scale(0.99)" },
                      }}
                    >
                      <Box>
                        {/* Nombre medicamento */}
                        <Typography
                          variant="subtitle2"
                          sx={{ fontSize: "0.95rem", mb: 0.4 }}
                        >
                          {m.medicamento}
                        </Typography>

                        {/* Presentación + dosis/cantidad */}
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.75rem", color: "#334155" }}
                        >
                          {m.presentacion}
                          {m.dosis ? ` • ${m.dosis}` : ""}
                          {m.cantidad ? ` • ${m.cantidad}` : ""}
                        </Typography>

                        {/* Horario (horas del día por frecuencia) */}
                        <Box sx={{ mt: 0.8 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.75rem", color: "#64748B" }}
                          >
                            Horario
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.75rem",
                              color: "#007CBA",
                              fontWeight: 700,
                            }}
                          >
                            {times.length} toma{times.length > 1 ? "s" : ""} •{" "}
                            {renderHorasResumen(m)}
                          </Typography>
                        </Box>

                        {/* Notas */}
                        {m.notas && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                              mt: 1,
                            }}
                          >
                            <img
                              src={notasIco}
                              alt="Notas"
                              width={16}
                              height={16}
                            />
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              {m.notas}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* micro hint */}
                      <Typography
                        variant="caption"
                        sx={{ mt: 1, color: "#94A3B8" }}
                      >
                        {selected
                          ? "Seleccionado para ver calendario"
                          : "Toca para ver calendario"}
                      </Typography>
                    </Card>
                  );
                })
              ) : (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#94A3B8"}}>
                    No hay medicamentos configurados para este día.
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}
      </Card>
    </Box>
  );
};

export default PanelCalendarioCitas;
