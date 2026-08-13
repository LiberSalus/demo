# Feature: Export de cuestionarios completados a Excel (.xlsx)

> **Estado: Propuesta (pendiente de validación/implementación).** Diseño
> acordado: un **`.xlsx` por categoría de bienestar** (ej. Bienestar
> Emocional), generado **100 % en el cliente** con la librería SheetJS
> (`xlsx`), con **tres tipos de hoja**: datos del paciente, resumen de
> puntajes/interpretación y una hoja por instrumento. En modo demo funciona
> totalmente **offline** (los datos viven en `localStorage`).

## Objetivo

Permitir descargar las respuestas de los cuestionarios completados como un
archivo **Excel (.xlsx) por categoría**, listo para adjuntar al expediente o
analizar: una hoja de portada con los datos del paciente, una hoja resumen con
el puntaje e interpretación de cada instrumento, y una hoja por cuestionario
con sus respuestas. Sin servidor: todo se genera en el navegador y, en modo
demo, sin conexión.

## Necesidad (por qué existe)

- Hoy las respuestas **solo viven en `localStorage`** (`respuestasCuestionario:{id}`)
  y no hay ninguna forma de extraerlas: ni export, ni reporte, ni impresión.
- El flujo de cuestionarios no tiene aún la **Fase 3** (pantalla de resultado),
  así que el profesional no puede ver el puntaje/interpretación acumulado de un
  paciente fuera de la app.
- Para demos de venta, poder **bajar el reporte en Excel en el momento** es un
  cierre de presentación muy efectivo (y funciona offline).

## Estado actual (diagnóstico)

| Pieza | Comportamiento hoy | Archivo |
|---|---|---|
| Respuestas guardadas | `respuestasCuestionario:{id}` guarda `{ idPregunta → valor }` (el **valor numérico** de la opción, 0-3) + resumen `:pct/:ans/:vis` | `utils/logicPreg.js` |
| Instrumentos | 12 JSONs con metadatos (`scoring`, `interpretacion`, `target_age_group`) y `list_questions` (id, order, type, text, `list_options` con texto+valor) | `src/config/cuestionarios/*.js` |
| Paciente demo | Nombre, edad, sexo, perfil, correo, peso/sangre/estatura disponibles desde la persona activa (catálogo o cuenta local) | `demo.config.js` (`obtenerPerfilDemo`) |
| Export | **No existe nada** (cero referencias a xlsx/excel/blob) | — |
| Librería | No hay `xlsx`/`exceljs`/`jszip` instaladas | `package.json` |

## Formato y estructura del archivo

Un `.xlsx` por categoría, con **tres tipos de hoja** en este orden:

```
Reporte_Cuestionarios_Bienestar_Emocional_2026-08-05.xlsx
├─ Hoja 1  "Datos del paciente"   → identidad + perfil
├─ Hoja 2  "Resumen"              → instrumentos | puntaje | interpretación
├─ Hoja 3  "PHQ-9"                → respuestas del instrumento
├─ Hoja 4  "GAD-7"                → respuestas del instrumento
└─ ...      (una hoja por instrumento con respuestas, nombre = key del JSON)
```

### Hoja 1 — Datos del paciente

| Campo | Ejemplo (María Demo) |
|---|---|
| Paciente | María Fernández |
| Edad | 34 años |
| Sexo | Mujer |
| Perfil | adulto_activo |
| Correo | demo@libersalus.com |
| Peso / Sangre / Estatura (opcional) | 62 kg / O+ / 163 cm |
| Fecha de generación | 05/08/2026 |
| Área del reporte | Bienestar Emocional |

Datos tomados de la persona demo activa o de la cuenta registrada
(`obtenerPerfilDemo()`), sin inventar nada nuevo.

### Hoja 2 — Resumen de instrumentos

| Instrumento | Puntaje | Interpretación | Estado | Fecha |
|---|---|---|---|---|
| GAD-7 | 12/21 | Ansiedad moderada | Completado | 05/08/2026 |
| PHQ-9 | 6/27 | Depresión leve | Completado | 05/08/2026 |
| HADS-A | 8/21 | Probable ansiedad | Completado | 05/08/2026 |
| HADS-D | 4/21 | Normalidad | Completado | 05/08/2026 |
| DTS-F | — | Puntuación parcial | En progreso | — |

- Los instrumentos con `scoring.tipo: "suma"` generan **una fila**
  (`Puntaje = Σ valores / maximo`).
- Los instrumentos con `scoring.tipo: "subescalas"` generan **una fila por
  subescala** (`HADS-A`, `HADS-D`, `ASRS-A`, `EDAH-H`…), sumando solo los
  ítems de esa subescala.
- **Interpretación** = rango de `interpretacion` que contiene el puntaje
  (los rangos de subescalas llevan `subescala: id`).
- **Solo se interpreta lo completado**: con respuestas parciales el puntaje
  sería engañoso, así que la celda queda con la fila en estado "En progreso"
  y sin interpretación.
- Esta hoja adelanta una pieza de la **Fase 3** (calcular scoring) pero solo en
  el momento del export; no se muestra aún en pantalla.

### Fuente de resultados e interpretaciones

**Todo viene de los propios JSONs de los instrumentos** (`src/config/cuestionarios/*.js`)
— no hay tabla externa ni datos nuevos que mantener:

- `scoring`: `{ "tipo": "suma" | "subescalas", "maximo", "items"?, "subescalas"?: [{ id, nombre, items[], maximo }] }`.
  En `suma`, `items` (opcional) indica qué preguntas suman: el **CTH** solo suma
  los ítems 1-14 (sus ítems 15-16 son criterios clínicos que no suman); sin
  `items` se suman todas las preguntas.
- `interpretacion`: `[{ desde, hasta, texto }]`, y en instrumentos de subescalas
  cada rango incluye `subescala: id` (ej. `A`, `F`, `T`, `Global`).
- Cálculo: `puntaje = Σ respuestas[item]` para los ítems del instrumento (o de
  la subescala) → buscar el rango `desde ≤ puntaje ≤ hasta`.
- Respuestas: `localStorage` `respuestasCuestionario:{id}` (mapa `idPregunta → valor`).
- Los 4 instrumentos con `subescalas`: **HADS** (A ansiedad / D depresión),
  **ASRS** (Parte A tamizaje / Parte B), **EDAH** (H, DA, DAH, TC) y **DTS**
  (F frecuencia / G gravedad / T total).
- Casos especiales de interpretación: **SPIN** es escala continua (un solo
  rango 0-68, texto descriptivo) y el **DTS** trae rangos descriptivos de
  parciales (0-68, 0-136) más que cortes clínicos.

**Procedencia de los datos (cadena de verdad):**

```
index.DEMO_quewstionnaire.drawio      ← fuente original (flujos + tablas por pestaña)
   ├─► mermaid/*.mmd                   → SOLO estructura: preguntas + opciones con
   │                                     valores (0-3). No trae tablas; solo un
   │                                     comentario que apunta al review
   │                                     ("%% Tabla de interpretacion: ...-review.md.")
   └─► mermaid/*-review.md             → tablas de interpretación auditadas (con
                                         subescalas y cortes clínicos), citando al
                                         drawio como fuente
                                             ↓
src/config/cuestionarios/*.js          → preguntas/opciones tomadas del .mmd;
                                         scoring + interpretacion tomados del
                                         *-review.md (comentario en cada JSON)
```

Implicación: el JSON es el contrato que lee la app, así que el export no toca
markdowns. Pero si se corrige un corte clínico, el orden de actualización es
`drawio → review.md → JSON`.

### Hojas de instrumento (una por cuestionario)

Nombre de hoja = `key` del JSON (ej. `PHQ-9`, `GAD-7`, `DTS`) — el nombre largo
("PHQ-9 (Patient Health Questionnaire)") excede el límite de 31 caracteres de
Excel. Columnas recomendadas:

| `pregunta_code` | `pregunta` | `answer` |
|---|---|---|
| 1 | Se ha sentido nervioso(a)... | Casi todos los días |
| 2 | No ha sido capaz de parar... | Ningún día |

- **`pregunta_code`** = el `id` de la pregunta (clave con la que se guardan las
  respuestas; `order` es solo el número visible en pantalla).
- **`answer`** = el **texto de la opción**, no el número. Lo guardado es el
  valor numérico (0-3); el export lo desnormaliza con
  `list_options.find(o => Number(o.value) === respuesta)` → "Casi todos los
  días". Un solo número haría la hoja ilegible sin el manual del instrumento.
- **`answer_value`** (opcional, columna 4): el valor numérico crudo — solo si
  se planea **re-importar** las respuestas a un backend (el contrato dh_forms
  almacena valores numéricos).

## Flujo de descarga (puntos de entrada)

1. **Runner** (`PlantillaQs.jsx`): botón **"Descargar (Excel)"** junto a
   Guardar/Limpiar, activo cuando hay respuestas. Es el clic más natural: el
   usuario acaba de completar.
2. **Tab del área** (Bienestar Emocional): botón **"Descargar Excel"** en el
   encabezado → arma el archivo con las hojas de los instrumentos que tengan
   respuestas.
3. **Futuro — "Mis Cuestionarios" del Inicio** (`ListaCuestionarios`): botón
   por instrumento en la tarjeta de detalle (mismo export, un solo archivo).

Interacción de descarga: generar el workbook → `Blob` →
`URL.createObjectURL` → `<a download>` → clic → liberar el objeto URL. Sin
servidor y sin navegación.

## Reglas de export por tipo de pregunta

| Tipo | Regla |
|---|---|
| `SINGLE_CHOICE` | `answer` = texto de la opción cuyo `value` coincide con el guardado |
| `MULTIPLE_CHOICE` | Se guarda un arreglo de valores → `answer` = textos unidos con "; " (ej. "Opción A; Opción C") |
| `TEXT` | Texto crudo tal cual |
| Pregunta condicional no visible | Se **omite la fila** (ya las limpia `pruneHidden` al guardar) |
| Instrumento sin respuestas | No genera hoja de instrumento (solo portada + resumen) |

## Cambios técnicos implicados (sin implementar)

1. **Nueva dependencia**: `xlsx` (SheetJS, ~400 KB) para generar el workbook en
   el cliente. `jszip` **solo** si se agrega la opción "Descargar todo" (zip con
   un xlsx por categoría).
2. **Utilidad de export** (`src/utils/exportarExcel.js` aprox.):
   - `construirHojaPaciente(perfil)` → hoja 1.
   - `calcularPuntaje(json, respuestas)` → maneja **ambos** formatos de
     `scoring` (`suma` y `subescalas`) y devuelve, por instrumento o por
     subescala: `{ puntaje, maximo, interpretacion }` (o `null` si está
     incompleto).
   - `construirHojaResumen(listaInstrumentosConPuntaje)` → hoja 2 (una fila
     por instrumento o por subescala, según el formato).
   - `construirHojaInstrumento(json, respuestas)` → hoja por instrumento
     (desnormaliza valor → texto de `list_options`).
   - `descargarXlsx(workbook, nombreArchivo)` → Blob + descarga.
3. **Botones de descarga**: en `PlantillaQs.jsx` (por instrumento) y en el
   encabezado del tab del área (por categoría), con estado activo/inactivo
   según haya respuestas.

## Decisiones de diseño pendientes

| Pregunta | Recomendación |
|---|---|
| **Multi-toma**: hoy `localStorage` guarda **solo la última aplicación** (una clave por instrumento). ¿Exportar la última toma o historial? | **v1: última toma** (cero cambios de storage). v2 (historial por fecha) requiere versionar la clave en `logicPreg.js` — fuera de esta propuesta |
| ¿Resumen con puntaje/interpretación en la hoja 2? | **Sí** — es lo que hace útil la portada de un vistazo; adelanta solo la pieza de cálculo del export, no la pantalla (Fase 3) |
| ¿Identificar al paciente en la hoja 1? | **Sí** (nombre/edad/perfil desde la sesión demo). Opción "anónimo" como extensión futura |
| Columnas de la hoja de instrumento: ¿3 o 4? | **3** (`pregunta_code \| pregunta \| answer`); agregar `answer_value` solo si se va a re-importar a un backend |
| Nombre de archivo | `Reporte_Cuestionarios_{Área}_{YYYY-MM-DD}.xlsx` |
| ¿Zip "Descargar todo"? | **No en v1**; se agrega solo si se pide descargar varias categorías de una vez |

## Alcance

- Export a `.xlsx` por categoría (hoja paciente + resumen + hojas por
  instrumento), 100 % cliente, funcional en modo demo offline.
- Botones de descarga en el runner y en el tab del área.
- Cálculo de puntaje/interpretación **en el momento del export** (sin tocar la
  pantalla del runner).

## Fuera de alcance

- La **Fase 3** (mostrar puntaje/interpretación en pantalla al terminar).
- Historial de múltiples aplicaciones (multi-toma) — requiere versionar el
  storage.
- Export desde el backend real (cuando las respuestas vivan en servidor, el
  mismo formato de workbook se podría generar del lado del servidor).
- Formato PDF o impresión.
- La **lógica de activadores** entre cuestionarios (`unlock_if`) — frente
  aparte.

## Referencias

- Instrumentos y contrato: `src/config/cuestionarios.config.js`, `src/config/cuestionarios/*.js`
- Storage de respuestas y progreso: `src/utils/logicPreg.js`, `src/utils/progreso.js`
- Runner actual: `src/pages/Cuestionarios/PlantillaQs.jsx`, `PreguntasQs.jsx`
- Perfil del paciente demo: `src/config/demo.config.js` (`obtenerPerfilDemo`)
- Estado del flujo de cuestionarios (fases 0-4): `docs/features/cuestionarios-demo.md`
- Diagramas mermaid y tablas de interpretación (fuente): `docs/historia_clinica/questionnaires/mermaid/` (`.mmd` + `*-review.md`)
