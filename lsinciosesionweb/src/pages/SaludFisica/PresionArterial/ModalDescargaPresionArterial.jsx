// src/pages/SaludFisica/PresionArterial/ModalDescargaPresionArterial.jsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "./ModalDescargaPresionArterial.module.css";

import Reporte from "@/components/Reporte/Reporte";
import { METRIC_PRESION } from "@/components/Reporte/metricas";

const ModalDescargaPresionArterial = ({ abierto, onClose }) => {
  const [paso, setPaso] = useState("selector"); // "selector" | "tabla"
  const [periodo, setPeriodo] = useState("3m"); // "3m" | "6m" | "fecha"
  const [fechaSeleccionada, setFechaSeleccionada] = useState("2025-10-21");

  // ✅ Limpieza de modo impresión
  useEffect(() => {
    const cleanup = () => document.body.classList.remove("print-pa");
    window.addEventListener("afterprint", cleanup);
    return () => {
      cleanup();
      window.removeEventListener("afterprint", cleanup);
    };
  }, []);

  const handlePrint = () => {
    document.body.classList.add("print-pa");
    setTimeout(() => window.print(), 50);
  };

  const handleCerrar = () => {
    setPaso("selector");
    setPeriodo("3m");
    setFechaSeleccionada("2025-10-21");
    onClose?.();
  };

  const handleVerRegistros = (e) => {
    e.preventDefault();
    setPaso("tabla");
  };

  const tituloModal =
    paso === "selector" ? "Descarga tus registros" : "Registros de presión arterial";

  // ✅ MOCK perfil (luego lo conectas al back)
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

  /**
   * ✅ MOCK rows para Reporte
   * NOTA: Reporte actual usa: {fecha, hora, valor, estado}
   * Para presión arterial necesitamos mostrar "sistólica/diastólica"
   * Entonces aquí mandamos "valor" como STRING formateado y mantenemos "estado".
   * (Luego lo formalizamos cuando diseño defina formato final)
   */
  const rowsMock = useMemo(
    () => [
      { fecha: "21 Oct 2025", hora: "07:10 am", valor: "118/78", estado: "Normal" },
      { fecha: "21 Oct 2025", hora: "12:30 pm", valor: "142/92", estado: "Alta" },
      { fecha: "20 Oct 2025", hora: "09:20 pm", valor: "126/85", estado: "Normal" },
      { fecha: "19 Oct 2025", hora: "06:05 am", valor: "150/98", estado: "Alta" },
    ],
    []
  );

  // ✅ Render condicional al final (evita error de hooks)
  return !abierto ? null : (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${paso === "tabla" ? styles.modalWide : ""}`}>
        <header className={styles.headerModal}>
          <div className={styles.titulos}>
            {paso === "tabla" && (
              <button
                type="button"
                className={styles.btnVolver}
                onClick={() => setPaso("selector")}
              >
                ←
              </button>
            )}
            <h2 className={styles.titulo}>{tituloModal}</h2>
          </div>

          <button className={styles.cerrar} type="button" onClick={handleCerrar}>
            ✕
          </button>
        </header>

        {paso === "selector" && (
          <form className={styles.form} onSubmit={handleVerRegistros}>
            <p className={styles.descripcion}>
              Elige el periodo de tiempo del que deseas obtener tus registros de presión arterial.
              Podrás descargar o imprimir el formato.
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
                onClick={handlePrint}
              >
                Imprimir / Guardar PDF
              </button>
            </div>

            <div className={`printArea ${styles.printArea}`}>
              <Reporte
                perfil={perfilMock}
                metric={METRIC_PRESION}
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

export default ModalDescargaPresionArterial;
