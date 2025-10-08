// src/router/AppRoutes.jsx
//import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* --- Páginas --- */
//import V1Registro       from '@/components/V1Registro/V1Registro';
//import V2Confirmacion   from '@/components/V2Confirmacion/V2Confirmacion';
//import V3Verificacion   from '@/components/V3Verificación/V3Verificacion';
//import V4ConfExito      from '@/components/V4ConfExito/V4ConfExito';
//import V5ComprIdentidad from '@/components/V5ComprIdentidad/V5ComprIdentidad';
//import V5ACompletarIne  from '@/components/V5ACompletarIne/V5ACompletarIne';
//import V5BCompletarDom  from '@/components/V5ACompletarIne/V5BCompletarDom';
//import V6Adjuntar       from '@/components/V6Adjuntar/V6Adjuntar';
//import V6Capturar       from '@/components/V6Capturar/V6Capturar';
//import V7Recibidos      from '@/components/V7Recibidos/V7Recibidos';
//import V7RevisarDoc     from '@/components/V7Revisar/V7RevisarDoc';
//import V7InvitacionDoc  from '@/components/V7InvitacionDoc/V7InvitacionDoc';
//import V8Opciones       from '@/components/V8Opciones/V8Opciones';

/* --- Rutas --- */
//export const ROUTES = {
//  REGISTRO:            '/',
//  CONFIRMACION:        '/confirmacion',
//  VERIFICACION:        '/verificacion',
//  CONFIRMACION_EXITO:  '/confirmacion-exito',
//  COMPROBAR_IDENTIDAD: '/comprobar-identidad',
//  COMPLETAR_INE:       '/completar-ine',
//  COMPLETAR_DOMICILIO: '/completar-domicilio',
//  ADJUNTAR_DOCUMENTOS: '/adjuntar-documentos',
//  CAPTURAR_DOCUMENTOS: '/capturar-documentos',
//  RECIBIDOS:           '/recibidos',
//  REVISAR_DOCUMENTOS:  '/revisar-documentos',
//  INVITACION_DOC:      '/invitacion-documentos',
//  OPCIONES:            '/opciones',
//};
//
//export const AppRoutes = () => (
//  <BrowserRouter basename="/registro">
//    <Routes>
//      {/* Raíz → redirige al primer paso del flujo */}
//
//      <Route path={ROUTES.REGISTRO}               element={<V1Registro />} />
//      <Route path={ROUTES.CONFIRMACION}           element={<V2Confirmacion />} />
//      <Route path={ROUTES.VERIFICACION}           element={<V3Verificacion />} />
//      <Route path={ROUTES.CONFIRMACION_EXITO}     element={<V4ConfExito />} />
//      <Route path={ROUTES.COMPROBAR_IDENTIDAD}    element={<V5ComprIdentidad />} />
//      <Route path={ROUTES.COMPLETAR_INE}          element={<V5ACompletarIne />} />
//      <Route path={ROUTES.COMPLETAR_DOMICILIO}    element={<V5BCompletarDom />} />
//      <Route path={ROUTES.ADJUNTAR_DOCUMENTOS}    element={<V6Adjuntar />} />
//      <Route path={ROUTES.CAPTURAR_DOCUMENTOS}    element={<V6Capturar />} />
//      <Route path={ROUTES.RECIBIDOS}              element={<V7Recibidos />} />
//      <Route path={ROUTES.REVISAR_DOCUMENTOS}     element={<V7RevisarDoc />} />
//      <Route path={ROUTES.INVITACION_DOC}         element={<V7RevisarDoc />} />
//      <Route path={ROUTES.OPCIONES}               element={<V8Opciones />} />
//
//      {/* 404 – cualquier otra ruta */}
//      <Route path="*" element={<p>404 – Página no encontrada</p>} />
//    </Routes>
//  </BrowserRouter>
//);


import { Routes, Route, Navigate } from "react-router-dom";
import RegisterLayout from "@/layouts/RegisterLayout";

// Páginas del flujo registro (wrappers)
import P1Cuenta from "@/pages/Registro/P1Cuenta";
import P2Confirmacion from "@/pages/Registro/P2Confirmacion";
import P3Verificacion from "@/pages/Registro/P3Verificacion";
import P4ASubir from "@/pages/Registro/P4ASubir";
import P4BCapturar from "@/pages/Registro/P4BCapturar";
import P4Identidad from "@/pages/Registro/P4Identidad";

export default function AppRouter() {
  return (
    <Routes>
      {/* otras rutas */}

      <Route path="/registro" element={<RegisterLayout />}>
        <Route index element={<P1Cuenta />} />
        <Route path="confirmacion" element={<P2Confirmacion />} />
        <Route path="verificacion" element={<P3Verificacion />} />
        <Route path="subir" element={<P4ASubir />} />
        <Route path="capturar" element={<P4BCapturar />} />
        <Route path="identidad" element={<P4Identidad />} />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/registro" replace />} />
      </Route>
    </Routes>
  );
}
