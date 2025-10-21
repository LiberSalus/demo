// src/components/V4ConfExito/V4ConfExito.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/AppRouter";
import styles from "./v4confExito.module.css";
import Logo from "@/components/ElementosVista/Logo/Logo";
import TextoPrincipal from "@/components/ElementosVista/TextoPrincipal/TextoPrincipal";
import srcPaloma from "./confirmacion.svg";
import BotonA from "../Botones/BotonA";

const V4ConfExito = () => {
  const { state: locationState } = useLocation(); // { id, correo, telefono, ... }
  const navigate = useNavigate();

  // 🧩 Normalización del estado inicial
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
    if (Number.isFinite(initial.id) && initial.id > 0) {
      sessionStorage.setItem("ls:id_pre", String(initial.id));
    } else {
      navigate(ROUTES.REGISTRO, { replace: true });
    }
    // 🧹 Limpia restos de verificación
    sessionStorage.removeItem("ls:code_expires_at");
  }, [initial.id, navigate]);

  const handleContinuar = () => {
    if (!state?.id) return;
    navigate(ROUTES.COMPROBAR_IDENTIDAD, { state, replace: true });
  };

  return (
    <div className={styles.cntV4ConfExito}>
      {/* 🩵 Columna izquierda */}
      <div className={styles.cntBienvenida}>
        <div className={styles.cntSaludo}>
          <div>
            <p>¡Bienvenido a <br /> Liber Salus!</p>
            <p>Afíliate y toma el control de <br /> tu bienestar</p>
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
              Crea tu usuario: <br /> Llena tus datos personales.
            </p>
          </div>
          <div className={styles.elementoPaso}>
            <p className={styles.paso}>
              Sube tus documentos: <br /> CURP, INE y comprobante de domicilio
            </p>
          </div>
          <div className={styles.elementoPaso}>
            <p className={styles.paso}>Completa tus cuestionarios de salud</p>
          </div>
        </div>
      </div>

      {/* 💎 Columna derecha */}
      <div className={styles.cntConfExito}>
        <div className={styles.cntLogo}><Logo /></div>

        <TextoPrincipal textoPrincipal="¡Tu cuenta está casi lista!" />
        <p>
          Completa tus formularios con tus datos para activar tu perfil y
          disfrutar una experiencia segura y personalizada.
        </p>

        <div className={styles.cntPaloma}>
          <img src={srcPaloma} alt="Confirmación exitosa" className={styles.paloma} />
        </div>

        <BotonA
          type="button"
          onClick={handleContinuar}
          disabled={!state?.id}
        >
          Continuar
        </BotonA>

        {/* 👇 Solo visible en modo desarrollo */}
        {import.meta.env.DEV && state?.id && (
          <p style={{
            marginTop: "1rem",
            fontSize: "0.9rem",
            color: "#777",
            textAlign: "center",
            fontFamily: "monospace"
          }}>
            🧩 ID de preregistro: <strong>{state.id}</strong>
          </p>
        )}

        <div className={styles.derechosPie}>
          <p className={styles.derechos}>
            © 2025 Liber Salus. Este sitio está protegido por derechos de autor.
            <br />
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default V4ConfExito;
