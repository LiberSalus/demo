// src/utils/exportarExcel.js
// Export de cuestionarios completados a Excel (.xlsx) — 100 % en el cliente.
// Estructura del archivo (por categoría):
//   Hoja 1 "Datos del paciente"   → identidad + perfil
//   Hoja 2 "Resumen"              → instrumento | puntaje | interpretación | estado | fecha
//   Hoja N por instrumento        → pregunta_code | pregunta | answer
// La fuente de datos son los propios JSONs (scoring/interpretacion) y las
// respuestas guardadas en localStorage (respuestasCuestionario:{id}).

import * as XLSX from "xlsx";
import JSZip from "jszip";
import { DEMO_ACTIVO, obtenerPerfilDemo } from "@/config/demo.config";
import { AREAS } from "@/config/cuestionarios.config";
import { loadAnswers, storageKeyFor, computeProgressPercent } from "@/utils/logicPreg";
import { getCurrentProfile } from "@/utils/profile";

// ---------- Datos del paciente (demo o sesión real) ----------
export function obtenerDatosPaciente() {
  if (DEMO_ACTIVO) {
    const p = obtenerPerfilDemo();
    return {
      nombre: p.nombre,
      edad: p.edad,
      sexo: p.sexo,
      perfil: p.perfil,
      correo: p.correo || p.email,
      peso: p.peso,
      sangre: p.sangre,
      estatura: p.estatura,
    };
  }
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    const pm = JSON.parse(localStorage.getItem("perfil_min") || "{}");
    return {
      nombre: [u.first_name, u.last_name].filter(Boolean).join(" ") || pm.nombre || "",
      edad: pm.edad ?? u.edad ?? "",
      sexo: u.sexo || pm.sexo || "",
      perfil: pm.profile || "",
      correo: u.email || u.username || pm.correo || "",
      peso: pm.peso || "",
      sangre: pm.sangre || "",
      estatura: pm.estatura || "",
    };
  } catch {
    return {};
  }
}

// ---------- Cálculo de puntaje (suma | subescalas) ----------
// Devuelve un arreglo de filas: una por instrumento (suma) o una por
// subescala. La interpretación solo se asigna si la aplicación está completa.
export function calcularPuntaje(instrumento, respuestas = {}, { completo = false } = {}) {
  const scoring = instrumento?.scoring;
  if (!scoring) return [];
  const interpretacion = instrumento?.interpretacion || [];

  const sumaItems = (items) =>
    (items || []).reduce((acc, pid) => acc + (Number(respuestas[pid]) || 0), 0);

  const interpretar = (puntaje, maximo, subescalaId) => {
    if (!completo) return null; // solo se interpreta lo completado
    const candidatos = subescalaId
      ? interpretacion.filter((r) => r.subescala === subescalaId)
      : interpretacion;
    const rango = candidatos.find((r) => puntaje >= r.desde && puntaje <= r.hasta);
    return rango ? rango.texto : null;
  };

  if (scoring.tipo === "subescalas") {
    return (scoring.subescalas || []).map((sub) => {
      const puntaje = sumaItems(sub.items);
      return {
        subescalaId: sub.id,
        nombre: sub.nombre,
        puntaje,
        maximo: sub.maximo,
        interpretacion: interpretar(puntaje, sub.maximo, sub.id),
      };
    });
  }

  // suma — items opcionales (p. ej. CTH solo suma 1-14; 15-16 son criterios)
  const ids = scoring.items || instrumento.list_questions.map((q) => q.id);
  const puntaje = sumaItems(ids);
  return [
    {
      subescalaId: null,
      nombre: null,
      puntaje,
      maximo: scoring.maximo,
      interpretacion: interpretar(puntaje, scoring.maximo, null),
    },
  ];
}

// ---------- Hojas ----------
const textoDeValor = (q, valor) => {
  const opt = (q.list_options || []).find((o) => Number(o.value) === Number(valor));
  return opt ? opt.text : null;
};

const respuestaTexto = (q, r) => {
  if (q.type === "MULTIPLE_CHOICE" && Array.isArray(r)) {
    return r.map((v) => textoDeValor(q, v)).filter(Boolean).join("; ");
  }
  if (q.type === "SINGLE_CHOICE") return textoDeValor(q, r) ?? String(r);
  return String(r); // TEXT
};

// Valor numérico codificado de la respuesta (fiel al diagrama/list_options).
// SINGLE_CHOICE → el value de la opción (0-3); MULTIPLE_CHOICE → valores
// separados; TEXT → sin valor codificado (celda vacía).
const valorNumerico = (q, r) => {
  if (q.type === "MULTIPLE_CHOICE" && Array.isArray(r)) {
    return r.map(Number).join("; ");
  }
  if (q.type === "SINGLE_CHOICE") {
    const opt = (q.list_options || []).find((o) => Number(o.value) === Number(r));
    return opt ? Number(opt.value) : "";
  }
  return ""; // TEXT
};

export function construirHojaPaciente(perfil = {}, areaName = "") {
  const pesoSangreEstatura = [perfil.peso, perfil.sangre, perfil.estatura]
    .filter((v) => v)
    .join(" / ");
  const filas = [
    ["PACIENTE", perfil.nombre || ""],
    ["EDAD", perfil.edad ? `${perfil.edad} años` : ""],
    ["SEXO", perfil.sexo || ""],
    ["PERFIL", perfil.perfil || ""],
    ["CORREO", perfil.correo || ""],
    ["PESO / SANGRE / ESTATURA", pesoSangreEstatura],
    ["FECHA DE GENERACIÓN", new Date().toLocaleDateString("es-MX")],
    ["ÁREA DEL REPORTE", areaName],
  ];
  const ws = XLSX.utils.aoa_to_sheet(filas);
  ws["!cols"] = [{ wch: 26 }, { wch: 46 }];
  return ws;
}

export function construirHojaResumen(filas = []) {
  const header = ["INSTRUMENTO", "PUNTAJE", "INTERPRETACIÓN", "ESTADO", "FECHA"];
  const data = filas.map((f) => [
    f.subescala ? `${f.instrumento}-${f.subescala}` : f.instrumento,
    f.maximo != null ? `${f.puntaje}/${f.maximo}` : String(f.puntaje ?? ""),
    f.interpretacion || "",
    f.estado || "",
    f.fecha || "",
  ]);
  const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
  ws["!cols"] = [{ wch: 18 }, { wch: 12 }, { wch: 42 }, { wch: 14 }, { wch: 14 }];
  return ws;
}

export function construirHojaInstrumento(instrumento, respuestas = {}) {
  const filas = [["PREGUNTA_CODE", "PREGUNTA", "ANSWER", "ANSWER_VALUE"]];
  (instrumento.list_questions || []).forEach((q) => {
    const r = respuestas[q.id];
    if (r === undefined || r === null || r === "") return; // sin respuesta: omitir
    const texto = String(q.text || "").replace(/^\d+[.)]\s*/, "");
    filas.push([q.id, texto, respuestaTexto(q, r).toUpperCase(), valorNumerico(q, r)]);
  });
  const ws = XLSX.utils.aoa_to_sheet(filas);
  ws["!cols"] = [{ wch: 10 }, { wch: 70 }, { wch: 40 }, { wch: 14 }];
  return ws;
}

// ---------- Workbook por área ----------
// instrumentos: [{ json, respuestas, completo, fecha }] — solo los que tengan respuestas.
export function construirWorkbookArea({ areaName = "", perfil = {}, instrumentos = [] }) {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, construirHojaPaciente(perfil, areaName), "Datos del paciente");

  const filasResumen = [];
  instrumentos.forEach(({ json, respuestas, completo = false, fecha = "" }) => {
    const nombre = json.key || json.id || json.name || "Instrumento";
    calcularPuntaje(json, respuestas, { completo }).forEach((r) => {
      filasResumen.push({
        instrumento: nombre,
        subescala: r.subescalaId,
        puntaje: r.puntaje,
        maximo: r.maximo,
        interpretacion: r.interpretacion,
        estado: completo ? "Completado" : "En progreso",
        fecha,
      });
    });
  });
  if (filasResumen.length) {
    XLSX.utils.book_append_sheet(wb, construirHojaResumen(filasResumen), "Resumen");
  }

  instrumentos.forEach(({ json, respuestas }) => {
    XLSX.utils.book_append_sheet(wb, construirHojaInstrumento(json, respuestas), nombreHoja(json));
  });

  return wb;
}

const nombreHoja = (json) => {
  const base = String(json.key || json.id || "Hoja").slice(0, 31);
  return base.replace(/[\\/?*[\]:]/g, "_");
};

// ---------- Descarga ----------
export function fechaArchivo() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function descargarXlsx(workbook, nombreArchivo) {
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------- Descarga ZIP: todas las categorías ----------
// Arma un .xlsx por área (las que tengan respuestas) y los empaqueta en un
// zip. Devuelve la cantidad de archivos incluidos (0 si no hay respuestas).
export async function descargarZipTodo({
  perfil = obtenerDatosPaciente(),
  onProgreso,
} = {}) {
  const profile = getCurrentProfile();
  const zip = new JSZip();
  const nombresUsados = new Set();
  let incluidos = 0;
  let sufijo = 0;

  for (const area of AREAS) {
    onProgreso?.(area.name);
    const elegibles = (area.questionnaires || []).filter(
      (q) => !q.profiles || q.profiles.includes(profile)
    );
    const instrumentos = [];
    for (const meta of elegibles) {
      const mod = await meta.file();
      const json = mod.default || mod;
      const respuestas = loadAnswers(storageKeyFor(meta.key || meta.name));
      if (!Object.keys(respuestas).length) continue;
      const { percent, answeredCount } = computeProgressPercent(
        json.list_questions,
        respuestas
      );
      instrumentos.push({
        json,
        respuestas,
        completo: percent === 100 && answeredCount > 0,
        fecha: new Date().toLocaleDateString("es-MX"),
      });
    }
    if (!instrumentos.length) continue;

    const wb = construirWorkbookArea({
      areaName: area.name,
      perfil,
      instrumentos,
    });
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    let nombre = `Reporte_${area.name.replace(/\s+/g, "_")}_${fechaArchivo()}.xlsx`;
    while (nombresUsados.has(nombre)) {
      sufijo += 1;
      nombre = `Reporte_${area.name.replace(/\s+/g, "_")}_${fechaArchivo()}_${sufijo}.xlsx`;
    }
    nombresUsados.add(nombre);
    zip.file(nombre, wbout);
    incluidos += 1;
  }

  if (!incluidos) return 0;

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Reporte_Cuestionarios_Todas_las_Categorias_${fechaArchivo()}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return incluidos;
}
