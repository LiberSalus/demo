//src\pages\Inicio\TarjetaSalud\TarjetaSalud.jsx
import "gridstack/dist/gridstack.min.css";
import Modal from "react-modal";
import config from "./icoConfig.svg";
import añadir from "./icoAnadir.svg";
import mental from "./icoBienMental.svg";
import fisica from "./icoBienFisico.svg";
import styles from "./TarjetaSalud.module.css";
import { ROUTES } from "@/config/routes";
import nutricional from "./icoBienNutri.svg";
import { useNavigate } from "react-router-dom";
import TarjetaMedicion from "./TarjetaMedicion/TarjetaMedicion";
import React, { useMemo, useState, useEffect } from "react";
import { AREAS_METRICAS } from "@/features/metricas/config/areas.config";
import { METRICAS_V2 } from "@/features/metricas/config/metricas.config";

import eliminar from './icoEliminar.svg'

const AREAS_POR_TIPO = {
  "Salud Física": AREAS_METRICAS.SALUD_FISICA,
  "Salud Mental": AREAS_METRICAS.SALUD_MENTAL,
  "Salud Nutricional": AREAS_METRICAS.SALUD_NUTRICIONAL,
};

// Normaliza textos visibles para empatar selecciones guardadas antes del registro v2.
function normalizarTextoMetrica(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Devuelve las metricas del area en el orden configurado para el registro nuevo.
function obtenerCatalogoMetricas(tipo) {
  const area = AREAS_POR_TIPO[tipo];
  if (!area) return [];

  return METRICAS_V2.filter((metrica) => metrica.area === area).sort(
    (actual, siguiente) => actual.orden - siguiente.orden
  );
}

// Convierte ids actuales o textos legacy guardados en localStorage a objetos de metrica.
function obtenerMetricasSeleccionadas(valoresGuardados = [], catalogo = []) {
  return valoresGuardados
    .map((valor) => {
      const textoNormalizado = normalizarTextoMetrica(valor);

      return catalogo.find(
        (metrica) =>
          metrica.id === valor ||
          normalizarTextoMetrica(metrica.label) === textoNormalizado
      );
    })
    .filter(Boolean);
}

const TarjetaSalud = ({ tipo }) => {
  
  const navigate = useNavigate();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [tarjetas, setTarjetas] = useState([]);
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
  const catalogoMetricas = useMemo(() => obtenerCatalogoMetricas(tipo), [tipo]);
  
  useEffect(() => {
    if (!storageKey) return;
    
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        const metricasGuardadas = obtenerMetricasSeleccionadas(arr, catalogoMetricas);
        const idsGuardados = metricasGuardadas.map((metrica) => metrica.id);

        setTarjetas(idsGuardados);
        setSeleccionadas(idsGuardados); // para que tambien aparezcan como seleccionadas en el modal
      }
    } catch (err) {
      console.error("Error leyendo métricas guardadas:", err);
    }
  }, [storageKey, catalogoMetricas]);
  

  // Abre el detalle correcto usando el id estable de la metrica.
  const irADetalle = (metricaId) => {
    if (tipo === "Salud Física") {
      navigate(
        `${ROUTES.SALUD_FISICA}?metric=${encodeURIComponent(metricaId)}`
      );
    } else if (tipo === "Salud Mental") {
      navigate(
        `${ROUTES.SALUD_MENTAL}?metric=${encodeURIComponent(metricaId)}`
      );
    } else if (tipo === "Salud Nutricional") {
      navigate(
        `${ROUTES.SALUD_NUTRICIONAL}?metric=${encodeURIComponent(metricaId)}`
      );
    }
  };


  

  

  const frasePorTipo = {
    "Salud Física": "Moverte un poco más cada día hace la diferencia.",
    "Salud Mental": "Tu bienestar emocional también merece atención.",
    "Salud Nutricional": "Un poco más de equilibrio en tu dieta marcará la diferencia.",
  };

  const placeholdersActivos = Array.from(
    { length: Math.max(0, 4 - seleccionadas.length) },
    (_, index) => `empty-${index}`,
  );

  // Muestra el acceso para abrir la seleccion de metricas del panel.
  const BotonAñadir = () => (
    <button type="button" className={styles.contenedor} onClick={() => setModalAbierto(true)}>
      <img className={styles.añadir} src={añadir} />
      <p>Añadir</p>
    </button>
  );

  // Renderiza el modal de personalizacion de indicadores para la tarjeta.
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
      <h3 className={styles.mdTit}>Personaliza tu panel de <br /> {tituloTrj}</h3>
      <p className={styles.mdIns}>Elige hasta 4 indicadores para ver en tu pantalla principal</p>
      <p className={styles.mdActivos}>Tus indicadores activos ({seleccionadas.length}/4)</p>
      <div className={styles.seleccionadas}>
        {seleccionadas.map((metricaId) => {
          const metrica = catalogoMetricas.find((item) => item.id === metricaId);

          return (
            <div key={metricaId} className={styles.itemSeleccionado}>
              <TarjetaMedicion titulo={metrica?.label || metricaId} valor={"--"} variant="modalMobile" />
              <button
                type="button"
                onClick={() => {
                  setSeleccionadas(seleccionadas.filter((id) => id !== metricaId));
                }}
              >
                <img src={eliminar} alt="eliminar" />
              </button>
            </div>
          );
        })}
        {placeholdersActivos.map((key) => (
          <div key={key} className={styles.slotVacio} aria-hidden="true" />
        ))}
      </div>


      <h3 className={styles.mdCatalogoTit}>Selecciona tus indicadores</h3>
      <div className={styles.catalogoTarjetas}>
        {catalogoMetricas.map((metrica) => (
          <button
            type="button"
            key={metrica.id}
            className={styles.itemCatalogo}
            onClick={() => {
              if (seleccionadas.length < 4 && !seleccionadas.includes(metrica.id)) {
                setSeleccionadas([...seleccionadas, metrica.id]);
              }
            }}
          >
            <TarjetaMedicion titulo={metrica.label} valor={"--"} variant="modalMobile" />
          </button>
        ))}
      </div>
      {seleccionadas.length >= 4 && (
        <p className={styles.limite}>Has alcanzado el máximo de métricas.</p>
      )}
      <button
        type="button"
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
          {tarjetas.map((metricaId) => {
            const metrica = catalogoMetricas.find((item) => item.id === metricaId);

            return (
              <button
                key={metricaId}
                type="button"
                className={styles.botonTarjeta}
                onClick={() => irADetalle(metricaId)}
              >
                <TarjetaMedicion titulo={metrica?.label || metricaId} valor={"118/68"} />
              </button>
            );
          })}

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
