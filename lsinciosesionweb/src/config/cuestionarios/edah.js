// src/config/cuestionarios/edah.js
// EDAH (Evaluacion del TDAH en ninos) — generado desde docs/historia_clinica/questionnaires/mermaid/cuestionario_edah.mmd
// (auditoria del drawio: ver tmp/auditoria_*.py). Contrato: dh_forms (key, name,
// description, estimated_duration, list_cie11_codes, list_categories, target_age_group,
// list_questions + conditional) con extensiones demo (scoring, interpretacion, area).
// Nota: la tabla de interpretacion viene de cuestionario_edah-review.md.

export default {
  id: "EDAH",  // id estable (clave del cuestionario)
  key: "EDAH",  // contrato dh_forms
  name: "EDAH (Evaluacion del TDAH en ninos)",
  description: "Evaluacion de 20 preguntas sobre el comportamiento del nino o la nina durante los ultimos 6 meses.",
  area: "Emocional",
  area_desc: "Instrumentos para conocer tu bienestar emocional y psicologico.",
  instrucciones: "Evaluacion del TDAH en ninos/as. Valore el comportamiento del nino/a durante los ultimos 6 meses.",
  estimated_duration: { min_minutes: 5, max_minutes: 10, description: 'Duracion estimada para completar el cuestionario' },
  list_cie11_codes: [{"code": "6A05"}],
  list_categories: [{ key_industry: 1, name: 'Bienestar mental' }],
  list_evaluation_topics: [{"name": "TDAH", "key_industry": "health"}],
  target_age_group: {"min_age": 6, "max_age": 17, "name": "De 6 a 17 anos"},
  scoring: {"tipo": "subescalas", "subescalas": [{"id": "H", "nombre": "Hiperactividad (H)", "items": [1, 3, 5, 13, 17], "maximo": 15}, {"id": "DA", "nombre": "Deficit atencional (DA)", "items": [2, 4, 7, 8, 19], "maximo": 15}, {"id": "DAH", "nombre": "Hiperactividad y deficit atencional (DAH)", "items": [1, 2, 3, 4, 5, 7, 8, 13, 17, 19], "maximo": 30}, {"id": "TC", "nombre": "Trastorno de la conducta (TC)", "items": [6, 9, 10, 11, 12, 14, 15, 16, 18, 20], "maximo": 30}], "maximo": 60},
  interpretacion: [{"subescala": "H", "desde": 4, "hasta": 15, "texto": "Hiperactividad (H)"}, {"subescala": "DA", "desde": 4, "hasta": 15, "texto": "Deficit atencional (DA)"}, {"subescala": "DAH", "desde": 8, "hasta": 30, "texto": "Hiperactividad y deficit atencional (DAH)"}, {"subescala": "TC", "desde": 3, "hasta": 30, "texto": "Trastorno de la conducta (TC)"}, {"subescala": "Global", "desde": 0, "hasta": 4, "texto": "Sin sintomas de DAH"}, {"subescala": "Global", "desde": 11, "hasta": 60, "texto": "Con sintomas de DAH"}],
  list_questions: [
  {
    "id": 1,
    "order": 1,
    "type": "SINGLE_CHOICE",
    "text": "1. Muestra excesiva inquietud motora",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
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
    "text": "2. Tiene dificultades de aprendizaje escolar",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
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
    "text": "3. Molesta frecuentemente a otros ninos/as",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
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
    "text": "4. Se distrae facilmente, muestra escasa atencion",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
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
    "text": "5. Exige inmediata solucion a sus demandas",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
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
    "text": "6. Tiene dificultades para las actividades cooperativas",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
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
    "text": "7. Se muestra ensimismado, como «en las nubes»",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
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
    "text": "8. Deja inconclusas las tareas que empieza",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
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
    "text": "9. No es bien aceptado por el grupo de companeros/as",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
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
    "text": "10. Niega sus errores o echa la culpa a sus companeros/as",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
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
    "text": "11. A menudo grita en situaciones inadecuadas para aquello",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
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
    "text": "12. Contesta con facilidad. Es irrespetuoso, arrogante",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
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
    "text": "13. Se mueve constantemente, es intranquilo",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
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
    "text": "14. Discute y pelea por cualquier cosa u objeto",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 15,
    "order": 15,
    "type": "SINGLE_CHOICE",
    "text": "15. Tiene explosiones impredecibles de mal genio",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 16,
    "order": 16,
    "type": "SINGLE_CHOICE",
    "text": "16. Le falta sentido de la «regla», del juego «limpio»",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 17,
    "order": 17,
    "type": "SINGLE_CHOICE",
    "text": "17. Es impulsivo e irritable",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 18,
    "order": 18,
    "type": "SINGLE_CHOICE",
    "text": "18. Se lleva mal con la mayoria de sus companeros/as",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 19,
    "order": 19,
    "type": "SINGLE_CHOICE",
    "text": "19. Se frustra facilmente, es inconstante",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 20,
    "order": 20,
    "type": "SINGLE_CHOICE",
    "text": "20. Accede de mala forma a las indicaciones del profesor/a",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Poco",
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
        "text": "Mucho",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  }
],
};
