import React, { useState } from "react";
import styles from "./cuestionarios.module.css";
import { ROUTES } from "@/routes";
import { Link } from "react-router-dom";
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
import TarjetaProgresoArea from "@/components/Tarjetas/TarjetaProgresoArea/TarjetaProgresoArea";

import InputRango from "./Inputs/InputRango";

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

const srcIcon = { completado, proceso, inactivo };

const TarjetaCuestionario = () => (
  <div className={styles.cntEstadosCuestionario}>
    {perfilCuestionario.map((c) => (
      <TrjEstadoCuestionario
        key={c.id}
        id={c.id}
        nombre={c.nombre}
        descripcion={c.descripcion}
        estado={estados[c.estado]}
        fecha={c.fecha}
        srcIcon={srcIcon[estados[c.estado]]}
        name={estados[c.estado]}
      />
    ))}
  </div>
);

const Cuestionarios = () => {
  // ✅ único estado para el slider
  const [valor, setValor] = useState(5);

  return (
    
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
                    <img src={fisico} />
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
                    <img src={social} />
                  </div>
                  <p>Bienestar Social</p>
                </div>
                <p>Conoce tu interacción con familiares, amigos y comunidad</p>
              </div>

              <div className={styles.tarjeta}>
                <div className={styles.caja}>
                  <div className={styles.cntIcon}>
                    <img src={mental} />
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
                    <img src={nutricional} />
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

          <div className={styles.cntNumIZ}>
            <div className={styles.num}>
              <p>1</p>
              <p>
                Visualizarás el progreso de tus cuestionarios desde panel
                principal
              </p>
            </div>
            <div className={styles.cntComponente}>
              <p>Bienestar Físico</p>
              <TarjetaCuestionario />
            </div>
          </div>

          <div className={styles.componente}>
            <div className={styles.cntListadoEstado}>
              <p>Bienestar Físico</p>
              <TarjetaCuestionario />
              <p>Bienestar Social</p>
              <TarjetaCuestionario />
              <p>Bienestar Mental</p>
              <TarjetaCuestionario />
              <p>Bienestar Nutricional</p>
              <TarjetaCuestionario />
            </div>
            <div className={styles.cntCompEval}>
              <TarjetaEvaluacion />
            </div>
          </div>

          <div className={styles.cntNumDR}>
            <div className={styles.cntComponente}>
              <TarjetaProgresoArea />
            </div>
            <div className={styles.cntBotones}>
              <button className={styles.boton}>Bienestar Físico</button>
              <button className={styles.boton}>Bienestar Social</button>
              <button className={styles.boton}>Bienestar Mental</button>
              <button className={styles.boton}>Bienestar Nutricional</button>
            </div>
            <div className={styles.num}>
              <p>2</p>
              <p>
                Para cada área de bienestar podrás gestionar el avance de
                cuestionarios
              </p>
            </div>
          </div>

          <div className={styles.cntMejora}>
            <p>Reactivos en cuestionarios</p>
            <p>
              "Cada cuestionario contiene diferentes tipos de preguntas, desde
              escribir tu opinión hasta seleccionar opciones o valorar en una
              escala. ¡Responde con honestidad para obtener mejores resultados!
            </p>
            <p>!</p>
          </div>

          <div className={styles.cntNumIZ}>
            <div className={styles.num}>
              <p>3</p>
              <p>
                Según el tipo de cuestionario se presentarán los tipos de
                preguntas
              </p>
            </div>

            <div className={styles.cntPreguntas}>
              <div className={styles.pregunta}>
                <p>
                  1. Durante los últimos 7 días, ¿cuántos días realizó usted
                  actividades físicas vigorosas como levantar objetos pesados,
                  excavar, aeróbicos o pedalear rápido en bicicleta?
                </p>
                <p>Desliza el marcador hasta el número que consideres</p>
                <div className={styles.cntInput}>
                  <InputRango
                    value={valor}
                    onChange={setValor}
                    min={1}
                    max={7}
                    step={1}
                  />
                </div>
                <button className={styles.boton}>Siguiente</button>
              </div>
              <div className={styles.pregunta}>
                <p>
                  ¿Has consumido bebidas con alcohol (cerveza, vino, ginebra,
                  etc)?
                </p>
                <div className={styles.cntInputs}>
                  <input className={styles.inputChk} type="checkbox"></input>
                  <label>SI</label>
                  <input className={styles.inputChk} type="checkbox"></input>
                  <label>NO</label>
                </div>
                <p>
                  ¿Has consumido bebidas con alcohol (cerveza, vino, ginebra,
                  etc)?
                </p>
                <div className={styles.cntInputs}>
                  <input className={styles.inputChk} type="checkbox"></input>
                  <label>SI</label>
                  <input className={styles.inputChk} type="checkbox"></input>
                  <label>NO</label>
                </div>
                <button className={styles.boton}>Siguiente</button>
              </div>
            </div>
          </div>
          <div className={styles.cntAvance}>
            <div>
              <p>Progreso</p>
              <div className={styles.barra}>
                <div className={styles.avance}></div>
              </div>
            </div>
            <p>
              Si requieres salir, da clic en el boton para mantener tu progreso
            </p>
            <button className={styles.boton}>Guardar</button>
          </div>
          <div className={styles.cntMsj}>
            <p>TU PARTICIPACIÓN ES CLAVE</p>
            <p>Cada respuesta que compartes ayuda a construir un panorama más claro de tu bienestar. <br/> ¡Contribuyes a mejorar tu salud y la de tu comunidad!</p>
          </div>
          <div className={styles.cntAreas}>
            <p>ÁREAS DE BIENESTAR</p>
            <div>
            <Link to="/cuestionarios/fisico" className={styles.boton}>Bienestar Físico</Link>
            <Link to="/cuestionarios/mental" className={styles.boton}>Bienestar Mental</Link>
            <Link to="/cuestionarios/social" className={styles.boton}>Bienestar Social</Link>
            <Link to="/cuestionarios/nutricional" className={styles.boton}>Bienestar Nutricional</Link>

            </div>
          </div>
        </div>
      </div>
    
  );
};

export default Cuestionarios;
