// src/components/Calendario/FormularioCitaMedica.jsx
import React, { useMemo, useState } from "react";
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
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import dayjs from "dayjs";
import "dayjs/locale/es-mx";
import styles from "./FormularioCitaMedica.module.css";


dayjs.locale("es-mx");

// genera horarios en bloques de 30 min (ej. 10:00 am - 10:30 am)
function generarHorarios(inicioHora = 6, finHora = 20) {
  const slots = [];
  for (let h = inicioHora; h < finHora; h++) {
    for (let m = 0; m < 60; m += 30) {
      const start = dayjs().hour(h).minute(m).second(0);
      const end = start.add(30, "minute");
      const label = `${start.format("h:mm a")} - ${end.format("h:mm a")}`;
      slots.push(label);
    }
  }
  return slots;
}

const ESPECIALIDADES = [
  "Medicina General",
  "Neurología",
  "Cardiología",
  "Otorrinolaringología",
  "Gastroenterología",
  "Endocrinología",
  "Pediatría",
  "Psiquiatría",
];

const TIPOS_CITA = [
  { value: "presencial", label: "Presencial" },
  { value: "en_linea", label: "En línea" },
];

const outlinedFieldSx = {
  backgroundColor: "#fff",
  borderRadius:"3rem",
  fontSize: "13.5px",
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
    fontSize: "10.5px",
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

const fieldLabelSx = { mb: 0.3, ml: 2.5 };
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
const checkboxLabelSx = {
  mt: 0.1,
  alignSelf: "flex-end",
  m: 0,
  "& .MuiFormControlLabel-label": {
    fontSize: "0.9rem",
    color: "#334155",
  },
};
const submitButtonSx = {
  borderRadius: 999,
  px: 6,
  minWidth: "10rem",
  textTransform: "none",
  mt: 1,
};

const FormularioCitaMedica = ({
  selectedDate = dayjs(), // dayjs
  onGuardar, // función que recibe los datos del formulario
  citasDelDia = [],
}) => {
  const [form, setForm] = useState({
    medico: "",
    especialidad: "",
    horario: "",
    tipoCita: "presencial",
    ubicacion: "",
    motivo: "",
    notas: "",
    recordar: false,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const horarios = useMemo(() => generarHorarios(6, 20), []);

  const horariosOcupados = useMemo(
    () => new Set((citasDelDia || []).map((c) => c.horario)),
    [citasDelDia]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 👇 validar horario ocupado
    if (horariosOcupados.has(form.horario)) {
      setErrorMsg("Ya tienes una cita registrada en ese horario.");
      return;
    }

    if (onGuardar) {
      onGuardar({
        ...form,
        fecha: selectedDate.toISOString(),
      });
    }
  };

  const fechaTexto = selectedDate.format("DD - MMM - YYYY");
  const esPresencial = form.tipoCita === "presencial";

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: "27.31rem",
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        gap: 1.1,
      }}
    >
      {/* Fecha arriba a la derecha */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Typography variant="body2" sx={{ color: "#64748B", mb: 0.15, fontSize:"1rem" }}>
          {fechaTexto}
        </Typography>
      </Box>

      {/* Nombre del médico */}
      <Box>
        <Typography variant="body2" sx={fieldLabelSx}>
          Nombre del médico
        </Typography>
        <TextField
          name="medico"
          placeholder="Ingresa nombre del médico"
          value={form.medico}
          onChange={handleChange}
          fullWidth
          size="small"
          variant="outlined"
          className={styles.inputs}
          sx={{ ...outlinedFieldSx, ...compactFieldSx }}
          InputProps={{ sx: {fontSize: "13.5px", borderRadius: 999, p: 0, height: 1, m:0} }}
        />
      </Box>

      {/* Especialidad */}
      <Box>
        <Typography variant="body2" sx={fieldLabelSx}>
          Especialidad
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            name="especialidad"
            value={form.especialidad}
            onChange={handleChange}
            displayEmpty
            IconComponent={KeyboardArrowDownRoundedIcon}
            sx={{
              borderRadius: 999,
              background: "white",
              ...outlinedFieldSx,
              ...compactFieldSx,
              "& .MuiSelect-icon": {
                fill: "#505151",
                fontSize: "2rem",
                right: 10,
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: "0 0 1rem 1rem", // 👈 parte importante
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
                  
                },
              },
            }}
          >
            <MenuItem value="" sx={{}}>
              <p className={styles.uno}>Selecciona una especialidad</p>
            </MenuItem>
            {ESPECIALIDADES.map((esp) => (
              <MenuItem key={esp} value={esp} sx={{ background: "white",}}> 
                {esp}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Horario + Tipo de cita */}
      
        {/* Horario */}
        <Box className={styles.horarioCita}>  
          <Box className={styles.horario}>
            <Typography variant="body2" sx={fieldLabelSx}>
              Horario
            </Typography>
            {/* Horario */}
            <FormControl
              size="small"
              sx={{ mr: 1 }}
              className={styles.horario}
            >
              <Select
                name="horario"
                value={form.horario}
                onChange={handleChange}
                displayEmpty
                IconComponent={KeyboardArrowDownRoundedIcon}
                sx={{
                  borderRadius: 999,
                  background: "white",
                  ...outlinedFieldSx,
                  ...compactFieldSx,
                  "& .MuiSelect-icon": {
                    fill: "#505151",
                    fontSize: "2rem",
                    right: 10,
                  },
                }}
              >
                <MenuItem value="">
                  <p className={styles.uno}>Selecciona un horario</p>
                </MenuItem>
                {horarios.map((h) => {
                  const ocupado = horariosOcupados.has(h);
                  return (
                    <MenuItem key={h} value={h} disabled={ocupado}>
                      {h} {ocupado ? " (Ocupado)" : ""}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        

        {/* Tipo de cita */}
      
          <Box className={styles.cita}>
            <Typography variant="body2" sx={fieldLabelSx}>
              Tipo de cita
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                name="tipoCita"
                value={form.tipoCita}
                onChange={handleChange}
                IconComponent={KeyboardArrowDownRoundedIcon}
                sx={{
                  borderRadius: 999,
                  background: "white",
                  ...outlinedFieldSx,
                  ...compactFieldSx,
                  "& .MuiSelect-icon": {
                    fill: "#505151",
                    fontSize: "2rem",
                    right: 10,
                  },
                }}
              >
                <MenuItem value="presencial">Presencial</MenuItem>
                <MenuItem value="en_linea">En línea</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

      {/* Ubicación o leyenda según tipo de cita */}
      {esPresencial ? (
        <Box>
          <Typography variant="body2" sx={fieldLabelSx}>
            Ubicación
          </Typography>
          <TextField
            name="ubicacion"
            placeholder="Escribe la ubicación de la cita"
            value={form.ubicacion}
            onChange={handleChange}
            fullWidth
            size="small"
            variant="outlined"
            sx={{ ...outlinedFieldSx, ...compactFieldSx }}
            InputProps={{ sx: {fontSize: "13.5px", borderRadius: 999 } }}
          />
        </Box>
      ) : (
        <Typography
          variant="body2"
          sx={{ color: "#64748B", fontSize: "0.9rem", ml: 2.5 }}
        >
          Tu enlace estará disponible en esta misma cita cuando se confirme.
        </Typography>
      )}

      {/* Motivo de consulta */}
      <Box>
        <Typography variant="body2" sx={fieldLabelSx}>
          Motivo de consulta
        </Typography>
        <TextField
          name="motivo"
          placeholder="Describe brevemente el motivo de la consulta"
          value={form.motivo}
          onChange={handleChange}
          fullWidth
          size="small"
          variant="outlined"
          sx={{ ...outlinedFieldSx, ...compactFieldSx }}
          InputProps={{ sx: {fontSize: "13.5px", borderRadius: 999 } }}
        />
      </Box>

      {/* Recordatorio */}
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
      <FormControlLabel
        className={styles.recordarme}
        control={
          <Checkbox
            name="recordar"
            checked={form.recordar}
            onChange={handleChange}
            icon={
              <Box
                sx={{
                  width:  18,
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
                  width:  18,
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
        label="Recordarme 1 día antes"
        sx={checkboxLabelSx}
      />
      </Box>

      {/* Notas */}
      <Box>
        <Typography variant="body2" sx={fieldLabelSx}>
          Notas
        </Typography>
        <TextField
          name="notas"
          placeholder="Agrega notas importantes para esta cita"
          value={form.notas}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={2.6}
          variant="outlined"
          sx={outlinedFieldSx}
          InputProps={{ sx: { borderRadius: 3, backgroundColor:"#fff" } }}
        />
      </Box>

      {/* Botón Guardar */}
      <Box sx={{ mt: 0.35, display: "flex", justifyContent: "center", flexDirection:"column", alignItems:"center" }}>
        {errorMsg && (
          <Typography variant="caption" sx={{ color: "#DC2626", mt: 0, textAlign:"center"}}>
            {errorMsg}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={!form.medico || !form.horario}
          sx={submitButtonSx}
        >
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

export default FormularioCitaMedica;
