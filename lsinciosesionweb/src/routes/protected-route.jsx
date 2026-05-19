// src/routes/protected-route.jsx
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { estaAutenticado, iniciarSesionDevDesdeUrl } from "@/services/auth";

export default function ProtectedRoute() {
  iniciarSesionDevDesdeUrl();
  const isLogged = estaAutenticado();
  const location = useLocation();
  if (!isLogged) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
