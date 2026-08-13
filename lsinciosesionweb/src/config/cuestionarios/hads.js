// src/config/cuestionarios/hads.js
// HADS (Escala de Ansiedad y Depresion Hospitalaria) — generado desde docs/historia_clinica/questionnaires/mermaid/cuestionario_hads.mmd
// (auditoria del drawio: ver tmp/auditoria_*.py). Contrato: dh_forms (key, name,
// description, estimated_duration, list_cie11_codes, list_categories, target_age_group,
// list_questions + conditional) con extensiones demo (scoring, interpretacion, area).
// Nota: la tabla de interpretacion viene de cuestionario_hads-review.md.

export default {
  id: "HADS",  // id estable (clave del cuestionario)
  key: "HADS",  // contrato dh_forms
  name: "HADS (Escala de Ansiedad y Depresion Hospitalaria)",
  description: "Escala de 14 preguntas sobre como se ha sentido durante la ultima semana (ansiedad y depresion).",
  area: "Emocional",
  area_desc: "Instrumentos para conocer tu bienestar emocional y psicologico.",
  instrucciones: "Lea cada pregunta y seleccione la respuesta que considere que coincide con su propio estado emocional en la ultima semana. No es necesario que piense mucho tiempo cada respuesta; en este cuestionario las respuestas espontaneas tienen mas valor que las que se piensan mucho.",
  estimated_duration: { min_minutes: 5, max_minutes: 15, description: 'Duracion estimada para completar el cuestionario' },
  list_cie11_codes: [{"code": "6A7"}, {"code": "6B0"}],
  list_categories: [{ key_industry: 1, name: 'Bienestar mental' }],
  list_evaluation_topics: [{"name": "Ansiedad y depresion", "key_industry": "health"}],
  target_age_group: {"min_age": 14, "name": "A partir de 14 anos"},
  scoring: {"tipo": "subescalas", "subescalas": [{"id": "A", "nombre": "Ansiedad", "items": [1, 3, 5, 7, 9, 11, 13], "maximo": 21}, {"id": "D", "nombre": "Depresion", "items": [2, 4, 6, 8, 10, 12, 14], "maximo": 21}], "maximo": 42},
  interpretacion: [{"subescala": "A", "desde": 0, "hasta": 7, "texto": "Normalidad"}, {"subescala": "A", "desde": 8, "hasta": 10, "texto": "Probable ansiedad"}, {"subescala": "A", "desde": 11, "hasta": 21, "texto": "Caso de ansiedad"}, {"subescala": "D", "desde": 0, "hasta": 7, "texto": "Normalidad"}, {"subescala": "D", "desde": 8, "hasta": 10, "texto": "Probable depresion"}, {"subescala": "D", "desde": 11, "hasta": 21, "texto": "Caso de depresion"}],
  list_questions: [
  {
    "id": 1,
    "order": 1,
    "type": "SINGLE_CHOICE",
    "text": "A.1 Me siento tenso/a o nervioso/a",
    "list_options": [
      {
        "id": 1,
        "text": "Nunca",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "De vez en cuando",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Gran parte del dia",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Casi todo el dia",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 2,
    "order": 2,
    "type": "SINGLE_CHOICE",
    "text": "D.1 Sigo disfrutando de las cosas como siempre",
    "list_options": [
      {
        "id": 1,
        "text": "Ciertamente, igual que antes",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "No tanto como antes",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Solamente un poco",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Ya no disfruto con nada",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 3,
    "order": 3,
    "type": "SINGLE_CHOICE",
    "text": "A.2 Siento una especie de temor como si algo malo fuera a suceder",
    "list_options": [
      {
        "id": 1,
        "text": "No siento nada de eso",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Si, pero no me preocupa",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Si, pero no muy intenso",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Si, y muy intenso",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 4,
    "order": 4,
    "type": "SINGLE_CHOICE",
    "text": "D.2 Soy capaz de reirme y ver el lado gracioso de las cosas",
    "list_options": [
      {
        "id": 1,
        "text": "Igual que siempre",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Actualmente, algo menos",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Actualmente, mucho menos",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Actualmente, en absoluto",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 5,
    "order": 5,
    "type": "SINGLE_CHOICE",
    "text": "A.3 Tengo la cabeza llena de preocupaciones",
    "list_options": [
      {
        "id": 1,
        "text": "Nunca",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "De vez en cuando",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Gran parte del dia",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Casi todo el dia",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 6,
    "order": 6,
    "type": "SINGLE_CHOICE",
    "text": "D.3 Me siento alegre",
    "list_options": [
      {
        "id": 1,
        "text": "Gran parte del dia",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "En algunas ocasiones",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Muy pocas veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Nunca",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 7,
    "order": 7,
    "type": "SINGLE_CHOICE",
    "text": "A.4 Soy capaz de permanecer sentado/a tranquilo/a y relajado/a",
    "list_options": [
      {
        "id": 1,
        "text": "Siempre",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "A menudo",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Raras veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Nunca",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 8,
    "order": 8,
    "type": "SINGLE_CHOICE",
    "text": "D.4 Me siento lento/a y torpe",
    "list_options": [
      {
        "id": 1,
        "text": "Nunca",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "A veces",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "A menudo",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Gran parte del dia",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 9,
    "order": 9,
    "type": "SINGLE_CHOICE",
    "text": "A.5 Experimento una desagradable sensacion de «nervios y hormigueos» en el estomago",
    "list_options": [
      {
        "id": 1,
        "text": "Nunca",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Solo en algunas ocasiones",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "A menudo",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Muy a menudo",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 10,
    "order": 10,
    "type": "SINGLE_CHOICE",
    "text": "D.5 He perdido el interes por mi aspecto personal",
    "list_options": [
      {
        "id": 1,
        "text": "Me cuido como siempre lo he hecho",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Es posible que no me cuide como debiera",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "No me cuido como deberia hacerlo",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Completamente",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 11,
    "order": 11,
    "type": "SINGLE_CHOICE",
    "text": "A.6 Me siento inquieto/a como si no pudiera parar de moverme",
    "list_options": [
      {
        "id": 1,
        "text": "En absoluto",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "No mucho",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Bastante",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Realmente mucho",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 12,
    "order": 12,
    "type": "SINGLE_CHOICE",
    "text": "D.6 Espero las cosas con ilusion",
    "list_options": [
      {
        "id": 1,
        "text": "Como siempre",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Algo menos que antes",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Mucho menos que antes",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "En absoluto",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 13,
    "order": 13,
    "type": "SINGLE_CHOICE",
    "text": "A.7 Experimento de repente sensaciones de gran angustia o temor",
    "list_options": [
      {
        "id": 1,
        "text": "Nunca",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Raramente",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Con cierta frecuencia",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Muy a menudo",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 14,
    "order": 14,
    "type": "SINGLE_CHOICE",
    "text": "D.7 Soy capaz de disfrutar con un buen libro o con un buen programa de radio o television",
    "list_options": [
      {
        "id": 1,
        "text": "A menudo",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Algunas veces",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Pocas veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Casi nunca",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  }
],
};
