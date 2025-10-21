// src/components/V5BCompletarDom/V5BCompletarDom.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/AppRouter";

import styles from "@/components/V5ACompletarIne/v5bcompletarDom.module.css"; /* crea o reutiliza */
import Logo from "@/components/ElementosVista/Logo/Logo";
import TextoPrincipal from "@/components/ElementosVista/TextoPrincipal/TextoPrincipal";
import TextoSecundario from "@/components/ElementosVista/TextoSecundario/TextoSecundario";
import FormularioDom from "@/components/Formulario/FormularioDom";

const V5BCompletarDom = () => {
  const navigate = useNavigate();

  const handleSuccess = () => navigate(ROUTES.INVITACION_DOC);

  return (
    <div className={styles.cntV5ACompletarDom}>
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

        <div className={styles.cntFormulario}>
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
              <p className={styles.paso}>
                Completa tus cuestionarios de saliud
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.cntFormulario}>
        <div className={styles.cntLogo}>
          <Logo />
        </div>

        <div className={styles.cntTexto}>
          <TextoPrincipal textoPrincipal="Completa tus datos" />
          <TextoSecundario textoSecundario="Datos de tu domicilio" />
        </div>

        <div className={styles.cntFormulario}>
          <FormularioDom onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};
export default V5BCompletarDom;
