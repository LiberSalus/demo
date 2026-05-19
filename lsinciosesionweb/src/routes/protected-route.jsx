// src/routes/protected-route.jsx
import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import {
  EVENTO_SESION_NO_AUTORIZADA,
  estaAutenticado,
  iniciarSesionDevDesdeUrl,
} from "@/services/auth";

export default function ProtectedRoute() {
  iniciarSesionDevDesdeUrl();
  const [versionSesion, setVersionSesion] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const actualizarSesion = () => setVersionSesion((valor) => valor + 1);

    window.addEventListener(EVENTO_SESION_NO_AUTORIZADA, actualizarSesion);
    window.addEventListener("storage", actualizarSesion);

    return () => {
      window.removeEventListener(EVENTO_SESION_NO_AUTORIZADA, actualizarSesion);
      window.removeEventListener("storage", actualizarSesion);
    };
  }, []);

  // Fuerza el recálculo de `estaAutenticado` cuando otro flujo limpia la sesión.
  void versionSesion;

  const isLogged = estaAutenticado();

  if (!isLogged) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
