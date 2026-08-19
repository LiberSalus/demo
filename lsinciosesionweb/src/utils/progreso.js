import {
  storageKeyFor,
  loadAnswers,
  computeProgressPercent,
  loadFecha,
} from "@/utils/logicPreg";

// Lee cache (PlantillaQs debe guardar :pct, :ans, :vis) + fechas de
// inicio/finalización (:inicio, :fecha) formateadas ("05/08/2026").
export function getProgressSummary(keyOrName) {
  const base = storageKeyFor(keyOrName);
  const pct = Number(localStorage.getItem(`${base}:pct`) || "0");
  const ans = Number(localStorage.getItem(`${base}:ans`) || "0");
  const vis = Number(localStorage.getItem(`${base}:vis`) || "0");
  const guardado = localStorage.getItem(`${base}:guardado`) === "true";
  return {
    percent: pct,
    answeredCount: ans,
    visiblesCount: vis,
    guardado,
    inicio: loadFecha(base, "inicio"),
    fecha: loadFecha(base, "fecha"),
  };
}

export function progressState(percent, guardado = false) {
  if (percent >= 100 && guardado) return "completado";
  if (percent >= 100) return "pendiente"; // 100% sin enviar
  if (percent > 0)   return "progreso";
  return "no_iniciado";
}

// Para desbloqueo: lee percent real (si no hay cache, calcula rápido)
export async function getPercentAccurate(qMeta) {
  const cached = getProgressSummary(qMeta.key);
  if (cached.visiblesCount > 0) return cached.percent;

  try {
    const mod = await qMeta.file();
    const schema = mod.default || mod;
    const answers = loadAnswers(storageKeyFor(qMeta.key || qMeta.name));
    const { percent } = computeProgressPercent(schema.list_questions, answers);
    return percent;
  } catch {
    return 0;
  }
}

// Desbloqueo basado en reglas sencillas
export async function isUnlocked(qMeta, allByKey) {
  // sin condición => desbloqueado
  if (!qMeta.unlock_if) return true;

  const evalRule = async (rule) => {
    if (rule.type === "percent") {
      const target = allByKey[rule.of];
      if (!target) return false;
      const p = await getPercentAccurate(target);
      switch (rule.op) {
        case ">=": return p >= rule.value;
        case ">":  return p >  rule.value;
        case "==": return p === rule.value;
        case "<=": return p <= rule.value;
        case "<":  return p <  rule.value;
        default:   return false;
      }
    }
    if (rule.type === "answer") {
      const target = allByKey[rule.of];
      if (!target) return false;
      const answers = loadAnswers(storageKeyFor(target.key));
      const a = answers?.[rule.qid];
      switch (rule.op) {
        case "==":         return a === rule.value;
        case "includes":   return Array.isArray(a) && a.includes(rule.value);
        case "notIncludes":return Array.isArray(a) && !a.includes(rule.value);
        default:           return false;
      }
    }
    return false;
  };

  if (qMeta.unlock_if.all) {
    for (const r of qMeta.unlock_if.all) { if (!(await evalRule(r))) return false; }
    return true;
  }
  if (qMeta.unlock_if.any) {
    for (const r of qMeta.unlock_if.any) { if (await evalRule(r)) return true; }
    return false;
  }
  return true;
}

// Agregado: promedio por área
export function computeAreaPercent(qList) {
  const valid = qList.filter(q => q.percent !== null && q.percent !== undefined);
  if (valid.length === 0) return 0;
  const sum = valid.reduce((acc, q) => acc + q.percent, 0);
  return Math.round(sum / valid.length);
}

// Global (promedio de las 4 áreas con al menos 1 cuestionario visible)
export function computeGlobalPercent(areaPercents) {
  const vals = areaPercents.filter(p => p !== null && p !== undefined);
  if (vals.length === 0) return 0;
  return Math.round(vals.reduce((a,b)=>a+b,0) / vals.length);
}
