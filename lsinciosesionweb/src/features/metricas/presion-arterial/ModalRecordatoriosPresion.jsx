import { useMemo, useState } from "react";
import styles from "./ModalRecordatoriosPresion.module.css";
import icoMas from "./icoMas.svg";
import icoTrianguloData from "./icoTrianguloData.svg";
import {
  crearRecordatorioPresionVacio,
  formatearDiasRecordatorio,
  formatearHoraRecordatorio,
  obtenerEtiquetasDiasRecordatorio,
} from "./presionArterial.utils";

const incrementarHora = (valorActual, delta, minimo, maximo) => {
  const rango = maximo - minimo + 1;
  const offset = ((valorActual - minimo + delta) % rango + rango) % rango;
  return minimo + offset;
};

const ModalRecordatoriosPresion = ({
  recordatorios,
  onClose,
  onSave,
  onDelete,
  onToggle,
  titulo = "Mis recordatorios",
  heroTitle = "¡Es hora de cuidarte!",
  heroText = "No olvides tomarte la presión arterial y anotar tu resultado. Cada medición ayuda a cuidar tu salud.",
  editorCopy = "Elige los días y horarios en los que quieres recibir recordatorios para tomar tu presión.",
  note = "* Tus recordatorios aparecerán en la app y ahí mismo te avisaremos cuando sea hora de medir tu presión.",
  emptyMessage = "No tienes recordatorios configurados todavía.",
  addButtonLabel = "Añadir",
  saveButtonLabel = "Aceptar",
  deleteButtonLabel = "Eliminar recordatorio",
  idPrefix = "recordatorio-presion",
}) => {
  const [vista, setVista] = useState("lista");
  const [borrador, setBorrador] = useState(crearRecordatorioPresionVacio());
  const diasDisponibles = useMemo(() => obtenerEtiquetasDiasRecordatorio(), []);

  const abrirNuevo = () => {
    setBorrador({
      ...crearRecordatorioPresionVacio(),
      id: `${idPrefix}-${Date.now()}`,
    });
    setVista("editor");
  };

  const abrirEdicion = (recordatorio) => {
    setBorrador({ ...recordatorio });
    setVista("editor");
  };

  const volverALista = () => {
    setVista("lista");
    setBorrador(crearRecordatorioPresionVacio());
  };

  const actualizarBorrador = (cambios) => {
    setBorrador((actual) => ({ ...actual, ...cambios }));
  };

  const toggleDia = (indiceDia) => {
    setBorrador((actual) => {
      const existe = actual.days.includes(indiceDia);
      const days = existe
        ? actual.days.filter((day) => day !== indiceDia)
        : [...actual.days, indiceDia].sort((a, b) => a - b);

      return {
        ...actual,
        days: days.length ? days : actual.days,
      };
    });
  };

  const guardar = () => {
    if (!borrador.days?.length) return;
    onSave(borrador);
    volverALista();
  };

  const eliminar = () => {
    if (!borrador.id) return;
    onDelete(borrador.id);
    volverALista();
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        {vista === "lista" ? (
          <>
            <header className={styles.header}>
              <h3>{titulo}</h3>
              <button
                type="button"
                className={styles.iconButton}
                onClick={onClose}
                aria-label="Cerrar recordatorios"
              >
                ×
              </button>
            </header>

            <div className={styles.copyBlock}>
              <p className={styles.heroTitle}>{heroTitle}</p>
              <p className={styles.heroText}>{heroText}</p>
            </div>

            <div className={styles.listaPanel}>
              <div className={styles.lista}>
                {recordatorios.length ? (
                  recordatorios.map((recordatorio) => (
                    <button
                      key={recordatorio.id}
                      type="button"
                      className={styles.recordatorioCard}
                      onClick={() => abrirEdicion(recordatorio)}
                    >
                      <div className={styles.recordatorioInfo}>
                        <p className={styles.recordatorioHora}>
                          {formatearHoraRecordatorio(recordatorio)}
                        </p>
                        <p className={styles.recordatorioDias}>
                          {formatearDiasRecordatorio(recordatorio)}
                        </p>
                      </div>

                      <span
                        className={`${styles.toggle} ${
                          recordatorio.enabled ? styles.toggleOn : ""
                        }`}
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggle(recordatorio.id);
                        }}
                        role="switch"
                        aria-checked={recordatorio.enabled}
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onToggle(recordatorio.id);
                          }
                        }}
                      >
                        <span className={styles.toggleThumb}></span>
                      </span>
                    </button>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <p>{emptyMessage}</p>
                  </div>
                )}
              </div>

              <div className={styles.listaFooter}>
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={abrirNuevo}
                >
                  <span className={styles.addIcon}>
                    <img src={icoMas} alt="" aria-hidden="true" />
                  </span>
                  {addButtonLabel}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <header className={styles.header}>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.iconChevron}`}
                onClick={volverALista}
                aria-label="Volver"
              />
              <h3>{titulo}</h3>
              <button
                type="button"
                className={styles.iconButton}
                onClick={onClose}
                aria-label="Cerrar recordatorios"
              >
                ×
              </button>
            </header>

            <p className={styles.editorCopy}>{editorCopy}</p>

            <section className={styles.section}>
              <h4>Hora:</h4>
              <div className={styles.timePicker}>
                <div className={styles.timeColumn}>
                  <button
                    type="button"
                    className={`${styles.timeArrow} ${styles.timeArrowUp}`}
                    onClick={() =>
                      actualizarBorrador({
                        hour: incrementarHora(borrador.hour, 1, 1, 12),
                      })
                    }
                  >
                    <img src={icoTrianguloData} alt="" aria-hidden="true" />
                  </button>
                  <div className={styles.timeValue}>
                    {String(borrador.hour).padStart(2, "0")}
                  </div>
                  <button
                    type="button"
                    className={`${styles.timeArrow} ${styles.timeArrowDown}`}
                    onClick={() =>
                      actualizarBorrador({
                        hour: incrementarHora(borrador.hour, -1, 1, 12),
                      })
                    }
                  >
                    <img src={icoTrianguloData} alt="" aria-hidden="true" />
                  </button>
                </div>

                <div className={styles.timeSeparator}>:</div>

                <div className={styles.timeColumn}>
                  <button
                    type="button"
                    className={`${styles.timeArrow} ${styles.timeArrowUp}`}
                    onClick={() =>
                      actualizarBorrador({
                        minute: incrementarHora(borrador.minute, 5, 0, 55),
                      })
                    }
                  >
                    <img src={icoTrianguloData} alt="" aria-hidden="true" />
                  </button>
                  <div className={styles.timeValue}>
                    {String(borrador.minute).padStart(2, "0")}
                  </div>
                  <button
                    type="button"
                    className={`${styles.timeArrow} ${styles.timeArrowDown}`}
                    onClick={() =>
                      actualizarBorrador({
                        minute: incrementarHora(borrador.minute, -5, 0, 55),
                      })
                    }
                  >
                    <img src={icoTrianguloData} alt="" aria-hidden="true" />
                  </button>
                </div>

                <div className={styles.timeColumn}>
                  <button
                    type="button"
                    className={`${styles.timeArrow} ${styles.timeArrowUp}`}
                    onClick={() =>
                      actualizarBorrador({
                        meridiem: borrador.meridiem === "AM" ? "PM" : "AM",
                      })
                    }
                  >
                    <img src={icoTrianguloData} alt="" aria-hidden="true" />
                  </button>
                  <div className={styles.timeValue}>{borrador.meridiem}</div>
                  <button
                    type="button"
                    className={`${styles.timeArrow} ${styles.timeArrowDown}`}
                    onClick={() =>
                      actualizarBorrador({
                        meridiem: borrador.meridiem === "AM" ? "PM" : "AM",
                      })
                    }
                  >
                    <img src={icoTrianguloData} alt="" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h4>Dias:</h4>
              <div className={styles.daysRow}>
                {diasDisponibles.map((dia) => {
                  const activo = borrador.days.includes(dia.indice);
                  return (
                    <button
                      key={`${dia.indice}-${dia.etiqueta}`}
                      type="button"
                      className={`${styles.dayChip} ${
                        activo ? styles.dayChipActive : ""
                      }`}
                      onClick={() => toggleDia(dia.indice)}
                    >
                      {dia.etiqueta}
                    </button>
                  );
                })}
              </div>
            </section>

            <p className={styles.note}>{note}</p>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={guardar}
              >
                {saveButtonLabel}
              </button>

              {recordatorios.some((item) => item.id === borrador.id) ? (
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={eliminar}
                >
                  {deleteButtonLabel}
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalRecordatoriosPresion;
