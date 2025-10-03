
import React from 'react';
import styles from './switch.module.css';

const Switch = () => (
  <div className={styles.cntSwitch}>
    {/* 1️⃣  checkbox oculto */}
    <input id="rolSwitch" type="checkbox" className={styles.input} />

    {/* 2️⃣  deslizador */}
    <label htmlFor="rolSwitch" className={styles.slider} />

    {/* 3️⃣  etiquetas */}
    <span className={`${styles.lbl} ${styles.lblPaciente}`}>Paciente</span>
    <span className={`${styles.lbl} ${styles.lblSalud}`}>Médico</span>
  </div>
);

export default Switch;
