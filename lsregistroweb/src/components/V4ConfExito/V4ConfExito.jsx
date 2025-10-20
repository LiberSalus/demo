//src\components\V4ConfExito\V4ConfExito.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/AppRouter';
import styles from './v4confExito.module.css';
import Logo from '@/components/ElementosVista/Logo/Logo';
import TextoPrincipal from '@/components/ElementosVista/TextoPrincipal/TextoPrincipal';
import srcPaloma from './confirmacion.svg';
import BotonA from '../Botones/BotonA';

const V4ConfExito = () => {
  const { state: locationState } = useLocation(); // { id, correo, telefono, ... }
  const navigate = useNavigate();
  const [state, setState] = useState(locationState);

  useEffect(() => {
    if (!locationState?.id) {
      const backup = Number(sessionStorage.getItem('ls:id_pre'));
      if (!backup) return navigate(ROUTES.REGISTRO, { replace: true });
      setState(prev => ({ ...prev, id: backup }));
    }
  }, [locationState, navigate]);

  const handleContinuar = () => {
    navigate(ROUTES.COMPROBAR_IDENTIDAD, { state, replace: true });
  };

  return (
    <div className={styles.cntV4ConfExito}>
      <div className={styles.cntBienvenida}>
        {/* <div className={styles.fondo}>
                            <LiberSalusPoly
                              autoMorph={true}        // morph automático
                              morphEveryMs={30}     // intervalo de morph
                              spray={false}            // triángulos sueltos
                              curveAlpha={0}        // opacidad ola superior
                              dirGlow={0.006}          // vignette/glow
                              className="w-full h-full"
                            />
                          </div> */}
        <div className={styles.cntSaludo}>
          <div>
            <p>
              ¡Bienvenido a <br /> Liber Salus!
            </p>
            <p>
              Afíliate y toma el control de <br /> tu bienestar
            </p>
            <p>
              Para comenzar a usar nuestra plataforma, necesitas crear un
              usuario y afiliarte.
              <br />
              Este proceso es sencillo y sólo toma 3 pasos:
            </p>
          </div>
        </div>

        <div className={styles.cntPasos}>
          <div className={styles.elementoPaso}>
            <p className={styles.paso}>
              Crea tu usuario: <br />
              Llena tus datos personales.
            </p>
          </div>
          <div className={styles.elementoPaso}>
            <p className={styles.paso}>
              Sube tus documentos: <br />
              CURP, INE y comprobante de domicilio
            </p>
          </div>
          <div className={styles.elementoPaso}>
            <p className={styles.paso}>Completa tus cuestionarios de saliud</p>
          </div>
        </div>
      </div>

      <div className={styles.cntConfExito}>
        
        <div className={styles.cntLogo}><Logo /></div>
        <TextoPrincipal textoPrincipal="¡Tu cuenta esta casi lista!" />
        <p>Completa tus formularios con tus datos para activar tu perfil y disfrutar una experiencia segura y personalizada.</p>
        <div className={styles.cntPaloma}>
          <img src={srcPaloma} alt="Éxito" className={styles.paloma} />
        </div>
        <BotonA variant="primary" size="md" onClick={handleContinuar}>
          Continuar
        </BotonA>

        <div className={styles.derechosPie}>
          <p className={styles.derechos}>
            © 2025 Liber Salus. Este sitio está protegido por derechos de autor.{" "}
            <br />
            Todos los derechos reservados.
          </p>
        </div>
      </div>



    </div>



  );
};

export default V4ConfExito;
