// src/components/Tarjetas/TarjetaUsuario/TarjetaUsuario.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './tarjetaUsuario.module.css';
import defaultAvatar from './Usuario.png';
import noti from './noti.svg';
import TarjetaLateral from './TarjetaLateral';
import { logout } from '@/services/auth';

// --- Hook simple para bloquear el scroll del body ---
function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [locked]);
}

const TarjetaUsuario = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);
  const [nombre, setNombre] = useState('Usuario');
  const [correo, setCorreo] = useState('');
  const inputFileRef = useRef(null);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('perfil_min');
      if (raw) {
        const p = JSON.parse(raw);
        const fullName =
          (p?.first_name && p?.last_name && `${p.first_name} ${p.last_name}`) ||
          p?.nombre || 'Usuario';
        setNombre(fullName);
        if (p?.email) setCorreo(p.email);
      }
    } catch {}
  }, []);

  // accesibilidad: cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const openPanel  = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);

  const onChangePhotoClick = () => inputFileRef.current?.click();

  const onSelectFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // subir cuando el back esté listo
  };

  const onLogout = async () => {
    try { await logout(); } catch {}
    finally {
      localStorage.removeItem('auth_ready');
      localStorage.removeItem('perfil_min');
      window.location.assign('/panel/login');
    }
  };

  return (
    <div className={styles.cntTarjetaUsuario}>
      <p className={styles.hola}>Hola, Alex</p>
      <div className={styles.datosUsuario}>
        <div className={styles.idPerfil}>
          <img className={styles.noti} src={noti} alt="noticia" />
          
        </div>

        {/* FOTO → abre panel lateral */}
        <button
          type="button"
          className={styles.imgUsuarioBtn}
          onClick={openPanel}
          aria-haspopup="dialog"
          aria-expanded={isOpen ? 'true' : 'false'}
          title="Abrir panel de usuario"
        >
          <img className={styles.imgUsuario} src={avatarUrl} alt="Foto de perfil" />
        </button>

        <input
          ref={inputFileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onSelectFile}
        />
        <span className={styles.nombreUsuario}>{nombre}</span>
      </div>

      {/* PANEL LATERAL + OVERLAY */}
      <TarjetaLateral
        isOpen={isOpen}
        onClose={closePanel}
        estados={['e1']}           // puedes pasar dinámico
        nombre={nombre}
        correo={correo}
        onLogout={onLogout}
        onChangePhoto={onChangePhotoClick}
      />
    </div>
  );
};

export default TarjetaUsuario;
