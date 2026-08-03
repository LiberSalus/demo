# Documentacion de lsinciosesionweb

Mapa de la documentacion del proyecto, organizada por tipo de documento.

## Estructura

```txt
docs/
  README.md
  arquitectura/   # decisions y configuracion tecnica
  features/       # capacidades del producto (necesidad, alcance, pendientes)
  inventarios/    # auditorias y estado del arbol
  wireframes/     # material de referencia visual de diseno
```

## Indice

### arquitectura/

- **configuracion-api-local-produccion** — como se configura el proyecto para apuntar a API local o de produccion.

### features/

- **demo** — modo demo offline: entrar al panel sin backend con un clic y datos de ejemplo.
- **login-integracion** — plan de integracion del flujo de login.
- **metricas-v2** — arquitectura y migracion de las metricas a su version nueva.

### inventarios/

- **assets-duplicados** — auditoria de assets repetidos en el arbol.
- **estilos-inicio** — auditoria de estilos de la pantalla de inicio.
- **iconos-repetidos** — auditoria de iconos duplicados.

### wireframes/

- **LiberSalus 2.0Inicio** — referencias visuales de la pantalla de inicio.
- **LiberSalus 2.0Login** — referencias visuales del flujo de login.

## Criterio para saber donde va un documento

- Si describe una **capacidad o flujo del producto** → `features/`.
- Si describe **detalles tecnicos de infraestructura/configuracion** → `arquitectura/`.
- Si es una **auditoria puntual del estado** → `inventarios/`.
- Si es **material de diseno o referencia visual** → `wireframes/`.