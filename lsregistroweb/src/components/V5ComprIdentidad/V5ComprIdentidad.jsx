// src/components/V5ComprIdentidad/V5ComprIdentidad.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/AppRouter";

import escanear from "../V5ComprIdentidad/Escanear.svg";
import anadir from "../V5ComprIdentidad/Añadir.svg";

import styles from "./v5comprIdentidad.module.css";
import Logo from "@/components/ElementosVista/Logo/Logo";
import TextoPrincipal from "@/components/ElementosVista/TextoPrincipal/TextoPrincipal";
import TextoSecundario from "@/components/ElementosVista/TextoSecundario/TextoSecundario";
import TarjetaBase from "@/components/ElementosVista/TarjetaBase/TarjetaBase";
import { motion } from "framer-motion";


const V5ComprIdentidad = () => {
  const { state: locationState } = useLocation(); // { id, ... }
  const navigate = useNavigate();

  // Normaliza estado con prioridad: state.id → sessionStorage → null
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
      setState((prev) => ({ ...prev, id: initial.id }));
    } else {
      // Si no hay id, vuelve al inicio de registro
      navigate(ROUTES.REGISTRO, { replace: true });
    }
  }, [initial.id, navigate]);

  return (
    <div className={styles.cntV5ComprIdentidad}>
      {/* Columna izquierda */}
      <div className={styles.cntBienvenida}>
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
            <p className={styles.paso}>Completa tus cuestionarios de salud</p>
          </div>
        </div>
      </div>

      {/* Columna derecha */}
      <div className={styles.cntFormulario}>
        <div className={styles.logoForm}>
          <Logo />
        </div>

        <div className={styles.cntTexto}>
          <TextoPrincipal textoPrincipal="Completa tu perfil" />
          <TextoSecundario
            textoSecundario={[
              "Llena tus datos o sube tus documentos (identificación oficial y comprobante de domicilio). ",
              "Así podremos confirmar tu identidad y ofrecerte una experiencia segura y personalizada.",
            ]}
          />
        </div>

        <motion.div
        initial={{ opacity: 0, y: 30 }} // cuando entra
          animate={{ opacity: 1, y: 0 }} // animación activa
          exit={{ opacity: 0, y: -30 }} // cuando sale
          transition={{ duration: 0.8, ease: "easeOut" }}
        className={styles.cntTarjeta}>
          <TarjetaBase
            srcIcon={escanear}
            iconAlt="Capturar datos"
            accion="Llena tus datos"
            descripcion="Completa los formularios de forma manual con tus datos para continuar."
            textoBoton="Capturar datos"
            onClick={() =>
                {const id = state?.id ?? Number(sessionStorage.getItem("ls:id_pre"));
              navigate(ROUTES.COMPLETAR_INE, { state: {...state, id} })/* 👈 */
            }}
          />

          <TarjetaBase
            srcIcon={anadir}
            iconAlt="Subir archivos"
            accion="Adjuntar archivos"
            descripcion={
              <>
                Adjunta una imagen o PDF. <br />
                Asegúrate que sea legible y completo.
              </>
            }
            textoBoton="Subir archivos"
            onClick={() =>
              navigate(ROUTES.ADJUNTAR_DOCUMENTOS, { state })
            }
          />
        </motion.div>

        {/* Solo en dev, muestra el id para pruebas */}
        {import.meta.env.DEV && state?.id && (
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.9rem",
              color: "#777",
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            🧩 ID de preregistro: <strong>{state.id}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default V5ComprIdentidad;
