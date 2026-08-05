# Historia clínica — Cuestionarios (Mermaid)

Conversión tab por tab del diagrama original `index.DEMO_quewstionnaire.drawio`
(17 páginas) a archivos **Mermaid** (`.mmd`) individuales en `snake_case`.
Cada `.mmd` se escribió a mano, interpretando el contenido del drawio (no se
utilizó script generador) para no perder detalles ni comentarios.

## Índice

### Formularios estructurales

- [`a.mmd`](./a.mmd) — **A. REGISTRO** (datos del tutor/responsable, datos
  generales del paciente, contacto de emergencia). `flowchart TD`.
- [`b.mmd`](./b.mmd) — **B. PADECIMIENTO ACTUAL** (_motivo 3.0_, evolución,
  caracterización, estudios previos). `flowchart TD`.
- [`c.mmd`](./c.mmd) — **C. ANTECEDENTES PERSONALES PATOLÓGICOS**
  (checklist por sistemas, tabaco/exp/vape, alcohol, drogas, alergias,
  cirugías, transfusión, donación, lesiones, hospitalización). `flowchart TD`.

### Rúbricas de derivación

- [`anexo_c.mmd`](./anexo_c.mmd) — **ANEXO C** mapeo
  condición → cuestionario habilitado (tablas de Psychología y Nutrición).
  `flowchart LR`.
- [`anexo_d.mmd`](./anexo_d.mmd) — **ANEXO D** deriva a los cuestionarios de
  Psicología según respuestas (ZARIT-CBI, SF-12, HADS, GAD-7, CTH, DTS,
  SPIN, TAS-20, CDI/GDS/PHQ-9 por edad, EDAH/ASRS, DAI-10, EAG).
  `flowchart TD`.

### Instrumentos psicométricos

Cada cuestionario tiene su archivo de revisión `*-review.md` con la tabla
`Puntuación | Interpretación`.

- [`cuestionario_hads.mmd`](./cuestionario_hads.mmd) — HADS (14 ítems A/D).
  [`review`](./cuestionario_hads-review.md).
- [`cuestionario_cdi.mmd`](./cuestionario_cdi.mmd) — CDI (27 ítems, 0-2).
  [`review`](./cuestionario_cdi-review.md).
- [`cuestionario_gds.mmd`](./cuestionario_gds.mmd) — GDS-15 (Sí/No, 0-14).
  [`review`](./cuestionario_gds-review.md).
- [`cuestionario_phq.mmd`](./cuestionario_phq.mmd) — PHQ-9 (9 ítems, 0-27).
  [`review`](./cuestionario_phq-review.md).
- [`cuestionario_gad.mmd`](./cuestionario_gad.mmd) — GAD-7 (7 ítems, 0-21).
  [`review`](./cuestionario_gad-review.md).
- [`cuestionario_cth.mmd`](./cuestionario_cth.mmd) — CTH / MDQ bipolar (Sí/No;
  flujo condicional 14→Nota2→15→16). [`review`](./cuestionario_cth-review.md).
- [`cuestionario_edah.mmd`](./cuestionario_edah.mmd) — EDAH (20 ítems, subescalas H/DA/TC/DAH).
  [`review`](./cuestionario_edah-review.md).
- [`cuestionario_asrs.mmd`](./cuestionario_asrs.mmd) — ASRS-V1.1 (18 ítems,
  primera parte detecta TDAH). [`review`](./cuestionario_asrs-review.md).
- [`cuestionario_dts.mmd`](./cuestionario_dts.mmd) — DTS Davidson Trauma Scale (18
  ítems con frecuencia y gravedad 0-4; total 0-136; el ítem 13 duplica el 12).
  [`review`](./cuestionario_dts-review.md).
- [`cuestionario_spin.mmd`](./cuestionario_spin.mmd) — SPIN (17 ítems, 0-68).
  [`review`](./cuestionario_spin-review.md).
- [`cuestionario_tas.mmd`](./cuestionario_tas.mmd) — TAS-20 (19 ítems visibles;
  ítems 4, 5, 17, 18 invertidos). [`review`](./cuestionario_tas-review.md).
- [`cuestionario_eag.mmd`](./cuestionario_eag.mmd) — EAG (12 ítems visibles; rango
  rúbrica 0-77; los ítems 7 y 8 duplican el enunciado).
  [`review`](./cuestionario_eag-review.md).

## Notas

- Cada `.mmd` contiene un bloque inicial de comentarios `%%` con la fuente y
  las convenciones (opciones, valores, escalas invertidas).
- Los textos largos del drawio se conservan completos como comentarios `%%`
  cuando se acortaron para legibilidad del render.
- Los `TODO` del original (p. ej. "FALTA PONER GRUPO ÉTNICO" en A) se mantienen
  resaltados con `classDef todo`.
- Los lazos de "registrar otra lesión / cirugía / hospitalización" del bloque C
  se conservan explícitos.

## Render

Para validar localmente con Mermaid CLI:

```bash
npx @mermaid-js/mermaid-cli -i <archivo>.mmd -o <archivo>.png
```