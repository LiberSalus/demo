# AGENTS.md

Guia compacta de trabajo del proyecto `lsinciosesionweb`.

## Forma de trabajar

- Leer este archivo antes de cada tarea.
- Espanol, tono cercano y claro.
- Cambios pequenos y verificables; commits cortos solo cuando el usuario lo autorice.
- No borrar legacy si hay duda: mover a `afuera/` conservando ruta relativa.
- No revertir cambios del usuario.
- Tras cambios en codigo activo o assets, correr `npm run build`.

## Reglas de codigo

- Funciones con nombres claros en espanol y un comentario breve de responsabilidad.
- Reutilizar componentes si hay duplicacion real, sin sobrerrefactorizar.
- Estilos por modulo CSS si el patron ya vive asi; imports con alias `@/`.
- Orden: estructura -> comportamiento -> estilos.

## Arquitectura actual

- Rutas: `src/routes/index.jsx`; constantes en `src/config/routes.jsx`.
- Layout privado: `src/Layout/Principal.jsx`.
- `src/components/Header` (header, menu lateral, tarjeta de perfil) y `src/components/Footer`.
- Modulos nuevos: `src/features/autenticacion` y `src/features/metricas`.
- `src/pages/Inicio`: dashboard, calendario, tarjetas de salud, citas, medicamentos, noticias.
- `src/shared/assets`: assets transversales (p. ej. `usuario-default.png`).
- `afuera/`: resguardo de piezas removidas del arbol activo.

## Decisiones tomadas

- Metricas en `src/features/metricas`: config en `config/metricas.config.js` y `config/areas.config.js`, servicios en `services/`, utils en `utils/`. FC, presion, oxigenacion y glucosa conectadas; registros en `features/metricas/registros`. Nueva metrica: metadata -> vista -> resumen/inicio.
- Legacy se mueve a `afuera/`; no traer de regreso versiones viejas si ya existe la nueva.
- `Any`, `Monitor` y `Franky` usan `PaginaEnConstruccion`; rutas placeholder vivas mientras diseno/producto definen pantallas.
- Cuestionarios se conservan por ahora (se retoman mas adelante).

## Sesion y perfil

- `src/services/auth.js`: autenticacion, decode-token, refresh, logout. `src/services/perfil.js`: foto.
- `src/hooks/useSesionActiva.js` centraliza la sesion activa.
- Datos dependientes de backend siempre con fallback claro.

## Mini-skill: Mermaid + drawio (cuestionarios)

Fuente: `docs/historia_clinica/questionnaires/index.DEMO_quewstionnaire.drawio` (17 paginas); salida `.mmd` en `mermaid/` (indice: `index.md`). Conversion tab por tab a mano, sin scripts generadores; python solo en modo lectura para inspeccionar celdas `<mxCell>` y aristas del XML.

- Patron de cuestionario aprobado: un nodo por item con enunciado + opciones numeradas con valor (`A.1.1 Nunca (0)`); cadena secuencial unica entre items, una flecha por linea (`A.1 -> D.1 -> A.2 -> ...`); un `{tab}-review.md` por cuestionario con su tabla Markdown `Puntuacion | Interpretacion`.
- Trabas resueltas: comentarios `%%` antes de `flowchart LR` rompen el parseo (declarar `flowchart` primero); el drawio original tiene rotulaciones erroneas (A.2 -> "3.2/3.3/3.4", D.2.1 -> "4.1.") que se corrigen y se anotan en `%%`.
- Ser fiel al drawio: los valores y conexiones se leen del XML real (nodos de valor + aristas), no se asumen por el estandar clinico; si el drawio contradice el estandar, se sigue el drawio salvo que el usuario decida otra cosa, y se anota en `%%`/review.
- Auditar flechas/conexiones: no confiar solo en contar items; verificar la cadena una-flecha-por-linea y, en el SVG renderizado, contar `marker-end` y el orden de `x`. Ojo con flujos condicionales y con rotulos duplicados en el drawio (dos opciones con el mismo rotulo) que hacen perder conexiones.
- Validar con `npx --yes @mermaid-js/mermaid-cli@10 -p <config-no-sandbox> -i X.mmd -o X.svg`; para verificar el orden visual real, leer coordenadas `x` de los nodos del SVG.

## Skill: archivos `.pen` (pen.dev)

- Diseños de pen.dev en `docs/pen.dev/`; formato JSON `version 2.17` (árbol de objetos con `id`/`type`).
- Guía completa de formato y operaciones: `.agents/workflow/pen-dev-skill.md`.
- Inspeccionar/editar con `node tools/pen/pen.mjs` (summary, tree, find, text, palette, validate, components, edit). No leer `.pen` enteros (2-16 MB).

## Pendientes naturales

- Limpiezas por partes, con contexto, no masivas a ciegas.
- Recuperacion de contrasena cuando backend entregue servicios.
- Revisar `tmp/`, `tools/`, `docs/` e `integraciones/` solo con contexto.
- Zustand solo si el arbol de datos lo pide de verdad.

## Comandos utiles

```bash
npm run build
git status --short
rg "texto-a-buscar" src
rg --files src
```

## Mover a `afuera/`

Mover si: sin imports/referencias activas; version vieja reemplazada por nueva; documento/asset de referencia sin runtime; usuario lo confirma.
No mover si: pertenece a cuestionarios pendientes; esta en rutas activas; es asset de Inicio/Header/Footer/Login/metricas activas; solo parece viejo sin verificar.
