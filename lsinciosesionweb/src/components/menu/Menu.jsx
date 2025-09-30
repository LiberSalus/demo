// src/components/menu/Menu.jsx
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Menu.module.css";
import { ROUTES } from "@/config/routes";

import HomeIcon from '@mui/icons-material/Home';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import MotionPhotosAutoIcon from '@mui/icons-material/MotionPhotosAuto';
import FiberSmartRecordIcon from '@mui/icons-material/FiberSmartRecord';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import IconMenu from './LSlogoMenu.png'

const links = [
  { to: ROUTES.INICIO, label: "Inicio", icon: <HomeIcon/> },
  {
    label: "Mi Salud",
    icon: <HealthAndSafetyIcon/>,
    children: [
      { to: ROUTES.SOBRE_MI, label: "Sobre mí" },
      { to: ROUTES.HISTORIA_SALUD, label: "Mi historia con la salud" },
      { to: ROUTES.FAMILIA_HERENCIA, label: "Mi familia y herencia" },
      { to: ROUTES.CUERPO_HISTORIA, label: "Mi cuerpo y su historia" },
      { to: ROUTES.RESPONDE_CUIDATE, label: "Responde y cuídate" },
    ],
  },
  {
    label: "Mis Consultas",
    icon: <ManageSearchIcon/>,
    children: [
      { to: ROUTES.SUSURROS, label: "Susurros Salud" },
      { to: ROUTES.COMPRENSION, label: "Comprensión de mi situación" },
      { to: ROUTES.PLAN_CUIDADO, label: "Mi plan de cuidado" },
      { to: ROUTES.AVANCE, label: "Cómo voy avanzando" },
      { to: ROUTES.PROXIMOS_PASOS, label: "Próximos pasos" },
      { to: ROUTES.LO_QUE_DICE, label: "Lo que dice tu salud" },
      { to: ROUTES.AREAS, label: "Áreas" },
    ],
  },
  { to: ROUTES.ANY, label: "Any", icon: <MotionPhotosAutoIcon/> },
  { to: ROUTES.FRANKY, label: "Franky", icon: <FiberSmartRecordIcon/> },
  { to: ROUTES.DUDAS, label: "Dudas frecuentes", icon: <HelpCenterIcon/> },
];

export default function Menu() {
  const [expanded, setExpanded] = useState(false);
  const [openKey, setOpenKey] = useState(""); // <-- controla qué submenu está abierto
  const location = useLocation();

  // cierra submenús cuando cambia la ruta (por si quedó abierto)
  React.useEffect(() => { setOpenKey(""); }, [location.pathname]);

  return (
    <nav
      className={`${styles.menu} ${expanded ? styles.expanded : styles.collapsed}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => { setExpanded(false); setOpenKey(""); }}
      aria-label="Menú principal"
      aria-expanded={expanded}
    >
      <div className={styles.brand}>
        <img src={IconMenu} className={styles.brandLogo} alt="Liber Salus" />
        <span className={styles.brandText}>Liber Salus</span>
      </div>

      <ul className={styles.list}>
        {links.map((item, idx) => {
          const hasChildren = !!item.children?.length;
          if (!hasChildren) {
            return (
              <li key={item.to || idx} className={styles.item}>
                <NavLink
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                  }
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.text}>{item.label}</span>
                </NavLink>
              </li>
            );
          }

          const isOpen = openKey === item.label;
          return (
            <li
              key={item.label}
              className={`${styles.item} ${styles.hasChildren} ${isOpen ? styles.open : ""}`}
              onMouseEnter={() => expanded && setOpenKey(item.label)}
              onMouseLeave={() => expanded && setOpenKey("")}
            >
              <button
                type="button"
                className={styles.parentBtn}
                onClick={() => setOpenKey(isOpen ? "" : item.label)}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.text}>{item.label}</span>
                <span className={styles.caret}>›</span>
              </button>

              <div className={styles.submenu}>
                {item.children.map((ch) => (
                  <div key={ch.to} className={styles.subItem}>
                    <NavLink
                      to={ch.to}
                      className={({ isActive }) =>
                        isActive ? `${styles.subLink} ${styles.activeSub}` : styles.subLink
                      }
                      onClick={() => setOpenKey("")} // <-- cierra al navegar
                    >
                      {ch.label}
                    </NavLink>
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
