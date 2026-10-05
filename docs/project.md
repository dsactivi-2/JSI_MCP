# Cloud CRM MCP project context

Status date: 5 October 2026

## Project identity

This repository is the Cloud CRM MCP project in the folder MCP Plugin 2. The installable package remains candidate-search. Work is tracked in Linear at https://linear.app/activi/project/lena-1333951b31fb, separate from the older Candidate Search project. Scope root: ACT-140. The Linear title Lena was rejected by the user on 5 October 2026. It remains only as the current tracker title until a replacement name is given. Do not invent another name.

The current installable plugin remains named `candidate-search`; renaming the
package or public product is a separate decision and has not been implemented.

## Product

The currently implemented product is a read-only recruiting workflow for Codex
and ChatGPT. It packages the `crm-kandidatensuche` skill and connects it to the
Cloudflare CRM MCP Worker. It can search candidates, companies, and orders and
also exposes statistics, schema inspection, and a restricted SQL fallback.

The approved planning scope is broader: a modular MCP Apps UI for every current
tool, plus planned TypeSafe-assisted capabilities and separately gated decisions
for exports, writes/imports/bulk actions, automated employment decisions,
photos, and biometrics. Planning a capability does not mean it is implemented,
verified, or approved for production data. `server/SPEC.md` is the product
specification and `docs/open-work.md` is the current roadmap.

The installable package is `candidate-search/`, currently version `0.1.0-beta.2`. Its portable identity is `plugin.json`; the Codex beta connection uses `.codex-plugin/plugin.json` and `.mcp.json`.

## Current architecture

```text
Codex or ChatGPT
        |
        | MCP over HTTPS
        v
candidate-search plugin and crm-kandidatensuche skill
        |
        v
Cloudflare Worker: crm-pipedrive-worker
        |
        +-- /health
        +-- /mcp
        +-- /sse
        |
        v
CrmMCP Durable Object
        |
        v
Cloudflare Hyperdrive
        |
        v
Aiven MySQL
```

The read-only assessment on 4 October 2026 found Worker version 33,
`0.1.0-beta.6`, with the Durable Object class `CrmMCP`, a Hyperdrive binding,
and a server-managed `WORKER_API_KEY`. A local Worker source snapshot exists
under `worker-source/crm-pipedrive-worker/`. Deployment provenance still needs
to be reconciled before that snapshot is treated as the canonical release
source (`ACT-143`).

A live read on 5 October 2026 found one newer deployment, version `0898fdb7-7d67-4fb6-a17e-2ef27f8743f6` at 04:13 UTC. Its message records an updated `WORKER_API_KEY` secret. The deployed `index.js` is byte-for-byte the local snapshot, SHA-256 `3afa3e173ad0cf604795407e8e923889ccf79da89235f74c4ae82c229e53378d`. No new server script was deployed. Both local token variables are rejected with HTTP 401.

## Repository map

- `candidate-search/`: installable plugin, skill, privacy references, synthetic evaluations, and MCP connection metadata.
- `docs/`: project context, assessments, and agent-facing tracker configuration.
- `scripts/`: local package validation without CRM access.
- `server/`: local MCP server workspace and its own dependency manifest.
- `worker-source/`: local Cloudflare Worker source snapshot.

## Boundaries

CRM candidate, company, order, and SQL access must use the configured Cloudflare Worker path. Skill files and fixtures must not contain credentials, database code, candidate exports, or real personal data. Authorization, tenant scope, SQL limits, and output redaction must be enforced by server handlers; plugin instructions are not a security boundary.

The beta reads its bearer credential from the host environment. The target
variable name is `CRM_REMOTE_MCP_TOKEN`; existing files still contain the older
`CRM_CANDIDATE_MCP_TOKEN` name and require a coordinated migration. The
credential must never be placed in a URL, manifest, skill, log, archive, or Git
commit. OAuth 2.1 remains the intended final account-linking mechanism
(`ACT-142`).

## Current verification

Run the local package checks from the repository root:

```powershell
python .\scripts\validate_package.py .\candidate-search
python "$env:USERPROFILE\.codex\skills\.system\plugin-creator\scripts\validate_plugin.py" .\candidate-search
python "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" .\candidate-search\skills\crm-kandidatensuche
```

Use MCP Inspector against an authorized isolated deployment for initialization, schemas, authorization, invalid input, and server-side evaluation scenarios. The presence of `candidate-search/tests/evals.json` records expected behavior; it is not evidence that every scenario has been executed.

## Open foundation gaps

- Next session: build the new read-only server beside the live Worker, as decided in docs/memory.md. Do not spend that session on the current Worker.
- Confirm the canonical relationship between the deployed Worker and `worker-source/`.
- Implement and verify server-side field projection, exact counts, redaction, tenant authorization, and SQL enforcement.
- Replace the temporary bearer-token beta with reviewed OAuth 2.1 account linking.
- Keep the deployment-status documentation synchronized after a tested Worker release.
- Restore an authorized Inspector connection; the currently available beta token returns HTTP 401.
- Implement the module and decision backlog tracked under `ACT-140` in this repository's Linear tracker, not in Candidate Search.
