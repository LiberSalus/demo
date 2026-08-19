import React from 'react';
import styles from './preguntasQS.module.css';

// Opciones como filas seleccionables (radio/checkbox custom).
const PreguntasQs = ({ pregunta, numero, respuesta, alCambiarRespuesta, sinRespuesta = false, soloLectura = false }) => {
  const { id, type, text, list_options } = pregunta;
  const clasePregunta = sinRespuesta ? `${styles.pregunta} ${styles.preguntaSinRespuesta}` : styles.pregunta;

  // El JSON trae el numero en el texto ("1. Enunciado") y el badge lo muestra;
  // se quita el prefijo para no duplicar el numero.
  const textoLimpio = text.replace(/^\d+[.)]\s*/, "");
  // Badge: usa el order del instrumento (en el DTS la numeración 1-36 es
  // fiel al drawio: impares frecuencia, pares gravedad) y cae al índice
  // visible como respaldo si el JSON no trae order.
  const numeroVisible = pregunta.order != null ? pregunta.order : numero;

  if (type === 'SINGLE_CHOICE') {
    return (
      <fieldset className={clasePregunta}>
        <legend className={styles.encabezado}>
          <span className={styles.numero}>{numeroVisible}</span>
          <span className={styles.texto}>{textoLimpio}</span>
        </legend>
        <div className={styles.opciones}>
          {list_options.map((opcion) => {
            const val = Number(opcion.value);
            const activa = respuesta === val;
            return (
              <label
                key={opcion.id}
                className={`${styles.opcion} ${activa ? styles.opcionActiva : ''}`}
              >
                <input
                  className={styles.inputRadio}
                  type="radio"
                  id={`q${id}_opt${opcion.id}`}
                  name={`pregunta-${id}`}
                  value={val}
                  checked={activa}
                  onChange={(e) => alCambiarRespuesta(id, Number(e.target.value))}
                  disabled={soloLectura}
                />
                <span className={styles.radioCaja} aria-hidden="true" />
                <span className={styles.opcionTexto}>{opcion.text}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (type === 'MULTIPLE_CHOICE') {
    return (
      <fieldset className={clasePregunta}>
        <legend className={styles.encabezado}>
          <span className={styles.numero}>{numeroVisible}</span>
          <span className={styles.texto}>{textoLimpio}</span>
        </legend>
        <div className={styles.opciones}>
          {list_options.map((opcion) => {
            const val = Number(opcion.value);
            const activa = Array.isArray(respuesta) && respuesta.includes(val);
            return (
              <label
                key={opcion.id}
                className={`${styles.opcion} ${activa ? styles.opcionActiva : ''}`}
              >
                <input
                  className={styles.inputMultipleCh}
                  type="checkbox"
                  id={`q${id}_opt${opcion.id}`}
                  value={val}
                  checked={activa}
                  onChange={(e) => {
                    const set = new Set(Array.isArray(respuesta) ? respuesta : []);
                    e.target.checked ? set.add(val) : set.delete(val);
                    alCambiarRespuesta(id, Array.from(set));
                  }}
                  disabled={soloLectura}
                />
                <span className={styles.checkCaja} aria-hidden="true" />
                <span className={styles.opcionTexto}>{opcion.text}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (type === 'TEXT') {
    return (
      <div className={clasePregunta}>
        <div className={styles.encabezado}>
          <span className={styles.numero}>{numeroVisible}</span>
          <span className={styles.texto}>{textoLimpio}</span>
        </div>
        <input
          className={styles.inputText}
          type="text"
          value={respuesta || ''}
          placeholder="Escribe tu respuesta…"
          onChange={(e) => alCambiarRespuesta(id, e.target.value)}
          disabled={soloLectura}
        />
      </div>
    );
  }

  return null;
};

export default PreguntasQs;
