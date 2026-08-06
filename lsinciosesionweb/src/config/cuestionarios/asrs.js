// src/config/cuestionarios/asrs.js
// ASRS-V1.1 (Escala de TDAH en adultos) — generado desde docs/historia_clinica/questionnaires/mermaid/cuestionario_asrs.mmd
// (auditoria del drawio: ver tmp/auditoria_*.py). Contrato: dh_forms (key, name,
// description, estimated_duration, list_cie11_codes, list_categories, target_age_group,
// list_questions + conditional) con extensiones demo (scoring, interpretacion, area).
// Nota: la tabla de interpretacion viene de cuestionario_asrs-review.md.

export default {
  id: "ASRS",  // id estable (clave del cuestionario)
  key: "ASRS",  // contrato dh_forms
  name: "ASRS-V1.1 (Escala de TDAH en adultos)",
  description: "Escala de 18 preguntas sobre la frecuencia de ciertas situaciones en los ultimos 6 meses.",
  area: "Emocional",
  area_desc: "Instrumentos para conocer tu bienestar emocional y psicologico.",
  instrucciones: "En los ultimos 6 meses. Responda con que frecuencia le ocurren las siguientes situaciones.",
  estimated_duration: { min_minutes: 5, max_minutes: 10, description: 'Duracion estimada para completar el cuestionario' },
  list_cie11_codes: [{"code": "6A05"}],
  list_categories: [{ key_industry: 1, name: 'Bienestar mental' }],
  list_evaluation_topics: [{"name": "TDAH en adultos", "key_industry": "health"}],
  target_age_group: {"min_age": 18, "name": "A partir de los 18 anos"},
  scoring: {"tipo": "subescalas", "subescalas": [{"id": "A", "nombre": "Parte A (tamizaje)", "items": [1, 2, 3, 4, 5, 6], "maximo": 6}, {"id": "B", "nombre": "Parte B", "items": [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], "maximo": 12}], "maximo": 18},
  interpretacion: [{"subescala": "A", "desde": 4, "hasta": 6, "texto": "Existencia de TDAH en el adulto"}],
  list_questions: [
  {
    "id": 1,
    "order": 1,
    "type": "SINGLE_CHOICE",
    "text": "1. ¿Con que frecuencia tiene dificultad para terminar los detalles finales de un proyecto cuando las partes mas dificiles ya se han hecho?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 2,
    "order": 2,
    "type": "SINGLE_CHOICE",
    "text": "2. ¿Con que frecuencia tiene dificultad para ordenar las cosas cuando tiene que realizar una tarea que requiere organizacion?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 3,
    "order": 3,
    "type": "SINGLE_CHOICE",
    "text": "3. ¿Con que frecuencia tiene problemas para recordar citas u obligaciones?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 4,
    "order": 4,
    "type": "SINGLE_CHOICE",
    "text": "4. Cuando tiene una tarea que requiere que piense mucho, ¿con que frecuencia la evita o la retrasa?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 0,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 5,
    "order": 5,
    "type": "SINGLE_CHOICE",
    "text": "5. ¿Con que frecuencia mueve o agita sus manos o sus pies cuando tiene que permanecer sentado(a) por mucho tiempo?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 0,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 6,
    "order": 6,
    "type": "SINGLE_CHOICE",
    "text": "6. ¿Con que frecuencia se siente usted demasiado activo(a) y como que tiene que hacer cosas, como si tuviera un motor?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 0,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 7,
    "order": 7,
    "type": "SINGLE_CHOICE",
    "text": "7. ¿Con que frecuencia comete errores por falta de cuidado cuando esta trabajando en un proyecto aburrido o dificil?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 0,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 8,
    "order": 8,
    "type": "SINGLE_CHOICE",
    "text": "8. ¿Con que frecuencia tiene dificultad para mantener atencion cuando esta haciendo trabajos aburridos o dificiles?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 0,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 9,
    "order": 9,
    "type": "SINGLE_CHOICE",
    "text": "9. ¿Con que frecuencia tiene dificultad para concentrarse en lo que la gente le dice, aun cuando esten hablando con usted directamente?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 10,
    "order": 10,
    "type": "SINGLE_CHOICE",
    "text": "10. ¿Con que frecuencia pierde o tiene dificultad para encontrar cosas en la casa o en el trabajo?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 0,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 11,
    "order": 11,
    "type": "SINGLE_CHOICE",
    "text": "11. ¿Con que frecuencia se distrae por ruidos o actividades a su alrededor?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 0,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 12,
    "order": 12,
    "type": "SINGLE_CHOICE",
    "text": "12. ¿Con que frecuencia se levanta de su asiento en reuniones o en otras situaciones en las que se supone debe permanecer sentado?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 13,
    "order": 13,
    "type": "SINGLE_CHOICE",
    "text": "13. ¿Con que frecuencia se siente inquieto o nervioso?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 0,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 14,
    "order": 14,
    "type": "SINGLE_CHOICE",
    "text": "14. ¿Con que frecuencia tiene dificultades para relajarse cuando tiene tiempo libre para dedicarselo a usted mismo?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 0,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 15,
    "order": 15,
    "type": "SINGLE_CHOICE",
    "text": "15. ¿Con que frecuencia siente que habla demasiado cuando esta en reuniones sociales?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 0,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
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
    "text": "16. Cuando esta en una conversacion, ¿con que frecuencia se descubre a si mismo terminando las frases de la gente antes de que ellos terminen?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 17,
    "order": 17,
    "type": "SINGLE_CHOICE",
    "text": "17. ¿Con que frecuencia tiene dificultad para esperar su turno en situaciones en que debe de hacerlo?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 0,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 18,
    "order": 18,
    "type": "SINGLE_CHOICE",
    "text": "18. ¿Con que frecuencia interrumpe a otros cuando estan ocupados?",
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
        "value": 0,
        "url": null
      },
      {
        "id": 3,
        "text": "A veces",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Frecuentemente",
        "value": 1,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy frecuentemente",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  }
],
};
