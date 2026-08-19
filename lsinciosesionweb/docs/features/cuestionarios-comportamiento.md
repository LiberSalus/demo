# Reglas de Comportamiento — Cuestionarios

> Comportamiento esperado de modales, auto-guardado, exportación y bloqueo de edición.

---

## Diagrama de botones y modales por estado

```mermaid
flowchart TD
    subgraph "Estado: En progreso (< 100%)"
        A1["📝 Preguntas: Habilitadas"]
        A2["💾 Guardar: OCULTO"]
        A3["📊 Descargar Excel: OCULTO"]
        A4["🧹 Limpiar: VISIBLE"]
        A5["↩️ Volver → Modal informativo"]
        A6["🔄 Auto-save: Activo cada 2s"]
    end

    subgraph "Estado: Pendiente (100%, sin guardar)"
        B1["📝 Preguntas: Habilitadas"]
        B2["💾 Guardar: VISIBLE"]
        B3["📊 Descargar Excel: OCULTO"]
        B4["🧹 Limpiar: VISIBLE"]
        B5["↩️ Volver → Modal: ¿Guardar ahora?"]
        B6["🎉 Modal automático: ¡Completaste!"]
    end

    subgraph "Estado: Completado (100% + guardado)"
        C1["📝 Preguntas: DESHABILITADAS"]
        C2["💾 Guardar: OCULTO"]
        C3["📊 Descargar Excel: HABILITADO"]
        C4["🧹 Limpiar: OCULTO"]
        C5["↩️ Volver → Navega directo"]
        C6["🔒 Solo lectura"]
    end

    A1 --> B1
    B1 --> C1
```

---

## Diagrama de modales por evento

```mermaid
flowchart TD
    START["👤 Acción del usuario"] --> EVENT{¿Qué hace?}
    
    EVENT -->|"Responde pregunta"| AUTO["💾 Auto-guarda<br/>(debounce 2s)<br/>Toast: Progreso guardado"]
    
    EVENT -->|"Llega a 100%"| M1["🎉 Modal: ¡Completaste!<br/>[Revisar] [Sí, guardar]"]
    M1 -->|Revisar| EDIT["Sigue editando<br/>Badge: Pendiente"]
    M1 -->|Guardar| SAVE["Modal: ¿Estás seguro?<br/>[Revisar] [Sí, guardar]"]
    SAVE -->|Guardar| DONE["Modal: ¡Guardado!<br/>[Continuar]"]
    
    EVENT -->|"Presiona Guardar"| M2["⚠️ Modal: ¿Estás seguro?<br/>No podrás editar<br/>[Revisar] [Sí, guardar]"]
    M2 -->|Revisar| CLOSE["Cierra modal"]
    M2 -->|Guardar| SAVE
    
    EVENT -->|"Volver a área<br/>(con respuestas)"| M3["📋 Modal: ¿Salir?<br/>Progreso se guardará<br/>[Quedarme] [Salir]"]
    M3 -->|Quedarme| STAY["Sigue en cuestionario"]
    M3 -->|Salir| NAV["📁 Navega a área"]
    
    EVENT -->|"Limpiar respuestas"| M4["🧹 Limpia todo<br/>Resetea estado guardado"]
    
    EVENT -->|"Descargar Excel"| M5["📊 Exporta XLSX<br/>Solo si está guardado"]
    
    style AUTO fill:#dbeafe,stroke:#3b82f6
    style M1 fill:#fef3c7,stroke:#f59e0b
    style M2 fill:#fef3c7,stroke:#f59e0b
    style M3 fill:#fee2e2,stroke:#ef4444
    style M4 fill:#f3f4f6,stroke:#9ca3af
    style M5 fill:#d1fae5,stroke:#10b981
    style DONE fill:#d1fae5,stroke:#10b981
```

---

## Diagrama de habilitado/deshabilitado por estado

```mermaid
flowchart LR
    subgraph "En progreso"
        direction TB
        EP_Q["📝 Preguntas"] -->|"✅ Habilitado"| EP_R["Radio/Check habilitados"]
        EP_S["💾 Guardar"] -->|"❌ OCULTO"| EP_SR["No visible"]
        EP_D["📊 Excel"] -->|"❌ OCULTO"| EP_DR["No visible"]
        EP_B["🎯 Badge"] -->|"🔵 En progreso"| EP_BR["amarillo"]
        EP_V["↩️ Volver"] -->|"⚠️ Modal"| EP_VR["Siempre si hay respuestas"]
    end
    
    subgraph "Pendiente"
        direction TB
        PD_Q["📝 Preguntas"] -->|"✅ Habilitado"| PD_R["Radio/Check habilitados"]
        PD_S["💾 Guardar"] -->|"✅ VISIBLE"| PD_SR["Al lado de Limpiar"]
        PD_D["📊 Excel"] -->|"❌ Deshabilitado"| PD_DR["Grayed out"]
        PD_B["🎯 Badge"] -->|"🟠 Pendiente"| PD_BR["naranja"]
        PD_V["↩️ Volver"] -->|"⚠️ Modal"| PD_VR["¿Guardar ahora?"]
    end
    
    subgraph "Completado"
        direction TB
        CO_Q["📝 Preguntas"] -->|"❌ Deshabilitado"| CO_R["Radio/Check disabled"]
        CO_S["💾 Guardar"] -->|"❌ OCULTO"| CO_SR["No visible"]
        CO_D["📊 Excel"] -->|"✅ HABILITADO"| CO_DR["Descarga XLSX"]
        CO_B["🎯 Badge"] -->|"🟢 Completado"| CO_BR["verde"]
        CO_V["↩️ Volver"] -->|"✅ Navega"| CO_VR["Directo a área"]
    end
```

## Estados de un Cuestionario

| Estado | Condición | Badge | ¿Se puede editar? | Botón Guardar | Botón Descargar Excel |
|--------|-----------|-------|-------------------|---------------|----------------------|
| **En progreso** | < 100% respondido | 🔵 `En progreso` | ✅ Sí | ❌ Oculto | ❌ Oculto |
| **Pendiente** | 100% respondido, sin confirmar | 🟠 `Pendiente` | ✅ Sí | ✅ Visible | ❌ Oculto |
| **Completado** | 100% + guardado | 🟢 `Completado` | ❌ Solo lectura | ❌ Oculto | ✅ Visible |

### Badges visuales en las cards

Las cards de cuestionarios en `/cuestionarios/{area}` muestran un badge de estado:

- **`Completado`** → fondo verde `rgba(34, 197, 94, 0.15)`, texto `#166534`
- **`Pendiente`** → fondo naranja `rgba(251, 146, 60, 0.15)`, texto `#c2410c`
- **`En progreso`** → fondo amarillo `rgba(251, 191, 36, 0.15)`, texto `#b45309`
- **`No iniciado`** → fondo gris `rgba(148, 163, 184, 0.15)`, texto `#64748b`
- **`Bloqueado`** → fondo gris oscuro, opacity reducida

---

## Auto-guardado (en progreso)

```mermaid
flowchart TD
    A[👤 Usuario responde una pregunta] --> B[💾 Se guarda automáticamente<br/>debounce 2s]
    B --> C[Toast: ✓ Progreso guardado<br/>automáticamente]
    C --> D{¿Sigue contestando?}
    D -->|Sí| A
    D -->|No / Navega| E[✅ Progreso ya guardado<br/>puede reanudar después]
```

**Reglas:**
- **Cada respuesta** se guarda en localStorage automáticamente.
- Si el usuario cierra la pestaña o navega a otro menú → **no pregunta nada** (ya se guardó).
- Al volver, retoma desde donde se quedó.
- **No aparece** el botón "Guardar respuestas" ni "Descargar Excel" mientras no esté al 100%.

---

## Al completar el 100% (aún sin guardar)

```mermaid
flowchart TD
    A[👤 Responde la última pregunta<br/>100% completado] --> B{Modal: ¡Completaste<br/>tu cuestionario!}
    
    B -->|Revisar respuestas| C[Sigue editando<br/>puede revisar y modificar]
    B -->|Sí, guardar| D[💾 Se guarda y finaliza]
    
    C --> E[Botón Guardar aparece<br/>en panel lateral]
    E --> F{¿Guarda ahora?}
    F -->|Sí| D
    F -->|No| G[Puede seguir editando<br/>o salir sin guardar]
    
    D --> H{Modal: ¡Respuestas<br/>guardadas!}
    H -->|Continuar| I[📁 Navega a<br/>/cuestionarios/area]
```

### Mockup del modal de completado

```
┌─────────────────────────────────────────┐
│  🎉 ¡Completaste tu cuestionario!       │
│                                         │
│  Has respondido todas las preguntas.     │
│  ¿Deseas guardar tus respuestas ahora?  │
│                                         │
│  [Revisar respuestas]  [Sí, guardar]    │
└─────────────────────────────────────────┘
```

---

## Botón "Guardar respuestas" (solo al 100%)

**Visible SOLO cuando:**
- `percent === 100`
- `answeredCount > 0`
- Aún no se ha guardado (no completado)

```mermaid
flowchart TD
    A[👤 Presiona Guardar respuestas] --> B{Modal: ¿Estás seguro<br/>de guardar?}
    
    B -->|Revisar respuestas| C[Cierra modal<br/>puede seguir editando]
    B -->|Sí, guardar| D[💾 Guarda y finaliza]
    
    D --> E{Modal: ¡Respuestas<br/>guardadas!}
    E -->|Continuar| F[📁 Navega a<br/>/cuestionarios/area]
```

### Mockup del modal de confirmar guardar

```
┌─────────────────────────────────────────┐
│  ⚠️ ¿Estás seguro de guardar?           │
│                                         │
│  Al guardar, no podrás editar este      │
│  cuestionario nuevamente.               │
│                                         │
│  Respondiste X de Y preguntas (100%).   │
│                                         │
│  [Revisar respuestas]  [Sí, guardar]    │
└─────────────────────────────────────────┘
```

---

## Al intentar salir sin haber completado el 100%

```mermaid
flowchart TD
    A[👤 Intenta navegar a otro menú] --> B{¿Tiene respuestas?<br/>answeredCount > 0}
    
    B -->|No| C[📁 Navega directamente]
    B -->|Sí| D{Modal: ¿Salir del<br/>cuestionario?}
    
    D -->|Quedarme aquí| E[Sigue en el cuestionario]
    D -->|Salir| F[📁 Navega al destino<br/>progreso ya guardado]
```

**Reglas:**
- **Siempre** muestra el modal si `answeredCount > 0 && !completado` (incluso si el auto-save ya corrió).
- No se pierde ningún progreso (auto-guardado).
- El usuario puede volver a entrar y continuar desde donde se quedó.

### Mockup del modal de salir

```
┌─────────────────────────────────────────┐
│  📋 ¿Salir del cuestionario?            │
│                                         │
│  Tu progreso se guardará automáticamente│
│  y podrás reanudar cuando quieras.      │
│                                         │
│  [Quedarme aquí]  [Salir]               │
└─────────────────────────────────────────┘
```

---

## Al intentar salir habiendo completado el 100% (sin guardar)

```mermaid
flowchart TD
    A[👤 Intenta navegar a otro menú] --> B{¿Completado = 100%<br/>y sin guardar?}
    
    B -->|No| C[📁 Navega directamente]
    B -->|Sí| D{Modal: Tienes respuestas<br/>sin guardar}
    
    D -->|No guardar| E[📁 Navega al destino<br/>puede volver a editar]
    D -->|Sí, guardar| F[💾 Guarda y finaliza]
    
    F --> G[📁 Navega al destino]
```

### Mockup del modal de salir con 100%

```
┌─────────────────────────────────────────┐
│  ⚠️ Tienes respuestas sin guardar        │
│                                         │
│  Completaste el cuestionario pero aún   │
│  no lo has guardado. ¿Deseas guardarlo  │
│  ahora?                                 │
│                                         │
│  Si no guardas, podrás volver a editar  │
│  tus respuestas más tarde.              │
│                                         │
│  [No guardar]  [Sí, guardar]            │
└─────────────────────────────────────────┘
```

---

## Flujo completo de estados

```mermaid
stateDiagram-v2
    [*] --> EnProgreso: Usuario inicia cuestionario
    
    EnProgreso --> EnProgreso: Responde pregunta<br/>auto-guarda cada 2s
    
    EnProgreso --> Pendiente: Responde última pregunta (100%)<br/>Badge: 🟠 Pendiente
    
    Pendiente --> Completado: Guarda respuestas<br/>Badge: 🟢 Completado
    Pendiente --> Pendiente: Revisa / Edita
    
    Completado --> SoloLectura: Cuestionario finalizado
    
    SoloLectura --> [*]
    
    note right of EnProgreso
        • Auto-guardado activo
        • Badge: 🔵 En progreso
        • Sin botón Guardar
        • Sin botón Descargar Excel
        • Al salir modal informativo
    end note
    
    note right of Pendiente
        • Modal de confirmación
        • Badge: 🟠 Pendiente
        • Botón Guardar visible
        • Sin botón Descargar Excel
        • Al salir: "¿Guardar ahora?"
    end note
    
    note right of Completado
        • Solo lectura
        • Badge: 🟢 Completado
        • Botón Descargar Excel habilitado
        • No puede editar
    end note
```

---

## Descarga de Excel / ZIP

| Botón | Dónde | Condición | ¿Qué descarga? |
|-------|-------|-----------|----------------|
| **Descargar Excel** | Dentro del cuestionario | `percent === 100 && !completado` | Solo ese cuestionario |
| **Descargar Excel** | En el área (`/cuestionarios/{area}`) | Solo cuestionarios al 100% | Cuestionarios completados del área |
| **Descargar todo (ZIP)** | Vista principal (`/cuestionarios`) | Solo cuestionarios al 100% | Un .xlsx por cada área con completados |

### Regla general de exportación

> **Solo se exportan cuestionarios al 100% completados y guardados.**  
> Los cuestionarios en progreso **nunca** se incluyen en descargas.

```mermaid
flowchart LR
    subgraph Cuestionario
        A[Verificar percent] --> B{¿100%?}
        B -->|No| C[❌ No exportable]
        B -->|Sí| D[✅ Exportable]
    end
    
    subgraph "Descarga individual"
        D --> E[Botón Descargar Excel<br/>en panel lateral]
    end
    
    subgraph "Descarga por área"
        D --> F[Botón Descargar Excel<br/>en /cuestionarios/area]
    end
    
    subgraph "Descarga ZIP global"
        D --> G[Botón Descargar todo (ZIP)<br/>en /cuestionarios]
    end
```

---

## Resumen de Modales

| Evento | Modal | Acciones |
|--------|-------|----------|
| Completar 100% | "¡Completaste tu cuestionario!" | Revisar / Guardar |
| Guardar (100%) | "¿Estás seguro de guardar?" | Revisar / Guardar |
| Guardado exitoso | "¡Respuestas guardadas!" | Continuar |
| Salir con progreso (< 100%) | "¿Salir del cuestionario?" | Quedarme / Salir |
| Salir con 100% sin guardar | "Tienes respuestas sin guardar" | No guardar / Guardar |
| Volver desde cuestionario con respuestas | "¿Salir del cuestionario?" | Quedarme / Salir |

**Nota:** El botón "Volver a {área}" **siempre** muestra el modal si `answeredCount > 0 && !completado`.

**Todos los modales usan glassmorfismo** (componente `ModalGlass`).

---

## Archivos relacionados

| Archivo | Responsabilidad |
|---------|----------------|
| `src/pages/Cuestionarios/PlantillaQs.jsx` | Lógica de auto-guardado, modales, solo lectura |
| `src/pages/Cuestionarios/PreguntasQs.jsx` | Renderizado de preguntas (solo lectura) |
| `src/pages/Cuestionarios/Run.jsx` | Carga cuestionario y pasa `forceArea` |
| `src/components/ModalGlass/ModalGlass.jsx` | Componente reutilizable de modal |
| `src/pages/Cuestionarios/Area.jsx` | Vista de área, badges de estado, descarga Excel |
| `src/pages/Cuestionarios/Cuestionarios.jsx` | Vista principal, métricas globales, descarga ZIP |
| `src/pages/Cuestionarios/area.module.css` | Estilos de badges (`.completado`, `.pendiente`, etc.) |
| `src/components/Tarjetas/TarjetaCuestionarios/TrjEstadoCuestionario.jsx` | Badge de estado por cuestionario |
| `src/components/Tarjetas/TarjetaCuestionarios/trjEstadoCuestionario.module.css` | Estilos de badges con `data-estado` |
| `src/utils/progreso.js` | `getProgressSummary()` lee `:guardado`, `progressState()` distingue estados |
| `src/utils/exportarExcel.js` | Lógica de exportación Excel/ZIP |
| `src/utils/logicPreg.js` | `storageKeyFor()` usa `key > id > name` para consistencia |
