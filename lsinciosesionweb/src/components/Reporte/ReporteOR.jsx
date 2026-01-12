import React from "react";
import styles from "./ReporteOR.module.css";
import glucoAyunas from "../data/glucoAyunas";

import logo from "./Logo.svg";
import paloma from "./icoVerdePaloma.svg";
import rojoAbajo from "./icoRojoAbajo.svg";
import rojoArriba from "./icoRojoArriba.svg";
import doradoArriba from "./icoDoradoArriba.svg";
import doradoAbajo from "./icoDoradoAbajo.svg";
import naranjaAbajo from "./icoNaranjaAbajo.svg";



const reportePerfil = {
  sexo: "Hombre",
  edad: 35,
  hora: "04.52 PM",
  tipo: "Ayunas",
  fecha: "05-Diciembre-2025",
  vacio: "ㅤㅤ",
  nombre: "Alex Velázquez",
  usuario: "AL210691",
  reporte: "Glucosa en Sangre",
  padecimineto: "-- --",
};

const reporteDatos = {};

const Reporte = () => {
  return (
    <div className={styles.Reporte}>
      <img src={logo} alt="LiberSalus" className={styles.logo}></img>
      <div className={styles.header}>
        <div className={styles.Izq}>
          <div className={styles.datIz}>
            <p>Nombre:</p>
            <p>Sexo:</p>
            <p>Edad:</p>
            <p>Usuario:</p>
          </div>
          <div className={styles.val}>
            <p>{reportePerfil.nombre}</p>
            <p>{reportePerfil.sexo}</p>
            <p>{reportePerfil.edad} años</p>
            <p>{reportePerfil.usuario}</p>
          </div>
        </div>
        <div className={styles.Der}>
          <div className={styles.datDr}>
            <p>Fecha:</p>
            <p>Hora:</p>
            <p>ㅤㅤ</p>
            <p>Padecimiento:</p>
          </div>
          <div className={styles.val}>
            <p>{reportePerfil.fecha}</p>
            <p>{reportePerfil.hora}</p>
            <p>{reportePerfil.vacio} </p>
            <p>{reportePerfil.padecimineto}</p>
          </div>
        </div>
        {/* <div className={styles.nombreReporte}>
          <p className={styles.Name}>
            <strong>{reportePerfil.reporte}</strong> ({reportePerfil.tipo})
          </p>
        </div> */}
      </div>

      {/* Oxigenación en Sangre */}

      <div className={styles.tipoReporte}>
        <p>Oxigenación en sangre</p>
      </div>
      <div className={styles.tabla}>
        <div className={styles.oxigenacion}>
          <p>Fecha</p>
          <p>Hora</p>
          <p>&lt;85</p>
          <p>86-89</p>
          <p>90-94</p>
          <p>95-100</p>
          <p>Nivel</p>
          <p>Estado</p>
        </div>
        <div className={styles.filasOxigenacion}>
          <p>08 Dic 2025</p>
          <p>07:18 am</p>
          <span>
            <img src={rojoAbajo}></img>
          </span>
          <span>
            <img src={naranjaAbajo}></img>
          </span>
          <span>
            <img src={doradoAbajo}></img>
          </span>
          <span>
            <img src={paloma}></img>
          </span>
          <p>95 %</p>
          <p>Normal</p>
        </div>
        <div className={styles.filasOxigenacion}>
          <p>08 Dic 2025</p>
          <p>07:18 am</p>
          <span>
            <img src={rojoAbajo}></img>
          </span>
          <span>
            <img src={naranjaAbajo}></img>
          </span>
          <span>
            <img src={doradoAbajo}></img>
          </span>
          <span>
            <img src={paloma}></img>
          </span>
          <p>95 %</p>
          <p>Normal</p>
        </div>
        <div className={styles.filasOxigenacion}>
          <p>08 Dic 2025</p>
          <p>07:18 am</p>
          <span>
            <img src={rojoAbajo}></img>
          </span>
          <span>
            <img src={naranjaAbajo}></img>
          </span>
          <span>
            <img src={doradoAbajo}></img>
          </span>
          <span>
            <img src={paloma}></img>
          </span>
          <p>95 %</p>
          <p>Normal</p>
        </div>
        <div className={styles.filasOxigenacion}>
          <p>08 Dic 2025</p>
          <p>07:18 am</p>
          <span>
            <img src={rojoAbajo}></img>
          </span>
          <span>
            <img src={naranjaAbajo}></img>
          </span>
          <span>
            <img src={doradoAbajo}></img>
          </span>
          <span>
            <img src={paloma}></img>
          </span>
          <p>95 %</p>
          <p>Normal</p>
        </div>
      </div>

      {/* Glucosa Ayunas */}

      <div className={styles.tipoReporte}>
        <p>Glucosa en sangre (Ayunas)</p>
      </div>
      <div className={styles.tabla}>
        <div className={styles.glucosa}>
          <p>Fecha</p>
          <p>Hora</p>
          <p>&lt;60</p>
          <p>70-100</p>
          <p>100-125</p>
          <p>&gt;125</p>
          <p>Nivel</p>
          <p>Estado</p>
        </div>
        <div className={styles.filasGlucosa}>
          <p>08 Dic 2025</p>
          <p>07:18 am</p>
          <span>
            <img src={rojoAbajo}></img>
          </span>
          <span>
            <img src={paloma}></img>
          </span>
          <span>
            <img src={doradoArriba}></img>
          </span>
          <span>
            <img src={rojoArriba}></img>
          </span>
          <p>95 mg/dL</p>
          <p>Normal</p>
        </div>
        <div className={styles.filasGlucosa}>
          <p>08 Dic 2025</p>
          <p>07:18 am</p>
          <span>
            <img src={rojoAbajo}></img>
          </span>
          <span>
            <img src={paloma}></img>
          </span>
          <span>
            <img src={doradoArriba}></img>
          </span>
          <span>
            <img src={rojoArriba}></img>
          </span>
          <p>95 mg/dL</p>
          <p>Normal</p>
        </div>
        
      </div>


      {/* Glucosa Despues de comer */}

      <div className={styles.tipoReporte}>
        <p>Glucosa en sangre (Despues de comer)</p>
      </div>
      <div className={styles.tabla}>
        <div className={styles.glucosa}>
          <p>Fecha</p>
          <p>Hora</p>
          <p>&lt;60</p>
          <p>70-140</p>
          <p>140-199</p>
          <p>&gt;200</p>
          <p>Nivel</p>
          <p>Estado</p>
        </div>
        <div className={styles.filasGlucosa}>
          <p>08 Dic 2025</p>
          <p>07:18 am</p>
          <span>
            <img src={rojoAbajo}></img>
          </span>
          <span>
            <img src={paloma}></img>
          </span>
          <span>
            <img src={doradoArriba}></img>
          </span>
          <span>
            <img src={rojoArriba}></img>
          </span>
          <p>95 mg/dL</p>
          <p>Normal</p>
        </div>
        <div className={styles.filasGlucosa}>
          <p>08 Dic 2025</p>
          <p>07:18 am</p>
          <span>
            <img src={rojoAbajo}></img>
          </span>
          <span>
            <img src={paloma}></img>
          </span>
          <span>
            <img src={doradoArriba}></img>
          </span>
          <span>
            <img src={rojoArriba}></img>
          </span>
          <p>95 mg/dL</p>
          <p>Normal</p>
        </div>
        
      </div>


      {/* Frecuencia cardiaca */}
      <div className={styles.tipoReporte}>
        <p>Frecuencia cardiaca</p>
      </div>
      <div className={styles.tabla}>
        <div className={styles.frecuencia}>
          <p>Fecha</p>
          <p>Hora</p>
          <p>&lt;80</p>
          <p>80-100</p>
          <p>&gt;100</p>
          <p>Nivel</p>
          <p>Estado</p>
        </div>
        <div className={styles.filasFrecuencia}>
          <p>08 Dic 2025</p>
          <p>07:18 am</p>
          <span>
            <img src={rojoAbajo}></img>
          </span>
          <span>
            <img src={paloma}></img>
          </span>
          <span>
            <img src={rojoArriba}></img>
          </span>
          <p>95 ppm</p>
          <p>Normal</p>
        </div>
        <div className={styles.filasFrecuencia}>
          <p>08 Dic 2025</p>
          <p>07:18 am</p>
          <span>
            <img src={rojoAbajo}></img>
          </span>
          <span>
            <img src={paloma}></img>
          </span>
          <span>
            <img src={rojoArriba}></img>
          </span>
          <p>95 ppm</p>
          <p>Normal</p>
        </div>
        
      </div>
      
      
      {/* Presion Arterial */}
      <div className={styles.tipoReporte}>
        <p>Presión Arterial</p>
      </div>
      <div className={styles.tabla}>
        <div className={styles.presion}>
          <p>Fecha</p>
          <p>Hora</p>
          <p>Sistólica</p>
          <p>Diastólica</p>
          <p>Estado</p>
        </div>
        <div className={styles.filasPresion}>
          <p>08 Dic 2025</p>
          <p>07:18 am</p>
          <p>115 mmHg</p>
          <p>69 mmHg</p>
          <p>Normal</p>
        </div>
        <div className={styles.filasPresion}>
          <p>08 Dic 2025</p>
          <p>07:18 am</p>
          <p>120 mmHg</p>
          <p>76 mmHg</p>
          <p>Normal</p>
        </div>
        
      </div>
      <div className={styles.pie}>
        <p>El original de este documento se encuentra en los archivos de Liber Salus S.A. de C.V. Pr lo que el mal uso del mismo es responsabilidad del paciente.</p>
      </div>
    </div>
  );
};

export default Reporte;
