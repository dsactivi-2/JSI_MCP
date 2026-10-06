# Cloud CRM MCP project context

Status date: 6 October 2026

## Project identity

This repository is the Cloud CRM MCP project in the folder MCP Plugin 2. The installable package remains candidate-search. Work is tracked in Linear at https://linear.app/activi/project/lena-1333951b31fb, separate from the older Candidate Search project. Scope root: ACT-140. The Linear title Lena was rejected by the user on 5 October 2026. It remains only as the current tracker title until a replacement name is given. Do not invent another name.

The current installable plugin remains named `candidate-search`; renaming the
package or public product is a separate decision and has not been implemented.

## Product

The currently implemented product is a read-only recruiting workflow for Codex
and ChatGPT. It packages the `crm-kandidatensuche` skill and connects it to the
Cloudflare CRM MCP Worker. It can search candidates, companies, and orders and
also exposes statistics, schema inspection, and a restricted SQL fallback.

The approved planning scope is broader. On 6 October 2026 the user included eight points on the new server and split the build into phases. Phase 1 is the read server: birth date in the search list, the EU-citizen filter, free read-only SQL, and list and describe tables, together with the candidate, company, order, statistics, and profession-report reads. Phase 2 is own screens. Phase 3 is a later scoring step. The engine is not chosen: the user is still checking TypeSafe and a Cloudflare model they called Clef. That product name is not verified here. Phase 4 is writes, export, and import. Phase 5 is ranking, photos, and biometrics. Inclusion does not mean implemented, verified, or cleared for production data. `server/SPEC.md` is the product specification and `docs/open-work.md` is the current roadmap.

On 6 October 2026 the user required the new server to be hosted online against the live MySQL database. Decision DEC-2026-10-06-mcp-use selects mcp-use as the kit and Cloudflare Containers as the host. It replaces the earlier SDK-on-a-Worker choice in DEC-2026-10-06-hosted-stack. Manufact is not used. Nothing has been deployed.

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

A source read of that same local file on 5 October 2026 confirms the hash and the handler behavior. The server calls itself crm-mysql 1.1.0. /health returns ok, service crm-mcp, and the current time; a direct call the same day did that, and /healthz returned 404. Candidate search has count_only and cursor pagination with a page cap of 1000. Company search, assignment search, and free SQL stay at a 200-row cap. The candidate handler still accepts eu_buerger and returns the birth date. On 6 October 2026 the user decided the new server keeps both: the birth date in the candidate search list, and the eu_buerger filter. SELECT * and the query-string token stay out.

## Repository map

- `candidate-search/`: installable plugin, skill, privacy references, synthetic evaluations, and the live MCP connection. That connection still points at the old Worker.
- `docs/`: project context, assessments, and agent-facing tracker configuration.
- `scripts/`: local package validation without CRM access.
- `server/`: local workshop for the earlier read behavior. It is not the mcp-use server.
- `cloud-crm-mcp/`: mcp-use 2.7.3 read server. Phase-1 tools are registered. It also serves the skill `crm-kandidatensuche` and search guide 1.2.0. It is not connected to MySQL, not running, and not deployed. It refuses the old Worker and the old Hyperdrive. Its `deploy` script points at Manufact and must not be used.
- `worker-source/`: local Cloudflare Worker source snapshot.

## Boundaries

The live plugin still reaches CRM data through the configured Cloudflare Worker path. The new server in `cloud-crm-mcp/` is separate and is not that live path yet. Skill files and fixtures must not contain credentials, database code, candidate exports, or real personal data. Authorization, tenant scope, SQL limits, and output redaction must be enforced by server handlers; plugin instructions are not a security boundary.

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
