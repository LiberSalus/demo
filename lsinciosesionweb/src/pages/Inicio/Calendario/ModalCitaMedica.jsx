// src\pages\Inicio\Calendario\ModalCitaMedica.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";

import PanelCalendarioCitas from "./PanelCalendarioCitas";
import FormularioCitaMedica from "./FormularioCitaMedica";
import Confirmacion from "./Confirmacion";

const CITAS_INICIALES = {
  "2025-11-19": [
    {
      id: 1,
      medico: "Dra. Regina Bustos Díaz",
      especialidad: "Cardiología",
      horario: "10:30 am - 11:00 am",
      tipo: "presencial",
      lugar: "Hospital San Ángel Inn, Torre Mitikah piso 17",
      notas: "Llevar resultados de laboratorio.",
    },
    {
      id: 2,
      medico: "Dra. Carolina Mora",
      especialidad: "Neurología",
      horario: "11:30 am - 12:00 pm",
      tipo: "en_linea",
      enlace: "https://liberzoom.libersalus.com/sala/neu-456",
      notas: "",
    },
  ],
};

const ModalCitaMedica = ({ open, onClose, selectedDate, onChangeDate }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const fecha = selectedDate || dayjs("2025-11-19");

  const [citasPorFecha, setCitasPorFecha] = useState(CITAS_INICIALES);

  const keyFechaActual = fecha.format("YYYY-MM-DD");
  const citasDelDia = citasPorFecha[keyFechaActual] || [];

  const [showConfirm, setShowConfirm] = useState(false);
  const [tipoConfirm, setTipoConfirm] = useState("cita");

  const manejarGuardar = (datosCita) => {
    const key = dayjs(datosCita.fecha).format("YYYY-MM-DD");

    setCitasPorFecha((prev) => {
      const anteriores = prev[key] || [];
      return {
        ...prev,
        [key]: [...anteriores, { ...datosCita, id: Date.now() }],
      };
    });

    setTipoConfirm("cita");
    setShowConfirm(true);
  };

  const handleChangeDate = (newDate) => {
    if (onChangeDate) onChangeDate(newDate);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="lg"
      fullWidth={!isMobile}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : "min(1100px, 96vw)",
          borderRadius: isMobile ? 0 : 3,
          overflow: "hidden",

          // 👇 fondo más “app”
          bgcolor: "#F8FAFC",
        },
      }}
    >
      {/* ✅ Header sticky */}
      <DialogTitle
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 1.5,
          bgcolor: "rgba(248,250,252,0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(15,23,42,0.08)",

          // ✅ safe area notch
          pt: isMobile ? "calc(env(safe-area-inset-top) + 12px)" : 1.5,
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: "1.15rem" }}>
          Cita médica
        </Typography>

        <IconButton
          onClick={onClose}
          edge="end"
          sx={{
            position: "absolute",
            right: 12,
            top: isMobile ? "calc(env(safe-area-inset-top) + 8px)" : 12,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers={false}
        sx={{
          position: "relative",

          // ✅ padding más limpio en móvil
          p: isMobile ? 2 : 3,

          // ✅ scroll seguro (teclado + viewport)
          overflowY: "auto",
          maxHeight: isMobile
            ? "calc(100dvh - (env(safe-area-inset-top) + 64px))"
            : "80dvh",

          // ✅ espacio para home indicator
          pb: isMobile ? "calc(env(safe-area-inset-bottom) + 16px)" : 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 2 : 3,
            alignItems: "stretch",
          }}
        >
          {/* ✅ Panel izquierdo compacto en móvil */}
          <Box
            sx={{
              flex: isMobile ? "0 0 auto" : "0 0 420px",
              borderRadius: 3,
              bgcolor: "white",
              boxShadow: "0 8px 30px rgba(15,23,42,0.08)",
              p: isMobile ? 1.5 : 2,
            }}
          >
            <PanelCalendarioCitas
              selectedDate={fecha}
              onChangeDate={handleChangeDate}
              citasPorFecha={citasPorFecha}
              isMobile={isMobile} // 👈 por si quieres compactarlo dentro
            />
          </Box>

          {/* ✅ Formulario con tarjeta */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              borderRadius: 3,
              bgcolor: "white",
              boxShadow: "0 8px 30px rgba(15,23,42,0.08)",
              p: isMobile ? 1.5 : 2,
            }}
          >
            <FormularioCitaMedica
              selectedDate={fecha}
              onGuardar={manejarGuardar}
              citasDelDia={citasDelDia}
              isMobile={isMobile}
            />
          </Box>
        </Box>

        {/* ✅ Overlay confirmación con safe area */}
        {showConfirm && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(15,23,42,0.35)",
              zIndex: 10,
              p: 2,
              pt: isMobile ? "calc(env(safe-area-inset-top) + 16px)" : 2,
              pb: isMobile ? "calc(env(safe-area-inset-bottom) + 16px)" : 2,
            }}
          >
            <Confirmacion
              tipo={tipoConfirm}
              onClose={() => setShowConfirm(false)}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalCitaMedica;
