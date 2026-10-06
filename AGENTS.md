# Repository Guidelines

## Project Structure & Module Organization

The server lives in `cloud-crm-mcp/`. Its skill is `cloud-crm-mcp/skills/crm-kandidatensuche/`. Current product and architecture context lives in `docs/project.md`. The approved scope lives in `docs/SPEC.md`.

Do not place database code, credentials, candidate exports, or real personal data in skill files or fixtures. The old plugin, the old Worker bundle, and the local JavaScript workshop are not in this repository. Their copy is the local archive `/Users/activi/Downloads/JSI_MCP-archiv`. That archive has no GitHub remote.

## Build, Test, and Development Commands

From `cloud-crm-mcp/`:

```bash
npm test
npm run typecheck
```

`npm test` runs the local unit tests. It does not prove a live candidate read. The hosted server is https://calm-forge-hk9rc.run.mcp-use.com/mcp.

## Coding Style & Naming Conventions

Use two-space indentation for JSON and YAML. Use lowercase kebab-case for plugin and skill directories, stable snake_case MCP tool names, and descriptive Markdown headings. Keep `SKILL.md` concise; move schemas, policies, and conditional detail into `references/`. Quote all string values in `agents/openai.yaml`.

## Testing Guidelines

Test direct, indirect, incomplete, invalid, unauthorized, and out-of-scope requests. Candidate fixtures must be synthetic. Verify archived-record defaults, language null semantics, pagination caps, PII minimization, tenant isolation, and rejection of write SQL or injection payloads. A read-only tool must never mutate CRM state.

## Commit & Pull Request Guidelines

There is no established Git history yet. Use focused, imperative Conventional Commits, such as `feat: package candidate search skill` or `fix: redact sensitive CRM fields`. Pull requests should describe behavior and security impact, list validation commands, link relevant issues, and include sanitized MCP Inspector output when tool contracts change.

## Security & Configuration

Never commit tokens or embed them in MCP URLs. Use server-managed secrets and OAuth 2.1 or another reviewed authentication mechanism. Enforce authorization, tenant scope, parameterized SQL, allowlists, query timeouts, and result limits in MCP handlers; prompt instructions are not a security boundary.

## Serena

The Serena project file was moved to the local archive `/Users/activi/Downloads/JSI_MCP-archiv/snapshot/.serena`. It is not part of the server.

## Agent skills

### Issue tracker

Work is tracked and assigned to agents in Linear. See `docs/agents/issue-tracker.md`.

### Triage labels

Linear uses the five canonical triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

Domain documentation uses the single-context layout. See `docs/agents/domain.md`.

### Documentation sync

After behavior, architecture, configuration, security, deployment, or issue-state changes, update the canonical docs and `docs/changes.md`, then run the documentation check in `docs/setup.md`. Keep planned, implemented, checked, externally verified, and released states distinct; record blockers instead of inventing evidence.
