// src/pages/Inicio/TarjetaMedicamento/TarjetaMedicamentoIco.jsx
import React from "react";
import styles from "./TarjetaMedicamentoIco.module.css";
import "./animaIcoMedicamentos.css";

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
        <div className={styles.barraColor} style={{ backgroundColor: "#59edfe" }} />
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
