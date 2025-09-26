// src/utils/logicPreg.js

// Normaliza el bloque de condiciones venga como venga
const rawShowIf = (q) =>
  q?.show_if ?? q?.showIf ?? q?.conditions ?? q?.condition ?? q?.conditional ?? null;

// Convierte a un shape estándar: { all:[...] } | { any:[...] }
const normalizeShowIf = (cond) => {
  if (!cond) return null;
  // ya viene en forma estándar
  if (cond.all || cond.any) return cond;

  // viene como { type: 'all'|'any', rules: [...] }
  if (cond.type && Array.isArray(cond.rules)) {
    if (cond.type.toLowerCase() === "all") return { all: cond.rules };
    if (cond.type.toLowerCase() === "any") return { any: cond.rules };
  }
  return null;
};

const pickShowIf = (q) => normalizeShowIf(rawShowIf(q));

// Coerción suave de tipos (número vs string)
const coerce = (a, b) => {
  const na = typeof a === "string" && a.trim() !== "" && !isNaN(Number(a)) ? Number(a) : a;
  const nb = typeof b === "string" && b.trim() !== "" && !isNaN(Number(b)) ? Number(b) : b;
  return [na, nb];
};

export const evalRule = (answers, { q, op, value }) => {
  const aRaw = answers[q];
  const [a, v] = coerce(aRaw, value);

  switch (op) {
    case "==": return a === v;
    case "!=": return a !== v;
    case "includes": return Array.isArray(a) && a.includes(v);
    case "notIncludes": return Array.isArray(a) && !a.includes(v);
    case "in": return Array.isArray(v) && v.includes(a);
    case "notIn": return Array.isArray(v) && !v.includes(a);

    case "exists": return a !== undefined && a !== null && a !== "";
    case "notEmpty": return Array.isArray(a) ? a.length > 0 : (a !== "" && a !== undefined && a !== null);
    default: return true;
  }
};

export const evalShowIf = (answers, show_if_like) => {
  const show_if = normalizeShowIf(show_if_like);
  if (!show_if) return true;

  if (show_if.all) return show_if.all.every(rule => evalRule(answers, rule));
  if (show_if.any) return show_if.any.some(rule => evalRule(answers, rule));
  return true;
};

// Limpia respuestas de preguntas que dejan de ser visibles
export const pruneHidden = (answers, questions) => {
  let out = { ...answers };
  let changed = true;
  while (changed) {
    changed = false;
    questions.forEach(q => {
      const showIf = pickShowIf(q);
      const visible = evalShowIf(out, showIf);
      if (!visible && out[q.id] !== undefined) {
        delete out[q.id];
        changed = true;
      }
    });
  }
  return out;
};

// ---------- Progreso reusable ----------
export const computeProgress = (questions, answers) => {
  const visibles = questions.filter(q => evalShowIf(answers, pickShowIf(q)));
  const answered = visibles.filter(q => {
    const r = answers[q.id];
    if (q.type === "MULTIPLE_CHOICE") return Array.isArray(r) && r.length > 0;
    return r !== undefined && r !== "";
  }).length;
  return { visiblesCount: visibles.length, answeredCount: answered };
};

export const computeProgressPercent = (questions, answers) => {
  const { visiblesCount, answeredCount } = computeProgress(questions, answers);
  return {
    percent: visiblesCount > 0 ? Math.round((answeredCount / visiblesCount) * 100) : 0,
    visiblesCount,
    answeredCount,
  };
};

// ---------- Storage helpers ----------
export const storageKeyFor = (questionnaireIdOrName = "default") =>
  `respuestasCuestionario:${questionnaireIdOrName}`;

export const loadAnswers = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
};

export const saveAnswers = (key, answers) => {
  localStorage.setItem(key, JSON.stringify(answers));
};

// Export util si lo necesitas en otros lados
export const _pickShowIf = (q) => pickShowIf(q);
