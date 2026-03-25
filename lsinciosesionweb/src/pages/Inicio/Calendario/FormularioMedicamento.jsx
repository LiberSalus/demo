// src/pages/Inicio/Calendario/FormularioMedicamento.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Checkbox,
  FormControlLabel,
  Button,
  InputAdornment,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import styles from './FormularioCitaMedica.module.css'
import dayjs from "dayjs";
import "dayjs/locale/es-mx";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  generarHorarios,
  durationDays,
} from "./MedicamentoUtils";

dayjs.locale("es-mx");

// Opciones (puedes ajustar a gusto)
const PRESENTACIONES = [
  "Tableta", "Jarabe",
  "Aerosol",
  "Cápsula",
  "Comprimido",
  "Crema",
  "Emulsión",
  "Gel",
  "Goma (Masticable)",
  "Granulado",
  "Implante",
  "Laminilla",
  "Oblea",
  "Óvulo",
  "Parche",
  "Pasta",
  "Pastilla",
  "Polvo",
  "Pomada",
  "Sistema de liberación",
  "Solución",
  "Supositorio",
  "Suspensión",
  "Tableta",
  "Ungüento",
  "Cápsula",
  "Jarabe",
  "Gotas",
  "Inyección",
  "Inyección subcutánea",
  "Inhalador",
  "Pomada",
  "Otro",
];

const PATRONES = [
  {
    value: "daily_temp",
    label: "Toma diaria temporal",
    help: "Para tratamientos diarios con fecha de término.",
  },
  {
    value: "daily_perm",
    label: "Toma diaria permanente",
    help: "Para tratamientos permanentes.",
  },
  {
    value: "every_n_days",
    label: "Cada cierto número de días",
    help: "Tomar el medicamento cada X días.",
  },
  {
    value: "with_pauses",
    label: "Tomar con pausas",
    help: "X días tomando y Y días descansando.",
  },
];

const FRECUENCIA_HORAS_OPTIONS = [24, 12, 8, 6, 4];

const outlinedFieldSx = {
  backgroundColor: "#fff",
  borderRadius: "3rem",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ACCCEB",
    
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
  },
  "& .MuiOutlinedInput-input": {
    fontSize: "13.5px",
    paddingLeft: "1rem",
  },
  "& .MuiSelect-select": {
    fontSize: "13.5px",
    paddingLeft: "1rem",
  },
  "& .MuiSelect-root": {
    backgroundColor: "#fff",
  },
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px #fff inset",
    WebkitTextFillColor: "#0f172a",
    caretColor: "#0f172a",
    borderRadius: "inherit",
  },
  "& textarea:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px #fff inset",
    WebkitTextFillColor: "#0f172a",
    caretColor: "#0f172a",
    borderRadius: "inherit",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ACCCEB",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ACCCEB",
  },
};

const pillInputSx = {
  borderRadius: 999,
  backgroundColor: "#fff",
  ...outlinedFieldSx,
};
const fieldLabelSx = { mb: 0.3, pl: "1rem", fontSize: "0.9rem", color: "#334155" };
const pairRowSx = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  columnGap: "0.75rem",
  rowGap: "0.5rem",
  alignItems: "start",
};
const compactHelperSx = {
  color: "#64748B",
  fontSize: "0.85rem",
  mt: 0.45,
  ml: 0.5,
};
const compactFieldSx = {
  "& .MuiOutlinedInput-root": {
    height: "2.35rem",
  },
  "& .MuiOutlinedInput-input": {
    paddingTop: 0,
    paddingBottom: 0,
  },
  "& .MuiSelect-select": {
    minHeight: "2.35rem !important",
    display: "flex",
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 0,
    boxSizing: "border-box",
  },
};
const calendarFieldSx = {
  "& .MuiInputBase-root": {
    borderRadius: 999,
    borderColor: "#accceb",
    fontSize: "0.5rem",
  },
};
const accordionMenuProps = {
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
  transitionDuration: 180,
  PaperProps: {
    elevation: 0,
    sx: {
      mt: 0.15,
      border: "2px solid #ACCCEB",
      
      borderRadius: "0 0 1.5rem 1.5rem",
      boxShadow: "0px 10px 26px rgba(15, 23, 42, 0.08)",
      overflow: "hidden",
      backgroundColor: "#fff",
    },
  },
  MenuListProps: {
    sx: {
      py: 0.25,
      "& .MuiMenuItem-root": {
        minHeight: "unset",
        alignItems: "flex-start",
        padding: "0.65rem 1rem",
      },
    },
  },
};
const createOverlayMenuProps = (topPadding) => ({
  ...accordionMenuProps,
  disablePortal: true,
  sx: {
    zIndex: -1,
    transform: "translateY(-1rem)",
  },
  PaperProps: {
    ...accordionMenuProps.PaperProps,
    className: styles.menuDesplegable,
    sx: {
      ...accordionMenuProps.PaperProps.sx,
      mt: "-0.3rem",
      pt: topPadding,
      pb: "1rem",
      maxHeight: "16.5rem",
      overflow: "hidden",
      zIndex: -1,
      borderTop: "none",
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
  },
  MenuListProps: {
    ...accordionMenuProps.MenuListProps,
    sx: {
      ...accordionMenuProps.MenuListProps.sx,
      zIndex: -1,
      maxHeight: `calc(16.5rem - ${topPadding})`,
      overflowY: "auto",
      overflowX: "hidden",
    },
  },
});
const presentationMenuProps = createOverlayMenuProps("1.2rem");
const timeMenuProps = createOverlayMenuProps("1.8rem");
const patternMenuProps = createOverlayMenuProps("2.4rem");
const accordionSelectSx = {
  "& .MuiSelect-icon": {
    fill: "#505151",
    fontSize: "2rem",
    right: 10,
    transition: "transform 180ms ease, color 180ms ease",
    transformOrigin: "center",
  },
  "& .MuiSelect-iconOpen": {
    transform: "rotate(180deg)",
  },
};
const checkboxLabelSx = {
  mt: 0.1,
  alignSelf: "flex-end",
  m: 0,
  "& .MuiFormControlLabel-label": {
    fontSize: "0.85rem",
    color: "#334155",
  },
};

const FormularioMedicamento = ({
  selectedDate = dayjs(), // día seleccionado en calendario del modal
  onGuardar,
  isMobile,
}) => {
  const presentationFieldRef = useRef(null);
  const [presentationMenuWidth, setPresentationMenuWidth] = useState(null);
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [form, setForm] = useState({
    medicamento: "",
    dosis: "",
    presentacion: "",
    cantidad: "",
    patron: "daily_temp",

    // frecuencia por horas
    frecuenciaHoras: 24,

    // hora inicio (string tipo "11:30 am")
    horaInicio: "8:00 am",

    // fechas (siempre hay endDate, confirmado)
    startDate: selectedDate.format("YYYY-MM-DD"),
    endDate: selectedDate.add(7, "day").format("YYYY-MM-DD"), // default para que no quede vacío

    // patrón: cada N días
    everyNDays: 2,
    duracionDias: 8,

    // patrón: con pausas
    takeDays: 3,
    restDays: 2,

    notas: "",
    recordar: true, // checkbox (10 min antes)
  });

  const [errorMsg, setErrorMsg] = useState("");

  // Cuando cambie el día seleccionado, si es permanente:
  // startDate se “jala” del calendario (como pediste)
  useEffect(() => {
    const key = selectedDate.format("YYYY-MM-DD");
    setForm((f) => {
      if (f.patron !== "daily_perm") return f;
      const end = dayjs(key).add(30, "day").format("YYYY-MM-DD"); // default extendido
      return { ...f, startDate: key, endDate: f.endDate || end };
    });
  }, [selectedDate]);

  // Si el usuario cambia a "permanente", amarramos startDate al selectedDate
  useEffect(() => {
    if (form.patron !== "daily_perm") return;
    const key = selectedDate.format("YYYY-MM-DD");
    setForm((f) => ({
      ...f,
      startDate: key,
      // si endDate está vacío por alguna razón, damos uno por defecto
      endDate: f.endDate || dayjs(key).add(30, "day").format("YYYY-MM-DD"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.patron]);

  useEffect(() => {
    if (form.patron !== "every_n_days") return;
    const key = selectedDate.format("YYYY-MM-DD");
    setForm((f) => ({
      ...f,
      startDate: key,
      endDate: dayjs(key)
        .add(Math.max(Number(f.duracionDias || 1) - 1, 0), "day")
        .format("YYYY-MM-DD"),
    }));
  }, [form.patron, form.duracionDias, selectedDate]);

  useEffect(() => {
    const node = presentationFieldRef.current;
    if (!node) return;

    const syncWidth = () => {
      setPresentationMenuWidth(node.getBoundingClientRect().width);
    };

    syncWidth();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(syncWidth);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const horarios = useMemo(() => generarHorarios(0, 24), []);

  const effectiveStartDate = useMemo(() => {
    if (form.patron === "every_n_days") {
      return selectedDate.format("YYYY-MM-DD");
    }
    return form.startDate;
  }, [form.patron, form.startDate, selectedDate]);

  const effectiveEndDate = useMemo(() => {
    if (form.patron === "every_n_days") {
      const duration = Number(form.duracionDias || 0);
      if (!duration || duration < 1) return "";
      return dayjs(effectiveStartDate)
        .add(duration - 1, "day")
        .format("YYYY-MM-DD");
    }
    return form.endDate;
  }, [form.patron, form.duracionDias, effectiveStartDate, form.endDate]);

  const startDayjs = useMemo(() => dayjs(effectiveStartDate), [effectiveStartDate]);
  const endDayjs = useMemo(() => dayjs(effectiveEndDate), [effectiveEndDate]);

  const duracion = useMemo(() => {
    if (form.patron === "every_n_days") return Number(form.duracionDias || 0);
    if (!effectiveStartDate || !effectiveEndDate) return 0;
    return durationDays(effectiveStartDate, effectiveEndDate);
  }, [form.patron, form.duracionDias, effectiveStartDate, effectiveEndDate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrorMsg("");
  };

  const setDateField = (name, d) => {
    const key = d?.isValid?.() ? d.format("YYYY-MM-DD") : "";
    setForm((f) => ({ ...f, [name]: key }));
    setErrorMsg("");
  };

  const validate = () => {
    if (!form.medicamento.trim()) return "Escribe el nombre del medicamento.";
    if (!form.presentacion) return "Selecciona la presentación.";
    if (!form.cantidad.trim()) return "Escribe la cantidad.";
    if (!form.horaInicio) return "Selecciona la hora de inicio.";
    if (!effectiveStartDate) return "Selecciona la fecha de inicio.";
    if (!effectiveEndDate) return "Selecciona la fecha de fin.";

    const s = dayjs(effectiveStartDate);
    const e = dayjs(effectiveEndDate);
    if (e.isBefore(s, "day"))
      return "La fecha de fin no puede ser antes del inicio.";

    if (form.patron === "every_n_days") {
      const n = Number(form.everyNDays);
      if (!n || n < 1) return "El campo 'Cada' debe ser mínimo 1 día.";
      const d = Number(form.duracionDias);
      if (!d || d < 1) return "El campo 'Duración' debe ser mínimo 1 día.";
    }

    if (form.patron === "with_pauses") {
      const take = Number(form.takeDays);
      const rest = Number(form.restDays);
      if (!take || take < 1)
        return "El campo 'Tomar por' debe ser mínimo 1 día.";
      if (rest < 0) return "El campo 'Descanso por' no puede ser negativo.";
      if (take + rest < 1)
        return "La suma de tomar + descanso debe ser válida.";
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setErrorMsg(msg);
      return;
    }

    // Armamos la regla completa (tratamiento)
    const rule = {
      id: (globalThis.crypto?.randomUUID?.() ?? String(Date.now())),
      medicamento: form.medicamento.trim(),
      dosis: form.dosis.trim(),
      presentacion: form.presentacion,
      cantidad: form.cantidad.trim(),
      notas: form.notas.trim(),

      patron: form.patron,
      frecuenciaHoras: Number(form.frecuenciaHoras || 24),
      horaInicio: form.horaInicio, // "11:30 am" compatible ✅

      startDate: effectiveStartDate,
      endDate: effectiveEndDate, // siempre hay endDate ✅

      everyNDays:
        form.patron === "every_n_days"
          ? Number(form.everyNDays || 1)
          : undefined,
      duracionDias:
        form.patron === "every_n_days"
          ? Number(form.duracionDias || 1)
          : undefined,
      takeDays:
        form.patron === "with_pauses" ? Number(form.takeDays || 1) : undefined,
      restDays:
        form.patron === "with_pauses" ? Number(form.restDays || 0) : undefined,

      // recordatorio fijo (10 min antes; checkbox es hábito)
      recordatorioMin: form.recordar ? 10 : null,
    };

    onGuardar?.(rule);
  };

  const patronMeta = useMemo(() => {
    return PATRONES.find((p) => p.value === form.patron);
  }, [form.patron]);
  const responsivePairRowSx = useMemo(
    () => ({
      ...pairRowSx,
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      rowGap: isMobile ? "0.75rem" : pairRowSx.rowGap,
    }),
    [isMobile],
  );
  const submitButtonSx = {
      borderRadius: 999,
      px: 6,
      minWidth: "10rem",
      textTransform: "none",
      width: isMobile ? "100%" : "auto",
      maxWidth: 360,
      mt: 1,
      fontSize: "0.95rem",
    };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "27.31rem",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 0.7 : 0.8,
        }}
      >
        {/* Fecha arriba a la derecha (solo referencia visual) */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Typography
              variant="body2"
              sx={{ color: "#64748B", fontSize: isMobile ? "0.95rem" : "1rem" }}
            >
              {selectedDate.format("DD - MMM - YYYY")}
            </Typography>
          </Box>

        {/* Medicamento + Dosis */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "15rem 9rem",
            columnGap: isMobile ? 0 : "1rem",
            rowGap: 1.5,
            alignItems: "start",
          }}
        >
          <Box sx={{ width: isMobile ? "100%" : "15rem" }}>
            <Typography variant="body2" sx={fieldLabelSx}>
              Medicamento
            </Typography>
            <TextField
              name="medicamento"
              placeholder="Nombre del medicamento"
              value={form.medicamento}
              onChange={handleChange}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ sx: pillInputSx, }}
              sx={{
                ...outlinedFieldSx,
                ...compactFieldSx,
                "& .MuiOutlinedInput-input": {
                  width: "100%",
                  maxWidth: "18rem",
                  boxSizing: "border-box",
                },
              }}
            />
          </Box>
          <Box sx={{ width: isMobile ? "100%" : "9rem" }}>

            <Typography variant="body2" sx={fieldLabelSx}>
              Dosis
            </Typography>
            <TextField
              name="dosis"
              placeholder="Cantidad"
              value={form.dosis}
              onChange={handleChange}
              size="small"
              variant="outlined"
              InputProps={{ sx: pillInputSx }}
              fullWidth
              sx={{
                ...outlinedFieldSx,
                ...compactFieldSx,
                "& .MuiOutlinedInput-input": {
                  width: "100%",
                  boxSizing: "border-box",
                },
              }}
            />
          </Box>
        </Box>

        {/* Presentación + Cantidad */}
        <Box sx={responsivePairRowSx}>
          <Box>
            <Typography variant="body2" sx={fieldLabelSx}>
              Presentación
            </Typography>
            <FormControl
              fullWidth
              size="small"
              ref={presentationFieldRef}
              sx={{ position: "relative", zIndex: presentationOpen ? 20 : 3 }}
            >
              <Select
                name="presentacion"
                value={form.presentacion}
                onChange={handleChange}
                onOpen={() => setPresentationOpen(true)}
                onClose={() => setPresentationOpen(false)}
                displayEmpty
                IconComponent={KeyboardArrowDownRoundedIcon}
                sx={{
                  ...pillInputSx,
                  ...compactFieldSx,
                  fontSize: "0.9rem",
                  position: "relative",
                  zIndex: 4,
                  backgroundColor: "#fff",
                  ...accordionSelectSx,
                }}
                MenuProps={{
                  ...presentationMenuProps,
                  PaperProps: {
                    ...presentationMenuProps.PaperProps,
                    sx: {
                      ...presentationMenuProps.PaperProps.sx,
                      width: presentationMenuWidth ?? undefined,
                      minWidth: presentationMenuWidth ?? undefined,
                    },
                  },
                }}
              >
                  <MenuItem value="">
                    <Typography sx={{ color: "#A7A8A9", fontSize: "0.9rem" }}>
                      Tipo de medicina
                    </Typography>
                  </MenuItem>
                {PRESENTACIONES.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography variant="body2" sx={fieldLabelSx}>
              Cantidad
            </Typography>
            <TextField
              name="cantidad"
              placeholder="Cantidad indicada"
              value={form.cantidad}
              onChange={handleChange}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ sx: pillInputSx }}
              sx={{
                ...outlinedFieldSx,
                ...compactFieldSx,
              }}
            />
          </Box>
        </Box>

        {/* Patrón del tratamiento */}
        <Box sx={{ position: "relative" }}>
          <Typography variant="body2" sx={fieldLabelSx}>
            Patrón del tratamiento
          </Typography>
          <FormControl
            fullWidth
            size="small"
            sx={{ position: "relative", zIndex: 3 }}
          >
            <Select
              className={styles.menuSelect}
              name="patron"
              value={form.patron}
              onChange={handleChange}
              IconComponent={KeyboardArrowDownRoundedIcon}
              sx={{
                borderRadius: 3,
                padding: "0.15rem 0",
                ...outlinedFieldSx,
                ...compactFieldSx,
                position: "relative",
                zIndex: 4,
                backgroundColor: "#fff",
                "& .MuiSelect-select": {
                  fontSize: "13.5px",
                  paddingLeft: "1rem",
                },
                ...accordionSelectSx,
              }}
              MenuProps={patternMenuProps}


            >
              {PATRONES.map((p) => (
                <MenuItem key={p.value} value={p.value} >
                    <Box sx={{ display: "flex", flexDirection: "column", }} >
                    <Typography sx={{ fontWeight: 600, fontSize: "0.92rem", color: "#334155" }}>
                      {p.label}
                    </Typography>
                    <Typography sx={{ fontSize: "0.78rem", color: "#64748B" }}>
                      {p.help}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </Box>

        {form.patron === "with_pauses" && (
          <Box sx={responsivePairRowSx}>
            <Box>
              <Typography variant="body2" sx={fieldLabelSx}>
                Tomar por:
              </Typography>
              <TextField
                name="takeDays"
                value={form.takeDays}
                onChange={handleChange}
                fullWidth
                size="small"
                InputProps={{
                  sx: pillInputSx,
                  endAdornment: (
                    <InputAdornment position="end">días</InputAdornment>
                  ),
                  inputMode: "numeric",
                }}
                sx={{
                  ...outlinedFieldSx,
                  ...compactFieldSx,
                  "& .MuiOutlinedInput-input": {
                    paddingLeft: "5rem",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  },
                }}
              />
            </Box>
            <Box>
              <Typography variant="body2" sx={fieldLabelSx}>
                Descanso por:
              </Typography>
              <TextField
                name="restDays"
                value={form.restDays}
                onChange={handleChange}
                fullWidth
                size="small"
                InputProps={{
                  sx: pillInputSx,
                  endAdornment: (
                    <InputAdornment position="end">días</InputAdornment>
                  ),
                  inputMode: "numeric",
                }}
                sx={{
                  ...outlinedFieldSx,
                  ...compactFieldSx,

                  "& .MuiOutlinedInput-input": {
                    paddingLeft: "5rem",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  },
                }}
              />
            </Box>
          </Box>
        )}

        {form.patron === "every_n_days" ? (
          <>
            <Box sx={responsivePairRowSx}>
              <Box>
                <Typography variant="body2" sx={fieldLabelSx}>
                  Duración
                </Typography>
                <TextField
                  name="duracionDias"
                  value={form.duracionDias}
                  onChange={handleChange}
                  placeholder="Días de duración"
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{
                    sx: pillInputSx,
                    inputMode: "numeric",
                  }}
                  sx={{ ...outlinedFieldSx, ...compactFieldSx }}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={fieldLabelSx}>
                  Cada:
                </Typography>
                <TextField
                  name="everyNDays"
                  value={form.everyNDays}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  InputProps={{
                    sx: pillInputSx,
                    endAdornment: (
                      <InputAdornment position="end">días</InputAdornment>
                    ),
                    inputMode: "numeric",
                  }}
                  sx={{
                    ...outlinedFieldSx,
                    ...compactFieldSx,
                    "& .MuiOutlinedInput-input": {
                      fontSize: "1rem",
                      paddingLeft: "1rem",
                      fontWeight: "bold",
                    },
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ width: isMobile ? "100%" : "50%" }}>
              <Typography variant="body2" sx={fieldLabelSx}>
                Hora de inicio
              </Typography>
              <FormControl
                fullWidth
                size="small"
                sx={{ position: "relative", zIndex: 1 }}
              >
                <Select
                  className={styles.menuSelect}
                  name="horaInicio"
                  value={form.horaInicio}
                  onChange={handleChange}
                  IconComponent={KeyboardArrowDownRoundedIcon}
                  sx={{
                    ...pillInputSx,
                    ...compactFieldSx,
                    color: "#A7A8A9",
                    fontSize: "0.9rem",
                    position: "relative",
                    zIndex: 4,
                    backgroundColor: "#fff",
                    ...accordionSelectSx,
                  }}
                  MenuProps={timeMenuProps}
                >
                  {horarios.map((h) => (
                    <MenuItem key={h} value={h}>
                      {h}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {!isMobile && (
              <Box
                sx={{
                  ...pairRowSx,
                  visibility: "hidden",
                  pointerEvents: "none",
                }}
              >
                <Box>
                  <Typography variant="body2" sx={fieldLabelSx}>
                    Fecha de inicio
                  </Typography>
                  <Box
                    sx={{
                      height: "2.35rem",
                      borderRadius: 999,
                      backgroundColor: "#fff",
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={fieldLabelSx}>
                    Fecha de fin
                  </Typography>
                  <Box
                    sx={{
                      height: "2.35rem",
                      borderRadius: 999,
                      backgroundColor: "#fff",
                    }}
                  />
                </Box>
              </Box>
            )}
          </>
        ) : form.patron === "daily_perm" ? (
          <>
            <Box sx={responsivePairRowSx}>
              <Box>
                <Typography variant="body2" sx={fieldLabelSx}>
                  Duración
                </Typography>
                <TextField
                  value="Diario"
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{ sx: pillInputSx, readOnly: true }}
                  sx={{ ...outlinedFieldSx, ...compactFieldSx }}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={fieldLabelSx}>
                  Frecuencia
                </Typography>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ position: "relative", zIndex: 1 }}
                >
                  <Select
                    className={styles.menuSelect}
                    name="frecuenciaHoras"
                    value={form.frecuenciaHoras}
                    onChange={handleChange}
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    sx={{
                      ...pillInputSx,
                      ...compactFieldSx,
                      color: "#334155",
                      fontSize: "0.9rem",
                      position: "relative",
                      zIndex: 4,
                      backgroundColor: "#fff",
                      ...accordionSelectSx,
                    }}
                    MenuProps={timeMenuProps}
                  >
                    {FRECUENCIA_HORAS_OPTIONS.map((h) => (
                      <MenuItem
                        key={h}
                        value={h}
                        sx={{ justifyContent: "center", textAlign: "center" }}
                      >
                        {h} horas
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ width: isMobile ? "100%" : "50%" }}>
              <Typography variant="body2" sx={fieldLabelSx}>
                Hora de inicio
              </Typography>
              <FormControl
                fullWidth
                size="small"
                sx={{ position: "relative", zIndex: 1 }}
              >
                <Select
                  className={styles.menuSelect}
                  name="horaInicio"
                  value={form.horaInicio}
                  onChange={handleChange}
                  IconComponent={KeyboardArrowDownRoundedIcon}
                  sx={{
                    ...pillInputSx,
                    ...compactFieldSx,
                    color: "#A7A8A9",
                    fontSize: "0.9rem",
                    position: "relative",
                    zIndex: 4,
                    backgroundColor: "#fff",
                    ...accordionSelectSx,
                  }}
                  MenuProps={timeMenuProps}
                >
                  {horarios.map((h) => (
                    <MenuItem key={h} value={h}>
                      {h}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </>
        ) : (
          <>
            {/* Duración + Hora de inicio */}
            <Box sx={responsivePairRowSx}>
              <Box>
                <Typography variant="body2" sx={fieldLabelSx}>
                  Duración
                </Typography>
                <TextField
                  value={
                    duracion ? `${duracion} día${duracion > 1 ? "s" : ""}` : ""
                  }
                  placeholder="Días de duración"
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{ sx: pillInputSx, readOnly: true }}
                  sx={{ ...outlinedFieldSx, ...compactFieldSx }}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={fieldLabelSx}>
                  Hora de inicio
                </Typography>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ position: "relative", zIndex: 1 }}
                >
                  <Select
                    className={styles.menuSelect}
                    name="horaInicio"
                    value={form.horaInicio}
                    onChange={handleChange}
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    sx={{
                      ...pillInputSx,
                      ...compactFieldSx,
                      color: "#A7A8A9",
                      fontSize: "0.9rem",
                      position: "relative",
                      zIndex: 4,
                      backgroundColor: "#fff",
                      ...accordionSelectSx,
                    }}
                    MenuProps={timeMenuProps}
                  >
                    {horarios.map((h) => (
                      <MenuItem key={h} value={h}>
                        {h}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Fechas inicio/fin */}
            <Box sx={responsivePairRowSx}>
          <Box sx={{ width: "100%", minWidth: 0 }}>
            <Typography variant="body2" sx={fieldLabelSx}>
              Fecha de inicio
            </Typography>

            <DatePicker
              value={startDayjs}
              onChange={(d) => setDateField("startDate", d)}
              disabled={form.patron === "daily_perm"}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  placeholder: "Selecciona una fecha",
                  InputProps: {
                    sx: {
                      ...pillInputSx,
                      width: "100%",
                      fontSize: "13.5px",
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.2rem",
                      },
                    },
                  },
                  sx: {
                    ...outlinedFieldSx,
                    ...compactFieldSx,
                    ...calendarFieldSx,
                    width: "100%",
                    "& .MuiFormControl-root": {
                      width: "100%",
                    },
                    "& .MuiOutlinedInput-root": {
                      width: "100%",
                    },
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ width: "100%", minWidth: 0 }}>
            <Typography variant="body2" sx={fieldLabelSx}>
              Fecha de fin
            </Typography>

            <DatePicker
              value={endDayjs}
              onChange={(d) => setDateField("endDate", d)}
              minDate={startDayjs}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  placeholder: "Selecciona una fecha",
                  InputProps: {
                    sx: {
                      ...pillInputSx,
                      width: "100%",
                      fontSize: "13.5px",
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.2rem",
                      },

                    },
                  },
                  sx: {
                    ...outlinedFieldSx,
                    ...compactFieldSx,
                    ...calendarFieldSx,
                    width: "100%",
                    "& .MuiFormControl-root": {
                      width: "100%",
                    },
                    "& .MuiOutlinedInput-root": {
                      width: "100%",

                    },
                  },
                },
              }}
            />
          </Box>
            </Box>
          </>
        )}

        {/* Notas */}
        <Box>
          <Typography variant="body2" sx={fieldLabelSx}>
            Notas
          </Typography>
          <TextField
            name="notas"
            placeholder="Agrega notas importantes"
            value={form.notas}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={2}
            variant="outlined"
            InputProps={{ sx: { borderRadius: 3 } }}
            sx={outlinedFieldSx}
          />
        </Box>

        {/* Checkbox recordatorio (fijo 10 min antes) */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >

          <FormControlLabel
            control={
              <Checkbox
                name="recordar"
                checked={form.recordar}
                onChange={handleChange}
                icon={
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      border: "2px solid #007CBA",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "4px",
                      boxSizing: "border-box",
                    }}
                  />
                }
                checkedIcon={
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      border: "2px solid #007CBA",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxSizing: "border-box",
                    }}
                  >
                    <CheckIcon sx={{ color: "#007CBA", fontSize: "16px" }} />
                  </Box>
                }
              />
            }
            label="Recordarme 10 min antes"
            sx={checkboxLabelSx, { justifyContent: "end", }}
          />
        </Box>

        {/* Errores + Guardar */}
        <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {errorMsg && (
            <Typography
              variant="caption"
              sx={{ color: "#DC2626", mt: 0, textAlign: "center" }}
            >
              {errorMsg}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={
              !form.medicamento ||
                !form.presentacion ||
                !form.cantidad ||
                !form.horaInicio ||
                !effectiveStartDate ||
                !effectiveEndDate
              }
            sx={submitButtonSx}
          >
            Guardar
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default FormularioMedicamento;
