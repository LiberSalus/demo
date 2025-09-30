import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Menu.module.css";
import { ROUTES } from "@/config/routes";

const MI_SALUD = [
  { to: ROUTES.SOBRE_MI,         label: "Sobre mi" },
  { to: ROUTES.HISTORIA_SALUD,   label: "Mi historia con la salud" },
  { to: ROUTES.FAMILIA_HERENCIA, label: "Mi familia y herencia" },
  { to: ROUTES.CUERPO_HISTORIA,  label: "Mi cuerpo y su historia" },
  { to: ROUTES.RESPONDE_CUIDATE, label: "Responde y cuídate" },
];

const MIS_CONSULTAS = [
  { to: ROUTES.SUSURROS,       label: "Susurros Salud" },
  { to: ROUTES.COMPRENSION,    label: "Comprensión de mi situación" },
  { to: ROUTES.PLAN_CUIDADO,   label: "Mi plan de cuidado" },
  { to: ROUTES.AVANCE,         label: "Cómo voy avanzando" },
  { to: ROUTES.PROXIMOS_PASOS, label: "Próximos pasos" },
  { to: ROUTES.LO_QUE_DICE,    label: "Lo que dice tu salud" },
  { to: ROUTES.AREAS,          label: "Áreas" },
];

const EXTRA = [
  { to: ROUTES.ANY,   label: "Any" },
  { to: ROUTES.FRANKY,label: "Franky" },
  { to: ROUTES.DUDAS, label: "Dudas frecuentes" },
];

export default function Menu() {
  const [expanded, setExpanded] = useState(false);          // ancho del menú
  const [openGroups, setOpenGroups] = useState({            // submenús abiertos
    miSalud: true,
    misConsultas: false,
    extra: false,
  });

  const toggleGroup = (key) =>
    setOpenGroups((s) => ({ ...s, [key]: !s[key] }));

  return (
    <nav
      className={`${styles.menu} ${expanded ? styles.expanded : styles.collapsed}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      aria-label="Menú principal"
      aria-expanded={expanded}
    >
      {/* Cabecera */}
      <div className={styles.logoRow}>
        <span className={styles.brand} aria-hidden={!expanded}>Liber Salus</span>
      </div>

      {/* Grupo: Mi Salud */}
      <div className={styles.group}>
        <button
          type="button"
          className={styles.groupHeader}
          onClick={() => toggleGroup("miSalud")}
          aria-expanded={openGroups.miSalud}
        >
          <span className={styles.linkText}>Mi Salud</span>
          <span className={`${styles.chev} ${openGroups.miSalud ? styles.chevOpen : ""}`} />
        </button>

        <ul className={`${styles.subList} ${openGroups.miSalud ? styles.subOpen : styles.subClosed}`}>
          {MI_SALUD.map((l) => (
            <li key={l.to} className={styles.item}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
                title={l.label}
              >
                <span className={styles.bullet} />
                <span className={styles.linkText}>{l.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Grupo: Mis Consultas */}
      <div className={styles.group}>
        <button
          type="button"
          className={styles.groupHeader}
          onClick={() => toggleGroup("misConsultas")}
          aria-expanded={openGroups.misConsultas}
        >
          <span className={styles.linkText}>Mis Consultas</span>
          <span className={`${styles.chev} ${openGroups.misConsultas ? styles.chevOpen : ""}`} />
        </button>

        <ul className={`${styles.subList} ${openGroups.misConsultas ? styles.subOpen : styles.subClosed}`}>
          {MIS_CONSULTAS.map((l) => (
            <li key={l.to} className={styles.item}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
                title={l.label}
              >
                <span className={styles.bullet} />
                <span className={styles.linkText}>{l.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Grupo: Extra */}
      <div className={styles.group}>
        <button
          type="button"
          className={styles.groupHeader}
          onClick={() => toggleGroup("extra")}
          aria-expanded={openGroups.extra}
        >
          <span className={styles.linkText}>Otros</span>
          <span className={`${styles.chev} ${openGroups.extra ? styles.chevOpen : ""}`} />
        </button>

        <ul className={`${styles.subList} ${openGroups.extra ? styles.subOpen : styles.subClosed}`}>
          {EXTRA.map((l) => (
            <li key={l.to} className={styles.item}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
                title={l.label}
              >
                <span className={styles.bullet} />
                <span className={styles.linkText}>{l.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
