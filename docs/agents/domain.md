# Domain docs

Status date: 7 October 2026.

Read the current domain before changing this repository. This is one product, not a set of separate contexts.

## Read these first

- `docs/project.md` for the running server, the repository map, and the boundaries.
- `docs/memory.md` before starting a new chat.
- `docs/open-work.md` for the phases and the issue map.
- `docs/SPEC.md` for the approved scope. A named module is not proof that it is built.
- `cloud-crm-mcp/skills/crm-kandidatensuche/` for the search rules the server serves.

## What this repository does not have

There is no `GLOSSARY.md` and no `docs/adr/` directory. Do not create either only because a generic skill expects that layout. The decisions already have IDs in the active docs: `DEC-2026-10-06-mcp-use`, `DEC-2026-10-06-same-database`, and `DEC-2026-10-06-phased-scope`.

If a term is missing, name the gap. Do not invent a second name for a decision that is already written.

## Names to keep

- Product: Cloud CRM MCP.
- Server package: `cloud-crm-mcp`, version 0.1.0.
- Tracker: https://linear.app/activi/project/lena-1333951b31fb. The title Lena was rejected on 5 October 2026. It is not the product name. Do not invent a replacement.
- `candidate-search` and the old Worker are archive and evidence. They are not this server.

## Conflicts

If proposed work contradicts `docs/project.md` or `docs/open-work.md`, stop and name the conflict. Do not override it silently.
