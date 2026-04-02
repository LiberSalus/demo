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

import medico from "./icoMedico.svg";
import especialidad from "./icoEspecialidad.svg";
import horario from "./icoHorario.svg";
import ubicacion from "./icoUbicacion.svg";
import linea from "./icoEnlinea.svg";
import notas from "./icoNotas.svg";
import agenda from "./icoAgenda.svg";
import medicamento from "./icoMedicamento.svg";
import dosis from "./icoDosis.svg";
import nada from "./icoNada.svg";

import {
  buildCalendarPaint,
  isTakeDay,
  buildDailyTimes,
} from "./MedicamentoUtils";

dayjs.locale("es-mx");

const normId = (v) => (v == null ? "" : String(v));
const BRAND_BLUE = "#007CBA";
const RANGE_EDGE_BLUE = "#1976d2";
const RANGE_FILL = "rgba(14,165,233,0.18)";
const RANGE_FILL_SOFT = "rgba(14,165,233,0.12)";
const RANGE_DAY_SOFT = "#D8EEF8";
const WEEKDAY_MUTED = "#A7A8A9";

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
  const [pestanaInterna, setPestanaInterna] = useState("cita");
  const tab = tabProp ?? pestanaInterna;

  const [fechaInterna, setFechaInterna] = useState(dayjs("2025-11-19"));
  const selectedDate = selectedDateProp || fechaInterna;

  const [idMedicamentoInterno, setIdMedicamentoInterno] = useState(null);
  const selectedMedId = selectedMedIdProp ?? idMedicamentoInterno;

  const refEncabezadoCitas = useRef(null);

  const manejarCambioPestana = (_e, value) => {
    if (onTabChange) onTabChange(value);
    else setPestanaInterna(value);
  };

  const manejarCambioFecha = (newValue) => {
    if (onChangeDate) onChangeDate(newValue);
    else setFechaInterna(newValue);
  };

  const selectedKey = useMemo(
    () => selectedDate.format("YYYY-MM-DD"),
    [selectedDate],
  );

  const citasDelDia = citasPorFecha[selectedKey] || [];

  // Cuando el modal abre en la pestaña de citas, baja al detalle del día.
  useEffect(() => {
    if (focusSection !== "citas") return;
    if (tab !== "cita") return;

    const t = setTimeout(() => {
      refEncabezadoCitas.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);

    return () => clearTimeout(t);
  }, [focusSection, tab, selectedKey]);

  const medicamentosDelDia = useMemo(() => {
    return (medicamentos || []).filter((r) => isTakeDay(r, selectedKey));
  }, [medicamentos, selectedKey]);

  const reglaMedicamentoSeleccionado = useMemo(() => {
    const sel = normId(selectedMedId);
    if (!sel) return null;

    return (medicamentos || []).find((r) => normId(r.id) === sel) || null;
  }, [medicamentos, selectedMedId]);

  const monthStartKey = useMemo(
    () => selectedDate.startOf("month").format("YYYY-MM-DD"),
    [selectedDate],
  );
  const monthEndKey = useMemo(
    () => selectedDate.endOf("month").format("YYYY-MM-DD"),
    [selectedDate],
  );

  const pintadoCalendario = useMemo(() => {
    if (tab !== "medicamento") return null;
    if (!selectedMedId) return null;
    if (!reglaMedicamentoSeleccionado) return null;
    return buildCalendarPaint(
      reglaMedicamentoSeleccionado,
      monthStartKey,
      monthEndKey
    );
  }, [
    tab,
    selectedMedId,
    reglaMedicamentoSeleccionado,
    monthStartKey,
    monthEndKey,
  ]);

  const tieneCitas = (day) => {
    const key = day.format("YYYY-MM-DD");
    const citas = citasPorFecha[key] || [];
    return citas.length > 0;
  };

  const manejarSeleccionMedicamento = (id) => {
    if (onSelectMedId) onSelectMedId(id);
    else setIdMedicamentoInterno(id);
  };

  const renderizarResumenHoras = (regla) => {
    const horas = buildDailyTimes(regla.frecuenciaHoras, regla.horaInicio);
    if (horas.length <= 3) return horas.join(", ");
    return `${horas.slice(0, 2).join(", ")} +${horas.length - 2} más`;
  };


  const agendaDay = selectedDate.format("D");
  const agendaMonth = selectedDate.format("MMMM");
  const agendaMonthLabel =
    agendaMonth.charAt(0).toUpperCase() + agendaMonth.slice(1);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: isMobile ? "100%" : "100%",
        borderRadius: isMobile ? 4 : 7,
        bgcolor: "#FFF",
        p: isMobile ? 1 : 2,
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 0.9 : 1.25,
      }}
    >
      {/* Tabs tipo switch */}
      <Box
        sx={{
          display: "inline-flex",
          padding: isMobile ? "0.2rem" : "0.3rem",
          borderRadius: 999,
          border: "1px solid #BFDBFE",
          backgroundColor: "#fff",
          width: isMobile ? "min(100%, 17rem)" : "fit-content",
          minWidth: isMobile ? 0 : 286.75,
          margin: "0 auto",
          alignSelf: "center",
        }}
      >
        <Tabs
          value={tab}
          onChange={manejarCambioPestana}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            minHeight: 0,
            width: isMobile ? "100%" : "auto",
            "& .MuiTabs-flexContainer": { gap: 0.5 },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              minHeight: isMobile ? 30 : 32,
              minWidth: 0,
              flex: isMobile ? 1 : "initial",
              padding: isMobile ? "0.2rem 0.9rem" : "0.25rem 1.5rem",
              borderRadius: 50,
              fontSize: isMobile ? "0.82rem" : "0.9rem",
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
          onChange={manejarCambioFecha}
          showDaysOutsideCurrentMonth
          dayOfWeekFormatter={(day) =>
            ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][day.day()]
          }
          sx={{

              "& .MuiDayCalendar-weekDayLabel": {
              fontSize: isMobile ? "0.76rem" : "1rem",
                color: WEEKDAY_MUTED,
              },

            "& .MuiDayCalendar-header": {
              justifyContent: "space-between",
              px: 1,
              
            },
            "& .MuiDayCalendar-weekContainer": {
              justifyContent: "space-between",
              marginBottom: "0rem",
              
            },
              "& .MuiPickersDay-root": {
               fontSize: isMobile ? "0.88rem" : "1rem",
                marginX: isMobile ? 0.35 : 1,
                position: "relative",
              
            },
            "& .MuiPickersDay-dayOutsideMonth": { opacity: 0.4,  },
            "& .MuiPickersCalendarHeader-root": { mb: 1, },
              "& .MuiPickersCalendarHeader-label": {
                fontWeight: 700,
               fontSize: isMobile ? "1.18rem" : "1.5rem",
                textTransform: "capitalize",
              },
            "& .MuiPickersArrowSwitcher-button": {
              color: BRAND_BLUE,
              padding: isMobile ? "2px" : "4px",
              marginInline: 0,
                fontSize: isMobile ? "1.5rem" : "2rem",
              },
            "& .MuiPickersArrowSwitcher-button svg": {
              color: BRAND_BLUE,
              fill: BRAND_BLUE,
              
            },
          }}
          slotProps={{
            day: (ownerState) => {
              const day = ownerState.day;
              const key = day.format("YYYY-MM-DD");
              const prevKey = day.subtract(1, "day").format("YYYY-MM-DD");
              const nextKey = day.add(1, "day").format("YYYY-MM-DD");

              const hayCitas = tieneCitas(day);

              const inShade =
                tab === "medicamento" &&
                pintadoCalendario &&
                key >= pintadoCalendario.shadeStart &&
                key <= pintadoCalendario.shadeEnd;

              const isCircle =
                tab === "medicamento" &&
                pintadoCalendario &&
                pintadoCalendario.takeDays?.has(key);
              const usesRangeTrackPattern =
                tab === "medicamento" &&
                ["con_pausas", "cada_n_dias"].includes(
                  reglaMedicamentoSeleccionado?.patron
                );
              const hasPrevInPeriod =
                usesRangeTrackPattern &&
                pintadoCalendario &&
                prevKey >= pintadoCalendario.shadeStart &&
                prevKey <= pintadoCalendario.shadeEnd;
              const hasNextInPeriod =
                usesRangeTrackPattern &&
                pintadoCalendario &&
                nextKey >= pintadoCalendario.shadeStart &&
                nextKey <= pintadoCalendario.shadeEnd;
              const hasPrevTake =
                usesRangeTrackPattern &&
                pintadoCalendario &&
                pintadoCalendario.takeDays?.has(prevKey);
              const hasNextTake =
                usesRangeTrackPattern &&
                pintadoCalendario &&
                pintadoCalendario.takeDays?.has(nextKey);
              const isPeriodStart =
                usesRangeTrackPattern &&
                pintadoCalendario &&
                key === pintadoCalendario.shadeStart;
              const isPeriodEnd =
                usesRangeTrackPattern &&
                pintadoCalendario &&
                key === pintadoCalendario.shadeEnd;
              const isInnerTakeDay =
                usesRangeTrackPattern && isCircle && !isPeriodStart && !isPeriodEnd;
              const rangeFillLeft =
                hasPrevInPeriod ? -13.5 : "49%";
              const rangeFillRight =
                hasNextInPeriod ? -14 : "49%";

              // Esta capa mezcla el indicador de citas con el patrón visual
              // del tratamiento seleccionado dentro del calendario del modal.
              const sx = {
                ...(hayCitas && tab === "cita"
                  ? {
                      "&::after": {
                        content: '""',
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: BRAND_BLUE,
                        position: "absolute",
                        bottom: 4,
                      },
                    }
                  : null),

                ...(tab === "medicamento" && inShade && !usesRangeTrackPattern
                  ? {
                      backgroundColor: RANGE_FILL_SOFT,
                      borderRadius: 2,
                    }
                  : null),

                ...(usesRangeTrackPattern && inShade
                  ? {
                      marginX: 0,
                      overflow: "visible",
                      color: isPeriodStart || isPeriodEnd ? "#FFFFFF" : "#0F172A",
                      fontWeight: isCircle ? 500 : 400,
                      backgroundColor: "transparent",
                      borderRadius: "999px",
                      zIndex: 1,
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-59%)",
                        height: 18,
                        left:  rangeFillLeft,
                        right: rangeFillRight,
                        backgroundColor: RANGE_FILL,
                        borderRadius:
                          !hasPrevInPeriod && !hasNextInPeriod
                            ? "999px"
                            : !hasPrevInPeriod
                              ? "999px 0 0 999px"
                              : !hasNextInPeriod
                                ? "0 999px 999px 0"
                                : 0,
                        zIndex: -1,
                      },
                      ...((isPeriodStart || isPeriodEnd)
                        ? {
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              inset: 0,
                              margin: "auto",
                              width:  36,
                              height: 36,
                              borderRadius: "50%",
                              backgroundColor: RANGE_EDGE_BLUE,
                              zIndex: -1,
                              top:  "-1%",
                              left: "-1%",
                              transform: "translate(0%, 0%)",
                            },
                          }
                        : null),
                      ...(isInnerTakeDay
                        ? {
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              inset: 0,
                              margin: "auto",
                              width:  32,
                              height: 32,
                              borderRadius: "50%",
                              backgroundColor: RANGE_DAY_SOFT,
                              border: `1.5px solid ${BRAND_BLUE}`,
                              zIndex: -1,
                              top: "-1%",
                              left: "-1%",
                              transform: "translate(0%, 2%)",
                            },
                          }
                        : null),
                      "&:hover, &:focus": {
                        backgroundColor: "transparent",
                        
                      },
                    }
                  : null),

                ...(tab === "medicamento" && isCircle && !usesRangeTrackPattern
                  ? {
                      outline: `2px solid ${BRAND_BLUE}`,
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
          borderRadius: 4,
          border: "1px solid #ACCCEB",
          /* p: 2, */
          mt: 0.5,
          height: isMobile ? 160 : 212,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 420,
          margin: "0 auto",
        }}
      >
        {tab === "cita" ? (
          <>
            <Box
              ref={refEncabezadoCitas}
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "stretch",
              }}
            >
              {citasDelDia.length > 0 ? (
                <Card elevation={0} className={styles.agendaCard}>
                  <Box className={styles.agendaHeader}>
                    <span className={styles.agendaDay}>{agendaDay}</span>
                    <span className={styles.agendaMonth}>
                      {agendaMonthLabel}
                    </span>
                  </Box>

                  <Box className={styles.agendaScroll}>
                    {citasDelDia.map((cita) => (
                      <Box key={cita.id} className={styles.agendaEntry}>
                        <Box className={styles.agendaLine}>
                          <img src={medico} alt="Médico" />
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "inherit" }}
                            className={styles.agendaDoctor}
                          >
                            Nombre del medico: {cita.medico}
                          </Typography>
                        </Box>

                        <Box className={styles.agendaLine}>
                          <img src={especialidad} alt="Especialidad" />
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "inherit" }}
                          >
                            Especialidad: {cita.especialidad}
                          </Typography>
                        </Box>

                        <Box className={styles.agendaLine}>
                          <img src={horario} alt="Horario" />
                          <Typography
                            variant="body2"
                            className={styles.agendaLineAccent}
                            sx={{ fontSize: "inherit" }}
                          >
                            Horario: {cita.horario}
                          </Typography>
                        </Box>

                        {cita.notas && (
                          <Box className={styles.agendaLine}>
                            <img src={notas} alt="Notas" />
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "inherit" }}
                            >
                              {cita.notas}
                            </Typography>
                          </Box>
                        )}

                        {cita.tipo === "presencial" ? (
                          <Box className={styles.agendaLine}>
                            <img src={ubicacion} alt="Ubicación" />
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "inherit" }}
                            >
                              {cita.lugar}
                            </Typography>
                          </Box>
                        ) : (
                          <>
                            <Box className={styles.agendaLine}>
                              <img src={linea} alt="En línea" />
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "inherit" }}
                              >
                                Cita en línea
                              </Typography>
                            </Box>

                            <MuiLink
                              href={cita.enlace || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="none"
                              className={styles.agendaLink}
                              sx={{
                                pointerEvents: cita.enlace ? "auto" : "none",
                                opacity: cita.enlace ? 1 : 0.55,
                              }}
                            >
                              Accede a tu consulta aquí
                            </MuiLink>
                          </>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Card>
              ) : (
                <Card sx={{
                  width: "100%",
                  position: "relative"
                  }}>
                  <Box
                    className={styles.agendaHeader}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap:"2rem"
                    }}
                  >
                    <img src={agenda} alt="Sin agendar" />
                    <span className={styles.agendaSin}>
                      {/* {sinAgregar.cita} */} Aún no agregas una cita
                    </span>
                  </Box>
                  <img className={styles.nada} src={nada} alt="Sin Agendar" />
                </Card>
              )}
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "stretch",
              }}
            >
              {medicamentosDelDia.length > 0 ? (
                <Card elevation={0} className={styles.agendaCard}>
                  <Box className={styles.agendaHeader}>
                    <span className={styles.agendaDay}>{agendaDay}</span>
                    <span className={styles.agendaMonth}>
                      {agendaMonthLabel}
                    </span>
                  </Box>

                  <Box className={styles.agendaScroll}>
                    {medicamentosDelDia.map((m) => {
                      return (
                        <Box
                          key={m.id}
                          className={styles.agendaEntry}
                          onClick={() => manejarSeleccionMedicamento(m.id)}
                          sx={{
                            cursor: "pointer",

                            transition: "transform 120ms ease",
                            "&:active": { transform: "scale(0.99)" },
                          }}
                        >
                          <Box className={styles.agendaLine}>
                            <img src={medicamento} alt="Ubicación" />
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "inherit" }}
                            >
                              Medicamento: {m.medicamento}
                            </Typography>
                          </Box>

                          <Box className={styles.agendaLine}>
                            <img src={dosis} alt="" />
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "inherit" }}
                            >
                              {m.presentacion}
                              {m.dosis ? `: ${m.dosis}` : ""}
                              {m.cantidad ? ` • ${m.cantidad}` : ""}
                            </Typography>
                          </Box>

                          <Box className={styles.agendaLine}>
                            <img src={horario} alt="" />
                            <Typography
                              variant="body2"
                              className={styles.agendaLineAccent}
                              sx={{ fontSize: "inherit" }}
                            >
                              {renderizarResumenHoras(m)}
                            </Typography>
                          </Box>

                          {m.notas && (
                            <Box className={styles.agendaLine}>
                              <img src={notas} alt="Notas" />
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "inherit" }}
                              >
                                {m.notas}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Card>
              ) : (
                <Card sx={{
                  width: "100%",
                  position: "relative"
                  }}>
                  <Box
                    className={styles.agendaHeader}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap:"2rem"
                    }}
                  >
                    <img src={agenda} alt="Sin agendar" />
                    <span className={styles.agendaSin}>
                      Aún no agregas un tratamiento
                    </span>
                  </Box>
                  <img className={styles.nada} src={nada} alt="Sin Agendar" />
                </Card>
              )}
            </Box>
          </>
        )}
      </Card>
    </Box>
  );
};

export default PanelCalendarioCitas;
