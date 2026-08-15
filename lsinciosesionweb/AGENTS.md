# AGENTS.md

Compact work guide for `lsinciosesionweb` project.

## Forma de trabajar

- Read this file before each task.
- Small, verifiable changes; short commits only when user authorizes.
- Don't delete legacy if in doubt: move to `afuera/` preserving relative path.
- Don't revert user changes.
- Run `npm run build` after changes to active code or assets.

## Code rules

- **User-facing docs**: Spanish, clear and friendly tone
- **Dev docs & code comments**: English, compact, only when needed for context
- Function names: Clear English names (e.g., `exportHtml`, `extractColors`)
- Code comments: Minimal, only when logic is unclear without context
- **SOLID principles**: Apply for production code (src/)
  - **S**ingle Responsibility: One function/component = one job
  - **O**pen/Closed: Open for extension, closed for modification
  - **L**iskov Substitution: Subtypes must be substitutable
  - **I**nterface Segregation: Small, focused interfaces
  - **D**ependency Inversion: Depend on abstractions, not concretions
- **DRY** (Don't Repeat Yourself): Extract duplication, but avoid over-abstraction
- **Clean code**: Modular, testable, scalable, readable
- "No over-refactoring" means: don't change working code without clear value; not "write messy code"
- Reuse components only if real duplication, avoid premature abstraction.
- Module CSS styles if pattern already exists; imports with `@/` alias.
- Order: structure -> behavior -> styles.

## Architecture

- Routes: `src/routes/index.jsx`; constants in `src/config/routes.jsx`.
- Private layout: `src/Layout/Principal.jsx`.
- `src/components/Header` (header, sidebar, profile card) and `src/components/Footer`.
- New modules: `src/features/autenticacion` and `src/features/metricas`.
- `src/pages/Inicio`: dashboard, calendar, health cards, appointments, medications, news.
- `src/shared/assets`: shared assets (e.g., `usuario-default.png`).
- `afuera/`: backup of removed pieces from active tree.

## Decisions

- Metrics in `src/features/metricas`: config in `config/metricas.config.js` and `config/areas.config.js`, services in `services/`, utils in `utils/`. FC, pressure, oxygen and glucose connected; records in `features/metricas/registros`. New metric: metadata -> view -> summary/start.
- Legacy moves to `afuera/`; don't bring back old versions if new one exists.
- `Any`, `Monitor` and `Franky` use `PaginaEnConstruccion`; placeholder routes alive while design/product defines screens.
- Questionnaires preserved for now (resume later).

## Session & Profile

- `src/services/auth.js`: auth, decode-token, refresh, logout. `src/services/perfil.js`: photo.
- `src/hooks/useSesionActiva.js` centralizes active session.
- Backend-dependent data always with clear fallback.

## Mini-skill: Mermaid + drawio (questionnaires)

Source: `docs/historia_clinica/questionnaires/index.DEMO_quewstionnaire.drawio` (17 pages); output `.mmd` in `mermaid/` (index: `index.md`). Tab-by-tab manual conversion, no generator scripts; python only for read-only inspection of `<mxCell>` cells and XML edges.

- Approved pattern: one node per item with statement + numbered options with value (`A.1.1 Never (0)`); unique sequential chain between items, one arrow per line (`A.1 -> D.1 -> A.2 -> ...`); one `{tab}-review.md` per questionnaire with Markdown table `Score | Interpretation`.
- Solved issues: `%%` comments before `flowchart LR` break parsing (declare `flowchart` first); original drawio has wrong labels (A.2 -> "3.2/3.3/3.4", D.2.1 -> "4.1.") corrected and noted in `%%`.
- Be faithful to drawio: values and connections read from real XML (value nodes + edges), not assumed from clinical standard; if drawio contradicts standard, follow drawio unless user decides otherwise, note in `%%`/review.
- Audit arrows/connections: don't rely only on item count; verify one-arrow-per-line chain and, in rendered SVG, count `marker-end` and `x` order. Watch for conditional flows and duplicate labels in drawio (two options with same label) that lose connections.
- Validate with `npx --yes @mermaid-js/mermaid-cli@10 -p <config-no-sandbox> -i X.mmd -o X.svg`; to verify visual order, read node `x` coordinates from SVG.

## Skill: `.pen` files (pen.dev)

- pen.dev designs in `docs/pen.dev/`; JSON format `version 2.17` (object tree with `id`/`type`).
- Full format and ops guide: `.agents/workflow/pen-dev-skill.md`.
- Inspect/edit with `node tools/pen/pen.mjs` (capture, screens, summary, tree, find, text, typography, inspect, palette, validate, components, export, edit). Don't read full `.pen` files (2-16 MB).
- MCP native connection active for Antigravity in `~/.gemini/antigravity/mcp_config.json` pointing to `mcp-server-linux-x64` binary from `@pen.dev/cli` (installed with `npm install -g @pen.dev/cli` following `docs.pencil.dev/for-developers/pen-cli`) using `-app desktop` flag.

## Pending

- Partial cleanups with context, no blind mass deletions.
- Password recovery when backend delivers services.
- Review `tmp/`, `tools/`, `docs/` and `integraciones/` only with context.
- Zustand only if data tree really needs it.

## Useful commands

```bash
npm run build
git status --short
rg "text-to-search" src
rg --files src
```

## Move to `afuera/`

Move if: no active imports/references; old version replaced by new; reference doc/asset without runtime; user confirms.
Don't move if: belongs to pending questionnaires; in active routes; active asset for Inicio/Header/Footer/Login/metrics; just looks old without verification.
