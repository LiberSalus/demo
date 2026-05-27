import styles from "./MetricaEnPreparacion.module.css";

// Muestra un estado temporal mientras una metrica v2 todavia no se ha migrado.
export default function MetricaEnPreparacion({ metrica }) {
  return (
    <div className={styles.MetricaEnPreparacion}>
      <p>{metrica?.label || "Metrica"} en preparacion.</p>
    </div>
  );
}
