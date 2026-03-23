// src/pages/Inicio/TarjetaMedicamento/TarjetaMedicamentoIco.jsx
import React from "react";
import styles from "./TarjetaMedicamentoIco.module.css";
import "./animaIcoMedicamentos.css";

const coloresBarra = ["#59EDFE", "#21D127", "#FF8904", "#C11007", "#A855F7"];

const colorAlerta = {
  ahora: {
    bg: "#F7D66F",
    texto: "Ya casi es hora de tu medicia!",
    btn: "Tomar ahora",
  },
  tomado: {
    bg: "#D3E5ED",
    texto: "Ya has tomado tu tratamiento",
    btn: "Ver historial",
  },
  aiempo: {
    bg: "#62CE7B",
    texto: "Es buen momento para tomar tu medicamento",
    btn: "Configurar",
  },
  vencida: {
    bg: "#DC7368",
    texto: "Ya casi es hora de tu medicia!",
    btn: "Tomar ahora",
  },
};

const TarjetaMedicamentoIco = ({
  medicamento,
  dosis,
  padecimiento,
  hora,
  timer,
  estado,
  icono,
  tipoIcono,
  colorBarra = "#59EDFE",
  onChangeColor,

  // ✅ NUEVO
  onOpen,
}) => {
  const info = colorAlerta[estado] || colorAlerta.aiempo;

  const iconoEl = React.isValidElement(icono)
    ? React.cloneElement(icono, {
        className: `${styles.icono} ico-med ${icono.props.className || ""}`.trim(),
        "data-tipo": tipoIcono || "tableta",
      })
    : null;

  return (
    <div
      className={`${styles.TarjetaMedicamento} estado-${estado}`}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen?.();
      }}
    >
      <div className={styles.encabezado}>
        <p className={styles.medicamento}>{medicamento}</p>
        <p className={styles.dosis}>{dosis}</p>
        <div className={styles.colorPicker}>
          <div className={styles.selectorColores}>
            {coloresBarra.map((color) => (
              <button
                key={color}
                type="button"
                className={`${styles.colorOption} ${
                  colorBarra === color ? styles.colorOptionActiva : ""
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Seleccionar color ${color}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeColor?.(color);
                }}
              />
            ))}
          </div>
          <div className={styles.barraColor} style={{ backgroundColor: colorBarra }} />
        </div>
      </div>

      <div className={styles.cuerpo}>
        <p className={styles.hora}>{hora}</p>
        {iconoEl}
      </div>

      <div className={styles.alerta} style={{ backgroundColor: info.bg }}>
        <p>{info.texto}</p>
      </div>

      <div className={styles.cntBtn}>
        <button
          className={styles.btn}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.();
          }}
        >
          {info.btn}
        </button>
      </div>
    </div>
  );
};

export default TarjetaMedicamentoIco;
