// src/Layout/Principal.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Menu from "@/components/menu/Menu";
import styles from "./principal.module.css";
import TarjetaUsuario from "@/components/Tarjetas/TarjetaUsuario/TarjetaUsuario";
import BackgroundPanel from "@/components/background/backgroundPanel/BackgroundPanel";


export default function Principal() {

  const [esMujer, setEsMujer] = useState(true);

  const leerPerfil = useCallback(() => {
    try {
      const raw = localStorage.getItem("perfil_min");
      if (!raw) return;

      const p = JSON.parse(raw);
      const sexo = p?.sexo || p?.genero || p?.gender;

      if (sexo) {
        const s = String(sexo).toLowerCase();
        const mujer =
          s === "f" || s === "mujer" || s === "femenino" || s === "female";
        setEsMujer(mujer);
      }
    } catch {
      // nada
    }
  }, []);

  useEffect(() => {
  leerPerfil(); // al montar

  const handler = (e) => {
    const v = e?.detail?.esMujer;

    if (typeof v === "boolean") {
      setEsMujer(v);      // ✅ directo desde Inicio
    } else {
      leerPerfil();       // fallback por si no viene detail
    }
  };

  window.addEventListener("perfil_min_updated", handler);

  return () => window.removeEventListener("perfil_min_updated", handler);
}, [leerPerfil]);
  return (
    <div className={styles.shell}>
      
      <div className={styles.bg}>
        <BackgroundPanel esMujer={esMujer} />
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
