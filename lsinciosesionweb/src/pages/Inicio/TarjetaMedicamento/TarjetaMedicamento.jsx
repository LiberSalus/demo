import React from 'react'
import styles from './TarjetaMedicamento.module.css'

//estados según alertas

const colorAlerta = {
  ahora: {bg:"#F7D66F", texto: "Ya casi es hora de tu medicia!", btn:"Tomar ahora"},
  tomado: {bg:"#D3E5ED", texto: "Ya has tomado tu tratamiento", btn:"Ver historial"},
  aiempo: {bg:"#62CE7B", texto: "Es buen momento para tomar tu medicamento", btn:"Posponer 10 min"},
  vencida: {bg:"#DC7368", texto: "Ya casi es hora de tu medicia!", btn:"Tomar ahora"},
}

const TarjetaMedicamento = ({ medicamento, dosis, padecimiento, hora, timer, estado }) => {

  //seleccion de color segun estado de alerta

  const info = colorAlerta[estado] || colorAlerta.aiempo

  return (
    <div className={styles.TarjetaMedicamento}>
      <div className={styles.encabezado}>
        <p className={styles.medicamento}>{medicamento}</p>
        <p className={styles.dosis}>{dosis}</p>
      </div>

      <div className={styles.cuerpo}>
        <p className={styles.padecimiento}>Tratamiento para:<br/> {padecimiento}</p>
        <p className={styles.hora}>{hora}</p>
        <p className={styles.proximo}>Próxima dosis dentro de:<br/> <span className={styles.timer}>{timer}</span></p>
      </div>

      <div 
        className={styles.alerta}
        style={{ backgroundColor: info.bg }}
      >
        <p>{info.texto}</p>
      </div>

      <div className={styles.cntBtn}>
        <button className={styles.btn}>{info.btn}</button>
      </div>
    </div>
  );
};

export default TarjetaMedicamento
