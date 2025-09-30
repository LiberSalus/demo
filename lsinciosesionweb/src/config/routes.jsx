// src/config/routes.js
export const ROUTES = {
  LOGIN: "/login",
  INICIO: "/inicio",

  // Mi Salud
  SOBRE_MI: "/mi-salud/sobre-mi",
  HISTORIA_SALUD: "/mi-salud/historia-salud",
  FAMILIA_HERENCIA: "/mi-salud/familia-herencia",
  CUERPO_HISTORIA: "/mi-salud/cuerpo-historia",
  RESPONDE_CUIDATE: "/mi-salud/responde-cuidate",

  // Mis Consultas
  SUSURROS: "/mis-consultas/susurros-salud",
  COMPRENSION: "/mis-consultas/comprension-situacion",
  PLAN_CUIDADO: "/mis-consultas/plan-cuidado",
  AVANCE: "/mis-consultas/avance",
  PROXIMOS_PASOS: "/mis-consultas/proximos-pasos",
  LO_QUE_DICE: "/mis-consultas/lo-que-dice-tu-salud",
  AREAS: "/mis-consultas/areas",

  // Cuestionarios (vista general + drilldown)
  CUESTIONARIOS: "/cuestionarios",
  CUESTIONARIOS_AREA: "/cuestionarios/:area",
  CUESTIONARIOS_RUN: "/cuestionarios/:area/:key",

  // Otros
  PANEL: "/panelayout",
  ANY: "/any",
  FRANKY: "/franky",
  DUDAS: "/ayuda/dudas-frecuentes",
};
