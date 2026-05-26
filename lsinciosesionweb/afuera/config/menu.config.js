import { ROUTES } from "./routes";

// Configuracion base del menu principal visible en la app.
// Cada item mantiene el mismo id conceptual que ROUTES y el path real en `to`.
export const MENU = [
  { id: "INICIO", label: "Inicio", to: ROUTES.INICIO },
  { id: "SOBRE_MI", label: "Mi salud a través del tiempo", to: ROUTES.SOBRE_MI },
  { id: "AREAS", label: "Mi cuidado diario", to: ROUTES.AREAS },
  { id: "MONITOR", label: "Monitor de salud", to: ROUTES.MONITOR },
  { id: "FRANKY", label: "Franky te acompaña", to: ROUTES.FRANKY },
  { id: "ANY", label: "Any", to: ROUTES.ANY },
  { id: "DUDAS", label: "TAMI", to: ROUTES.DUDAS },
];
