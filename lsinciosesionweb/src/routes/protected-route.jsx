import { Outlet, Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/config/routes";

export default function ProtectedRoute() {
  const isLogged = Boolean(localStorage.getItem("auth_ready"));
  const location = useLocation();
  if (!isLogged) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
