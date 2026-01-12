import { useMemo, useRef } from "react";
import styles from "./DatePill.module.css";


/**
 * type = "date" | "month" | "year"
 */
export default function DatePill({ value, onChange, type = "date", className = "" }) {
  const inputRef = useRef(null);

  // --- Normalizadores ---
  const toInput = (d) => {
    const x = new Date(d);
    if (type === "month") {
      const m = String(x.getMonth() + 1).padStart(2, "0");
      return `${x.getFullYear()}-${m}`;
    }
    if (type === "year") return x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, "0");
    const day = String(x.getDate()).padStart(2, "0");
    return `${x.getFullYear()}-${m}-${day}`;
  };

  const fromInput = (v) => {
    if (type === "month") {
      const [y, m] = v.split("-").map(Number);
      return new Date(y, m - 1, 1);
    }
    if (type === "year") return new Date(Number(v), 0, 1);
    const [y, m, d] = v.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  // --- Etiqueta mostrada ---
  const label = useMemo(() => {
    const d = new Date(value);
    if (type === "month") {
      return new Intl.DateTimeFormat("es-MX", {
        month: "long",
        year: "numeric",
      }).format(d);
    }
    if (type === "year") {
      return d.getFullYear().toString();
    }
    return new Intl.DateTimeFormat("es-MX", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  }, [value, type]);

  // --- Abrir el selector nativo ---
  const openPicker = () => {
    const el = inputRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.focus();
      el.click();
    }
  };

  return (
    <div className={`${styles.pill} ${className}`}>
      <button type="button" onClick={openPicker} className={styles.btn}>
        <span className={styles.text}>
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </span>
        <svg className={styles.chev} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 10l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <input
        ref={inputRef}
        type={type}
        className={styles.native}
        value={toInput(value)}
        onChange={(e) => onChange(fromInput(e.target.value))}
      />
    </div>
  );
}
