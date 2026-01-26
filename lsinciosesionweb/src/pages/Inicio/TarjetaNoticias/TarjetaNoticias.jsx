import React, { useMemo, useState } from "react";
import styles from "./TarjetaNoticias.module.css";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { noticias as noticiasSeed } from "../TarjetaNoticia/noticiasData";

const TarjetaNoticias = ({ noticias = noticiasSeed }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [open, setOpen] = useState(false);
  const [nota, setNota] = useState(null);

  const lista = useMemo(() => noticias ?? [], [noticias]);

  const abrir = (n) => {
    setNota(n);
    setOpen(true);
  };

  const cerrar = () => {
    setOpen(false);
    setNota(null);
  };

  return (
    <>
      <div className={styles.TarjetaNoticias}>
        {/* Header del widget */}
        <div className={styles.header}>
          <div className={styles.titulo}>Noticias</div>
          <div className={styles.subtitulo}>Desliza para ver más</div>
        </div>

        {/* Carrusel */}
        <div className={`${styles.carrusel} scroll-container`}>
          {lista.map((n) => (
            <div key={n.id} className={styles.slide}>
              <div
                className={styles.cardNoticia}
                role="button"
                tabIndex={0}
                onClick={() => abrir(n)}
                onKeyDown={(e) => (e.key === "Enter" ? abrir(n) : null)}
              >
                <div className={styles.cntImg}>
                  <img src={n.imagen} alt={n.titulo} />
                </div>

                <div className={styles.cntInfo}>
                  <div className={styles.meta}>
                    <span className={styles.categoria}>{n.categoria}</span>
                    <span className={styles.fecha}>{formatearFecha(n.fecha)}</span>
                  </div>

                  <h3>{n.titulo}</h3>
                  <p>{n.resumenCorto}</p>

                  <div className={styles.fuente}>{n.fuente}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={cerrar}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth={!isMobile}
        PaperProps={{
          sx: {
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
            bgcolor: "rgba(248,250,252,0.92)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 1.5,
          }}
        >
          <Typography sx={{ fontWeight: 900 }}>Resumen</Typography>
          <IconButton
            onClick={cerrar}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2.25 }}>
          {nota && (
            <>
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid rgba(15,23,42,0.10)",
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    height: isMobile ? 180 : 220,
                    backgroundImage: `url(${nota.imagen})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </Box>

              <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", mb: 0.75 }}>
                {nota.titulo}
              </Typography>

              <Typography sx={{ color: "#0f172a", lineHeight: 1.5 }}>
                {nota.resumenLargo}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="contained"
                  endIcon={<OpenInNewIcon />}
                  onClick={() => window.open(nota.url, "_blank", "noopener,noreferrer")}
                  sx={{ borderRadius: 999, px: 4, textTransform: "none", fontWeight: 800 }}
                >
                  Ver noticia
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

function formatearFecha(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default TarjetaNoticias;
