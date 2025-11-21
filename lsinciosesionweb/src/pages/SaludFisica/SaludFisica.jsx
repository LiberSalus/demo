//mesat\src\components\SaludFisica\SaludFisica.jsx
import React from 'react'
import styles from './SaludFisica.module.css'
import PestañasFisica from './PestañasFisica'

import Oxigenacion from './Oxigenacion/Oxigenacion'
import CicloMenstrual from './CicloMenstrual/CicloMenstrual'
import PresionArterial from './PresionArterial/PresionArterial'
import GlucosaEnSangre from './GlucosaEnSangre/GlucosaEnSangre'
import ActividadFisica from './ActividadFisica/ActividadFisica'
import FrecuenciaCardiaca from './FrecuenciaCardiaca/FrecuenciaCardiaca'


const SaludFisica = () => {
  return (
    <div className={styles.SaludFisica}>
      <PestañasFisica 
        tabs={[
          {
            medidor:"Frecuencia Cardiaca",
            Component: FrecuenciaCardiaca,
          },
          {
            medidor:"Presión Arterial",
            Component: PresionArterial,
          },
          {
            medidor:"Oxigenación",
            Component: Oxigenacion,
          },
          {
            medidor:"Glucosa en Sangre",
            Component: GlucosaEnSangre,
          },
          {
            medidor:"Actividad Física",
            Component: ActividadFisica,
          },
          {
            medidor:"Ciclo Menstrual",
            Component: CicloMenstrual,
          },
        ]}
      
      />
    </div>
  )
}

export default SaludFisica;

