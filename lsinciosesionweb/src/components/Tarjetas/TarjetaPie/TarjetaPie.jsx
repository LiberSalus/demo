import React from "react";
import styles from "./TarjetaPie.module.css";
import { useState, useEffect } from "react";

const TarjetaPie = ({
  edad = "- -",
  peso = "- -",
  sangre = "- -",
  estatura = "- -",
}) => {
  const useContadorAnimado = (valorFinal, velocidad = 20) => {
    const [valor, setValor] = useState(0);

    useEffect(() => {
      let actual = 0;
      const incremento = Math.ceil(valorFinal / 400); // suaviza la subida
      const intervalo = setInterval(() => {
        actual += incremento;
        if (actual >= valorFinal) {
          actual = valorFinal;
          clearInterval(intervalo);
        }
        setValor(actual);
      }, velocidad);

      return () => clearInterval(intervalo);
    }, [valorFinal, velocidad]);

    return valor;
  };

  const edadAnimada = useContadorAnimado(edad);
  const estaturaAnimada = useContadorAnimado(estatura);
  const pesoAnimado = useContadorAnimado(peso);


  return (
    <div className={styles.TarjetaPie}>
      <div className={styles.datos}>
        <p>Edad</p>
        <p className={styles.edad}>{edadAnimada}</p>
        <p>años</p>
      </div>

      <div className={styles.datos}>
        <p>Estatura</p>
        <p className={styles.estatura}>{estaturaAnimada}</p>
        <p>cm</p>
      </div>

      <div className={styles.datos}>
        <p>Peso</p>
        <p className={styles.peso}>{pesoAnimado}</p>
        <p>kg</p>
      </div>

      <div className={styles.datos}>
        <p>Sangre</p>
        <p className={styles.sangre}>{sangre}</p>
        <p></p>
      </div>
    </div>
  );
};

export default TarjetaPie;
