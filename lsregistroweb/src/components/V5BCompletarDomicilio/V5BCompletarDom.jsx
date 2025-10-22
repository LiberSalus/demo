// src/components/V5BCompletarDomicilio/V5BCompletarDom.jsx
import React, { useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/AppRouter";

import styles from "./v5bcompletarDom.module.css";
import Logo from "@/components/ElementosVista/Logo/Logo";
import TextoPrincipal from "@/components/ElementosVista/TextoPrincipal/TextoPrincipal";
import TextoSecundario from "@/components/ElementosVista/TextoSecundario/TextoSecundario";
import FormularioDom from "@/components/Formulario/FormularioDom";
import { motion } from "framer-motion";

const V5BCompletarDom = () => {
  const { state: locState } = useLocation(); // { id } opcional
  const navigate = useNavigate();

  // Normaliza id: primero state.id, si no, sessionStorage
  const preregId = useMemo(() => {
    const s = Number(locState?.id);
    if (Number.isFinite(s) && s > 0) return s;
    const ss = Number(sessionStorage.getItem("ls:id_pre"));
    return Number.isFinite(ss) && ss > 0 ? ss : null;
  }, [locState?.id]);

  useEffect(() => {
    if (!preregId) {
      navigate(ROUTES.REGISTRO, { replace: true });
      return;
    }
    sessionStorage.setItem("ls:id_pre", String(preregId));
  }, [preregId, navigate]);

  const handleSuccess = () =>
  navigate(ROUTES.RECIBIDOS, { state: { id: preregId }, replace: true });

  return (
    <div className={styles.cntV5BCompletarDom}>
      <div className={styles.cntBienvenida}>
        <div className={styles.cntSaludo}>
          <div>
            <p>¡Bienvenido a <br /> Liber Salus!</p>
            <p>Afíliate y toma el control de <br /> tu bienestar</p>
            <p>Para comenzar a usar nuestra plataforma, necesitas crear un usuario y afiliarte.<br/>Este proceso es sencillo y sólo toma 3 pasos:</p>
          </div>
        </div>
        <div className={styles.cntPasos}>
          <div className={styles.elementoPaso}><p className={styles.paso}>Crea tu usuario:<br/>Llena tus datos personales.</p></div>
          <div className={styles.elementoPaso}><p className={styles.paso}>Sube tus documentos:<br/>CURP, INE y comprobante de domicilio</p></div>
          <div className={styles.elementoPaso}><p className={styles.paso}>Completa tus cuestionarios de salud</p></div>
        </div>
      </div>

      <div className={styles.cntFormulario}>
        <div className={styles.cntLogo}><Logo/></div>
        <div className={styles.cntTexto}>
          <TextoPrincipal textoPrincipal="Completa tus datos" />
          <TextoSecundario textoSecundario="Datos de tu domicilio" />
        </div>

        {/* Le pasamos el id por state para que el form no dependa de variables globales */}
        <motion.div
        initial={{ opacity: 0, x: 10 }} // cuando entra
        animate={{ opacity: 1, x: 0 }} // animación activa
        exit={{ opacity: 0, y: -30 }} // cuando sale
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={styles.cntFormulario}>
          <FormularioDom onSuccess={handleSuccess} state={{ id: preregId }} />
        </motion.div>
      </div>
    </div>
  );
};

export default V5BCompletarDom;
