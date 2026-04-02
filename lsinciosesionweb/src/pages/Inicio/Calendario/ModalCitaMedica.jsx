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
import styles from "./ModalCitaMedica.module.css";
import PanelCalendarioCitas from "./PanelCalendarioCitas";
import FormularioCitaMedica from "./FormularioCitaMedica";
import FormularioMedicamento from "./FormularioMedicamento";
import Confirmacion from "./Confirmacion";

import { ensureId } from "@/utils/ensureId";

const ModalCitaMedica = ({
  open,
  onClose,
  selectedDate,
  onChangeDate,
  citasPorFecha,
  setCitasPorFecha,
  focusSection = "citas",
  medicamentos = [],
  setMedicamentos = () => {},
  selectedMedId = null,
  setSelectedMedId = () => {},
}) => {
  const esMovil = useMediaQuery("(max-width:600px)");
  const esApilado = useMediaQuery("(max-width:900px)");

  const fecha = selectedDate || dayjs();
  const claveFechaActual = fecha.format("YYYY-MM-DD");
  const citasDelDia = citasPorFecha?.[claveFechaActual] || [];

  const pestanaInicial =
    focusSection === "medicamento" || focusSection === "medicamentos"
      ? "medicamento"
      : "cita";

  const [pestanaActiva, setPestanaActiva] = useState(pestanaInicial);

  // Sincroniza la pestaña cuando el modal se abre desde una tarjeta externa.
  useEffect(() => {
    setPestanaActiva(
      focusSection === "medicamento" || focusSection === "medicamentos"
        ? "medicamento"
        : "cita"
    );
  }, [focusSection, open]);

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [tipoConfirmacion, setTipoConfirmacion] = useState("cita");

  const manejarGuardarCita = (datosCita) => {
    const claveFecha = dayjs(datosCita.fecha).format("YYYY-MM-DD");

    const citaAGuardar = ensureId({
      ...datosCita,
      tipo: datosCita.tipo ?? datosCita.tipoCita,
      lugar: datosCita.lugar ?? datosCita.ubicacion,
      _ts: datosCita?._ts ?? Date.now(),
    });

    setCitasPorFecha?.((citasPrevias) => {
      const citasAnteriores = citasPrevias?.[claveFecha] || [];
      const citasSiguientes = [...citasAnteriores, citaAGuardar];

      const citasUnicas = Array.from(
        new Map(citasSiguientes.map((cita) => [cita.id, cita])).values()
      );

      return {
        ...citasPrevias,
        [claveFecha]: citasUnicas,
      };
    });

    setTipoConfirmacion("cita");
    setMostrarConfirmacion(true);
  };

  const manejarGuardarMedicamento = (regla) => {
    const reglaAGuardar = ensureId(regla);

    setMedicamentos?.((medicamentosPrevios) => [
      ...(medicamentosPrevios || []),
      reglaAGuardar,
    ]);
    setSelectedMedId?.(reglaAGuardar.id);

    setTipoConfirmacion("medicamento");
    setMostrarConfirmacion(true);
  };

  const manejarCambioFecha = (nuevaFecha) => onChangeDate?.(nuevaFecha);

  const seccionEnfocada = useMemo(() => {
    if (pestanaActiva === "medicamento") return "medicamento";
    return "citas";
  }, [pestanaActiva]);

  const anchoDialogo = esMovil
    ? "100%"
    : esApilado
    ? "min(760px, 96vw)"
    : "min(1100px, 96vw)";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={esMovil}
      maxWidth={false}
      sx={{
        minWidth: 0,
        "& .MuiTextField-root, & .MuiFormControl-root": { minWidth: 0 },
      }}
      fullWidth
      PaperProps={{
        sx: {
          width: anchoDialogo,
          borderRadius: esMovil ? 0 : 3,
          overflow: "hidden",
          bgcolor: "#F7F7FF",
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
          /* bgcolor: "#F7F7FF", */
          backdropFilter: "blur(10px)",

          pt: esMovil ? "calc(env(safe-area-inset-top) + 12px)" : 1.5,
        }}
      >
        <Typography
          className={styles.tit}
          sx={{
            fontFamily: "var(--font-inter)",
            fontWeight: "var(--peso700)",
            fontSize: esMovil ? "1.15rem" : "1.5rem",
          }}
        >
          {pestanaActiva === "medicamento" ? "Medicamentos" : "Cita médica"}
        </Typography>

        <IconButton
          onClick={onClose}
          edge="end"
          sx={{
            transform: "translate(-5px, -5px)",
            position: "absolute",
            right: 12,
            top: esMovil ? "calc(env(safe-area-inset-top) + 8px)" : 12,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers={false}
        sx={{
          position: "relative",
          p: esMovil ? 1 : 2.25,
          overflowY: "auto",
          maxHeight: esMovil
            ? "calc(100dvh - (env(safe-area-inset-top) + 64px))"
            : "90dvh",
          pb: esMovil ? "calc(env(safe-area-inset-bottom) + 16px)" : 3,
          background: "#F7F7FF",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: esApilado ? "column" : "row",
            gap: esMovil ? 2 : 3,
            alignItems: "stretch",
            pointerEvents: mostrarConfirmacion ? "none" : "auto",
          }}
        >
          <Box
            sx={{
              flex: esApilado ? "0 0 auto" : "0 0 35.18rem",
              margin: esApilado ? "0" : "0.5rem 0 auto 1rem",
              width: "100%",
              maxWidth: "37.18rem",
              borderRadius: 4,
              bgcolor: "white",
              p: esMovil ? 0.9 : 2,
              border: "1px solid #ACCCEB",
            }}
          >
            <PanelCalendarioCitas
              selectedDate={fecha}
              onChangeDate={manejarCambioFecha}
              citasPorFecha={citasPorFecha}
              isMobile={esMovil}
              tab={pestanaActiva}
              onTabChange={setPestanaActiva}
              focusSection={seccionEnfocada}
              medicamentos={medicamentos}
              selectedMedId={selectedMedId}
              onSelectMedId={setSelectedMedId}
            />
          </Box>

          <Box
            className={styles.cntFormulario}
            sx={{
              flex: 1,
              minWidth: 0,
              width: esMovil ? "100%" : "27.31rem",
              maxWidth: esMovil ? "100%" : "27.31rem",
              minHeight: esMovil ? "auto" : "42.375rem",
              borderRadius: 3,
              bgcolor: "white",
              p: esMovil ? 0.9 : 2,
              background: "transparent",
              margin: "0 auto",
            }}
          >
            {pestanaActiva === "medicamento" ? (
              <FormularioMedicamento
                className={styles.cntFormulario}
                selectedDate={fecha}
                onGuardar={manejarGuardarMedicamento}
                isMobile={esMovil}
              />
            ) : (
              <FormularioCitaMedica
                className={styles.cntFormulario}
                selectedDate={fecha}
                onGuardar={manejarGuardarCita}
                citasDelDia={citasDelDia}
                isMobile={esMovil}
              />
            )}
          </Box>
        </Box>

        {mostrarConfirmacion && (
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
              tipo={tipoConfirmacion}
              onClose={() => setMostrarConfirmacion(false)}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalCitaMedica;
