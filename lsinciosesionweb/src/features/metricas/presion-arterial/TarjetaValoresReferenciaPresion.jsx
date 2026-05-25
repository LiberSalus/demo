import styles from "./PresionArterial.module.css";

const TarjetaValoresReferenciaPresion = ({ valoresReferencia }) => (
  <div className={styles.cntValoresReferencia}>
    <p className={styles.tit}>
      Valores de referencia de presión arterial <span className={styles.mmhg}>(mmHg)</span>
    </p>
    <div className={styles.refTabla}>
      <div className={styles.cabeceras}>
        <div className={styles.cabeceraSpacer} aria-hidden="true"></div>
        <div className={styles.cabeceraValores}>
          <p>Sistólica</p>
          <p>Diastólica</p>
        </div>
      </div>
      {valoresReferencia.map((valor) => (
        <div key={valor.key} className={styles.valor}>
          <div className={styles.condicion}>
            <span style={{ background: valor.bg }}></span>
            <p>{valor.condicion}</p>
          </div>

          <div className={styles.refValores}>
            <p className={styles.dia} style={{ color: valor.bg }}>
              {valor.rango.dia}
            </p>
            <p className={styles.sis} style={{ color: valor.bg }}>
              {valor.rango.sis}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TarjetaValoresReferenciaPresion;
