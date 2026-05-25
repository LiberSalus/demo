import styles from "./PresionArterial.module.css";
import campana from "./icoCampana.svg";

const TarjetaAlertasPresion = ({
  className = "",
  ultimoRegistro,
  fechaActualizacionTexto,
  onAdministrarRecordatorios,
  resumenRecordatorio,
  tituloRecordatorios = "Administrar mis recordatorios",
  textoProximaToma = "Tu próxima toma de presión es en:",
  notaProximaToma = "*Recuerda tomar tu presión constantemente",
  tituloDetalle = "Medicamento tomado",
  subtituloDetalle = "Nombre de medicamento",
  valorDetalle = ultimoRegistro?.medicamento ?? "--",
  etiquetaFechaDetalle = "Fecha y hora de toma",
  ocultarDetalle = false,
}) => (
  <div
    className={`${styles.cntAlertas} ${className}`.trim()}
    style={
      ocultarDetalle
        ? {
            height: "auto",
            minHeight: "0",
            justifyContent: "flex-start",
          }
        : undefined
    }
  >
    <button
      type="button"
      className={styles.AdministarRecordatorios}
      onClick={onAdministrarRecordatorios}
    >
      <img className={styles.campana} src={campana} alt="Alertas" />
      <div className={styles.recordatorioResumen}>
        <p className={styles.txt}>{tituloRecordatorios}</p>
        <p className={styles.recordatorioMeta}>
          {resumenRecordatorio?.hora ?? "--"} ·{" "}
          {resumenRecordatorio?.dias ?? "Sin recordatorios activos"}
        </p>
      </div>
    </button>
    <div className={styles.cntProxima}>
      <p>{textoProximaToma}</p>
      <p>{resumenRecordatorio?.cuentaRegresiva ?? "--"}</p>
      <p>{notaProximaToma}</p>
    </div>
    {!ocultarDetalle && (
      <div className={styles.cntMedicamento}>
        <p>{tituloDetalle}</p>
        <p>{subtituloDetalle}</p>
        <p>{valorDetalle}</p>
        <p>{etiquetaFechaDetalle}</p>
        <p>{ultimoRegistro ? fechaActualizacionTexto : "--"}</p>
      </div>
    )}
  </div>
);

export default TarjetaAlertasPresion;
