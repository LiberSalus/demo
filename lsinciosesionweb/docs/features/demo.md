# Feature: Modo demo offline

## Objetivo

Permitir recorrer la plataforma completa sin depender de un backend conectado. El objetivo es ofrecer una vitrina funcional y un entorno de maquetado donde se pueda probar el panel, las vistas y los flujos principales con datos de ejemplo.

## Necesidad (por qué existe)

- Probar y exponer el producto sin un ambiente real disponible.
- Dar una base para maquetado y demostraciones de venta.
- Aislar la prueba funcional del estado del backend y de las credenciales de producción.

## Alcance (qué pretende)

- Un flag de entorno `VITE_DEMO` que activa o desactiva el modo.
- Entrada desde el login mediante un botón "Modo demo" que abre un selector de **personas demo** (María, Juan, Rosa y Sofía), cada una con su perfil completo para personalizar la interfaz y cubrir los tres perfiles de salud de la plataforma.
- Operación totalmente offline de la app en modo demo: sesión, home, noticias, perfil y el flujo de registro resuelven con datos locales.
- Las métricas siguen funcionando con datos locales (no dependían del backend).
- Mantener el mismo interfaz de datos en los endpoints conocidos, para que las pantallas no cambien de contrato.

## Flujo de entrada

1. El usuario abre el login y pulsa el botón **"Modo demo"** (solo visible cuando `VITE_DEMO=true`).
2. Se abre la pantalla de selección de persona (`VistaSeleccionDemo`) con las opciones de `PERSONAS_DEMO`.
3. Al elegir una persona, se crea la sesión demo local con ese perfil y se entra al panel.
4. Dentro del panel, una **píldora flotante "DEMO MODE"** (arriba a la derecha, `IndicadorDemo`) permite abrir un modal con la opción **"Salir del modo demo"**, que cierra la sesión y regresa al login.

## Personas demo

Definidas en `src/config/demo.config.js` (`PERSONAS_DEMO`). Cada persona define la variante visual (avatar y mancha) del inicio y los datos del perfil:

| Clave | Nombre | Sexo | Edad | Peso | Sangre | Estatura | Perfil |
|---|---|---|---|---|---|---|---|
| `mujer` | María Demo | mujer | 34 | 62 kg | O+ | 163 cm | `adulto_activo` |
| `hombre` | Juan Demo | hombre | 50 | 90 kg | A+ | 177 cm | `adulto_activo` |
| `mayor` | Rosa Demo | mujer | 68 | 58 kg | B+ | 155 cm | `mayor_asistido` |
| `menor` | Sofía Demo | mujer | 10 | 35 kg | A- | 138 cm | `menor_tutor` |

Las tres columnas de perfil cubren los `profiles` que la plataforma usa para filtrar
cuestionarios (`adulto_activo`, `mayor_asistido`, `menor_tutor`): con Rosa se pueden
recorrer instrumentos geriátricos (p. ej. GDS >60) y con Sofía los pediátricos
(p. ej. CDI/EDAH), mientras María y Juan cubren los de adultos.

La persona activa alimenta el saludo, el avatar, la mancha, el resumen de salud del
inicio y el `perfil`/`edad` que guarda la sesión (clave `perfil_min`). Al cerrar sesión
demo se regresa a la primera persona para que la siguiente sesión no arrastre la
selección anterior.

## Configuración esperada

- `VITE_DEMO=true|false`: habilita o deshabilita el modo (por defecto `false`).
- `VITE_DEMO_USER`: correo del usuario demo. Default: `demo@libersalus.com`.
- `VITE_DEMO_PASSWORD`: contraseña del usuario demo. Default: `Demo1234`.

Estas variables se hornean al momento de compilar: ni el usuario ni la app pueden cambiarlas en tiempo de ejecución sin un rebuild.

## Cómo funciona por dentro

- `src/config/demo.config.js`: catálogo central (credenciales, personas, token demo, respuestas de login y home, noticias de ejemplo).
- `src/services/apiClient.js`: `crearApiDemo()` reemplaza la instancia axios por un adaptador con la misma interfaz `{ data }`. `resolverRutaDemo()` responde a los endpoints conocidos:
  - `decode-token`, `sesion/auth/token`, `refresh-token`, `logout`, `paciente/home`, `medico/home`, `getListNews`, `foto/perfil`.
  - Flujo de preregistro: `enviar-codigo-correo`, `validar-correo`, `reenviar-codigo`, `registro/`, `guardar-curp`, `guardar-direccion`, `buscar-correo` (resuelven con `{ id: 9001 }` sin tocar red).
- `src/services/auth.js`: `iniciarSesion` valida las credenciales demo y guarda la sesión local (incluye `perfil` y `edad` en `perfil_min`); `cerrarSesion` limpia la sesión y restaura la primera persona.
- `src/utils/profile.js`: `getCurrentProfile` resuelve el perfil activo en este orden: `localStorage.user.profile` → `perfil_min.profile` → derivación por `perfil_min.edad` (menor <18, mayor >60) → default `adulto_activo`.
- `src/components/IndicadorDemo/IndicadorDemo.jsx`: píldora flotante y modal de salida, montado desde `Layout/Principal.jsx`.
- `src/features/autenticacion/vistas/VistaSeleccionDemo.jsx`: selector de persona previo al panel.

## Persistencia real (qué se guarda y qué no)

- **Sesión**: `localStorage` guarda `access_token`, `auth_ready` y `perfil_min`. El logout demo los elimina.
- **Registro demo**: el flujo de preregistro resuelve en local pero **no persiste los datos del usuario registrado** (no se guarda CURP, dirección ni cuenta creada).
- **Sí persisten entre sesiones** (claves propias del frontend): los registros diarios de métricas (frecuencia cardiaca, presión arterial, oxigenación, glucosa, recordatorios) y las citas/medicamentos del calendario de Inicio. No se limpian al salir del modo demo.

## Fuera de alcance (qué no pretende)

- No sustituir el backend real ni validar credenciales de producción.
- No ofrecer seguridad real: el token demo es representativo y sin firma.
- No garantizar fidelidad de los datos de ejemplo frente a los reales del servicio.

## Limitaciones y notas

- Las variables de entorno son inmutables en runtime: no se pueden "escribir" sobre ellas desde la app.
- El "refresh" y el "logout" del modo demo son locales y no llaman a ningún servicio.
- El login con credenciales demo valida contra `VITE_DEMO_USER`/`VITE_DEMO_PASSWORD` (o sus defaults); si no coinciden, se rechaza con "Credenciales demo inválidas".
- Al entrar en modo demo se muestra una notificación nativa de bienvenida.

## Pendientes / ideas

- Opcional: activar el modo demo por query param (`?demo=1`) sin necesidad de recompilar.
- Ampliar el catálogo de datos de ejemplo cuando se agreguen módulos o secciones nuevas.
- Confirmar si en demos de venta se quiere precargar métricas de ejemplo junto con la sesión.
