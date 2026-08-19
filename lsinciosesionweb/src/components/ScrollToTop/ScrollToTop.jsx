import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resetea el scroll al tope cada vez que cambia la ruta.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Tambien resetea el scroll del contenedor principal si existe
    const main = document.querySelector("main");
    if (main) main.scrollTop = 0;
  }, [pathname]);

  return null;
}
