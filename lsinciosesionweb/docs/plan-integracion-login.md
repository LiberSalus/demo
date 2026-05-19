# Plan de integracion de LoginLiberS en lsinciosesionweb

## Objetivo

Integrar la experiencia de inicio de sesion de `LoginLiberS` dentro del dashboard `lsinciosesionweb`, manteniendo un solo flujo de autenticacion, un solo cliente API y una ruta clara para consumir datos reales del backend.

El snapshot de referencia queda en `integraciones/LoginLiberS`. Ese directorio no debe conectarse directo al runtime del dashboard; se usara como fuente para migrar componentes, estilos y flujos de forma controlada.

## Principios de trabajo

- Hacer cambios pequenos y verificables.
- Mantener el login viejo como respaldo hasta que el nuevo este probado.
- Centralizar la sesion en `src/services/auth.js`.
- Centralizar las llamadas HTTP en `src/services/apiClient.js`.
- Usar nombres claros en espanol para funciones nuevas o refactorizadas.
- Agregar comentarios solo cuando expliquen una decision importante, un riesgo o un comportamiento temporal.
- Correr `npm run build` despues de cada fase que toque codigo activo.
- Crear commits por fase para tener puntos de restauracion.

## Hallazgos iniciales

- El dashboard usa React 18 y `LoginLiberS` usa React 19. No se debe mezclar el `package.json` del snapshot con el dashboard.
- El dashboard tiene `src/services/apiClient.js`, pero tambien existe `src/lib/apiClient.js`. Hay que revisar si el segundo sigue en uso antes de eliminarlo o unificarlo.
- `src/services/auth.js` ya usa `sesion/autenticacion/mediciones/iniciar-sesion` para el inicio de sesion integrado.
- `LoginLiberS` ya tiene el endpoint correcto para mediciones, pero tambien trae su propio `apiClient`, `env` y rutas.
- `.env` y `.env.development` aparecen versionados aunque el `.gitignore` ya los incluye. No contienen secretos en la revision actual, pero deben tratarse como riesgo de configuracion.
- El guard actual prioriza token real. `auth_ready` queda como compatibilidad temporal para migracion/desarrollo.
- Hay uso legitimo de `localStorage` para datos locales del dashboard, pero la autenticacion debe guardar solo lo minimo.
- No se encontro `dangerouslySetInnerHTML` en el codigo activo revisado. Hay `innerHTML` dentro de copias de `particles.js` en demos vendorizados, no en pantallas activas.

## Riesgos a controlar

### Seguridad

- Evitar tokens en URL cuando login y dashboard vivan en el mismo proyecto.
- No persistir contrasenas, CURP, documentos ni datos personales sensibles en almacenamiento local.
- Limpiar `access_token`, `auth_ready` y `perfil_min` siempre que se cierre sesion.
- Manejar respuestas `401` desde el cliente API limpiando sesion y redirigiendo a login.
- Validar entradas antes de enviar al backend: correo, contrasena, telefono, CURP y codigo postal.
- Usar `encodeURIComponent` en valores que formen parte de query strings o rutas dinamicas.
- Mostrar mensajes de error seguros para usuario, sin filtrar trazas ni detalles tecnicos.
- Revisar que los `.env` versionados no contengan secretos antes de cada push.

### Autenticacion

- `src/services/auth.js` sera la unica fuente de verdad para sesion.
- `src/services/apiClient.js` sera el unico cliente HTTP con token.
- El login nuevo debe llamar a `iniciarSesion` del dashboard, no a los servicios copiados.
- La validacion de acceso protegido debe depender de token y posteriormente de `mi-sesion`.
- El mock de auth debe estar apagado por defecto y nunca activarse accidentalmente en produccion.
- El bridge de desarrollo entre puertos debe eliminarse cuando el login nuevo viva dentro del dashboard.

### Rendimiento

- No cargar el preregistro completo si el usuario solo entra a login.
- Separar login, registro y recuperacion para permitir carga diferida despues.
- Evitar estados gigantes en componentes que solo pintan UI.
- Evitar `useEffect` que dispare peticiones duplicadas.
- Mantener assets del login en una carpeta propia para no contaminar bundles innecesarios.
- Revisar componentes pesados antes de montarlos dentro de rutas principales.

### Mantenibilidad

- Separar validaciones, servicios y componentes visuales.
- Usar nombres en espanol que digan la intencion:
  - `iniciarSesion`
  - `cerrarSesion`
  - `guardarSesion`
  - `obtenerTokenDeRespuesta`
  - `validarCorreo`
  - `limpiarSesionAutenticacion`
  - `obtenerSesionActual`
- Comentarios esperados:
  - Por que se normalizan formas distintas de token.
  - Por que se limpia sesion local aunque falle logout.
  - Por que existe codigo temporal de migracion.
  - Que datos si se permiten en `localStorage`.
- Evitar comentarios que repitan literalmente lo que dice el codigo.

## Estructura destino propuesta

```txt
src/
  features/
    autenticacion/
      Autenticacion.jsx
      componentes/
      configuracion/
      datos/
      estilos/
      pasos/
      utilidades/
      vistas/
  pages/
    LoginNuevo/
      LoginNuevo.jsx
  services/
    apiClient.js
    auth.js
    env.js
```

`integraciones/LoginLiberS` queda como referencia temporal. Cuando la migracion este estable, se elimina o se mueve a documentacion externa.

## Estado actual del login integrado

- `/panel/login` renderiza el login nuevo integrado.
- `/panel/login-anterior` conserva el login previo como respaldo temporal.
- El bridge local entre `5173` y `5174` queda apagado en desarrollo con `VITE_DEV_AUTH_BRIDGE=0`.
- El inicio de sesion llama al endpoint de mediciones y centraliza token/perfil en `src/services/auth.js`.
- El cliente API agrega el token en `Authorization` y limpia sesion ante respuestas `401`.
- `obtenerSesionActual` ya existe, pero todavia falta usarlo en componentes del dashboard.

## Fases de aplicacion

### Fase 0. Auditoria base

- Revisar `.env`, `.env.development` y `.gitignore`.
- Revisar clientes API duplicados.
- Revisar almacenamiento local relacionado con autenticacion.
- Revisar endpoints de sesion contra Swagger.
- Documentar riesgos antes de tocar flujo activo.

Criterio de salida: este documento existe y el equipo acepta las reglas de integracion.

### Fase 1. Migracion visual aislada

- Crear `src/features/autenticacion`.
- Copiar componentes visuales necesarios del login.
- Mover assets del login a una carpeta controlada.
- Crear `src/pages/LoginNuevo/LoginNuevo.jsx`.
- Agregar ruta temporal `/login-nuevo`.
- No conectar todavia preregistro completo.

Criterio de salida: `/login-nuevo` pinta correctamente y `npm run build` pasa.

### Fase 2. Sesion centralizada

- Actualizar `src/services/auth.js` para usar `autenticacion/mediciones/iniciar-sesion`.
- Adaptar el login nuevo para llamar a `iniciarSesion`.
- Guardar solo token y perfil minimo.
- Normalizar manejo de errores del backend.
- Mantener logout centralizado.

Criterio de salida: login nuevo obtiene token real, entra al dashboard y logout limpia sesion.

### Fase 3. Proteccion de rutas y sesion actual

- Ajustar `ProtectedRoute` para depender de token real.
- Agregar `obtenerSesionActual` con `autenticacion/mediciones/mi-sesion`.
- Manejar `401` desde el cliente API.
- Poblar `perfil_min` desde la sesion real.

Criterio de salida: recargar una ruta protegida conserva sesion valida y expulsa sesion invalida.

### Fase 4. Sustitucion controlada del login viejo

- Cambiar `/login` para usar el login nuevo.
- Mantener el login viejo temporalmente si se requiere rollback.
- Quitar bridge local de `5173` a `5174`.
- Limpiar variables dev que ya no apliquen.

Criterio de salida: el dashboard corre como un solo proyecto y el login externo ya no es necesario para operar local.

### Fase 5. Registro y recuperacion

- Migrar preregistro por pasos, no de golpe.
- Separar servicios de preregistro del flujo visual.
- Validar entradas y mensajes de error por paso.
- Agregar recuperacion de contrasena cuando exista endpoint confirmado.

Criterio de salida: registro funciona sin duplicar clientes API ni estados globales innecesarios.

### Fase 6. Datos reales del dashboard

- Conectar Header y TarjetaUsuario a `mi-sesion`.
- Conectar servicios de mediciones para Inicio.
- Reemplazar datos mock por adaptadores de respuesta.
- Agregar estados de carga, vacio y error por modulo.

Criterio de salida: el dashboard pinta datos reales con token autenticado.

## Checklist por commit

- El cambio tiene alcance claro.
- No mezcla refactor visual con cambio de autenticacion salvo que la fase lo indique.
- No agrega secretos ni datos sensibles.
- No introduce un nuevo cliente API sin justificarlo.
- `npm run build` pasa o se documenta el bloqueo.
- Los nombres nuevos estan en espanol.
- Los comentarios explican decisiones, no instrucciones obvias.
- El estado de sesion puede limpiarse sin dejar al usuario atrapado.

## Progreso actual

- Fase 0 completada: auditoria base y reglas de integracion documentadas.
- Fase 1 completada: login nuevo aislado; esa ruta temporal fue reemplazada por `/login`.
- Fase 2 completada: login nuevo conectado al servicio real de sesion.
- Fase 3 completada: rutas protegidas dependen de token, se agrego lectura de sesion actual y limpieza automatica ante `401`.
- Fase 4 completada: `/login` usa el login nuevo y el login anterior queda temporalmente en `/login-anterior`.

## Pendientes inmediatos

1. Probar manualmente `/panel/login` con un usuario valido del backend.
2. Verificar que logout limpie sesion y regrese a `/panel/login`.
3. Conectar `obtenerSesionActual` al layout/Header para pintar datos reales de usuario.
4. Revisar si `src/lib/apiClient.js` sigue en uso; si no, eliminar o documentar su retiro.
5. Decidir si primero migramos registro/recuperacion o si conectamos datos reales del dashboard.
6. Quitar `/panel/login-anterior` cuando el login nuevo quede validado.
7. Limpiar `integraciones/LoginLiberS` cuando ya no haga falta como referencia.

El siguiente paso recomendado es validar el login integrado con un usuario real y luego conectar `mi-sesion` al Header/TarjetaUsuario antes de entrar al preregistro completo.
