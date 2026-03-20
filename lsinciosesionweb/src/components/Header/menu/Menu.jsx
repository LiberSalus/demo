import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./menu.module.css";
import { ROUTES } from "@/config/routes";
import logoLSMenuMob from './LogoLSMenuMob.svg'

import LogoLSDes from "./LogoLSDescarga.svg";
import cerrar from './icoCerrar.svg'

import inicio from "./icoInicio.svg";
import salud from "./icoSalud.svg";
import consultas from "./icoConsultas.svg";
import any from "./icoAny.svg";
import franky from "./icoFranky.svg";
import dudas from "./icoDudas.svg";

import activeInicio from './icoActiveInicio.svg'
import activeSalud from './icoActiveSalud.svg'
import activeConsultas from './icoActiveConsulta.svg'
import activeAny from './icoActiveAny.svg'
import activeFranky from './icoActiveFranky.svg'
import activeDudas from './icoActiveDudas.svg'

const links = [
  { id: "inicio", to: ROUTES.INICIO, label: "Inicio", icon: inicio, activeIcon: activeInicio },
  {
    id: "salud",
    to: ROUTES.SOBRE_MI,
    label: "Mi salud",
    icon: salud,
    activeIcon: activeSalud,
  },
  {
    id: "consultas",
    to: ROUTES.AREAS,
    label: "Mis consultas",
    icon: consultas,
    activeIcon: activeConsultas,
  },
  { id: "any", to: ROUTES.ANY, label: "Any", icon: any, activeIcon: activeAny },
  { id: "franky", to: ROUTES.FRANKY, label: "Franky", icon: franky, activeIcon: activeFranky },
  { id: "dudas", to: ROUTES.DUDAS, label: "Dudas frecuentes", icon: dudas, activeIcon: activeDudas },
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
            <img src={cerrar} alt="Cerrar Menu"/>
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
