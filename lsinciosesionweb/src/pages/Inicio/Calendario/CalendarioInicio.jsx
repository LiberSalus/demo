import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";
import "dayjs/locale/es-mx";

import ModalCitaMedica from "./ModalCitaMedica";
import { isTakeDay } from "./MedicamentoUtils";

dayjs.locale("es-mx");

const AZUL_MARCA = "#007CBA";

function IconoChevron({ direccion = "left" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={
          direccion === "left"
            ? "M14.5 6.5L9 12l5.5 5.5"
            : "M9.5 6.5L15 12l-5.5 5.5"
        }
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DiaCalendarioPersonalizado(props) {
  const {
    day,
    outsideCurrentMonth,
    citasPorFecha,
    tieneMedicamentosEnFecha,
    esMovil,
    alAbrirDia,
    ...otros
  } = props;

  const claveDia = day.format("YYYY-MM-DD");
  const citasDelDia = citasPorFecha?.[claveDia] || [];
  const hayCitas = citasDelDia.length > 0;
  const hayMedicamentos = tieneMedicamentosEnFecha
    ? tieneMedicamentosEnFecha(claveDia)
    : false;
  const hayEventos = hayCitas || hayMedicamentos;

  const nodoDia = (
    <PickersDay
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      {...otros}
      onClick={esMovil ? () => alAbrirDia?.(day) : undefined}
      onDoubleClick={!esMovil ? () => alAbrirDia?.(day) : undefined}
      sx={{
        ...(otros.sx || {}),
        ...(hayEventos && {
          position: "relative",
          "&::after": {
            content: '""',
            width: 5,
            height: 5,
            borderRadius: "50%",
            bgcolor: AZUL_MARCA,
            position: "absolute",
            bottom: 2,
            left: "50%",
            transform: "translateX(-50%)",
          },
        }),
      }}
    />
  );

  if (!hayCitas || esMovil) return nodoDia;

  return (
    <Tooltip
      title={
        <Box sx={{ p: 0.5 }}>
          <Typography sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 0.5 }}>
            {citasDelDia.length} cita{citasDelDia.length > 1 ? "s" : ""} |{" "}
            {day.format("D MMM")}
          </Typography>

          {citasDelDia.slice(0, 2).map((cita) => (
            <Typography
              key={cita.id}
              sx={{ fontSize: "0.75rem", lineHeight: 1.2 }}
            >
              • {cita.medico} {cita.horario}
            </Typography>
          ))}

          {citasDelDia.length > 2 && (
            <Typography sx={{ fontSize: "0.7rem", opacity: 0.85, mt: 0.5 }}>
              +{citasDelDia.length - 2} más…
            </Typography>
          )}
        </Box>
      }
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
      <span>{nodoDia}</span>
    </Tooltip>
  );
}

export default function CalendarioInicio({
  compact = false,
  citasPorFecha = {},
  setCitasPorFecha = () => {},
  medicamentos = [],
  setMedicamentos = () => {},
  selectedMedId = null,
  setSelectedMedId = () => {},
  focusSection = "citas",
  externalSelectedDate,
  externalOpen,
  onExternalClose,
  onExternalDateChange,
}) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    externalSelectedDate || dayjs()
  );
  const [modalAbierto, setModalAbierto] = useState(false);
  const esMovil = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (externalSelectedDate) setFechaSeleccionada(externalSelectedDate);
  }, [externalSelectedDate]);

  useEffect(() => {
    if (typeof externalOpen === "boolean") setModalAbierto(externalOpen);
  }, [externalOpen]);

  const abrirDia = (dia) => {
    setFechaSeleccionada(dia);
    setModalAbierto(true);
    onExternalDateChange?.(dia);
  };

  // El calendario principal solo necesita saber si en ese día existe al menos
  // un medicamento activo para pintar el indicador visual.
  const tieneMedicamentosEnFecha = useMemo(() => {
    if (!Array.isArray(medicamentos) || medicamentos.length === 0) {
      return () => false;
    }

    return (claveFecha) =>
      medicamentos.some((medicamento) => isTakeDay(medicamento, claveFecha));
  }, [medicamentos]);

  const calendario = (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
      <DateCalendar
        value={fechaSeleccionada}
        onChange={(nuevaFecha) => setFechaSeleccionada(nuevaFecha)}
        slots={{
          day: DiaCalendarioPersonalizado,
          leftArrowIcon: () => <IconoChevron direccion="left" />,
          rightArrowIcon: () => <IconoChevron direccion="right" />,
        }}
        slotProps={{
          day: (ownerState) => ({
            citasPorFecha,
            tieneMedicamentosEnFecha,
            esMovil,
            alAbrirDia: abrirDia,
            day: ownerState.day,
            showDaysOutsideCurrentMonth: true,
            outsideCurrentMonth: ownerState.outsideCurrentMonth,
          }),
        }}
        dayOfWeekFormatter={(dia) =>
          ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][dia.day()]
        }
        sx={{
          width: esMovil ? "100%" : "90%",
          "& .MuiDateCalendar-root": {
            width: "100%",
            maxHeight: esMovil ? "15.75rem" : "16.5rem",
            overflow: "hidden",
          },
          "& .MuiDateCalendar-viewTransitionContainer": {
            minHeight: esMovil ? "12.45rem" : "13.75rem",
            maxHeight: esMovil ? "12.45rem" : "13.75rem",
            overflow: "hidden",
          },
          "& .MuiDayCalendar-header": {
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            columnGap: 0,
            px: esMovil ? 0.15 : 0.35,
          },
          "& .MuiDayCalendar-weekDayLabel": {
            width: "100%",
            margin: 0,
            textAlign: "center",
            fontSize: esMovil ? "0.76rem" : "0.9rem",
          },
          "& .MuiDayCalendar-weekContainer": {
            minHeight: esMovil ? "1.7rem" : "1.2rem",
            width: "100%",
            justifyContent: "space-between",
            margin: 0,
          },
          "& .MuiPickersDay-root": {
            height: esMovil ? "1.95rem" : "1.7rem",
            width: esMovil ? "1.95rem" : "1.7rem",
            minWidth: esMovil ? "1.95rem" : "1.7rem",
            minHeight: esMovil ? "1.95rem" : "1.7rem",
            padding: 0,
            margin: esMovil ? "0 auto" : "0px 13px",
            borderRadius: "50%",
            lineHeight: 1,
            fontSize: esMovil ? "0.78rem" : "0.8rem",
          },
          "& .MuiTypography-root": {
            fontSize: esMovil ? "0.82rem" : "0.9rem",
            margin: esMovil ? 0 : "0px 8px",
            textTransform: "capitalize",
          },
          "& .MuiPickersCalendarHeader-label": {
            fontSize: esMovil ? "0.95rem" : "1.1rem",
            fontWeight: "bold",
            textDecoration: "capitalize",
          },
          "& .MuiPickersArrowSwitcher-root": {
            justifyContent: "space-between",
            marginBottom: esMovil ? "0.15rem" : "0.5rem",
            transform: esMovil
              ? "translateY(0.1rem)"
              : "translateY(0.25rem)",
            "& button": {
              color: AZUL_MARCA,
            },
          },
          "& .MuiPickersArrowSwitcher-button": {
            color: AZUL_MARCA,
            width: esMovil ? "1.35rem" : "1.5rem",
            height: esMovil ? "1.35rem" : "1.5rem",
            minWidth: esMovil ? "1.35rem" : "1.5rem",
            minHeight: esMovil ? "1.35rem" : "1.5rem",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            border: "none",
            borderRadius: 0,
            transition: "none",
            animation: "none",
            "&:hover": { backgroundColor: "transparent" },
            "&:focus": { backgroundColor: "transparent" },
            "&:focus-visible": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              backgroundColor: "transparent",
            },
            "&.Mui-focusVisible": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "& .MuiTouchRipple-root": {
              display: "none",
            },
            "& svg": {
              width: esMovil ? "1.55rem" : "2rem",
              height: esMovil ? "1.55rem" : "2rem",
              stroke: "#1976d2",
              margin: 0,
            },
          },
          "& .MuiPickersCalendarHeader-switchViewButton": {
            backgroundColor: "transparent",
            transition: "none",
            animation: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "transparent",
            },
            "&:focus": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "&:focus-visible": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "&.Mui-focusVisible": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "& .MuiTouchRipple-root": {
              display: "none",
            },
          },
          "& .MuiPickersCalendarHeader-switchViewIcon": {
            transition: "none",
            animation: "none",
          },
          "& .MuiYearCalendar-button": {
            minHeight: "2.25rem",
            height: "2.25rem",
            padding: 0,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            justifySelf: "center",
            marginInline: "auto",
            transition: "none",
            animation: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.08)",
            },
            "&:focus": {
              boxShadow: "none",
            },
            "&:focus-visible": {
              boxShadow: "none",
            },
            "&.Mui-selected": {
              transition: "none",
              animation: "none",
              boxShadow: "none",
            },
            "&.Mui-selected:hover": {
              boxShadow: "none",
            },
            "&.Mui-focusVisible": {
              boxShadow: "none",
            },
            "& .MuiTouchRipple-root": {
              display: "none",
            },
          },
          "& .MuiYearCalendar-root": {
            width: "100%",
            maxHeight: "13.75rem",
            overflowY: "auto",
            overflowX: "hidden",
            alignContent: "start",
            paddingBottom: 0,
          },
        }}
      />
    </LocalizationProvider>
  );

  return (
    <>
      {compact ? (
        <Box sx={{ width: "90%" }}>{calendario}</Box>
      ) : (
        <Box
          sx={{
            borderRadius: 3,
            bgcolor: "#F9FAFB",
            p: 2,
            width: "90%",
            maxWidth: esMovil ? 360 : 520,
            mx: "auto",
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Calendario
          </Typography>

          {calendario}

          <Typography variant="body2" sx={{ mt: 1, color: "#64748B" }}>
            {esMovil
              ? "Toca un día para crear o revisar una cita o medicamento."
              : "Pasa el mouse para ver citas. Doble clic para abrir."}
          </Typography>
        </Box>
      )}

      <ModalCitaMedica
        open={modalAbierto}
        selectedDate={fechaSeleccionada}
        onClose={() => {
          setModalAbierto(false);
          onExternalClose?.();
        }}
        onChangeDate={setFechaSeleccionada}
        citasPorFecha={citasPorFecha}
        setCitasPorFecha={setCitasPorFecha}
        focusSection={focusSection}
        medicamentos={medicamentos}
        setMedicamentos={setMedicamentos}
        selectedMedId={selectedMedId}
        setSelectedMedId={setSelectedMedId}
      />
    </>
  );
}
