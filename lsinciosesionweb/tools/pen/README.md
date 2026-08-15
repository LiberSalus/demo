# .pen File Analysis Tools (pen.dev)

This directory contains tools for analyzing, inspecting, modifying, and exporting `.pen` design files from pen.dev.

## Structure

**`pen.mjs`** (≈2200 lines) - Main CLI with all functionality

All functions are in a single file for simplicity and maintainability. Would only split into modules if the file grows significantly (>3000 lines).

## Language

- **Command names and HELP**: English (standard for tools)
- **Error messages**: English (AI-optimized)
- **Output messages**: English (AI-optimized)
- **Comments**: English (compact, AI-optimized)

Fully translated to English for AI optimization following project AGENTS.md rules.

## Comandos Disponibles

### Comandos de Lectura
```bash
node tools/pen/pen.mjs summary <archivo>              # Resumen del documento
node tools/pen/pen.mjs specs <archivo> [--json]      # Especificaciones completas de diseño
node tools/pen/pen.mjs capture <archivo> [--screen] # Brief completo del diseño
node tools/pen/pen.mjs screens <archivo>            # Pantallas/breakpoints detectados
node tools/pen/pen.mjs tree <archivo> [--depth N]   # Arbol jerarquico de nodos
node tools/pen/pen.mjs find <archivo> <texto>       # Buscar por id/nombre/tipo/content
node tools/pen/pen.mjs text <archivo>                # Extraer todos los textos
node tools/pen/pen.mjs typography <archivo>          # Escala tipografica agrupada
node tools/pen/pen.mjs inspect <archivo> <id>       # Detalle de un nodo
node tools/pen/pen.mjs palette <archivo>             # Colores unicos (fill/stroke)
node tools/pen/pen.mjs validate <archivo>            # Validar estructura
node tools/pen/pen.mjs components <archivo>          # Detectar componentes y variantes
```

### Comandos de Exportación
```bash
node tools/pen/pen.mjs export-html <archivo> [--screen <id>] [--out path]
                                       # Exportar a HTML/CSS estructural
node tools/pen/pen.mjs export-css <archivo> [--out path]
                                       # Exportar a CSS variables (design tokens)
node tools/pen/pen.mjs export <archivo> [--out path] [--scale N]
                                       # Exportar a PNG vía pen.dev CLI
```

### Comandos de Edición
```bash
node tools/pen/pen.mjs edit <archivo> <id> <key> <jsonValor> [--write]
```

### Integración con pen.dev CLI
```bash
node tools/pen/pen.mjs cli-exec <archivo> "<script>"
node tools/pen/pen.mjs mcp-status
```

## Capacidades de Análisis

### Especificaciones de Diseño
- **Tokens**: Spacing, radius, strokes, efectos, gradients
- **Layout**: Patrones de flex, gaps, paddings, alineación
- **Colores**: Uso por rol (fill, stroke, text) con conteo
- **Tipografía**: Escala completa con muestras y variantes
- **Componentes**: Blueprints, variantes estilo Figma, reusable/refs

### Análisis Avanzado
- **Accesibilidad**: Texto pequeño, áreas de toque, contraste
- **Grids**: Patrones de columnas, anchos comunes
- **Estados Interactivos**: Hover, active, focus, disabled
- **Responsive**: Breakpoints, adaptaciones de componentes

### Análisis Especial
- **Developer Notes**: Notas de desarrollador, flujos de navegación
- **Animaciones**: Secuencias detectadas con frames numerados
- **Relaciones**: Conexiones documentadas entre componentes
- **SVG**: Paths complejos e iconos personalizados
- **Property States**: Estados basados en Property 1= naming

## Posible Refactorización Futura

Solo si el archivo crece significativamente (>3000 líneas), se podría separar en módulos. Por ahora, mantener todo en un solo archivo es más simple y evita problemas de dependencias circulares.

## Archivos de Diseño del Proyecto

Los archivos `.pen` reales del proyecto están en `docs/pen.dev/`:
- `1.pen` — Componentes de registro (2.8 MB)
- `2_registro.pen`, `2_registro_movil.pen`, `2_registro_flujo_completo.pen` — Flujos de registro
- `3.components.pen` — Biblioteca de componentes (4.8 MB)
- `measurement_*.pen` — Dashboards de métricas específicas