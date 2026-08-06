# Feature: Cuestionarios psicométricos en modo demo (propuesta v2 — alineada con dh_forms)

## Objetivo

Convertir los 12 instrumentos psicométricos ya documentados como diagramas
Mermaid (`docs/historia_clinica/questionnaires/mermaid/`) en **JSON
renderizables** en el modo demo de esta app, usando **el mismo contrato de
datos que ya definiste en `dh_forms`** (`digital_hospital/dh_forms/backend/docs`).
Así los mismos JSON sirven de seed al backend futuro sin transformación, y el
frontend demo no inventa un schema paralelo.

## Respuesta a la pregunta de categorización

**Sí: los 12 instrumentos son todos de salud mental.** En tu propio modelo,
`list_categories` los clasifica como **"Bienestar mental"** (`key_industry: 1`),
coincidiendo con la columna `LS` de tu `cuestionarios_metadata.csv`. No todos
los 17 diagramas son cuestionarios:

| Grupo | Diagramas | ¿Cuestionario renderizable? |
|---|---|---|
| Instrumentos psicométricos (12) | HADS, CDI, GDS, PHQ-9, GAD-7, CTH, EDAH, ASRS, DTS, SPIN, TAS-20, EAG | **Sí → salud mental** |
| Formularios de expediente (3) | A (Registro), B (Padecimiento actual), C (Antecedentes) | No: anamnesis, no instrumentos (motor servirá después) |
| Rúbricas de derivación (2) | ANEXO C (condición→cuestionario), ANEXO D (árbol) | No: lógica de negocio, no formularios |

Matices:
- El ANEXO C deriva NUTRICIÓN → IPAQ, que **ya tienes en dh_forms** (`IPAQ.json`).
  Si se quiere nutrición en demo, el JSON ya existe y solo hay que traerlo.
- El catálogo del Inicio usa el área `emocional` y `cuestionarios.config.js`
  usa `mental`; los instrumentos se registran en `mental` (tu categoría
  "Bienestar mental" se mapea ahí). Sincronizar la etiqueta del Inicio es
  opcional y posterior.

## Fuente de verdad

- Ítems, opciones y valores: los 12 `.mmd` (nodo por ítem con opciones
  numeradas y su valor) — ya auditados contra el drawio (ver
  `tmp/auditoria_*.py`).
- Tablas de interpretación: los 12 `*-review.md` — ya verificadas fila a fila
  contra el drawio.
- Metadatos (descripción, duración, CIE-11, grupo etario, referencias,
  categoría): tu `cuestionarios_metadata.csv` — **los 12 instrumentos ya están
  ahí** (PHQ-9, CDI, DTS, ASRS, EAG, TAS-20, HADS, GDS, EDAH, GAD-7, SPIN,
  CTH).
- Discrepancias del drawio ya anotadas en los `%%`/reviews (HADS opciones
  huérfanas, PHQ-9 ítem 7, CTH 11/16, CDI títulos temáticos, ASRS reescrituras,
  etc.) se respetan tal como quedaron documentadas; no se re-auditan.

## Contrato de datos: el tuyo (dh_forms), no uno nuevo

El JSON por instrumento sigue exactamente el schema de `PHQ9.json`/`CRAFFT.json`
de `dh_forms/backend/docs/cuestionarios/`:

```json
{
  "key": "PHQ-9",
  "name": "PHQ-9 (Patient Health Questionnaire)",
  "description": "Texto amigable para el paciente...",
  "estimated_duration": { "min_minutes": 5, "max_minutes": 10, "description": "..." },
  "list_cie11_codes": [{ "code": "6A7" }],
  "list_categories": [{ "key_industry": 1, "name": "Bienestar mental" }],
  "list_evaluation_topics": [{ "name": "Depresión", "key_industry": "health" }],
  "target_age_group": { "min_age": 18, "max_age": null, "name": "..." },
  "list_questions": [
    {
      "id": 1,
      "order": 1,
      "type": "SINGLE_CHOICE",
      "text": "1. ...",
      "list_options": [
        { "id": 1, "text": "Ningún día", "value": 0, "url": null },
        { "id": 2, "text": "Varios días", "value": 1, "url": null }
      ],
      "conditional": null
    }
  ],
  "scoring_expression": { "expression": { "type": "aggregate", "operator": "sum", ... } },
  "evaluation_expression": { "expression": { "type": "case", "operator": "when", ... } }
}
```

### Qué se adopta tal cual (sin inventar nada nuevo)

1. **`list_questions` + `list_options`**: mismas llaves, tipos y valores.
   `value` numérico = puntaje de la opción (ya viene en los `.mmd`).
2. **`conditional`** (`{ type: "all"|"any"|"none", rules: [{ id_question,
   operator, value }] }`): los flujos con ramas de los `.mmd` se expresan con
   este objeto. Casos detectados en la auditoría:
   - **PHQ-9 ítem 10** (impacto funcional): se muestra si `any` de los ítems
     1-9 tiene `value > 0`.
   - **CTH ítems 15-16** (gravedad/limitación): se muestran solo si hay
     síntomas positivos en la primera parte.
   - Nota: `CRAFFT.json` aún no ejercita `conditional` (todas sus preguntas
     son lineales); es el primer JSON donde aparecerá de verdad en demo.
3. **`scoring_expression` + `evaluation_expression`** (sistema de expresiones
   FormFlow de `docs/types/`): la puntuación y la interpretación se declaran
   como expresiones, no como tablas ad-hoc:
   - **Suma simple**: `aggregate.sum` sobre `question.value` (PHQ-9, GAD-7,
     GDS, SPIN, EAG...).
   - **Inversiones** (TAS-20 4/5/17/18, CDI 25): `math` con `5 - value` o
     `2 - value`, o `sum` sobre `args` que apliquen la inversión por ítem.
   - **Subescalas** (HADS A/D, EDAH H/DA/DAH/TC, ASRS Parte A/B, DTS
     frecuencia+gravedad): una `scoring_expression` por subescala + una suma
     total (en `dh_forms` se declara a nivel `form`; para demo se pueden
     declarar varias y guardar cada resultado).
   - **Interpretación**: `case.when` sobre el puntaje, traducido 1:1 desde las
     tablas verificadas de los `*-review.md` (tu propio ejemplo PHQ-9 en
     `expression.md` ya hace exactamente esto).
4. **Metadatos**: descripción, `estimated_duration`, `list_cie11_codes`,
   `target_age_group`, referencias y categoría se toman de tu
   `cuestionarios_metadata.csv` para los 12 instrumentos.
5. **Estructura de BD** (`bd_mermaid.mmd`: `form` → `assignment` → `response` →
   `answer`): no se toca. El demo simula `assignment`+`response` en
   `localStorage` (mismo patrón que las métricas); cuando llegue el backend,
   los JSON suben tal cual y solo cambia el transporte.

### Qué NO se adopta (deliberadamente, para el demo)

- **Tipos nuevos `RANGE`/`TIMER`**: los 12 instrumentos son `SINGLE_CHOICE`
  puros (la auditoría lo confirmó: cadena lineal de ítems con opciones
  valoradas). No hacen falta para este alcance; quedan para IPAQ/SF-12/CRAFFT.
- **`verified`, `n_questions_*`**: campos de administración del backend, sin
  papel en el renderizado demo.

### Único caso especial: DTS

Cada ítem tiene frecuencia (0-4) y gravedad (0-4). Opciones de modelado
(decisión en Fase 1):
- (a) dos preguntas `SINGLE_CHOICE` por ítem (36 preguntas, cero cambios de
  motor), o
- (b) un tipo nuevo `DTS_ITEM` con dos `list_options` anidadas.
El contrato dh_forms no tiene aún el tipo (b); la opción (a) es la fiel al
contrato actual.

## Flujo en modo demo

1. **Ubicación**: los 12 JSON viven en esta app (p. ej. `src/config/
   cuestionarios/` o `src/features/cuestionarios/data/`), copia fiel del
   contrato dh_forms — un solo formato para dos consumidores (demo y backend
   futuro).
2. **Registro**: se registran en `src/config/cuestionarios.config.js` bajo el
   área `mental` (igual que hoy `MENTAL_DEMO`), con import local
   (`file: () => import("...json")`).
3. **Listado**: `Area.jsx` (ruta `/cuestionarios/mental`) los lista con
   estado/progreso sin cambios: ya lee `areaData.questionnaires`.
4. **Render**: `Run.jsx` carga `meta.file()` y monta `PlantillaQs`. Se adapta
   el motor actual para leer el contrato dh_forms en su subconjunto
   (SINGLE_CHOICE + `conditional` + `scoring_expression` + `evaluation_expression`),
   manteniendo retrocompatibilidad con `propuesta2.json`. Alternativa menor:
   runner demo nuevo que reutilice `PreguntasQs`/`logicPreg.js`.
5. **Demo/offline**: al ser imports locales funcionan igual en demo y en real,
   sin tocar `apiClient.js`. Cuando el backend exista, solo cambia el
   transporte: `meta.file` → API (y `resolverRutaDemo` cubre el modo demo), el
   mismo patrón de `docs/features/metricas-v2.md`.
6. **Resultado**: al completar los ítems visibles, el motor evalúa
   `scoring_expression`, guarda el resultado (p. ej. en la `assignment` demo de
   localStorage) y muestra la `evaluation_expression` (interpretación).

## Fases de implementación

| Fase | Entregable | Criterio de salida |
|---|---|---|
| 0 | Validar esta propuesta (contrato dh_forms + adaptación del motor) | OK del equipo |
| 1 | JSON piloto de GAD-7 (suma simple + `evaluation_expression` case), TAS-20 (inversiones) y DTS (doble escala) + adaptar el motor | Build OK; los 3 renderizan y puntúan |
| 2 | JSON de los 9 restantes con metadata del CSV y condicionales (PHQ-9 ítem 10, CTH 15-16) | Build OK; 12 listados en `/cuestionarios/mental` |
| 3 | Bloque de resultado: puntuación + interpretación al terminar | Los 12 muestran su evaluación |
| 4 | Conectar Inicio (tarjetas de área) y validar demo completa sin backend | Demo recorrible |

## Decisiones pendientes

- ¿DTS como dos preguntas por ítem (fiel al contrato) o tipo nuevo `DTS_ITEM`?
- ¿Los JSON se generan a mano desde los `.mmd` o con un generador en `tmp/`
  (los `.mmd` son parseables)? El AGENTS.md prefiere conversión manual para
  diagramas; para JSON demo un generador auditable es razonable.
- ¿Mostrar la interpretación en pantalla o solo guardarla en la `assignment`
  demo? (Los `*-review.md` son la fuente de texto.)
- ¿Traer también IPAQ/SF-12/CRAFFT (ya existen en dh_forms) para cubrir otras
  áreas del Inicio, o ceñirse a salud mental?
- ¿Los formularios A/B/C entran en una fase posterior con el mismo motor?

## Referencias a la propuesta previa (dh_forms)

- Contrato JSON: `backend/docs/cuestionarios/PHQ9.json`, `CRAFFT.json`
- Sistema de expresiones: `backend/docs/types/expression.md`, `typescript.ts`
- Objeto `conditional`: `backend/docs/my_arquitecture/question/conditional.md`
- Decisión columna JSON vs tabla: `conditional/column_or_table.md`
- Modelo de datos: `backend/docs/bd_mermaid.mmd`, `db_ddl.sql`
- Metadatos de los 12 instrumentos: `backend/docs/cuestionarios_metadata.csv`
