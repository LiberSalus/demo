// src/config/cuestionarios.config.js
// Los perfiles de salud filtran por persona demo (ver src/utils/profile.js):
//   adulto_activo (18-60) | mayor_asistido (>60) | menor_tutor (<18)
// La edad exacta por instrumento vive en el JSON (target_age_group, contrato dh_forms);
// aqui solo se declara que perfiles pueden verlo.

const ADULTO = ["adulto_activo", "mayor_asistido"];      // >= 18 anos
const DESDE_14 = ["adulto_activo", "mayor_asistido"];    // >= 14 anos
const DESDE_12 = ["menor_tutor", "adulto_activo", "mayor_asistido"]; // >= 12 anos
const MENOR = ["menor_tutor"];                            // 6-17 anos (CDI/EDAH)
const MAYOR = ["mayor_asistido"];                         // > 60 anos (GDS)
const TAS = ["adulto_activo"];                            // 18-59 anos

export const AREAS = [
  {
    id: "fisico",
    name: "Bienestar Físico",
    area3D: "Físico",
    descripcion: "Evalúa tu estado de salud, energía, actividad física y descanso.",
    questionnaires: [
      {
        key: "CALIDAD_VIDA_SF12",
        name: "Calidad de Vida SF-12",
        description: "Evalúa el estado de salud y calidad de vida.",
        profiles: ["adulto_activo", "mayor_asistido"],
        unlock_if: null,
        file: () => import("@/pages/Cuestionarios/propuesta2.json"),
      },
      // Ejemplo: se libera si SF12 ≥ 50% o si existe respuesta específica
      {
        key: "EJERCICIO_HABITOS",
        name: "Hábitos de Ejercicio (Follow-up)",
        description: "Profundiza si se detectan áreas de mejora.",
        profiles: ["adulto_activo"],
        unlock_if: {
          any: [
            { type: "percent", of: "CALIDAD_VIDA_SF12", op: ">=", value: 50 },
            { type: "answer", qid: 5, of: "CALIDAD_VIDA_SF12", op: "includes", value: 3 },
          ],
        },
        file: () => import("@/pages/Cuestionarios/propuesta2.json"),
      },
    ],
  },
  {
    id: "emocional",
    name: "Bienestar Emocional",
    area3D: "Emocional",
    descripcion: "Mide tu nivel de estrés, emociones y bienestar psicológico.",
    questionnaires: [
      {
        key: "GAD-7",
        name: "GAD-7 (Trastorno de Ansiedad Generalizada)",
        description: "Conoce la frecuencia de síntomas de ansiedad.",
        profiles: ADULTO,
        unlock_if: null,
        file: () => import("@/config/cuestionarios/gad7.js"),
      },
      {
        key: "PHQ-9",
        name: "PHQ-9 (Patient Health Questionnaire)",
        description: "Evalúa tu estado de ánimo de las últimas dos semanas.",
        profiles: ADULTO,
        unlock_if: null,
        file: () => import("@/config/cuestionarios/phq9.js"),
      },
      {
        key: "HADS",
        name: "HADS (Ansiedad y Depresión Hospitalaria)",
        description: "Escala de ansiedad y depresión de la última semana.",
        profiles: DESDE_14,
        unlock_if: null,
        file: () => import("@/config/cuestionarios/hads.js"),
      },
      {
        key: "CDI",
        name: "CDI (Inventario de Depresión Infantil)",
        description: "Cómo se siente el niño o la niña (7-17 años).",
        profiles: MENOR,
        unlock_if: null,
        file: () => import("@/config/cuestionarios/cdi.js"),
      },
      {
        key: "GDS",
        name: "GDS (Depresión Geriátrica de Yesavage)",
        description: "Estado de ánimo en personas mayores de 60 años.",
        profiles: MAYOR,
        unlock_if: null,
        file: () => import("@/config/cuestionarios/gds.js"),
      },
      {
        key: "CTH",
        name: "CTH (Trastorno Bipolar / MDQ)",
        description: "Evalúa periodos de ánimo elevado o irritable.",
        profiles: ADULTO,
        unlock_if: null,
        file: () => import("@/config/cuestionarios/cth.js"),
      },
      {
        key: "EDAH",
        name: "EDAH (Evaluación del TDAH en niños)",
        description: "Comportamiento del niño o la niña (6-17 años).",
        profiles: MENOR,
        unlock_if: null,
        file: () => import("@/config/cuestionarios/edah.js"),
      },
      {
        key: "ASRS",
        name: "ASRS-V1.1 (TDAH en adultos)",
        description: "Frecuencia de síntomas de inatención e hiperactividad.",
        profiles: ADULTO,
        unlock_if: null,
        file: () => import("@/config/cuestionarios/asrs.js"),
      },
      {
        key: "DTS",
        name: "DTS (Escala de Trauma de Davidson)",
        description: "Frecuencia y gravedad de síntomas de estrés postraumático.",
        profiles: ADULTO,
        unlock_if: null,
        file: () => import("@/config/cuestionarios/dts.js"),
      },
      {
        key: "SPIN",
        name: "SPIN (Inventario de Fobia Social)",
        description: "Malestar o temor en situaciones sociales.",
        profiles: DESDE_12,
        unlock_if: null,
        file: () => import("@/config/cuestionarios/spin.js"),
      },
      {
        key: "TAS-20",
        name: "TAS-20 (Alexitimia de Toronto)",
        description: "Cómo te relacionas con tus emociones (18-59 años).",
        profiles: TAS,
        unlock_if: null,
        file: () => import("@/config/cuestionarios/tas20.js"),
      },
      {
        key: "EAG",
        name: "EAG (Escala de Adicción General)",
        description: "Relación con ciertos hábitos o conductas.",
        profiles: DESDE_12,
        unlock_if: null,
        file: () => import("@/config/cuestionarios/eag.js"),
      },
    ],
  },
  {
    id: "social",
    name: "Bienestar Social",
    area3D: "Social",
    descripcion: "Conoce tu interacción con familiares, amigos y comunidad.",
    questionnaires: [],
  },
  {
    id: "nutricional",
    name: "Bienestar Nutricional",
    area3D: "Nutricional",
    descripcion: "Identifica tus hábitos de alimentación y oportunidades de mejora.",
    questionnaires: [],
  },
];

export const findArea = (areaId) =>
  AREAS.find((a) => a.id === (areaId || "").toLowerCase());

export const findQuestionnaire = (areaId, key) => {
  const a = findArea(areaId);
  if (!a) return null;
  return a.questionnaires.find((q) => q.key === key) || null;
};
