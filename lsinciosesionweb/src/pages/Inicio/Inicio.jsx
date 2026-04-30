//src\pages\Inicio\Inicio.jsx
import React, { useEffect, useState } from "react";
import styles from "./inicio.module.css";
import mona from "./monaP.webp";
import mono from "./monoP.webp";
import manchaA from "./manchaA.svg";
import manchaR from "./manchaR.svg";
import cuadro from "./cuadro.svg";
import ProgCora from "@/components/ProgresoCorazon/ProgCora";
import TarjetaPie from "@/components/Tarjetas/TarjetaPie/TarjetaPie";
import Noticia from "./TarjetaNoticia/Noticia";
import TarjetaLogro from "@/components/TarjetaLogro/TarjetaLogro";
import TarjetaSalud from "./TarjetaSalud/TarjetaSalud";
import TarjetaAreas from "./TarjetasAreas/TarjetaAreas";
import AgendaInicio from "./Calendario/AgendaInicio";
import Sos from "@/components/Sos/Sos";

export default function Inicio() {
  const [nombre, setNombre] = useState("Usuario");
  const [esMujer, setEsMujer] = useState(false);

  useEffect(() => {
    if (typeof esMujer !== "boolean") return;

    window.dispatchEvent(
      new CustomEvent("perfil_min_updated", {
        detail: { esMujer },
      })
    );
  }, [esMujer]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("perfil_min");
      if (raw) {
        const p = JSON.parse(raw);

        if (p?.nombre) setNombre(p.nombre);
        if (!p?.nombre && p?.first_name) {
          setNombre(`${p.first_name} ${p.last_name ?? ""}`.trim());
        }

        const sexo = p?.sexo || p?.genero || p?.gender;
        if (sexo) {
          const s = String(sexo).toLowerCase();
          const mujer =
            s === "f" || s === "mujer" || s === "femenino" || s === "female";
          setEsMujer(mujer);
        }

        window.dispatchEvent(new Event("perfil_min_updated"));
      }
    } catch {
      null;
    }
  }, []);

  const avatarImg = esMujer ? mona : mono;
  const manchaImg = esMujer ? manchaR : manchaA;
  const nombreCorto = String(nombre || "Usuario").trim().split(/\s+/)[0];

  return (
    <div className={styles.wrap}>
      <Sos/>
      <div className={styles.seccSuperior}>
        <div className={styles.cntMono}>
          <h2 className={styles.saludo}>Hola, {nombreCorto}</h2>
          <img className={styles.cuadro} src={cuadro} alt="" />
          <img className={styles.mancha} src={manchaImg} alt="" />
          <div className={styles.cntImgMono}>
            <img className={styles.mono} src={avatarImg} alt="" />
          </div>

          <div className={styles.cntPie}>
            <TarjetaPie edad="50" peso="90" sangre="A+" estatura="177" />
          </div>

          <div className={styles.cntCora}>
            <div className={styles.cntCoraInfo}>
              <ProgCora porcentaje="50" />
              <div className={styles.mensaje}>
                Tu esfuerzo se nota. Ajusta pequeños hábitos y sigue creciendo.
              </div>
            </div>
            <div className={styles.cntLogros}>
              <TarjetaLogro id="reto4" />
            </div>
          </div>
        </div>

        <AgendaInicio />
      </div>

      <div className={styles.seccCentro}>
        <TarjetaSalud tipo="Salud Física" />
        <TarjetaSalud tipo="Salud Mental" />
        <TarjetaSalud tipo="Salud Nutricional" />
      </div>

      <div className={styles.seccInfe}>
        <TarjetaAreas />
        <Noticia />
      </div>
    </div>
  );
}
