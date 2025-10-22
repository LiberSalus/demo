import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ROUTES } from "@/routes/AppRouter";
import BotonA from "../Botones/BotonA";
import styles from "./v7recibidos.module.css";
import Logo from "../ElementosVista/Logo/Logo";
import TextoPrincipal from "../ElementosVista/TextoPrincipal/TextoPrincipal";
import TextoSecundario from "../ElementosVista/TextoSecundario/TextoSecundario";
import srcLupa from "./lupa.png";
import { motion } from "framer-motion";

const V7Recibidos = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Si vienes con state de la vista anterior, lo conservas; si no, envías algo mínimo
  const state = location.state ?? { from: "V7Recibidos" };

  const irOpciones = () => navigate(ROUTES.OPCIONES, { state });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} // cuando entra
      animate={{ opacity: 1, y: 0 }} // animación activa
      exit={{ opacity: 0, y: -30 }} // cuando sale
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={styles.cntV7Recibidos}>
      <div className={styles.cntLogo}>
        <Logo />
      </div>

      <div className={styles.cntTexto}>
        <TextoPrincipal textoPrincipal="Hemos recibido tus datos" />
        <TextoSecundario
  textoSecundario={[
    <span key="t1">Tus datos se han cargado correctamente.</span>,
    <br key="b1" />,
    <span key="t2">
      Estamos revisando su validez. Este proceso puede demorar hasta 48 horas hábiles.
    </span>,
  ]}
/>

      </div>

      <div className={styles.cntImg}>
        <img src={srcLupa} className={styles.lupa} alt="Verificación de documentos" />
      </div>

      <div className={styles.acciones}>
        <BotonA onClick={irOpciones}>Continuar</BotonA>

        

        
      </div>
    </motion.div>
  );
};

export default V7Recibidos;
