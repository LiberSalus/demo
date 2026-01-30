// src/pages/Inicio/Calendario/FormularioMedicamento.jsx
import React, { useEffect, useMemo, useState } from "react";
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

import dayjs from "dayjs";
import "dayjs/locale/es-mx";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  generarHorarios,
  durationDays,
  buildDailyTimes,
} from "./MedicamentoUtils";

dayjs.locale("es-mx");

// Opciones (puedes ajustar a gusto)
const PRESENTACIONES = [
  "Tableta",
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

const FRECUENCIAS = [
  { value: 24, label: "Cada 24 horas (1 vez al día)" },
  { value: 12, label: "Cada 12 horas (2 veces al día)" },
  { value: 8, label: "Cada 8 horas (3 veces al día)" },
  { value: 6, label: "Cada 6 horas (4 veces al día)" },
];

const pillInputSx = { borderRadius: 999 };

const FormularioMedicamento = ({
  selectedDate = dayjs(), // día seleccionado en calendario del modal
  onGuardar,
  isMobile,
}) => {
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

  const horarios = useMemo(() => generarHorarios(0, 24), []);

  const startDayjs = useMemo(() => dayjs(form.startDate), [form.startDate]);
  const endDayjs = useMemo(() => dayjs(form.endDate), [form.endDate]);

  const duracion = useMemo(() => {
    if (!form.startDate || !form.endDate) return 0;
    return durationDays(form.startDate, form.endDate);
  }, [form.startDate, form.endDate]);

  const perDayTimes = useMemo(() => {
    return buildDailyTimes(form.frecuenciaHoras, form.horaInicio);
  }, [form.frecuenciaHoras, form.horaInicio]);

  const tomasPorDia = perDayTimes.length;

  const totalAlertas = useMemo(() => {
    if (!duracion) return 0;
    return tomasPorDia * duracion;
  }, [duracion, tomasPorDia]);

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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 520,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Fecha arriba a la derecha (solo referencia visual) */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            {selectedDate.format("DD - MMM - YYYY")}
          </Typography>
        </Box>

        {/* Medicamento + Dosis */}
        <Grid container columnSpacing={2} rowSpacing={1.5}>
          <Grid item xs={12} sm={7}>
            <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
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
              InputProps={{ sx: pillInputSx }}
            />
          </Grid>

          <Grid item xs={12} sm={5}>
            <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
              Concentración
            </Typography>
            <TextField
              name="dosis"
              placeholder="Cantidad"
              value={form.dosis}
              onChange={handleChange}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ sx: pillInputSx }}
            />
          </Grid>

          {/* Presentación + Cantidad */}
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
              Presentación
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                name="presentacion"
                value={form.presentacion}
                onChange={handleChange}
                displayEmpty
                sx={pillInputSx}
              >
                <MenuItem value="">
                  <Typography sx={{ color: "#94A3B8" }}>
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
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
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
            />
          </Grid>
        </Grid>

        {/* Patrón del tratamiento */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
            Patrón del tratamiento
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              name="patron"
              value={form.patron}
              onChange={handleChange}
              sx={{ borderRadius: 3 }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: "0 0 1rem 1rem",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
                  },
                },
              }}
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

          {!!patronMeta?.help && (
            <Typography
              sx={{ color: "#64748B", fontSize: "0.82rem", mt: 0.7, ml: 0.5 }}
            >
              {patronMeta.help}
            </Typography>
          )}
        </Box>

        {/* Duración + Frecuencia */}
        <Grid container columnSpacing={2} rowSpacing={1.5}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
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
              helperText="Se calcula con fecha inicio/fin."
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
              Frecuencia
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                name="frecuenciaHoras"
                value={form.frecuenciaHoras}
                onChange={handleChange}
                sx={pillInputSx}
              >
                {FRECUENCIAS.map((f) => (
                  <MenuItem key={f.value} value={f.value}>
                    {f.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Campos extra según patrón */}
        {form.patron === "every_n_days" && (
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
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
            />
          </Box>
        )}

        {form.patron === "with_pauses" && (
          <Grid container columnSpacing={2} rowSpacing={1.5}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
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
              />
            </Grid>
          </Grid>
        )}

        {/* Hora de inicio */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
            Hora de inicio
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              name="horaInicio"
              value={form.horaInicio}
              onChange={handleChange}
              sx={pillInputSx}
            >
              {horarios.map((h) => (
                <MenuItem key={h} value={h}>
                  {h}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Preview rápido de horas del día */}
          <Typography sx={{ mt: 0.8, fontSize: "0.8rem", color: "#64748B" }}>
            {tomasPorDia} toma{tomasPorDia > 1 ? "s" : ""} por día:{" "}
            <strong style={{ color: "#0f172a" }}>
              {perDayTimes.slice(0, 4).join(", ")}
              {perDayTimes.length > 4 ? "…" : ""}
            </strong>
          </Typography>
        </Box>

        {/* Fechas inicio/fin */}
        <Grid container columnSpacing={2} rowSpacing={1.5}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
              Fecha de inicio
            </Typography>

            <DatePicker
              value={startDayjs}
              onChange={(d) => setDateField("startDate", d)}
              disabled={form.patron === "daily_perm"} // permanente jala del calendario ✅
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  placeholder: "Selecciona una fecha",
                  InputProps: { sx: pillInputSx },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
              Fecha de fin
            </Typography>

            <DatePicker
              value={endDayjs}
              onChange={(d) => setDateField("endDate", d)}
              minDate={startDayjs}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  placeholder: "Selecciona una fecha",
                  InputProps: { sx: pillInputSx },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Notas */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Notas
          </Typography>
          <TextField
            name="notas"
            placeholder="Agrega notas importantes"
            value={form.notas}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            InputProps={{ sx: { borderRadius: 3 } }}
          />
        </Box>

        {/* Checkbox recordatorio (fijo 10 min antes) */}
        <FormControlLabel
          control={
            <Checkbox
              name="recordar"
              checked={form.recordar}
              onChange={handleChange}
            />
          }
          label="Recordarme 10 min antes"
          sx={{ mt: 0.5 }}
        />

        {/* Resumen total alertas */}
        <Typography sx={{ fontSize: "0.82rem", color: "#64748B", mt: -0.5 }}>
          Total estimado:{" "}
          <strong style={{ color: "#0f172a" }}>{totalAlertas}</strong> alerta
          {totalAlertas === 1 ? "" : "s"} ({tomasPorDia} por día × {duracion}{" "}
          día{duracion > 1 ? "s" : ""})
        </Typography>

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
            sx={{
              borderRadius: 999,
              px: 6,
              textTransform: "none",
              width: isMobile ? "100%" : "auto",
              maxWidth: 360,
              mt: 1,
            }}
          >
            Guardar
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default FormularioMedicamento;
