# Ordenamiento de iconos repetidos

## Criterio de ordenamiento

Los duplicados se detectaron por hash SHA256, por lo que los archivos listados en cada grupo son identicos byte a byte.

La regla propuesta es:

- Conservar el icono junto a su feature si solo se usa ahi.
- Mover a `src/shared/assets/icons` solo cuando el mismo icono se use en dos o mas features activas.
- No centralizar iconos de pantallas legacy que pronto se van a reemplazar.
- Cuando dos carpetas completas sean espejo, eliminar la carpeta legacy en lugar de mover icono por icono.

## Carpeta compartida sugerida

```txt
src/shared/assets/
  icons/
    general/
    menu/
    metricas/
    estado/
  images/
```

## Orden de aplicacion recomendado

1. Aplicado: se elimino legacy `src/pages/Panel` y `src/components/menu`.
2. Aplicado: se elimino copia legacy de `TarjetaSalud`.
3. Aplicado: se eliminaron copias sobrantes de `news1.png`.
4. Aplicado: se centralizaron `icoCerrar.svg` y avatar default activo.
5. Dejar para despues iconos de metricas legacy.
6. Al migrar metricas v2, mover a compartidos solo lo que se repita entre metricas nuevas.

## Grupo 1: Menu duplicado

### Duplicados

Carpetas:

- `src/components/Header/menu`
- `src/components/menu`

Duplicados exactos detectados:

- `LSlogoMenu.png`
- `cabina.svg`
- `fondcabi.png`
- `fondcuest.png`
- `icoDudas.svg`
- `ayuda.svg`
- `celular.png`
- `cabina.png`
- `fondayuda.png`
- `fondo2.png`
- `icoConsultas.svg`
- `cuestionario.svg`
- `botiquin.png`
- `diagnostico.png`
- `inicio.svg`
- `icoAny.svg`
- `expediente.png`
- `question.svg`
- `fondo.png`
- `historial.svg`
- `fondhist.png`

### Uso detectado

- `src/components/Header/menu/Menu.jsx` es el menu activo usado por:
  - `src/Layout/Principal.jsx`
  - `src/components/Header/Header.jsx`
- `src/components/menu/Menu.jsx` solo aparece importado por:
  - `src/pages/Panel/Panel.jsx`
- `src/pages/Panel` no aparece conectado en rutas vivas.

### Accion recomendada

Conservar:

- `src/components/Header/menu`

Eliminado por legacy:

- `src/components/menu`
- `src/pages/Panel`

Tambien se depuro `src/components/Header/menu` para dejar solo assets importados por el menu activo. Se retiraron copias de opciones/carrusel, fondos viejos, `estelas` y `particles.js-master`.

No conviene mover estos iconos a `shared` todavia, porque el problema real es una carpeta espejo.

## Grupo 2: TarjetaSalud duplicada

### Duplicados

Entre:

- `src/components/Tarjetas/TarjetaSalud`
- `src/pages/Inicio/TarjetaSalud`

Iconos repetidos:

- `icoDescanso.svg`
- `icoPeso.svg`
- `icoEdoTriste.svg`
- `icoFrecuencia.svg`
- `icoOxigenacion.svg`
- `icoEdoNeutral.svg`
- `icoEdoDepre.svg`
- `icoBienMental.svg`
- `icoEstres.svg`
- `icoEdoFeliz.svg`
- `icoBienFisico.svg`
- `icoEdoContento.svg`
- `icoSangre.svg`
- `icoPasos.svg`
- `icoCalorias.svg`
- `icoHidratacion.svg`
- `icoBienNutri.svg`

### Uso detectado

Los iconos aparecen en:

- `src/components/Tarjetas/TarjetaSalud/TarjetaMedicion/datosPorMedicion.js`
- `src/pages/Inicio/TarjetaSalud/TarjetaMedicion/datosPorMedicion.js`
- `src/pages/Inicio/TarjetaSalud/TarjetaSalud.jsx`

### Accion recomendada

Aplicado:

- Se conserva `src/pages/Inicio/TarjetaSalud`.
- Se elimina `src/components/Tarjetas/TarjetaSalud` porque no tenia imports externos.
- Se eliminan `TarjetaCategoria`, `mediciones.js` y CSS asociados dentro de la version activa porque ya no participaban en el render.

Si ambas siguen activas:

Crear:

```txt
src/shared/assets/icons/metricas/
```

Mover ahi:

- `icoDescanso.svg`
- `icoPeso.svg`
- `icoFrecuencia.svg`
- `icoOxigenacion.svg`
- `icoSangre.svg`
- `icoPasos.svg`
- `icoCalorias.svg`
- `icoHidratacion.svg`
- `icoEstres.svg`
- `icoEnergia.svg`

Mantener los iconos de estado emocional cerca de la feature hasta confirmar su uso final:

- `icoEdoTriste.svg`
- `icoEdoNeutral.svg`
- `icoEdoDepre.svg`
- `icoEdoFeliz.svg`
- `icoEdoContento.svg`

## Grupo 3: Imagen de noticia repetida

### Duplicados

- `src/pages/Inicio/TarjetaNoticia/news1.png`
- `src/pages/Inicio/TarjetaNoticias/news1.png`
- `src/pages/Inicio/TarjetaSalud/news1.png`

### Uso detectado

Import activo detectado:

- `src/pages/Inicio/TarjetaNoticia/Noticia.jsx`

### Accion aplicada

- Se conserva la unica imagen importada por `src/pages/Inicio/TarjetaNoticia/Noticia.jsx`:

```txt
src/pages/Inicio/TarjetaNoticia/news1.png
```

- Se eliminan las copias en `TarjetaNoticias` y `TarjetaSalud`.

## Grupo 4: Iconos de estado repetidos entre metricas legacy

### Duplicados

Entre:

- `src/pages/SaludFisica/GlucosaEnSangre`
- `src/pages/SaludFisica/Oxigenacion`
- `src/pages/SaludFisica/PresionArterial`

Iconos:

- `icobien.svg`
- `icoCuidado.svg`
- `icoAlert.svg`
- `icoCampana.svg`
- `icoMas.svg`

### Uso detectado

Se usan en componentes legacy como:

- `AdverGlucosa.jsx`
- `AdverOxigeno.jsx`
- `Adver.jsx`
- modales/registros de medicion legacy

### Accion recomendada

No mover todavia.

Estas metricas legacy seran reemplazadas por metricas v2. Centralizarlos ahora puede generar trabajo doble.

Cuando migren a v2, mover los que sigan vivos a:

```txt
src/features/metricas/assets/icons/estado/
```

## Grupo 5: Reporte y metricas

### Duplicados

Entre:

- `src/components/Reporte`
- `src/pages/SaludFisica/GlucosaEnSangre`
- `src/features/metricas/frecuencia-cardiaca/assets`

Iconos:

- `icoVerdePaloma.svg` / `icoPaloma.svg`
- `icoRojoArriba.svg` / `icoArriba.svg`
- `icoRojoAbajo.svg` / `icoAbajo.svg`
- `Logo.svg`

### Uso detectado

Se usan en:

- `src/components/Reporte/Reporte.jsx`
- `src/components/Reporte/ReporteOR.jsx`
- `src/pages/SaludFisica/GlucosaEnSangre/RegistroGlucosa.jsx`
- `src/features/metricas/frecuencia-cardiaca`

### Accion recomendada

No mezclar aun Reporte con metricas v2 hasta saber si reporte se va a redisenar.

Si se conserva el lenguaje visual:

```txt
src/shared/assets/icons/estado/
  paloma.svg
  flecha-roja-arriba.svg
  flecha-roja-abajo.svg
```

## Grupo 6: Header y perfil

### Duplicados

- `src/components/Header/TarjetaLateral/Icons.svg`
- Aplicado: se elimino `src/components/Tarjetas/TarjetaUsuario/Icons.svg` junto con la carpeta legacy.

- `src/components/Header/TarjetaLateral/perfil.png`
- Aplicado: se elimino `src/components/Tarjetas/TarjetaUsuario/perfil.png` junto con la carpeta legacy.

- Aplicado: `src/components/Header/TarjetaLateral/Usuario.png` y `src/components/Header/Usuario.png` se centralizaron en `src/shared/assets/images/perfil/usuario-default.png`.

- Aplicado: `src/components/Header/menu/icoCerrar.svg`, `src/components/Header/TarjetaLateral/icoCerrar.svg` y `src/features/metricas/frecuencia-cardiaca/assets/icoCerrar.svg` se centralizaron en `src/shared/assets/icons/general/cerrar.svg`.

### Uso detectado

`Usuario.png` se usa en:

- `src/components/Header/Header.jsx`
- `src/components/Header/TarjetaLateral/TarjetaLateral.jsx`

`icoCerrar.svg` se usa en:

- menu responsive
- tarjeta lateral
- modal de captura de frecuencia

### Accion aplicada

Crear:

```txt
src/shared/assets/icons/general/
src/shared/assets/images/perfil/
```

Mover candidatos:

- Aplicado: `icoCerrar.svg` -> `src/shared/assets/icons/general/cerrar.svg`
- Aplicado: `Usuario.png` activo de Header -> `src/shared/assets/images/perfil/usuario-default.png`
- Aplicado: `src/components/Tarjetas/TarjetaUsuario` se elimino porque no tenia imports vivos.

## Grupo 7: Carrusel / opciones

### Duplicados

Entre:

- `src/components/Header/menu`
- `src/components/menu`
- `src/components/Tarjetas/TarjetaCarrucel/TarjetaOpcion`

Iconos/imagenes:

- `celular.png`
- `cabina.png`
- `botiquin.png`
- `diagnostico.png`
- `expediente.png`
- `question.svg`

### Uso detectado

El import vivo esta en:

- `src/components/Tarjetas/TarjetaCarrucel/TarjetaCarrucel.jsx`

### Accion recomendada

Conservar los assets junto al carrusel:

```txt
src/components/Tarjetas/TarjetaCarrucel/TarjetaOpcion/
```

Aplicado: las copias del menu legacy salieron junto con `src/components/menu`.

## Grupo 8: Duplicados sin uso directo claro

### Detectados

- `fondcabi.png`
- `fondcuest.png`
- `fondhist.png`
- `Icons.svg`
- `candadoOpen.svg`

### Accion recomendada

Revisar con `rg` antes de eliminar.

Si no hay imports reales, eliminarlos en un commit de limpieza.

Aplicado parcialmente:

- Se elimino `src/components/Tarjetas/TarjetaAlertas`.
- Se elimino `src/components/Tarjetas/TarjetaCarrucel`.
- Se elimino `src/components/Tarjetas/TarjetaSeguimiento`.
- Se eliminaron `TarjetaCuestionario.jsx`, `tarjetaCuestionario.module.css` y `candadoOpen.svg` de `TarjetaCuestionarios`.

## Aplicacion por commits

### Commit 1

Eliminar 3D y guardar refactor de frecuencia actual.

### Commit 2

Aplicado: `src/pages/Panel` y `src/components/menu` fueron eliminados como legacy.

### Commit 3 aplicado

Unificar `TarjetaSalud` y retirar su copia legacy.

### Commit 4 aplicado

Unificar `news1.png`.

### Commit 5 aplicado

Mover `icoCerrar.svg` y avatar default a `shared/assets`.

### Commit 6

Limpiar iconos de metricas legacy cuando esas pantallas ya hayan migrado a v2.
