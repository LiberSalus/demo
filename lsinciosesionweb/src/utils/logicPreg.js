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

// Acepta reglas del contrato dh_forms ({ id_question, operator, value }) y las
// del formato interno ({ q, op, value }) sin cambios en los JSON.
const normalizarRegla = (regla) => ({
  q: regla.q ?? regla.id_question,
  op: regla.op ?? regla.operator,
  value: regla.value,
});

export const evalRule = (answers, regla) => {
  const { q, op, value } = normalizarRegla(regla);
  const aRaw = answers[q];
  const [a, v] = coerce(aRaw, value);

  // Respuesta ausente: ninguna comparacion numerica se cumple.
  if (a === undefined || a === null || a === "") {
    if (op === "exists") return false;
    if (op === "notEmpty") return false;
    if (op === "!=") return aRaw !== value; // comparacion literal con ausencia
    return false;
  }

  switch (op) {
    case "==": return a === v;
    case "!=": return a !== v;
    case ">": return typeof a === "number" && a > v;
    case ">=": return typeof a === "number" && a >= v;
    case "<": return typeof a === "number" && a < v;
    case "<=": return typeof a === "number" && a <= v;
    case "includes": return Array.isArray(a) && a.includes(v);
    case "notIncludes": return Array.isArray(a) && !a.includes(v);
    case "in": return Array.isArray(v) && v.includes(a);
    case "notIn": return Array.isArray(v) && !v.includes(a);
    case "exists": return true;
    case "notEmpty": return Array.isArray(a) ? a.length > 0 : true;
    default: return false;
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

// ---------- Fechas de inicio y finalización ----------
// `:inicio` se guarda con el primer guardado que tenga respuestas (la primera
// vez que el cuestionario pasa de "no iniciado"). `:fecha` se guarda solo al
// completarlo (percent === 100). Viven junto al resumen (:pct, :ans, :vis).
export const claveFecha = (key, tipo) => `${key}:${tipo}`; // tipo: "inicio" | "fecha"

export const saveFecha = (key, tipo, iso = new Date().toISOString()) => {
  localStorage.setItem(claveFecha(key, tipo), iso);
};

export const removeFecha = (key, tipo) => {
  localStorage.removeItem(claveFecha(key, tipo));
};

// Devuelve la fecha formateada ("05/08/2026", con ceros a la izquierda) o
// "" si no existe. El formato es fijo (DD/MM/AAAA), sin depender de la locale.
export const loadFecha = (key, tipo) => {
  try {
    const iso = localStorage.getItem(claveFecha(key, tipo));
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso; // no era ISO; se devuelve tal cual
    const p = (n) => String(n).padStart(2, "0");
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
  } catch {
    return "";
  }
};

// Atajos legibles
const fechaInicio = (key) => loadFecha(key, "inicio");
const fechaFinalizacion = (key) => loadFecha(key, "fecha");

export const loadFechaInicio = fechaInicio;
export const loadFechaFinalizacion = fechaFinalizacion;

// Export util si lo necesitas en otros lados
export const _pickShowIf = (q) => pickShowIf(q);
