import styles from "./PaginaEnConstruccion.module.css";

// Muestra una vista temporal para rutas que ya existen en navegacion, pero aun no tienen experiencia final.
const PaginaEnConstruccion = ({ titulo }) => {
  return (
    <section className={styles.contenedor}>
      <h1 className={styles.titulo}>{titulo}</h1>
    </section>
  );
};

export default PaginaEnConstruccion;
