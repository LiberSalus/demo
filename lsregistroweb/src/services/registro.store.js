// src/services/registro.store.js
export const REG_FLOW_KEY = "reg_flow";

export function loadFlow() {
  try { return JSON.parse(sessionStorage.getItem(REG_FLOW_KEY) || "{}"); }
  catch { return {}; }
}

export function saveFlow(obj) {
  sessionStorage.setItem(REG_FLOW_KEY, JSON.stringify(obj || {}));
}

export function clearFlow() {
  sessionStorage.removeItem(REG_FLOW_KEY);
}
