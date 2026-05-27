import React, { useEffect, useState } from "react";
import styles from "./Noticia.module.css";
import image1 from "./news1.png";
import { obtenerNoticiasInicio } from "@/services/noticias";

const NOTICIA_INICIAL = {
  imagen: image1,
  titulo: "El empleo en el sector farmaceutico crece",
  resumen:
    "Este crecimiento supone un aumento del 37 por ciento respecto a 2019, el año antes de la pandemia.",
  link: "",
};

// Muestra la noticia principal del servicio con respaldo local si el endpoint no responde.
const Noticia = () => {
  const [noticia, setNoticia] = useState(NOTICIA_INICIAL);

  // Carga la primera noticia disponible para mantener el bloque actualizado desde backend.
  useEffect(() => {
    let desmontado = false;

    obtenerNoticiasInicio()
      .then((noticias) => {
        const noticiaPrincipal = noticias[0];
        if (desmontado || !noticiaPrincipal) return;

        setNoticia({
          imagen: noticiaPrincipal.imagen || NOTICIA_INICIAL.imagen,
          titulo: noticiaPrincipal.titulo || NOTICIA_INICIAL.titulo,
          resumen:
            [noticiaPrincipal.autor, noticiaPrincipal.fechaTexto]
              .filter(Boolean)
              .join(" - ") || NOTICIA_INICIAL.resumen,
          link: noticiaPrincipal.link || "",
        });
      })
      .catch(() => {
        // Conservamos la noticia local cuando el servicio no esta disponible.
      });

    return () => {
      desmontado = true;
    };
  }, []);

  const contenido = (
    <>
      <div className={styles.cntImg}>
        <img src={noticia.imagen} alt={noticia.titulo} />
      </div>
      <div className={styles.info}>
        <h3>{noticia.titulo}</h3>
        <p>{noticia.resumen}</p>
      </div>
    </>
  );

  if (noticia.link) {
    return (
      <a
        className={styles.Noticia}
        href={noticia.link}
        target="_blank"
        rel="noreferrer"
      >
        {contenido}
      </a>
    );
  }

  return <div className={styles.Noticia}>{contenido}</div>;
};

export default Noticia;
