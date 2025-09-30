// src/routes/index.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";

// Layout y guard
import Principal from "@/Layout/Principal";
import ProtectedRoute from "./protected-route";

// Pages
import Login from "@/pages/Login/Login";
import Inicio from "@/pages/Inicio/Inicio";

import SobreMi from "@/pages/MiSalud/SobreMi";
import HistoriaSalud from "@/pages/MiSalud/HistoriaSalud";
import FamiliaHerencia from "@/pages/MiSalud/FamiliaHerencia";
import CuerpoHistoria from "@/pages/MiSalud/CuerpoHistoria";
import RespondeCuidate from "@/pages/MiSalud/RespondeCuidate";

import Susurros from "@/pages/MisConsultas/Susurros";
import Comprension from "@/pages/MisConsultas/Comprension";
import PlanCuidado from "@/pages/MisConsultas/PlanCuidado";
import Avance from "@/pages/MisConsultas/Avance";
import ProximosPasos from "@/pages/MisConsultas/ProximosPasos";
import LoQueDice from "@/pages/MisConsultas/LoQueDice";
import Areas from "@/pages/MisConsultas/Areas";

import Any from "@/pages/Any/Any";
import Franky from "@/pages/Franky/Franky";
import DudasFrecuentes from "@/pages/Ayuda/DudasFrecuentes";

// (Opcional) re-export para compatibilidad vieja
export { ROUTES } from "@/config/routes";

export const AppRouter = () => (
  <BrowserRouter basename="/panel">
    <Routes>
      {/* Pública */}
      <Route path={ROUTES.LOGIN} element={<Login />} />

      {/* Protegidas */}
      <Route element={<ProtectedRoute />}>
        {/* Layout */}
        <Route element={<Principal />}>
          {/* Inicio */}
          <Route path={ROUTES.INICIO} element={<Inicio />} />

          {/* Mi Salud */}
          <Route path={ROUTES.SOBRE_MI} element={<SobreMi />} />
          <Route path={ROUTES.HISTORIA_SALUD} element={<HistoriaSalud />} />
          <Route path={ROUTES.FAMILIA_HERENCIA} element={<FamiliaHerencia />} />
          <Route path={ROUTES.CUERPO_HISTORIA} element={<CuerpoHistoria />} />
          <Route path={ROUTES.RESPONDE_CUIDATE} element={<RespondeCuidate />} />

          {/* Mis Consultas */}
          <Route path={ROUTES.SUSURROS} element={<Susurros />} />
          <Route path={ROUTES.COMPRENSION} element={<Comprension />} />
          <Route path={ROUTES.PLAN_CUIDADO} element={<PlanCuidado />} />
          <Route path={ROUTES.AVANCE} element={<Avance />} />
          <Route path={ROUTES.PROXIMOS_PASOS} element={<ProximosPasos />} />
          <Route path={ROUTES.LO_QUE_DICE} element={<LoQueDice />} />
          <Route path={ROUTES.AREAS} element={<Areas />} />

          {/* Extras */}
          <Route path={ROUTES.ANY} element={<Any />} />
          <Route path={ROUTES.FRANKY} element={<Franky />} />
          <Route path={ROUTES.DUDAS} element={<DudasFrecuentes />} />

          {/* Index protegido: si caen en /panel/ directamente */}
          <Route index element={<Navigate to={ROUTES.INICIO} replace />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  </BrowserRouter>
);
