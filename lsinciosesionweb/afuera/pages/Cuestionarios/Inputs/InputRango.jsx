import React from "react";
import styles from "./inputRango.module.css";

const InputRango = ({ min = 1, max = 7, step = 1, value, onChange }) => {
  const pct = ((value - min) / (max - min)) * 100;
  const labels = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <div
      className={styles.slider}
      style={{ "--steps": labels.length, "--pct": `${pct}%` }}
    >
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
        className={styles.range}
        aria-label={`Escala de ${min} a ${max}`}
        style={{
          background: `linear-gradient(to right,
            var(--fill) 0%,
            var(--fill) ${pct}%,
            var(--track) ${pct}%,
            var(--track) 100%)`,
        }}
      />

      {/* Aureola centrada en el tick actual */}
      <span className={styles.halo} />

      {/* Números */}
      <div className={styles.labels}>
        {labels.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
    </div>
  );
};

export default InputRango;
