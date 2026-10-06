# Cloud CRM MCP setup and verification

Status date: 6 October 2026

## Prerequisites

- Python 3 for local package and documentation checks.
- Node.js/npm for the local MCP Inspector workspace.
- An explicitly authorized isolated CRM test tenant and credential for live
  MCP tests. Never use candidate exports or real PII as fixtures.

## Package checks

From the repository root:

```bash
python3 scripts/validate_package.py candidate-search
python3 "$HOME/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py" candidate-search
python3 "$HOME/.codex/skills/.system/skill-creator/scripts/quick_validate.py" candidate-search/skills/crm-kandidatensuche
```

The optional system validators may be unavailable on a different machine. A
local validation pass does not prove the remote Worker is safe or compatible.

## MCP Inspector

The Inspector dependency is pinned in `server/package-lock.json`. Start it with:

```bash
cd server
npm run inspector
```

The current wrapper reads `CRM_CANDIDATE_MCP_TOKEN`. The target project-wide
name is `CRM_REMOTE_MCP_TOKEN`; changing the wrapper and manifests together is
open work. Do not store either value in a URL or committed file.

The old Worker endpoint last returned HTTP 401 on 5 October 2026, including for both configured tokens. The new server is separate. On 6 October 2026 at 20:52 UTC its /health returned 200, its OAuth discovery returned 200, a call without a token returned 401, and https://calm-forge-hk9rc.run.mcp-use.com/mcp/inspector returned 404. Tool behavior against CRM data is not verified because CRM_DATABASE_URL is not set.

## Documentation checks

```bash
python3 "$HOME/.codex/plugins/cache/created-by-me-remote/activi-project-documentation/1.3.0/skills/project-doc-sync/scripts/project_docs.py" check --root .
python3 "$HOME/.codex/plugins/cache/created-by-me-remote/activi-project-documentation/1.3.0/skills/project-doc-sync/scripts/project_docs.py" gate --root .
```

The absolute skill path is a local convenience, not a portable project
dependency. A fresh content review is required after relevant file changes.

## Cloudflare boundary

Do not modify or redeploy the old live Worker. The new server is the Manufact
deployment, not that Worker. When future authorized Cloudflare work begins, use the
`cf` CLI unless the relevant source project contains a Wrangler configuration;
the downloaded snapshot does contain `wrangler.jsonc`, so Wrangler is suitable
inside that project after provenance and deployment authorization are resolved.
