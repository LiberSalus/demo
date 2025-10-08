import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { ROUTES } from '@/routes/AppRouter';
import styles from './v2confirmacion.module.css';
import Logo from '@/components/ElementosVista/Logo/Logo';
import BotonA from '@/components/Botones/BotonA';
import TextoPrincipal from '@/components/ElementosVista/TextoPrincipal/TextoPrincipal';
import TextoSecundario from '@/components/ElementosVista/TextoSecundario/TextoSecundario';

const V2Confirmacion = () => {
  const { state } = useLocation();          // { correo, telefono, ... }
  const navigate = useNavigate();
  const [metodo, setMetodo] = useState(''); // 'correo' | 'telefono'
  const [loading, setLoading] = useState(false);

  const maskPhone = (tel='') => tel ? `•••• ••• • ${String(tel).slice(-4)}` : '';
  const maskMail  = (mail='') => {
    if (!mail.includes('@')) return '';
    const [u,d] = mail.split('@');
    return `${u?.[0] || ''}••••@${d}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!metodo) return;
    try {
      setLoading(true);
      await api.post(`/preregistro/preregistro/enviar-codigo-${metodo}/`, {
        identificador: state?.[metodo],
      });
      navigate(ROUTES.VERIFICACION, { state: { ...state, metodo } });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'No se pudo enviar el código.';
      alert(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cntConfirmacion}>
      <div className={styles.cntLogo}><Logo /></div>

      <div className={styles.cntTextos}>
        <TextoPrincipal textoPrincipal="Confirmemos tu información de contacto" />
        <TextoSecundario textoSecundario={[
          "Elige a dónde enviaremos tu código de verificación.",
          <br key="1" />, "Así validamos tus datos y protegemos tu cuenta."
        ]}/>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.fieldset}>
          <div className={styles.input}>
            <input
              type="radio" id="correo" name="metodo" value="correo"
              checked={metodo==='correo'} onChange={()=>setMetodo('correo')}
            />
            <label htmlFor="correo">
              Enviar a e-mail:<br/>
              <span className={styles.datos}>{maskMail(state?.correo)}</span>
            </label>
          </div>

          <div className={styles.input}>
            <input
              type="radio" id="telefono" name="metodo" value="telefono"
              checked={metodo==='telefono'} onChange={()=>setMetodo('telefono')}
            />
            <label htmlFor="telefono">
              Enviar por SMS:<br/>
              <span className={styles.datos}>{maskPhone(state?.telefono)}</span>
            </label>
          </div>

          <div>
            <BotonA type="submit" disabled={!metodo || loading}>
              {loading ? 'Enviando…' : 'Enviar código'}
            </BotonA>
          </div>
        </fieldset>

        <p>¿Tu información no es correcta? </p>
        <a onClick={()=> navigate(-1)} className={styles.volver}>Volver a registro</a>
      </form>
    </div>
  );
};
export default V2Confirmacion;
