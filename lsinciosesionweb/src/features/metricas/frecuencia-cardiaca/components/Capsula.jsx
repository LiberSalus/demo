import React from "react";
import styles from "./Capsula.module.css";

const MAX_PPM_CAPSULA = 220;
const ALTO_CAPSULA_PX = 304;
const PIXELES_POR_PPM = ALTO_CAPSULA_PX / MAX_PPM_CAPSULA;
const FACTOR_AMPLIFICACION_VISUAL = 2;
const ALTURA_MINIMA_VISUAL_PX = 24;

const obtenerColorRango = (min, max) => {
  if (min < 60 || max > 120) return "#FF415A";
  if (max >= 101) return "#F8A737";
  return "#3FAD58";
};

const frase = (max) => {
  if (max < 60) return "Bradicardia";
  if (max >= 61 && max <= 100) return "Frecuencia normal";
  if (max > 101 && max <= 120) return "Taquicardia (leve)";
  if (max >= 121 ) return "Taquicardia"
} 

const Capsula = ({ max, min }) => {
  const hayRangoValido =
    Number.isFinite(min) && Number.isFinite(max) && min <= max;

  const minSeguro = hayRangoValido
    ? Math.max(0, Math.min(min, MAX_PPM_CAPSULA))
    : 0;
  const maxSeguro = hayRangoValido
    ? Math.max(0, Math.min(max, MAX_PPM_CAPSULA))
    : 0;
  const alturaRangoReal = hayRangoValido
    ? Math.max((maxSeguro - minSeguro) * PIXELES_POR_PPM, 1)
    : 0;
  const puntoMedioRango = ((minSeguro + maxSeguro) / 2) * PIXELES_POR_PPM;
  const alturaRangoVisual = hayRangoValido
    ? Math.min(
        Math.max(
          alturaRangoReal * FACTOR_AMPLIFICACION_VISUAL,
          ALTURA_MINIMA_VISUAL_PX,
        ),
        ALTO_CAPSULA_PX,
      )
    : 0;
  const offsetInferior = hayRangoValido
    ? Math.max(
        0,
        Math.min(
          puntoMedioRango - alturaRangoVisual / 2,
          ALTO_CAPSULA_PX - alturaRangoVisual,
        ),
      )
    : 0;
  const colorRango = hayRangoValido
    ? obtenerColorRango(minSeguro, maxSeguro)
    : "#D9DEE8";
  const esRangoCompacto = alturaRangoVisual <= 32;

  return (
    <div className={styles.cntCapsula}>
      <p>
        {hayRangoValido ? `${minSeguro} ppm - ${maxSeguro} ppm` : "-- ppm - -- ppm"}
      </p>

      <div className={styles.capsula}>
        {hayRangoValido ? (
          <div
            className={`${styles.valor} ${
              esRangoCompacto ? styles.valorCompacto : ""
            }`}
            style={{
              height: `${alturaRangoVisual}px`,
              bottom: `${offsetInferior}px`,
              backgroundColor: colorRango,
            }}
          >
            <p className={styles.max}>{maxSeguro}</p>
            <p className={styles.ppm}>ppm</p>
            <p className={styles.min}>{minSeguro}</p>
          </div>
        ) : (
          <div className={styles.sinDatos}>Sin datos</div>
        )}
      </div>

      <p>
        <span
          className={styles.cuadrito}
          style={{ background: colorRango }}
          ></span>
          {frase(max)}
      </p>
    </div>
  );
};

export default Capsula;
