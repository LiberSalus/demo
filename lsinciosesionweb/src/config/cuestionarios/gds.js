// src/config/cuestionarios/gds.js
// GDS (Escala de Depresion Geriatrica de Yesavage) — generado desde docs/historia_clinica/questionnaires/mermaid/cuestionario_gds.mmd
// (auditoria del drawio: ver tmp/auditoria_*.py). Contrato: dh_forms (key, name,
// description, estimated_duration, list_cie11_codes, list_categories, target_age_group,
// list_questions + conditional) con extensiones demo (scoring, interpretacion, area).
// Nota: la tabla de interpretacion viene de cuestionario_gds-review.md.

export default {
  id: "GDS",  // id estable (clave del cuestionario)
  key: "GDS",  // contrato dh_forms
  name: "GDS (Escala de Depresion Geriatrica de Yesavage)",
  description: "Escala de 14 preguntas sobre su estado de animo durante la ultima semana.",
  area: "Emocional",
  area_desc: "Instrumentos para conocer tu bienestar emocional y psicologico.",
  instrucciones: "En la ultima semana",
  estimated_duration: { min_minutes: 5, max_minutes: 15, description: 'Duracion estimada para completar el cuestionario' },
  list_cie11_codes: [{"code": "6A7"}],
  list_categories: [{ key_industry: 1, name: 'Bienestar mental' }],
  list_evaluation_topics: [{"name": "Depresion geriatrica", "key_industry": "health"}],
  target_age_group: {"min_age": 61, "name": "Mayores de 60 anos"},
  scoring: {"tipo": "suma", "maximo": 14},
  interpretacion: [{"desde": 0, "hasta": 5, "texto": "Sin depresion"}, {"desde": 6, "hasta": 9, "texto": "Probable depresion"}, {"desde": 10, "hasta": 14, "texto": "Depresion establecida"}],
  list_questions: [
  {
    "id": 1,
    "order": 1,
    "type": "SINGLE_CHOICE",
    "text": "1. ¿Esta Ud. basicamente satisfecho con su vida?",
    "list_options": [
      {
        "id": 1,
        "text": "Si",
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
    "id": 2,
    "order": 2,
    "type": "SINGLE_CHOICE",
    "text": "2. ¿Ha disminuido o abandonado muchos de sus intereses o actividades previas?",
    "list_options": [
      {
        "id": 1,
        "text": "Si",
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
    "text": "3. ¿Siente que su vida esta vacia?",
    "list_options": [
      {
        "id": 1,
        "text": "Si",
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
    "text": "4. ¿Se siente aburrido frecuentemente?",
    "list_options": [
      {
        "id": 1,
        "text": "Si",
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
    "text": "5. ¿Esta Ud. de buen animo la mayoria del tiempo?",
    "list_options": [
      {
        "id": 1,
        "text": "Si",
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
    "id": 6,
    "order": 6,
    "type": "SINGLE_CHOICE",
    "text": "6. ¿Esta preocupado o teme que algo malo le va a pasar?",
    "list_options": [
      {
        "id": 1,
        "text": "Si",
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
    "text": "7. ¿Se siente feliz la mayor parte del tiempo?",
    "list_options": [
      {
        "id": 1,
        "text": "Si",
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
    "id": 8,
    "order": 8,
    "type": "SINGLE_CHOICE",
    "text": "8. ¿Se siente con frecuencia desamparado?",
    "list_options": [
      {
        "id": 1,
        "text": "Si",
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
    "text": "9. ¿Prefiere Ud. quedarse en casa a salir a hacer cosas nuevas?",
    "list_options": [
      {
        "id": 1,
        "text": "Si",
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
    "text": "10. ¿Siente Ud. que tiene mas problemas con su memoria que otras personas de su edad?",
    "list_options": [
      {
        "id": 1,
        "text": "Si",
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
    "text": "11. ¿Cree Ud. que es maravilloso estar vivo?",
    "list_options": [
      {
        "id": 1,
        "text": "Si",
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
    "id": 12,
    "order": 12,
    "type": "SINGLE_CHOICE",
    "text": "12. ¿Se siente inutil o despreciable con esta Ud. actualmente?",
    "list_options": [
      {
        "id": 1,
        "text": "Si",
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
    "text": "13. ¿Se siente lleno de energia?",
    "list_options": [
      {
        "id": 1,
        "text": "Si",
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
    "id": 14,
    "order": 14,
    "type": "SINGLE_CHOICE",
    "text": "14. ¿Se encuentra sin esperanza ante su situacion actual?",
    "list_options": [
      {
        "id": 1,
        "text": "Si",
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
  }
],
};
