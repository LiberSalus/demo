// MedidorGlucosa.jsx
import React, { useMemo } from "react";
import styles from "./MedidorGlucosa.module.css";
import mas from "./icoMas.svg";

import ayunasIco from "./icoAyuna.svg";
import comidaIco from "./icoComida.svg";
import { getAnguloPorGlucosa } from "./utilsGlucosa";

const MedidorGlucosa = ({
  tipo = "ayunas",
  valor,
  ultimaActualizacion,
  onClickAñadir, // 👈 nuevo
}) => {
  const esAyunas = tipo === "ayunas";
  const icono = esAyunas ? ayunasIco : comidaIco;
  const subtitulo = esAyunas ? "(En ayunas)" : "(Después de comer)";

  const angulo = useMemo(
    () => getAnguloPorGlucosa(valor ?? 0, tipo),
    [valor, tipo]
  );

  return (
    <div className={styles.MedidorGlucosa}>
      <div className={styles.cntHead}>
        <div className={styles.momento}>
          <p className={styles.tit}>Niveles de glucosa</p>
          <p className={styles.sub}>{subtitulo}</p>
          <div className={styles.cntIco}>
            <img className={styles.ico} src={icono} alt={subtitulo} />
          </div>
        </div>

        <div className={styles.medicion}>
          <p className={styles.valor}>
            {valor != null ? `${valor} mg/dL` : "--"}
          </p>
          <p className={styles.labelActualizacion}>Última actualización:</p>
          <p className={styles.hora}>{ultimaActualizacion || "Sin registro"}</p>
        </div>
      </div>

      {/* SVG igual que ya lo tienes, solo dejo estructura */}
      <svg
        viewBox="0 0 440 300"
        preserveAspectRatio="xMidYMid meet"
        className={styles.progreso}
      >
        <defs>
          <linearGradient id="grad" gradientTransform="rotate(0)">
            <stop offset="0%" stopColor="#FD8D8D" />
            <stop offset="25%" stopColor="#F6E68B" />
            <stop offset="85%" stopColor="#98DBD3" />
            <stop offset="100%" stopColor="#3DCDF5" />
          </linearGradient>
        </defs>

        {/* Arco */}
        <circle
          cx="220"
          cy="130"
          r="150"
          fill="none"
          stroke="url(#grad)"
          strokeWidth="28"
          strokeDasharray="50 50"
          /* transform="rotate(180) translate(-440 -310)" */
          pathLength="100"
          transformOrigin="220 150"
          strokeLinecap="round"
          className={styles.arco}
        />

        {/* <polyline 
          fill="#007CBA"
          points="5,5 435,5"
          stroke="#007CBA"
          /> */}

        {/* Puntero (grupo rotado) */}
        <g
          className={styles.puntero}
          style={{
            transform: `rotate(${angulo}deg)`,
            transformOrigin: "220px 140px",
          }}
        >
          <circle
            cx="220"
            cy="130"
            r="10"
            fill="none"
            stroke="#007CBA"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <polyline
            points="
              200.75,170  239.5,170
              220,100  200.75,170
              "
            transform="translate(0 -40)"
            fill="#007CBA"
          />
        </g>

        {/* Etiquetas mín / máx (puedes cambiarlas según tipo) */}
        <g transform="translate(0 -40)">
          <text className={styles.txtGrd} x="70" y="252" textAnchor="middle">
            &lt; 60 mg/dL
          </text>
        </g>

        <g transform="translate(0 -40)">
          <text className={styles.txtGrd} x="370" y="252" textAnchor="middle">
            {esAyunas ? "> 126 mg/dL" : "> 200 mg/dL"}
          </text>
        </g>

        <g className={styles.puntero} transform={`rotate(${angulo} 220 130)`}>
          {/* círculo + aguja */}
        </g>
      </svg>

      <button
        className={styles.boton}
        type="button"
        onClick={() => onClickAñadir && onClickAñadir(tipo)}
      >
        <img className={styles.mas} src={mas} alt="Agregar" />
        Añadir
      </button>
    </div>
  );
};

export default MedidorGlucosa;
