import React, { useState, useEffect } from "react";
import styles from "./TarjetaLogro.module.css";
import "./copaSVG.css";
import config from "./icoConfig.svg";

import IcoPrimer from "./icoPrimer.svg?react";
import IcoSegundo from "./icoSegundo.svg?react";
import IcoTercer from "./icoTercer.svg?react";
import IcoCuarto from "./IcoCuatro";

const retos = [
  {
    id: "reto1",
    tit: "¡Maratón Master!",
    txt: "¡Esta semana completaste el 100% de tu meta establecida!",
    pasos: 100000,
    icon: IcoPrimer,
    bg: "linear-gradient(90deg, #ffffff 0%, #eea237 100%)",
  },
  {
    id: "reto2",
    tit: "¡Ritmo Constante!",
    txt: "¡Excelente trabajo! Demostraste gran constancia y alcanzaste el 80% de tu meta.",
    pasos: 80000,
    icon: IcoSegundo,
    bg: "linear-gradient(90deg, #ffffff 0%, #3f83a6 100%)",
  },
  {
    id: "reto3",
    tit: "¡Caminante Fuerte!",
    txt: "¡Buen esfuerzo! Completaste el 70% de tu meta.",
    pasos: 70000,
    icon: IcoTercer,
    bg: "linear-gradient(90deg, #ffffff 0%, #6f47a9 100%)",
  },
  {
    id: "reto4",
    tit: "¡Sigue adelante!",
    txt: "Llevas el 65% de tu meta semanal. ¡Estas haciendo un gran trabajo!",
    pasos: 65000,
    icon: IcoCuarto,
    bg: "linear-gradient(90deg, #ffffff 0%, #A1B39D 100%)",
  },
];

const TarjetaLogro = ({ id }) => {
  const reto = retos.find((r) => r.id === id);
  if (!reto) return null;

  const { tit, txt, pasos, icon, bg } = reto;

  // Hook contador animado
  const useContadorAnimado = (valorFinal, velocidad = 20) => {
    const [valor, setValor] = useState(0);

    useEffect(() => {
      let actual = 0;
      const incremento = Math.ceil(valorFinal / 400);
      const intervalo = setInterval(() => {
        actual += incremento;
        if (actual >= valorFinal) {
          actual = valorFinal;
          clearInterval(intervalo);
        }
        setValor(actual);
      }, velocidad);

      return () => clearInterval(intervalo);
    }, [valorFinal, velocidad]);

    return valor;
  };

  const pasosAnimado = useContadorAnimado(pasos); // 👈 Mover arriba
  const Icon = icon;

  useEffect(() => {
    if (icon === IcoCuarto) {
      const path = document.querySelector("camino");
      if (path) {
        const totalLength = path.getTotalLength();
        path.style.strokeDasharray = totalLength;
        path.style.transition = "stroke-dashoffset 2.5s ease-out";

        const porcentaje = Math.min(pasosAnimado / 65000, 1);
        path.style.strokeDashoffset = totalLength * (1 - porcentaje);
      }
    }
  }, [pasosAnimado, icon]);

  return (
    <div className={styles.TarjetaLogro} style={{ background: bg }}>
      <div className={styles.inf}>
        <p className={styles.tit}>{tit}</p>
        <p className={styles.txt}>{txt}</p>
        <p className={styles.pasos}>
          <span className={styles.cta}>{pasosAnimado}</span> pasos
        </p>
      </div>
      <div className={styles.img}>
        {icon === IcoCuarto ? (
          <IcoCuarto progreso={pasosAnimado / 100000} />
        ) : (
          <Icon />
        )}
      </div>
      <img src={config} className={styles.config} alt="config" />
    </div>
  );
};

export default TarjetaLogro;

