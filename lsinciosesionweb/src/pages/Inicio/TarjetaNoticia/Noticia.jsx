import React from 'react'
import styles from './Noticia.module.css'
import image1 from './news1.png'

const Noticia = () => {

    

    const NOTICIA = 
        {
            imagen: image1,
            titulo: "El empleo en el sector farmaceutico crece",
            resumen: "Este crecimiento supone un aumento del 37 por ciento respecto a 2019, el año antes de la pandemia.",
        }
    

  return (
    <div className={styles.Noticia}>
        <div className={styles.cntImg}>
            <img src={NOTICIA.imagen}></img>
        </div>
        <div className={styles.info}>
            <h3>{NOTICIA.titulo}</h3>
            <p>{NOTICIA.resumen}</p>
        </div>

    </div>
  )
}

export default Noticia
