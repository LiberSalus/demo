// src/config/cuestionarios.config.js
export const AREAS = [
  {
    id: "fisico",
    name: "Bienestar Físico",
    area3D: "Físico",
    questionnaires: [
      {
        key: "CALIDAD_VIDA_SF12",
        name: "Calidad de Vida SF-12",
        description: "Evalúa el estado de salud y calidad de vida.",
        profiles: ["adulto_activo", "mayor_asistido"],     // quién aplica
        unlock_if: null,                                   // sin condición extra
        file: () => import("@/pages/Cuestionarios/propuesta2.json"),
      },
      // Ejemplo: se libera si SF12 ≥ 50% o si existe respuesta específica
      {
        key: "EJERCICIO_HABITOS",
        name: "Hábitos de Ejercicio (Follow-up)",
        description: "Profundiza si se detectan áreas de mejora.",
        profiles: ["adulto_activo"],
        unlock_if: { any: [
          { type: "percent", of: "CALIDAD_VIDA_SF12", op: ">=", value: 50 },
          { type: "answer",  qid: 5, of: "CALIDAD_VIDA_SF12", op: "includes", value: 3 } // (p.ej. marcó 'ejercicio')
        ]},
        file: () => import("@/pages/Cuestionarios/propuesta2.json"),
      },
    ],
  },
  {
    id: "mental",
    name: "Bienestar Mental",
    area3D: "Mental",
    questionnaires: [
      {
        key: "MENTAL_DEMO",
        name: "Cuestionario Mental (demo)",
        description: "Demo temporal.",
        profiles: ["adulto_activo", "mayor_asistido", "menor_tutor"],
        unlock_if: null,
        file: () => import("@/pages/Cuestionarios/propuesta2.json"),
      },
    ],
  },
  { id: "social", name: "Bienestar Social", area3D: "Social", questionnaires: [] },
  { id: "nutricional", name: "Bienestar Nutricional", area3D: "Nutricional", questionnaires: [] },
];

export const findArea = (areaId) =>
  AREAS.find(a => a.id === (areaId || "").toLowerCase());

export const findQuestionnaire = (areaId, key) => {
  const a = findArea(areaId);
  if (!a) return null;
  return a.questionnaires.find(q => q.key === key) || null;
};
