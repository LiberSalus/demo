import styles from "./PresionArterial.module.css";
import icoRecordatorio from "./icoRecordatorio.svg";

const ContextoPresionArterial = () => (
  <div className={styles.contextoPresion}>
    <img
      src={icoRecordatorio}
      alt="Recordatorio"
      className={styles.contextoPresionIcono}
    />
    <div className={styles.contextoPresionTexto}>
      <p>
        Tu presión arterial puede variar a lo largo del día según tu actividad,
        nivel de estrés, sueño o consumo de café, alcohol o tabaco. Procura
        medirla en condiciones similares para obtener resultados más precisos.
        Si se mantiene elevada de forma constante, consulta a un médico.
      </p>
      <p>* FC: Frecuencia cardiaca</p>
      <p>* mmHg: Milímetros de mercurio</p>
    </div>
  </div>
);

export default ContextoPresionArterial;
