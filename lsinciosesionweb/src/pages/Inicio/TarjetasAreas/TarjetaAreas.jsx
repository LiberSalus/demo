import React from 'react'
import styles from './TarjetasAreas.module.css'
import PestañaSalud from './PestañaSalud'

import VistaTodos from './VistaTodos/VistaTodos'
import VistaFisica from './VistaFisica/VistaFisica'
import VistaSocial from './VistaSocial/VistaSocial'
import VistaEmocional from './VistaEmocional/VistaEmocional'
import VistaNutricional from './VistaNutricional/VistaNutricional'



const TarjetaAreas = () => {
  return (
    <div className={styles.cntTarjetaAreas}>
      <h3>Áreas de la salud</h3>

      <div className={styles.cntPestañas}>

        <PestañaSalud
          tabs={[
            { titulo: "Todos", componente: <VistaTodos />, estilo: styles.todos },
            { titulo: "Bienestar Físico", componente: <VistaFisica />, estilo: styles.fisica },
            { titulo: "Bienestar Emocional", componente: <VistaEmocional />, estilo: styles.emocional },
            { titulo: "Bienestar Social", componente: <VistaSocial />, estilo: styles.social },
            { titulo: "Bienestar Nutricional", componente: <VistaNutricional />,  estilo: styles.nutricional },
          ]}
        />
      </div>

    </div>
  )
}

export default TarjetaAreas
