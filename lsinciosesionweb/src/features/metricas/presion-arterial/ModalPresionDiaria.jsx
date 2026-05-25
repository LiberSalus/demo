// mesat\src\components\PresionArterial\ModalPresionDiaria.jsx
import { useMemo, useState } from "react";
import styles from "./ModalPresionDiaria.module.css";

const ModalPresionDiaria = ({ defaultDate, onClose, onConfirm }) => {
  const tsBase = useMemo(() => {
    const now = new Date();
    return new Date(
      defaultDate.getFullYear(),
      defaultDate.getMonth(),
      defaultDate.getDate(),
      now.getHours(),
      now.getMinutes()
    );
  }, [defaultDate]);

  const [sistolica, setSistolica] = useState("");
  const [diastolica, setDiastolica] = useState("");
  const [medicamento, setMedicamento] = useState("");

  const fechaTxt = tsBase.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
  });

  const horaTxt = tsBase.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const fechaHoraTxt = `${fechaTxt.replace(".", "")} ${horaTxt}`;

  const disabled =
    !sistolica.trim() ||
    !diastolica.trim() ||
    isNaN(sistolica) ||
    isNaN(diastolica) ||
    Number(sistolica) <= Number(diastolica);

  const manejarAceptar = () => {
    if (disabled) return;

    const ahora = new Date();
    const ts = new Date(
      defaultDate.getFullYear(),
      defaultDate.getMonth(),
      defaultDate.getDate(),
      ahora.getHours(),
      ahora.getMinutes(),
      ahora.getSeconds(),
      ahora.getMilliseconds()
    );

    onConfirm({
      sistolica: Number(sistolica),
      diastolica: Number(diastolica),
      medicamento: medicamento.trim() || null,
      ts,
    });
  };

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.modalHead}>
          <h4>Ingresa tus datos</h4>
          <button className={styles.close} onClick={onClose} type="button" aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className={`${styles.formRow} ${styles.formRowCompacta}`}>
          <label>Fecha y hora:</label>
          <div className={styles.fechaHoraValor}>{fechaHoraTxt}</div>
        </div>

        <div className={styles.formRow}>
          <label className={styles.formLabel}>
            <span>Sistólica:</span>
            <span className={styles.sfj}>(Número mayor)</span>
          </label>
          <div className={styles.campoCapsula}>
            <input
              className={styles.inputCapsula}
              inputMode="numeric"
              placeholder="-- --"
              value={sistolica}
              onChange={(e) => setSistolica(e.target.value)}
            />
            <span className={styles.unidad}>mmHg</span>
          </div>
        </div>

        <div className={styles.formRow}>
          <label className={styles.formLabel}>
            <span>Diastólica:</span>
            <span className={styles.sfj}>(Número menor)</span>
          </label>
          <div className={styles.campoCapsula}>
            <input
              className={styles.inputCapsula}
              inputMode="numeric"
              placeholder="-- --"
              value={diastolica}
              onChange={(e) => setDiastolica(e.target.value)}
            />
            <span className={styles.unidad}>mmHg</span>
          </div>
        </div>

        <div className={styles.formRow}>
          <label className={styles.formLabel}>
            <span>Medicamento:</span>
          </label>
          <div className={styles.campoCapsula}>
            <input
              className={styles.inputCapsula}
              placeholder="-- --"
              value={medicamento}
              onChange={(e) => setMedicamento(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.recos}>
          <h5>Indicaciones:</h5>
          <p className={styles.recosTitulo}>Mide tu presión arterial</p>
          <ol>
            <li>
              Siéntate con la espalda recta, pies en el suelo y brazo descubierto apoyado a
              la altura del corazón.
            </li>
            <li>Usa un tensiómetro automático de brazo.</li>
            <li>Sigue las indicaciones que están anotadas en tu tensiómetro.</li>
            <li>Asegúrate de que el manguito sea del tamaño correcto.</li>
          </ol>
          <p className={styles.recosNota}>
            Antes de medir, relájate 5 minutos sin hablar ni tomar cafeína.
          </p>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnSec} onClick={onClose} type="button">
            Cancelar
          </button>
          <button
            className={styles.btnPri}
            onClick={manejarAceptar}
            disabled={disabled}
            type="button"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPresionDiaria;
