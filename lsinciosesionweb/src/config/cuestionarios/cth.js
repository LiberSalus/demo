// src/config/cuestionarios/cth.js
// CTH (Cuestionario de Trastorno Bipolar / MDQ) — generado desde docs/historia_clinica/questionnaires/mermaid/cuestionario_cth.mmd
// (auditoria del drawio: ver tmp/auditoria_*.py). Contrato: dh_forms (key, name,
// description, estimated_duration, list_cie11_codes, list_categories, target_age_group,
// list_questions + conditional) con extensiones demo (scoring, interpretacion, area).
// Nota: la tabla de interpretacion viene de cuestionario_cth-review.md.

export default {
  id: "CTH",  // id estable (clave del cuestionario)
  key: "CTH",  // contrato dh_forms
  name: "CTH (Cuestionario de Trastorno Bipolar / MDQ)",
  description: "Cuestionario de 14 sintomas y 2 preguntas de evaluacion sobre periodos de animo elevado o irritable.",
  area: "Emocional",
  area_desc: "Instrumentos para conocer tu bienestar emocional y psicologico.",
  instrucciones: "¿Alguna vez ha pasado por un período en el que se sentía que no era la misma persona de siempre, y...",
  estimated_duration: { min_minutes: 5, max_minutes: 10, description: 'Duracion estimada para completar el cuestionario' },
  list_cie11_codes: [],
  list_categories: [{ key_industry: 1, name: 'Bienestar mental' }],
  list_evaluation_topics: [{"name": "Trastorno bipolar", "key_industry": "health"}],
  target_age_group: {"min_age": 18, "name": "A partir de los 18 anos"},
  scoring: {"tipo": "suma", "maximo": 14},
  interpretacion: [{"desde": 2, "hasta": 13, "texto": "Posible trastorno bipolar"}],
  list_questions: [
  {
    "id": 1,
    "order": 1,
    "type": "SINGLE_CHOICE",
    "text": "1. ... se sintió tan bien o tan eufórico/a que otras personas pensaron que usted no era el/la mismo/a de siempre o estaba tan eufórico/a que se metió en problemas?",
    "list_options": [
      {
        "id": 1,
        "text": "Sí",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "No",
        "value": 0,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 2,
    "order": 2,
    "type": "SINGLE_CHOICE",
    "text": "2. ... estaba tan irritable que gritaba a la gente o provocaba peleas o discusiones?",
    "list_options": [
      {
        "id": 1,
        "text": "Sí",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "No",
        "value": 0,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 3,
    "order": 3,
    "type": "SINGLE_CHOICE",
    "text": "3. ... se sentía mucho más seguro/a de lo habitual?",
    "list_options": [
      {
        "id": 1,
        "text": "Sí",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "No",
        "value": 0,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 4,
    "order": 4,
    "type": "SINGLE_CHOICE",
    "text": "4. ... dormía mucho menos que de costumbre y no necesitaba dormir más?",
    "list_options": [
      {
        "id": 1,
        "text": "Sí",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "No",
        "value": 0,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 5,
    "order": 5,
    "type": "SINGLE_CHOICE",
    "text": "5. ... era mucho más hablador/a o hablaba más rápido que de costumbre?",
    "list_options": [
      {
        "id": 1,
        "text": "Sí",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "No",
        "value": 0,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 6,
    "order": 6,
    "type": "SINGLE_CHOICE",
    "text": "6. ... le pasaban ideas muy rápidamente por la cabeza o no podría hacer que su mente fuera más despacio?",
    "list_options": [
      {
        "id": 1,
        "text": "Sí",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "No",
        "value": 0,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 7,
    "order": 7,
    "type": "SINGLE_CHOICE",
    "text": "7. ... se distraía tan fácilmente con cosas de su alrededor que tenía dificultades para concentrarse o para seguir con lo que estaba haciendo?",
    "list_options": [
      {
        "id": 1,
        "text": "Sí",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "No",
        "value": 0,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 8,
    "order": 8,
    "type": "SINGLE_CHOICE",
    "text": "8. ... tenía mucha más energía de costumbre?",
    "list_options": [
      {
        "id": 1,
        "text": "Sí",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "No",
        "value": 0,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 9,
    "order": 9,
    "type": "SINGLE_CHOICE",
    "text": "9. ... era mucho más activo/a o hacía muchas más cosas que de costumbre?",
    "list_options": [
      {
        "id": 1,
        "text": "Sí",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "No",
        "value": 0,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 10,
    "order": 10,
    "type": "SINGLE_CHOICE",
    "text": "10. ... era mucho más sociable o abierto/a que de costumbre, por ejemplo, telefoneaba a un amigo en mitad de la noche?",
    "list_options": [
      {
        "id": 1,
        "text": "Sí",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "No",
        "value": 0,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 11,
    "order": 11,
    "type": "SINGLE_CHOICE",
    "text": "11. ... asumía riesgos innecesarios o realizaba actividades peligrosas?",
    "list_options": [
      {
        "id": 1,
        "text": "Sí",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "No",
        "value": 0,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 12,
    "order": 12,
    "type": "SINGLE_CHOICE",
    "text": "12. ... estaba mucho más interesado/a en el sexo que de costumbre?",
    "list_options": [
      {
        "id": 1,
        "text": "Sí",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "No",
        "value": 0,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 13,
    "order": 13,
    "type": "SINGLE_CHOICE",
    "text": "13. ... hacía cosas que eran inusuales en usted o que otras personas podrían haber considerado excesivas, insensatas o arriesgadas?",
    "list_options": [
      {
        "id": 1,
        "text": "Sí",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "No",
        "value": 0,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 14,
    "order": 14,
    "type": "SINGLE_CHOICE",
    "text": "14. ... el gasto de dinero le creó problemas a usted o a su familia?",
    "list_options": [
      {
        "id": 1,
        "text": "Sí",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "No",
        "value": 0,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 15,
    "order": 15,
    "type": "SINGLE_CHOICE",
    "text": "15. ¿Algunas de estas situaciones ocurrieron durante el mismo período de tiempo?",
    "list_options": [
      {
        "id": 1,
        "text": "Sí",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "No",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 16,
    "order": 16,
    "type": "SINGLE_CHOICE",
    "text": "16. ¿Qué tanto problema le causaron estas situaciones?",
    "list_options": [
      {
        "id": 1,
        "text": "Ningún problema",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Pequeños problemas",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Problemas moderados",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Problemas graves",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  }
],
};
