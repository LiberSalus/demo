import React, { useState } from "react";
import styles from "./VistaFisica.module.css";

import BotonesQs from "../TarjetasEstadosQs/BotonesQs";
import TarjetaBsEdoQs from "../TarjetasEstadosQs/TarjetaBsEdoQs";

var fakeDB = [
  {
    id: "salud001",
    title: "Evaluación de conocimientos en primeros auxilios",
    description:
      "Cuestionario para medir tu capacidad de respuesta ante emergencias médicas básicas.",
    status: "edo1",
    n_items: 25,
    n_responses: 25,
    peluche: "...otras propiedades",
  },
  {
    id: "salud002",
    title: "Diagnóstico sobre higiene hospitalaria",
    description:
      "Explora tus conocimientos sobre protocolos de limpieza y prevención de infecciones en entornos clínicos.",
    status: "edo2",
    n_items: 30,
    n_responses: 30,
    peluche: "...otras propiedades",
  },
  {
    id: "salud003",
    title: "Autoevaluación en farmacología básica",
    description:
      "Identifica tu nivel de comprensión sobre medicamentos, dosis y efectos secundarios comunes.",
    status: "edo3",
    n_items: 20,
    n_responses: 0,
    peluche: "...otras propiedades",
  },
  {
    id: "salud004",
    title: "Cuestionario de bioética médica",
    description:
      "Analiza tus criterios éticos frente a dilemas clínicos y decisiones sensibles en el cuidado de pacientes.",
    status: "edo4",
    n_items: 15,
    n_responses: 0,
    peluche: "...otras propiedades",
  },
];

const tarjetas = {
  edo1: {
    id: "fisico-edo1",
    titQs: "Evaluación de conocimientos en primeros auxilios",
    desQs:
      "Cuestionario para medir tu capacidad de respuesta ante emergencias médicas básicas.",
    edoQs: "edo1",
    n_items: 25,
    n_responses: 25,
  },
  edo2: {
    id: "fisico-edo2",
    titQs: "Diagnóstico sobre higiene hospitalaria",
    desQs:
      "Explora tus conocimientos sobre protocolos de limpieza y prevención de infecciones en entornos clínicos.",
    edoQs: "edo2",
    n_items: 30,
    n_responses: 30,
  },
  edo3a: {
    id: "fisico-edo3a",
    titQs: "Autoevaluación en farmacología básica",
    desQs:
      "Identifica tu nivel de comprensión sobre medicamentos, dosis y efectos secundarios comunes.",
    edoQs: "edo3",
    n_items: 20,
    n_responses: 0,
  },
  edo3b: {
    id: "fisico-edo3b",
    titQs: "Autoevaluación en farmacología básica",
    desQs:
      "Identifica tu nivel de comprensión sobre medicamentos, dosis y efectos secundarios comunes.",
    edoQs: "edo3",
    n_items: 20,
    n_responses: 0,
  },
  edo4: {
    id: "fisico-edo4",
    titQs: "Cuestionario de bioética médica",
    desQs:
      "Analiza tus criterios éticos frente a dilemas clínicos y decisiones sensibles en el cuidado de pacientes.",
    edoQs: "edo4",
    n_items: 15,
    n_responses: 0,
  },
};

const VistaFisica = () => {
  const [tarjetaActiva, setTarjetaActiva] = useState(tarjetas.edo3a);

  return (
    <div className={styles.VistaFisica}>
      <h3>Mis Cuestionarios</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur. Dictumst nibh quisque eu donec
        tortor non fermentum. Lorem ipsum dolor sit amet consectetur. Dictumst
        nibh quisque eu. Lorem ipsum dolor sit amet consectetur.{" "}
      </p>
      <div className={styles.cntDin}>
        <div className={styles.cntCmp}>
          <BotonesQs
            edoQs="edo1"
            activo={tarjetaActiva?.id === tarjetas.edo1.id}
            onClick={() => setTarjetaActiva(tarjetas.edo1)}
          />
          <BotonesQs
            edoQs="edo4"
            activo={tarjetaActiva?.id === tarjetas.edo4.id}
            onClick={() => setTarjetaActiva(tarjetas.edo4)}
          />
            <BotonesQs
              edoQs="edo3"
              activo={tarjetaActiva?.id === tarjetas.edo3a.id}
              onClick={() => setTarjetaActiva(tarjetas.edo3a)}
            />
            <BotonesQs
              edoQs="edo3"
              activo={tarjetaActiva?.id === tarjetas.edo3b.id}
              onClick={() => setTarjetaActiva(tarjetas.edo3b)}
            />
            
          
        </div>
        <div className={styles.cntStd}>
          {tarjetaActiva && <TarjetaBsEdoQs {...tarjetaActiva} />}
        </div>
      </div>
    </div>
  );
};

export default VistaFisica;
