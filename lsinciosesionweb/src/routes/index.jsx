// src/routes/index.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";

// Layout y guard
import Principal from "@/Layout/Principal";
import ProtectedRoute from "./protected-route";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";

const Login = lazy(() => import("@/pages/LoginNuevo/LoginNuevo"));
const Inicio = lazy(() => import("@/pages/Inicio/Inicio"));
const RegistrosPage = lazy(() => import("@/pages/Registros/RegistrosPage"));
const RegistroDetallePage = lazy(() =>
  import("@/pages/Registros/RegistroDetallePage")
);
const MiSaludATravesDelTiempo = lazy(() => import("@/pages/MiSalud/SobreMi"));
const HistoriaSalud = lazy(() => import("@/pages/MiSalud/HistoriaSalud"));
const CuerpoHistoria = lazy(() => import("@/pages/MiSalud/CuerpoHistoria"));
const RespondeCuidate = lazy(() => import("@/pages/MiSalud/RespondeCuidate"));
const FamiliaHerencia = lazy(() => import("@/pages/MiSalud/FamiliaHerencia"));
const MiCuidadoDiario = lazy(() => import("@/pages/MisConsultas/Areas"));
const Avance = lazy(() => import("@/pages/MisConsultas/Avance"));
const Susurros = lazy(() => import("@/pages/MisConsultas/Susurros"));
const LoQueDice = lazy(() => import("@/pages/MisConsultas/LoQueDice"));
const Comprension = lazy(() => import("@/pages/MisConsultas/Comprension"));
const PlanCuidado = lazy(() => import("@/pages/MisConsultas/PlanCuidado"));
const ProximosPasos = lazy(() => import("@/pages/MisConsultas/ProximosPasos"));
const MonitorDeSalud = lazy(() => import("@/pages/Monitor/Monitor"));
const SaludFisica = lazy(() => import("@/pages/SaludFisica/SaludFisica"));
const SaludMental = lazy(() => import("@/pages/SaludMental/SaludMental"));
const SaludNutricional = lazy(() =>
  import("@/pages/SaludNutricional/SaludNutricional")
);
const Cuestionarios = lazy(() =>
  import("@/pages/Cuestionarios/Cuestionarios")
);
const AreaCuestionarios = lazy(() =>
  import("@/pages/Cuestionarios/Area")
);
const CuestionarioRun = lazy(() => import("@/pages/Cuestionarios/Run"));

const miSaludRoutes = [
  { path: ROUTES.SOBRE_MI, element: <MiSaludATravesDelTiempo /> },
  { path: ROUTES.HISTORIA_SALUD, element: <HistoriaSalud /> },
  { path: ROUTES.CUERPO_HISTORIA, element: <CuerpoHistoria /> },
  { path: ROUTES.FAMILIA_HERENCIA, element: <FamiliaHerencia /> },
  { path: ROUTES.RESPONDE_CUIDATE, element: <RespondeCuidate /> },
];

const saludDetalleRoutes = [
  { path: ROUTES.SALUD_FISICA, element: <SaludFisica /> },
  { path: ROUTES.SALUD_MENTAL, element: <SaludMental /> },
  { path: ROUTES.SALUD_NUTRICIONAL, element: <SaludNutricional /> },
];

const misConsultasRoutes = [
  { path: ROUTES.AREAS, element: <MiCuidadoDiario /> },
  { path: ROUTES.AVANCE, element: <Avance /> },
  { path: ROUTES.SUSURROS, element: <Susurros /> },
  { path: ROUTES.LO_QUE_DICE, element: <LoQueDice /> },
  { path: ROUTES.COMPRENSION, element: <Comprension /> },
  { path: ROUTES.PLAN_CUIDADO, element: <PlanCuidado /> },
  { path: ROUTES.PROXIMOS_PASOS, element: <ProximosPasos /> },
];

const extrasRoutes = [
  { path: ROUTES.MONITOR, element: <MonitorDeSalud /> },
];

const fallbackRuta = <div style={{ padding: "1rem" }}>Cargando...</div>;

// Re-export para mantener un unico punto de acceso a ROUTES.
export { ROUTES } from "@/config/routes";

/*
  Flujo general del router:
  1. `LOGIN` es la unica ruta publica.
  2. El resto pasa por `ProtectedRoute`, que valida token activo y compatibilidad dev.
  3. Si el acceso es valido, `Principal` monta el layout comun de la app.
  4. Dentro de ese layout se renderiza la pagina correspondiente con nested routes.
  5. La ruta index protegida redirige a `INICIO`.
  6. Cualquier URL desconocida redirige a `LOGIN`.
*/

export const AppRouter = () => (
  <BrowserRouter basename="/panel">
    <ScrollToTop />
    <Suspense fallback={fallbackRuta}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Principal />}>
            <Route path={ROUTES.INICIO} element={<Inicio />} />
            <Route path={ROUTES.REGISTROS} element={<RegistrosPage />} />
            <Route
              path={ROUTES.REGISTRO_DETALLE}
              element={<RegistroDetallePage />}
            />

            {miSaludRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {saludDetalleRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {misConsultasRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {extrasRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {/* Cuestionarios (lista, area y runner) */}
            <Route path="/cuestionarios" element={<Cuestionarios />} />
            <Route path="/cuestionarios/:area" element={<AreaCuestionarios />} />
            <Route
              path="/cuestionarios/:area/:key"
              element={<CuestionarioRun />}
            />

            <Route index element={<Navigate to={ROUTES.INICIO} replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
