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
  "Tableta","Jarabe",
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

const outlinedFieldSx = {
  backgroundColor: "#fff",
  borderRadius:"3rem",
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
  backgroundColor:"#fff",
  ...outlinedFieldSx,
};
const fieldLabelSx = { mb: 0.3, ml: 0.5, fontSize: "0.9rem", color: "#334155" };
const pairRowSx = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  columnGap: "0.75rem",
  rowGap: "0.5rem",
  alignItems: "start",
};
const compactHelperSx = {
  color: "#64748B",
  fontSize: "0.82rem",
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
    borderColor:"#accceb",
    fontSize:"0.5rem",
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
      border: "1px solid #ACCCEB",
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
const presentationMenuProps = {
  ...accordionMenuProps,
  disablePortal: true,
  sx: {
    zIndex: 0,
  },
  PaperProps: {
    ...accordionMenuProps.PaperProps,
    sx: {
      ...accordionMenuProps.PaperProps.sx,
      mt: "-1.5rem",
      pt: "1.8rem",
      maxHeight: "16.5rem",
      overflow: "hidden",
      zIndex: -1,
      borderTop: "none",
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
  },
  MenuListProps: {
    sx: {
      py: 0.25,
      maxHeight: "calc(16.5rem - 1.8rem)",
      overflowY: "auto",
      overflowX: "hidden",
      "& .MuiMenuItem-root": {
        minHeight: "unset",
        alignItems: "flex-start",
        padding: "0.65rem 1rem",
      },
    },
  },
};
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

  const startDayjs = useMemo(() => dayjs(form.startDate), [form.startDate]);
  const endDayjs = useMemo(() => dayjs(form.endDate), [form.endDate]);

  const duracion = useMemo(() => {
    if (!form.startDate || !form.endDate) return 0;
    return durationDays(form.startDate, form.endDate);
  }, [form.startDate, form.endDate]);

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
    if (!form.startDate) return "Selecciona la fecha de inicio.";
    if (!form.endDate) return "Selecciona la fecha de fin.";

    const s = dayjs(form.startDate);
    const e = dayjs(form.endDate);
    if (e.isBefore(s, "day"))
      return "La fecha de fin no puede ser antes del inicio.";

    if (form.patron === "every_n_days") {
      const n = Number(form.everyNDays);
      if (!n || n < 1) return "El campo 'Cada' debe ser mínimo 1 día.";
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

      startDate: form.startDate,
      endDate: form.endDate, // siempre hay endDate ✅

      everyNDays:
        form.patron === "every_n_days"
          ? Number(form.everyNDays || 1)
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
  const submitButtonSx = {
    borderRadius: 999,
    px: 6,
    minWidth: "10rem",
    textTransform: "none",
    width: isMobile ? "100%" : "auto",
    maxWidth: 360,
    mt: 1,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: "27.31rem",
          display: "flex",
          flexDirection: "column",
          gap: 0.8,
        }}
      >
        {/* Fecha arriba a la derecha (solo referencia visual) */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography variant="body2" sx={{ color: "#64748B", fontSize: "1rem" }}>
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
        <Box sx={pairRowSx}>
          <Box>
            <Typography variant="body2" sx={fieldLabelSx}>
              Presentación
            </Typography>
            <FormControl
              fullWidth
              size="small"
              ref={presentationFieldRef}
              sx={{ position: "relative", zIndex: 3 }}
            >
              <Select
                name="presentacion"
                value={form.presentacion}
                onChange={handleChange}
                displayEmpty
                IconComponent={KeyboardArrowDownRoundedIcon}
                sx={{
                  ...pillInputSx,
                  ...compactFieldSx,
                  fontSize:"0.9rem",
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
                  <Typography sx={{ color: "#A7A8A9", fontSize: "0.85rem" }}>
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
        <Box>
          <Typography variant="body2" sx={fieldLabelSx}>
            Patrón del tratamiento
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              name="patron"
              value={form.patron}
              onChange={handleChange}
              IconComponent={KeyboardArrowDownRoundedIcon}
              sx={{
                borderRadius: 3,
                padding:"0.15rem 0",
                ...outlinedFieldSx,
                ...compactFieldSx,
                "& .MuiSelect-select": {
                  fontSize: "13.5px",
                  paddingLeft: "1rem",
                },
                ...accordionSelectSx,
              }}
              MenuProps={accordionMenuProps}
            >
              {PATRONES.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.92rem" }}>
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

        {/* Campos extra según patrón */}
        {form.patron === "every_n_days" && (
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
              sx={{ ...outlinedFieldSx, ...compactFieldSx,  "& .MuiOutlinedInput-input": {
                  fontSize: "1rem", paddingLeft:"45%", fontWeight:"bold"
                }, }}
            />
          </Box>
        )}

        
        {form.patron === "with_pauses" && (
          <Box sx={pairRowSx}>
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
                    fontWeight:"bold",
                    fontSize:"1.2rem",
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
                    fontWeight:"bold",
                    fontSize:"1.2rem",
                  },
                }}
              />
            </Box>
          </Box>
        )}

        {/* Duración + Hora de inicio */}
        <Box sx={pairRowSx}>
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
            <FormControl fullWidth size="small">
              <Select
                name="horaInicio"
                value={form.horaInicio}
                onChange={handleChange}
                IconComponent={KeyboardArrowDownRoundedIcon}
                sx={{
                  ...pillInputSx,
                  ...compactFieldSx,
                  color:"#A7A8A9",
                  fontSize:"0.85rem",
                  ...accordionSelectSx,
                }}
                MenuProps={accordionMenuProps}
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
        <Box sx={pairRowSx}>
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
          sx={checkboxLabelSx, {justifyContent:"end", }}
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
              !form.startDate ||
              !form.endDate
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
