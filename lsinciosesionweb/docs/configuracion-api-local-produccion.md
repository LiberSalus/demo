# Configuracion de API local y produccion

## Objetivo

Mantener el dashboard corriendo en local en `http://localhost:5174` y consumir los servicios reales de LiberSalus sin problemas de CORS ni cookies.

La configuracion validada usa un proxy de Vite durante desarrollo. El navegador llama al mismo origen local y Vite reenvia esas solicitudes al backend real.

## Configuracion validada en local

### `.env.development`

```env
VITE_MOCK_AUTH=0
VITE_API=/api/
VITE_LOGIN_URL=/panel/login
```

`VITE_API=/api/` hace que el frontend llame rutas locales como:

```txt
http://localhost:5174/api/sesion/auth/token
http://localhost:5174/api/sesion/auth/decode-token
http://localhost:5174/api/sesion/auth/paciente/home
```

### `vite.config.js`

```js
server: {
  host: "localhost",
  port: 5174,
  strictPort: false,
  proxy: {
    "/api": {
      target: "https://libersalus.com",
      changeOrigin: true,
      secure: true,
      cookieDomainRewrite: "localhost",
    },
  },
},
```

Con esta configuracion, Vite transforma:

```txt
/api/sesion/auth/decode-token
```

en:

```txt
https://libersalus.com/api/sesion/auth/decode-token
```

El navegador ve la solicitud como `same-origin` porque sale a `localhost:5174`. Esto permite que la cookie de sesion viaje de forma estable en desarrollo.

## Servicios de sesion usados

El frontend integrado usa estos endpoints:

```txt
POST /api/sesion/auth/token
GET  /api/sesion/auth/decode-token
GET  /api/sesion/auth/paciente/home
POST /api/sesion/auth/logout
```

Por indicacion de backend, no se usa:

```txt
GET /api/sesion/auth/me
```

La sincronizacion del perfil se hace con `decode-token` y los datos iniciales del dashboard con `paciente/home`.

## Resultado de pruebas locales

Validado en `localhost:5174`:

- Inicio de sesion correcto.
- Dashboard carga sin redireccionar al login.
- `decode-token` responde `200`.
- `paciente/home` responde `200`.
- Registro de usuario nuevo completo sin fallas.
- Las llamadas salen como `http://localhost:5174/api/...`.
- Ya no aparecen fallos por `/auth/me`.

## Como correr local

Despues de cambiar `.env.development` o `vite.config.js`, reiniciar Vite:

```bash
npm run dev
```

Si Vite ya estaba corriendo, detenerlo y levantarlo otra vez para que tome el proxy.

## Produccion

En produccion no se usa el proxy de Vite porque ese proxy solo existe en el servidor de desarrollo.

Hay dos opciones sanas para produccion:

### Opcion A. Mismo dominio con reverse proxy

Recomendada si el dashboard vive bajo `https://libersalus.com/panel/`.

El servidor productivo debe resolver:

```txt
https://libersalus.com/api/...
```

y reenviarlo internamente al backend correspondiente.

En ese escenario se puede mantener:

```env
VITE_API=/api/
VITE_BASE=/panel/
```

Ventaja: las cookies se mantienen en el mismo dominio y se reducen problemas de CORS.

### Opcion B. API absoluta

Si el frontend se despliega en otro dominio, configurar:

```env
VITE_API=https://libersalus.com/api/
VITE_BASE=/panel/
```

En este caso backend debe permitir correctamente:

- `Access-Control-Allow-Origin` con el dominio exacto del frontend.
- `Access-Control-Allow-Credentials: true`.
- Cookies compatibles con el dominio final.

## Regla practica

- Local: usar `VITE_API=/api/` con proxy de Vite.
- Produccion mismo dominio: preferir `VITE_API=/api/` con reverse proxy real.
- Produccion dominio separado: usar `VITE_API=https://libersalus.com/api/` y configurar CORS/cookies en backend.

## Nota de seguridad

El token principal llega como cookie `HttpOnly`, por lo que JavaScript no debe intentar leerlo directamente. El frontend solo marca la sesion como lista y consulta al backend con cookies usando `withCredentials: true`.

Los datos persistidos en `localStorage` deben mantenerse minimos: estado local de sesion y perfil basico para pintar UI. No guardar contrasenas, documentos, CURP completa ni datos sensibles.
