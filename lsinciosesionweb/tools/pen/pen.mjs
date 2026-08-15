#!/usr/bin/env node
/**
 * pen.mjs — utilidades para leer/inspeccionar/editar archivos .pen (formato de pen.dev).
 *
 * Sin dependencias externas (solo node:fs). Uso:
 *
 *   node tools/pen/pen.mjs summary <archivo.pen>            Resumen: version, conteo por tipo, frames raiz, variables/temas
 *   node tools/pen/pen.mjs tree <archivo.pen> [--depth N]    Arbol jerarquico (id, tipo, nombre)
 *   node tools/pen/pen.mjs find <archivo.pen> <texto>        Buscar por id/nombre/tipo/contenido (sin distinguir mayusculas)
 *   node tools/pen/pen.mjs text <archivo.pen>                Extraer todos los textos (id, nombre, contenido)
 *   node tools/pen/pen.mjs palette <archivo.pen>             Colores unicos usados en fill/stroke
 *   node tools/pen/pen.mjs validate <archivo.pen>            Validar estructura contra el schema basico de .pen
 *   node tools/pen/pen.mjs components <archivo.pen>          Detectar componentes: reusable, refs y frames con variantes (Figma)
 *   node tools/pen/pen.mjs edit <archivo.pen> <id> <key> <jsonValor> [--write]
 *                                                           Cambiar una propiedad de un nodo; sin --write solo muestra el cambio
 *
 * Cualquier comando de lectura acepta --json para salida estructurada (p. ej. pipe a jq).
 */

import { readFileSync, writeFileSync } from "node:fs";

const NODE_TYPES = new Set([
  "frame", "group", "rectangle", "ellipse", "path", "polygon", "line",
  "text", "note", "prompt", "context", "icon", "script", "ref",
]);
// Nota: el schema oficial de pen.dev no lista 'line', pero los archivos .pen
// reales de docs/pen.dev lo usan mucho. Se mantiene como tipo valido por eso.

const HELP = `Uso:
  node tools/pen/pen.mjs <comando> <archivo.pen> [opciones]

Comandos:
  summary <archivo>              Resumen del documento
  tree <archivo> [--depth N]     Arbol jerarquico de nodos
  find <archivo> <texto>         Buscar por id/nombre/tipo/contenido
  text <archivo>                 Extraer todos los textos
  palette <archivo>              Colores unicos de fill/stroke
  validate <archivo>             Validar estructura
  components <archivo>           Detectar componentes (reusable, refs, variantes)
  edit <archivo> <id> <key> <jsonValor> [--write]
                                 Modificar una propiedad de un nodo

Opciones:
  --json                         Salida JSON (solo comandos de lectura)
  --depth N                      Profundidad maxima del arbol (default: infinito)
  --write                        En 'edit', guarda el cambio en disco
`;

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(HELP);
  process.exit(args.length === 0 ? 1 : 0);
}

const cmd = args[0];
const useJson = args.includes("--json");

function takeAfter(flag) {
  const i = args.indexOf(flag);
  if (i === -1) return undefined;
  return args[i + 1];
}

// ---------- carga ----------

function load(file) {
  const raw = readFileSync(file, "utf8");
  return { raw, doc: JSON.parse(raw) };
}

// ---------- recorrido ----------

/** Recorre todos los nodos (incluye arboles de reemplazo dentro de `descendants`). */
function* walk(node, path = []) {
  if (node && typeof node === "object" && "type" in node && "id" in node) {
    yield { node, path };
    const next = [...path, node];
    if (Array.isArray(node.children)) {
      for (const child of node.children) yield* walk(child, next);
    }
    if (node.descendants && typeof node.descendants === "object") {
      for (const key of Object.keys(node.descendants)) {
        const d = node.descendants[key];
        if (d && typeof d === "object" && "type" in d && "id" in d) {
          yield* walk(d, next);
        }
      }
    }
  }
}

function allNodes(doc) {
  const out = [];
  for (const child of doc.children || []) out.push(...walk(child));
  return out;
}

function nodePathLabel(path) {
  return path.map((n) => n.id).join(" > ");
}

// ---------- summary ----------

function summary(doc) {
  const nodes = allNodes(doc);
  const byType = {};
  for (const { node } of nodes) {
    byType[node.type] = (byType[node.type] || 0) + 1;
  }
  const roots = (doc.children || []).map((n) => ({
    id: n.id,
    type: n.type,
    name: n.name || "",
  }));
  return {
    version: doc.version,
    totalNodes: nodes.length,
    nodeCounts: byType,
    topLevel: roots,
    hasVariables: Boolean(doc.variables && Object.keys(doc.variables).length),
    hasThemes: Boolean(doc.themes && Object.keys(doc.themes).length),
    hasImports: Boolean(doc.imports && Object.keys(doc.imports).length),
    variables: doc.variables ? Object.keys(doc.variables) : [],
  };
}

// ---------- tree ----------

function tree(doc, depthLimit) {
  const lines = [];
  const render = (node, depth, prefix) => {
    if (depthLimit !== undefined && depth > depthLimit) return;
    const label = [node.id, node.type, node.name].filter(Boolean).join("  ");
    let extra = "";
    if (node.type === "text" && typeof node.content === "string") {
      extra = `  [${node.content.replace(/\s+/g, " ").slice(0, 40)}]`;
    }
    if (typeof node.width === "number" && typeof node.height === "number") {
      extra += `  (${Math.round(node.width)}x${Math.round(node.height)})`;
    }
    lines.push(`${prefix}${label}${extra}`);
    const childPrefix = prefix + "  ";
    for (const child of node.children || []) render(child, depth + 1, childPrefix);
  };
  for (const root of doc.children || []) render(root, 0, "");
  return lines.join("\n");
}

// ---------- find ----------

function find(doc, query) {
  const q = query.toLowerCase();
  const hits = [];
  for (const { node, path } of allNodes(doc)) {
    const hay = [
      node.id,
      node.type,
      node.name,
      typeof node.content === "string" ? node.content : "",
    ]
      .filter((s) => s !== undefined)
      .join(" ")
      .toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        id: node.id,
        type: node.type,
        name: node.name || "",
        content: typeof node.content === "string" ? node.content : undefined,
        path: nodePathLabel(path),
      });
    }
  }
  return hits;
}

// ---------- text ----------

function text(doc) {
  const out = [];
  for (const { node, path } of allNodes(doc)) {
    if (typeof node.content === "string" && node.content.length > 0) {
      out.push({
        id: node.id,
        type: node.type,
        name: node.name || "",
        content: node.content,
        path: nodePathLabel(path),
      });
    }
  }
  return out;
}

// ---------- palette ----------

const HEX_RE = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?([0-9a-fA-F]{2})?$/;

function* colorValues(value) {
  if (typeof value === "string") {
    if (HEX_RE.test(value)) yield value;
    return;
  }
  if (Array.isArray(value)) {
    for (const v of value) yield* colorValues(v);
    return;
  }
  if (value && typeof value === "object") {
    if (typeof value.color === "string") yield* colorValues(value.color);
    if (Array.isArray(value.colors)) yield* colorValues(value.colors);
  }
}

function palette(doc) {
  const counts = new Map();
  for (const { node } of allNodes(doc)) {
    for (const key of ["fill", "stroke"]) {
      if (node[key] !== undefined) {
        for (const c of colorValues(node[key])) {
          counts.set(c, (counts.get(c) || 0) + 1);
        }
      }
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([color, count]) => ({ color, count }));
}

// ---------- validate ----------

function validate(doc) {
  const issues = [];
  if (doc.version !== "2.17") {
    issues.push(`version inesperada: "${doc.version}" (esperada "2.17")`);
  }
  if (!Array.isArray(doc.children)) {
    issues.push("falta el arreglo top-level 'children'");
  }
  const seen = new Set();
  const reusable = new Set();
  for (const { node, path } of allNodes(doc)) {
    if (typeof node.id !== "string" || node.id.length === 0) {
      issues.push(`nodo sin id valido (type=${node.type}, ruta=${nodePathLabel(path)})`);
    } else if (node.id.includes("/")) {
      issues.push(`id con '/' no permitido: "${node.id}"`);
    } else if (seen.has(node.id)) {
      issues.push(`id duplicado: "${node.id}"`);
    } else {
      seen.add(node.id);
    }
    if (node.reusable === true) reusable.add(node.id);
    if (!NODE_TYPES.has(node.type)) {
      issues.push(`tipo de nodo desconocido: "${node.type}" (id=${node.id})`);
    }
    if (node.type === "ref" && typeof node.ref !== "string") {
      issues.push(`nodo ref sin propiedad 'ref' valida (id=${node.id})`);
    }
  }
  // Los ref deben apuntar a un id existente y reusable.
  for (const { node } of allNodes(doc)) {
    if (node.type === "ref") {
      if (!seen.has(node.ref)) {
        issues.push(`ref apunta a id inexistente: "${node.ref}" (id=${node.id})`);
      } else if (!reusable.has(node.ref)) {
        issues.push(`ref apunta a un nodo no 'reusable': "${node.ref}" (id=${node.id})`);
      }
    }
  }
  return { ok: issues.length === 0, issues, nodeCount: seen.size };
}

// ---------- components ----------

const VARIANT_NAME_RE = /^(Property 1=|Type=|State=|Size=|Variant)/;

/** Separa un nombre de variante (estilo Figma) en ejes: "Type=A, State=B" -> {Type:A, State:B}. */
function parseVariantName(name) {
  const axes = {};
  for (const part of String(name).split(",")) {
    const m = part.match(/^\s*([^=]+?)\s*=\s*(.*?)\s*$/);
    if (m) axes[m[1]] = m[2];
  }
  return axes;
}

/** Detecta componentes: nodos reusable, instancias ref y frames con variantes (nombres estilo Figma). */
function components(doc) {
  const nodes = allNodes(doc);
  const reusable = [];
  const refs = [];
  const variantGroups = new Map(); // id del frame padre -> { name, frames: [...] }

  for (const { node, path } of nodes) {
    if (node.reusable === true) reusable.push({ id: node.id, name: node.name || "", path: nodePathLabel(path) });
    if (node.type === "ref") refs.push({ id: node.id, ref: node.ref, path: nodePathLabel(path) });
  }

  for (const { node } of nodes) {
    if (node.type !== "frame" || !Array.isArray(node.children)) continue;
    const variants = node.children.filter((c) => typeof c.name === "string" && VARIANT_NAME_RE.test(c.name));
    if (variants.length === 0) continue;
    const axes = {}; // eje -> set de valores
    for (const v of variants) {
      for (const [axis, value] of Object.entries(parseVariantName(v.name))) {
        (axes[axis] = axes[axis] || new Set()).add(value);
      }
    }
    const axesObj = {};
    for (const [axis, values] of Object.entries(axes)) axesObj[axis] = [...values];
    variantGroups.set(node.id, {
      name: node.name || "(sin nombre)",
      variantCount: variants.length,
      axes: axesObj,
      variants: variants.map((v) => v.name),
    });
  }

  return {
    reusable: reusable.length ? reusable : undefined,
    refs: refs.length ? refs : undefined,
    variantComponents: [...variantGroups.values()],
  };
}

// ---------- edit ----------

function edit(doc, id, key, rawValue) {
  const value = JSON.parse(rawValue);
  const all = allNodes(doc);
  const target = all.find(({ node }) => node.id === id);
  if (!target) return { found: false };
  const { node } = target;
  const before = node[key] === undefined ? undefined : JSON.stringify(node[key]);
  node[key] = value;
  return { found: true, id, key, before, after: JSON.stringify(value) };
}

// ---------- salida ----------

function print(data) {
  if (useJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  if (typeof data === "string") {
    console.log(data);
  }
}

function printSummary(data) {
  if (useJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  console.log(`version:        ${data.version}`);
  console.log(`nodos totales:  ${data.totalNodes}`);
  if (data.hasVariables) console.log(`variables:      ${data.variables.join(", ")}`);
  if (data.hasThemes) console.log(`temas:          si`);
  if (data.hasImports) console.log(`imports:        si`);
  console.log("nodos por tipo:");
  for (const [t, n] of Object.entries(data.nodeCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${t.padEnd(12)} ${n}`);
  }
  console.log("frames raiz:");
  for (const r of data.topLevel) {
    console.log(`  ${r.id}  ${r.type}  ${r.name}`);
  }
}

function printHits(hits) {
  if (useJson) {
    console.log(JSON.stringify(hits, null, 2));
    return;
  }
  if (hits.length === 0) {
    console.log("sin resultados");
    return;
  }
  for (const h of hits) {
    console.log(`[${h.type}] ${h.id}  ${h.name}${h.content ? `  ->  ${h.content}` : ""}`);
    console.log(`        ruta: ${h.path}`);
  }
}

function printPalette(data) {
  if (useJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  for (const { color, count } of data) {
    console.log(`${color}  x${count}`);
  }
}

function printComponents(data) {
  if (useJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  if (data.reusable) {
    console.log(`componentes reutilizables (reusable: true): ${data.reusable.length}`);
    for (const r of data.reusable) console.log(`  ${r.id}  ${r.name}  (${r.path})`);
  } else {
    console.log("componentes reutilizables (reusable: true): 0");
  }
  if (data.refs) {
    console.log(`instancias (ref): ${data.refs.length}`);
    for (const r of data.refs) console.log(`  ${r.id} -> ${r.ref}  (${r.path})`);
  } else {
    console.log("instancias (ref): 0");
  }
  const vc = data.variantComponents;
  console.log(`frames con variantes (estilo Figma): ${vc.length}`);
  for (const c of vc) {
    const axes = Object.entries(c.axes)
      .map(([a, vs]) => `${a}: [${vs.join(", ")}]`)
      .join("  ");
    console.log(`  ${c.name}  (${c.variantCount} variantes)  ${axes}`);
  }
}

function printValidate(data) {
  if (useJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  if (data.ok) {
    console.log(`OK: ${data.nodeCount} nodos validos (version 2.17)`);
  } else {
    console.log(`PROBLEMAS (${data.issues.length}):`);
    for (const i of data.issues) console.log(`  - ${i}`);
  }
}

// ---------- main ----------

try {
  const file = args[1];
  if (!file) {
    console.error("falta el archivo .pen");
    process.exit(1);
  }

  switch (cmd) {
    case "summary": {
      const { doc } = load(file);
      printSummary(summary(doc));
      break;
    }
    case "tree": {
      const { doc } = load(file);
      const depthRaw = takeAfter("--depth");
      const depth = depthRaw !== undefined ? parseInt(depthRaw, 10) : undefined;
      print(tree(doc, depth));
      break;
    }
    case "find": {
      const { doc } = load(file);
      const query = args[2];
      if (!query) {
        console.error("find requiere un texto de busqueda");
        process.exit(1);
      }
      printHits(find(doc, query));
      break;
    }
    case "text": {
      const { doc } = load(file);
      printHits(text(doc));
      break;
    }
    case "palette": {
      const { doc } = load(file);
      printPalette(palette(doc));
      break;
    }
    case "validate": {
      const { doc } = load(file);
      printValidate(validate(doc));
      break;
    }
    case "components": {
      const { doc } = load(file);
      printComponents(components(doc));
      break;
    }
    case "edit": {
      const id = args[2];
      const key = args[3];
      const rawValue = args[4];
      if (!id || !key || rawValue === undefined) {
        console.error("edit requiere: <archivo> <id> <key> <jsonValor> [--write]");
        process.exit(1);
      }
      const { raw, doc } = load(file);
      const result = edit(doc, id, key, rawValue);
      if (!result.found) {
        console.error(`no se encontro el nodo con id "${id}"`);
        process.exit(1);
      }
      if (result.before === result.after) {
        console.log("sin cambios (el valor ya era ese)");
      } else {
        console.log(`antiguo: ${result.key} = ${result.before ?? "(ausente)"}`);
        console.log(`nuevo:   ${result.key} = ${result.after}`);
        if (args.includes("--write")) {
          const out = JSON.stringify(doc, null, 2) + "\n";
          writeFileSync(file, out, "utf8");
          console.log(`guardado en ${file} (indent 2 espacios)`);
        } else {
          console.log("cambio NO guardado; agrega --write para persistirlo");
        }
      }
      break;
    }
    default:
      console.error(`comando desconocido: "${cmd}"`);
      console.log(HELP);
      process.exit(1);
  }
} catch (err) {
  if (err instanceof SyntaxError && err.message.includes("JSON")) {
    console.error(`el archivo no es JSON valido: ${err.message}`);
  } else {
    console.error(err.message || String(err));
  }
  process.exit(1);
}
