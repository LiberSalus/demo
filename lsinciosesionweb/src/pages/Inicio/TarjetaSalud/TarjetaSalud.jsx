import React, { useState } from "react";
import styles from "./TarjetaSalud.module.css";
import TarjetaMedicion from "./TarjetaMedicion/TarjetaMedicion";

import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";

import mental from "./icoBienMental.svg";
import fisica from "./icoBienFisico.svg";
import nutricional from "./icoBienNutri.svg";
import config from "./icoConfig.svg";
import añadir from "./icoAnadir.svg";

import Modal from "react-modal";

const TarjetaSalud = ({ tipo }) => {
  const [modalAbierto, setModalAbierto] = React.useState(false);
  const [tarjetas, setTarjetas] = React.useState([]);
  const [rango, setRango] = useState(50);
  const [seleccionadas, setSeleccionadas] = useState([]);

  const salud = {
    "Salud Física": { tituloTrj: "Salud Física", iconoTrj: fisica },
    "Salud Mental": { tituloTrj: "Salud Mental", iconoTrj: mental },
    "Salud Nutricional": {
      tituloTrj: "Salud Nutricional",
      iconoTrj: nutricional,
    },
  };
  const { tituloTrj, iconoTrj } = salud[tipo] || {};

  const frase = {
    "Salud Física": "Moverte un poco más cada día hace la diferencia.",
    "Salud Mental": "Tu bienestar emocional también merece atención.",
    "Salud Nutricional":
      "Un poco más de equilibrio en tu dieta marcará la diferencia.",
  };

  const catalogoMetricas = [
    "Peso",
    "Pasos",
    "Estrés",
    "Energía",
    "Calorías",
    "Descanso",
    "Hidratación",
    "Oxigenación",
    "Presión arterial",
    "Glucosa en sangre",
    "Frecuencia cardiaca",
  ];

  const BotonAñadir = () => (
    <div className={styles.contenedor} onClick={() => setModalAbierto(true)}>
      <img className={styles.añadir} src={añadir} />
      <p>Añadir</p>
    </div>
  );
  
  const ModalMetricas = () => (
    <Modal
    isOpen={modalAbierto}
    onRequestClose={() => setModalAbierto(false)}
    className={styles.modalContenido}
    overlayClassName={styles.modalFondo}
    >

      <h3 className={styles.mdTit}>Personaliza tu panel de <br/> Salud Física</h3>
      <p className={styles.mdIns}>Elige hasta 4 indicadores para ver en tu pantalla principal</p>
      <p className={styles.mdActivos}>Tus indicadores activos ({seleccionadas.length}/4)</p>
      <div className={styles.seleccionadas}>
        {seleccionadas.map((titulo, i) => (
          <div key={i} className={styles.itemSeleccionado}>
            <TarjetaMedicion titulo={titulo} valor={"--"} />
            <button
              onClick={() => {
                setSeleccionadas(seleccionadas.filter((t) => t !== titulo));
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      
      <h3>Selecciona tus indicadores</h3>
      <div className={styles.catalogoTarjetas}>
        {catalogoMetricas.map((m, i) => (
          <div
            key={i}
            className={styles.itemCatalogo}
            onClick={() => {
              if (seleccionadas.length < 4 && !seleccionadas.includes(m)) {
                setSeleccionadas([...seleccionadas, m]);
              }
            }}
          >
            <TarjetaMedicion titulo={m} valor={"--"} />
          </div>
        ))}
      </div>
      {seleccionadas.length >= 4 && (
        <p className={styles.limite}>Has alcanzado el máximo de métricas.</p>
      )}
      <button
        className={styles.confirmar}
        disabled={seleccionadas.length === 0}
        onClick={() => {
          setTarjetas(seleccionadas);
          setModalAbierto(false);
        }}
      >
        Confirmar selección
      </button>
    </Modal>
  );

  return (
    <div className={styles.cntTarjetaSalud}>
      <div className={styles.encabezado}>
        <h3 className={styles.titulo}>{tituloTrj}</h3>
        <img src={iconoTrj} alt={tituloTrj} />
        <img
          src={config}
          alt="configuración de tarjeta"
          onClick={() => setModalAbierto(true)}
        />
      </div>

      <div className={styles.cntWds}>
        <div className={styles.cntTarjetas}>
          {tarjetas.map((titulo, i) => (
            <TarjetaMedicion key={i} titulo={titulo} valor={"118/68"} />
          ))}
          {tarjetas.length < 4 && <BotonAñadir />}
        </div>
      </div>

      <input
        className={styles.rango}
        type="range"
        min={0}
        max={100}
        value={rango}
        onChange={(e) => setRango(e.target.value)}
      />

      <ModalMetricas />
      <p className={styles.frase}>¡Buen ritmo, sigue cuidando tu descanso!</p>
    </div>
  );
};

export default TarjetaSalud;

/*  TarjetaCategoria__  representa la configuración de botones en
    el dashboard principal de salud, cada tarjeta tiene un conjunto
    de mediciones asociadas que se muestran en forma de tarjetas
    individuales.
    Props:
    - titulo: El título de la categoría de salud (e.g., "Salud Física").
    - icono: El icono representativo de la categoría.
    - mediciones: Un array de objetos que representan las mediciones
      asociadas a la categoría. Cada objeto debe tener:
        - titulo: El título de la medición (e.g., "Peso", "Pasos").
        - valor: El valor actual de la medición (e.g., "70", "5000").
    - nota: Una nota adicional o mensaje relacionado con la categoría.

    componentes utilizados:
    - TarjetaMedicion: Componente que representa una medición individual
*/
