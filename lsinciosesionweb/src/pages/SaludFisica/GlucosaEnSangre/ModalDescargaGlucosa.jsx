// src/components/Glucosa/ModalDescargaGlucosa.jsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "./ModalDescargaGlucosa.module.css";

import Reporte from "@/components/Reporte/Reporte";
import {
  METRIC_GLUCO_AYUNAS,
  METRIC_GLUCO_COMIDA,
} from "@/components/Reporte/metricas";

/**
 * ModalDescargaGlucosa
 * Props:
 * - abierto: boolean
 * - onClose: function
 * - modo?: "ayunas" | "comida" (opcional; solo para valor inicial)
 */
const ModalDescargaGlucosa = ({ abierto, onClose, modo = "ayunas" }) => {
  const [paso, setPaso] = useState("selector"); // "selector" | "tabla"
  const [periodo, setPeriodo] = useState("3m"); // "3m" | "6m" | "fecha"
  const [fechaSeleccionada, setFechaSeleccionada] = useState("2025-10-21");

  // ✅ Selector del tipo de reporte dentro del modal
  const [tipoReporte, setTipoReporte] = useState(
    modo === "comida" ? "comida" : "ayunas"
  );

  // ✅ Limpieza de modo impresión
  useEffect(() => {
    const cleanup = () => document.body.classList.remove("print-glu");
    window.addEventListener("afterprint", cleanup);
    return () => {
      cleanup();
      window.removeEventListener("afterprint", cleanup);
    };
  }, []);

  // ✅ Si abren el modal con otro "modo" (opcional), sincroniza el default
  useEffect(() => {
    if (!abierto) return;
    setTipoReporte(modo === "comida" ? "comida" : "ayunas");
  }, [abierto, modo]);

  const metric = useMemo(() => {
    return tipoReporte === "comida" ? METRIC_GLUCO_COMIDA : METRIC_GLUCO_AYUNAS;
  }, [tipoReporte]);

  const tituloModal =
    paso === "selector" ? "Descarga tus registros" : "Registros de glucosa";

  const perfilMock = useMemo(
    () => ({
      nombre: "Usuario1",
      sexo: "—",
      edad: 28,
      usuario: "US001",
      padecimiento: "—",
    }),
    []
  );

  // ✅ MOCK rows según tipo de reporte
  const rowsMock = useMemo(() => {
    if (tipoReporte === "comida") {
      return [
        { fecha: "21 Oct 2025", hora: "07:10 am", lectura: 145, estado: "Normal" },
        { fecha: "21 Oct 2025", hora: "12:30 pm", lectura: 190, estado: "Alta" },
        { fecha: "20 Oct 2025", hora: "09:20 pm", lectura: 132, estado: "Normal" },
        { fecha: "19 Oct 2025", hora: "06:05 am", lectura: 210, estado: "Alta" },
      ];
    }
    // ayunas
    return [
      { fecha: "21 Oct 2025", hora: "07:10 am", lectura: 85, estado: "Normal" },
      { fecha: "21 Oct 2025", hora: "12:30 pm", lectura: 115, estado: "Normal" },
      { fecha: "20 Oct 2025", hora: "09:20 pm", lectura: 130, estado: "Alta" },
      { fecha: "19 Oct 2025", hora: "06:05 am", lectura: 58, estado: "Baja" },
    ];
  }, [tipoReporte]);

  const handlePrint = () => {
    document.body.classList.add("print-glu");
    setTimeout(() => window.print(), 50);
  };

  const resetState = () => {
    setPaso("selector");
    setPeriodo("3m");
    setFechaSeleccionada("2025-10-21");
    setTipoReporte(modo === "comida" ? "comida" : "ayunas");
  };

  const handleCerrar = () => {
    resetState();
    onClose?.();
  };

  const handleVolver = () => {
    setPaso("selector");
  };

  const handleVerRegistros = (e) => {
    e.preventDefault();
    setPaso("tabla");
  };

  // ✅ Cerrar con click afuera
  const handleClickOverlay = (e) => {
    // si hacen click en el overlay (y no adentro del modal)
    if (e.target === e.currentTarget) handleCerrar();
  };

  // ✅ Cerrar con ESC
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e) => {
      if (e.key === "Escape") handleCerrar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto]);

  // ✅ Render condicional AL FINAL (para no romper hooks)
  if (!abierto) return null;

  return (
    <div className={styles.overlay} onMouseDown={handleClickOverlay}>
      <div
        className={`${styles.modal} ${paso === "tabla" ? styles.modalWide : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className={styles.headerModal}>
          <div className={styles.titulos}>
            {paso === "tabla" && (
              <button
                type="button"
                className={styles.btnVolver}
                onClick={handleVolver}
                aria-label="Volver"
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
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        {paso === "selector" && (
          <form className={styles.form} onSubmit={handleVerRegistros}>
            <p className={styles.descripcion}>
              Elige el periodo de tiempo del que deseas obtener tus registros de
              glucosa. Podrás descargar o imprimir el formato.
            </p>

            {/* ✅ Switch Ayunas / Comida */}
            <div className={styles.switchRow}>
              <div className={styles.switchLabel}>
                <div className={styles.switchTitle}>Tipo de reporte</div>
                <div className={styles.switchHint}>
                  Selecciona si fue en ayunas o después de comer
                </div>
              </div>

              <div className={styles.segmented}>
                <button
                  type="button"
                  className={`${styles.segBtn} ${
                    tipoReporte === "ayunas" ? styles.segActive : ""
                  }`}
                  onClick={() => setTipoReporte("ayunas")}
                >
                  Ayunas
                </button>

                <button
                  type="button"
                  className={`${styles.segBtn} ${
                    tipoReporte === "comida" ? styles.segActive : ""
                  }`}
                  onClick={() => setTipoReporte("comida")}
                >
                  Después de comer
                </button>
              </div>
            </div>

            {/* Periodos */}
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
                onClick={handlePrint}
              >
                Imprimir / Guardar PDF
              </button>
            </div>

            <div className={`printArea ${styles.printArea}`}>
              <Reporte
                perfil={perfilMock}
                metric={metric}
                rows={rowsMock}
                fechaGeneracion={new Date()}
                showToolbar={false}
                periodo={periodo}
                fecha={fechaSeleccionada}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDescargaGlucosa;
