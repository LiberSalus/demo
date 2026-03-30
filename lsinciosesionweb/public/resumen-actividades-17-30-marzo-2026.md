## Resumen de actividades
### Del 17 al 30 de marzo de 2026

### 17 de marzo
- Se limpió y unificó el comportamiento visual de los `select` en formularios de calendario.
- Se ajustaron overlays de `Presentación`, `Hora de inicio`, `Patrón del tratamiento`, `Especialidad`, `Horario` y `Tipo de cita`.
- Se corrigieron capas (`z-index`) para evitar que los menús pisaran otros campos al abrirse.

### 18 de marzo
- Se mejoró el formulario de `Cita médica`:
  - overlay de selects
  - anchos de `Horario` y `Tipo de cita`
  - textos largos de horarios ocupados
  - ajustes de placeholders y tipografía
- Se refinó el comportamiento visual de los menús desplegables en móvil.

### 19 de marzo
- Se ajustó el formulario de `Medicamento` para distintos patrones de tratamiento.
- `Cada cierto número de días` quedó con layout y lógica propia:
  - `Duración`
  - `Cada`
  - `Hora de inicio`
  - cálculo interno de fechas
- `Toma diaria permanente` quedó con:
  - `Duración` fija como `Diario`
  - `Frecuencia`
  - `Hora de inicio`
- Se estabilizó la altura del contenedor derecho del modal para evitar brincos.

### 20 de marzo
- Se corrigió el scroll visual en la agenda del calendario para que el último elemento se vea completo.
- Se normalizaron etiquetas, colores y paddings de encabezados en el formulario de medicamentos.
- Se aplicaron colores y jerarquías visuales en opciones de `Patrón del tratamiento`.

### 21 de marzo
- Se inició la estrategia responsive del módulo de calendario desde `360px`.
- Se adaptaron:
  - modal
  - panel izquierdo
  - formulario de cita médica
  - formulario de medicamento
- Se compactó el switch `Medicamento / Cita médica`.
- Se ajustó el panel vacío de agenda y el ícono de estado sin citas.

### 22 de marzo
- Se normalizó la base responsive del calendario y los formularios.
- Se revisaron tipografías, gaps, tarjetas y alineaciones en móvil y tablet.
- Se resolvió el problema de `Select` de MUI en móvil cuando el menú se reposicionaba y pisaba campos.

### 23 de marzo
- Se creó `AdaptiveSelect.jsx` como solución reusable.
- Se migraron a `AdaptiveSelect`:
  - `Especialidad`
  - `Horario`
  - `Tipo de cita`
  - `Presentación`
  - `Patrón del tratamiento`
  - `Hora de inicio`
  - `Frecuencia`
- Se agregó:
  - apertura arriba/abajo
  - overlay controlado
  - animación suave
  - navegación con teclado
  - accesibilidad base
  - foco visual refinado

### 24 de marzo
- Se limpió código sobrante relacionado con selects anteriores.
- Se eliminaron utilidades ya no usadas y se dejó la nueva base en `AdaptiveSelect`.
- Se dejaron comentarios simples de propósito en archivos clave del calendario.

### 25 de marzo
- Se comenzó el trabajo responsive fuerte de `Inicio`.
- Se ajustó el layout general y se corrigieron anchos, márgenes y centrado del `main`, `header` y `footer`.
- Se trabajó el contenedor `cntMono`:
  - posición del mono
  - saludo
  - cuadro decorativo
  - mancha de fondo
  - `TarjetaPie`
  - dona/medidor
  - `TarjetaLogro`

### 26 de marzo
- Se separaron comportamientos por breakpoints:
  - `360–460`
  - `461–768`
  - `769–1024`
  - `1025+`
- Se ajustaron:
  - `TarjetaPie`
  - `TarjetaLogro`
  - `ProgCora`
  - disposición de `cntCora`
- Se migró composición de `grid` a `flex` en `Inicio`, según criterio de implementación.

### 27 de marzo
- Se corrigió el contenedor de agenda en `Inicio`.
- Se ajustó el calendario de inicio:
  - tamaño
  - estructura en móvil
  - centrado de años seleccionados
  - alineación del `yearButton`
- Se mejoró el carrusel de medicamentos para que una sola tarjeta se vea centrada.
- Se afinó el menú responsive del header y colores del texto en móvil.

### 28 de marzo
- Se agregaron sonidos de alerta para citas y medicamentos.
- Se integró la lógica de disparo según hora de recordatorio y hora exacta.
- Se dejó contemplado el soporte `mp3/ogg` y el desbloqueo de audio tras interacción del usuario.
- Se conectó la campana del header con:
  - agitación
  - punto de alerta
  - repetición cíclica
  - limpieza al atender la alerta

### 29 de marzo
- Se agregó el popover de alertas de la campana.
- Se integraron iconos diferenciados:
  - medicamento
  - cita presencial
  - cita en línea
- Se refinó la animación y el pulso del punto de notificación.
- Se siguió afinando responsive de módulos secundarios de `Inicio`.

### 30 de marzo
- Se adaptó la navegación de métricas de salud:
  - `<=460`: control tipo `select`
  - `>460`: navegación en `flex`
- Se normalizaron tabs de gráficas para:
  - `Presión arterial`
  - `Frecuencia cardiaca`
  - `Oxigenación`
  - `Glucosa`
  - quitando `Día` y dejando `Semana / Mes / Año`
- Se refinó el modal de personalización de `TarjetaSalud` en móvil:
  - cierre
  - placeholders de indicadores activos
  - catálogo en dos columnas
  - tarjetas internas horizontales
- Se ajustó el menú lateral y el menú del header con transiciones suaves.

### Resultado general del periodo
- Se consolidó una base visual y responsive mucho más estable.
- Se normalizó el patrón reusable de selects adaptativos.
- Se avanzó fuerte en experiencia móvil de `Inicio` y `Calendario`.
- Se incorporó un sistema funcional de alertas sonoras y visuales.
- Se dejaron varios componentes listos para futura conexión con backend.
