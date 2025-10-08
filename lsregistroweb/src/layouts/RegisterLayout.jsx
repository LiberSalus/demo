// src/layouts/RegisterLayout.jsx
import { Outlet } from "react-router-dom";
import { PanelProvider } from "@/modules/registro/PanelContext.jsx";
import WelcomePanel from "@/modules/registro/WelcomePanel.jsx";
import DebugRegistroNav from "@/components/DebugRegistroNav.jsx"; // 👈 nombre corregido
import s from "./registerLayout.module.css";

export default function RegisterLayout() {
  return (
    <PanelProvider>
      <div className={s.shell}>
        {/* Panel izquierdo fijo */}
        <aside className={s.welcome}>
          <WelcomePanel />
        </aside>

        {/* Panel derecho dinámico */}
        <main className={s.main} role="main">
          <Outlet />

          {/* 👇 Navegador temporal para pruebas */}
          <DebugRegistroNav />
        </main>
      </div>
    </PanelProvider>
  );
}
