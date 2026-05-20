// src/routes/index.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";

// Layout y guard
import Principal from "@/Layout/Principal";
import ProtectedRoute from "./protected-route";

// Pages
import Login from "@/pages/LoginNuevo/LoginNuevo";
import Inicio from "@/pages/Inicio/Inicio";

import MiSaludATravesDelTiempo from "@/pages/MiSalud/SobreMi";
import HistoriaSalud from "@/pages/MiSalud/HistoriaSalud";
import CuerpoHistoria from "@/pages/MiSalud/CuerpoHistoria";
import RespondeCuidate from "@/pages/MiSalud/RespondeCuidate";
import FamiliaHerencia from "@/pages/MiSalud/FamiliaHerencia";

import MiCuidadoDiario from "@/pages/MisConsultas/Areas";
import Avance from "@/pages/MisConsultas/Avance";
import Susurros from "@/pages/MisConsultas/Susurros";
import LoQueDice from "@/pages/MisConsultas/LoQueDice";
import Comprension from "@/pages/MisConsultas/Comprension";
import PlanCuidado from "@/pages/MisConsultas/PlanCuidado";
import ProximosPasos from "@/pages/MisConsultas/ProximosPasos";

import Any from "@/pages/Any/Any";
import FrankyTeAcompana from "@/pages/FRANKY/Franky";
import MonitorDeSalud from "@/pages/Monitor/Monitor";
import Tami from "@/pages/Ayuda/DudasFrecuentes";

import SaludFisica from "@/pages/SaludFisica/SaludFisica";
import SaludMental from "@/pages/SaludMental/SaludMental";
import SaludNutricional from "@/pages/SaludNutricional/SaludNutricional";

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
  { path: ROUTES.ANY, element: <Any /> },
  { path: ROUTES.MONITOR, element: <MonitorDeSalud /> },
  { path: ROUTES.FRANKY, element: <FrankyTeAcompana /> },
  { path: ROUTES.DUDAS, element: <Tami /> },
];

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
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Principal />}>
          <Route path={ROUTES.INICIO} element={<Inicio />} />

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

          <Route index element={<Navigate to={ROUTES.INICIO} replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  </BrowserRouter>
);
