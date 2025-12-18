// src/components/Glucosa/Glucosa.jsx
import React, { useState } from 'react';
import styles from './Glucosa.module.css';

import AdverGlucosa from './AdverGlucosa';
import TolesGlucosa from './TolesGlucosa';
import PanelGlucosa from './PanelGlucosa';
import RangosGlucosa from './RangosGlucosa';
import GraficaGlucosa from './GraficaGlucosa';
import TabMedicamento from './TabMedicamento';

const Glucosa = () => {
  const [ayunas, setAyunas] = useState(null);
  const [comida, setComida] = useState(null);

  const actualizarValor = ({ valor, tipo }) => {
    if (tipo === "ayunas") setAyunas(valor);
    if (tipo === "comida") setComida(valor);
  };

  return (
    <div className={styles.Glucosa}>
      <div className={styles.izq}>
        <RangosGlucosa ayunas={ayunas} comida={comida} />
        <GraficaGlucosa ayunas={ayunas} comida={comida} />
      </div>

      <div className={styles.cen}>
        <PanelGlucosa
          ayunas={ayunas}
          comida={comida}
          onActualizar={actualizarValor}
        />
        <TabMedicamento />
      </div>

      <div className={styles.der}>
        <AdverGlucosa />
        <TolesGlucosa />
      </div>
    </div>
  );
};

export default Glucosa;
