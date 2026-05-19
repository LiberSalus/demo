// src/routes/protected-route.jsx
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { isAuthenticated } from "@/services/auth";

export default function ProtectedRoute() {
  const isLogged = isAuthenticated();
  const location = useLocation();
  if (!isLogged) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
