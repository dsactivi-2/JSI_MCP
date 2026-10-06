# Cloud CRM MCP project

This is the GitHub repository [dsactivi-2/JSI_MCP](https://github.com/dsactivi-2/JSI_MCP).
The hosted read server is [https://calm-forge-hk9rc.run.mcp-use.com/mcp](https://calm-forge-hk9rc.run.mcp-use.com/mcp).
Database passwords, tokens, and `node_modules` are not included.

The folder on this Mac is `/Users/activi/Downloads/MCP Plugin 2`. The Linear tracker is https://linear.app/activi/project/lena-1333951b31fb. Its title, Lena, was rejected on 5 October 2026 and is not the product name. Start with the [handover](docs/memory.md), the [documentation index](docs/README.md), and the [roadmap](docs/open-work.md).

## What is in this repository

- `cloud-crm-mcp/` — the TypeScript server. This is the source that belongs on Manufact.
- `cloud-crm-mcp/skills/crm-kandidatensuche/` — the one shared skill. `SKILL.md` is for every client. `agents/openai.yaml` is only an OpenAI hint.
- `docs/` — the current project facts, the handover, and the approved scope in `docs/SPEC.md`.

The old plugin, the old Cloudflare Worker bundle, the local JavaScript workshop, and the general coding skills are not in this repository. A byte-for-byte copy is on this Mac only:

`/Users/activi/Downloads/JSI_MCP-archiv`

That archive has no GitHub remote. Commit `bc02ddb`.

## Current server

Login is WorkOS. Lists return 50 rows per page. A count returns the full number. Search rows include the birth date, and the EU-citizen filter is enabled. Free SQL is registered, but WorkOS does not currently grant `sql:read`, so `crm_query` can return HTTP 403. Own screens, scoring, writes, and ranking are later phases and are not built.

Connecting does not install the skill into ChatGPT, Grok, or Codex.

## Checks

From `cloud-crm-mcp/`:

```bash
npm test
npm run typecheck
```

These checks do not read a candidate row and do not deploy.

## Scope

Phase 1 is the read server. Later phases are included in [docs/open-work.md](docs/open-work.md) and are not built. The scoring engine is not chosen.
