// src/components/V8Opciones/V8Opciones.jsx
import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import styles from "./v8opciones.module.css";
import Logo from "@/components/ElementosVista/Logo/Logo";
import TextoPrincipal from "@/components/ElementosVista/TextoPrincipal/TextoPrincipal";
import TarjetaOpcion from "@/components/ElementosVista/TarjetaOpcion/TarjetaOpcion";
import BotonA from "@/components/Botones/BotonA";

import interrogacion from "@/components/ElementosVista/TarjetaOpcion/question.svg";
import cabina from "@/components/ElementosVista/TarjetaOpcion/cabina.png";
import celular from "@/components/ElementosVista/TarjetaOpcion/celular.png";
import expediente from "@/components/ElementosVista/TarjetaOpcion/expediente.png";
import diagnostico from "@/components/ElementosVista/TarjetaOpcion/diagnostico.png";
import botiquin from "@/components/ElementosVista/TarjetaOpcion/botiquin.png";

// Variants para la animación de aparición en lista
const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, when: "beforeChildren" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

//base panel (lsinciosesion)

const PANEL_BASE = import.meta.env.DEV
  ? "http://192.168.100.9:5174/panel/"
  : (import.meta.env.VITE_PANEL_URL || "/panel"); // fallback

const V8Opciones = () => {
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);

// Nombre para el saludo (viene del state o de sessionStorage)
  const nombre = useMemo(() => {
    const s =
      state?.first_name ||
      state?.nombre ||
      state?.name;
    const ss =
      sessionStorage.getItem("ls:first_name") ||
      sessionStorage.getItem("ls:nombre");
    return (s || ss || "").toString().trim();
  }, [state]);

   // 👉 Ir al panel de inicio de sesión, mandando email (y opcionalmente nombre)
  const irAlPanel = () => {
  try {
    setLoading(true);

    // 1) Leemos de state y de sessionStorage
    const emailFromState =
      state?.email ||
      state?.correo ||
      state?.username ||
      "";

    const emailFromSession =
      sessionStorage.getItem("ls:correo") || "";

    const email = (emailFromState || emailFromSession).trim();

    const nombreFromSession =
      sessionStorage.getItem("ls:first_name") ||
      sessionStorage.getItem("ls:nombre") ||
      nombre;

    // Debug para ver qué está llegando
    console.log("[V8] email:", email, "nombre:", nombreFromSession);

    const params = new URLSearchParams();
    if (email) {
      params.set("email", email);
    }
    if (nombreFromSession) {
      params.set("name", nombreFromSession);
    }

    const base = PANEL_BASE;
    const url = params.toString()
      ? `${base}?${params.toString()}`
      : base;

    window.location.replace(url);
  } catch {
    setLoading(false);
  }
};



  return (
    <div className={styles.cntV8Opciones}>
      <div className={styles.cntLogo}><Logo /></div>
      <TextoPrincipal
        textoPrincipal={
          nombre ? `Hola ${nombre}, te damos la bienvenida a Liber Salus`
                 : "¡Te damos la bienvenida a Liber Salus!"
        }
      />
      <p className={styles.txt}>
        Comienza con alguna de las siguientes opciones que tenemos para ti
      </p>

      <motion.div
        className={styles.cntTarjetas}
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <TarjetaOpcion
            srcIcono={cabina}
            tituloTarjeta="Cabina médica FRANKY"
            descripcionTarjeta="Acude a una de nuestras cabinas móviles para recibir atención médica en tiempo real, además de tomar tus mediciones principales."
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TarjetaOpcion
            srcIcono={celular}
            tituloTarjeta="Asistente virtual AVI"
            descripcionTarjeta="Consulta a un especialista por streaming sin salir de casa."
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TarjetaOpcion
            srcIcono={expediente}
            tituloTarjeta="Expediente clínico"
            descripcionTarjeta="Centraliza tu información de salud y llévala siempre contigo."
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TarjetaOpcion
            srcIcono={diagnostico}
            tituloTarjeta="Diagnóstico"
            descripcionTarjeta="Obtén un diagnóstico preliminar con cuestionarios personalizados."
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TarjetaOpcion
            srcIcono={botiquin}
            tituloTarjeta="Kit médico portátil ANY"
            descripcionTarjeta="Recibe un kit con herramientas para medir y registrar tus signos."
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TarjetaOpcion
            srcIcono={interrogacion}
            tituloTarjeta="Dudas frecuentes"
            descripcionTarjeta="Resuelve preguntas comunes sobre uso, afiliación y más."
          />
        </motion.div>
      </motion.div>


      <BotonA onClick={irAlPanel} loading={loading}>
        Comenzar
      </BotonA>
    </div>
  );
};

export default V8Opciones;
