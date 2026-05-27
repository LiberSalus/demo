# AGENTS.md

Guia de trabajo para continuar el proyecto `lsinciosesionweb` sin perder el contexto de arquitectura, limpieza y decisiones tomadas.

## Forma de trabajar

- Antes de hacer cualquier tarea es importante que leas este archivo de contexto 
- Hablar con el usuario en espanol, tono cercano y claro.
- El usuario suele llamar al asistente "maestro"; mantener ese estilo colaborativo.
- Antes de modificar, revisar el arbol y entender si el archivo esta activo, en transicion o legacy.
- Hacer cambios pequenos, verificables y con commits cortos cuando el usuario lo autorice o cuando se cierre una limpieza clara.
- No borrar archivos legacy directamente si hay duda: moverlos a `afuera/` conservando su ruta relativa cuando sea posible.
- No revertir cambios del usuario. Si aparece algo nuevo o distinto, asumir que lo cambio el usuario y trabajar alrededor.
- Despues de cambios en codigo activo o assets importados, correr `npm run build`.

## Reglas de codigo

- Usar nombres de funciones claros en espanol cuando se agreguen o refactoricen funciones propias del proyecto.
- Cada funcion nueva o funcion refactorizada debe llevar un comentario breve en espanol que explique su responsabilidad.
- Preferir componentes reutilizables cuando haya duplicacion real, pero sin sobrerrefactorizar.
- Mantener estilos por modulo CSS cuando el patron del componente ya vive asi.
- Usar imports con alias `@/` cuando el proyecto ya lo permite.
- Evitar cambios grandes mezclados: primero estructura, luego comportamiento, luego estilos.

## Arquitectura actual

- `src/routes/index.jsx` concentra las rutas del panel.
- `src/config/routes.jsx` contiene las constantes de rutas activas.
- `src/Layout/Principal.jsx` monta el layout privado del panel.
- `src/components/Header` contiene header, menu lateral y tarjeta lateral de perfil.
- `src/components/Footer` contiene el footer activo.
- `src/features/autenticacion` contiene el flujo nuevo de autenticacion.
- `src/features/metricas` contiene el modulo principal de metricas.
- `src/pages/Inicio` contiene dashboard inicial, calendario, tarjetas de salud, citas, medicamentos y noticias.
- `src/shared/assets` guarda assets compartidos de uso transversal, como `usuario-default.png`.
- `afuera/` es el area de resguardo para piezas removidas del arbol activo.

## Decisiones tomadas

- Las metricas nuevas viven bajo `src/features/metricas`.
- Frecuencia cardiaca, presion arterial, oxigenacion y glucosa ya estan conectadas a la nueva estructura de metricas.
- El boton de registros ya se trajo al flujo nuevo y se conserva dentro de `features/metricas/registros`.
- Las graficas viejas y componentes legacy se estan moviendo gradualmente a `afuera/`.
- Los cuestionarios se conservan por ahora porque se van a retomar mas adelante.
- `Any`, `Monitor` y `Franky` usan `PaginaEnConstruccion` como pantalla temporal reutilizable.
- Las rutas placeholder se mantienen vivas para no romper menu/navegacion mientras diseno y producto definen pantallas finales.

## Limpieza ya realizada

- Se movieron a `afuera/` carpetas y piezas legacy de paginas no activas.
- Se movieron assets duplicados o sin referencias activas.
- Se movio `GraficaFrecuenciaCardiaca` fuera del arbol activo.
- Se movio `backgroundPanel` y se limpiaron sus referencias.
- Se movieron archivos de configuracion de metricas viejas que ya no participaban en el registro central.
- Se centralizo el avatar default en `src/shared/assets/images/perfil/usuario-default.png`.
- Se creo `PaginaEnConstruccion` para reducir duplicacion en pantallas temporales.

## Metricas

- La configuracion central esta en `src/features/metricas/config/metricas.config.js`.
- Las areas estan en `src/features/metricas/config/areas.config.js`.
- Los servicios compartidos de metricas estan en `src/features/metricas/services`.
- Utilidades comunes viven en `src/features/metricas/utils`.
- Cada metrica debe mantener su logica especifica dentro de su carpeta.
- Si se agrega una nueva metrica, primero registrar su metadata, despues su vista y al final conectar resumen/inicio si aplica.
- Evitar traer de regreso componentes legacy si ya existe una version nueva conectada.

## Sesion y perfil

- `src/services/auth.js` maneja autenticacion, decode-token, refresh y logout.
- `src/hooks/useSesionActiva.js` centraliza el estado funcional de sesion activa.
- La tarjeta lateral del header ya esta preparada para mostrar estado conectado/desconectado.
- Los datos que aun dependen de backend deben dejarse preparados con fallback claro.
- La foto de perfil usa servicios en `src/services/perfil.js`.

## Commits recientes importantes

- `30d6651` Conecta graficas de oxigenacion y glucosa.
- `eced4f6` Ordena archivos legacy fuera del arbol activo.
- `4f25f4` Mueve paginas placeholder fuera del arbol activo.
- `8b0a685` Actualiza avatar compartido y jsconfig.
- `66a2eb7` Mueve tarjeta bienestar sin uso activo.
- `f801e38` Mueve piezas de metricas sin uso activo.
- `7fef2a5` Mueve assets de metricas sin uso activo.
- `df12adc` Mueve documento pdf de metricas sin uso activo.
- `017a4c7` Reutiliza pantalla temporal en rutas pendientes.

## Pendientes naturales

- Revisar carpetas activas por partes, no hacer limpiezas masivas a ciegas.
- Afinar estilos con wireframes cuando diseno los comparta.
- Completar pantallas de recuperacion de contrasena cuando backend entregue servicios.
- Seguir puliendo metricas con el patron de Frecuencia, Presion, Oxigenacion y Glucosa.
- Revisar `tmp/`, `tools/`, `docs/` e `integraciones/` solo con contexto, porque pueden servir como referencia.
- Evaluar despues si conviene Zustand para estado global, pero solo cuando el arbol de datos lo pida de verdad.

## Comandos utiles

```bash
npm run build
git status --short
rg "texto-a-buscar" src
rg --files src
```

## Criterio para mover a `afuera/`

Mover a `afuera/` cuando se cumpla al menos una de estas condiciones:

- No hay imports ni referencias activas en `src`.
- Es una version vieja reemplazada por una nueva en `features/metricas`.
- Es un documento o asset de referencia que no participa en runtime.
- El usuario confirma que ya no se usara, pero quiere conservarlo por seguridad.

No mover si:

- Pertenece a cuestionarios pendientes.
- Esta conectado a rutas activas.
- Es un asset usado por Inicio, Header, Footer, Login o metricas activas.
- Solo parece viejo, pero aun no se verificaron referencias.
