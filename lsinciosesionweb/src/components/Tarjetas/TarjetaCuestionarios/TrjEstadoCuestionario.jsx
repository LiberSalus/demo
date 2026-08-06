import React from "react";
import { Link } from "react-router-dom";
import styles from "./trjEstadoCuestionario.module.css";

// Estado del cuestionario → etiqueta en español + color (vía data-estado).
const ETIQUETAS_ESTADO = {
  completado: "Completado",
  proceso: "En progreso",
  inactivo: "No iniciado",
  bloqueado: "Bloqueado",
};

// Tarjeta compacta de estado de un cuestionario.
// Uso: <TrjEstadoCuestionario nombre="GAD-7" descripcion="..." estado="proceso"
//        percent={40} href="/cuestionarios/emocional/GAD-7" />
const TrjEstadoCuestionario = ({
  id,
  nombre,
  descripcion,
  estado = "inactivo",
  fecha,
  percent,
  srcIcon,
  href,
}) => {
  const etiqueta = ETIQUETAS_ESTADO[estado] || estado;
  const contenido = (
    <>
      <div className={styles.cuestionarioDato} data-estado={estado}>
        <p className={styles.tituloEstadoCuestionario}>{nombre}</p>
        {descripcion && <p className={styles.descripcion}>{descripcion}</p>}
        {fecha && <p className={styles.fecha}>Creado: {fecha}</p>}
        {percent != null && (
          <div
            className={styles.miniBarra}
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progreso de ${nombre}`}
          >
            <div className={styles.miniProgreso} style={{ width: `${percent}%` }} />
          </div>
        )}
      </div>
      <div className={styles.estado}>
        <p className={styles.estadoTxt}>{etiqueta}</p>
        {srcIcon && <img className={styles.estadoImg} src={srcIcon} alt={etiqueta} />}
      </div>
    </>
  );

  // Link de react-router para respetar el basename (/panel) y no hacer page-load.
  return href ? (
    <Link key={id} className={styles.cntTarjetaEstado} to={href} data-estado={estado}>
      {contenido}
    </Link>
  ) : (
    <div key={id} className={styles.cntTarjetaEstado} data-estado={estado}>
      {contenido}
    </div>
  );
};

export default TrjEstadoCuestionario;
