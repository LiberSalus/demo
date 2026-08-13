# Feature: Cuestionarios psicométricos en modo demo (alineada con dh_forms)

> **Estado: implementada (Fases 1-2 y 4 completas). Pendiente: Fase 3**
> (bloque de resultado con puntuación e interpretación), condicionales de
> PHQ-9/CTH y áreas Físico/Social/Nutricional. Este documento es a la vez la
> propuesta original y el registro del estado implementado.

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
- Se unificó el área en **`emocional`** ("Bienestar Emocional"): el catálogo
  del Inicio y `cuestionarios.config.js` registran los 12 instrumentos ahí,
  ruta `/panel/cuestionarios/emocional`. La categoría de negocio "Bienestar
  mental" se conserva dentro del JSON en `list_categories` (`key_industry: 1`).

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

El JSON por instrumento sigue el schema de `PHQ9.json`/`CRAFFT.json` de
`dh_forms/backend/docs/cuestionarios/` (contrato dh_forms) más **dos
extensiones demo** al final (`scoring` e `interpretacion`):

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
  // Extension demo (no dh_forms) — fuera del contrato, al final del archivo:
  "scoring": { "tipo": "suma", "maximo": 27 },
  "interpretacion": [
    { "desde": 0, "hasta": 4, "texto": "Ansiedad minima" },
    { "desde": 5, "hasta": 9, "texto": "Ansiedad leve" }
  ]
}
```

> En los archivos reales (`src/config/cuestionarios/*.js`) las extensiones
> `scoring` e `interpretacion` van comentadas como "extensiones demo" y el
> bloque se exporta con `export default` (módulo JS, no JSON puro).

### Qué se adopta tal cual (sin inventar nada nuevo)

1. **`list_questions` + `list_options`**: mismas llaves, tipos y valores.
   `value` numérico = puntaje de la opción (ya viene en los `.mmd`).
2. **`conditional`** (`{ type: "all"|"any"|"none", rules: [{ id_question,
   operator, value }] }`): los flujos con ramas de los `.mmd` se expresan con
   este objeto. Casos detectados en la auditoría:
   - **DTS gravedad** (frecuencia→gravedad): **implementado** — la pregunta de
     gravedad de cada ítem se muestra si su frecuencia respondida es `> 0`
     (distinta de "Nunca"), verificado en el runner.
   - **PHQ-9 ítem 10** (impacto funcional) y **CTH ítems 15-16**
     (gravedad/limitación): **pendientes** de agregar al JSON (mismo formato).
   - Nota: `CRAFFT.json` aún no ejercita `conditional` (todas sus preguntas
     son lineales); es el primer JSON donde aparecerá de verdad en demo.
3. **`scoring` + `interpretacion`** (extensión demo, NO el sistema FormFlow de
   `docs/types/`): la puntuación e interpretación se declaran de forma
   declarativa y simple:
   - **Suma simple**: `scoring: { tipo: "suma", maximo: N }` — suma de los
     `value` de las opciones respondidas (GAD-7, PHQ-9, GDS, SPIN, EAG...).
   - **Inversiones** (TAS-20 4/5/17/18, CDI 25): se resuelven asignando el
     `value` invertido directamente en las opciones del JSON (anotado en el
     ítem), sin expresiones `math`.
   - **Interpretación**: `interpretacion: [{ desde, hasta, texto }]` traducida
     1:1 desde las tablas verificadas de los `*-review.md` (bandas de
     puntuación → etiqueta).
   - Nota: el sistema de expresiones FormFlow de dh_forms
     (`scoring_expression`/`evaluation_expression`) **no se adoptó en demo**;
     queda como contrato para el backend futuro.
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

Cada ítem tiene frecuencia (0-4) y gravedad (0-4). **Decisión tomada
(opción a)**: dos preguntas `SINGLE_CHOICE` por ítem → **36 preguntas** con
`order` 1-36 (impares frecuencia, pares gravedad), cero cambios de motor.
La pregunta de gravedad es **condicionada** (se muestra solo si la frecuencia
respondida es `> 0`), vía el objeto `conditional` del contrato
(`{ type: "all", rules: [{ id_question, operator: ">", value: 0 }] }`), que
el motor consume con `pruneHidden`/`evalShowIf` (`src/utils/logicPreg.js`).
El tipo nuevo `DTS_ITEM` (opción b) queda descartado para demo.

## Flujo en modo demo

1. **Ubicación**: los 12 JSON viven en `src/config/cuestionarios/` (módulos JS
   con `export default`), copia fiel del contrato dh_forms + extensiones demo —
   un solo formato para dos consumidores (demo y backend futuro).
2. **Registro**: se registran en `src/config/cuestionarios.config.js` bajo el
   área **`emocional`**, con import dinámico
   (`file: () => import("@/config/cuestionarios/gad7.js")`).
3. **Listado**: `Area.jsx` (ruta `/panel/cuestionarios/emocional`) los lista
   con estado/progreso, gating por perfil y paginación.
4. **Render**: `Run.jsx` carga `meta.file()` y monta `PlantillaQs`. El motor
   se adaptó para leer el contrato dh_forms en su subconjunto (SINGLE_CHOICE +
   `conditional` + `order`), manteniendo retrocompatibilidad con
   `propuesta2.json`; el gating de ítems lo resuelve `pruneHidden`
   (`src/utils/logicPreg.js`) y el badge usa el `order` del instrumento.
5. **Demo/offline**: al ser imports locales funcionan igual en demo y en real,
   sin tocar `apiClient.js`. Cuando el backend exista, solo cambia el
   transporte: `meta.file` → API (y `resolverRutaDemo` cubre el modo demo), el
   mismo patrón de `docs/features/metricas-v2.md`.
6. **Resultado** *(pendiente — Fase 3)*: al completar los ítems visibles, el
   motor deberá evaluar `scoring`, guardar el resultado en localStorage y
   mostrar la `interpretacion` correspondiente. Hoy el runner renderiza,
   mide progreso y guarda respuestas, pero **aún no muestra puntuación ni
   interpretación**.

## Fases de implementación

| Fase | Entregable | Estado |
|---|---|---|
| 0 | Validar la propuesta (contrato dh_forms + adaptación del motor) | ✅ Hecho |
| 1 | JSONs de GAD-7, TAS-20 y DTS (doble escala frecuencia/gravedad) + adaptar el motor | ✅ Hecho — los 12 JSON en `src/config/cuestionarios/`; DTS con 36 ítems y `conditional` frecuencia→gravedad verificado en el runner |
| 2 | JSON de los 9 restantes con metadata y condicionales | ✅ Hecho (12 listados en `/panel/cuestionarios/emocional` con metadata e interpretación) — ⚠️ condicionales solo en DTS; PHQ-9 ítem 10 y CTH 15-16 pendientes |
| 3 | Bloque de resultado: puntuación + interpretación al terminar | ⏳ **Pendiente** — `scoring`/`interpretacion` declarados en los JSON pero no evaluados |
| 4 | Conectar Inicio (tarjetas de área) y validar demo completa | ✅ Hecho — tarjetas navegan al área y el tab Bienestar Emocional lista los 12 con progreso real |

## Decisiones pendientes

- ~~¿DTS como dos preguntas por ítem o tipo nuevo `DTS_ITEM`?~~ → **Decidido:
  opción (a)**, dos `SINGLE_CHOICE` por ítem (36 ítems), implementado.
- ~~¿Los JSON se generan a mano o con generador?~~ → **Decidido: a mano**
  desde los `.mmd`, auditados contra el drawio.
- ¿Mostrar la interpretación en pantalla o solo guardarla? → **Pendiente**
  (Fase 3; los `*-review.md` son la fuente de texto).
- ¿Traer también IPAQ/SF-12/CRAFFT (ya existen en dh_forms) para cubrir las
  áreas Físico/Social/Nutricional? → **Pendiente** (hoy solo Emocional tiene
  instrumentos reales).
- ¿Los formularios A/B/C (anamnesis) entran en una fase posterior con el
  mismo motor? → **Posterior**.

## Referencias a la propuesta previa (dh_forms)

- Contrato JSON: `backend/docs/cuestionarios/PHQ9.json`, `CRAFFT.json`
- Sistema de expresiones: `backend/docs/types/expression.md`, `typescript.ts`
- Objeto `conditional`: `backend/docs/my_arquitecture/question/conditional.md`
- Decisión columna JSON vs tabla: `conditional/column_or_table.md`
- Modelo de datos: `backend/docs/bd_mermaid.mmd`, `db_ddl.sql`
- Metadatos de los 12 instrumentos: `backend/docs/cuestionarios_metadata.csv`
