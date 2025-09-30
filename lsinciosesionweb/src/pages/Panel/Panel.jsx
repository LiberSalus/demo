// src/pages/Panel/Panel.jsx

import React from "react";
import styles from "./panel.module.css";
import Menu from "@/components/menu/Menu";
import BackgroundPanel from "@/components/background/backgroundPanel/BackgroundPanel";
import TarjetaUsuario from "@/components/Tarjetas/TarjetaUsuario/TarjetaUsuario";
import TarjetaCuestionario from "@/components/Tarjetas/TarjetaCuestionarios/TarjetaCuestionario";
import TarjetaEvaluacion from "@/components/Tarjetas/TarjetaEvaluacion/TarjetaEvaluacion";
import TarjetaBienestar from "@/components/Tarjetas/TarjetaBienestar/TarjetaBienestar";
import TarjetaAlerta from "@/components/Tarjetas/TarjetaAlertas/TarjetaAlerta";
import TarjetaSeguimiento from "@/components/Tarjetas/TarjetaSeguimiento/TarjetaSeguimiento";
import TarjetaCarrucel from "@/components/Tarjetas/TarjetaCarrucel/TarjetaCarrucel";

const Panel = () => {
  return (
    <div className={styles.panel}>
      <div className={styles.backgroundPanel}>
        <BackgroundPanel />
      </div>

      <div className={styles.cntMenu}>
        <Menu />
      </div>

      <div className={styles.cntTrjUsuario}>
        <TarjetaUsuario />
      </div>

      

      <div className={styles.cntModulos}>

        <div className={styles.cntTrjCarrucel}>
          <TarjetaCarrucel/>
        </div>
        <div className={styles.cntTrjBienestar}>
          <TarjetaBienestar /> {/* 👈 aqui vienen  tb los botones a las areas  */}
        </div>
        <div className={styles.cntTrjCuestionario}>
          <TarjetaCuestionario />
        </div>
        <div className={styles.cntTrjEvaluacion}>
            <TarjetaEvaluacion />
        </div>
        <div className={styles.cntTrjAlertas}>
          <TarjetaAlerta />
        </div>
        <div className={styles.cntTrjSeguimiento}>
          <TarjetaSeguimiento />
        </div>
      </div>

    </div>
  );
};

export default Panel;
