// mesat/src/components/PresionArterial/UltimosRegistros.jsx
import React from "react";
import styles from "./UltimosRegistros.module.css";

import bien from "./icoVer.svg";
import alert from "./icoAma.svg";
import cuidado from "./icoRoj.svg";

// estado: "normal" | "alerta" | "cuidado"
const CONFIG_ESTADO = {
  normal: {
    label: "Normal",
    icon: bien,
    className: styles.estadoNormal,
  },
  alerta: {
    label: "Alerta",
    icon: alert,
    className: styles.estadoAlerta,
  },
  cuidado: {
    label: "Cuidado",
    icon: cuidado,
    className: styles.estadoCuidado,
  },
};

const UltimosRegistros = ({ registros = [] }) => {
  // nos quedamos solo con los 3 últimos, del más reciente al más antiguo
  const ultimosTres = registros.slice(-3).reverse();

  return (
    <div className={styles.UltimosRegistros}>
      <p>Últimos registros</p>

      <div className={styles.cntRegistro}>
        {ultimosTres.length === 0 && (
          <p className={styles.sinDatos}>
            Aún no tienes registros. Añade tu primera medición.
          </p>
        )}

        {ultimosTres.map((reg, idx) => {
          const config =
            CONFIG_ESTADO[reg.estado] ?? CONFIG_ESTADO.normal;

          const fechaTxt = reg.ts.toLocaleDateString("es-MX", {
            weekday: "long",
            day: "2-digit",
            month: "short",
          });

          const horaTxt = reg.ts.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div className={styles.registro} key={reg.id ?? idx}>
              <img className={styles.icon} src={config.icon} alt={config.label} />

              <div className={styles.izq}>
                <p>{fechaTxt}</p>
                <p>
                  {reg.sistolica} - {reg.diastolica} mmHg
                </p>
                <p>
                  <span
                    className={`${styles.estado} ${config.className}`}
                  >
                    {config.label}
                  </span>
                  {reg.medicamento && ` / ${reg.medicamento}`}
                </p>
              </div>

              <div className={styles.der}>
                <p>{horaTxt}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UltimosRegistros;
