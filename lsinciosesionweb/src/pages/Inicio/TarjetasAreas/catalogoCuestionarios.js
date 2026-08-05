// src/pages/Inicio/TarjetasAreas/catalogoCuestionarios.js
// Catalogo compartido de cuestionarios de ejemplo por area de salud.
// Cada area define su listado; "Todos" agrega las cuatro areas.
// Es maquetado temporal: cuando backend entregue cuestionarios se reemplaza
// desde la capa de datos sin tocar la UI.

export const CATALOGO_POR_AREA = {
  fisica: [
    {
      area: "fisica",
      id: "fisica-actividad",
      titulo: "Actividad fisica diaria",
      descripcion: "Cuestionario para medir tu nivel de actividad fisica habitual.",
      edo: "edo1",
      n_items: 10,
      n_responses: 10,
    },
    {
      area: "fisica",
      id: "fisica-descanso",
      titulo: "Descanso y recuperacion",
      descripcion: "Conoce la calidad de tu sueño y recuperacion muscular.",
      edo: "edo2",
      n_items: 12,
      n_responses: 7,
    },
    {
      area: "fisica",
      id: "fisica-movilidad",
      titulo: "Flexibilidad y movilidad",
      descripcion: "Evalua tu rango de movimiento y flexibilidad general.",
      edo: "edo3",
      n_items: 8,
      n_responses: 0,
    },
    {
      area: "fisica",
      id: "fisica-fuerza",
      titulo: "Fuerza y resistencia",
      descripcion: "Mide tu fuerza y resistencia muscular de base.",
      edo: "edo4",
      n_items: 9,
      n_responses: 0,
    },
  ],
  emocional: [
    {
      area: "emocional",
      id: "emocional-animo",
      titulo: "Estado de animo",
      descripcion: "Cuestionario sobre tu estado emocional y estado de animo reciente.",
      edo: "edo1",
      n_items: 10,
      n_responses: 10,
    },
    {
      area: "emocional",
      id: "emocional-estres",
      titulo: "Manejo del estres",
      descripcion: "Identifica como manejas el estres en tu dia a dia.",
      edo: "edo2",
      n_items: 11,
      n_responses: 6,
    },
    {
      area: "emocional",
      id: "emocional-ansiedad",
      titulo: "Niveles de ansiedad",
      descripcion: "Explora sintomas relacionados con ansiedad y preocupacion.",
      edo: "edo3",
      n_items: 10,
      n_responses: 0,
    },
    {
      area: "emocional",
      id: "emocional-motivacion",
      titulo: "Motivacion y proposito",
      descripcion: "Evalua tu motivacion y sentido de proposito actual.",
      edo: "edo4",
      n_items: 8,
      n_responses: 0,
    },
  ],
  social: [
    {
      area: "social",
      id: "social-relaciones",
      titulo: "Relaciones interpersonales",
      descripcion: "Mide la calidad de tus relaciones con otras personas.",
      edo: "edo1",
      n_items: 12,
      n_responses: 12,
    },
    {
      area: "social",
      id: "social-familia",
      titulo: "Apoyo familiar",
      descripcion: "Conoce el nivel de apoyo que sientes de tu familia.",
      edo: "edo2",
      n_items: 9,
      n_responses: 4,
    },
    {
      area: "social",
      id: "social-comunidad",
      titulo: "Participacion comunitaria",
      descripcion: "Evalua tu participacion en tu entorno comunitario.",
      edo: "edo3",
      n_items: 7,
      n_responses: 0,
    },
    {
      area: "social",
      id: "social-comunicacion",
      titulo: "Comunicacion efectiva",
      descripcion: "Reflexiona sobre como te comunicas con tus cercanos.",
      edo: "edo4",
      n_items: 9,
      n_responses: 0,
    },
  ],
  nutricional: [
    {
      area: "nutricional",
      id: "nutricional-habitos",
      titulo: "Habitos alimenticios",
      descripcion: "Explora tus habitos de alimentacion y frecuencia de comidas.",
      edo: "edo1",
      n_items: 10,
      n_responses: 10,
    },
    {
      area: "nutricional",
      id: "nutricional-hidratacion",
      titulo: "Hidratacion",
      descripcion: "Mide tu consumo diario de agua y liquidos.",
      edo: "edo2",
      n_items: 6,
      n_responses: 3,
    },
    {
      area: "nutricional",
      id: "nutricional-porciones",
      titulo: "Control de porciones",
      descripcion: "Evalua que tan balanceadas son tus porciones.",
      edo: "edo3",
      n_items: 8,
      n_responses: 0,
    },
    {
      area: "nutricional",
      id: "nutricional-azucares",
      titulo: "Consumo de azucares",
      descripcion: "Identifica tu ingesta de azucares y alimentos procesados.",
      edo: "edo4",
      n_items: 7,
      n_responses: 0,
    },
  ],
};

// Convierte un elemento del catalogo a las props que consume TarjetaBsEdoQs.
export function convertirATarjeta(cuestionario) {
  const nItems = Number(cuestionario.n_items) || 0;
  const nRespuestas = Number(cuestionario.n_responses) || 0;

  return {
    id: cuestionario.id,
    titQs: cuestionario.titulo,
    desQs: cuestionario.descripcion,
    edoQs: cuestionario.edo,
    n_items: nItems,
    n_responses: nRespuestas,
    av: nItems > 0 ? Math.round((nRespuestas * 100) / nItems) : 0,
  };
}

// Devuelve la lista de tarjetas de un area lista para renderizar.
export function obtenerTarjetasPorArea(area) {
  return (CATALOGO_POR_AREA[area] || []).map(convertirATarjeta);
}

// Devuelve las tarjetas de todas las areas unidas (vista "Todos").
export function obtenerTarjetasTodas() {
  return Object.values(CATALOGO_POR_AREA)
    .flat()
    .map(convertirATarjeta);
}