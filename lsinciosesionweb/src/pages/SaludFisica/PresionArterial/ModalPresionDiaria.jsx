// mesat\src\components\PresionArterial\ModalPresionDiaria.jsx
import { useState } from "react";
import styles from "./ModalPresionDiaria.module.css";

const ModalPresionDiaria = ({ defaultDate, onClose, onConfirm }) => {
  // fecha/hora autollenadas (no editables)
  const [ts] = useState(() => {
    const now = new Date();
    // día por defecto pero hora actual
    return new Date(
      defaultDate.getFullYear(),
      defaultDate.getMonth(),
      defaultDate.getDate(),
      now.getHours(),
      now.getMinutes()
    );
  });

  const [sistolica, setSistolica] = useState("");
  const [diastolica, setDiastolica] = useState("");

  const fechaTxt = ts.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
  });

  const horaTxt = ts.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const disabled =
    !sistolica.trim() || !diastolica.trim() || isNaN(sistolica) || isNaN(diastolica);

  const manejarAceptar = () => {
    if (disabled) return;

    onConfirm({
      sistolica: Number(sistolica),
      diastolica: Number(diastolica),
      ts,
    });
  };

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.modalHead}>
          <h4>Ingresa tus datos</h4>
          <button className={styles.close} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.formRow}>
          <label>Fecha:</label>
          <input value={fechaTxt} readOnly className={styles.readonly} />
        </div>

        <div className={styles.formRow}>
          <label>Hora:</label>
          <input value={horaTxt} readOnly className={styles.readonly} />
        </div>

        <div className={styles.formRow}>
          <label>
            Sistólica: <span className={styles.sfj}>(Número mayor)</span>
          </label>
          <input
            className={styles.readonly}
            inputMode="numeric"
            
            value={sistolica}
            onChange={(e) => setSistolica(e.target.value)}
          />
          <span className={styles.mmhg}>mmHg</span>
        </div>

        <div className={styles.formRow}>
          <label>
            Diastólica: <span className={styles.sfj}>(Número menor)</span>
          </label>
          <input
            className={styles.readonly}
            inputMode="numeric"
            
            value={diastolica}
            onChange={(e) => setDiastolica(e.target.value)}
          />
          <span className={styles.mmhg}>mmHg</span>
        </div>

        <div className={styles.recos}>
          <b>Recomendaciones:</b>
          <p>Mide tu presión arterial:</p>
          <ol>
            <li>
              Siéntate con la espalda recta, pies en el suelo y brazo descubierto apoyado a
              la altura del corazón.
            </li>
            <li>Usa un tensiómetro automático de brazo.</li>
            <li>Sigue las indicaciones que están anotadas en tu tensiómetro.</li>
            <li>Asegúrate de que el manguito sea del tamaño correcto.</li>
          </ol>
          <p>
            Antes de medir, relájate 5 minutos sin hablar ni tomar cafeína.
          </p>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnSec} onClick={onClose}>
            Cancelar
          </button>
          <button
            className={styles.btnPri}
            onClick={manejarAceptar}
            disabled={disabled}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPresionDiaria;
