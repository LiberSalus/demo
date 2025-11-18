import React from 'react';
import TarjetaMedicamento from './TarjetaMedicamento';
import { medicamentos } from './datosMedicamentos.js'
import styles from './TarjetasMedicamentos.module.css'

const TarjetasMedicamentos = () => {
  return (
    <div className={styles.cntTarjetasMedicamentos}>
      <h3>Mis Medicamentos</h3>
      {medicamentos.map((medicamento) => (
        <TarjetaMedicamento key={medicamento.id} {...medicamento}/>
      ))}
    </div>
  );
}

export default TarjetasMedicamentos
