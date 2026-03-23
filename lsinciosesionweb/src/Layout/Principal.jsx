// src/Layout/Principal.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header/Header";
import MainMenu from "@/components/Header/menu/Menu";
import Footer from "@/components/Footer/Footer";
import styles from "./principal.module.css";
import BackgroundPanel from "@/components/background/backgroundPanel/BackgroundPanel";


export default function Principal({ children }) {

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

  const content = children ?? <Outlet />;

  return (
    <div className={styles.shell}>
      <div className={styles.bg}>
        <BackgroundPanel esMujer={esMujer} />
      </div>

      <aside className={styles.sidebar}>
        <MainMenu />
      </aside>

      <header className={styles.header}>
        <Header />
      </header>

      <main className={styles.content}>
        <div className={styles.contentInner}>
          {content}
        </div>
      </main>
        <div className={styles.footer}>
          <Footer />
        </div>
    </div>
  );
}
