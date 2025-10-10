// src/components/V5BCompletarDom/V5BCompletarDom.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/AppRouter';

import styles from './v5acompletarIne.module.css';   /* crea o reutiliza */
import Logo            from '@/components/ElementosVista/Logo/Logo';
import TextoPrincipal  from '@/components/ElementosVista/TextoPrincipal/TextoPrincipal';
import TextoSecundario from '@/components/ElementosVista/TextoSecundario/TextoSecundario';
import FormularioDom   from '@/components/Formulario/FormularioDom';

const V5BCompletarDom = () => {
  const navigate = useNavigate();

  const handleSuccess = () => navigate(ROUTES.INVITACION_DOC);

  return (

    <>
    <div className={styles.bienvenida}></div>
    <div className={styles.cntV5ACompletarIne}>
      <div className={styles.cntLogo}><Logo /></div>

      <div className={styles.cntTexto}>
        <TextoPrincipal textoPrincipal="Completa tus datos" />
        <TextoSecundario textoSecundario="Datos de tu domicilio" />
      </div>

      <div className={styles.cntFormulario}>
        <FormularioDom onSuccess={handleSuccess} />
      </div>
    </div>
    </>
  );
};
export default V5BCompletarDom;
