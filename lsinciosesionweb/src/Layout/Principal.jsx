// src/Layout/Principal.jsx
import { Outlet } from "react-router-dom";
import Header from "@/components/Header/Header";
import MainMenu from "@/components/Header/menu/Menu";
import Footer from "@/components/Footer/Footer";
import IndicadorDemo from "@/components/IndicadorDemo/IndicadorDemo";
import styles from "./principal.module.css";
import useSesionActiva from "@/hooks/useSesionActiva";


export default function Principal({ children }) {
  const { estadoConexion, decodedSesion } = useSesionActiva();
  const content = children ?? <Outlet />;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <MainMenu />
      </aside>

      <header className={styles.header}>
        <Header estados={[estadoConexion]} sesion={decodedSesion} />
      </header>

      <IndicadorDemo />

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
