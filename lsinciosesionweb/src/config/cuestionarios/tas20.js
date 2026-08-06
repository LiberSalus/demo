// src/config/cuestionarios/tas20.js
// TAS-20 (Escala de Alexitimia de Toronto) — generado desde docs/historia_clinica/questionnaires/mermaid/cuestionario_tas.mmd
// (auditoria del drawio: ver tmp/auditoria_*.py). Contrato: dh_forms (key, name,
// description, estimated_duration, list_cie11_codes, list_categories, target_age_group,
// list_questions + conditional) con extensiones demo (scoring, interpretacion, area).
// Nota: la tabla de interpretacion viene de cuestionario_tas-review.md.

export default {
  id: "TAS-20",  // id estable (clave del cuestionario)
  key: "TAS-20",  // contrato dh_forms
  name: "TAS-20 (Escala de Alexitimia de Toronto)",
  description: "Escala de 19 enunciados sobre como se siente respecto a sus emociones.",
  area: "Emocional",
  area_desc: "Instrumentos para conocer tu bienestar emocional y psicologico.",
  instrucciones: "Seleccione la opcion que mejor describa como se siente respecto a cada enunciado.",
  estimated_duration: { min_minutes: 5, max_minutes: 10, description: 'Duracion estimada para completar el cuestionario' },
  list_cie11_codes: [],
  list_categories: [{ key_industry: 1, name: 'Bienestar mental' }],
  list_evaluation_topics: [{"name": "Alexitimia", "key_industry": "health"}],
  target_age_group: {"min_age": 18, "max_age": 59, "name": "De 18 a 59 anos"},
  scoring: {"tipo": "suma", "maximo": 95},
  interpretacion: [{"desde": 20, "hasta": 51, "texto": "Ausencia de alexitimia"}, {"desde": 52, "hasta": 60, "texto": "Posible alexitimia"}, {"desde": 61, "hasta": 95, "texto": "Alexitimia"}],
  list_questions: [
  {
    "id": 1,
    "order": 1,
    "type": "SINGLE_CHOICE",
    "text": "1. A menudo estoy confuso con las emociones que estoy sintiendo",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 5,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
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
    "text": "2. Me es dificil encontrar las palabras correctas para expresar mis sentimientos",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 5,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
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
    "text": "3. Tengo sensaciones fisicas que incluso ni los doctores entienden",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 5,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
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
    "text": "4. Soy capaz de expresar mis sentimientos facilmente",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
        "value": 5,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 5,
    "order": 5,
    "type": "SINGLE_CHOICE",
    "text": "5. Prefiero pensar bien acerca de un problema en lugar de solo mencionarlo",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
        "value": 5,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 6,
    "order": 6,
    "type": "SINGLE_CHOICE",
    "text": "6. Cuando estoy mal no se si estoy triste, asustado o enfadado",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 5,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
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
    "text": "7. A menudo estoy confundido con las sensaciones de mi cuerpo",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 5,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
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
    "text": "8. Prefiero dejar que las cosas sucedan solas, sin preguntarme por que suceden de ese modo",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 5,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
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
    "text": "9. Estar en contacto con las emociones es muy importante",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 5,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
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
    "text": "10. Me es dificil expresar lo que siento acerca de las personas",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 5,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
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
    "text": "11. La gente me dice que exprese mas mis sentimientos",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 5,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
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
    "text": "12. No se que pasa dentro de mi",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 5,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
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
    "text": "13. A menudo no se por que estoy enfadado",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 5,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
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
    "text": "14. Prefiero hablar con la gente de sus actividades diarias mejor que de sus sentimientos",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 5,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
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
    "text": "15. Prefiero ver espectaculos simples, pero entretenidos, que dramas psicologicos",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 5,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
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
    "text": "16. Me es dificil revelar mis sentimientos mas profundos incluso a mis amigos mas intimos",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 5,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
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
    "text": "17. Puedo sentirme cercano a alguien, incluso en momentos de silencio",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
        "value": 5,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 18,
    "order": 18,
    "type": "SINGLE_CHOICE",
    "text": "18. Encuentro util examinar mis sentimientos para resolver problemas personales",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 1,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
        "value": 5,
        "url": null
      }
    ],
    "conditional": null
  },
  {
    "id": 19,
    "order": 19,
    "type": "SINGLE_CHOICE",
    "text": "19. Buscar significados ocultos a peliculas o juegos disminuye el placer de disfrutarlos",
    "list_options": [
      {
        "id": 1,
        "text": "Muy de acuerdo",
        "value": 5,
        "url": null
      },
      {
        "id": 2,
        "text": "De acuerdo",
        "value": 4,
        "url": null
      },
      {
        "id": 3,
        "text": "Indeciso",
        "value": 3,
        "url": null
      },
      {
        "id": 4,
        "text": "En desacuerdo",
        "value": 2,
        "url": null
      },
      {
        "id": 5,
        "text": "Muy en desacuerdo",
        "value": 1,
        "url": null
      }
    ],
    "conditional": null
  }
],
};
