# Cloud CRM MCP project

This is the GitHub repository [dsactivi-2/JSI_MCP](https://github.com/dsactivi-2/JSI_MCP).
The hosted read server is [https://calm-forge-hk9rc.run.mcp-use.com/mcp](https://calm-forge-hk9rc.run.mcp-use.com/mcp).
Database passwords, tokens, and `node_modules` are not included.

This repository contains the existing read-only `candidate-search` plugin, a
downloaded Cloudflare Worker snapshot, a TypeScript MCP server workspace, and
the approved plan for the broader Cloud CRM MCP application.

The folder name is MCP Plugin 2. The installable package remains candidate-search. The Linear tracker is https://linear.app/activi/project/lena-1333951b31fb. Its current title, Lena, was rejected on 5 October 2026 and is not the product name. Start with the [documentation index](docs/README.md), [handover](docs/memory.md), and [open-work roadmap](docs/open-work.md).

## Layout

- `candidate-search/plugin.json` — portable package identity and skill discovery.
- `candidate-search/.codex-plugin/plugin.json` — Codex beta manifest and presentation metadata.
- `candidate-search/.mcp.json` — Manufact server address. It stores no token.
- `candidate-search/skills/crm-kandidatensuche/` — workflow, UI metadata, privacy rules, and tool contract.
- `candidate-search/tests/evals.json` — activation and safety evaluation cases.
- `candidate-search/mcp/crm_search_guide.{md,json}` — prepared Worker guide update; these files are not loaded or deployed by `.mcp.json`.
- `scripts/validate_package.py` — repeatable local consistency checks, with no CRM calls.
- `server/` — older local JavaScript workshop and product specification. It is not the hosted server.
- `cloud-crm-mcp/` — the TypeScript mcp-use server hosted on Manufact. Online and connected to the existing MySQL database. One count was checked on 6 October 2026.
- `worker-source/` — downloaded old Worker bundle, about 3.8 MB of JavaScript. Evidence only. It is why GitHub's language bar is mostly JavaScript.
- `.agents/skills/` — general coding skills. They are not CRM tools and not telephone agents.
- `docs/` — current context, historical audits, roadmap, documentation index, and change evidence.

## Current server

The hosted server is https://calm-forge-hk9rc.run.mcp-use.com/mcp. Login is WorkOS. The database password is not in this repository. Lists return 50 rows per page. A count returns the full number. Search rows include the birth date, and the EU-citizen filter is enabled. Free SQL is registered but WorkOS does not currently grant `sql:read`, so `crm_query` can return HTTP 403. Own screens, scoring, writes, and ranking are later phases and are not built.

The shared skill is `cloud-crm-mcp/skills/crm-kandidatensuche/SKILL.md`. `agents/openai.yaml` is only an OpenAI hint. Connecting does not install the skill into ChatGPT, Grok, or Codex.

The old package notes for version 0.1.0-beta.2 remain in [docs/changes.md](docs/changes.md). They are not a second server.

## Login

The live server uses WorkOS. Do not put a token in a URL or in Git. `candidate-search/.mcp.json` stores only the Manufact address. The local Inspector script under `server/scripts/` still names the older `CRM_CANDIDATE_MCP_TOKEN`. That script is for the old workshop.

## Security prerequisite

The packaged MCP URL must never contain a token, password, or API key. The live server uses WorkOS. Enforce authorization in every handler.

## Validate

```powershell
python .\scripts\validate_package.py .\candidate-search
python "$env:USERPROFILE\.codex\skills\.system\plugin-creator\scripts\validate_plugin.py" .\candidate-search
python "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" .\candidate-search\skills\crm-kandidatensuche
```

The plugin-creator validator is optional if that system skill is not installed. `tests/evals.json` records expected cases. Its presence is not evidence that every case has been executed. Do not use real candidate rows as fixtures.

## Current implementation versus planned scope

The deployed server is the Manufact read server, not the old Worker. Phase 1 is that read server. Own screens, scoring, writes/export/import, and ranking/photos/biometrics are included in later phases and are not built. The scoring engine is not chosen. Nothing in the roadmap is implemented until its server tool, authorization, and check exist.
