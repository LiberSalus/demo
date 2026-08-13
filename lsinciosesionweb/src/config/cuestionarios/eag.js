// src/config/cuestionarios/eag.js
// EAG (Escala de Adiccion General) — generado desde docs/historia_clinica/questionnaires/mermaid/cuestionario_eag.mmd
// (auditoria del drawio: ver tmp/auditoria_*.py). Contrato: dh_forms (key, name,
// description, estimated_duration, list_cie11_codes, list_categories, target_age_group,
// list_questions + conditional) con extensiones demo (scoring, interpretacion, area).
// Nota: la tabla de interpretacion viene de cuestionario_eag-review.md.
// Nota: el drawio y el review declaran "0-77 puntos" (error de dibujo del drawio);
// el maximo real es 36 = 12 items x 3 (opciones simetricas 0-3). El corte clinico
// "Muy adicto" sigue en 12, solo cambia el tope superior.

export default {
  id: "EAG",  // id estable (clave del cuestionario)
  key: "EAG",  // contrato dh_forms
  name: "EAG (Escala de Adiccion General)",
  description: "Escala de 12 enunciados para conocer su relacion con ciertos habitos o conductas.",
  area: "Emocional",
  area_desc: "Instrumentos para conocer tu bienestar emocional y psicologico.",
  instrucciones: "Debe contestar de la forma mas sincera. En las casillas que encontrara a la derecha, rodee con un circulo el numero que indique lo que le ocurre. No hay respuestas correctas ni incorrectas; solo que sea lo mas sincero posible.",
  estimated_duration: { min_minutes: 5, max_minutes: 30, description: 'Duracion estimada para completar el cuestionario' },
  list_cie11_codes: [],
  list_categories: [{ key_industry: 1, name: 'Bienestar mental' }],
  list_evaluation_topics: [{"name": "Adicciones", "key_industry": "health"}],
  target_age_group: {"min_age": 12, "name": "A partir de 12 anos"},
  scoring: {"tipo": "suma", "maximo": 36},
  interpretacion: [{"desde": 0, "hasta": 11, "texto": "Sin adiccion"}, {"desde": 12, "hasta": 36, "texto": "Muy adicto"}],
  list_questions: [
  {
    "id": 1,
    "order": 1,
    "type": "SINGLE_CHOICE",
    "text": "1. He dejado de hacerlo, sin problemas cada vez que he querido",
    "list_options": [
      {
        "id": 1,
        "text": "Extremadamente cierto",
        "value": 3,
        "url": null
      },
      {
        "id": 2,
        "text": "Bastante cierto",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Ligeramente cierto",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Ni cierto, ni falso",
        "value": 0,
        "url": null
      },
      {
        "id": 5,
        "text": "Ligeramente falso",
        "value": 1,
        "url": null
      },
      {
        "id": 6,
        "text": "Bastante falso",
        "value": 2,
        "url": null
      },
      {
        "id": 7,
        "text": "Extremadamente falso",
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
    "text": "2. No puedo dejarlo por mas que lo intente",
    "list_options": [
      {
        "id": 1,
        "text": "Extremadamente cierto",
        "value": 3,
        "url": null
      },
      {
        "id": 2,
        "text": "Bastante cierto",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Ligeramente cierto",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Ni cierto, ni falso",
        "value": 0,
        "url": null
      },
      {
        "id": 5,
        "text": "Ligeramente falso",
        "value": 1,
        "url": null
      },
      {
        "id": 6,
        "text": "Bastante falso",
        "value": 2,
        "url": null
      },
      {
        "id": 7,
        "text": "Extremadamente falso",
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
    "text": "3. Puedo resistir las ganas de hacerlo todo el tiempo que quiera",
    "list_options": [
      {
        "id": 1,
        "text": "Extremadamente cierto",
        "value": 3,
        "url": null
      },
      {
        "id": 2,
        "text": "Bastante cierto",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Ligeramente cierto",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Ni cierto, ni falso",
        "value": 0,
        "url": null
      },
      {
        "id": 5,
        "text": "Ligeramente falso",
        "value": 1,
        "url": null
      },
      {
        "id": 6,
        "text": "Bastante falso",
        "value": 2,
        "url": null
      },
      {
        "id": 7,
        "text": "Extremadamente falso",
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
    "text": "4. Necesito hacerlo cada vez con mas frecuencia",
    "list_options": [
      {
        "id": 1,
        "text": "Extremadamente cierto",
        "value": 3,
        "url": null
      },
      {
        "id": 2,
        "text": "Bastante cierto",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Ligeramente cierto",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Ni cierto, ni falso",
        "value": 0,
        "url": null
      },
      {
        "id": 5,
        "text": "Ligeramente falso",
        "value": 1,
        "url": null
      },
      {
        "id": 6,
        "text": "Bastante falso",
        "value": 2,
        "url": null
      },
      {
        "id": 7,
        "text": "Extremadamente falso",
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
    "text": "5. Hacerlo me relaja y/o me tranquiliza",
    "list_options": [
      {
        "id": 1,
        "text": "Extremadamente cierto",
        "value": 3,
        "url": null
      },
      {
        "id": 2,
        "text": "Bastante cierto",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Ligeramente cierto",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Ni cierto, ni falso",
        "value": 0,
        "url": null
      },
      {
        "id": 5,
        "text": "Ligeramente falso",
        "value": 1,
        "url": null
      },
      {
        "id": 6,
        "text": "Bastante falso",
        "value": 2,
        "url": null
      },
      {
        "id": 7,
        "text": "Extremadamente falso",
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
    "text": "6. He notado que necesito hacerlo en mas cantidad que antes",
    "list_options": [
      {
        "id": 1,
        "text": "Extremadamente cierto",
        "value": 3,
        "url": null
      },
      {
        "id": 2,
        "text": "Bastante cierto",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Ligeramente cierto",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Ni cierto, ni falso",
        "value": 0,
        "url": null
      },
      {
        "id": 5,
        "text": "Ligeramente falso",
        "value": 1,
        "url": null
      },
      {
        "id": 6,
        "text": "Bastante falso",
        "value": 2,
        "url": null
      },
      {
        "id": 7,
        "text": "Extremadamente falso",
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
    "text": "7. Si me vienen las ganas tengo que hacerlo inmediatamente",
    "list_options": [
      {
        "id": 1,
        "text": "Extremadamente cierto",
        "value": 3,
        "url": null
      },
      {
        "id": 2,
        "text": "Bastante cierto",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Ligeramente cierto",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Ni cierto, ni falso",
        "value": 0,
        "url": null
      },
      {
        "id": 5,
        "text": "Ligeramente falso",
        "value": 1,
        "url": null
      },
      {
        "id": 6,
        "text": "Bastante falso",
        "value": 2,
        "url": null
      },
      {
        "id": 7,
        "text": "Extremadamente falso",
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
    "text": "8. Si me vienen las ganas tengo que hacerlo inmediatamente",
    "list_options": [
      {
        "id": 1,
        "text": "Extremadamente cierto",
        "value": 3,
        "url": null
      },
      {
        "id": 2,
        "text": "Bastante cierto",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Ligeramente cierto",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Ni cierto, ni falso",
        "value": 0,
        "url": null
      },
      {
        "id": 5,
        "text": "Ligeramente falso",
        "value": 1,
        "url": null
      },
      {
        "id": 6,
        "text": "Bastante falso",
        "value": 2,
        "url": null
      },
      {
        "id": 7,
        "text": "Extremadamente falso",
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
    "text": "9. Una vez empezando, no puedo parar de hacerlo hasta que algo exterior me lo impide",
    "list_options": [
      {
        "id": 1,
        "text": "Extremadamente cierto",
        "value": 3,
        "url": null
      },
      {
        "id": 2,
        "text": "Bastante cierto",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Ligeramente cierto",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Ni cierto, ni falso",
        "value": 0,
        "url": null
      },
      {
        "id": 5,
        "text": "Ligeramente falso",
        "value": 1,
        "url": null
      },
      {
        "id": 6,
        "text": "Bastante falso",
        "value": 2,
        "url": null
      },
      {
        "id": 7,
        "text": "Extremadamente falso",
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
    "text": "10. Cuando estoy un tiempo sin hacerlo siento inquietud o nerviosismo",
    "list_options": [
      {
        "id": 1,
        "text": "Extremadamente cierto",
        "value": 3,
        "url": null
      },
      {
        "id": 2,
        "text": "Bastante cierto",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Ligeramente cierto",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Ni cierto, ni falso",
        "value": 0,
        "url": null
      },
      {
        "id": 5,
        "text": "Ligeramente falso",
        "value": 1,
        "url": null
      },
      {
        "id": 6,
        "text": "Bastante falso",
        "value": 2,
        "url": null
      },
      {
        "id": 7,
        "text": "Extremadamente falso",
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
    "text": "11. Si algo me impide hacerlo no siento ninguna molestia y noto tranquilidad",
    "list_options": [
      {
        "id": 1,
        "text": "Extremadamente cierto",
        "value": 3,
        "url": null
      },
      {
        "id": 2,
        "text": "Bastante cierto",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Ligeramente cierto",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Ni cierto, ni falso",
        "value": 0,
        "url": null
      },
      {
        "id": 5,
        "text": "Ligeramente falso",
        "value": 1,
        "url": null
      },
      {
        "id": 6,
        "text": "Bastante falso",
        "value": 2,
        "url": null
      },
      {
        "id": 7,
        "text": "Extremadamente falso",
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
    "text": "12. Siento placer al hacerlo",
    "list_options": [
      {
        "id": 1,
        "text": "Extremadamente cierto",
        "value": 3,
        "url": null
      },
      {
        "id": 2,
        "text": "Bastante cierto",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Ligeramente cierto",
        "value": 1,
        "url": null
      },
      {
        "id": 4,
        "text": "Ni cierto, ni falso",
        "value": 0,
        "url": null
      },
      {
        "id": 5,
        "text": "Ligeramente falso",
        "value": 1,
        "url": null
      },
      {
        "id": 6,
        "text": "Bastante falso",
        "value": 2,
        "url": null
      },
      {
        "id": 7,
        "text": "Extremadamente falso",
        "value": 3,
        "url": null
      }
    ],
    "conditional": null
  }
],
};
