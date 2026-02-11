// ModalCitaMedica.jsx
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

// ✅ NUEVO: asegurar ids únicos con UUID
import { ensureId } from "@/utils/ensureId";

const ModalCitaMedica = ({
  open,
  onClose,
  selectedDate,
  onChangeDate,
  citasPorFecha,
  setCitasPorFecha,
  focusSection = "citas",

  // ✅ estado CENTRAL (viene de Inicio)
  medicamentos = [],
  setMedicamentos = () => {},
  selectedMedId = null,
  setSelectedMedId = () => {},
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const isStacked = useMediaQuery("(max-width:900px)");

  const fecha = selectedDate || dayjs();
  const keyFechaActual = fecha.format("YYYY-MM-DD");
  const citasDelDia = citasPorFecha?.[keyFechaActual] || [];

  const initialTab =
    focusSection === "medicamento" || focusSection === "medicamentos"
      ? "medicamento"
      : "cita";

  const [tab, setTab] = useState(initialTab);

  // ✅ si abres desde tarjeta (focusSection cambia), sincroniza tab
  useEffect(() => {
    setTab(
      focusSection === "medicamento" || focusSection === "medicamentos"
        ? "medicamento"
        : "cita"
    );
  }, [focusSection, open]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [tipoConfirm, setTipoConfirm] = useState("cita");

  const manejarGuardarCita = (datosCita) => {
    const key = dayjs(datosCita.fecha).format("YYYY-MM-DD");

    // ✅ compat + ts + UUID
    const citaToSave = ensureId({
      ...datosCita,
      tipo: datosCita.tipo ?? datosCita.tipoCita,
      lugar: datosCita.lugar ?? datosCita.ubicacion,
      _ts: datosCita?._ts ?? Date.now(),
    });

    setCitasPorFecha?.((prev) => {
      const anteriores = prev?.[key] || [];
      const next = [...anteriores, citaToSave];

      // ✅ evitar duplicados por id
      const unique = Array.from(new Map(next.map((c) => [c.id, c])).values());

      return {
        ...prev,
        [key]: unique,
      };
    });

    setTipoConfirm("cita");
    setShowConfirm(true);
  };

  const manejarGuardarMedicamento = (rule) => {
    // ✅ asegura UUID (por si el form no lo trae)
    const ruleToSave = ensureId(rule);

    setMedicamentos?.((prev) => [...(prev || []), ruleToSave]);
    setSelectedMedId?.(ruleToSave.id);

    setTipoConfirm("medicamento");
    setShowConfirm(true);
  };

  const handleChangeDate = (newDate) => onChangeDate?.(newDate);

  const computedFocusSection = useMemo(() => {
    if (tab === "medicamento") return "medicamento";
    return "citas";
  }, [tab]);

  const paperWidth = isMobile
    ? "100%"
    : isStacked
    ? "min(760px, 96vw)"
    : "min(1100px, 96vw)";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth={false}
      sx={{
        minWidth: 0,
        "& .MuiTextField-root, & .MuiFormControl-root": { minWidth: 0 },
      }}
      fullWidth
      PaperProps={{
        sx: {
          width: paperWidth,
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
            transform: "translate(-5px, -5px)",
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
            flexDirection: isStacked ? "column" : "row",
            gap: isMobile ? 2 : 3,
            alignItems: "stretch",
            pointerEvents: showConfirm ? "none" : "auto",
          }}
        >
          {/* Panel */}
          <Box
            sx={{
              flex: isStacked ? "0 0 auto" : "0 0 420px",
              width: "100%",
              maxWidth: "100%",
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
              isMobile={isMobile}
              tab={tab}
              onTabChange={setTab}
              focusSection={computedFocusSection}
              // ✅ viene de Inicio
              medicamentos={medicamentos}
              selectedMedId={selectedMedId}
              onSelectMedId={setSelectedMedId}
            />
          </Box>

          {/* Formulario */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              width: "100%",
              maxWidth: "100%",
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

        {/* Confirm */}
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
