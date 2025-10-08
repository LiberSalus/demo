import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/AppRouter';
import styles from './v5acompletarIne.module.css';
import Logo from '@/components/ElementosVista/Logo/Logo';
import TextoPrincipal from '@/components/ElementosVista/TextoPrincipal/TextoPrincipal';
import TextoSecundario from '@/components/ElementosVista/TextoSecundario/TextoSecundario';
import FormularioINE from '@/components/Formulario/FormularioINE';

const V5ACompletarIne = () => {
  const { state } = useLocation(); // { id, ... }
  const navigate = useNavigate();

  if (!state?.id) {
    // fallback suave
    const backup = Number(sessionStorage.getItem('ls:id_pre'));
    if (!backup) navigate(ROUTES.REGISTRO, { replace: true });
  }

  // El propio FormularioINE hará navigate a DOMICILIO
  const handleSuccess = () => navigate(ROUTES.COMPLETAR_DOMICILIO, { state });

  return (
    <div className={styles.cntV5ACompletarIne}>
      <div className={styles.cntLogo}><Logo /></div>
      <div className={styles.cntTexto}>
        <TextoPrincipal textoPrincipal="Completa tus datos" />
        <TextoSecundario textoSecundario="Datos de tu identificación oficial" />
      </div>
      <div className={styles.cntFormulario}>
        <FormularioINE onSuccess={handleSuccess} />
      </div>
    </div>
  );
};
export default V5ACompletarIne;
