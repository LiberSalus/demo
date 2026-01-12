// src/pages/SaludFisica/Oxigenacion/ModalDescargaOxigenacion.jsx
import React, { useState, useEffect } from "react";
import styles from "./ModalDescargaOxigenacion.module.css";
import Reporte from "../../../components/Reporte/Reporte";
import { METRIC_OXIGENACION } from "../../../components/Reporte/metricas";

const ModalDescargaOxigenacion = ({ abierto, onClose }) => {
  const [paso, setPaso] = useState("selector"); // "selector" | "tabla"
  const [periodo, setPeriodo] = useState("3m");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("2025-10-21");

  useEffect(() => {
    const cleanup = () => document.body.classList.remove("print-oxi");
    window.addEventListener("afterprint", cleanup);
    return () => window.removeEventListener("afterprint", cleanup);
  }, []);

  const handlePrint = () => {
    document.body.classList.add("print-oxi");
    // pequeño delay para que el navegador aplique el CSS antes de imprimir
    setTimeout(() => window.print(), 50);
  };

  const perfilMock = {
    nombre: "Usuario1",
    sexo: "—",
    edad: 28,
    usuario: "US001",
    padecimiento: "—",
  };

  const rowsMock = [
    { fecha: "21 Oct 2025", hora: "07:10 am", valor: 94, estado: "Normal" },
    { fecha: "21 Oct 2025", hora: "12:30 pm", valor: 90, estado: "Baja" },
    { fecha: "20 Oct 2025", hora: "09:20 pm", valor: 96, estado: "Normal" },
    { fecha: "19 Oct 2025", hora: "06:05 am", valor: 84, estado: "Baja" },
  ];

  if (!abierto) return null;

  const handleCerrar = () => {
    setPaso("selector");
    setPeriodo("3m");
    onClose();
  };

  const handleVerRegistros = (e) => {
    e.preventDefault();
    setPaso("tabla");
  };

  const handleVolver = () => setPaso("selector");

  const tituloModal =
    paso === "selector" ? "Descarga tus registros" : "Registros de oxigenación";

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${paso === "tabla" ? styles.modalWide : ""}`}>
        <header className={styles.headerModal}>
          <div className={styles.titulos}>
            {paso === "tabla" && (
              <button
                type="button"
                className={styles.btnVolver}
                onClick={handleVolver}
              >
                ←
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

        {paso === "selector" && (
          <form className={styles.form} onSubmit={handleVerRegistros}>
            <p className={styles.descripcion}>
              Elige el periodo de tiempo del que deseas obtener tus registros de
              oxigenación. Podrás descargar o imprimir el formato.
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

        {paso === "tabla" && (
          <div className={styles.contenedorTabla}>
            <div className={styles.toolbarTabla}>
              <button
                type="button"
                className={styles.btnImprimir}
                onClick={() => handlePrint()}
              >
                Imprimir / Guardar PDF
              </button>
            </div>

            <div className={`printArea ${styles.printArea}`}>
              <Reporte
                perfil={perfilMock}
                metric={METRIC_OXIGENACION}
                rows={rowsMock}
                fechaGeneracion={new Date()}
                showToolbar={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDescargaOxigenacion;
