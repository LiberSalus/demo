// mesat\src\components\PresionArterial\MedidorPresionArterial.jsx
import { useState, useEffect } from "react";
import styles from "./MedidorPresionArterial.module.css";
import mas from "./icoMas.svg";

const MedidorPresionArterial = ({
  sistolica = 120,
  diastolica = 80,
  frecuencia = 75,
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
  const PATH_TOTAL = 240;
  const USED_ARC = 120; // sólo media circunferencia para los datos
  const MIN_P = 0;
  const MAX_P = 240;

  const CENTER_X = 220;
  const CENTER_Y = 150;
  const RADIO_DOT = 150;

  // valor → posición sobre el PATH (para strokeDasharray)
  const mapValueToArc = (valor) => {
    const clamped = Math.min(Math.max(valor, MIN_P), MAX_P);
    const t = (clamped - MIN_P) / (MAX_P - MIN_P); // 0 a 1
    return t * USED_ARC; // sólo usamos la “micha” del path
  };

  const posSistolica = mapValueToArc(sistolica);
  const posDiastolica = mapValueToArc(diastolica);

  const from = Math.max(posSistolica, posDiastolica);
  const to = Math.min(posSistolica, posDiastolica);

  const visible = from - to;
  const offset = from + 120; // tu ajuste fino para alinearlo al semicírculo

  // valor → punto (x,y) para las bolitas verdes
  const mapValueToPoint = (valor) => {
    const clamped = Math.min(Math.max(valor, MIN_P), MAX_P);
    const t = (clamped - MIN_P) / (MAX_P - MIN_P); // 0 a 1
    const angle = t * Math.PI; // 0 rad = derecha, π = izquierda

    const x = CENTER_X + RADIO_DOT * Math.cos(angle);
    const y = CENTER_Y - RADIO_DOT * Math.sin(angle);

    return { x, y };
  };

  const puntoSis = mapValueToPoint(sistolica);
  const puntoDia = mapValueToPoint(diastolica);

  return (
    <div className={styles.MedidorPresionArterial}>
      <p className={styles.tit}>Presión arterial</p>

      <svg
        viewBox="0 0 440 300"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%" }}
        className={styles.progreso}
      >
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
          transformOrigin="50%"
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
          transformOrigin="50%"
        />

        {/* cubre */}
        <circle
          cx="220"
          cy="200"
          r="130"
          fill="none"
          stroke="#fff"
          strokeWidth="1.1rem"
          strokeDasharray="119 122"
          pathLength="240"
          transform="rotate(1)translate(3 7)"
          transformOrigin="50%"
        />

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
          transformOrigin="50%"
          strokeLinecap="round"
        />

        {/* arco dinámico de rango sistólica–diastólica */}
        <circle
          cx="220"
          cy="150"
          r="150"
          fill="none"
          stroke="#82D5FF"
          strokeWidth="1rem"
          strokeDasharray={`${visible} ${PATH_TOTAL - visible}`}
          strokeDashoffset={offset}
          pathLength={PATH_TOTAL}
          transform="rotate(180) translate(-440 -360)"
          transformOrigin="220 150"
          strokeLinecap="round"
          style={{
            transition:
              "stroke-dasharray 1.5s ease-out, stroke-dashoffset 1.5s ease-out",
          }}
        />

        {/* marcadores de sistólica y diastólica */}
        {sistolica > 0 && (
          <g transform="translate(0 60)">
            <circle
              cx={puntoSis.x}
              cy={puntoSis.y}
              r={8}
              fill="#4ade80"
              stroke="#fff"
            />
          </g>
        )}

        {diastolica > 0 && (
          <g transform="translate(0 60)">
            <circle
              cx={puntoDia.x}
              cy={puntoDia.y}
              r={8}
              fill="#4ade80"
              stroke="#fff"
            />
          </g>
        )}

        {/* valores graduación */}
        <g>
          <text className={styles.txtGrd} x="337" y="210" fontFamily="Arial">
            0
          </text>

          <text
            className={styles.txtGrd}
            x="318"
            y="153"
            fontFamily="Arial"
          >
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

      <p className={styles.valorP}>
        {sistolica} - {diastolica} mmHg
      </p>
      <p className={styles.ultima}>Última actualización:</p>
      <p className={styles.actual}>{horaTexto}</p>
      <p className={styles.fcha}>{fechaTexto}</p>

      <div className={styles.frecuenica}>
        <p className={styles.valorF}>{frecuencia} ppm</p>
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
