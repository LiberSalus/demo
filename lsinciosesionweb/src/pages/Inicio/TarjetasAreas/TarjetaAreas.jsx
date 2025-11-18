import React from 'react'
import styles from './TarjetasAreas.module.css'
import PestañaSalud from './PestañaSalud'

import VistaFisica from './VistaFisica/VistaFisica'
import VistaSocial from './VistaSocial/VistaSocial'
import VistaEmocional from './VistaEmocional/VistaEmocional'
import VistaNutricional from './VistaNutricional/VistaNutricional'



const TarjetaAreas = () => {
  return (
    <div className={styles.cntTarjetaAreas}>
      <h3>Áreas de la salud</h3>
      <p> Lorem ipsum dolor sit amet consectetur. Dictumst nibh quisque eu donec tortor non fermentum. Lorem ipsum dolor sit amet consectetur. Dictumst nibh quisque eu. Lorem ipsum dolor sit amet consectetur.  </p>

      <div className={styles.cntPestañas}>

        <PestañaSalud
          tabs={[
            { titulo: "Bienestar Físico", componente: <VistaFisica /> },
            { titulo: "Bienestar Social", componente: <VistaSocial /> },
            { titulo: "Bienestar Emocional", componente: <VistaEmocional /> },
            { titulo: "Bienestar Nutricional", componente: <VistaNutricional /> },
          ]}
        />
      </div>

    </div>
  )
}

export default TarjetaAreas
