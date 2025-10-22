// src/components/V5ACompletarIne/V5ACompletarIne.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/AppRouter";
import styles from "./v5acompletarIne.module.css";
import Logo from "@/components/ElementosVista/Logo/Logo";
import TextoPrincipal from "@/components/ElementosVista/TextoPrincipal/TextoPrincipal";
import TextoSecundario from "@/components/ElementosVista/TextoSecundario/TextoSecundario";
import FormularioINE from "@/components/Formulario/FormularioINE";
import { motion } from "framer-motion";

const V5ACompletarIne = () => {
  const { state: locationState } = useLocation(); // { id, ... }
  const navigate = useNavigate();

  // Normaliza el id: state -> sessionStorage
  const initial = useMemo(() => {
    const fromState = Number(locationState?.id);
    const fromSS = Number(sessionStorage.getItem("ls:id_pre"));
    const id =
      Number.isFinite(fromState) && fromState > 0
        ? fromState
        : Number.isFinite(fromSS) && fromSS > 0
        ? fromSS
        : null;
    return { ...(locationState || {}), id };
  }, [locationState]);

  const [state, setState] = useState(initial);

  useEffect(() => {
    if (!state?.id) {
      navigate(ROUTES.REGISTRO, { replace: true });
      return;
    }
    sessionStorage.setItem("ls:id_pre", String(state.id));
  }, [state?.id, navigate]);

  // El propio FormularioINE hará navigate a DOMICILIO (te dejo callback igual)
  const handleSuccess = () =>
    navigate(ROUTES.COMPLETAR_DOMICILIO, { state: { id: state.id } });

  return (
    <div className={styles.cntV5ACompletarIne}>
      <div className={styles.cntBienvenida}>
        <div className={styles.cntSaludo}>
          <div>
            <p>¡Bienvenido a <br /> Liber Salus!</p>
            <p>Afíliate y toma el control de <br /> tu bienestar</p>
            <p>
              Para comenzar a usar nuestra plataforma, necesitas crear un
              usuario y afiliarte.<br />
              Este proceso es sencillo y sólo toma 3 pasos:
            </p>
          </div>
        </div>

        <div className={styles.cntPasos}>
          <div className={styles.elementoPaso}>
            <p className={styles.paso}>Crea tu usuario: <br /> Llena tus datos personales.</p>
          </div>
          <div className={styles.elementoPaso}>
            <p className={styles.paso}>Sube tus documentos: <br /> CURP, INE y comprobante de domicilio</p>
          </div>
          <div className={styles.elementoPaso}>
            <p className={styles.paso}>Completa tus cuestionarios de salud</p>
          </div>
        </div>
      </div>

      <div className={styles.cntFormulario}>
        <div className={styles.cntLogo}><Logo /></div>
        <div className={styles.cntTexto}>
          <TextoPrincipal textoPrincipal="Completa tus datos" />
          <TextoSecundario textoSecundario="Datos de tu identificación oficial" />
        </div>
        <motion.div
        initial={{ opacity: 0, y: 10 }} // cuando entra
        animate={{ opacity: 1, y: 0 }} // animación activa
        exit={{ opacity: 0, x: -30 }} // cuando sale
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={styles.formulario}>
          <FormularioINE onSuccess={handleSuccess} />
        </motion.div>

        {import.meta.env.DEV && state?.id && (
          <p style={{ marginTop: 12, textAlign: "center", color: "#777", fontFamily: "monospace" }}>
            🧩 ID de preregistro: <strong>{state.id}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default V5ACompletarIne;
