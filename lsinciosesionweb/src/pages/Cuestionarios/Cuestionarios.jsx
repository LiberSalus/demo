import React from "react";
import styles from "./cuestionarios.module.css";
import { ROUTES } from "@/routes";
import { NavLink } from "react-router-dom";
import Menu from "@/components/menu/Menu";
import Principal from "@/Layout/Principal";
import TarjetaListadoAvance from "./TarjetaListadoAvance/TarjetaListadoAvance";
import fisico from "./fisico.png";
import mental from "./mental.png";
import social from "./social.png";
import nutricional from "./nutricional.png";

import Scene3D from "@/components/Escena/Scene3D";
import TrjEstadoCuestionario from "@/components/Tarjetas/TarjetaCuestionarios/TrjEstadoCuestionario";
import TarjetaEvaluacion from "@/components/Tarjetas/TarjetaEvaluacion/TarjetaEvaluacion";

import completado from "@/components/Tarjetas/TarjetaCuestionarios/completado.svg";
import proceso from "@/components/Tarjetas/TarjetaCuestionarios/proceso.svg";
import inactivo from "@/components/Tarjetas/TarjetaCuestionarios/candado.svg";

const estados = ["inactivo", "completado", "proceso"];

const perfilCuestionario = [
  {
    id: 1,
    nombre: "Cuestionario de Satisfacción",
    descripcion: "Evalúa la satisfacción del cliente con el servicio.",
    estado: 1,
    fecha: "01/01/2023",
  },
  {
    id: 2,
    nombre: "Cuestionario de Evaluación",
    descripcion: "Evalúa el desempeño del empleado.",
    estado: 0,
    fecha: "01/01/2023",
  },
  {
    id: 3,
    nombre: "Cuestionario de Clima Laboral",
    descripcion: "Evalúa el ambiente laboral en la empresa.",
    estado: 2,
    fecha: "01/01/2023",
  },
];

const srcIcon = {
  completado,
  proceso,
  inactivo,
};

const TarjetaCuestionario = () => {
  return (
    <div className={styles.cntEstadosCuestionario}>
      {perfilCuestionario.map((cuestionario) => (
        <TrjEstadoCuestionario
          key={cuestionario.id}
          id={cuestionario.id}
          nombre={cuestionario.nombre}
          descripcion={cuestionario.descripcion}
          estado={estados[cuestionario.estado]}
          fecha={cuestionario.fecha}
          srcIcon={srcIcon[estados[cuestionario.estado]]}
          name={estados[cuestionario.estado]}
        />
      ))}
    </div>
  );
};

const Cuestionarios = () => {
  return (
    <Principal>
      <div className={styles.cntCuestionarios}>
        <div className={styles.cntInfo}>
          <h2>Cuestionarios</h2>

          <div className={styles.cntMejora}>
            <p>Conoce y mejora tu bienestar</p>
            <p>
              Esta sección te permite responder cuestionarios para comprender
              mejor tu estado físico, mental, social y nutricional. Completar
              estos cuestionarios te ayudará a obtener recomendaciones
              personalizadas y a construir tu expediente de salud.
            </p>
            <p>?</p>
          </div>

          <div className={styles.cntTarjetasAreas}>
            <div className={styles.cntMono}>
              <Scene3D />
            </div>

            <div className={styles.cntTarjetas}>
              <div className={styles.tarjeta}>
                <div className={styles.caja}>
                  <div className={styles.cntIcon}>
                    <img src={fisico}></img>
                  </div>
                  <p>Bienestar Físico</p>
                </div>
                <p>
                  Evalúa tu estado de salud, energía, actividad física y
                  descanso
                </p>
              </div>

              <div className={styles.tarjeta}>
                <div className={styles.caja}>
                  <div className={styles.cntIcon}>
                    <img src={social}></img>
                  </div>
                  <p>Bienestar Social</p>
                </div>
                <p>Conoce tu interacción con familiares, amigos y comunidad</p>
              </div>

              <div className={styles.tarjeta}>
                <div className={styles.caja}>
                  <div className={styles.cntIcon}>
                    <img src={mental}></img>
                  </div>
                  <p>Bienestar Mental</p>
                </div>
                <p>
                  Mide tu nivel de estrés, emociones y bienestar psicológico
                </p>
              </div>

              <div className={styles.tarjeta}>
                <div className={styles.caja}>
                  <div className={styles.cntIcon}>
                    <img src={nutricional}></img>
                  </div>
                  <p>Bienestar Nutricional</p>
                </div>
                <p>
                  Identifica tus hábitos de alimentación y oportunidades de
                  mejora
                </p>
              </div>
            </div>
          </div>

          <div className={styles.cntMejora}>
            <p>Gestiona tu progreso </p>
            <p>
              Puedes avanzar a tu ritmo. Si no terminas un cuestionario, tu
              progreso quedará guardado para retomarlo después.
            </p>
            <p>O</p>
          </div>

          <div className={styles.cntNum}>
            <div className={styles.num}>
              <p>1</p>
              <p>
                Visualizarás el progreso de tus cuestionarios desde panel
                principal
              </p>
            </div>
            <div className={styles.cntComponente}>
              <TarjetaCuestionario />
            </div>
          </div>

          <div className={styles.componente}>
            <div className={styles.cntListadoEstado}>
              <p>Bienestar Fisico</p>
              <TarjetaCuestionario/>
              <p>Bienestar Social</p>
              <TarjetaCuestionario/>
              <p>Bienestar Fisico</p>
              <TarjetaCuestionario/>
            </div>
            <div className={styles.cntCompEval}>
              <TarjetaEvaluacion />
            </div>
          </div>
        </div>
      </div>
    </Principal>
  );
};

export default Cuestionarios;
