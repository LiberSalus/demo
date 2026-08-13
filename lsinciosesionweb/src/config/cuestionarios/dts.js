// src/config/cuestionarios/dts.js
// DTS (Escala de Trauma de Davidson) — generado desde docs/historia_clinica/questionnaires/mermaid/cuestionario_dts.mmd
// (auditoria del drawio: ver tmp/auditoria_*.py). Contrato: dh_forms (key, name,
// description, estimated_duration, list_cie11_codes, list_categories, target_age_group,
// list_questions + conditional) con extensiones demo (scoring, interpretacion, area).
// Nota: la tabla de interpretacion viene de cuestionario_dts-review.md.
// Nota: el drawio/mmd traen 18 sintomas con el 13 duplicado del 12 (ver mmd,
// nodo d13 "(dup. del 12)"). Se elimino el duplicado del JSON: quedan 17
// sintomas (34 preguntas, frecuencia+gravedad) y maximos 68/68/136, coherentes
// con el review y con la escala DTS estandar de 17 items.

export default {
  id: "DTS",  // id estable (clave del cuestionario)
  key: "DTS",  // contrato dh_forms
  name: "DTS (Escala de Trauma de Davidson)",
  description: "Escala de 17 sintomas valorados en frecuencia y gravedad durante la ultima semana.",
  area: "Emocional",
  area_desc: "Instrumentos para conocer tu bienestar emocional y psicologico.",
  instrucciones: "En la ultima semana. Valore para cada sintoma su Frecuencia (0-4) y Gravedad (0-4).",
  estimated_duration: { min_minutes: 5, max_minutes: 10, description: 'Duracion estimada para completar el cuestionario' },
  list_cie11_codes: [{"code": "6B40"}, {"code": "6B41"}],
  list_categories: [{ key_industry: 1, name: 'Bienestar mental' }],
  list_evaluation_topics: [{"name": "Estres postraumatico", "key_industry": "health"}],
  target_age_group: {"min_age": 18, "name": "A partir de los 18 anos"},
  scoring: {"tipo": "subescalas", "subescalas": [{"id": "F", "nombre": "Frecuencia", "items": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33], "maximo": 68}, {"id": "G", "nombre": "Gravedad", "items": [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34], "maximo": 68}, {"id": "T", "nombre": "Total", "items": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34], "maximo": 136}], "maximo": 136},
  interpretacion: [{"subescala": "F", "desde": 0, "hasta": 68, "texto": "Puntuacion parcial de frecuencia"}, {"subescala": "G", "desde": 0, "hasta": 68, "texto": "Puntuacion parcial de gravedad"}, {"subescala": "T", "desde": 0, "hasta": 136, "texto": "A mayor puntuacion, mayor gravedad y frecuencia de los sintomas"}],
  list_questions: [
  {
    "id": 1,
    "order": 1,
    "type": "SINGLE_CHOICE",
    "text": "1. ¿Ha tenido imagenes, recuerdos o pensamientos dolorosos del acontecimiento?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 2,
    "order": 2,
    "type": "SINGLE_CHOICE",
    "text": "1. ¿Ha tenido imagenes, recuerdos o pensamientos dolorosos del acontecimiento?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 1,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 3,
    "order": 3,
    "type": "SINGLE_CHOICE",
    "text": "2. ¿Ha tenido pesadillas sobre el acontecimiento?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 4,
    "order": 4,
    "type": "SINGLE_CHOICE",
    "text": "2. ¿Ha tenido pesadillas sobre el acontecimiento?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 3,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 5,
    "order": 5,
    "type": "SINGLE_CHOICE",
    "text": "3. ¿Ha sentido que el acontecimiento estaba ocurriendo de nuevo?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 6,
    "order": 6,
    "type": "SINGLE_CHOICE",
    "text": "3. ¿Ha sentido que el acontecimiento estaba ocurriendo de nuevo?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 5,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 7,
    "order": 7,
    "type": "SINGLE_CHOICE",
    "text": "4. ¿Le ha molestado alguna cosa que se lo haya recordado?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 8,
    "order": 8,
    "type": "SINGLE_CHOICE",
    "text": "4. ¿Le ha molestado alguna cosa que se lo haya recordado?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 7,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 9,
    "order": 9,
    "type": "SINGLE_CHOICE",
    "text": "5. ¿Ha tenido manifestaciones fisicas por recuerdos del acontecimiento?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 10,
    "order": 10,
    "type": "SINGLE_CHOICE",
    "text": "5. ¿Ha tenido manifestaciones fisicas por recuerdos del acontecimiento?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 9,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 11,
    "order": 11,
    "type": "SINGLE_CHOICE",
    "text": "6. ¿Ha estado evitando algun pensamiento o sentimiento sobre el acontecimiento?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 12,
    "order": 12,
    "type": "SINGLE_CHOICE",
    "text": "6. ¿Ha estado evitando algun pensamiento o sentimiento sobre el acontecimiento?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 11,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 13,
    "order": 13,
    "type": "SINGLE_CHOICE",
    "text": "7. ¿Ha estado evitando hacer cosas o estar en situaciones que le recordaban?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 14,
    "order": 14,
    "type": "SINGLE_CHOICE",
    "text": "7. ¿Ha estado evitando hacer cosas o estar en situaciones que le recordaban?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 13,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 15,
    "order": 15,
    "type": "SINGLE_CHOICE",
    "text": "8. ¿Ha sido incapaz de recordar partes importantes del acontecimiento?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 16,
    "order": 16,
    "type": "SINGLE_CHOICE",
    "text": "8. ¿Ha sido incapaz de recordar partes importantes del acontecimiento?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 15,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 17,
    "order": 17,
    "type": "SINGLE_CHOICE",
    "text": "9. ¿Ha tenido dificultad para disfrutar de las cosas?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 18,
    "order": 18,
    "type": "SINGLE_CHOICE",
    "text": "9. ¿Ha tenido dificultad para disfrutar de las cosas?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 17,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 19,
    "order": 19,
    "type": "SINGLE_CHOICE",
    "text": "10. ¿Se ha sentido distante o alejado de la gente?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 20,
    "order": 20,
    "type": "SINGLE_CHOICE",
    "text": "10. ¿Se ha sentido distante o alejado de la gente?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 19,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 21,
    "order": 21,
    "type": "SINGLE_CHOICE",
    "text": "11. ¿Ha sido incapaz de tener sentimientos de tristeza o de afecto?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 22,
    "order": 22,
    "type": "SINGLE_CHOICE",
    "text": "11. ¿Ha sido incapaz de tener sentimientos de tristeza o de afecto?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 21,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 23,
    "order": 23,
    "type": "SINGLE_CHOICE",
    "text": "12. ¿Ha tenido dificultad para imaginar una vida larga y cumplir sus objetivos?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 24,
    "order": 24,
    "type": "SINGLE_CHOICE",
    "text": "12. ¿Ha tenido dificultad para imaginar una vida larga y cumplir sus objetivos?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 23,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 25,
    "order": 25,
    "type": "SINGLE_CHOICE",
    "text": "13. ¿Ha tenido dificultad para iniciar o mantener el sueno?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 26,
    "order": 26,
    "type": "SINGLE_CHOICE",
    "text": "13. ¿Ha tenido dificultad para iniciar o mantener el sueno?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 25,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 27,
    "order": 27,
    "type": "SINGLE_CHOICE",
    "text": "14. ¿Ha estado irritable o ha tenido accesos de ira?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 28,
    "order": 28,
    "type": "SINGLE_CHOICE",
    "text": "14. ¿Ha estado irritable o ha tenido accesos de ira?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 27,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 29,
    "order": 29,
    "type": "SINGLE_CHOICE",
    "text": "15. ¿Ha tenido dificultades de concentracion?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 30,
    "order": 30,
    "type": "SINGLE_CHOICE",
    "text": "15. ¿Ha tenido dificultades de concentracion?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 29,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 31,
    "order": 31,
    "type": "SINGLE_CHOICE",
    "text": "16. ¿Se ha sentido nervioso, facilmente distraido o permanecido «en guardia»?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 32,
    "order": 32,
    "type": "SINGLE_CHOICE",
    "text": "16. ¿Se ha sentido nervioso, facilmente distraido o permanecido «en guardia»?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 31,
          "operator": ">",
          "value": 0
        }
      ]
    }
  },
  {
    "id": 33,
    "order": 33,
    "type": "SINGLE_CHOICE",
    "text": "17. ¿Ha estado nervioso o se ha asustado facilmente?",
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
        "text": "(2-3) veces",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "(4-6) veces",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "A diario",
        "value": 4,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 34,
    "order": 34,
    "type": "SINGLE_CHOICE",
    "text": "17. ¿Ha estado nervioso o se ha asustado facilmente?",
    "list_options": [
      {
        "id": 1,
        "text": "Nada",
        "value": 0,
        "url": null
      },
      {
        "id": 2,
        "text": "Leve",
        "value": 1,
        "url": null
      },
      {
        "id": 3,
        "text": "Moderada",
        "value": 2,
        "url": null
      },
      {
        "id": 4,
        "text": "Marcada",
        "value": 3,
        "url": null
      },
      {
        "id": 5,
        "text": "Extrema",
        "value": 4,
        "url": null
      }
    ],
    "conditional": {
      "type": "all",
      "rules": [
        {
          "id_question": 33,
          "operator": ">",
          "value": 0
        }
      ]
    }
  }
],
};
