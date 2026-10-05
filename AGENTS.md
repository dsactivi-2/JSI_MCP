# Repository Guidelines

## Project Structure & Module Organization

The installable plugin lives in `candidate-search/`. Its portable package identity is `plugin.json`; `.codex-plugin/plugin.json` and `.mcp.json` provide the authenticated Codex beta connection. Keep workflow instructions under `skills/crm-kandidatensuche/`, UI and invocation metadata in `agents/openai.yaml`, and stable privacy or server rules in `references/`. Behavioral evaluation cases belong in `tests/evals.json`. Current product and architecture context lives in `docs/project.md`.

Do not place database code, credentials, candidate exports, or real personal data in skill files or fixtures. New MCP server source belongs in `server/` with its own unit and integration tests. The downloaded deployed Worker snapshot remains isolated under `worker-source/` until provenance is reconciled.

## Build, Test, and Development Commands

The installable plugin currently packages configuration and instructions and has no compile step. The separate `server/` workspace currently pins Inspector tooling but does not yet contain the planned server implementation. Run these checks from the repository root:

```powershell
python "$env:USERPROFILE\.codex\skills\.system\plugin-creator\scripts\validate_plugin.py" .\candidate-search
python "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" .\candidate-search\skills\crm-kandidatensuche
npx @modelcontextprotocol/inspector
```

The validators check plugin and skill structure. Use MCP Inspector against the deployed `/mcp` endpoint to verify initialization, schemas, annotations, authorization, and invalid inputs. Manually exercise every case in `candidate-search/tests/evals.json` after metadata or tool changes.

## Coding Style & Naming Conventions

Use two-space indentation for JSON and YAML. Use lowercase kebab-case for plugin and skill directories, stable snake_case MCP tool names, and descriptive Markdown headings. Keep `SKILL.md` concise; move schemas, policies, and conditional detail into `references/`. Quote all string values in `agents/openai.yaml`.

## Testing Guidelines

Test direct, indirect, incomplete, invalid, unauthorized, and out-of-scope requests. Candidate fixtures must be synthetic. Verify archived-record defaults, language null semantics, pagination caps, PII minimization, tenant isolation, and rejection of write SQL or injection payloads. A read-only tool must never mutate CRM state.

## Commit & Pull Request Guidelines

There is no established Git history yet. Use focused, imperative Conventional Commits, such as `feat: package candidate search skill` or `fix: redact sensitive CRM fields`. Pull requests should describe behavior and security impact, list validation commands, link relevant issues, and include sanitized MCP Inspector output when tool contracts change.

## Security & Configuration

Never commit tokens or embed them in MCP URLs. Use server-managed secrets and OAuth 2.1 or another reviewed authentication mechanism. Enforce authorization, tenant scope, parameterized SQL, allowlists, query timeouts, and result limits in MCP handlers; prompt instructions are not a security boundary.

## Serena

This repository is configured as the Serena project `mcp-plugin-2` in `.serena/project.yml` with Python and TypeScript language servers. Activate that project before code-oriented work, read the Serena instructions once per session, and consult the project memories (`core`, `architecture`, `conventions`, `commands`, and `security`) when relevant. Keep the memories synchronized when stable project structure, commands, conventions, or security rules change.

## Agent skills

### Issue tracker

Work is tracked and assigned to agents in Linear. See `docs/agents/issue-tracker.md`.

### Triage labels

Linear uses the five canonical triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

Domain documentation uses the single-context layout. See `docs/agents/domain.md`.

### Documentation sync

After behavior, architecture, configuration, security, deployment, or issue-state changes, update the canonical docs and `docs/changes.md`, then run the documentation check in `docs/setup.md`. Keep planned, implemented, checked, externally verified, and released states distinct; record blockers instead of inventing evidence.
