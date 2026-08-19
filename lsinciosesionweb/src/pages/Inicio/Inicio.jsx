//src\pages\Inicio\Inicio.jsx
import React, { useCallback, useEffect, useState } from "react";
import styles from "./inicio.module.css";
import mona from "./monaP.webp";
import mono from "./monoP.webp";
import mone from "./MoneP.png";
import manchaA from "./manchaA.svg";
import manchaR from "./manchaR.svg";
import manchaM from "./manchaM.svg";
import cuadro from "./cuadro.svg";
import ProgCora from "@/components/ProgresoCorazon/ProgCora";
import TarjetaPie from "@/components/Tarjetas/TarjetaPie/TarjetaPie";
import Noticia from "./TarjetaNoticia/Noticia";
import TarjetaLogro from "@/components/TarjetaLogro/TarjetaLogro";
import TarjetaSalud from "./TarjetaSalud/TarjetaSalud";
import TarjetaAreas from "./TarjetasAreas/TarjetaAreas";
import AgendaInicio from "./Calendario/AgendaInicio";
import Sos from "@/components/Sos/Sos";
import { useNavigate } from "react-router-dom";
import { obtenerHomePaciente } from "@/services/dashboard";
import iconoHistoria from "./iconoHistoria.svg";

const resumenSaludInicial = {
  edad: "50",
  peso: "90",
  sangre: "A+",
  estatura: "177",
};

const mensajeInicial = "Tu esfuerzo se nota. Ajusta pequeños hábitos y sigue creciendo.";

// Traduce los valores de sexo del perfil a la variante visual usada por el inicio.
function obtenerVarianteSexo(sexo) {
  const sexoNormalizado = String(sexo || "").toLowerCase();

  if (sexoNormalizado === "female") return "female";
  if (
    sexoNormalizado === "f" ||
    sexoNormalizado === "mujer" ||
    sexoNormalizado === "femenino"
  ) {
    return "mujer";
  }

  return "hombre";
}

// Renderiza el inicio del paciente con datos locales primero y sincronizacion del backend despues.
export default function Inicio() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("Usuario");
  // Para maquetado puedes probar con: "female", "mujer" u "hombre".
  const [sexo, setSexo] = useState("hombre");
  const [resumenSalud, setResumenSalud] = useState(resumenSaludInicial);
  const [mensaje, setMensaje] = useState(mensajeInicial);

  const esMujer = sexo === "mujer" || sexo === "female";

  // Recupera el perfil minimo guardado para personalizar saludo y avatar sin esperar al backend.
  const leerPerfilLocal = useCallback(() => {
    try {
      const raw = localStorage.getItem("perfil_min");
      if (!raw) return;

      const p = JSON.parse(raw);
      const nombrePerfil =
        p?.nombre ||
        p?.nombre_completo ||
        (p?.first_name && `${p.first_name} ${p.last_name ?? ""}`.trim());

      if (nombrePerfil) setNombre(nombrePerfil);

      const sexo = p?.sexo || p?.genero || p?.gender;
      if (sexo) {
        setSexo(obtenerVarianteSexo(sexo));
      }
    } catch {
      null;
    }
  }, []);

  // Notifica a otros componentes cuando cambia el genero usado para personalizar la interfaz.
  useEffect(() => {
    if (typeof esMujer !== "boolean") return;

    window.dispatchEvent(
      new CustomEvent("perfil_min_updated", {
        detail: { esMujer },
      })
    );
  }, [esMujer]);

  // Mantiene sincronizado el estado del inicio cuando otros modulos actualizan el perfil local.
  useEffect(() => {
    leerPerfilLocal();
    window.addEventListener("perfil_min_updated", leerPerfilLocal);

    return () => window.removeEventListener("perfil_min_updated", leerPerfilLocal);
  }, [leerPerfilLocal]);

  // Consulta el resumen del paciente y reemplaza los valores iniciales cuando el servicio responde.
  useEffect(() => {
    let desmontado = false;

    obtenerHomePaciente()
      .then((homePaciente) => {
        if (desmontado || !homePaciente) return;

        const nombrePaciente = homePaciente.perfil?.nombre;
        if (nombrePaciente) setNombre(nombrePaciente);

        const sexo = homePaciente.perfil?.sexo;
        if (sexo) {
          setSexo(obtenerVarianteSexo(sexo));
        }

        setResumenSalud((resumenActual) => ({
          edad: homePaciente.resumenSalud?.edad ?? resumenActual.edad,
          peso: homePaciente.resumenSalud?.peso ?? resumenActual.peso,
          sangre: homePaciente.resumenSalud?.sangre ?? resumenActual.sangre,
          estatura: homePaciente.resumenSalud?.estatura ?? resumenActual.estatura,
        }));

        if (homePaciente.mensaje) setMensaje(homePaciente.mensaje);
      })
      .catch(() => {
        // El endpoint de home puede no estar listo en local; mantenemos los datos actuales.
      });

    return () => {
      desmontado = true;
    };
  }, []);

  const avatarImg = sexo === "female" ? mone : esMujer ? mona : mono;
  const manchaImg = sexo === "female" ? manchaM : esMujer ? manchaR : manchaA;
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
            <TarjetaPie
              edad={String(resumenSalud.edad)}
              peso={String(resumenSalud.peso)}
              sangre={String(resumenSalud.sangre)}
              estatura={String(resumenSalud.estatura)}
            />
          </div>

          <div className={styles.cntCora}>
            <div className={styles.cntCoraInfo}>
              <ProgCora porcentaje="50" />
              <div className={styles.mensaje}>{mensaje}</div>
            </div>
            <div className={styles.cntLogros}>
              <TarjetaLogro id="reto4" />
            </div>
            <button type="button" className={styles.btnHistoria} onClick={() => navigate("/mi-salud/historia-salud")}>
              <img src={iconoHistoria} alt="" className={styles.iconoHistoria} />
              <span>Mi historia clínica</span>
            </button>
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
