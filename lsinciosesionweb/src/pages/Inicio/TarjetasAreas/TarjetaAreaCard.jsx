import React from "react";
import styles from "./TarjetaAreaCard.module.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";

// Mapeo de áreas a rutas y descripciones
const AREAS_CONFIG = {
  fisico: {
    titulo: "Bienestar Físico",
    ruta: ROUTES.CUESTIONARIOS + "/fisico",
    descripcion:
      "Tu bienestar físico en un solo panel. Completa estos cuestionarios para conocer tu rutina de actividad, descanso y movilidad.",
    icono: "icoFisico.svg",
    colorFondo: "#fce4ec",
    colorBorde: "#f8bbd0",
    colorBoton: "#e91e63",
  },
  emocional: {
    titulo: "Bienestar Emocional",
    ruta: ROUTES.CUESTIONARIOS + "/emocional",
    descripcion:
      "Tu bienestar emocional también importa. Estos cuestionarios te ayudan a reconocer cómo te sientes y manejar el estrés.",
    icono: "icoEmocional.svg",
    colorFondo: "#e3f2fd",
    colorBorde: "#bbdefb",
    colorBoton: "#2196f3",
  },
  social: {
    titulo: "Bienestar Social",
    ruta: ROUTES.CUESTIONARIOS + "/social",
    descripcion:
      "Tus relaciones y tu entorno también construyen salud. Con estos cuestionarios conoces tus vínculos y apoyo social.",
    icono: "icoSocial.svg",
    colorFondo: "#f3e5f5",
    colorBorde: "#e1bee7",
    colorBoton: "#9c27b0",
  },
};

const TarjetaAreaCard = ({ area }) => {
  const navigate = useNavigate();
  const config = AREAS_CONFIG[area];

  if (!config) return null;

  return (
    <div 
      className={styles.tarjeta} 
      style={{ 
        backgroundColor: config.colorFondo,
        borderColor: config.colorBorde 
      }}
    >
      <div className={styles.encabezado}>
        <img
          src={`${import.meta.env.BASE_URL}icons/${config.icono}`}
          alt={config.titulo}
          className={styles.icono}
        />
        <h4 className={styles.titulo}>{config.titulo}</h4>
      </div>
      <p className={styles.descripcion}>{config.descripcion}</p>
      <button
        type="button"
        className={styles.boton}
        style={{ backgroundColor: config.colorBoton }}
        onClick={() => navigate(config.ruta)}
      >
        Ver cuestionarios
      </button>
    </div>
  );
};

export default TarjetaAreaCard;
