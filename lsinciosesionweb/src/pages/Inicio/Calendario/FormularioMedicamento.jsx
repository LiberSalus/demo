import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  InputAdornment,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/es-mx";

import styles from "./FormularioCitaMedica.module.css";
import AdaptiveSelect from "./AdaptiveSelect";
import { generarHorarios, durationDays } from "./medicamentoUtils";

dayjs.locale("es-mx");

const PRESENTACIONES = [
  "Tableta",
  "Jarabe",
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
  "Gotas",
  "Inyección",
  "Inyección subcutánea",
  "Inhalador",
  "Ungüento",
  "Otro",
];

const PATRONES = [
  {
    value: "diario_temporal",
    label: "Toma diaria temporal",
    help: "Para tratamientos diarios con fecha de término.",
  },
  {
    value: "diario_permanente",
    label: "Toma diaria permanente",
    help: "Para tratamientos permanentes.",
  },
  {
    value: "cada_n_dias",
    label: "Cada cierto número de días",
    help: "Tomar el medicamento cada X días.",
  },
  {
    value: "con_pausas",
    label: "Tomar con pausas",
    help: "X días tomando y Y días descansando.",
  },
];

const OPCIONES_FRECUENCIA_HORAS = [24, 12, 8, 6, 4];

const sxCampoBase = {
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

const sxInputPastilla = {
  borderRadius: 999,
  backgroundColor: "#fff",
  ...sxCampoBase,
};

const sxEtiquetaCampo = {
  mb: 0.3,
  pl: "1rem",
  fontSize: "0.9rem",
  color: "#334155",
};

const sxFilaDoble = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  columnGap: "0.75rem",
  rowGap: "0.5rem",
  alignItems: "start",
};

const sxCampoCompacto = {
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

const sxCampoCalendario = {
  "& .MuiInputBase-root": {
    borderRadius: 999,
    borderColor: "#accceb",
    fontSize: "0.5rem",
  },
};

const sxEtiquetaCheckbox = {
  mt: 0.1,
  alignSelf: "flex-end",
  m: 0,
  "& .MuiFormControlLabel-label": {
    fontSize: "0.85rem",
    color: "#334155",
  },
};

function crearFormularioInicial(fechaSeleccionada) {
  return {
    medicamento: "",
    dosis: "",
    presentacion: "",
    cantidad: "",
    patron: "diario_temporal",
    frecuenciaHoras: 24,
    horaInicio: "8:00 am",
    startDate: fechaSeleccionada.format("YYYY-MM-DD"),
    endDate: fechaSeleccionada.add(7, "day").format("YYYY-MM-DD"),
    everyNDays: 2,
    duracionDias: 8,
    takeDays: 3,
    restDays: 2,
    notas: "",
    recordar: true,
  };
}

export default function FormularioMedicamento({
  selectedDate = dayjs(),
  onGuardar,
  isMobile,
}) {
  const [formulario, setFormulario] = useState(() =>
    crearFormularioInicial(selectedDate)
  );
  const [mensajeError, setMensajeError] = useState("");

  const opcionesPatron = useMemo(
    () =>
      PATRONES.map((patron) => ({
        value: patron.value,
        label: patron.label,
        description: patron.help,
      })),
    []
  );

  const opcionesFrecuencia = useMemo(
    () =>
      OPCIONES_FRECUENCIA_HORAS.map((horas) => ({
        value: horas,
        label: `${horas} horas`,
      })),
    []
  );

  const horarios = useMemo(() => generarHorarios(0, 24), []);

  const sxFilaResponsive = useMemo(
    () => ({
      ...sxFilaDoble,
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      rowGap: isMobile ? "0.75rem" : sxFilaDoble.rowGap,
    }),
    [isMobile]
  );

  const sxBotonGuardar = useMemo(
    () => ({
      borderRadius: 999,
      px: 6,
      minWidth: "10rem",
      textTransform: "none",
      width: isMobile ? "100%" : "auto",
      maxWidth: 360,
      mt: 1,
      fontSize: "0.95rem",
    }),
    [isMobile]
  );

  // Algunos patrones dependen del día activo del calendario, por eso se
  // sincronizan automáticamente cuando cambia la fecha seleccionada.
  useEffect(() => {
    const claveFecha = selectedDate.format("YYYY-MM-DD");
    setFormulario((formularioActual) => {
      if (formularioActual.patron !== "diario_permanente") return formularioActual;

      const fechaFinDefault = dayjs(claveFecha)
        .add(30, "day")
        .format("YYYY-MM-DD");

      return {
        ...formularioActual,
        startDate: claveFecha,
        endDate: formularioActual.endDate || fechaFinDefault,
      };
    });
  }, [selectedDate]);

  useEffect(() => {
    if (formulario.patron !== "diario_permanente") return;

    const claveFecha = selectedDate.format("YYYY-MM-DD");
    setFormulario((formularioActual) => ({
      ...formularioActual,
      startDate: claveFecha,
      endDate:
        formularioActual.endDate ||
        dayjs(claveFecha).add(30, "day").format("YYYY-MM-DD"),
    }));
  }, [formulario.patron, selectedDate]);

  useEffect(() => {
    if (formulario.patron !== "cada_n_dias") return;

    const claveFecha = selectedDate.format("YYYY-MM-DD");
    setFormulario((formularioActual) => ({
      ...formularioActual,
      startDate: claveFecha,
      endDate: dayjs(claveFecha)
        .add(Math.max(Number(formularioActual.duracionDias || 1) - 1, 0), "day")
        .format("YYYY-MM-DD"),
    }));
  }, [formulario.patron, formulario.duracionDias, selectedDate]);

  const fechaInicioEfectiva = useMemo(() => {
    if (formulario.patron === "cada_n_dias") {
      return selectedDate.format("YYYY-MM-DD");
    }
    return formulario.startDate;
  }, [formulario.patron, formulario.startDate, selectedDate]);

  const fechaFinEfectiva = useMemo(() => {
    if (formulario.patron === "cada_n_dias") {
      const duracion = Number(formulario.duracionDias || 0);
      if (!duracion || duracion < 1) return "";

      return dayjs(fechaInicioEfectiva)
        .add(duracion - 1, "day")
        .format("YYYY-MM-DD");
    }

    return formulario.endDate;
  }, [
    formulario.patron,
    formulario.duracionDias,
    formulario.endDate,
    fechaInicioEfectiva,
  ]);

  const fechaInicioDayjs = useMemo(
    () => dayjs(fechaInicioEfectiva),
    [fechaInicioEfectiva]
  );
  const fechaFinDayjs = useMemo(
    () => dayjs(fechaFinEfectiva),
    [fechaFinEfectiva]
  );

  const duracionTratamiento = useMemo(() => {
    if (formulario.patron === "cada_n_dias") {
      return Number(formulario.duracionDias || 0);
    }
    if (!fechaInicioEfectiva || !fechaFinEfectiva) return 0;
    return durationDays(fechaInicioEfectiva, fechaFinEfectiva);
  }, [
    formulario.patron,
    formulario.duracionDias,
    fechaInicioEfectiva,
    fechaFinEfectiva,
  ]);

  const actualizarCampo = (evento) => {
    const { name, value, type, checked } = evento.target;
    setFormulario((formularioActual) => ({
      ...formularioActual,
      [name]: type === "checkbox" ? checked : value,
    }));
    setMensajeError("");
  };

  const actualizarCampoDirecto = (campo, valor) => {
    setFormulario((formularioActual) => ({
      ...formularioActual,
      [campo]: valor,
    }));
    setMensajeError("");
  };

  const actualizarFecha = (campo, fecha) => {
    const claveFecha = fecha?.isValid?.() ? fecha.format("YYYY-MM-DD") : "";
    actualizarCampoDirecto(campo, claveFecha);
  };

  const validarFormulario = () => {
    if (!formulario.medicamento.trim()) {
      return "Escribe el nombre del medicamento.";
    }
    if (!formulario.presentacion) {
      return "Selecciona la presentación.";
    }
    if (!formulario.cantidad.trim()) {
      return "Escribe la cantidad.";
    }
    if (!formulario.horaInicio) {
      return "Selecciona la hora de inicio.";
    }
    if (!fechaInicioEfectiva) {
      return "Selecciona la fecha de inicio.";
    }
    if (!fechaFinEfectiva) {
      return "Selecciona la fecha de fin.";
    }

    const inicio = dayjs(fechaInicioEfectiva);
    const fin = dayjs(fechaFinEfectiva);
    if (fin.isBefore(inicio, "day")) {
      return "La fecha de fin no puede ser antes del inicio.";
    }

    if (formulario.patron === "cada_n_dias") {
      const cadaDias = Number(formulario.everyNDays);
      const duracionDias = Number(formulario.duracionDias);

      if (!cadaDias || cadaDias < 1) {
        return "El campo 'Cada' debe ser mínimo 1 día.";
      }
      if (!duracionDias || duracionDias < 1) {
        return "El campo 'Duración' debe ser mínimo 1 día.";
      }
    }

    if (formulario.patron === "con_pausas") {
      const diasToma = Number(formulario.takeDays);
      const diasDescanso = Number(formulario.restDays);

      if (!diasToma || diasToma < 1) {
        return "El campo 'Tomar por' debe ser mínimo 1 día.";
      }
      if (diasDescanso < 0) {
        return "El campo 'Descanso por' no puede ser negativo.";
      }
      if (diasToma + diasDescanso < 1) {
        return "La suma de tomar + descanso debe ser válida.";
      }
    }

    return "";
  };

  const guardarFormulario = (evento) => {
    evento.preventDefault();

    const error = validarFormulario();
    if (error) {
      setMensajeError(error);
      return;
    }

    const reglaTratamiento = {
      id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      medicamento: formulario.medicamento.trim(),
      dosis: formulario.dosis.trim(),
      presentacion: formulario.presentacion,
      cantidad: formulario.cantidad.trim(),
      notas: formulario.notas.trim(),
      patron: formulario.patron,
      frecuenciaHoras: Number(formulario.frecuenciaHoras || 24),
      horaInicio: formulario.horaInicio,
      startDate: fechaInicioEfectiva,
      endDate: fechaFinEfectiva,
      everyNDays:
        formulario.patron === "cada_n_dias"
          ? Number(formulario.everyNDays || 1)
          : undefined,
      duracionDias:
        formulario.patron === "cada_n_dias"
          ? Number(formulario.duracionDias || 1)
          : undefined,
      takeDays:
        formulario.patron === "con_pausas"
          ? Number(formulario.takeDays || 1)
          : undefined,
      restDays:
        formulario.patron === "con_pausas"
          ? Number(formulario.restDays || 0)
          : undefined,
      recordatorioMin: formulario.recordar ? 10 : null,
    };

    onGuardar?.(reglaTratamiento);
  };

  const renderCampoSelect = ({
    etiqueta,
    campo,
    valor,
    placeholder,
    opciones,
  }) => (
    <Box>
      <Typography variant="body2" sx={sxEtiquetaCampo}>
        {etiqueta}
      </Typography>
      <AdaptiveSelect
        value={valor}
        placeholder={placeholder}
        options={opciones}
        isMobile={isMobile}
        className={styles.menuSelect}
        onChange={(nuevoValor) => actualizarCampoDirecto(campo, nuevoValor)}
      />
    </Box>
  );

  const renderCampoFecha = ({ etiqueta, campo, valor, minDate, disabled }) => (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Typography variant="body2" sx={sxEtiquetaCampo}>
        {etiqueta}
      </Typography>

      <DatePicker
        value={valor}
        onChange={(fecha) => actualizarFecha(campo, fecha)}
        minDate={minDate}
        disabled={disabled}
        format="DD/MM/YYYY"
        slotProps={{
          textField: {
            fullWidth: true,
            size: "small",
            placeholder: "Selecciona una fecha",
            InputProps: {
              sx: {
                ...sxInputPastilla,
                width: "100%",
                fontSize: "13.5px",
                "& .MuiSvgIcon-root": {
                  fontSize: "1.2rem",
                },
              },
            },
            sx: {
              ...sxCampoBase,
              ...sxCampoCompacto,
              ...sxCampoCalendario,
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
  );

  const renderSelectorHoraInicio = () => (
    <Box sx={{ width: isMobile ? "100%" : "50%" }}>
      <Typography variant="body2" sx={sxEtiquetaCampo}>
        Hora de inicio
      </Typography>
      <AdaptiveSelect
        value={formulario.horaInicio}
        placeholder="Selecciona una hora"
        options={horarios}
        isMobile={isMobile}
        className={styles.menuSelect}
        onChange={(valor) => actualizarCampoDirecto("horaInicio", valor)}
      />
    </Box>
  );

  const renderBloqueFechas = () => (
    <Box sx={sxFilaResponsive}>
      {renderCampoFecha({
        etiqueta: "Fecha de inicio",
        campo: "startDate",
        valor: fechaInicioDayjs,
        disabled: formulario.patron === "diario_permanente",
      })}
      {renderCampoFecha({
        etiqueta: "Fecha de fin",
        campo: "endDate",
        valor: fechaFinDayjs,
        minDate: fechaInicioDayjs,
      })}
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
      <Box
        component="form"
        onSubmit={guardarFormulario}
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "27.31rem",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 0.7 : 0.8,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography
            variant="body2"
            sx={{ color: "#64748B", fontSize: isMobile ? "0.95rem" : "1rem" }}
          >
            {selectedDate.format("DD - MMM - YYYY")}
          </Typography>
        </Box>

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
            <Typography variant="body2" sx={sxEtiquetaCampo}>
              Medicamento
            </Typography>
            <TextField
              name="medicamento"
              placeholder="Nombre del medicamento"
              value={formulario.medicamento}
              onChange={actualizarCampo}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ sx: sxInputPastilla }}
              sx={{
                ...sxCampoBase,
                ...sxCampoCompacto,
                "& .MuiOutlinedInput-input": {
                  width: "100%",
                  maxWidth: "18rem",
                  boxSizing: "border-box",
                },
              }}
            />
          </Box>

          <Box sx={{ width: isMobile ? "100%" : "9rem" }}>
            <Typography variant="body2" sx={sxEtiquetaCampo}>
              Dosis
            </Typography>
            <TextField
              name="dosis"
              placeholder="Cantidad"
              value={formulario.dosis}
              onChange={actualizarCampo}
              size="small"
              variant="outlined"
              InputProps={{ sx: sxInputPastilla }}
              fullWidth
              sx={{
                ...sxCampoBase,
                ...sxCampoCompacto,
                "& .MuiOutlinedInput-input": {
                  width: "100%",
                  boxSizing: "border-box",
                },
              }}
            />
          </Box>
        </Box>

        <Box sx={sxFilaResponsive}>
          {renderCampoSelect({
            etiqueta: "Presentación",
            campo: "presentacion",
            valor: formulario.presentacion,
            placeholder: "Tipo de medicina",
            opciones: PRESENTACIONES,
          })}

          <Box>
            <Typography variant="body2" sx={sxEtiquetaCampo}>
              Cantidad
            </Typography>
            <TextField
              name="cantidad"
              placeholder="Cantidad indicada"
              value={formulario.cantidad}
              onChange={actualizarCampo}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ sx: sxInputPastilla }}
              sx={{
                ...sxCampoBase,
                ...sxCampoCompacto,
              }}
            />
          </Box>
        </Box>

        <Box sx={{ position: "relative" }}>
          <Typography variant="body2" sx={sxEtiquetaCampo}>
            Patrón del tratamiento
          </Typography>
          <AdaptiveSelect
            value={formulario.patron}
            placeholder="Selecciona un patrón"
            options={opcionesPatron}
            isMobile={isMobile}
            className={styles.menuSelect}
            onChange={(valor) => actualizarCampoDirecto("patron", valor)}
          />
        </Box>

        {formulario.patron === "con_pausas" && (
          <Box sx={sxFilaResponsive}>
            <Box>
              <Typography variant="body2" sx={sxEtiquetaCampo}>
                Tomar por:
              </Typography>
              <TextField
                name="takeDays"
                value={formulario.takeDays}
                onChange={actualizarCampo}
                fullWidth
                size="small"
                InputProps={{
                  sx: sxInputPastilla,
                  endAdornment: (
                    <InputAdornment position="end">días</InputAdornment>
                  ),
                  inputMode: "numeric",
                }}
                sx={{
                  ...sxCampoBase,
                  ...sxCampoCompacto,
                  "& .MuiOutlinedInput-input": {
                    paddingLeft: "5rem",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={sxEtiquetaCampo}>
                Descanso por:
              </Typography>
              <TextField
                name="restDays"
                value={formulario.restDays}
                onChange={actualizarCampo}
                fullWidth
                size="small"
                InputProps={{
                  sx: sxInputPastilla,
                  endAdornment: (
                    <InputAdornment position="end">días</InputAdornment>
                  ),
                  inputMode: "numeric",
                }}
                sx={{
                  ...sxCampoBase,
                  ...sxCampoCompacto,
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

        {formulario.patron === "cada_n_dias" ? (
          <>
            <Box sx={sxFilaResponsive}>
              <Box>
                <Typography variant="body2" sx={sxEtiquetaCampo}>
                  Duración
                </Typography>
                <TextField
                  name="duracionDias"
                  value={formulario.duracionDias}
                  onChange={actualizarCampo}
                  placeholder="Días de duración"
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{
                    sx: sxInputPastilla,
                    inputMode: "numeric",
                  }}
                  sx={{ ...sxCampoBase, ...sxCampoCompacto }}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={sxEtiquetaCampo}>
                  Cada:
                </Typography>
                <TextField
                  name="everyNDays"
                  value={formulario.everyNDays}
                  onChange={actualizarCampo}
                  fullWidth
                  size="small"
                  InputProps={{
                    sx: sxInputPastilla,
                    endAdornment: (
                      <InputAdornment position="end">días</InputAdornment>
                    ),
                    inputMode: "numeric",
                  }}
                  sx={{
                    ...sxCampoBase,
                    ...sxCampoCompacto,
                    "& .MuiOutlinedInput-input": {
                      fontSize: "1rem",
                      paddingLeft: "1rem",
                      fontWeight: "bold",
                    },
                  }}
                />
              </Box>
            </Box>

            {renderSelectorHoraInicio()}

            {!isMobile && (
              <Box
                sx={{
                  ...sxFilaDoble,
                  visibility: "hidden",
                  pointerEvents: "none",
                }}
              >
                <Box>
                  <Typography variant="body2" sx={sxEtiquetaCampo}>
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
                  <Typography variant="body2" sx={sxEtiquetaCampo}>
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
        ) : formulario.patron === "diario_permanente" ? (
          <>
            <Box sx={sxFilaResponsive}>
              <Box>
                <Typography variant="body2" sx={sxEtiquetaCampo}>
                  Duración
                </Typography>
                <TextField
                  value="Diario"
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{ sx: sxInputPastilla, readOnly: true }}
                  sx={{ ...sxCampoBase, ...sxCampoCompacto }}
                />
              </Box>

              {renderCampoSelect({
                etiqueta: "Frecuencia",
                campo: "frecuenciaHoras",
                valor: formulario.frecuenciaHoras,
                placeholder: "Selecciona frecuencia",
                opciones: opcionesFrecuencia,
              })}
            </Box>

            {renderSelectorHoraInicio()}
          </>
        ) : formulario.patron === "diario_temporal" ? (
          <>
            <Box sx={sxFilaResponsive}>
              <Box>
                <Typography variant="body2" sx={sxEtiquetaCampo}>
                  Duración
                </Typography>
                <TextField
                  value={
                    duracionTratamiento
                      ? `${duracionTratamiento} día${
                          duracionTratamiento > 1 ? "s" : ""
                        }`
                      : ""
                  }
                  placeholder="Días de duración"
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{ sx: sxInputPastilla, readOnly: true }}
                  sx={{ ...sxCampoBase, ...sxCampoCompacto }}
                />
              </Box>

              {renderCampoSelect({
                etiqueta: "Frecuencia",
                campo: "frecuenciaHoras",
                valor: formulario.frecuenciaHoras,
                placeholder: "Selecciona frecuencia",
                opciones: opcionesFrecuencia,
              })}
            </Box>

            {renderSelectorHoraInicio()}
            {renderBloqueFechas()}
          </>
        ) : (
          <>
            <Box sx={sxFilaResponsive}>
              <Box>
                <Typography variant="body2" sx={sxEtiquetaCampo}>
                  Duración
                </Typography>
                <TextField
                  value={
                    duracionTratamiento
                      ? `${duracionTratamiento} día${
                          duracionTratamiento > 1 ? "s" : ""
                        }`
                      : ""
                  }
                  placeholder="Días de duración"
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{ sx: sxInputPastilla, readOnly: true }}
                  sx={{ ...sxCampoBase, ...sxCampoCompacto }}
                />
              </Box>

              {renderSelectorHoraInicio()}
            </Box>

            {renderBloqueFechas()}
          </>
        )}

        <Box>
          <Typography variant="body2" sx={sxEtiquetaCampo}>
            Notas
          </Typography>
          <TextField
            name="notas"
            placeholder="Agrega notas importantes"
            value={formulario.notas}
            onChange={actualizarCampo}
            fullWidth
            multiline
            minRows={2}
            variant="outlined"
            InputProps={{ sx: { borderRadius: 3 } }}
            sx={sxCampoBase}
          />
        </Box>

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
                checked={formulario.recordar}
                onChange={actualizarCampo}
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
            sx={{ ...sxEtiquetaCheckbox, justifyContent: "end" }}
          />
        </Box>

        <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {mensajeError && (
            <Typography
              variant="caption"
              sx={{ color: "#DC2626", mt: 0, textAlign: "center" }}
            >
              {mensajeError}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={
              !formulario.medicamento ||
              !formulario.presentacion ||
              !formulario.cantidad ||
              !formulario.horaInicio ||
              !fechaInicioEfectiva ||
              !fechaFinEfectiva
            }
            sx={sxBotonGuardar}
          >
            Guardar
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
