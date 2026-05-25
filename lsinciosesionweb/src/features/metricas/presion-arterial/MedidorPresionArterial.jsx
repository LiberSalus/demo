// mesat\src\components\PresionArterial\MedidorPresionArterial.jsx
import { useState, useEffect } from "react";
import styles from "./MedidorPresionArterial.module.css";
import mas from "./icoMas.svg";

const MedidorPresionArterial = ({
  sistolica = null,
  diastolica = null,
  frecuencia = null,
  horaTexto = "—",
  fechaTexto = "—",
  onAdd,
  beatId = 0, // viene del contenedor para disparar el latido
}) => {
  // ---- LATIDO DEL CORAZÓN ----
  const [latir, setLatir] = useState(false);

  useEffect(() => {
    if (!beatId) return; // la primera vez puede ser 0
    setLatir(true);
    const t = setTimeout(() => setLatir(false), 1100);
    return () => clearTimeout(t);
  }, [beatId]);

  // ---- CONFIG DEL ARCO Y ESCALA ----
  const MIN_P = 0;
  const MAX_P = 240;
  const ARC_CENTER_X = 220;
  const ARC_CENTER_Y = 203.5;
  const ARC_RADIUS = 144;
  const tieneLecturaValida =
    Number.isFinite(sistolica) &&
    Number.isFinite(diastolica) &&
    sistolica > 0 &&
    diastolica > 0 &&
    sistolica > diastolica;

  const clampValor = (valor) => Math.min(Math.max(valor, MIN_P), MAX_P);

  // valor → punto (x,y) para las bolitas verdes
  const mapValueToPoint = (valor) => {
    const clamped = clampValor(valor);
    const t = (clamped - MIN_P) / (MAX_P - MIN_P); // 0 a 1
    const angle = t * Math.PI; // 0 = derecha, 240 = izquierda

    const x = ARC_CENTER_X + ARC_RADIUS * Math.cos(angle);
    const y = ARC_CENTER_Y - ARC_RADIUS * Math.sin(angle);

    return { x, y };
  };

  const construirTrayectoriaArco = (valorInicio, valorFin) => {
    const inicio = clampValor(Math.min(valorInicio, valorFin));
    const fin = clampValor(Math.max(valorInicio, valorFin));
    const pasos = Math.max(2, Math.ceil((fin - inicio) / 4));
    const puntos = [];

    for (let paso = 0; paso <= pasos; paso += 1) {
      const progreso = paso / pasos;
      const valor = inicio + (fin - inicio) * progreso;
      puntos.push(mapValueToPoint(valor));
    }

    return puntos
      .map((punto, indice) =>
        `${indice === 0 ? "M" : "L"} ${punto.x.toFixed(2)} ${punto.y.toFixed(2)}`
      )
      .join(" ");
  };

  const puntoSis = tieneLecturaValida ? mapValueToPoint(sistolica) : null;
  const puntoDia = tieneLecturaValida ? mapValueToPoint(diastolica) : null;
  const arcoLecturaPath = tieneLecturaValida
    ? construirTrayectoriaArco(diastolica, sistolica)
    : "";
  const lecturaEsNormal =
    tieneLecturaValida &&
    sistolica >= 90 &&
    sistolica <= 119 &&
    diastolica >= 60 &&
    diastolica <= 79;
  const colorMarcador = lecturaEsNormal ? "#62D247" : "#F28B8B";
  const frecuenciaTexto =
    typeof frecuencia === "number" ? `${frecuencia} ppm` : "-- ppm";
  const presionTexto = tieneLecturaValida
    ? `${sistolica} - ${diastolica} mmHg`
    : "-- / -- mmHg";

  return (
    <div className={styles.MedidorPresionArterial}>
      <p className={styles.tit}>Presión arterial</p>

      <svg
        viewBox="0 0 440 300"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%" }}
        className={styles.progreso}
      >
        <defs>
          {/* IMPORTANTE: para que el rect use el mismo sistema del viewBox */}
          <clipPath id="clipMedio" clipPathUnits="userSpaceOnUse">
            {/* Corta “abajo” del medidor: ajusta el height */}
            <rect x="0" y="0" width="440" height="215" />
          </clipPath>
        </defs>

        {/* fondo azul base */}
        <circle
          cx="220"
          cy="100"
          r="150"
          fill="none"
          stroke="#007CBA"
          strokeWidth="1.5rem"
          strokeDasharray="50 50"
          pathLength="100"
          transform="rotate(180) translate(-440 -310)"
          styles={{ transformOrigin: "" }}
          strokeLinecap="round"
        />

        <g clipPath="url(#clipMedio)">
          {/* graduación corta */}
          <circle
            cx="220"
            cy="100"
            r="134"
            fill="none"
            stroke="#ccc"
            strokeWidth="0.5rem"
            strokeDasharray="0.5 0.5"
            pathLength="240"
            transform="rotate(180) translate(-440 -310)"
            styles={{ transformOrigin: "50%" }}
            className={styles.gradCorta}
          />

          {/* graduación larga */}
          <circle
            cx="220"
            cy="100"
            r="132"
            fill="none"
            stroke="#bbb"
            strokeWidth="0.75rem"
            strokeDasharray="0.5 9.5"
            pathLength="240"
            transform="rotate(180) translate(-440 -310)"
            styles={{ transformOrigin: "50%" }}
            className={styles.gradLarga}
          />

          {/* arco dinámico de rango sistólica–diastólica */}
          {tieneLecturaValida && (
            <g className={`${styles.lecturaActiva} ${latir ? styles.lecturaLatido : ""}`}>
              <path
                d={arcoLecturaPath}
                className={styles.arcoDinamico}
                fill="none"
                stroke="#82D5FF"
                strokeWidth={12}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {puntoSis && (
                <circle
                  cx={puntoSis.x}
                  cy={puntoSis.y}
                  r={8}
                  className={styles.marcadorLectura}
                  fill={colorMarcador}
                  stroke="#fff"
                  strokeWidth={2}
                />
              )}

              {puntoDia && (
                <circle
                  cx={puntoDia.x}
                  cy={puntoDia.y}
                  r={8}
                  className={styles.marcadorLectura}
                  fill={colorMarcador}
                  stroke="#fff"
                  strokeWidth={2}
                />
              )}
            </g>
          )}
        </g>

        {/* valores graduación */}
        <g>
          <text className={styles.txtGrd} x="337" y="210" fontFamily="Arial">
            0
          </text>

          <text className={styles.txtGrd} x="318" y="153" fontFamily="Arial">
            40
          </text>

          <text
            className={styles.txtGrd}
            x="277"
            y="110"
            fontFamily="Arial"
            /* transform="rotate(34)" */
            /* transformOrigin="275 100" */
          >
            80
          </text>

          <text className={styles.txtGrd} x="213" y="95" fontFamily="Arial">
            120
          </text>

          <text
            className={styles.txtGrd}
            x="152"
            y="110"
            fontFamily="Arial"
            /* transform="rotate(-33.5)" */
            /* transformOrigin="151 100" */
          >
            160
          </text>

          <text
            className={styles.txtGrd}
            x="112.5"
            y="153"
            fontFamily="Arial"
            /* transform="rotate(-60)" */
            /* transformOrigin="112.5 145" */
          >
            200
          </text>

          <text
            className={styles.txtGrd}
            x="95.5"
            y="210"
            fontFamily="Arial"
            fill="#aaa"
            /* transform="rotate(-90)" */
            /* transformOrigin="95 202" */
          >
            240
          </text>
        </g>

        {/* corazón con latido */}
        <g
          className={`${styles.corazon} ${latir ? styles.corazonLatido : ""}`}
          transform="translate(197.5 110)"
        >
          <svg
            width="46"
            height="41"
            /* viewBox="0 0 46 41" */
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.7109 0.5C11.1099 0.500066 9.52363 0.851032 8.04492 1.5332C6.56597 2.21551 5.22321 3.21634 4.09668 4.47949C-0.698223 9.85368 -0.698763 18.4624 4.0957 23.8369L16.2568 37.3828L16.2578 37.3848C17.1404 38.3744 18.1923 39.1574 19.3496 39.6914C20.5068 40.2253 21.7478 40.4999 23 40.5C24.2522 40.4999 25.4932 40.2253 26.6504 39.6914C27.8077 39.1574 28.8596 38.3743 29.7422 37.3848L29.7432 37.3828L41.9043 23.8369C46.6986 18.4624 46.6981 9.85319 41.9033 4.47949C40.7768 3.21638 39.434 2.21551 37.9551 1.5332C36.4762 0.850929 34.8893 0.500036 33.2881 0.5C31.687 0.500023 30.1008 0.851058 28.6221 1.5332C27.143 2.21549 25.7995 3.2163 24.6729 4.47949L24.6719 4.48047L23.3721 5.92871L23 6.34375L22.6279 5.92871L21.3271 4.48047L21.3262 4.47949C20.1997 3.21634 18.8569 2.21551 17.3779 1.5332C15.8991 0.850968 14.3121 0.5 12.7109 0.5Z"
              fill="#FD8D8D"
              stroke="#FD8D8D"
            />
          </svg>
        </g>
      </svg>

      {/* <div className={styles.indAlta}></div> */}
      {/* <div className={styles.indBaja}></div> */}

      <p className={styles.valorP}>{presionTexto}</p>
      <p className={styles.ultima}>Última actualización:</p>
      <p className={styles.actual}>{horaTexto}</p>
      <p className={styles.fcha}>{fechaTexto}</p>

      <div className={styles.frecuenica}>
        <p className={styles.valorF}>{frecuenciaTexto}</p>
        <p className={styles.frecue}>
          Frecuencia <br /> Cardiaca
        </p>
      </div>

      <button className={styles.boton} onClick={onAdd}>
        <img className={styles.mas} src={mas} alt="Agregar" />
        Añadir
      </button>
    </div>
  );
};

export default MedidorPresionArterial;
