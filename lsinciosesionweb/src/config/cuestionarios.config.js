// src/config/cuestionarios.config.js
export const AREAS = [
  {
    id: "fisico",
    name: "Bienestar Físico",
    color: "#0ea5e9",
    area3D: "Físico",
    description:
      "Evalúa tu condición física y hábitos para prevenir riesgos y mejorar tu salud.",
    questionnaires: [
      {
        key: "CALIDAD_VIDA_SF12",
        name: "Calidad de Vida SF-12",
        description:
          "Formulario para evaluar el estado de salud y calidad de vida.",
        file: () => import("@/components/Cuestionarios/data/propuesta2.json"), // lazy
      },
      // agrega más cuestionarios físicos aquí...
    ],
  },
  {
    id: "mental",
    name: "Bienestar Mental",
    color: "#8b5cf6",
    area3D: "Mental",
    description:
      "Identifica tu estado emocional y estrés para orientar apoyos personalizados.",
    questionnaires: [],
  },
  {
    id: "social",
    name: "Bienestar Social",
    color: "#f59e0b",
    area3D: "Social",
    description:
      "Explora tu red de apoyo y participación para fortalecer tu equilibrio social.",
    questionnaires: [],
  },
  {
    id: "nutricional",
    name: "Bienestar Nutricional",
    color: "#10b981",
    area3D: "Nutricional",
    description:
      "Conoce hábitos de alimentación y oportunidades de mejora nutricional.",
    questionnaires: [],
  },
];

export const findArea = (areaId) => AREAS.find(a => a.id === areaId);
export const findQuestionnaire = (areaId, key) => {
  const area = findArea(areaId);
  if (!area) return null;
  return area.questionnaires.find(q => q.key === key) || null;
};
a