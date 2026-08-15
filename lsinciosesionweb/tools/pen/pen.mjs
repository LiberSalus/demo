#!/usr/bin/env node
/**
 * pen.mjs — Utilities for reading/inspecting/editing .pen files (pen.dev format).
 *
 * No external dependencies (only node:fs). Usage:
 *
 *   node tools/pen/pen.mjs summary <file.pen>            Summary: version, type counts, root frames, variables/themes
 *   node tools/pen/pen.mjs tree <file.pen> [--depth N]    Hierarchical tree (id, type, name)
 *   node tools/pen/pen.mjs find <file.pen> <text>        Search by id/name/type/content (case-insensitive)
 *   node tools/pen/pen.mjs text <file.pen>                Extract all texts (id, name, content)
 *   node tools/pen/pen.mjs palette <file.pen>             Unique colors used in fill/stroke
 *   node tools/pen/pen.mjs validate <file.pen>            Validate structure against basic .pen schema
 *   node tools/pen/pen.mjs components <file.pen>          Detect components: reusable, refs, and variant frames (Figma)
 *   node tools/pen/pen.mjs edit <file.pen> <id> <key> <jsonValue> [--write]
 *                                                           Modify a node property; without --write just shows the change
 *   node tools/pen/pen.mjs capture <file.pen>              Structured design brief (screens, typography, palette, texts)
 *   node tools/pen/pen.mjs screens <file.pen>            List detected screens/breakpoints
 *   node tools/pen/pen.mjs typography <file.pen>           Typography scale with samples
 *   node tools/pen/pen.mjs inspect <file.pen> <id>         Full node detail (--depth N for children)
 *   node tools/pen/pen.mjs export <file.pen> [--out path] [--scale N]  PNG via pen.dev CLI
 *   node tools/pen/pen.mjs cli-exec <file.pen> "<script>"  Execute snippet in pen interactive (headless)
 *
 * Any read command accepts --json for structured output (e.g., pipe to jq).
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execSync, spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { homedir } from "node:os";

const NODE_TYPES = new Set([
  "frame", "group", "rectangle", "ellipse", "path", "polygon", "line",
  "text", "note", "prompt", "context", "icon", "script", "ref",
]);
// Note: the official pen.dev schema doesn't list 'line', but real .pen files
// in docs/pen.dev use it frequently. Kept as valid type for that reason.

const BREAKPOINT_NAME_RE = /\s-\s(\d+)$/;
const GENERIC_NAME_RE = /^(Frame \d+|Group \d*|Group|Icons?|Rectangle|Component \d+|Desktop|Móvil\/Tablet|Capa \d+|\d{1,2})$/i;
const NODE_DETAIL_KEYS = [
  "type", "id", "name", "x", "y", "width", "height", "layout", "gap", "padding",
  "justifyContent", "alignItems", "clip", "fill", "stroke", "strokeWidth", "cornerRadius",
  "opacity", "rotation", "content", "fontFamily", "fontSize", "fontWeight", "textAlign",
  "textGrowth", "lineHeight", "letterSpacing", "icon", "library", "ref", "reusable",
  "enabled", "effect",
];

const HELP = `Usage:
  node tools/pen/pen.mjs <command> <file.pen> [options]

Read commands (no pen.dev CLI required):
  summary <file>              Document summary
  capture <file>              Full brief: screens, typography, palette, components, texts
  specs <file>                Design specs: tokens, layouts, component blueprints
  screens <file>              Detected screens/breakpoints (e.g., " - 1366")
  tree <file> [--depth N]     Hierarchical node tree
  find <file> <text>         Search by id/name/type/content/icon/font
  text <file>                 Extract all texts (with typography)
  typography <file>           Typography scale with samples
  palette <file>              Unique colors from fill/stroke
  inspect <file> <id>         Node detail (--depth N includes children)
  validate <file>             Validate structure
  components <file>           Detect components (reusable, refs, variants)

Edit commands:
  edit <file> <id> <key> <jsonValue> [--write]
                                 Modify a node property

Export commands:
  export-html <file>         Export to structural HTML/CSS
  export-css <file>          Export to CSS variables (design tokens)
  export <file> [--out path] [--scale N]
                                 Export PNG of full design
  cli-exec <file> "<script>"  Execute JS snippet in pen interactive headless
  mcp-status                     MCP connection diagnostics with pen.dev

Options:
  --json                         JSON output (read commands only)
  --depth N                      Max tree depth or inspect depth
  --screen <id|name>             Filter to a screen/breakpoint (tree, capture, export-html)
  --blueprint-depth N            Component blueprint tree depth (default: 5)
  --blueprint-limit N            Max blueprints to include (default: 25)
  --no-blueprints                Omit component blueprints in capture/specs
  --write                        In 'edit', save change to disk
  --out <path>                   Output path (export, export-html, export-css)
  --scale <n>                    PNG export scale (default: 1)
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

// ---------- load ----------

function load(file) {
  const raw = readFileSync(file, "utf8");
  return { raw, doc: JSON.parse(raw) };
}

// ---------- traversal ----------

/** Traverse all nodes (includes replacement trees within `descendants`). */
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

function nodePathNames(path) {
  return path.map((n) => n.name || n.id).join(" > ");
}

/** Searchable fields of a node (extended find). */
function searchableFields(node) {
  const parts = [
    node.id,
    node.type,
    node.name,
    typeof node.content === "string" ? node.content : "",
    typeof node.ref === "string" ? node.ref : "",
    typeof node.icon === "string" ? node.icon : "",
    typeof node.library === "string" ? node.library : "",
    typeof node.fontFamily === "string" ? node.fontFamily : "",
  ];
  if (node.fill && typeof node.fill === "object" && typeof node.fill.color === "string") {
    parts.push(node.fill.color);
  }
  return parts.filter((s) => s !== undefined && s !== "").join(" ");
}

function findNodeByIdOrName(doc, query) {
  const q = query.toLowerCase();
  for (const { node } of allNodes(doc)) {
    if (node.id.toLowerCase() === q) return node;
    if (typeof node.name === "string" && node.name.toLowerCase() === q) return node;
  }
  for (const root of doc.children || []) {
    if (root.id.toLowerCase() === q) return root;
    if (typeof root.name === "string" && root.name.toLowerCase() === q) return root;
  }
  return null;
}

/** Detect breakpoint frames (e.g., "SaludFísica-FC - 1366"). */
function detectScreens(doc) {
  const screens = [];
  for (const { node, path } of allNodes(doc)) {
    if (node.type !== "frame") continue;
    const m = typeof node.name === "string" ? node.name.match(BREAKPOINT_NAME_RE) : null;
    if (!m) continue;
    if (typeof node.width !== "number" || node.width < 280) continue;
    screens.push({
      node,
      breakpoint: parseInt(m[1], 10),
      path,
    });
  }
  return screens.sort((a, b) => a.breakpoint - b.breakpoint);
}

function pickNodeDetails(node) {
  const out = {};
  for (const key of NODE_DETAIL_KEYS) {
    if (node[key] !== undefined) out[key] = node[key];
  }
  return out;
}

function roundNum(n) {
  return Math.round(n * 100) / 100;
}

/** Simplify fill/stroke to readable form (hex, gradient, disabled). */
function summarizePaint(value) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const parts = value.map(summarizePaint).filter(Boolean);
    return parts.length === 1 ? parts[0] : parts;
  }
  if (typeof value !== "object") return value;
  if (value.enabled === false) return null;
  if (value.type === "gradient") {
    return {
      gradient: value.gradientType || "linear",
      colors: (value.colors || []).map((c) => ({ color: c.color, position: c.position })),
      rotation: value.rotation !== undefined ? roundNum(value.rotation) : undefined,
    };
  }
  if (value.type === "color" && typeof value.color === "string") return value.color;
  if (typeof value.color === "string") return value.color;
  return value;
}

function layoutSpec(node) {
  const out = {};
  if (node.layout && node.layout !== "none") out.layout = node.layout;
  if (node.gap !== undefined) out.gap = node.gap;
  if (node.padding !== undefined) out.padding = node.padding;
  if (node.justifyContent) out.justifyContent = node.justifyContent;
  if (node.alignItems) out.alignItems = node.alignItems;
  if (node.clip) out.clip = true;
  return Object.keys(out).length ? out : undefined;
}

function visualSpec(node) {
  const out = {};
  const fill = summarizePaint(node.fill);
  if (fill !== undefined && fill !== null) out.fill = fill;
  if (node.stroke !== undefined) {
    const stroke = summarizePaint(node.stroke);
    if (stroke !== undefined && stroke !== null) out.stroke = stroke;
  }
  if (node.strokeWidth !== undefined) out.strokeWidth = node.strokeWidth;
  if (node.strokeAlignment) out.strokeAlignment = node.strokeAlignment;
  if (node.strokeLinecap) out.strokeLinecap = node.strokeLinecap;
  if (node.cornerRadius !== undefined) out.cornerRadius = node.cornerRadius;
  if (node.effect) out.effect = node.effect;
  if (node.opacity !== undefined && node.opacity !== 1) out.opacity = node.opacity;
  if (node.rotation) out.rotation = roundNum(node.rotation);
  return Object.keys(out).length ? out : undefined;
}

function textSpec(node) {
  if (node.type !== "text") return undefined;
  const out = {};
  if (typeof node.content === "string") out.content = node.content;
  if (node.fontFamily) out.fontFamily = node.fontFamily;
  if (node.fontSize !== undefined) out.fontSize = node.fontSize;
  if (node.fontWeight) out.fontWeight = node.fontWeight;
  if (node.fontStyle) out.fontStyle = node.fontStyle;
  if (node.textAlign) out.textAlign = node.textAlign;
  if (node.textAlignVertical) out.textAlignVertical = node.textAlignVertical;
  if (node.textGrowth) out.textGrowth = node.textGrowth;
  if (node.lineHeight !== undefined) out.lineHeight = node.lineHeight;
  if (node.letterSpacing !== undefined) out.letterSpacing = node.letterSpacing;
  const fill = summarizePaint(node.fill);
  if (fill) out.fill = fill;
  return out;
}

function countTokenValues(doc, pickValue) {
  const counts = new Map();
  for (const { node } of allNodes(doc)) {
    const v = pickValue(node);
    if (v === null || v === undefined) continue;
    const key = typeof v === "object" ? JSON.stringify(v) : String(v);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => {
      try {
        return { value: JSON.parse(value), count };
      } catch {
        return { value, count };
      }
    });
}

/** Enriched tree with visual and layout specs for design interpretation. */
function specTreeNode(node, depthLimit, depth = 0) {
  const base = {
    id: node.id,
    type: node.type,
    name: node.name || undefined,
  };
  if (node.width !== undefined) base.width = node.width;
  if (node.height !== undefined) base.height = node.height;
  if (!node.layout || node.layout === "none") {
    if (typeof node.x === "number") base.x = roundNum(node.x);
    if (typeof node.y === "number") base.y = roundNum(node.y);
  }
  const layout = layoutSpec(node);
  if (layout) Object.assign(base, layout);
  const visual = visualSpec(node);
  if (visual) Object.assign(base, visual);
  if (node.type === "text") Object.assign(base, textSpec(node));
  if (node.type === "icon") {
    if (node.library) base.library = node.library;
    if (node.icon) base.icon = node.icon;
    if (node.weight) base.weight = node.weight;
  }
  if (node.type === "line") {
    if (node.rotation) base.rotation = roundNum(node.rotation);
  }
  if (node.type === "ref") {
    if (node.ref) base.ref = node.ref;
  }
  if (depth >= depthLimit || !Array.isArray(node.children) || node.children.length === 0) {
    if (Array.isArray(node.children) && node.children.length > 0) {
      base.childCount = node.children.length;
      base.childSummary = node.children.slice(0, 12).map((c) => ({
        id: c.id,
        type: c.type,
        name: c.name || undefined,
      }));
    }
    return base;
  }
  base.children = node.children.map((c) => specTreeNode(c, depthLimit, depth + 1));
  return base;
}

function compactTreeNode(node, depthLimit, depth = 0) {
  return specTreeNode(node, depthLimit, depth);
}

function textsUnder(node, path = []) {
  const out = [];
  const next = [...path, node];
  if (node.type === "text" && typeof node.content === "string" && node.content.length > 0) {
    out.push({
      id: node.id,
      name: node.name || "",
      content: node.content,
      fontFamily: node.fontFamily,
      fontSize: node.fontSize,
      fontWeight: node.fontWeight,
      fontStyle: node.fontStyle,
      textAlign: node.textAlign,
      textAlignVertical: node.textAlignVertical,
      textGrowth: node.textGrowth,
      lineHeight: node.lineHeight,
      letterSpacing: node.letterSpacing,
      fill: summarizePaint(node.fill),
      path: nodePathNames(next),
    });
  }
  for (const child of node.children || []) out.push(...textsUnder(child, next));
  return out;
}

function typographyScale(doc) {
  const map = new Map();
  for (const { node } of allNodes(doc)) {
    if (node.type !== "text") continue;
    const fontFamily = node.fontFamily || "(sin fuente)";
    const fontSize = node.fontSize ?? "?";
    const fontWeight = node.fontWeight || "normal";
    const textAlign = node.textAlign || "";
    const lineHeight = node.lineHeight ?? "";
    const letterSpacing = node.letterSpacing ?? "";
    const key = `${fontFamily}|${fontSize}|${fontWeight}|${textAlign}|${lineHeight}|${letterSpacing}`;
    const entry = map.get(key) || {
      fontFamily,
      fontSize,
      fontWeight,
      textAlign: textAlign || undefined,
      lineHeight: lineHeight !== "" ? lineHeight : undefined,
      letterSpacing: letterSpacing !== "" ? letterSpacing : undefined,
      textGrowth: node.textGrowth,
      fill: summarizePaint(node.fill),
      count: 0,
      samples: [],
    };
    entry.count += 1;
    if (entry.samples.length < 4 && typeof node.content === "string" && node.content.trim()) {
      const sample = node.content.replace(/\s+/g, " ").trim().slice(0, 60);
      if (!entry.samples.includes(sample)) entry.samples.push(sample);
    }
    map.set(key, entry);
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

function extractIcons(doc) {
  const map = new Map();
  for (const { node } of allNodes(doc)) {
    if (node.type !== "icon") continue;
    const key = `${node.library || "?"}:${node.icon || "?"}`;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([icon, count]) => ({ icon, count }));
}

function countNamedComponents(doc) {
  const counts = new Map();
  for (const { node } of allNodes(doc)) {
    if (!node.name || GENERIC_NAME_RE.test(node.name)) continue;
    if (node.type !== "frame" && node.type !== "group") continue;
    counts.set(node.name, (counts.get(node.name) || 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

function isBlueprintCandidate(node) {
  if (!node.name || GENERIC_NAME_RE.test(node.name)) return false;
  if (node.type !== "frame" && node.type !== "group") return false;
  return typeof node.width === "number" || node.layout || (node.children && node.children.length > 0);
}

function extractSpacingTokens(doc) {
  return {
    gap: countTokenValues(doc, (n) => (typeof n.gap === "number" ? n.gap : null)),
    padding: countTokenValues(doc, (n) => (n.padding !== undefined ? n.padding : null)),
  };
}

function extractRadiusTokens(doc) {
  return countTokenValues(doc, (n) =>
    n.cornerRadius !== undefined ? n.cornerRadius : null
  );
}

function extractStrokeTokens(doc) {
  const map = new Map();
  for (const { node } of allNodes(doc)) {
    if (node.stroke === undefined && node.strokeWidth === undefined) continue;
    const stroke = summarizePaint(node.stroke);
    const key = JSON.stringify({
      stroke: stroke ?? null,
      strokeWidth: node.strokeWidth ?? null,
      strokeAlignment: node.strokeAlignment ?? null,
    });
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({ ...JSON.parse(value), count }));
}

function extractEffects(doc) {
  const map = new Map();
  for (const { node } of allNodes(doc)) {
    if (!node.effect) continue;
    const key = JSON.stringify(node.effect);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({ effect: JSON.parse(value), count }));
}

function extractGradients(doc) {
  const map = new Map();
  for (const { node } of allNodes(doc)) {
    for (const key of ["fill", "stroke"]) {
      const val = node[key];
      const paints = Array.isArray(val) ? val : [val];
      for (const p of paints) {
        if (p?.type === "gradient") {
          const summary = summarizePaint(p);
          const gkey = JSON.stringify(summary);
          map.set(gkey, (map.get(gkey) || 0) + 1);
        }
      }
    }
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({ gradient: JSON.parse(value), count }));
}

function extractLayoutPatterns(doc) {
  const map = new Map();
  for (const { node } of allNodes(doc)) {
    if (!node.layout || node.layout === "none") continue;
    const pattern = {
      layout: node.layout,
      gap: node.gap,
      padding: node.padding,
      justifyContent: node.justifyContent,
      alignItems: node.alignItems,
    };
    const key = JSON.stringify(pattern);
    const entry = map.get(key) || { pattern, count: 0, examples: [] };
    entry.count += 1;
    if (entry.examples.length < 3 && node.name && !GENERIC_NAME_RE.test(node.name)) {
      if (!entry.examples.includes(node.name)) entry.examples.push(node.name);
    }
    map.set(key, entry);
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

function extractColorUsage(doc) {
  const usage = new Map();
  const bump = (color, role) => {
    if (!color) return;
    const entry = usage.get(color) || { color, fill: 0, stroke: 0, text: 0, total: 0 };
    entry[role] += 1;
    entry.total += 1;
    usage.set(color, entry);
  };
  for (const { node } of allNodes(doc)) {
    if (node.type === "text") {
      for (const c of colorValues(node.fill)) bump(c, "text");
      continue;
    }
    if (node.fill !== undefined) {
      for (const c of colorValues(node.fill)) bump(c, "fill");
    }
    if (node.stroke !== undefined) {
      for (const c of colorValues(node.stroke)) bump(c, "stroke");
    }
  }
  return [...usage.values()].sort((a, b) => b.total - a.total);
}

function extractAnnotations(doc) {
  const out = [];
  for (const { node, path } of allNodes(doc)) {
    if (!["note", "prompt", "context"].includes(node.type)) continue;
    if (typeof node.content !== "string" || !node.content.trim()) continue;
    out.push({
      id: node.id,
      type: node.type,
      name: node.name || "",
      content: node.content,
      path: nodePathNames(path),
    });
  }
  return out;
}

function extractDeveloperNotes(doc) {
  const notes = [];
  const devNoteKeywords = ["developer", "handoff", "guías", "notas", "especificaciones", "info"];
  
  for (const { node, path } of allNodes(doc)) {
    if (node.type !== "text") continue;
    if (typeof node.content !== "string") continue;
    
    const content = node.content.toLowerCase();
    const name = (node.name || "").toLowerCase();
    
    // Buscar frames con nombres que sugieran notas de desarrollador
    const parentFrame = path.length > 0 ? path[path.length - 1] : null;
    const parentName = parentFrame?.name?.toLowerCase() || "";
    
    if (devNoteKeywords.some(kw => content.includes(kw) || name.includes(kw) || parentName.includes(kw))) {
      notes.push({
        id: node.id,
        type: "developer_note",
        name: node.name || "",
        content: node.content,
        path: nodePathNames(path),
        parentFrame: parentFrame?.name || "",
      });
    }
  }
  
  return notes;
}

function extractAnimationPatterns(doc) {
  const animations = [];
  const animKeywords = ["anim", "animation", "secuencia", "sequence"];
  
  for (const { node, path } of allNodes(doc)) {
    if (node.type !== "frame" && node.type !== "group") continue;
    if (!node.name) continue;
    
    const name = node.name.toLowerCase();
    if (!animKeywords.some(kw => name.includes(kw))) continue;
    
    // Buscar hijos con numeración secuencial
    if (Array.isArray(node.children)) {
      const sequentialChildren = node.children.filter(child => {
        if (!child.name) return false;
        const childName = child.name.toLowerCase();
        // Detectar Property 1=01, Property 1=02, etc.
        const propMatch = childName.match(/property\s*1\s*=\s*(\d+)/);
        if (propMatch) return true;
        // Detectar nombres numerados simples (01, 02, 03...)
        const numMatch = childName.match(/\b0\d+\b/);
        return numMatch !== null;
      });
      
      if (sequentialChildren.length > 1) {
        animations.push({
          id: node.id,
          name: node.name,
          type: "sequence",
          frameCount: sequentialChildren.length,
          children: sequentialChildren.map(c => ({
            id: c.id,
            name: c.name,
            width: c.width,
            height: c.height,
          })),
          path: nodePathNames(path),
        });
      }
    }
  }
  
  return animations;
}

function extractComponentRelationships(doc) {
  const relationships = [];
  const relationKeywords = ["utiliza", "usa", "mantiene", "comparte", "basado", "derivado", "variante"];
  
  for (const { node, path } of allNodes(doc)) {
    if (node.type !== "text") continue;
    if (typeof node.content !== "string") continue;
    
    const content = node.content.toLowerCase();
    if (relationKeywords.some(kw => content.includes(kw))) {
      relationships.push({
        id: node.id,
        content: node.content,
        path: nodePathNames(path),
        type: "documented_relationship",
      });
    }
  }
  
  return relationships;
}

function extractSVGCustomElements(doc) {
  const svgElements = [];
  
  for (const { node, path } of allNodes(doc)) {
    if (node.type !== "path") continue;
    
    // Excluir paths simples que podrían ser borders decorativos
    if (node.width === 0 || node.height === 0) continue;
    if (node.stroke === undefined && node.fill === undefined) continue;
    
    // Paths con geometría compleja son probablemente iconos/ilustraciones
    const hasGeometry = node.geometry && typeof node.geometry === "string" && node.geometry.length > 50;
    
    if (hasGeometry || (node.width > 10 && node.height > 10 && node.width < 200 && node.height < 200)) {
      svgElements.push({
        id: node.id,
        name: node.name || "",
        width: node.width,
        height: node.height,
        hasGeometry: !!hasGeometry,
        stroke: node.stroke,
        fill: node.fill,
        path: nodePathNames(path),
      });
    }
  }
  
  return svgElements;
}

function extractPropertyBasedStates(doc) {
  const states = new Map();
  const propertyPattern = /property\s*\d+\s*=\s*([^,]+)/gi;
  
  for (const { node } of allNodes(doc)) {
    if (!node.name) continue;
    
    const name = node.name;
    const matches = name.matchAll(propertyPattern);
    const properties = {};
    
    for (const match of matches) {
      const propName = match[0].replace(/\s*=\s*/g, "=").trim();
      const propValue = match[1].trim();
      properties[propName] = propValue;
    }
    
    if (Object.keys(properties).length > 0) {
      // Extraer nombre base removiendo propiedades
      const baseName = name
        .replace(/property\s*\d+\s*=\s*[^,]+,?\s*/gi, "")
        .replace(/,\s*property\s*\d+\s*=\s*[^,]+/gi, "")
        .trim();
      
      if (!states.has(baseName)) {
        states.set(baseName, { baseName, variants: [] });
      }
      
      states.get(baseName).variants.push({
        id: node.id,
        fullName: name,
        properties,
        width: node.width,
        height: node.height,
      });
    }
  }
  
  return [...states.values()].filter(s => s.variants.length > 1);
}

function extractComponentBlueprints(doc, opts = {}) {
  const depth = opts.blueprintDepth ?? 5;
  const limit = opts.blueprintLimit ?? 25;
  const minCount = opts.minCount ?? 2;
  const counts = countNamedComponents(doc);
  const countByName = new Map(counts.map((c) => [c.name, c.count]));
  const seen = new Map();
  for (const { node } of allNodes(doc)) {
    if (!isBlueprintCandidate(node)) continue;
    if ((countByName.get(node.name) || 0) < minCount) continue;
    if (!seen.has(node.name)) seen.set(node.name, node);
  }
  return [...seen.entries()]
    .sort((a, b) => (countByName.get(b[0]) || 0) - (countByName.get(a[0]) || 0))
    .slice(0, limit)
    .map(([name, node]) => ({
      name,
      instances: countByName.get(name) || 1,
      id: node.id,
      type: node.type,
      width: node.width,
      height: node.height,
      blueprint: specTreeNode(node, depth),
    }));
}

function extractDocumentTokens(doc) {
  return {
    variables: doc.variables ?? undefined,
    themes: doc.themes ?? undefined,
    imports: doc.imports ?? undefined,
  };
}

function extractAccessibilityMetrics(doc) {
  const issues = [];
  const warnings = [];
  
  for (const { node } of allNodes(doc)) {
    // Verificar contraste para texto
    if (node.type === "text" && typeof node.content === "string") {
      const fontSize = node.fontSize || 16;
      const fillColor = node.fill?.color || node.fill;
      
      if (typeof fillColor === "string" && fillColor.startsWith("#")) {
        // Texto muy pequeño sin verificar contraste (warning)
        if (fontSize < 12) {
          warnings.push({
            type: "small_text",
            id: node.id,
            fontSize,
            content: node.content.slice(0, 30),
          });
        }
      }
    }
    
    // Verificar áreas de toque para elementos interactivos
    if (node.width !== undefined && node.height !== undefined) {
      const minTouch = 44; // WCAG recomendación
      if (node.width < minTouch || node.height < minTouch) {
        // Podría ser elemento interactivo (botón, icono)
        if (node.type === "rectangle" || node.type === "icon" || node.type === "ellipse") {
          warnings.push({
            type: "small_touch_target",
            id: node.id,
            width: node.width,
            height: node.height,
            nodeType: node.type,
          });
        }
      }
    }
  }
  
  return { issues, warnings };
}

function extractGridPatterns(doc) {
  const patterns = [];
  const widths = new Map();
  
  // Detectar columnas basadas en alineación horizontal
  for (const { node } of allNodes(doc)) {
    if (node.layout === "horizontal" && node.width !== undefined) {
      const key = Math.round(node.width);
      widths.set(key, (widths.get(key) || 0) + 1);
    }
  }
  
  // Detectar patrones de grid basados en anchos comunes
  const commonWidths = [...widths.entries()]
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .map(([width, count]) => ({ width, count }));
  
  return {
    commonWidths,
    estimatedColumns: commonWidths.length > 0 ? commonWidths[0].width : null,
  };
}

function extractInteractiveStates(doc) {
  const states = new Map();
  const hoverPattern = /hover|:hover|\bh\b/i;
  const activePattern = /active|:active|\ba\b/i;
  const focusPattern = /focus|:focus|\bf\b/i;
  const disabledPattern = /disabled|:disabled|\bd\b/i;
  
  for (const { node } of allNodes(doc)) {
    if (!node.name) continue;
    
    const name = node.name;
    const detectedStates = [];
    
    if (hoverPattern.test(name)) detectedStates.push("hover");
    if (activePattern.test(name)) detectedStates.push("active");
    if (focusPattern.test(name)) detectedStates.push("focus");
    if (disabledPattern.test(name)) detectedStates.push("disabled");
    
    if (detectedStates.length > 0) {
      const baseName = name
        .replace(hoverPattern, "")
        .replace(activePattern, "")
        .replace(focusPattern, "")
        .replace(disabledPattern, "")
        .trim();
      
      if (!states.has(baseName)) {
        states.set(baseName, { baseName, states: [] });
      }
      states.get(baseName).states.push(...detectedStates);
      states.get(baseName).states = [...new Set(states.get(baseName).states)];
    }
  }
  
  return [...states.values()];
}

function extractResponsivePatterns(doc) {
  const screens = detectScreens(doc);
  const patterns = {
    breakpoints: screens.map(s => s.breakpoint),
    layouts: new Map(),
    adaptations: [],
  };
  
  // Agrupar componentes por breakpoint
  for (const { node } of allNodes(doc)) {
    if (!node.name || GENERIC_NAME_RE.test(node.name)) continue;
    
    // Detectar si el mismo componente aparece en múltiples breakpoints
    const screenContext = screens.find(s => 
      node.path && node.path.some(p => p.id === s.node.id)
    );
    
    if (screenContext) {
      const key = `${node.name}_${screenContext.breakpoint}`;
      if (!patterns.layouts.has(node.name)) {
        patterns.layouts.set(node.name, []);
      }
      patterns.layouts.get(node.name).push({
        breakpoint: screenContext.breakpoint,
        width: node.width,
        height: node.height,
        layout: node.layout,
      });
    }
  }
  
  // Detectar patrones de adaptación
  for (const [name, variations] of patterns.layouts) {
    if (variations.length > 1) {
      const widths = variations.map(v => v.width);
      const hasWidthChange = new Set(widths).size > 1;
      const hasLayoutChange = new Set(variations.map(v => v.layout)).size > 1;
      
      if (hasWidthChange || hasLayoutChange) {
        patterns.adaptations.push({
          component: name,
          variations: variations.length,
          widthAdapts: hasWidthChange,
          layoutAdapts: hasLayoutChange,
          breakpoints: variations.map(v => v.breakpoint).sort((a, b) => a - b),
        });
      }
    }
  }
  
  return patterns;
}

function extractDesignSpecs(doc, opts = {}) {
  return {
    document: extractDocumentTokens(doc),
    spacing: extractSpacingTokens(doc),
    radius: extractRadiusTokens(doc),
    strokes: extractStrokeTokens(doc).slice(0, opts.strokeLimit ?? 20),
    effects: extractEffects(doc),
    gradients: extractGradients(doc),
    layoutPatterns: extractLayoutPatterns(doc).slice(0, opts.layoutLimit ?? 30),
    colorUsage: extractColorUsage(doc).slice(0, opts.colorLimit ?? 40),
    typography: typographyScale(doc).slice(0, opts.typographyLimit ?? 30),
    icons: extractIcons(doc),
    annotations: extractAnnotations(doc),
    componentBlueprints: opts.noBlueprints
      ? undefined
      : extractComponentBlueprints(doc, opts),
    variantComponents: components(doc).variantComponents,
    // Nuevas capacidades
    accessibility: extractAccessibilityMetrics(doc),
    gridPatterns: extractGridPatterns(doc),
    interactiveStates: extractInteractiveStates(doc),
    responsivePatterns: extractResponsivePatterns(doc),
    developerNotes: extractDeveloperNotes(doc),
    animationPatterns: extractAnimationPatterns(doc),
    componentRelationships: extractComponentRelationships(doc),
    svgCustomElements: extractSVGCustomElements(doc),
    propertyBasedStates: extractPropertyBasedStates(doc),
  };
}

function captureDesign(doc, opts = {}) {
  const depth = opts.depth ?? 4;
  const screenFilter = opts.screen;
  let screens = detectScreens(doc);
  if (screenFilter) {
    const q = screenFilter.toLowerCase();
    screens = screens.filter(
      (s) =>
        s.node.id.toLowerCase() === q ||
        (s.node.name && s.node.name.toLowerCase().includes(q)) ||
        String(s.breakpoint) === q
    );
  }
  const meta = summary(doc);
  const specOpts = {
    blueprintDepth: opts.blueprintDepth ?? 5,
    blueprintLimit: opts.blueprintLimit ?? 25,
    noBlueprints: opts.noBlueprints,
    typographyLimit: opts.typographyLimit ?? 30,
    colorLimit: opts.colorLimit ?? 40,
  };
  return {
    file: opts.file,
    meta,
    specs: extractDesignSpecs(doc, specOpts),
    screens: screens.map(({ node, breakpoint }) => ({
      id: node.id,
      name: node.name,
      breakpoint,
      width: node.width,
      height: node.height,
      fill: summarizePaint(node.fill),
      layout: layoutSpec(node),
      sections: (node.children || []).map((c) => ({
        id: c.id,
        type: c.type,
        name: c.name || "",
        width: c.width,
        height: c.height,
        layout: layoutSpec(c),
        fill: summarizePaint(c.fill),
      })),
      structure: specTreeNode(node, depth),
      textCount: textsUnder(node).length,
      texts: textsUnder(node),
    })),
    typography: typographyScale(doc).slice(0, opts.typographyLimit ?? 30),
    palette: palette(doc).slice(0, opts.paletteLimit ?? 30),
    colorUsage: extractColorUsage(doc).slice(0, opts.colorLimit ?? 40),
    icons: extractIcons(doc),
    namedComponents: countNamedComponents(doc).slice(0, opts.componentLimit ?? 40),
    components: components(doc),
    // Nuevas capacidades en capture
    developerNotes: extractDeveloperNotes(doc),
    animationPatterns: extractAnimationPatterns(doc),
    componentRelationships: extractComponentRelationships(doc),
    svgCustomElements: extractSVGCustomElements(doc),
    propertyBasedStates: extractPropertyBasedStates(doc),
  };
}

function inspectNode(doc, id, childDepth = 0) {
  for (const root of doc.children || []) {
    if (root.id === id) return inspectNodeTree(root, childDepth);
  }
  for (const { node } of allNodes(doc)) {
    if (node.id === id) return inspectNodeTree(node, childDepth);
  }
  return null;
}

function inspectNodeTree(node, childDepth) {
  const out = pickNodeDetails(node);
  if (childDepth > 0 && Array.isArray(node.children)) {
    out.children = node.children.map((c) => inspectNodeTree(c, childDepth - 1));
  } else if (Array.isArray(node.children)) {
    out.childCount = node.children.length;
    out.childrenSummary = node.children.map((c) => ({
      id: c.id,
      type: c.type,
      name: c.name || "",
    }));
  }
  return out;
}

function resolvePenFile(file) {
  return resolve(file);
}

function runPenExport(file, outPath, scale = 1) {
  const absIn = resolvePenFile(file);
  const absOut = resolve(outPath);
  const result = spawnSync(
    "pen",
    ["--in", absIn, "--export", absOut, "--export-scale", String(scale)],
    { encoding: "utf8", timeout: 120000 }
  );
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || "pen export fallo").trim());
  }
  return { out: absOut, log: (result.stdout || "").trim() };
}

function runPenCliExec(file, script) {
  const absIn = resolvePenFile(file);
  const tmpOut = join(homedir(), ".pencil", "pen-mjs-interactive-out.pen");
  const input = `${script.trim()}\nexit()\n`;
  const result = spawnSync(
    "pen",
    ["interactive", "--in", absIn, "--out", tmpOut],
    { input, encoding: "utf8", timeout: 120000, maxBuffer: 10 * 1024 * 1024 }
  );
  if (result.error) throw result.error;
  const combined = [result.stdout, result.stderr].filter(Boolean).join("\n");
  if (result.status !== 0) {
    throw new Error(combined.trim() || "pen interactive fallo");
  }
  return combined.replace(/\x1b\[[0-9;]*m/g, "").trim();
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

function tree(doc, depthLimit, rootNode = null) {
  const lines = [];
  const render = (node, depth, prefix) => {
    if (depthLimit !== undefined && depth > depthLimit) return;
    const label = [node.id, node.type, node.name].filter(Boolean).join("  ");
    let extra = "";
    if (node.type === "text" && typeof node.content === "string") {
      extra = `  [${node.content.replace(/\s+/g, " ").slice(0, 80)}]`;
      if (node.fontFamily) extra += `  {${node.fontFamily} ${node.fontSize}/${node.fontWeight || "normal"}}`;
    }
    if (node.type === "icon") {
      extra = `  (${node.library || "?"}:${node.icon || "?"})`;
    }
    if (node.layout) extra += `  layout=${node.layout}`;
    if (typeof node.width === "number" && typeof node.height === "number") {
      extra += `  (${Math.round(node.width)}x${Math.round(node.height)})`;
    } else if (typeof node.width === "string" || typeof node.height === "string") {
      extra += `  (${node.width ?? "?"}x${node.height ?? "?"})`;
    }
    lines.push(`${prefix}${label}${extra}`);
    const childPrefix = prefix + "  ";
    for (const child of node.children || []) render(child, depth + 1, childPrefix);
  };
  const roots = rootNode ? [rootNode] : doc.children || [];
  for (const root of roots) render(root, 0, "");
  return lines.join("\n");
}

// ---------- find ----------

function find(doc, query) {
  const q = query.toLowerCase();
  const hits = [];
  for (const { node, path } of allNodes(doc)) {
    const hay = searchableFields(node).toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        id: node.id,
        type: node.type,
        name: node.name || "",
        content: typeof node.content === "string" ? node.content : undefined,
        icon: node.type === "icon" ? `${node.library}:${node.icon}` : undefined,
        font: node.type === "text" && node.fontFamily
          ? `${node.fontFamily} ${node.fontSize}/${node.fontWeight || "normal"}`
          : undefined,
        path: nodePathLabel(path),
        pathNames: nodePathNames(path),
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
        fontFamily: node.fontFamily,
        fontSize: node.fontSize,
        fontWeight: node.fontWeight,
        fill: typeof node.fill === "string" ? node.fill : node.fill?.color,
        path: nodePathLabel(path),
        pathNames: nodePathNames(path),
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

/** Split variant name (Figma style) into axes: "Type=A, State=B" -> {Type:A, State:B}. */
function parseVariantName(name) {
  const axes = {};
  for (const part of String(name).split(",")) {
    const m = part.match(/^\s*([^=]+?)\s*=\s*(.*?)\s*$/);
    if (m) axes[m[1]] = m[2];
  }
  return axes;
}

/** Detect components: reusable nodes, ref instances, and variant frames (Figma-style names). */
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
    let line = `[${h.type}] ${h.id}  ${h.name}`;
    if (h.content) line += `  ->  ${h.content}`;
    if (h.font) line += `  {${h.font}}`;
    if (h.icon) line += `  (${h.icon})`;
    console.log(line);
    console.log(`        ruta: ${h.pathNames || h.path}`);
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

function printScreens(data) {
  if (useJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  if (data.length === 0) {
    console.log("sin pantallas/breakpoints detectados");
    return;
  }
  for (const s of data) {
    console.log(
      `[${s.breakpoint}] ${s.id}  "${s.name}"  ${s.width}x${s.height}` +
        (s.sections?.length ? `  secciones: ${s.sections.join(", ")}` : "")
    );
  }
}

function printTypography(data) {
  if (useJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  for (const t of data) {
    const align = t.textAlign ? ` align=${t.textAlign}` : "";
    console.log(`${t.fontFamily} ${t.fontSize}/${t.fontWeight}${align}  x${t.count}`);
    if (t.samples?.length) console.log(`  ej: ${t.samples.join(" | ")}`);
  }
}

function printSpecs(data) {
  console.log("=== ESPECIFICACIONES DE DISEÑO ===");
  console.log("");
  
  // Documento
  if (data.document) {
    console.log("--- DOCUMENTO ---");
    if (data.document.variables) {
      console.log(`Variables: ${Object.keys(data.document.variables).join(", ")}`);
    }
    if (data.document.themes) {
      console.log(`Temas: ${JSON.stringify(data.document.themes)}`);
    }
    if (data.document.imports) {
      console.log(`Imports: ${Object.keys(data.document.imports).join(", ")}`);
    }
    console.log("");
  }
  
  // Spacing
  if (data.spacing?.gap?.length || data.spacing?.padding?.length) {
    console.log("--- ESPACIADO ---");
    if (data.spacing.gap?.length) {
      console.log("Gaps (top 10):");
      for (const { value, count } of data.spacing.gap.slice(0, 10)) {
        console.log(`  ${value}px  x${count}`);
      }
    }
    if (data.spacing.padding?.length) {
      console.log("Paddings (top 10):");
      for (const { value, count } of data.spacing.padding.slice(0, 10)) {
        console.log(`  ${value}px  x${count}`);
      }
    }
    console.log("");
  }
  
  // Radius
  if (data.radius?.length) {
    console.log("--- BORDES REDONDEADOS ---");
    for (const { value, count } of data.radius.slice(0, 10)) {
      console.log(`  ${value}px  x${count}`);
    }
    console.log("");
  }
  
  // Strokes
  if (data.strokes?.length) {
    console.log("--- BORDES ---");
    for (const { stroke, strokeWidth, count } of data.strokes.slice(0, 10)) {
      console.log(`  ${stroke}  width:${strokeWidth || 0}  x${count}`);
    }
    console.log("");
  }
  
  // Layout patterns
  if (data.layoutPatterns?.length) {
    console.log("--- PATRONES DE LAYOUT ---");
    for (const { pattern, count, examples } of data.layoutPatterns.slice(0, 8)) {
      const ex = examples?.length ? ` (${examples.join(", ")})` : "";
      console.log(`  ${JSON.stringify(pattern)}  x${count}${ex}`);
    }
    console.log("");
  }
  
  // Color usage
  if (data.colorUsage?.length) {
    console.log("--- USO DE COLORES ---");
    for (const { color, fill, stroke, text, total } of data.colorUsage.slice(0, 15)) {
      const roles = [];
      if (fill > 0) roles.push(`fill:${fill}`);
      if (stroke > 0) roles.push(`stroke:${stroke}`);
      if (text > 0) roles.push(`text:${text}`);
      console.log(`  ${color}  total:${total}  [${roles.join(", ")}]`);
    }
    console.log("");
  }
  
  // Typography
  if (data.typography?.length) {
    console.log("--- TIPOGRAFÍA ---");
    for (const t of data.typography.slice(0, 15)) {
      const align = t.textAlign ? ` align:${t.textAlign}` : "";
      const lh = t.lineHeight ? ` lh:${t.lineHeight}` : "";
      const ls = t.letterSpacing ? ` ls:${t.letterSpacing}` : "";
      console.log(`  ${t.fontFamily} ${t.fontSize}/${t.fontWeight}${align}${lh}${ls}  x${t.count}`);
      if (t.samples?.length) {
        console.log(`    ej: ${t.samples.slice(0, 2).join(" | ")}`);
      }
    }
    console.log("");
  }
  
  // Icons
  if (data.icons?.length) {
    console.log("--- ICONOS ---");
    for (const { icon, count } of data.icons.slice(0, 15)) {
      console.log(`  ${icon}  x${count}`);
    }
    console.log("");
  }
  
  // Component blueprints
  if (data.componentBlueprints?.length) {
    console.log("--- BLUEPRINTS DE COMPONENTES ---");
    for (const { name, instances, width, height } of data.componentBlueprints.slice(0, 10)) {
      console.log(`  ${name}  x${instances}  ${width}x${height}`);
    }
    console.log("");
  }
  
  // Variant components
  if (data.variantComponents?.length) {
    console.log("--- COMPONENTES CON VARIANTES ---");
    for (const vc of data.variantComponents.slice(0, 10)) {
      const axes = Object.entries(vc.axes)
        .map(([a, vs]) => `${a}:[${vs.join(", ")}]`)
        .join("  ");
      console.log(`  ${vc.name}  (${vc.variantCount} variantes)  ${axes}`);
    }
    console.log("");
  }
  
  // Accessibility
  if (data.accessibility) {
    const { issues, warnings } = data.accessibility;
    if (issues.length > 0 || warnings.length > 0) {
      console.log("--- ACCESIBILIDAD ---");
      if (issues.length > 0) {
        console.log(`  Problemas: ${issues.length}`);
        for (const issue of issues.slice(0, 5)) {
          console.log(`    - ${issue.type}: ${issue.id}`);
        }
      }
      if (warnings.length > 0) {
        console.log(`  Advertencias: ${warnings.length}`);
        for (const warn of warnings.slice(0, 5)) {
          if (warn.type === "small_text") {
            console.log(`    - Small text (${warn.fontSize}px): "${warn.content}"`);
          } else if (warn.type === "small_touch_target") {
            console.log(`    - Small touch target (${warn.width}x${warn.height}): ${warn.nodeType}`);
          }
        }
      }
      console.log("");
    }
  }
  
  // Grid patterns
  if (data.gridPatterns) {
    const { commonWidths, estimatedColumns } = data.gridPatterns;
    if (commonWidths?.length > 0) {
      console.log("--- PATRONES DE GRID ---");
      console.log(`  Columnas estimadas: ${estimatedColumns || "no detectado"}`);
      console.log("  Anchos comunes:");
      for (const { width, count } of commonWidths.slice(0, 8)) {
        console.log(`    ${width}px  x${count}`);
      }
      console.log("");
    }
  }
  
  // Interactive states
  if (data.interactiveStates?.length > 0) {
    console.log("--- ESTADOS INTERACTIVOS ---");
    for (const { baseName, states } of data.interactiveStates.slice(0, 10)) {
      console.log(`  ${baseName}: [${states.join(", ")}]`);
    }
    console.log("");
  }
  
  // Responsive patterns
  if (data.responsivePatterns) {
    const { breakpoints, adaptations } = data.responsivePatterns;
    console.log("--- PATRONES RESPONSIVE ---");
    console.log(`  Breakpoints: ${breakpoints.sort((a, b) => a - b).join(", ")}px`);
    if (adaptations.length > 0) {
      console.log("  Componentes que se adaptan:");
      for (const { component, variations, widthAdapts, layoutAdapts, breakpoints: bp } of adaptations.slice(0, 8)) {
        const adapts = [];
        if (widthAdapts) adapts.push("ancho");
        if (layoutAdapts) adapts.push("layout");
        console.log(`    ${component} (${variations} vars) [${adapts.join(", ")}] ${bp.join(", ")}px`);
      }
    }
    console.log("");
  }
  
  // Annotations
  if (data.annotations?.length > 0) {
    console.log("--- ANOTACIONES ---");
    for (const { type, content, path } of data.annotations.slice(0, 5)) {
      console.log(`  [${type}] ${content.slice(0, 50)}...`);
      console.log(`    ruta: ${path}`);
    }
    console.log("");
  }
  
  // Developer Notes
  if (data.developerNotes?.length > 0) {
    console.log("--- NOTAS DE DESARROLLADOR ---");
    for (const { content, parentFrame } of data.developerNotes.slice(0, 5)) {
      console.log(`  [${parentFrame}] ${content.slice(0, 60)}...`);
    }
    console.log("");
  }
  
  // Animation Patterns
  if (data.animationPatterns?.length > 0) {
    console.log("--- PATRONES DE ANIMACIÓN ---");
    for (const { name, frameCount, path } of data.animationPatterns.slice(0, 5)) {
      console.log(`  ${name} (${frameCount} frames)`);
      console.log(`    ruta: ${path}`);
    }
    console.log("");
  }
  
  // Component Relationships
  if (data.componentRelationships?.length > 0) {
    console.log("--- RELACIONES DOCUMENTADAS ---");
    for (const { content } of data.componentRelationships.slice(0, 5)) {
      console.log(`  ${content.slice(0, 80)}...`);
    }
    console.log("");
  }
  
  // SVG Custom Elements
  if (data.svgCustomElements?.length > 0) {
    console.log("--- ELEMENTOS SVG PERSONALIZADOS ---");
    console.log(`  Total: ${data.svgCustomElements.length} paths complejos`);
    for (const { name, width, height, hasGeometry } of data.svgCustomElements.slice(0, 5)) {
      const geo = hasGeometry ? "[geometría]" : "";
      console.log(`  ${name || "(sin nombre)"} ${width}x${height} ${geo}`);
    }
    console.log("");
  }
  
  // Property Based States
  if (data.propertyBasedStates?.length > 0) {
    console.log("--- ESTADOS BASADOS EN PROPIEDADES ---");
    for (const { baseName, variants } of data.propertyBasedStates.slice(0, 8)) {
      const props = variants[0].properties;
      const propKeys = Object.keys(props).join(", ");
      console.log(`  ${baseName} (${variants.length} variantes) [${propKeys}]`);
    }
    console.log("");
  }
  
  console.log("tip: usa --json para exportar las especificaciones completas");
}

function printCapture(data) {
  if (useJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  console.log("=== CAPTURA DE DISENO ===");
  console.log(`archivo: ${data.file}`);
  console.log(`version: ${data.meta.version}  nodos: ${data.meta.totalNodes}`);
  console.log(`pantallas: ${data.screens.length}  variantes: ${data.components.variantComponents?.length ?? 0}`);
  console.log("");
  console.log("--- PANTALLAS ---");
  for (const s of data.screens) {
    console.log(`[${s.breakpoint}] ${s.id}  "${s.name}"  ${s.width}x${s.height}  textos: ${s.textCount}`);
    if (s.sections?.length) {
      console.log(`  secciones: ${s.sections.map((x) => x.name || x.id).join(", ")}`);
    }
  }
  console.log("");
  console.log("--- TIPOGRAFIA (top) ---");
  for (const t of data.typography.slice(0, 12)) {
    console.log(`${t.fontFamily} ${t.fontSize}/${t.fontWeight}  x${t.count}  —  ${t.samples?.slice(0, 2).join(" | ") || ""}`);
  }
  console.log("");
  console.log("--- PALETA (top) ---");
  for (const { color, count } of data.palette.slice(0, 15)) {
    console.log(`${color}  x${count}`);
  }
  if (data.icons.length) {
    console.log("");
    console.log("--- ICONOS ---");
    for (const { icon, count } of data.icons.slice(0, 15)) {
      console.log(`${icon}  x${count}`);
    }
  }
  if (data.namedComponents.length) {
    console.log("");
    console.log("--- COMPONENTES REPETIDOS ---");
    for (const { name, count } of data.namedComponents.slice(0, 20)) {
      console.log(`${name}  x${count}`);
    }
  }
  console.log("");
  console.log("tip: usa --json para el brief completo (estructura, textos por pantalla)");
}

// ---------- mcp-status ----------

function mcpStatus() {
  console.log("=== MCP Connection Diagnostics with pen.dev ===");
  
  // 1. Verificar CLI global
  let cliVersion = "No instalada";
  let cliStatus = "No disponible";
  try {
    cliVersion = execSync("pen version", { encoding: "utf8" }).trim();
    cliStatus = execSync("pen status", { encoding: "utf8" }).trim();
  } catch (e) {
    // ignorar error
  }
  console.log(`CLI Version:  ${cliVersion}`);
  console.log(`CLI Status:   ${cliStatus}`);
  
  // 2. Verificar archivo de configuración de Antigravity
  const configPath = join(homedir(), ".gemini/antigravity/mcp_config.json");
  console.log(`Config Path:  ${configPath}`);
  if (existsSync(configPath)) {
    try {
      const config = JSON.parse(readFileSync(configPath, "utf8"));
      const pencil = config.mcpServers?.pencil || config.pencil;
      if (pencil) {
        console.log(`MCP Pencil:   Configurado`);
        console.log(`  Comando:    ${pencil.command}`);
        console.log(`  Args:       ${JSON.stringify(pencil.args)}`);
        
        // Verificar si el binario existe
        if (existsSync(pencil.command)) {
          console.log(`  Binario:    Existente y accesible`);
        } else {
          console.log(`  Binario:    [ERROR] No encontrado en la ruta especificada`);
        }
      } else {
        console.log(`MCP Pencil:   [ERROR] No configurado en mcp_config.json`);
      }
    } catch (err) {
      console.log(`MCP Pencil:   [ERROR] Error al leer/parsear config: ${err.message}`);
    }
  } else {
    console.log(`MCP Pencil:   [ERROR] Archivo mcp_config.json no existe`);
  }

  console.log("\nTo connect to design canvas:");
  console.log("1. Open Pencil/pen.dev desktop app on your system.");
  console.log("2. Check you're logged in with 'pen status'.");
  console.log("3. Restart your agent client to load configuration.");
}

// ---------- export-html ----------

function exportToHTML(doc, opts = {}) {
  const screenFilter = opts.screen;
  let screens = detectScreens(doc);
  if (screenFilter) {
    const q = screenFilter.toLowerCase();
    screens = screens.filter(
      (s) =>
        s.node.id.toLowerCase() === q ||
        (s.node.name && s.node.name.toLowerCase().includes(q)) ||
        String(s.breakpoint) === q
    );
  }
  
  const colors = palette(doc);
  const colorMap = new Map();
  colors.forEach((c, i) => {
    const name = `color-${i + 1}`;
    colorMap.set(c.color, name);
  });
  
  const htmlParts = [];
  
  // CSS inicial
  htmlParts.push(`<style>`);
  htmlParts.push(`  :root {`);
  colors.forEach((c, i) => {
    htmlParts.push(`    --${colorMap.get(c.color)}: ${c.color};`);
  });
  htmlParts.push(`  }`);
  htmlParts.push(`  * { box-sizing: border-box; margin: 0; padding: 0; }`);
  htmlParts.push(`  body { font-family: system-ui, sans-serif; padding: 20px; }`);
  htmlParts.push(`</style>`);
  
  // Generar HTML para cada pantalla
  for (const { node, breakpoint } of screens) {
    htmlParts.push(`<!-- Screen: ${node.name} (${breakpoint}px) -->`);
    htmlParts.push(`<div class="screen" data-breakpoint="${breakpoint}" style="width: ${node.width}px; height: ${node.height}px; border: 1px dashed #ccc; margin-bottom: 20px; position: relative; background: ${summarizePaint(node.fill) || '#fff'};">`);
    htmlParts.push(...generateHTML(node, colorMap, 1));
    htmlParts.push(`</div>`);
  }
  
  return htmlParts.join("\n");
}

function generateHTML(node, colorMap, depth = 0) {
  const parts = [];
  const indent = "  ".repeat(depth);
  
  if (!node || typeof node !== "object") return parts;
  
  const tag = node.type === "frame" ? "div" : 
               node.type === "text" ? "div" :
               node.type === "rectangle" ? "div" :
               node.type === "ellipse" ? "div" :
               node.type === "group" ? "div" : "div";
  
  const styles = [];
  
  // Posición y tamaño
  if (node.x !== undefined && node.y !== undefined) {
    styles.push(`position: absolute`);
    styles.push(`left: ${node.x}px`);
    styles.push(`top: ${node.y}px`);
  }
  if (node.width !== undefined) styles.push(`width: ${node.width}px`);
  if (node.height !== undefined) styles.push(`height: ${node.height}px`);
  
  // Colores
  const fill = summarizePaint(node.fill);
  if (fill && typeof fill === "string") {
    const colorVar = colorMap.get(fill);
    styles.push(`background: ${colorVar ? `var(--${colorVar})` : fill}`);
  }
  
  const stroke = summarizePaint(node.stroke);
  if (stroke && typeof stroke === "string") {
    const colorVar = colorMap.get(stroke);
    styles.push(`border: ${node.strokeWidth || 1}px solid ${colorVar ? `var(--${colorVar})` : stroke}`);
  }
  
  // Border radius
  if (node.cornerRadius !== undefined) {
    styles.push(`border-radius: ${node.cornerRadius}px`);
  }
  
  // Layout
  if (node.layout === "vertical") {
    styles.push(`display: flex`);
    styles.push(`flex-direction: column`);
    if (node.gap !== undefined) styles.push(`gap: ${node.gap}px`);
    if (node.padding !== undefined) styles.push(`padding: ${Array.isArray(node.padding) ? node.padding.join("px ") : node.padding}px`);
    if (node.justifyContent) styles.push(`justify-content: ${node.justifyContent}`);
    if (node.alignItems) styles.push(`align-items: ${node.alignItems}`);
  } else if (node.layout === "horizontal") {
    styles.push(`display: flex`);
    styles.push(`flex-direction: row`);
    if (node.gap !== undefined) styles.push(`gap: ${node.gap}px`);
    if (node.padding !== undefined) styles.push(`padding: ${Array.isArray(node.padding) ? node.padding.join("px ") : node.padding}px`);
    if (node.justifyContent) styles.push(`justify-content: ${node.justifyContent}`);
    if (node.alignItems) styles.push(`align-items: ${node.alignItems}`);
  }
  
  // Tipografía para texto
  if (node.type === "text") {
    if (node.fontFamily) styles.push(`font-family: ${node.fontFamily}`);
    if (node.fontSize !== undefined) styles.push(`font-size: ${node.fontSize}px`);
    if (node.fontWeight) styles.push(`font-weight: ${node.fontWeight}`);
    if (node.textAlign) styles.push(`text-align: ${node.textAlign}`);
    if (node.lineHeight !== undefined) styles.push(`line-height: ${node.lineHeight}`);
    if (node.letterSpacing !== undefined) styles.push(`letter-spacing: ${node.letterSpacing}px`);
    const textFill = summarizePaint(node.fill);
    if (textFill && typeof textFill === "string") {
      const colorVar = colorMap.get(textFill);
      styles.push(`color: ${colorVar ? `var(--${colorVar})` : textFill}`);
    }
  }
  
  // Opacidad
  if (node.opacity !== undefined && node.opacity !== 1) {
    styles.push(`opacity: ${node.opacity}`);
  }
  
  const styleAttr = styles.length > 0 ? ` style="${styles.join("; ")}"` : "";
  const classAttr = node.name && !GENERIC_NAME_RE.test(node.name) ? ` class="${node.name.replace(/\s+/g, "-").toLowerCase()}"` : "";
  
  parts.push(`${indent}<${tag}${classAttr}${styleAttr}>`);
  
  // Contenido de texto
  if (node.type === "text" && typeof node.content === "string") {
    parts.push(`${indent}  ${node.content}`);
  }
  
  // Hijos recursivos
  if (Array.isArray(node.children) && node.children.length > 0) {
    for (const child of node.children) {
      parts.push(...generateHTML(child, colorMap, depth + 1));
    }
  }
  
  parts.push(`${indent}</${tag}>`);
  
  return parts;
}

function exportToCSSVariables(doc, opts = {}) {
  const parts = [];
  parts.push(`/* Design Tokens from ${opts.file || "design"} */`);
  parts.push(`:root {`);
  
  // Colores
  const colors = palette(doc);
  const colorUsage = extractColorUsage(doc);
  
  parts.push(`  /* Colors */`);
  colors.forEach((c, i) => {
    const name = `--color-${i + 1}`;
    parts.push(`  ${name}: ${c.color}; /* used ${c.count} times */`);
  });
  
  // Uso semántico de colores
  parts.push(`  /* Semantic Color Usage */`);
  colorUsage.slice(0, 15).forEach(c => {
    const colorClean = c.color.replace("#", "").replace(/[^a-fA-F0-9]/g, "");
    if (c.fill > 0) parts.push(`  --color-${colorClean}-fill: ${c.color};`);
    if (c.text > 0) parts.push(`  --color-${colorClean}-text: ${c.color};`);
    if (c.stroke > 0) parts.push(`  --color-${colorClean}-stroke: ${c.color};`);
  });
  
  // Spacing
  const spacing = extractSpacingTokens(doc);
  parts.push(`  /* Spacing */`);
  if (spacing.gap) {
    spacing.gap.slice(0, 10).forEach(s => {
      const val = typeof s.value === "number" ? s.value : JSON.stringify(s.value);
      parts.push(`  --spacing-gap-${val}: ${val}px;`);
    });
  }
  if (spacing.padding) {
    spacing.padding.slice(0, 10).forEach(s => {
      const val = typeof s.value === "number" ? s.value : JSON.stringify(s.value);
      const cleanVal = typeof val === "string" ? val.replace(/\s+/g, "-") : val;
      parts.push(`  --spacing-padding-${cleanVal}: ${val}px;`);
    });
  }
  
  // Border radius
  const radius = extractRadiusTokens(doc);
  parts.push(`  /* Border Radius */`);
  radius.slice(0, 8).forEach(r => {
    parts.push(`  --radius-${r.value}: ${r.value}px;`);
  });
  
  // Typography
  const typo = typographyScale(doc);
  parts.push(`  /* Typography */`);
  typo.slice(0, 10).forEach(t => {
    const name = t.fontFamily.replace(/\s+/g, "-").toLowerCase();
    parts.push(`  --font-${name}-${t.fontSize}-${t.fontWeight}: ${t.fontFamily} ${t.fontSize}px/${t.fontWeight};`);
  });
  
  parts.push(`}`);
  
  return parts.join("\n");
}

// ---------- main ----------

try {
  const file = args[1];
  if (cmd !== "mcp-status" && !file) {
    console.error("missing .pen file");
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
      const screenQuery = takeAfter("--screen");
      let rootNode = null;
      if (screenQuery) {
        rootNode = findNodeByIdOrName(doc, screenQuery);
        if (!rootNode) {
          const screens = detectScreens(doc).filter(
            (s) =>
              s.node.id.toLowerCase() === screenQuery.toLowerCase() ||
              s.node.name.toLowerCase().includes(screenQuery.toLowerCase()) ||
              String(s.breakpoint) === screenQuery
          );
          rootNode = screens[0]?.node ?? null;
        }
        if (!rootNode) {
          console.error(`screen not found: "${screenQuery}"`);
          process.exit(1);
        }
      }
      print(tree(doc, depth, rootNode));
      break;
    }
    case "find": {
      const { doc } = load(file);
      const query = args[2];
      if (!query) {
        console.error("find requires a search text");
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
    case "specs": {
      const { doc } = load(file);
      const specOpts = {
        blueprintDepth: parseInt(takeAfter("--blueprint-depth") || "5", 10),
        blueprintLimit: parseInt(takeAfter("--blueprint-limit") || "25", 10),
        noBlueprints: args.includes("--no-blueprints"),
        typographyLimit: parseInt(takeAfter("--typography-limit") || "30", 10),
        colorLimit: parseInt(takeAfter("--color-limit") || "40", 10),
        strokeLimit: parseInt(takeAfter("--stroke-limit") || "20", 10),
        layoutLimit: parseInt(takeAfter("--layout-limit") || "30", 10),
      };
      const specs = extractDesignSpecs(doc, specOpts);
      if (useJson) {
        console.log(JSON.stringify(specs, null, 2));
      } else {
        printSpecs(specs);
      }
      break;
    }
    case "capture": {
      const { doc } = load(file);
      const depthRaw = takeAfter("--depth");
      printCapture(
        captureDesign(doc, {
          file: resolvePenFile(file),
          depth: depthRaw !== undefined ? parseInt(depthRaw, 10) : 3,
          screen: takeAfter("--screen"),
        })
      );
      break;
    }
    case "screens": {
      const { doc } = load(file);
      printScreens(
        detectScreens(doc).map(({ node, breakpoint }) => ({
          id: node.id,
          name: node.name,
          breakpoint,
          width: node.width,
          height: node.height,
          sections: (node.children || []).map((c) => c.name || c.id),
        }))
      );
      break;
    }
    case "typography": {
      const { doc } = load(file);
      printTypography(typographyScale(doc));
      break;
    }
    case "inspect": {
      const { doc } = load(file);
      const id = args[2];
      if (!id) {
        console.error("inspect requires a node id");
        process.exit(1);
      }
      const depthRaw = takeAfter("--depth");
      const childDepth = depthRaw !== undefined ? parseInt(depthRaw, 10) : 0;
      const data = inspectNode(doc, id, childDepth);
      if (!data) {
        console.error(`node not found with id "${id}"`);
        process.exit(1);
      }
      if (useJson) console.log(JSON.stringify(data, null, 2));
      else console.log(JSON.stringify(data, null, 2));
      break;
    }
    case "export": {
      const outPath = takeAfter("--out") || file.replace(/\.pen$/i, ".png");
      const scaleRaw = takeAfter("--scale");
      const scale = scaleRaw !== undefined ? parseFloat(scaleRaw) : 1;
      const result = runPenExport(file, outPath, scale);
      console.log(`exported: ${result.out}`);
      if (result.log) console.log(result.log);
      break;
    }
    case "export-html": {
      const { doc } = load(file);
      const outPath = takeAfter("--out") || file.replace(/\.pen$/i, ".html");
      const html = exportToHTML(doc, {
        file: resolve(file),
        screen: takeAfter("--screen"),
      });
      writeFileSync(outPath, html, "utf8");
      console.log(`exported HTML: ${outPath}`);
      break;
    }
    case "export-css": {
      const { doc } = load(file);
      const outPath = takeAfter("--out") || file.replace(/\.pen$/i, ".css");
      const css = exportToCSSVariables(doc, {
        file: resolve(file),
      });
      writeFileSync(outPath, css, "utf8");
      console.log(`exported CSS: ${outPath}`);
      break;
    }
    case "cli-exec": {
      const script = args.slice(2).join(" ");
      if (!script) {
        console.error('cli-exec requires a script, e.g. \'get_app_state({ include_schema: false })\'');
        process.exit(1);
      }
      console.log(runPenCliExec(file, script));
      break;
    }
    case "edit": {
      const id = args[2];
      const key = args[3];
      const rawValue = args[4];
      if (!id || !key || rawValue === undefined) {
        console.error("edit requires: <file> <id> <key> <jsonValue> [--write]");
        process.exit(1);
      }
      const { raw, doc } = load(file);
      const result = edit(doc, id, key, rawValue);
      if (!result.found) {
        console.error(`node not found with id "${id}"`);
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
    case "mcp-status": {
      mcpStatus();
      break;
    }
    default:
      console.error(`unknown command: "${cmd}"`);
      console.log(HELP);
      process.exit(1);
  }
} catch (err) {
  if (err instanceof SyntaxError && err.message.includes("JSON")) {
    console.error(`file is not valid JSON: ${err.message}`);
  } else {
    console.error(err.message || String(err));
  }
  process.exit(1);
}
