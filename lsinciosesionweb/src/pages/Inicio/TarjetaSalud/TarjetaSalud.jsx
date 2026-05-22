//src\pages\Inicio\TarjetaSalud\TarjetaSalud.jsx
import "gridstack/dist/gridstack.min.css";
import Modal from "react-modal";
import config from "./icoConfig.svg";
import añadir from "./icoAnadir.svg";
import mental from "./icoBienMental.svg";
import fisica from "./icoBienFisico.svg";
import styles from "./TarjetaSalud.module.css";
import { ROUTES } from "@/config/routes"
import nutricional from "./icoBienNutri.svg";
import { useNavigate } from "react-router-dom";
import TarjetaMedicion from "./TarjetaMedicion/TarjetaMedicion";
import React, { useState, useEffect } from "react";
import { METRICAS_SALUD } from "@/config/metricasSalud";

import eliminar from './icoEliminar.svg'


const TarjetaSalud = ({ tipo }) => {
  
  const navigate = useNavigate();

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
  
  const STORAGE_KEYS = {
    "Salud Física": "ls_panel_salud_fisica",
    "Salud Mental": "ls_panel_salud_mental",
    "Salud Nutricional": "ls_panel_salud_nutricional",
  };
  
  const storageKey = STORAGE_KEYS[tipo];
  
  useEffect(() => {
    if (!storageKey) return;
    
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        setTarjetas(arr);
        setSeleccionadas(arr); // para que también aparezcan como seleccionadas en el modal
      }
    } catch (err) {
      console.error("Error leyendo métricas guardadas:", err);
    }
  }, [storageKey]);
  

  //  decide a qué ruta ir según el tipo
  const irADetalle = (metrica) => {
    if (tipo === "Salud Física") {
      navigate(
        `${ROUTES.SALUD_FISICA}?metric=${encodeURIComponent(metrica)}`
      );
    } else if (tipo === "Salud Mental") {
      navigate(
        `${ROUTES.SALUD_MENTAL}?metric=${encodeURIComponent(metrica)}`
      );
    } else if (tipo === "Salud Nutricional") {
      navigate(
        `${ROUTES.SALUD_NUTRICIONAL}?metric=${encodeURIComponent(metrica)}`
      );
    }
  };


  

  

  const frasePorTipo = {
    "Salud Física": "Moverte un poco más cada día hace la diferencia.",
    "Salud Mental": "Tu bienestar emocional también merece atención.",
    "Salud Nutricional": "Un poco más de equilibrio en tu dieta marcará la diferencia.",
  };

  const catalogoMetricas = METRICAS_SALUD[tipo] || [];
  const placeholdersActivos = Array.from(
    { length: Math.max(0, 4 - seleccionadas.length) },
    (_, index) => `empty-${index}`,
  );

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
      <button
        type="button"
        className={styles.modalCerrar}
        onClick={() => setModalAbierto(false)}
        aria-label="Cerrar modal de personalización"
      >
        ×
      </button>
      <h3 className={styles.mdTit}>Personaliza tu panel de <br /> Salud Física</h3>
      <p className={styles.mdIns}>Elige hasta 4 indicadores para ver en tu pantalla principal</p>
      <p className={styles.mdActivos}>Tus indicadores activos ({seleccionadas.length}/4)</p>
      <div className={styles.seleccionadas}>
        {seleccionadas.map((titulo, i) => (
          <div key={i} className={styles.itemSeleccionado}>
            <TarjetaMedicion titulo={titulo} valor={"--"} variant="modalMobile" />
            <button
            
              onClick={() => {
                setSeleccionadas(seleccionadas.filter((t) => t !== titulo));
              }}
            >
              <img src={eliminar} alt="eliminar"></img>
            </button>
          </div>
        ))}
        {placeholdersActivos.map((key) => (
          <div key={key} className={styles.slotVacio} aria-hidden="true" />
        ))}
      </div>


      <h3 className={styles.mdCatalogoTit}>Selecciona tus indicadores</h3>
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
            <TarjetaMedicion titulo={m} valor={"--"} variant="modalMobile" />
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
          if (storageKey) {
            try {
              localStorage.setItem(storageKey, JSON.stringify(seleccionadas));
            } catch (err) {
              console.error("Error guardando métricas:", err);
            }
          }
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
            <button
              key={i}
              type="button"
              className={styles.botonTarjeta}   // crea la clase si quieres estilos
              onClick={() => irADetalle(titulo)}
            >
              <TarjetaMedicion titulo={titulo} valor={"118/68"} />
            </button>
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
      <p className={styles.frase}>{frasePorTipo[tipo]}</p>
    </div>
  );
};

export default TarjetaSalud;
