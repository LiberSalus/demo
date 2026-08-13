# Feature: Flujo de modo demo — hub de entrada con perfiles de prueba, login local y registro persistente

> **Estado: Implementado (5 ago 2026).** El botón **"Iniciar demo"** abre un
> **modal** con tres caminos: **perfil de prueba** (selector de personas
> existente), **iniciar sesión** (con la cuenta registrada localmente) y
> **crear cuenta** (registro real que ahora **persiste** la cuenta en
> `localStorage`). El documento conserva el análisis original y registra lo
> implementado. El modo demo general sigue documentado en `demo.md`.

## Objetivo

Rediseñar la entrada al modo demo para que ofrezca **tres caminos** en lugar de
uno: los **perfiles de prueba** existentes (María, Juan, Rosa y Sofía), un
**login con cuenta local** (credenciales registradas en la misma sesión demo) y
un **registro que persiste en memoria** — de modo que lo registrado se pueda
usar después para iniciar sesión. El botón de entrada pasa de ser un atajo
directo al selector de personas a un **hub de modo offline** con dos grandes
rutas: *iniciar sesión* y *crear cuenta*.

## Necesidad (por qué existe)

- Hoy el **registro en modo demo es una pantalla muerta**: el flujo de
  preregistro se resuelve offline (`resolverRutaDemo` responde `{id: 9001}` a
  todos los endpoints) pero **descarta los datos** — no se guarda cuenta, CURP
  ni dirección, y no hay forma de volver a iniciar sesión con lo registrado.
- Existe **un solo camino de entrada** (perfil de prueba); no se puede simular
  el caso de negocio "el paciente ya se registró y vuelve a entrar".
- Para demos de venta conviene conservar el **acceso rápido** de un clic a los
  perfiles de prueba, además de los caminos nuevos.

## Estado anterior (diagnóstico, antes de implementar)

| Pieza | Comportamiento previo | Archivo |
|---|---|---|
| Entrada demo | Botón flotante "Modo demo" → **directo** al selector de personas | `ContenedorAutenticacion.jsx` |
| Perfiles de prueba | 4 personas con perfil/edad que alimenta el gating; selector `VistaSeleccionDemo` | `demo.config.js` |
| Login demo | Valida **solo** contra `DEMO_CREDENCIALES` fijas (env o defaults) | `auth.js` |
| Registro demo | El preregistro (correo → código → datos → CURP → domicilio) **funciona offline** pero **no persiste** | `apiClient.js` (`resolverRutaDemo`) |
| Derivación de perfil | `getCurrentProfile` deriva perfil desde la edad (menor <18, mayor >60) — reusable para cuentas locales | `utils/profile.js` |

## Flujo propuesto

```
Login (real/demo)
 └─ [Iniciar demo] ───────────────► Hub demo (modo offline)
       ├─ Perfil de prueba (destacado) ──► VistaSeleccionDemo ─► Panel
       ├─ Iniciar sesión ──► Modal con 2 sub-opciones:
       │     ├─ Perfil de prueba (acceso corto, mismo selector)
       │     └─ Mi cuenta demo (correo + contraseña → valida contra
       │        localStorage; si no hay cuenta, enlace "Créala aquí")
       └─ Crear cuenta ──► Registro (reusa las pantallas reales, ya offline;
            al terminar persiste la cuenta y deriva perfil por edad) ─► Panel
```

### Camino 1 — Perfil de prueba (destacado)

Se conserva `VistaSeleccionDemo` tal cual (las 4 personas con su variante
visual y perfil de salud). En el hub es la **primera tarjeta** por ser el
camino rápido de venta, y también hay un enlace directo desde el login demo.

### Camino 2 — Iniciar sesión

- El hub es un **modal** (`ModalDemoHub`, portal sobre la pantalla actual con
  cierre por × y tecla Escape); cada tarjeta navega a su destino y cierra el
  modal.
- Vista `VistaDemoLogin`: formulario correo + contraseña que valida contra la
  cuenta guardada en `localStorage` (`cuentaDemo`).
- `iniciarSesion` (demo) acepta **ambas** vías: credenciales de entorno
  (personas demo) o la cuenta local; si ninguna coincide → error.
- Accesos secundarios: "Créala aquí" (registro) y "Entrar con un perfil de
  prueba" (selector), además de "Volver al hub".

### Camino 3 — Crear cuenta (registro persistente)

Reutiliza el flujo de preregistro real (ya funciona offline). Los cambios son
de **persistencia**:

- `resolverRutaDemo` ahora **reenvía el body** de los `post` (antes lo
  descartaba) y persiste en `localStorage` (clave `cuentaDemo`): el paso
  `registro/` guarda correo/teléfono/contraseña/rol, y `guardar-curp` fusiona
  nombre, apellidos, sexo y fecha de nacimiento (el paso de domicilio también
  se guarda).
- Al iniciar sesión con esa cuenta, `construirPersonaDesdeCuenta` deriva la
  persona demo: nombre, **edad calculada desde la fecha de nacimiento** y
  **perfil por edad** (`menor_tutor` <18, `mayor_asistido` >60,
  `adulto_activo`), de modo que el gating de cuestionarios funciona igual que
  con las personas del catálogo.
- El registro **no redirige automáticamente**: termina en la pantalla de éxito
  existente con botón "Ir a inicio de sesión" (comportamiento previo
  conservado). Con la cuenta persistida, ese login ahora sí funciona.

## Cambios técnicos implementados

1. **Hub como modal** (`ModalDemoHub` en `Autenticacion.jsx`): el botón
   "Iniciar demo" abre el modal con las tres tarjetas sobre la pantalla
   actual (portal + cierre por ×/Escape); cada tarjeta cierra el modal y
   navega a su destino (selector de personas, login demo o registro).
2. **Persistencia del registro** en `resolverRutaDemo` (`apiClient.js`): el
   adaptador demo reenvía el body (`post(ruta, datos)`) y los pasos
   `registro/`, `guardar-curp` y `guardar-direccion` acumulan la cuenta en
   `cuentaDemo`.
3. **Login con cuenta local** en `iniciarSesion` (`auth.js`): valida (a)
   credenciales env → persona demo, o (b) credenciales de `cuentaDemo` →
   sesión con identidad derivada.
4. **Identidad derivada** en `demo.config.js`: `construirPersonaDesdeCuenta`
   genera la persona (nombre, edad por fecha de nacimiento, perfil por edad,
   sexo) y `obtenerPerfilDemo()` reemplaza a la constante `DEMO_PERFIL` para
   reflejar la persona activa en runtime.

### Bug corregido durante la implementación

El matcheo de rutas `coincide(["registro/"])` coincidía con **toda** URL de
preregistro (porque `preregistro/` contiene `registro/`), así que los pasos
`guardar-curp`/`guardar-direccion` caían en la rama de creación de cuenta y
pisaban la cuenta con `{}`. Se corrigió matcheando solo el final exacto de la
URL (`url.endsWith("registro/")`).

## Decisiones de diseño pendientes

| Pregunta | Decisión |
|---|---|
| Registro demo: ¿flujo completo o simplificado? | **Flujo completo real** (reuso de pantallas; cero vistas nuevas). Pendiente opcional: mini-formulario como acceso rápido |
| ¿La cuenta local persiste entre sesiones demo? | **Sí, persiste** en `localStorage` (`cuentaDemo`). Pendiente: botón "Restablecer demo" para limpiarla |
| ¿Mantener el atajo directo a perfiles de prueba? | **Sí** — tarjeta destacada en el hub + enlace desde el login demo |
| ¿Una sola cuenta local o varias? | **Una sola** (sobrescribe). Lista queda como extensión futura |
| Contraseña en localStorage | En claro, **documentado**: demo offline con token sin firma, aceptable para vitrina |

## Alcance

- Entrada al modo demo y su hub (login local + registro persistente).
- Persistencia local de la cuenta registrada y validación de sesión contra ella.
- Reutilización total de `VistaSeleccionDemo` y del flujo de preregistro real.

## Fuera de alcance

- Cambios al modo real (no demo): el flujo con backend queda intacto.
- Seguridad real: la contraseña local y el token demo son representativos, sin
  firma ni cifrado (propio de una vitrina offline).
- Catálogo de personas demo: se mantiene tal cual.

## Referencias

- Estado actual del modo demo: `docs/features/demo.md`
- Perfiles y credenciales demo: `src/config/demo.config.js`
- Validación de sesión demo: `src/services/auth.js` (`iniciarSesion`)
- Resolución offline de endpoints (incluye preregistro): `src/services/apiClient.js` (`resolverRutaDemo`)
- Máquina de estados de autenticación: `src/features/autenticacion/Autenticacion.jsx`
- Selector de personas: `src/features/autenticacion/vistas/VistaSeleccionDemo.jsx`
- Derivación de perfil por edad: `src/utils/profile.js`
