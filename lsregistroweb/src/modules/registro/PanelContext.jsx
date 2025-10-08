// src/modules/registro/PanelContext.jsx
import { createContext, useContext, useState } from "react";

const PanelCtx = createContext(null);

const defaultPanel = {
  badge: "¡Bienvenido a",
  title: "Libersalus!",
  subtitle: "Afíliate y toma control de tu bienestar.",
  bullets: [
    "Crea tu cuenta en 3 pasos.",
    "Usa tus datos personales.",
    "Confirma tu información de contacto.",
  ],
  illustration: null,
};

// 👇 Export nombrado: PanelProvider
export function PanelProvider({ children }) {
  const [panel, setPanel] = useState(defaultPanel);
  return (
    <PanelCtx.Provider value={{ panel, setPanel }}>
      {children}
    </PanelCtx.Provider>
  );
}

// 👇 Export nombrado: usePanel
export function usePanel() {
  const ctx = useContext(PanelCtx);
  if (!ctx) throw new Error("usePanel debe usarse dentro de <PanelProvider/>");
  return ctx;
}

// (opcional) export default del contexto, por si algún día lo necesitas
export default PanelCtx;
