// src/Layout/Principal.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Menu from "@/components/menu/Menu";
import styles from "./principal.module.css";
import TarjetaUsuario from "@/components/Tarjetas/TarjetaUsuario/TarjetaUsuario";
import BackgroundPanel from "@/components/background/backgroundPanel/BackgroundPanel";

export default function Principal() {
  return (
    <div className={styles.shell}>
      <div className={styles.bg}>
        <BackgroundPanel />
      </div>

      {/* Sidebar (fijo a la izquierda) */}
      <aside className={styles.sidebar}>
        <Menu />
      </aside>

      {/* Header (tarjeta usuario) */}
      <header className={styles.header}>
        <TarjetaUsuario />
      </header>

      {/* Contenido principal */}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
