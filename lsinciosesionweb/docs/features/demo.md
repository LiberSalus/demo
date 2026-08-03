# Feature: Modo demo offline

## Objetivo

Permitir recorrer la plataforma completa sin depender de un backend conectado. El objetivo es ofrecer una vitrina funcional y un entorno de maquetado donde se pueda probar el panel, las vistas y los flujos principales con datos de ejemplo, entrando con un solo clic.

## Necesidad (por qué existe)

- Probar y exponer el producto sin un ambiente real disponible.
- Dar una base para maquetado y demostraciones de venta.
- Aislar la prueba funcional del estado del backend y de las credenciales de producción.

## Alcance (qué pretende)

- Un flag de entorno `VITE_DEMO` que activa o desactiva el modo.
- Login mediante credenciales definidas en el entorno y un botón "Entrar en modo demo" en la pantalla de inicio de sesion.
- Operación totalmente offline de la app en modo demo: sesion, home, noticias, perfil y el flujo de registro resuelven con datos locales.
- Las metricas siguen funcionando con datos locales (no dependian del backend).
- Mantener el mismo interfaz de datos en los endpoints conocidos, para que las pantallas no cambien de contrato.

## Fuera de alcance (qué no pretende)

- No sustituir el backend real ni validar credenciales de produccion.
- No ofrecer seguridad real: el token demo es representativo y sin firma.
- No persistir datos mas alla de la sesion (los datos de registro "demo" viven en localStorage).
- No garantizar fidelidad de los datos de ejemplo frente a los reales del servicio.

## Configuracion esperada

- `VITE_DEMO=true|false`: habilita o deshabilita el modo.
- `VITE_DEMO_USER`: correo del usuario demo (default proporcionado en codigo).
- `VITE_DEMO_PASSWORD`: contrasena del usuario demo (default proporcionado en codigo).

Estas variables se hornean al momento de compilar: ni el usuario ni la app pueden cambiarlas en tiempo de ejecucion sin un rebuild.

## Limitaciones y notas

- Las variables de entorno son inmutables en runtime; por eso la intencion de "escribir" sobre ellas (p. ej. al registrar un usuario demo) se resuelve persistiendo en localStorage durante la sesion.
- El "refresh" y el "logout" del modo demo son locales y no llaman a ningun servicio.

## Pendientes / ideas

- Opcional: activar el modo demo por query param (`?demo=1`) sin necesidad de recompilar.
- Ampliar el catalogo de datos de ejemplo cuando se agreguen modulos o secciones nuevas.
- Confirmar si en demos de venta se quiere precargar metricas de ejemplo junto con la sesion.