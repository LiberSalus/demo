import { ROUTES } from "./routes";

export const MENU = [
  { label: "Inicio", to: ROUTES.INICIO },

  {
    label: "Mi Salud",
    children: [
      { label: "Sobre mí",              to: ROUTES.SOBRE_MI },
      { label: "Mi historia con la salud", to: ROUTES.HISTORIA_SALUD },
      { label: "Mi familia y herencia", to: ROUTES.FAMILIA_HERENCIA },
      { label: "Mi cuerpo y su historia", to: ROUTES.CUERPO_HISTORIA },
      { label: "Responde y cuídate",    to: ROUTES.RESPONDE_CUIDATE },
    ],
  },

  {
    label: "Mis Consultas",
    children: [
      { label: "Susurros Salud",           to: ROUTES.SUSURROS },
      { label: "Comprensión de mi situación", to: ROUTES.COMPRENSION },
      { label: "Mi plan de cuidado",       to: ROUTES.PLAN_CUIDADO },
      { label: "Cómo voy avanzando",       to: ROUTES.AVANCE },
      { label: "Próximos pasos",           to: ROUTES.PROXIMOS_PASOS },
      { label: "Lo que dice tu salud",     to: ROUTES.LO_QUE_DICE },
      { label: "Áreas",                    to: ROUTES.AREAS },
    ],
  },

  // Secciones de ayuda/extra
  { label: "Monitor", to: ROUTES.MONITOR },
  { label: "Franky", to: ROUTES.FRANKY },
  { label: "Dudas frecuentes", to: ROUTES.DUDAS },
];
