import React, { useState } from 'react';
import styles from './ControlRadio.module.css';

const ControlRadio = ({
  opciones = ["Opción A", "Opción B"],
  estadoInicial = opciones[0],
  valor,
  onChange,
  className
}) => {
  const [seleccionInterna, setSeleccionInterna] = useState(estadoInicial);
  const isControlled = valor !== undefined;
  const seleccion = isControlled ? valor : seleccionInterna;
  const handleChange = (opcion) => {
    if (isControlled) {
      onChange && onChange(opcion);
    } else {
      setSeleccionInterna(opcion);
    }
  };


  return (
    <div className={`${styles.group} ${className || ""}`}>
      {opciones.map((opcion) => (
        <label
          key={opcion}
          className={`${styles.radio} ${seleccion === opcion ? styles.active : ""}`}
        >
          <input
            type="radio"
            name="control-radio"
            valor={opcion}
            checked={seleccion === opcion}
            onChange={() => handleChange(opcion)}
            className={styles.input}
          />
          <span className={styles.circulo}></span>
          {opcion}
        </label>
      ))}
    </div>
  );
};

export default ControlRadio;