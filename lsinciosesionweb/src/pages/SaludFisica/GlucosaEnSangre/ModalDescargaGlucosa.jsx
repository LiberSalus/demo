// src/components/Glucosa/ModalDescargaGlucosa.jsx
import React, { useState } from "react";
import styles from "./ModalDescargaGlucosa.module.css";
import RegistrosGlucosa from "./RegistroGlucosa";

import regresar from './icoIzquierda.svg'

const ModalDescargaGlucosa = ({ abierto, onClose, modo = "ayunas" }) => {
  const [paso, setPaso] = useState("selector"); // "selector" | "tabla"
  const [periodo, setPeriodo] = useState("3m");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("2025-12-05");

  // ⭐ nuevo: modo que se está viendo en la tabla
  const [modoVista, setModoVista] = useState(modo); // "ayunas" | "comida"

  if (!abierto) return null;

  const handleDescargar = (e) => {
    e.preventDefault();
    setPaso("tabla");
  };

  const handleCerrar = () => {
    setPaso("selector");
    setModoVista(modo); // ⭐ volvemos al modo inicial al cerrar
    onClose();
  };

  const handleVolver = () => {
    setPaso("selector");
  };

  const tituloModal =
    paso === "selector"
      ? "Descarga tus registros"
      : "Registros de glucosa en sangre";

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <header className={styles.headerModal}>
          <div className={styles.titulos}>
            {paso === "tabla" && (
              <button
                type="button"
                className={styles.btnVolver}
                onClick={handleVolver}
              >
                <img src={regresar} alt="regresar"></img>
              </button>
            )}
            <h2 className={styles.titulo}>{tituloModal}</h2>
          </div>

          <button
            className={styles.cerrar}
            type="button"
            onClick={handleCerrar}
          >
            ✕
          </button>
        </header>

        {/* Paso 1: selector */}
        {paso === "selector" && (
          <form className={styles.form} onSubmit={handleDescargar}>
            <p className={styles.descripcion}>
              Elige el periodo de tiempo del que deseas obtener tus registros de
              glucosa en sangre. Podrás descargar o imprimir el formato.
            </p>

            <label className={styles.opcion}>
              <input
                type="radio"
                name="periodo"
                value="3m"
                checked={periodo === "3m"}
                onChange={(e) => setPeriodo(e.target.value)}
              />
              Últimos 3 meses
            </label>

            <label className={styles.opcion}>
              <input
                type="radio"
                name="periodo"
                value="6m"
                checked={periodo === "6m"}
                onChange={(e) => setPeriodo(e.target.value)}
              />
              Últimos 6 meses
            </label>

            <label className={styles.opcion}>
              <input
                type="radio"
                name="periodo"
                value="fecha"
                checked={periodo === "fecha"}
                onChange={(e) => setPeriodo(e.target.value)}
              />
              Selecciona una fecha específica
            </label>

            {periodo === "fecha" && (
              <div className={styles.campoFecha}>
                <span>Fecha a partir de:</span>
                <input
                  type="date"
                  value={fechaSeleccionada}
                  onChange={(e) => setFechaSeleccionada(e.target.value)}
                />
              </div>
            )}

            <div className={styles.cntBotones}>
              <button
                type="button"
                className={styles.btnSecundario}
                onClick={handleCerrar}
              >
                Cancelar
              </button>
              <button type="submit" className={styles.botonDescargar}>
                Ver registros
              </button>
            </div>
          </form>
        )}

        {/* Paso 2: tabla */}
        {paso === "tabla" && (
          <div className={styles.contenedorTabla}>
            {/* ⭐ Tabs internos para Ayunas / Comida */}
            <div className={styles.tabsModo}>
              <button
                type="button"
                className={`${styles.tabModo} ${
                  modoVista === "ayunas" ? styles.tabModoActiva : ""
                }`}
                onClick={() => setModoVista("ayunas")}
              >
                En ayunas
              </button>
              <button
                type="button"
                className={`${styles.tabModo} ${
                  modoVista === "comida" ? styles.tabModoActiva : ""
                }`}
                onClick={() => setModoVista("comida")}
              >
                Después de comer
              </button>
            </div>

            <RegistrosGlucosa
              modo={modoVista}           // ⭐ aquí usamos el modo de la vista
              periodo={periodo}
              fecha={fechaSeleccionada}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDescargaGlucosa;
