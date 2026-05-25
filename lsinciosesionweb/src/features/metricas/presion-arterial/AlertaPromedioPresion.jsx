import styles from "./PresionArterial.module.css";
import icoAlertVerde from "./icoAlertVerde.svg";
import icoAlertRojo from "./icoAlertRojo.svg";
import icoAlertAmarillo from "./icoAlertAmarillo.svg";

const ALERTAS_PRESION = {
  verde: {
    icono: icoAlertVerde,
    alt: "Presion arterial en rango",
    mensaje:
      "Tu presión arterial se mantiene dentro de los rangos esperados. Continúa con mediciones regulares.",
  },
  amarilla: {
    icono: icoAlertAmarillo,
    alt: "Presion arterial elevada",
    mensaje:
      "Tu presión arterial muestra valores elevados. Procura repetir la medición en condiciones similares y mantener seguimiento.",
  },
  roja: {
    icono: icoAlertRojo,
    alt: "Presion arterial fuera de rango",
    mensaje:
      "Tu presión arterial está fuera de los rangos normales. Si esto persiste, consulta a tu médico.",
  },
};

const obtenerTipoAlerta = (promAct) => {
  const estado = promAct?.estado?.texto;

  if (!estado || promAct?.sistolica == null || promAct?.diastolica == null) {
    return "amarilla";
  }

  if (estado === "Normal") return "verde";
  if (estado === "Elevada") return "amarilla";
  return "roja";
};

const AlertaPromedioPresion = ({ promAct }) => {
  const tipoAlerta = obtenerTipoAlerta(promAct);
  const { icono, alt, mensaje } = ALERTAS_PRESION[tipoAlerta];

  return (
    <div className={styles.alertaPromedio}>
      <img src={icono} alt={alt} className={styles.alertaPromedioIcono} />
      <p className={styles.alertaPromedioMensaje}>{mensaje}</p>
    </div>
  );
};

export default AlertaPromedioPresion;
