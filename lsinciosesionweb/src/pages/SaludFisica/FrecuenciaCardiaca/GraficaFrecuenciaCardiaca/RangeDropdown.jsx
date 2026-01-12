//src\pages\SaludFisica\FrecuenciaCardiaca\GraficaFrecuenciaCardiaca\RangeDropdown.jsx
import React from "react";
import styles from "./RangeDropdown.module.css";

/**
 * options: [{ value: string, label: string }]
 */
const RangeDropdown = ({ options = [], value, onChange }) => {
    return (
        <div className={styles.wrapper}>
            <select
                className={styles.select}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <span className={styles.arrow}>▴</span>
        </div>
    );
};

export default RangeDropdown;
