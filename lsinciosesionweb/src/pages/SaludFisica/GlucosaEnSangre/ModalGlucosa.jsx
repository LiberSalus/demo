// src/components/Glucosa/ModalGlucosa.jsx
import React, { useState, useEffect } from "react";
import styles from "./ModalGlucosa.module.css";

const ModalGlucosa = ({ abierto, onClose, onGuardar, tipo = "ayunas" }) => {
  const [valor, setValor] = useState("");
  const [esAyunas, setEsAyunas] = useState(tipo === "ayunas");

  useEffect(() => {
    setEsAyunas(tipo === "ayunas");
  }, [tipo]);

  if (!abierto) return null;

  const fechaAhora = new Date().toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(valor);
    if (isNaN(num) || num <= 0) return;

    onGuardar({
      valor: num,
      tipo: esAyunas ? "ayunas" : "comida",
      fecha: new Date().toISOString(),
    });

    setValor("");
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.cerrar} type="button" onClick={onClose}>
          ✕
        </button>

        <h2 className={styles.titulo}>Ingresa tus datos</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.campo}>
            <label>Fecha y hora:</label>
            <p className={styles.valorFijo}>{fechaAhora}</p>
          </div>

          <div className={styles.campo}>
            <label>Glucosa en sangre:</label>
            <div className={styles.inputGrupo}>
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className={styles.input}
                
              />
              <span className={styles.unidad}>mg/dL</span>
            </div>
          </div>

          <div className={styles.campoCheck}>
            <label>
              ¿Esta medición es en ayunas?
              <input
                type="checkbox"
                checked={esAyunas}
                onChange={(e) => setEsAyunas(e.target.checked)}
                className={styles.check}
              />
            </label>
          </div>
           <div className={styles.recomendaciones}>
            <p className={styles.subtitulo}>Recomendaciones:</p>
            <ol>
              <li>Lávate las manos con agua y jabón.</li>
              <li>Ten a la mano tiras reactivas, lanceta y glucómetro.</li>
              <li>Pincha en un costado del dedo.</li>
              <li>Descarta la primera gota si está muy espesa.</li>
              <li>Acerca la gota de sangre a la tira sin presionar.</li>
            </ol>
          </div>


          <button type="submit" className={styles.boton}>
            Aceptar
          </button>
        </form>
      </div>
    </div>
  );
};


export default ModalGlucosa;
