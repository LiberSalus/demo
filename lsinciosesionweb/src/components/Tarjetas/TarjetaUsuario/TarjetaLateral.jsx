// src/components/Tarjetas/TarjetaUsuario/TarjetaLateral.jsx
import React, { useEffect, useRef } from 'react';
import styles from './tarjetaLateral.module.css';
import { ESTADOS } from './estados.config';
import ProgresoTU from './ProgresoTU';
import ProgresoCuestionario from './ProgresoCuestionario';

import lapiz from './icoLapiz.svg';
//import perfil from './perfil.png';
import user from './UserMan.png'
import any from './any.svg';

const TarjetaLateral = ({
  isOpen = false,
  onClose = () => {},
  estados = ['e1'],
  nombre = 'Usuario',
  correo = 'correo@dominio.com',
  onLogout = () => {},
  onChangePhoto = () => {},
}) => {
  const conexion = Array.from(new Set(estados)).filter((e) => ESTADOS[e]);
  const closeBtnRef = useRef(null);

  // Enfocar el botón "Cerrar" al abrir (accesibilidad)
  useEffect(() => {
    if (isOpen) closeBtnRef.current?.focus();
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    // Evita que el clic dentro del panel cierre
    if (e.target.dataset.overlay) onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        data-overlay
        onClick={handleOverlayClick}
        aria-hidden={!isOpen}
      />

      {/* Panel */}
      <aside
        className={`${styles.panel} ${isOpen ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Panel de usuario"
      >
        {/* Barra superior */}
        <div className={styles.panelHeader}>
          {/* <h2 className={styles.title}>Tu cuenta</h2> */}
          <button
            ref={closeBtnRef}
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar panel"
          >
            ✕
          </button>
        </div>

        {/* Estado en línea */}
        <div className={styles.cntEstado}>
          {conexion.map((code) => {
            const cfg = ESTADOS[code];
            const colorClass = styles[cfg.color] || styles.porDefecto;
            return (
              <div key={cfg.id} className={`${styles.pill} ${colorClass}`}>
                <p className={styles.txto}>
                  {cfg.txt} <span className={styles.bola}>•</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Foto + progreso circular */}
        <div className={styles.cntFoto}>
          <ProgresoTU porcentaje={40} />
          <div className={styles.foto}>
            <img src={user} alt="foto de perfil de usuario" />
            <button
              type="button"
              className={styles.lapizBtn}
              onClick={onChangePhoto}
              title="Cambiar foto de perfil"
            >
              <img src={lapiz} className={styles.lapiz} alt="" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className={styles.cntInfo}>
          <p className={styles.infoStrong}>{nombre}</p>
          <p className={styles.infoMuted}>{correo}</p>
          <p className={styles.infoMuted}>Última sesión: 02/10/2025 01:27 pm</p>
          <p className={styles.infoWarn}>Por favor completa tu perfil</p>
        </div>

        <hr className={styles.hr} />

        {/* Opciones */}
        <nav className={styles.cntOpciones}>
          <ul>
            <li>
              <a href="#">Vinculación con Ani</a>
              <img src={any} alt="" />
            </li>
            <li>
              <a href="#">Mi Cuenta</a>
              <img src={any} alt="" />
            </li>
            <li>
              <a href="#">Mi Perfil</a>
              <img src={any} alt="" />
            </li>
          </ul>
        </nav>

        <hr className={styles.hr} />

        {/* Progresos de cuestionarios */}
        <div className={styles.cntAccesos}>
          <ProgresoCuestionario cuesTit="Cuestionario A" porcentaje={5} />
          <ProgresoCuestionario cuesTit="Cuestionario B" porcentaje={25} />
          <ProgresoCuestionario cuesTit="Cuestionario C" porcentaje={50} />
          <ProgresoCuestionario cuesTit="Cuestionario D" porcentaje={75} />
          <ProgresoCuestionario cuesTit="Cuestionario E" porcentaje={100} />
        </div>

        {/* Cerrar sesión */}
        <div className={styles.cntCierre}>
          <button type="button" onClick={onLogout} className={styles.logoutBtn}>
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default TarjetaLateral;
