# Plan de arquitectura para metricas v2

## Objetivo

Preparar `lsinciosesionweb` para recibir las nuevas metricas que se estan trabajando en `BorradorDos`, sin arrastrar la estructura actual de `src/pages/SaludFisica` como base final.

La meta no es migrar todo de golpe. La meta es dejar un terreno ordenado para ensamblar cada metrica nueva por partes: flujo, componentes, servicios, utils, assets, mocks temporales y posterior conexion con backend.

## Contexto actual

- `lsinciosesionweb` ya tiene dashboard, rutas protegidas, layout principal, sesion y servicios base.
- Las metricas actuales de `src/pages/SaludFisica` fueron utiles para aprender y prototipar, pero no seran la base definitiva.
- `BorradorDos` contiene las nuevas piezas de metrica, especialmente `FrecuenciaCardiaca` y `PresionArterial`.
- El trabajo de diseno, salud y backend seguira cambiando pantallas y datos, por eso la arquitectura debe permitir reemplazos controlados.

## Principios de trabajo

- Avanzar por fases pequenas y verificables.
- No borrar metricas viejas hasta que una metrica v2 este montada y validada.
- Evitar copiar `BorradorDos` completo sin separar responsabilidades.
- Mantener rutas estables para no romper navegacion del dashboard.
- Usar ids estables para metricas, no textos visibles como fuente de verdad.
- Centralizar configuracion de metricas en un registro.
- Separar UI, estado, transformaciones de datos y llamadas HTTP.
- Dejar mocks claramente aislados para retirarlos cuando back entregue servicios.
- Reutilizar componentes compartidos solo cuando el patron ya sea claro.
- Correr `npm run build` despues de cada fase que toque codigo activo.

## Reglas a cuidar

### Rutas

- La ruta publica de la seccion debe mantenerse desde `src/routes/index.jsx`.
- `src/pages/SaludFisica/SaludFisica.jsx` puede convertirse en contenedor, pero no debe depender de componentes viejos como base final.
- Los query params deben usar ids estables, por ejemplo `?metric=frecuencia_cardiaca`.

### Configuracion

- Una metrica debe registrarse en un solo lugar.
- El registro debe definir al menos:
  - `id`
  - `area`
  - `label`
  - `unidad`
  - `estado`
  - `Component`
  - `service`
  - `mock`

### Componentes

- Los componentes visuales no deben llamar servicios directamente si esa llamada puede vivir en un hook o capa de datos.
- Los componentes de grafica reciben datos ya normalizados.
- Los modales reciben valores, callbacks y estado de apertura desde su contenedor.
- Las tarjetas compartidas deben vivir fuera de una metrica especifica.

### Servicios

- Toda llamada HTTP debe pasar por `src/services/apiClient.js`.
- Los servicios de metricas deben vivir agrupados por dominio.
- Un servicio no debe conocer detalles visuales ni nombres de componentes.
- La capa de servicio debe normalizar respuestas solo cuando sea un contrato comun del backend.

### Utils

- Calculos de rango, promedio, filtros, fechas y series de grafica deben vivir en `utils`.
- Los utils deben ser funciones puras cuando sea posible.
- Los utils no deben leer `localStorage`, `window` ni hacer llamadas HTTP.

### Mocks

- Los mocks son temporales y deben quedar marcados como tales.
- Los mocks deben vivir cerca de la metrica que los usa o en una carpeta comun de mocks.
- No mezclar mocks dentro de componentes grandes si luego se reemplazaran por backend.

### Assets

- Assets especificos de una metrica viven dentro de esa metrica.
- Assets compartidos viven en una carpeta comun.
- Evitar duplicar iconos equivalentes en `pages` y `components`.

## Arbol destino propuesto

```txt
src/
  features/
    metricas/
      config/
        metricas.config.js
        areas.config.js
      components/
        MetricasTabs/
        MetricaLayout/
        TarjetaMetrica/
        EstadoMetrica/
        ModalBase/
      hooks/
        useMetricasArea.js
        useMetricaActiva.js
      services/
        metricas.api.js
      utils/
        fechasMetricas.js
        seriesMetricas.js
        rangosMetricas.js
      mocks/
        README.md
      frecuencia-cardiaca/
        FrecuenciaCardiaca.jsx
        frecuenciaCardiaca.config.js
        frecuenciaCardiaca.service.js
        frecuenciaCardiaca.utils.js
        frecuenciaCardiaca.mock.js
        components/
        assets/
      presion-arterial/
        PresionArterial.jsx
        presionArterial.config.js
        presionArterial.service.js
        presionArterial.utils.js
        presionArterial.mock.js
        components/
        assets/
```

## Contrato inicial de una metrica

```js
export const frecuenciaCardiacaConfig = {
  id: "frecuencia_cardiaca",
  area: "salud_fisica",
  label: "Frecuencia cardiaca",
  unidad: "ppm",
  estado: "activa",
  Component: FrecuenciaCardiaca,
  service: frecuenciaCardiacaService,
  mock: frecuenciaCardiacaMock,
};
```

## Flujo esperado

1. La ruta `SaludFisica` carga las metricas del area `salud_fisica`.
2. El componente de tabs lee el query param `metric`.
3. Si el query param existe y coincide con una metrica registrada, monta esa metrica.
4. Si no existe, monta la primera metrica activa del area.
5. La metrica montada usa su hook o contenedor para preparar datos.
6. Los componentes visuales reciben datos normalizados.
7. Cuando backend este listo, el mock se reemplaza desde la capa de servicio o hook, no desde la UI.

## Migracion desde BorradorDos

### Fase 0: Preparacion

- Crear estructura `src/features/metricas`.
- Crear registro de metricas v2.
- Crear tabs reutilizables por area.
- Mantener pantallas viejas sin borrarlas.

### Fase 1: Frecuencia cardiaca

- Copiar la metrica desde `BorradorDos` a `features/metricas/frecuencia-cardiaca`.
- Separar:
  - componente raiz
  - componentes internos
  - mocks
  - utils
  - assets
- Dejar `localStorage` aislado en hook temporal, no dentro de componentes visuales.
- Montarla desde el registro v2.
- Validar build.

### Fase 2: Presion arterial

- Repetir el mismo patron con `PresionArterial`.
- Extraer componentes que se repitan con frecuencia cardiaca.
- Validar si `MarcoTarjeta`, filtros, modales o tarjetas de referencia pasan a compartidos.

### Fase 3: Limpieza controlada

- Revisar que rutas y dashboard ya no usen componentes viejos de `src/pages/SaludFisica`.
- Mover lo obsoleto a una carpeta de respaldo o eliminarlo con commit dedicado.
- Revisar assets duplicados.
- Revisar imports muertos con `rg` y build.

### Fase 4: Conexion real

- Crear servicios reales por metrica cuando back entregue endpoints.
- Reemplazar mocks desde hooks o services.
- Agregar estados de carga, error y sin datos.
- Evitar que los componentes visuales cambien por detalles de API.

## Primeras piezas a construir

1. `src/features/metricas/config/metricas.config.js`
2. `src/features/metricas/hooks/useMetricasArea.js`
3. `src/features/metricas/components/MetricasTabs/MetricasTabs.jsx`
4. `src/features/metricas/frecuencia-cardiaca/FrecuenciaCardiaca.jsx`
5. Adaptacion de `src/pages/SaludFisica/SaludFisica.jsx` para usar metricas v2.

## Pendientes antes de mover codigo

- Confirmar nombres finales de ids de metricas.
- Confirmar si `Salud Mental` y `Salud Nutricional` tambien migraran al mismo sistema.
- Revisar wireframes de diseno para definir layout comun.
- Revisar contratos de backend cuando esten disponibles.
- Decidir si se agrega Zustand en esta fase o despues de migrar la primera metrica.

## Criterio para decidir si algo se vuelve reusable

Una pieza se vuelve compartida solo si:

- Aparece en dos metricas reales.
- Tiene el mismo comportamiento, no solo apariencia parecida.
- Puede recibir datos por props sin conocer la metrica.
- No obliga a una metrica a adaptarse de forma rara.

Si no cumple eso, vive dentro de su metrica hasta que el patron se confirme.
