import React from 'react';
import styles from './preguntasQS.module.css';

const PreguntasQs = ({ pregunta, respuesta, alCambiarRespuesta }) => {
  const { id, type, text, list_options } = pregunta;

  if (type === 'SINGLE_CHOICE') {
    return (
      <div className={styles.pregunta}>
        <p>{text}</p>
        {list_options.map((opcion) => {
          const val = Number(opcion.value);
          return (
            <div key={opcion.id}>
              <input
                className={styles.inputRadio}
                type="radio"
                id={`q${id}_opt${opcion.id}`}
                name={`pregunta-${id}`}
                value={val}
                checked={respuesta === val}
                onChange={(e) => alCambiarRespuesta(id, Number(e.target.value))}
              />
              <label htmlFor={`q${id}_opt${opcion.id}`}>{opcion.text}</label>
            </div>
          );
        })}
      </div>
    );
  }

  if (type === 'MULTIPLE_CHOICE') {
    return (
      <div className={styles.pregunta}>
        <p>{text}</p>
        {list_options.map((opcion) => {
          const val = Number(opcion.value);
          const checked = Array.isArray(respuesta) && respuesta.includes(val);
          return (
            <div key={opcion.id}>
              <input
                className={styles.inputMultipleCh}
                type="checkbox"
                id={`q${id}_opt${opcion.id}`}
                value={val}
                checked={checked}
                onChange={(e) => {
                  const set = new Set(Array.isArray(respuesta) ? respuesta : []);
                  e.target.checked ? set.add(val) : set.delete(val);
                  alCambiarRespuesta(id, Array.from(set));
                }}
              />
              <label htmlFor={`q${id}_opt${opcion.id}`}>{opcion.text}</label>
            </div>
          );
        })}
      </div>
    );
  }

  if (type === 'TEXT') {
    return (
      <div className={styles.pregunta}>
        <p>{text}</p>
        <input
          className={styles.inputText}
          type="text"
          value={respuesta || ''}
          onChange={(e) => alCambiarRespuesta(id, e.target.value)}
        />
      </div>
    );
  }

  return null;
};

export default PreguntasQs;
