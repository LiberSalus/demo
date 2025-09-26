// src/routes/index.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from '@/components/auth/Login';
import Inicio from '@/pages/Inicio/Inicio';
import Historial from '@/pages/Historial/Historial';
import Cabina from '@/pages/Cabina/Cabina';
import Ayuda from '@/pages/Ayuda/Ayuda';
import Panel from '@/pages/Panel/Panel';

// Cuestionarios
import Cuestionarios from '@/pages/Cuestionarios/Cuestionarios';
import CuestionariosArea from '@/pages/Cuestionarios/Area';   // <-- crea este archivo
import CuestionarioRun from '@/pages/Cuestionarios/Run';      // <-- crea este archivo

import ProtectedRoute from './protected-route';

export const ROUTES = {
  LOGIN: '/login',
  INICIO: '/inicio',
  CUESTIONARIOS: '/cuestionarios',
  CUESTIONARIOS_AREA: '/cuestionarios/:area',
  CUESTIONARIOS_RUN: '/cuestionarios/:area/:key',
  HISTORIAL: '/historial',
  CABINA: '/cabina',
  AYUDA: '/ayuda',
  PANEL: '/panelayout',
};

export const AppRouter = () => (
  <BrowserRouter basename="/panel">
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.INICIO} element={<Inicio />} />
        <Route path={ROUTES.CUESTIONARIOS} element={<Cuestionarios />} />
        <Route path={ROUTES.CUESTIONARIOS_AREA} element={<CuestionariosArea />} />
        <Route path={ROUTES.CUESTIONARIOS_RUN} element={<CuestionarioRun />} />
        <Route path={ROUTES.HISTORIAL} element={<Historial />} />
        <Route path={ROUTES.CABINA} element={<Cabina />} />
        <Route path={ROUTES.AYUDA} element={<Ayuda />} />
        <Route path={ROUTES.PANEL} element={<Panel />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  </BrowserRouter>
);
