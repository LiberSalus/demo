// src/pages/Inicio/TarjetaNoticias/TarjetaNoticias.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
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

import newsFallback from "@/assets/newsFallback.jpg";
import { noticiasData } from "./noticiasData";
import { useNewsCarousel } from "./useNewsCarousel";

// Ajustes autoplay
const DURACION_MS = 4500;
const TICK_MS = 80;

function safeImg(url) {
  return url || newsFallback;
}

function formatFecha(fechaStr) {
  // deja tal cual o ponle tu formato (dayjs si quieres)
  return fechaStr || "";
}

export default function TarjetaNoticias() {
  const autoScrollingRef = useRef(false);

  const isMobile = useMediaQuery("(max-width:600px)");

  const lista = useMemo(() => noticiasData ?? [], []);
  const length = lista.length;

  const {
    index,
    progress,
    goTo,
    pause,
    resume,
    pauseFor,
    setIndex,
    setProgress,
  } = useNewsCarousel({ length: lista.length, durationMs: 4500, tickMs: 80 });

  // modal
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // carrusel ref
  const carruselRef = useRef(null);

  const openModal = (n) => {
    setSelected(n);
    setOpen(true);
    pause();
  };

  const closeModal = () => {
    setOpen(false);
    setSelected(null);
    resume();
  };

  // ✅ SCROLL SOLO HORIZONTAL (evita que la página se brinque)
  useEffect(() => {
    const el = carruselRef.current;
    if (!el) return;

    const slide = el.querySelector(`[data-slide="${index}"]`);
    if (!slide) return;

    const paddingLeft = 8;
    const targetLeft = Math.max(0, slide.offsetLeft - paddingLeft);

    autoScrollingRef.current = true;
    el.scrollTo({ left: targetLeft, behavior: "smooth" });

    const t = setTimeout(() => {
      autoScrollingRef.current = false;
    }, 350);

    return () => clearTimeout(t);
  }, [index]);

  // sincronizar index si usuario scrollea manual
  const handleScroll = () => {
    if (autoScrollingRef.current) return;

    const el = carruselRef.current;
    if (!el) return;

    // throttle con RAF
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const slides = Array.from(el.querySelectorAll("[data-slide]"));
      if (!slides.length) return;

      const left = el.scrollLeft;
      let closest = 0;
      let minDist = Infinity;

      slides.forEach((s) => {
        const dist = Math.abs(s.offsetLeft - left);
        if (dist < minDist) {
          minDist = dist;
          closest = Number(s.dataset.slide);
        }
      });

      setIndex((prev) => (prev === closest ? prev : closest));
      setProgress(0);

      // ✅ el usuario interactuó: pausa y reanuda después
      pauseFor(2200);
    });
  };

  if (!length) {
    return (
      <div className={styles.TarjetaNoticias}>
        <div className={styles.header}>
          <h3 className={styles.titulo}>Noticias</h3>
          <p className={styles.tip}>No hay noticias disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.TarjetaNoticias}>
      <div className={styles.header}>
        <h3 className={styles.titulo}>Noticias</h3>
        <p className={styles.tip}>Manten el mouse en noticia para pausar</p>
      </div>

      <div
        ref={carruselRef}
        className={styles.carrusel}
        onScroll={handleScroll}
        onMouseEnter={!isMobile ? pause : undefined}
        onMouseLeave={!isMobile ? resume : undefined}
        onTouchStart={isMobile ? () => pauseFor(2500) : undefined}
        onTouchEnd={isMobile ? () => pauseFor(2500) : undefined}
        onPointerDown={!isMobile ? () => pauseFor(2500) : undefined}
        onPointerUp={!isMobile ? () => pauseFor(2500) : undefined}
      >
        {lista.map((n, i) => (
          <button
            key={n.id}
            type="button"
            className={styles.card}
            data-slide={i}
            onMouseDown={(e) => e.preventDefault()} // ✅ evita focus jump raro
            onClick={() => openModal(n)}
          >
            <div className={styles.cntImg}>
              <img
                src={safeImg(n.imagen)}
                alt={n.titulo}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = newsFallback;
                }}
              />
            </div>

            <div className={styles.cntInfo}>
              <div className={styles.metaRow}>
                <span className={styles.chip}>{n.categoria || "Salud"}</span>
                <span className={styles.fecha}>{formatFecha(n.fecha)}</span>
              </div>

              <h4 className={styles.titCard}>{n.titulo}</h4>
              <p className={styles.resumen}>{n.resumenCorto}</p>

              <p className={styles.fuente}>{n.fuente}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Barras */}
      <div className={styles.barras}>
        {lista.map((_, i) => {
          const fill = i < index ? 1 : i > index ? 0 : progress;
          return (
            <button
              key={i}
              type="button"
              className={styles.barraBtn}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => goTo(i)}
              aria-label={`Ir a noticia ${i + 1}`}
            >
              <div className={styles.barraBase}>
                <div
                  className={styles.barraFill}
                  style={{ width: `${Math.round(fill * 100)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={closeModal}
        fullScreen={isMobile}
        maxWidth="md"
        fullWidth
        disableRestoreFocus // ✅ evita scroll/focus al cerrar
        PaperProps={{
          sx: { borderRadius: isMobile ? 0 : 3, overflow: "hidden" },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography sx={{ fontWeight: 800 }}>
            {selected?.titulo || "Noticia"}
          </Typography>

          <IconButton onClick={closeModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          <Box
            sx={{
              height: isMobile ? 200 : 260,
              backgroundImage: `url(${safeImg(selected?.imagen)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#E2E8F0",
            }}
          />

          <Box sx={{ p: isMobile ? 2 : 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
                mb: 1,
              }}
            >
              <Typography sx={{ fontWeight: 800, color: "#0EA5E9" }}>
                {selected?.categoria || "Salud"}
              </Typography>
              <Typography sx={{ color: "#64748B" }}>
                {formatFecha(selected?.fecha)}
              </Typography>
            </Box>

            <Typography sx={{ color: "#334155", mb: 1 }}>
              {selected?.resumenLargo || selected?.resumenCorto}
            </Typography>

            {!!selected?.fuente && (
              <Typography sx={{ color: "#64748B", fontSize: "0.85rem" }}>
                Fuente: {selected.fuente}
              </Typography>
            )}

            <Box
              sx={{
                mt: 2,
                display: "flex",
                gap: 1,
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <Button onClick={closeModal} variant="outlined">
                Cerrar
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  if (selected?.url)
                    window.open(selected.url, "_blank", "noopener,noreferrer");
                }}
                disabled={!selected?.url}
              >
                Ver noticia
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
