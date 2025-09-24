import React from 'react'
import Menu from '@/components/menu/Menu'
import styles from "../pages/Panel/panel.module.css";
import TarjetaUsuario from '@/components/Tarjetas/TarjetaUsuario/TarjetaUsuario'
import BackgroundPanel from "@/components/background/backgroundPanel/BackgroundPanel";


const Principal = ({children}) => {
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
        {children}
      </div>

    </div>
  );
}

export default Principal
