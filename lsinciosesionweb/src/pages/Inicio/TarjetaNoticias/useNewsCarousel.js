// src/pages/Inicio/TarjetaNoticias/useNewsCarousel.js
import { useEffect, useMemo, useRef, useState } from "react";

export function useNewsCarousel({ length, durationMs = 4500, tickMs = 80 }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const pausedRef = useRef(false);
  const timerRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  const clampIndex = (i) => {
    if (!length) return 0;
    if (i < 0) return length - 1;
    if (i >= length) return 0;
    return i;
  };

  const goTo = (i) => {
    setIndex(clampIndex(i));
    setProgress(0);
  };

  const next = () => {
    setIndex((prev) => (prev + 1 >= length ? 0 : prev + 1));
    setProgress(0);
  };

  const pause = () => (pausedRef.current = true);
  const resume = () => (pausedRef.current = false);

  // ✅ pausa temporal (para swipe/manual)
  const pauseFor = (ms = 2000) => {
    pause();
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      resume();
    }, ms);
  };

  useEffect(() => {
    if (!length) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;

      setProgress((p) => {
        const np = p + tickMs / durationMs;
        if (np >= 1) {
          setIndex((prev) => (prev + 1 >= length ? 0 : prev + 1));
          return 0;
        }
        return np;
      });
    }, tickMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [length, durationMs, tickMs]);

  useEffect(() => {
    if (!length) return;
    setIndex((prev) => clampIndex(prev));
  }, [length]);

  return useMemo(
    () => ({
      index,
      progress,
      goTo,
      next,
      pause,
      resume,
      pauseFor,
      setIndex,
      setProgress,
    }),
    [index, progress, length]
  );
}
