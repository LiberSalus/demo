# Skill: reconocer y trabajar con archivos `.pen` (pen.dev)

## Objetivo

Que el agente reconozca, inspeccione y modifique los archivos de diseño `.pen`
de pen.dev. Sirve tanto para responder preguntas sobre los diseños del proyecto
como para editarlos con criterio.

## Qué es un archivo `.pen`

- Es **JSON** (texto plano, friendly con git). Version actual: `2.17`.
- Describe un **árbol de objetos gráficos** sobre un canvas bidimensional
  infinito, parecido a HTML/SVG.
- Cada nodo tiene `id` (único, NO puede contener `/`) y `type`.
- Los objetos raíz se posicionan con `x`/`y` (esquina superior izquierda);
  los hijos se posicionan **relativos al padre**.

Estructura top-level:

```json
{
  "version": "2.17",
  "themes": { "mode": ["light", "dark"] },        // opcional: ejes de tema
  "imports": { "alias": "./otro.pen" },           // opcional: archivos importados
  "variables": { "color.primario": { "type": "color", "value": "#007cba" } }, // opcional
  "children": [ /* nodos raíz */ ]
}
```

## Tipos de nodo

| type        | qué es                                                        |
|-------------|---------------------------------------------------------------|
| `frame`     | contenedor con layout flex (`layout`, `gap`, `padding`, `justifyContent`, `alignItems`) y `clip` |
| `group`     | agrupa hijos, sin layout propio                                |
| `rectangle` | rectángulo (`cornerRadius`)                                   |
| `ellipse`   | elipse / anillo (`innerRadius`, `startAngle`, `sweepAngle`)    |
| `path`      | path SVG (`geometry`, `fillRule`, `viewBox`)                   |
| `polygon`   | polígono regular (`polygonCount`)                              |
| `line`      | línea — **no aparece en el schema oficial**, pero los `.pen` de `docs/pen.dev` lo usan mucho; tratarlo como válido. Se dibuja como una caja: `x`, `y`, `width`, `height` (a veces `0` o `fill_container`) y `rotation` (grados), más `stroke`/`strokeWidth`/`strokeLinecap` |
| `text`      | texto (`content`, `fontFamily`, `fontSize`, `fontWeight`, `textAlign`, `textGrowth`) |
| `note`/`prompt`/`context` | notas y anotaciones de IA con `content`           |
| `icon`      | icono de librería (`library`: lucide/feather/Material Symbols/phosphor, `icon`, `weight`) |
| `script`    | genera hijos desde JS (`scriptUri`, `inputs`)                  |
| `ref`       | instancia de un componente (`ref: "id-origen"`, `descendants`) |

## Posición, tamaño y layout

- `x`, `y`: posición (solo aplica si el padre NO usa layout flex).
- `width`, `height`: número, o string de comportamiento dinámico
  (`fit_content`, `fill_container`, con fallback opcional: `fit_content(100)`).
- Layout del padre: `layout: "none" | "vertical" | "horizontal"`, más
  `gap`, `padding`, `justifyContent` (`start|center|end|space_between|space_around`),
  `alignItems` (`start|center|end`).

## Gráficos

- `fill` y `stroke`: color hex o arreglo de fills (se pintan en orden).
- Colores: `#RGB`, `#RRGGBB`, `#RRGGBBAA` (el canal alpha en hex es común,
  p. ej. `#ffffffbf`).
- Tipos de fill: `color`, `gradient` (linear/radial/angular), `image`,
  `shader`, `mesh_gradient`.
- `effect`: `blur`, `background_blur`, `shadow` (inner/outer, `offset`,
  `spread`, `blur`, `color`).
- Otros: `opacity`, `rotation` (grados CCW), `flipX`, `flipY`, `enabled`.

## Texto

- `content` es el texto visible. Buscar textos del diseño = leer `content`.
- Tipografía: `fontFamily`, `fontSize`, `fontWeight`, `letterSpacing`,
  `lineHeight`, `textAlign`, `textAlignVertical`, `underline`, `strikethrough`, `href`.
- `textGrowth`: `auto` (crece sin wrap), `fixed-width` (wrap con ancho fijo),
  `fixed-width-height`.

## Componentes (reutilización)

- Un nodo con `reusable: true` es un componente reutilizable.
- Un nodo `ref` con `ref: "<id>"` crea una instancia.
- Overrides: propiedades directas en el `ref` sobreescriben el componente.
- `descendants`: mapa `{ "<id-del-descendiente>": {...} }` para personalizar
  hijos anidados. Sin `type` = overrides de propiedades; con `type` = reemplazo
  completo del nodo. Rutas anidadas: `"ok-button/label"`.
- `slot: ["id-comp1", ...]` en un frame: marca dónde insertar instancias.

## Variables y temas

- Referencia en propiedades: `"$color.primario"`.
- Declaración: `variables` con `type` (`boolean|color|number|string`) y `value`
  (valor directo o arreglo de `{ value, theme }`; gana el último cuyo theme cuadre).
- `themes` declara los ejes y valores posibles; un nodo puede fijar
  `theme: { "mode": "dark" }` para todo su subárbol.

## Archivos locales (docs/pen.dev/)

Estos son los diseños reales del proyecto (LiberSalus):

- `1.pen` — componentes de registro (2.8 MB)
- `2_registro.pen`, `2_registro_movil.pen`, `2_registro_flujo_completo.pen` — flujos de registro (16 MB el completo)
- `3.components.pen` — biblioteca de componentes (4.8 MB)
- `measurement_frecuencia_cardiaca.pen`, `mesurements_oxigenacion.pen`,
  `mesurements_glucosa.pen`, `mesurements_presion_arterial.pen` — dashboards de métricas

Observaciones de los archivos reales:

- Son árboles planos: **no usan** `variables`, `themes`, `imports`,
  `reusable`/`ref` ni `slot` (pese a lo que soporta el formato).
- Los nombres visibles al diseñador están en `name`; los `id` son códigos cortos
  (p. ej. `HC3tm`).
- Un mismo layout suele repetirse por breakpoint: frames raíz llamados
  `SaludFísica-FC - 1366`, `- 1440`, `- 1920`, `- 768`, `- 1024`, `- 360`, `- 440`.
- Hay `text` que repiten nombre y contenido; para "cambiar todos los X" hay que
  buscar por `content`/`name`, no por id.

## Cómo interpretar componentes (biblioteca `3.components.pen`)

`3.components.pen` es la **biblioteca de componentes** del sistema, con 6
artboards raíz: `Componentes-menu-SV` (selectores de periodo, botones con
estado, dropdowns, iconos de ánimo), `Componentes Oxi`, `Componentes Glucosa`,
`Componentes PA`, `Componentes FC` y `Frame 6327` (maqueta que junta las
4 métricas).

- **Convención de variantes (importada de Figma)**: los nombres de los frames
  hijo usan ejes separados por coma, p. ej.
  `Type=Alerta, Size=Default`, `Property 1=ene`, `State=Active`.
  Ejecutar `node tools/pen/pen.mjs components <archivo>` para listar los
  46 componentes con variantes y su matriz de ejes (Type/State/Size/Property 1).
- **Los dashboards NO definen variantes**: componen el diseño copiando los
  componentes de la biblioteca (mismos `name`, p. ej. `principal-heartCharts`
  aparece 7 veces = una por breakpoint, `Avg_heartCharts` 28 = periodos ×
  breakpoints). No hay `ref` real: son duplicados del árbol.
- Familias recurrentes de componentes: `alertas <métrica>` (Negativa/Alerta/
  Positiva × Default/Movil), `ValRangComp - <métrica>` (tabla de rangos +
  último valor), `Grafica<Métrica>` / `Avg_*Charts` (Semana/Mes/Año ×
  Default/Movil), `msgInfo`, `animHeart`/`heartS`/`heartM`/`heartL` (corazón
  animado en 3 tamaños) y `principal-heartCharts`/`principal-oxyCharts`
  (tarjeta de valor actual con botón).

## Cómo inspeccionar (herramienta oficial de esta skill)

Usar `tools/pen/pen.mjs` (Node, sin dependencias). **Nunca leer un `.pen`
entero con read_files** (2-16 MB): usar la herramienta y leer solo ventanas
específicas cuando haga falta.

```bash
node tools/pen/pen.mjs summary <archivo>                 # version, tipos, frames raíz
node tools/pen/pen.mjs tree <archivo> [--depth 2]        # jerarquía con ids y nombres
node tools/pen/pen.mjs find <archivo> "<texto>"          # buscar por id/nombre/tipo/content
node tools/pen/pen.mjs text <archivo>                    # todos los textos del diseño
node tools/pen/pen.mjs palette <archivo>                 # colores únicos (fill/stroke)
node tools/pen/pen.mjs validate <archivo>                # chequea ids, tipos, refs
node tools/pen/pen.mjs components <archivo>              # detecta componentes: reusable, refs y variantes (Figma)
node tools/pen/pen.mjs edit <archivo> <id> <key> <json> [--write]  # cambiar una propiedad
```

- `summary`/`find`/`text`/`palette`/`validate` aceptan `--json` para salida
  estructurada (pipe a `jq`).
- `find` devuelve la **ruta** del nodo (`padre > hijo > ...`) para ubicarlo en el árbol.

## Operaciones comunes (receta)

1. **"Qué pantallas hay en este .pen"** → `summary` (frames raíz) + `tree --depth 2`.
2. **"Dónde aparece tal texto / label"** → `find <archivo> "texto"` o `text`.
3. **"Cuál es la paleta de colores"** → `palette` (ordenado por uso).
4. **"Cambiar el color de un nodo"** → `find` para ubicar id, luego
   `edit <archivo> <id> fill '"#nuevocolor"' --write` (el valor va como JSON,
   por eso las comillas dobles).
5. **"Cambiar un texto"** → `edit <archivo> <id> content '"nuevo texto"' --write`.
6. **"Validar que el archivo quedó bien"** → `validate` (ids duplicados, refs rotos...).
7. **"Qué componentes/variantes hay"** → `components` (matriz de ejes
   Type/State/Size por componente; reusable y refs si existieran).
8. **"En qué pantallas se usa tal componente"** → `find <archivo> "<nombre del
   componente>"` (el conteo de hits indica cuántos breakpoints lo usan).

## Reglas al modificar `.pen`

- **Preservar `id`** de nodos existentes (los `ref` dependen de ellos).
- **No cambiar `version`** ni reordenar `children` sin motivo.
- Mantener coordenadas relativas: al mover un nodo dentro de un frame, ajustar
  `x`/`y` respecto al padre; si el padre usa layout flex, `x`/`y` se ignoran.
- Colores en hex con su canal alpha si ya lo traían (`#ebebebff` → no quitar `ff`).
- `edit` reescribe el archivo con indent de 2 espacios: en archivos de 16 MB
  eso re-formatea todo el archivo → revisar con `git diff` antes de confirmar;
  mejor probar el cambio en una copia (`cp`) y validarla antes de aplicarla.
- Tras cualquier edición correr `validate` y revisar con `git diff --stat`.
- Los `.pen` viven en `docs/pen.dev/`; son untracked aún (nunca commitear sin
  pedir autorización).

## Fuentes

- Formato oficial: https://docs.pen.dev/for-developers/the-pen-format
- Integración IA/MCP: https://docs.pen.dev/getting-started/ai-integration
- Schema TS completo al final de la página del formato (autoridad final).
- El tipo `line` y los patrones por breakpoint salen de inspeccionar los
  archivos reales de `docs/pen.dev` (el schema oficial no los documenta).
