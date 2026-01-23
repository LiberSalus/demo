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
        maxWidth: 420,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Fecha arriba a la derecha */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Typography variant="body2" sx={{ color: "#64748B" }}>
          {fechaTexto}
        </Typography>
      </Box>

      {/* Nombre del médico */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
          Nombre del médico
        </Typography>
        <TextField
          name="medico"
          placeholder="Escribe el nombre del médico"
          value={form.medico}
          onChange={handleChange}
          fullWidth
          size="small"
          variant="outlined"
          InputProps={{ sx: { borderRadius: 999 } }}
        />
      </Box>

      {/* Especialidad */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
          Especialidad
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            name="especialidad"
            value={form.especialidad}
            onChange={handleChange}
            displayEmpty
            sx={{ borderRadius: 999 }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: "0 0 1rem 1rem", // 👈 parte importante
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
                },
              },
            }}
          >
            <MenuItem value="">
              <p className={styles.uno}>Selecciona una especialidad</p>
            </MenuItem>
            {ESPECIALIDADES.map((esp) => (
              <MenuItem key={esp} value={esp}>
                {esp}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Horario + Tipo de cita */}
      <Grid container columnSpacing={0}>
        {/* Horario */}
        <Grid item xs={12} sm={6} sx={{ pr: { sm: 1 } }}>
          <Box className={styles.horario}>
            <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
              Horario
            </Typography>
            {/* Horario */}
            <FormControl
              fullWidth
              size="small"
              sx={{ mr: 1 }}
              className={styles.horario}
            >
              <Select
                name="horario"
                value={form.horario}
                onChange={handleChange}
                displayEmpty
                sx={{ borderRadius: 999 }}
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
        </Grid>

        {/* Tipo de cita */}
        <Grid item xs={12} sm={6}>
          <Box className={styles.cita}>
            <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
              Tipo de cita
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                name="tipoCita"
                value={form.tipoCita}
                onChange={handleChange}
                sx={{ borderRadius: 999 }}
              >
                <MenuItem value="presencial">Presencial</MenuItem>
                <MenuItem value="en_linea">En línea</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>

      {/* Ubicación o leyenda según tipo de cita */}
      {esPresencial ? (
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
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
            InputProps={{ sx: { borderRadius: 999 } }}
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
        <Typography variant="body2" sx={{ mb: 0.5, ml: 2.5 }}>
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
          InputProps={{ sx: { borderRadius: 999 } }}
        />
      </Box>

      {/* Recordatorio */}
      <FormControlLabel
        className={styles.recordarme}
        control={
          <Checkbox
            name="recordar"
            checked={form.recordar}
            onChange={handleChange}
          />
        }
        label="Recordarme 1 día antes"
      />

      {/* Notas */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Notas
        </Typography>
        <TextField
          name="notas"
          placeholder="Agrega notas importantes para esta cita"
          value={form.notas}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={3}
          variant="outlined"
          InputProps={{ sx: { borderRadius: 3 } }}
        />
      </Box>

      {/* Botón Guardar */}
      <Box sx={{ mt: 1, display: "flex", justifyContent: "center", flexDirection:"column", alignItems:"center" }}>
        {errorMsg && (
          <Typography variant="caption" sx={{ color: "#DC2626", mt: 0, textAlign:"center"}}>
            {errorMsg}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={!form.medico || !form.horario}
          sx={{
            borderRadius: 999,
            px: 6,
            textTransform: "none",
            
          }}
        >
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

export default FormularioCitaMedica;
