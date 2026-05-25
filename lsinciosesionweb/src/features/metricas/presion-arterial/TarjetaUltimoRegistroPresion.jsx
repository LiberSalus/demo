import styles from "./PresionArterial.module.css";

const TarjetaUltimoRegistroPresion = ({
  estadoUltimoRegistro,
  ultimoRegistro,
  ultimoRegistroFrecuencia,
  valorDiaAnterior,
  obtenerEstadoPresion,
}) => (
  <div className={styles.cntUltimRegistro}>
    <p className={styles.tit}>Último valor de presión registrado</p>
    <div className={styles.valores}>
      <div className={styles.propiedad}>
        <p style={{ color: estadoUltimoRegistro.color }}>{estadoUltimoRegistro.texto}</p>
        <p>
          {ultimoRegistro
            ? `${ultimoRegistro.sistolica} / ${ultimoRegistro.diastolica} mmHg`
            : "-- / -- mmHg"}
        </p>
      </div>
      <div className={styles.propiedad}>
        <p>Sistólica</p>
        <p>{ultimoRegistro?.sistolica ?? "--"} mmHg</p>
      </div>
      <div className={styles.propiedad}>
        <p>Diastólica</p>
        <p>{ultimoRegistro?.diastolica ?? "--"} mmHg</p>
      </div>
      <div className={styles.propiedad}>
        <p>Frecuencia cardiaca</p>
        <p>{ultimoRegistroFrecuencia?.ppm ?? "--"} ppm</p>
      </div>
    </div>
    <div className={styles.otrosValores}>
      <div className={styles.valoresFoot}>
        <p>Último valor de FC</p>
        <p>{ultimoRegistroFrecuencia?.ppm ?? "--"} ppm</p>
      </div>
      <div className={styles.valoresFoot}>
        <p>Presión anterior</p>
        <p>
          {valorDiaAnterior
            ? `${valorDiaAnterior.sistolica} / ${valorDiaAnterior.diastolica} mmHg`
            : "-- / -- mmHg"}
          <span
            className={styles.bolita}
            style={{
              background: valorDiaAnterior
                ? obtenerEstadoPresion(
                    valorDiaAnterior.sistolica,
                    valorDiaAnterior.diastolica
                  ).color
                : "#B5B5B5",
            }}
          ></span>
        </p>
      </div>
    </div>
  </div>
);

export default TarjetaUltimoRegistroPresion;
