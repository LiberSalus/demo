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

const fieldLabelSx = { mb: 0.3, ml: 2.5, fontSize: "0.9rem", color: "#334155" };
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
const accordionMenuProps = {
    anchorOrigin: { vertical: "bottom", horizontal: "left" },
    transformOrigin: { vertical: "top", horizontal: "left" },
    transitionDuration: 180,
    PaperProps: {
    elevation: 0,
    className: styles.menuDesplegable,
    sx: {
      mt: "-0.3rem",
      border: "2px solid #ACCCEB",
      borderTop: "none",
      borderRadius: "0 0 1.5rem 1.5rem",
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      boxShadow: "0px 10px 26px rgba(15, 23, 42, 0.08)",
      overflow: "hidden",
      backgroundColor: "#fff",
      zIndex: -1,
      pb: "1rem",
      maxHeight: "16.5rem",
    },
  },
  MenuListProps: {
    sx: {
      zIndex: -1,
      py: 0.25,
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
const mobileMenuProps = {
    ...accordionMenuProps,
    PaperProps: {
      ...accordionMenuProps.PaperProps,
      sx: {
        ...accordionMenuProps.PaperProps.sx,
        mt: 0.35,
        borderRadius: "1rem",
      },
    },
    MenuListProps: {
      ...accordionMenuProps.MenuListProps,
      sx: {
        ...accordionMenuProps.MenuListProps.sx,
        maxHeight: "16.5rem",
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
    sx: {
      ...accordionMenuProps.PaperProps.sx,
      pt: topPadding,
    },
  },
  MenuListProps: {
    ...accordionMenuProps.MenuListProps,
    sx: {
      ...accordionMenuProps.MenuListProps.sx,
      maxHeight: `calc(16.5rem - ${topPadding})`,
    },
  },
});
const specialtyMenuProps = createOverlayMenuProps("1.2rem");
const scheduleMenuProps = createOverlayMenuProps("1.8rem");
const appointmentTypeMenuProps = createOverlayMenuProps("1.2rem");
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
  fontSize: "0.95rem",
};

const FormularioCitaMedica = ({
  selectedDate = dayjs(), // dayjs
  onGuardar, // función que recibe los datos del formulario
  citasDelDia = [],
  isMobile = false,
}) => {
  const [openSelect, setOpenSelect] = useState(null);
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
      className={styles.FormularioCitaMedica}
      sx={{
        width: isMobile ? "95%" : "100%",
        maxWidth: isMobile ? "100%" : "27.31rem",
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        alignItems: "star",
        justifyContent: "center",
        gap: isMobile ? 0.8 : 1.1,
      }}
    >
      {/* Fecha arriba a la derecha */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography
            variant="body2"
            sx={{ color: "#64748B", mb: 0.15, fontSize: isMobile ? "0.95rem" : "1rem" }}
          >
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
        <FormControl
          fullWidth
          size="small"
          sx={{ position: "relative", zIndex: openSelect === "especialidad" ? 20 : 3 }}
        >
          <Select
            className={styles.menuSelect}
            name="especialidad"
            value={form.especialidad}
            onChange={handleChange}
            onOpen={() => setOpenSelect("especialidad")}
            onClose={() => setOpenSelect(null)}
            displayEmpty
            IconComponent={KeyboardArrowDownRoundedIcon}
            sx={{
              borderRadius: 999,
              background: "white",
              ...outlinedFieldSx,
              ...compactFieldSx,
              position: "relative",
              zIndex: 4,
              backgroundColor: "#fff",
              ...accordionSelectSx,
            }}
            MenuProps={isMobile ? mobileMenuProps : specialtyMenuProps}
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
              sx={{
                mr: 1,
                position: "relative",
                zIndex: openSelect === "horario" ? 20 : 3,
              }}
              className={styles.horario}
            >
              <Select
                className={styles.menuSelect}
                name="horario"
                value={form.horario}
                onChange={handleChange}
                onOpen={() => setOpenSelect("horario")}
                onClose={() => setOpenSelect(null)}
                displayEmpty
                IconComponent={KeyboardArrowDownRoundedIcon}
                sx={{
                  borderRadius: 999,
                  background: "white",
                  ...outlinedFieldSx,
                  ...compactFieldSx,
                  position: "relative",
                  zIndex: 4,
                  backgroundColor: "#fff",
                  ...accordionSelectSx,
                }}
                MenuProps={isMobile ? mobileMenuProps : scheduleMenuProps}
              >
                <MenuItem value="">
                  <p className={styles.uno}>Selecciona un horario</p>
                </MenuItem>
                {horarios.map((h) => {
                  const ocupado = horariosOcupados.has(h);
                  return (
                    <MenuItem key={h} value={h} disabled={ocupado}>
                      {ocupado ? (
                          <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 0.5 }}>
                          <Typography sx={{ fontSize: "inherit", color: "#9CA3AF", m:0, p:0, }}>
                            {h}
                          </Typography>
                          <Typography sx={{ fontSize: "0.82rem", color: "#9CA3AF", m:0, p:0,}}>
                            Ocupado
                          </Typography>
                        </Box>
                      ) : (
                        h
                      )}
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
            <FormControl
              fullWidth
              size="small"
              sx={{ position: "relative", zIndex: openSelect === "tipoCita" ? 20 : 3 }}
            >
              <Select
                className={styles.menuSelect}
                name="tipoCita"
                value={form.tipoCita}
                onChange={handleChange}
                onOpen={() => setOpenSelect("tipoCita")}
                onClose={() => setOpenSelect(null)}
                IconComponent={KeyboardArrowDownRoundedIcon}
                sx={{
                  borderRadius: 999,
                  background: "white",
                  ...outlinedFieldSx,
                  ...compactFieldSx,
                  position: "relative",
                  zIndex: 4,
                  backgroundColor: "#fff",
                  ...accordionSelectSx,
                }}
                MenuProps={isMobile ? mobileMenuProps : appointmentTypeMenuProps}
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
