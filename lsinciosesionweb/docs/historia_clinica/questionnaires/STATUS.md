# STATUS.md — Extraccion de diagramas drawio → Mermaid

Documento para retomar la tarea sin perder contexto. Cualquier IA o developer
puede seguir desde aqui.

## Que estabamos haciendo

Convertir las **17 paginas** del diagrama `index.DEMO_quewstionnaire.drawio` a
diagramas **Mermaid** (`.mmd`) individuales, tab por tab y **a mano** (sin
script generador). Ya estan creados los 17 `.mmd` en `mermaid/` y todos
renderizan con mermaid-cli (mmdc).

## Donde

- Fuente: `docs/historia_clinica/questionnaires/index.DEMO_quewstionnaire.drawio`
- Salida: `docs/historia_clinica/questionnaires/mermaid/` (`index.md` = indice)
- Referencia de patron corregido: `cuestionario_hads.mmd` + `cuestionario_hads-review.md`

## Convencion de nombres

- Diagrama: `{tab_name}.mmd` en `snake_case` (p. ej. `cuestionario_phq.mmd`,
  `anexo_c.mmd`, `a.mmd`, `b.mmd`, `c.mmd`).
- Tabla de interpretacion: `{tab_name}-review.md` (mismo `snake_case` + guion
  `-review`), p. ej. `cuestionario_hads-review.md`.

## Metodo

- Cada `.mmd` se escribe a mano interpretando el drawio; no hay scripts que generen archivos.
- Python **solo en modo lectura**: inspeccionar celdas `<mxCell>` y aristas por pagina.
- Validacion:
  ```bash
  npx --yes @mermaid-js/mermaid-cli@10 -p <puppeteer-config-no-sandbox.json> -i X.mmd -o X.svg
  ```

## Correccion clave (HADS)

El HADS **no** es un arbol de analisis paralelo: es flujo **secuencial**.
- Orden real verificado en el drawio:
  `A.1 -> D.1 -> A.2 -> D.2 -> A.3 -> D.3 -> A.4 -> D.4 -> A.5 -> D.5 -> A.6 -> D.6 -> A.7 -> D.7 -> Resultados -> Fin`
- Cada item es **un solo nodo** con el enunciado y sus 4 opciones numeradas con
  valor: `A.1.1 Nunca (0)`, `A.1.2 De vez en cuando (1)`, ...
- En el `.mmd` la cadena va con **una flecha por linea** para que la conexion
  entre items quede explicita (`hA1 --> hD1`, `hD1 --> hA2`, ...).

## Como se hacen las tablas en .md

Los `*-review.md` usan tablas Markdown clasicas:
```
| Puntuacion | Interpretacion |
|---|---|
| 0-7 | Normalidad |
| 8-10 | Probable ansiedad |
| 11-21 | Caso de ansiedad |
```
Convencion: `| cabecera | cabecera |`, fila separadora `|---|---|`, filas
`| valor | texto |`. Cada cuestionario lleva su tabla de interpretacion tal
como aparece en el drawio.

## Estado

Los **12 cuestionarios** ya siguen el patron secuencial + `-review.md`:
PHQ-9, GAD-7, GDS-15, CDI, CTH, EDAH, ASRS-V1.1, DTS, SPIN, TAS-20, EAG y HADS.
Todos renderizan con mmdc y la auditoria de SVG (orden de `x` + conteo de
`marker-end`) dio OK.

## Correcciones aplicadas en la auditoria

- **HADS**: cadena reescrita con una flecha por linea.
- **ASRS**: items 9, 12, 16 y 18 (Parte B) con "A veces" = 1 (fiel al drawio).
- **DTS**: se reinserto el item 13 (duplicado del 12) y se renumeraron 14-18;
  el `-review.md` ya dice 18 items.
- **CDI**: item 25 fiel al drawio (Nadie me quiere=0, No estoy seguro=1,
  Estoy seguro=2), invertido respecto a la escala CDI estandar; se anoto en
  `%%` y en `-review.md`.
- Raridades del drawio anotadas en `%%`/`-review.md`: CDI item 5 (doble rotulo
  "5.1"), ASRS item 15 (doble rotulo "15.1"), GDS item 11 (el drawio solo
  conecta valor al "NO").

## Pendiente inmediato

1. **Commit pendiente** (Conventional Commits en ingles). Los cambios demo/selector
   previos del proyecto siguen sin commitear.

## Trabas ya resueltas

- Comentarios `%%` **antes** de `flowchart LR` rompen el parseo de mermaid:
  declarar primero `flowchart LR` y despues los comentarios.
- El drawio original tiene rotulaciones erroneas que se corrigen y se anotan en `%%`:
  - Opciones del item A.2 vienen como "3.2/3.3/3.4" (deberian ser A.2.x).
  - Opcion D.2.1 "Igual que siempre" rotulada "4.1.".
  - Opciones del item A.3 rotuladas "D.3.x" y algunas "A.3.x".
- Discrepancias de contenido anotadas: DTS tiene 18 items (el 13 duplica el 12);
  TAS-20 solo 19 visibles (falta el item 20; 4, 5, 17, 18 invertidos); EAG 12
  items (7 y 8 duplican el enunciado) pero su rubrica dice 0-77 (11 items).

## Como verificar el orden visual real

Renderizar a SVG y leer las coordenadas `x` de los nodos (regla: cada nodo del
SVG trae su `transform="translate(x,y)"`). El orden de `x` debe coincidir con la
cadena esperada (`A.1 < D.1 < A.2 < ...`), y el numero de flechas
(`marker-end`) debe ser igual al numero de conexiones de la cadena.
