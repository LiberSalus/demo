import React from "react";
import styles from "../inicio.module.css";

export default function AgendaCarrusel({
  titulo,
  claveScroll,
  claseViewport,
  refScroll,
  estadoScroll,
  alDesplazar,
  children,
}) {
  const claseContenedor =
    claveScroll === "citas" ? styles.cntCitas : styles.cntMedicamentos;

  return (
    <div className={styles.carruselBloque}>
      <p className={styles.carruselTitulo}>{titulo}</p>

      <div className={`${styles.carruselViewport} ${claseViewport}`}>
        <button
          type="button"
          className={`${styles.btnCarrusel} ${styles.btnCarruselIzq}`}
          onClick={() => alDesplazar(-1, claveScroll)}
          disabled={!estadoScroll[claveScroll].canLeft}
          aria-label={`Desplazar ${titulo.toLowerCase()} a la izquierda`}
        >
          &#8249;
        </button>

        <div ref={refScroll} className={`${claseContenedor} scroll-container`}>
          {children}
        </div>

        <button
          type="button"
          className={`${styles.btnCarrusel} ${styles.btnCarruselDer}`}
          onClick={() => alDesplazar(1, claveScroll)}
          disabled={!estadoScroll[claveScroll].canRight}
          aria-label={`Desplazar ${titulo.toLowerCase()} a la derecha`}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}
