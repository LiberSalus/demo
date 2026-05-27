# Inventario de estilos para Inicio

Este documento resume los patrones que ya existen en el home y el panel principal. La idea es crear variables desde el lenguaje visual actual, no imponer nombres nuevos sin revisar el codigo.

## Alcance revisado

- `src/index.css`
- `src/Layout/principal.module.css`
- `src/components/Header`
- `src/components/Footer`
- `src/components/Sos`
- `src/components/ProgresoCorazon`
- `src/components/Tarjetas`
- `src/components/TarjetaLogro`
- `src/pages/Inicio`

## Patrones visuales actuales

### Colores frecuentes

- Marca principal: `#007CBA` y `var(--prnci)`.
- Fondo del panel: `#F7F7FF` y `var(--bkgnd)`.
- Fondo del menu lateral: `#F2F2F6` y `var(--menul)`.
- Texto principal: `#334155` y `var(--tipog)`.
- Borde suave: `#ACCCEB` y `var(--borde)`.
- Blanco: `#FFFFFF`, `#ffffff`, `#fff` y `var(--blnco)`.
- Texto secundario: aparecen valores como `#64748b`, `#6b7280`, `#94A3B8`.
- Estados: `#C72611`, `#3FAD58`, `#F8A737`, `#21D127`, `#FF8904`.

### Superficies

- Las tarjetas principales usan fondo blanco y borde `1px solid #ACCCEB`.
- El radio mas comun para tarjetas es `1rem`.
- Algunos componentes antiguos usan `0.8vw`, `8px`, `0.75rem` o `1.1rem`.
- Hay sombras suaves repetidas:
  - `0 6px 16px rgba(31, 41, 55, .06)`
  - `0 10px 24px rgba(15, 23, 42, 0.08)`

### Espaciado

- Los gaps mas repetidos son `1rem`, `0.75rem` y `0.5rem`.
- El home ya usa variables locales:
  - `--inicio-gap`
  - `--inicio-section-mt`
- Conviene elevar esos valores a tokens globales y dejar variables locales solo cuando el componente necesite ajustes propios.

### Tipografia

- Los tamanos mas repetidos son `0.75rem`, `1rem` y `1.5rem`.
- Ya existen tokens `--font10`, `--font12`, `--font14`, `--font16`, `--font18`, `--font20`, `--font24`, `--font32`.
- Conviene sumar nombres semanticos sin romper los nombres numericos actuales.

### Breakpoints detectados

- `460px`
- `600px`
- `768px`
- `864px`
- `900px`
- `947px`
- `968px`
- `1024px`
- `1360px`
- `1366px`
- `orientation: landscape`

El patron deseado para Inicio deberia concentrarse en:

- `460px`: mobile chico.
- `768px`: mobile grande / tablet vertical.
- `1024px`: tablet y cambio de header/sidebar.
- `1360px`: escritorio chico.
- `1366px`: escritorio base del wireframe.

## Tokens candidatos

### Marca y color

- `--color-brand-primary`
- `--color-brand-primary-hover`
- `--color-panel-bg`
- `--color-menu-bg`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-text-muted`
- `--color-border-soft`
- `--color-surface`
- `--color-danger`
- `--color-success`
- `--color-warning`

### Superficies

- `--surface-card-bg`
- `--surface-card-border`
- `--surface-card-radius`
- `--surface-card-shadow`
- `--surface-card-shadow-raised`

### Layout

- `--layout-sidebar-width`
- `--layout-header-height`
- `--layout-header-height-mobile`
- `--layout-content-max`
- `--layout-gap`
- `--layout-gap-sm`
- `--layout-gap-xs`
- `--layout-page-padding`

### Tipografia

- `--text-xs`
- `--text-sm`
- `--text-md`
- `--text-lg`
- `--text-xl`
- `--text-2xl`
- `--font-weight-regular`
- `--font-weight-medium`
- `--font-weight-semibold`
- `--font-weight-bold`

## Criterio de migracion

1. Agregar tokens globales como alias de los valores actuales.
2. Mantener los nombres viejos (`--prnci`, `--borde`, `--blnco`) mientras se migra el CSS.
3. Migrar primero layout y contenedores de Inicio.
4. Despues migrar tarjetas internas una por una.
5. Quitar valores magicos solo cuando el componente ya este estabilizado.

## Observaciones

- El reset global `*, *::before, *::after { color: rgb(74, 73, 83); }` puede provocar choques con componentes y estados. No conviene quitarlo de golpe; debe migrarse con pruebas visuales.
- Hay varios comentarios de borde `dashed` usados como debug. Se pueden limpiar cuando se toque cada modulo.
- Los wireframes muestran que Inicio debe comportarse como reticula por componentes, no como parches por ancho.
