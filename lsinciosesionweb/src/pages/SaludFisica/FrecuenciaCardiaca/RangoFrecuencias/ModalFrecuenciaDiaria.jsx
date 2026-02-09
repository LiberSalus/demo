//mesat\src\components\RangoFrecuencias\ModalFrecuenciaDiaria.jsx
import { useEffect, useMemo, useState } from "react";
import styles from "./MedidorFrecuenica.module.css";


const  ModalFrecuenciaDiaria = ({ onClose, onConfirm, defaultDate = new Date() }) => {
  // fecha/hora autollenadas (no editables)
  const [ts, setTs] = useState(()=> {
    const now = new Date();
    // usa el día por defecto pero hora actual
    return new Date(defaultDate.getFullYear(), defaultDate.getMonth(), defaultDate.getDate(), now.getHours(), now.getMinutes());
  });
  const [bpm, setBpm] = useState("");

  // label legible
  const fechaTxt = useMemo(() => {
  const partes = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).formatToParts(ts);

  const dia = partes.find(p => p.type === "day").value;
  const mes = partes.find(p => p.type === "month").value;
  const año = partes.find(p => p.type === "year").value;

  return `${dia} / ${mes} / ${año}`;
}, [ts])

  const horaTxt = useMemo(()=> new Intl.DateTimeFormat("es-MX", {
    hour:"2-digit", minute:"2-digit"
  }).format(ts), [ts]);

  // validación simple
  const disabled = !(Number(bpm) >= 30 && Number(bpm) <= 220);

  useEffect(()=>{ document.body.style.overflow="hidden"; return ()=>{ document.body.style.overflow=""; }; },[]);

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.modalHead}>
          <h4>Ingresa tus datos</h4>
          <button className={styles.close} onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <div className={styles.formRow}>
          <label>Fecha y hora:</label>
          <input value={`${fechaTxt} - ${horaTxt}`} readOnly className={styles.readonly}/>
        </div>
        <div className={styles.formRow}>
          <label>Pulsaciones por minuto:</label>
          <div className={styles.inline}>
            <input
              className={styles.inputNumber}
              type="number"
              min={30}
              max={220}
              placeholder="— —"
              value={bpm}
              onChange={(e)=>setBpm(e.target.value)}
            />
            <span className={styles.suffix}>ppm</span>
          </div>
        </div>
          {/* <small className={styles.help}>Rango válido: 30–220 ppm</small> */}

        <div className={styles.recos}>
          <b>Recomendaciones:</b><br/>
          <b>Mide tu frecuencia cardiaca manualmente</b>
          <ol>
            <li>Coloca dos dedos (índice y medio) sobre tu muñeca o cuello.</li>
            <li>Cuenta los latidos durante 15 segundos.</li>
            <li>Multiplica tu conteo por 4.</li>
          </ol>
          <p>Antes de medir, relájate 5 minutos sin hablar ni tomar cafeína.</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnSec} onClick={onClose}>Cancelar</button>
          <button
            className={styles.btnPri}
            onClick={()=> onConfirm(Number(bpm), ts)}
            disabled={disabled}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
export default ModalFrecuenciaDiaria;