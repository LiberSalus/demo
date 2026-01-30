// src/pages/Inicio/Calendario/ModalCitaMedica.jsx
import React, { useMemo, useState, useEffect } from "react";
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
import FormularioMedicamento from "./FormularioMedicamento";
import Confirmacion from "./Confirmacion";

const ModalCitaMedica = ({
  open,
  onClose,
  selectedDate,
  onChangeDate,

  citasPorFecha,
  setCitasPorFecha,

  focusSection = "citas",

  // ✅ vienen desde Inicio (estado central)
  medicamentos = [],
  setMedicamentos = () => {},

  selectedMedId = null,
  setSelectedMedId = () => {},
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const fecha = selectedDate || dayjs();

  const keyFechaActual = fecha.format("YYYY-MM-DD");
  const citasDelDia = citasPorFecha?.[keyFechaActual] || [];

  // ✅ tab dual: se inicializa desde focusSection
  const initialTab =
    focusSection === "medicamento" || focusSection === "medicamentos"
      ? "medicamento"
      : "cita";

  const [tab, setTab] = useState(initialTab);

  // ✅ si el modal se abre y viene focusSection distinto, ajustamos tab
  useEffect(() => {
    if (!open) return;
    setTab(initialTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, focusSection]);

  // confirmación
  const [showConfirm, setShowConfirm] = useState(false);
  const [tipoConfirm, setTipoConfirm] = useState("cita");

  const manejarGuardarCita = (datosCita) => {
    const key = dayjs(datosCita.fecha).format("YYYY-MM-DD");

    setCitasPorFecha?.((prev) => {
      const anteriores = prev[key] || [];
      return {
        ...prev,
        [key]: [...anteriores, { ...datosCita, id: Date.now() }],
      };
    });

    setTipoConfirm("cita");
    setShowConfirm(true);
  };

  const manejarGuardarMedicamento = (rule) => {
    setMedicamentos((prev) => [...prev, rule]);

    setSelectedMedId(rule.id);
    setTipoConfirm("medicamento");
    setShowConfirm(true);
  };

  const computedFocusSection = useMemo(() => {
    if (tab === "medicamento") return "medicamento";
    return "citas";
  }, [tab]);

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
          bgcolor: "#F8FAFC",
        },
      }}
    >
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
          pt: isMobile ? "calc(env(safe-area-inset-top) + 12px)" : 1.5,
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: "1.15rem" }}>
          {tab === "medicamento" ? "Medicamentos" : "Cita médica"}
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
          p: isMobile ? 2 : 3,
          overflowY: "auto",
          maxHeight: isMobile
            ? "calc(100dvh - (env(safe-area-inset-top) + 64px))"
            : "80dvh",
          pb: isMobile ? "calc(env(safe-area-inset-bottom) + 16px)" : 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 2 : 3,
            alignItems: "stretch",
            pointerEvents: showConfirm ? "none" : "auto",
          }}
        >
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
              onChangeDate={onChangeDate}
              citasPorFecha={citasPorFecha}
              isMobile={isMobile}
              tab={tab}
              onTabChange={setTab}
              focusSection={computedFocusSection}
              medicamentos={medicamentos}
              selectedMedId={selectedMedId}
              onSelectMedId={setSelectedMedId}
            />
          </Box>

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
            {tab === "medicamento" ? (
              <FormularioMedicamento
                selectedDate={fecha}
                onGuardar={manejarGuardarMedicamento}
                isMobile={isMobile}
              />
            ) : (
              <FormularioCitaMedica
                selectedDate={fecha}
                onGuardar={manejarGuardarCita}
                citasDelDia={citasDelDia}
                isMobile={isMobile}
              />
            )}
          </Box>
        </Box>

        {showConfirm && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(15,23,42,0.35)",
              backdropFilter: "blur(4px)",
              zIndex: 2000,
              p: 2,
              pt: "calc(env(safe-area-inset-top) + 16px)",
              pb: "calc(env(safe-area-inset-bottom) + 16px)",
              pointerEvents: "auto",
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
