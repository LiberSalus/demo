// src/config/routes.js
export const ROUTES = {
  LOGIN: "/login",
  INICIO: "/inicio",

  // Mi Salud
  SOBRE_MI: "/mi-salud/sobre-mi",
  HISTORIA_SALUD: "/mi-salud/historia-salud",
  CUERPO_HISTORIA: "/mi-salud/cuerpo-historia",
  FAMILIA_HERENCIA: "/mi-salud/familia-herencia",
  RESPONDE_CUIDATE: "/mi-salud/responde-cuidate",

  // Detalles por Salud
  SALUD_FISICA: "/salud-fisica",
  SALUD_MENTAL: "/salud-mental",
  SALUD_NUTRICIONAL: "/salud-nutricional",

  // Mis Consultas
  AREAS: "/mis-consultas/areas",
  AVANCE: "/mis-consultas/avance",
  SUSURROS: "/mis-consultas/susurros-salud",
  COMPRENSION: "/mis-consultas/comprension-situacion",
  LO_QUE_DICE: "/mis-consultas/lo-que-dice-tu-salud",
  PLAN_CUIDADO: "/mis-consultas/plan-cuidado",
  PROXIMOS_PASOS: "/mis-consultas/proximos-pasos",

  // Cuestionarios (vista general + drilldown)
  CUESTIONARIOS: "/cuestionarios",
  CUESTIONARIOS_RUN: "/cuestionarios/:area/:key",
  CUESTIONARIOS_AREA: "/cuestionarios/:area",

  // Otros
  ANY: "/any",
  PANEL: "/panelayout",
  DUDAS: "/ayuda/dudas-frecuentes",
  FRANKY: "/franky",
};
