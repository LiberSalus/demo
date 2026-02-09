import React, { useMemo } from "react";
import styles from "./ComparacionSemanal.module.css";

import arriba from "./icoFlechaRojaArr.svg";
import abajo from "./icoFlechaRojaAba.svg";
import paloma from "./icoPaloma.svg";

const ComparacionSemanal = ({ readings = [], today = new Date() }) => {
  const {
    promActual,
    promAnterior,
    delta,
    estado,
    mensajeEstado,
  } = useMemo(() => {
    const inicioSemanaActual = inicioDeSemana(today);
    const finSemanaActual = addDays(inicioSemanaActual, 7);

    const inicioSemanaAnterior = addDays(inicioSemanaActual, -7);
    const finSemanaAnterior = inicioSemanaActual;

    const promedioSemana = (inicio, fin) => {
      const ini = inicio.getTime();
      const fi = fin.getTime();

      const valores = readings
        .map((r) => ({
          ts: new Date(r.ts).getTime(),
          bpm: r.bpm,
        }))
        .filter((r) => r.ts >= ini && r.ts < fi)
        .map((r) => r.bpm)
        .filter((v) => typeof v === "number" && Number.isFinite(v));

      if (!valores.length) return null;

      const sum = valores.reduce((acc, v) => acc + v, 0);
      return sum / valores.length;
    };

    const promAct = promedioSemana(inicioSemanaActual, finSemanaActual);
    const promAnt = promedioSemana(
      inicioSemanaAnterior,
      finSemanaAnterior
    );

    const delta =
      promAct != null && promAnt != null ? promAct - promAnt : null;

    // Estado según rango 60–100
    let estado = "sinDatos";
    let mensaje = "Aún no hay suficientes registros para comparar semanas.";

    if (promAct != null) {
      if (promAct < 60) {
        estado = "baja";
        mensaje =
          "Tu frecuencia cardiaca semanal está por debajo del rango recomendado.";
      } else if (promAct > 100) {
        estado = "alta";
        mensaje =
          "Tu frecuencia cardiaca semanal está por encima del rango recomendado.";
      } else {
        estado = "ok";
        mensaje =
          "Tu frecuencia cardiaca semanal se encuentra dentro del rango recomendado.";
      }
    }

    return {
      promActual: promAct,
      promAnterior: promAnt,
      delta,
      estado,
      mensajeEstado: mensaje,
    };
  }, [readings, today]);

  // Elegimos icono según estado
  let iconSrc = null;
  if (estado === "alta") iconSrc = arriba;
  else if (estado === "baja") iconSrc = abajo;
  else if (estado === "ok") iconSrc = paloma;

  return (
    <div className={styles.ComparacionSemanal}>
      <p>Comparación semanal</p>

      <div className={styles.info}>
        {/* Col 1: etiqueta */}
        <p>PPM media</p>

        {/* Col 2: semana actual */}
        <div>
          <p>Actual</p>
          <p className={styles.valor}>{formatPPM(promActual)}</p>
        </div>

        {/* Col 3: semana anterior */}
        <div className={styles.semana}>
          <p>Semana <br/> anterior</p>
          <p className={styles.valor}>{formatPPM(promAnterior)}</p>
        </div>

        {/* Col 4: estado (icono + delta) */}
        <div className={styles.estado}>
          {iconSrc && (
            <img
              src={iconSrc}
              alt="Estado semanal"
              className={`${styles.icono} ${
                estado === "alta"
                  ? styles.alta
                  : estado === "baja"
                  ? styles.baja
                  : estado === "ok"
                  ? styles.ok
                  : ""
              }`}
            />
          )}
          {<p className={styles.delta}>{formatDelta(delta)}</p>}
        </div>
      </div>

      {/* Mensaje debajo (opcional, ya tienes clase .mensaje en CSS) */}
      {/* <p className={styles.mensaje}>{mensajeEstado}</p> */}
    </div>
  );
};

export default ComparacionSemanal;

/* ================== HELPERS ================== */

// Lunes como inicio de semana
function inicioDeSemana(fecha) {
  const d = new Date(fecha);
  const day = (d.getDay() + 6) % 7; // normaliza para que lunes sea 0
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatPPM(valor) {
  if (typeof valor !== "number" || !Number.isFinite(valor)) return "—";
  return `${Math.round(valor)} ppm`;
}

function formatDelta(delta) {
  if (delta == null || !Number.isFinite(delta)) return "—";
  const v = Math.round(Math.abs(delta));
  if (v === 0) return "igual";
  return `${delta > 0 ? "+" : "-"}${v}`;
}
