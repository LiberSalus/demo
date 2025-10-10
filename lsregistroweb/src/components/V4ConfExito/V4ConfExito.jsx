import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/AppRouter';
import styles from './v4confExito.module.css';
import Logo from '@/components/ElementosVista/Logo/Logo';
import TextoPrincipal from '@/components/ElementosVista/TextoPrincipal/TextoPrincipal';
import srcPaloma from './palomita.svg';

const V4ConfExito = () => {
  const { state } = useLocation();  // { id, correo, telefono, ... }
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.id) {
      const backup = Number(sessionStorage.getItem('ls:id_pre'));
      if (!backup) return navigate(ROUTES.REGISTRO, { replace: true });
      state.id = backup; // completa el state
    }
    const t = setTimeout(() => {
      navigate(ROUTES.COMPROBAR_IDENTIDAD, { state, replace: true });
    }, 2000);
    return () => clearTimeout(t);
  }, [navigate, state]);

  return (
    <div className={styles.cntConfExito}>
      <div className={styles.cntLogo}><Logo /></div>
      <TextoPrincipal textoPrincipal="Confirmación exitosa" />
      <div className={styles.cntPaloma}>
        <img src={srcPaloma} alt="Éxito" className={styles.paloma} />
      </div>
    </div>
  );
};
export default V4ConfExito;
