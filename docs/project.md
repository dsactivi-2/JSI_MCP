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

On 6 October 2026 the user required the new server to be hosted online and to read the existing live MySQL database. Decision DEC-2026-10-06-mcp-use selects mcp-use as the kit. It replaces the earlier SDK-on-a-Worker choice in DEC-2026-10-06-hosted-stack. A same-day note named Cloudflare Containers and said Manufact was not used. Later the same day the user chose Manufact as the temporary host. Cloudflare remains later.

Checked on 6 October 2026 at 20:52 UTC: the new server is online at https://calm-forge-hk9rc.run.mcp-use.com/mcp. Manufact server id 9e075f18-34d7-4a71-a3e9-88868821addb, active deployment c0be2dd3-77e8-46ac-824f-9942bc265c9f, status running since 16:42 UTC. /health returned 200. /.well-known/oauth-protected-resource returned 200 and names https://balanced-lantern-65-staging.authkit.app. A call without a token returned 401. /mcp/inspector returned 404. Production variables now also include sensitive CRM_DATABASE_URL. On 6 October 2026 deployment e97b45da-8bae-408b-932c-f40e16bd821a ran crm_stats once: 122004 candidates, 117558 active, 1223 companies, and 238 orders. No candidate rows were returned. Deployment 2a078755-5753-4a37-a791-0205a69a43b1 is the running deployment and keeps that client without the startup log.

Decision DEC-2026-10-06-same-database: "getrennte Datenbank" means a new connection to the same existing MySQL database, not a second database. The old Worker, its host, and its Hyperdrive id stay untouched. That connection is configured and the count above is the check.

The installable plugin still points at the old Worker. A screenshot in this chat showed Manufact connected as ds@activi.io. That browser session was not repeated in the 20:52 UTC check.

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
- `cloud-crm-mcp/`: the mcp-use read server deployed on Manufact. Phase-1 tools are registered. It also serves the skill `crm-kandidatensuche` and search guide 1.2.0. It connects with TLS to the existing MySQL database when CRM_DATABASE_URL is set, using the Aiven project CA. It refuses the old Worker name and the old Hyperdrive id.
- `worker-source/`: local Cloudflare Worker source snapshot.

## Boundaries

The installable plugin still reaches CRM data through the old Cloudflare Worker. The new server in `cloud-crm-mcp/` is online on Manufact and can count the existing database. It is not the plugin path. Skill files and fixtures must not contain credentials, database code, candidate exports, or real personal data. Authorization, tenant scope, SQL limits, and output redaction must be enforced by server handlers; plugin instructions are not a security boundary.

The beta reads its bearer credential from the host environment. The target
variable name is `CRM_REMOTE_MCP_TOKEN`; existing files still contain the older
`CRM_CANDIDATE_MCP_TOKEN` name and require a coordinated migration. The
credential must never be placed in a URL, manifest, skill, log, archive, or Git
commit. OAuth 2.1 is the account-linking mechanism for the new server
(`ACT-142`). Deployment 2a078755 publishes WorkOS Staging discovery and keeps CRM_MCP_SERVER_TOKEN as a fallback. At 21:53 UTC, /health returned 200, discovery returned 200, and /mcp without a token returned 401. WorkOS mode does not require the OAuth scope crm:read at the gate. Discovery advertises openid, profile, email, and offline_access. Only crm_query declares sql:read. No tool handler checks the WorkOS role, and no tenant isolation exists. The live token contents were not read in the 20:52 UTC check.

## Current verification

Run the local package checks from the repository root:

```powershell
python .\scripts\validate_package.py .\candidate-search
python "$env:USERPROFILE\.codex\skills\.system\plugin-creator\scripts\validate_plugin.py" .\candidate-search
python "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" .\candidate-search\skills\crm-kandidatensuche
```

Use MCP Inspector against an authorized isolated deployment for initialization, schemas, authorization, invalid input, and server-side evaluation scenarios. The presence of `candidate-search/tests/evals.json` records expected behavior; it is not evidence that every scenario has been executed.

## Open foundation gaps

- Next: the count is proven. Real candidate, company, and order reads are not proven. Do not create a second database, and do not change the old Worker or its Hyperdrive id.
- Verify a real read after that connection exists. No CRM result has been proven on the new server.
- Enforce the WorkOS roles in the tool handlers. crm:read and sql:read are not enforced there today.
- Point Codex at the new server only after a real read works. It still uses the old Worker and CRM_CANDIDATE_MCP_TOKEN.
- Reach the Inspector on the online server. The public /mcp/inspector path returned 404 on 6 October 2026 at 20:52 UTC.
- Confirm the canonical relationship between the old deployed Worker and `worker-source/` (`ACT-143`).
- Keep phases 2 through 5 behind their existing gates. They are included and not built.
