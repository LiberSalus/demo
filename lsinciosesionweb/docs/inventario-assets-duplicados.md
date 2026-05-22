# Inventario de assets duplicados

## Criterio

Los duplicados se detectaron por hash SHA256. Si dos archivos comparten hash, el contenido es identico byte a byte.

## Regla recomendada

- Si un asset solo se usa en una feature, debe vivir dentro de esa feature.
- Si un asset se usa en dos o mas features activas, puede subir a una carpeta compartida.
- Si una feature es legacy y pronto se eliminara, no conviene centralizar sus assets todavia.
- No crear una carpeta global enorme de iconos sin criterio; eso vuelve dificil saber que se puede borrar.

## Ubicacion sugerida

```txt
src/
  shared/
    assets/
      icons/
      images/
  features/
    metricas/
      frecuencia-cardiaca/
        assets/
```

`shared/assets` debe recibir solo assets reutilizados por pantallas activas.

## Duplicados claros detectados

### Menu legacy contra menu activo

Duplicados entre:

- `src/components/Header/menu`
- `src/components/menu`

El menu activo del layout vive en `src/components/Header/menu`. La carpeta `src/components/menu` solo aparece usada por `src/pages/Panel/Panel.jsx`, y `Panel` no aparece conectado en rutas vivas.

Accion aplicada:

- `src/pages/Panel` se trato como legacy porque no estaba conectado en rutas vivas.
- Se elimino `src/components/menu` junto con `src/pages/Panel`.

### TarjetaSalud duplicada

Duplicados entre:

- `src/components/Tarjetas/TarjetaSalud`
- `src/pages/Inicio/TarjetaSalud`

Ejemplos:

- `icoSangre.svg`
- `icoPeso.svg`
- `icoPasos.svg`
- `icoOxigenacion.svg`
- `icoFrecuencia.svg`
- `icoEstres.svg`
- `icoEnergia.svg`
- `icoDescanso.svg`
- `icoCalorias.svg`
- `icoBienFisico.svg`
- `icoBienMental.svg`
- `icoBienNutri.svg`

Accion sugerida:

- Definir cual version de `TarjetaSalud` queda activa.
- Mover iconos compartidos a `src/shared/assets/icons/metricas`.
- Actualizar imports de la version activa.
- Eliminar la carpeta duplicada cuando no tenga referencias.

### Imagen de noticia repetida

`news1.png` aparece duplicada en:

- `src/pages/Inicio/TarjetaNoticia/news1.png`
- `src/pages/Inicio/TarjetaNoticias/news1.png`
- `src/pages/Inicio/TarjetaSalud/news1.png`

Accion sugerida:

- Dejar una sola imagen en una carpeta de Inicio o compartida si se usa fuera de Inicio.

### Iconos repetidos entre metricas legacy

Duplicados entre Glucosa, Oxigenacion y Presion Arterial:

- `icobien.svg`
- `icoCuidado.svg`
- `icoAlert.svg`
- `icoCampana.svg`
- `icoMas.svg`

Accion sugerida:

- No centralizar todavia si esas metricas legacy seran reemplazadas por metricas v2.
- Cuando migren a `features/metricas`, mover solo los iconos realmente compartidos a `features/metricas/assets` o `shared/assets/icons`.

### Iconos compartidos entre reporte y metricas

Duplicados detectados:

- `icoVerdePaloma.svg`
- `icoRojoArriba.svg`
- `icoRojoAbajo.svg`

Accion sugerida:

- Revisar si reporte y metricas v2 conservaran el mismo lenguaje visual.
- Si si, mover a `src/shared/assets/icons/estado`.

## Primera limpieza segura propuesta

1. Cerrar commit de la limpieza 3D y refactor de frecuencia.
2. Aplicado: eliminar `src/pages/Panel` y `src/components/menu`.
3. Despues limpiar duplicados de `TarjetaSalud`.
4. Dejar para el final los iconos de metricas legacy, porque esas pantallas se reemplazaran por v2.
