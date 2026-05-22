import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./menu.module.css";
import { ROUTES } from "@/config/routes";
import logoLSMenuMob from './LogoLSMenuMob.svg'

import LogoLSDes from "./LogoLSDescarga.svg";
import cerrar from '@/shared/assets/icons/general/cerrar.svg'

import inicio from "./icoInicio.svg";
import miSalud from "./icoMiSalud.svg";
import miCuidado from "./icoMiCuidado.svg";
import monitor from "./icoMonitor.svg";
import franky from "./icoFranky.svg";
import any from "./icoAny.svg"
import tami from "./icoTami.svg"

import activeInicio from './icoActiveInicio.svg'
import activeMiSalud from './icoActiveMiSalud.svg'
import activeMiCuidado from './icoActiveMiCuidado.svg'
import activeMonitor from './icoActiveMonitor.svg'
import activeFranky from './icoActiveFranky.svg'
import activeAny from './icoActiveAny.svg'
import activeTami from './icoActiveTami.svg'

const links = [
  { id: "INICIO", 
    to: ROUTES.INICIO,
    label: "Inicio", 
    icon: inicio, 
    activeIcon: activeInicio },
  {
    id: "SOBRE_MI",
    to: ROUTES.SOBRE_MI,
    label: "Mi salud a través del tiempo",
    icon: miSalud,
    activeIcon: activeMiSalud,
  },
  {
    id: "AREAS",
    to: ROUTES.AREAS,
    label: "Mi cuidado diario ",
    icon: miCuidado,
    activeIcon: activeMiCuidado,
  },
  { id: "MONITOR", 
    to: ROUTES.MONITOR, 
    label: "Monitor de salud", 
    icon: monitor, 
    activeIcon: activeMonitor, 
  },
  { id: "FRANKY", 
    to: ROUTES.FRANKY, 
    label: 
    "Franky te acompaña", 
    icon: franky, 
    activeIcon: activeFranky 
  },
  { id: "ANY", 
    to: ROUTES.ANY, 
    label: 
    "Any", 
    icon: any, 
    activeIcon: activeAny 
  },
  { id: "DUDAS", to: ROUTES.DUDAS, label: "TAMI", icon: tami, activeIcon: activeTami },
];

export default function Menu({ isOpen, onClose, breakpoint = 1028, mobileOnly = false }) {
  const HOVER_CLOSE_DELAY_MS = 180;
  const [isMobile, setIsMobile] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [breakpoint]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const onDesktopEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setDesktopOpen(true);
  };

  const onDesktopLeave = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setDesktopOpen(false);
      closeTimerRef.current = null;
    }, HOVER_CLOSE_DELAY_MS);
  };

  const menuClass = useMemo(() => {
    if (isMobile) return `${styles.menuMobile} ${isOpen ? styles.open : ""}`;
    return `${styles.menuDesktop} ${desktopOpen ? styles.desktopOpen : ""}`;
  }, [isMobile, isOpen, desktopOpen]);

  if (mobileOnly && !isMobile) {
    return null;
  }

  if (!isMobile) {
    return (
      <nav
        className={menuClass}
        aria-label="Menú principal"
        onMouseEnter={onDesktopEnter}
        onMouseLeave={onDesktopLeave}
        onFocus={onDesktopEnter}
        onBlur={onDesktopLeave}
      >
        <ul className={styles.list}>
          {links.map((item) => (
            <li key={item.id} className={styles.item}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={styles.icon}>
                      <img
                        className={styles.imgIco}
                        src={isActive ? (item.activeIcon || item.icon) : item.icon}
                        alt={item.label}
                      />
                    </span>
                    <span className={styles.text}>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.menuFoot}>

          <img src={LogoLSDes} alt="Liber Salus" />
          <p>Descarga nuestra App</p>
          <p>
            Descarga nuestra app y consulta tu información de salud en
            cualquier momento y desde cualquier lugar.
          </p>
          <button className={styles.footBtn}>Descarga App</button>

        </div>
      </nav>
    );
  }

  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={onClose} />}
      <aside className={menuClass} aria-label="Menú principal responsive">
        <div className={styles.mobileHeader}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <img src={cerrar} alt="Cerrar Menu" />
          </button>
          <img src={logoLSMenuMob} className={styles.mobileLogo} alt="Liber Salus" />
        </div>
        <hr className={styles.mobileDivider} />
        <ul className={styles.mobileList}>
          {links.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `${styles.mobileLink} ${isActive ? styles.mobileActive : ""}`
                }
                onClick={() => onClose?.()}
              >
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
