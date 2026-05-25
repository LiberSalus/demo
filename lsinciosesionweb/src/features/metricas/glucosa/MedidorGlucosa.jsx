// MedidorGlucosa.jsx
import React, { useMemo } from "react";
import styles from "./MedidorGlucosa.module.css";

import ayunasIco from "./icoAyuna.svg";
import comidaIco from "./icoComida.svg";

const getAnguloPorGlucosa = (valor = 0, tipo = "ayunas") => {
  const maximo = tipo === "ayunas" ? 126 : 200;
  const valorNormalizado = Math.max(0, Math.min(valor, maximo));
  const progreso = valorNormalizado / maximo;

  return -90 + progreso * 180;
};

const MedidorGlucosa = ({
  tipo = "ayunas",
  valor,
  ultimaActualizacion,
  onClickAñadir, 
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

        <path
          d="M 70 250 A 150 150 0 0 1 370 250"
          fill="none"
          stroke="url(#grad)"
          strokeWidth="28"
          strokeLinecap="round"
          className={styles.arco}
        />

        {/* Puntero (grupo rotado) */}
        <g
          className={styles.puntero}
          style={{
            transform: `rotate(${angulo}deg)`,
            transformOrigin: "220px 250px",
          }}
        >
          <circle
            cx="220"
            cy="250"
            r="18"
            fill="#007CBA"
          />
          <polyline
            points="
              206,250 234,250
              220,145 206,250
              "
            fill="#007CBA"
          />
        </g>

        {/* Etiquetas mín / máx (puedes cambiarlas según tipo) */}
        <text className={styles.txtGrd} x="70" y="282" textAnchor="middle">
          &lt; 60 mg/dL
        </text>

        <text className={styles.txtGrd} x="370" y="282" textAnchor="middle">
          {esAyunas ? "> 126 mg/dL" : "> 200 mg/dL"}
        </text>
      </svg>

      <button
        className={styles.boton}
        type="button"
        onClick={() => onClickAñadir && onClickAñadir(tipo)}
      >
        <span className={styles.mas} aria-hidden="true">
          +
        </span>
        Añadir
      </button>
    </div>
  );
};

export default MedidorGlucosa;
