# Cloud CRM MCP project context

Status date: 7 October 2026

## Project identity

This repository is the Cloud CRM MCP project in the folder MCP Plugin 2. The server package is `cloud-crm-mcp`, version 0.1.0. The old installable package `candidate-search` is not in this repository. Work is tracked in Linear at https://linear.app/activi/project/lena-1333951b31fb, separate from the older Candidate Search project. Scope root: ACT-140. The Linear title Lena was rejected by the user on 5 October 2026. It remains only as the current tracker title until a replacement name is given. Do not invent another name.

## Product

The implemented server is `cloud-crm-mcp/`. It is TypeScript, built with mcp-use, and hosted on Manufact at https://calm-forge-hk9rc.run.mcp-use.com/mcp. It reads the existing MySQL database. The skill `crm-kandidatensuche` is in that same package. The old Cloudflare Worker remains online and must not be changed. It is not the server this repository deploys.

The approved planning scope is broader. On 6 October 2026 the user included eight points on the new server and split the build into phases. Phase 1 is the read server: birth date in the search list, the EU-citizen filter, free read-only SQL, and list and describe tables, together with the candidate, company, order, statistics, and profession-report reads. Phase 2 is own screens. Phase 3 is a later scoring step. The engine is not chosen: the user is still checking TypeSafe and a Cloudflare model they called Clef. That product name is not verified here. Phase 4 is writes, export, and import. Phase 5 is ranking, photos, and biometrics. Inclusion does not mean implemented, verified, or cleared for production data. `docs/SPEC.md` is the product specification and `docs/open-work.md` is the current roadmap.

On 6 October 2026 the user required the new server to be hosted online and to read the existing live MySQL database. Decision DEC-2026-10-06-mcp-use selects mcp-use as the kit. It replaces the earlier SDK-on-a-Worker choice in DEC-2026-10-06-hosted-stack. A same-day note named Cloudflare Containers and said Manufact was not used. Later the same day the user chose Manufact as the temporary host. Cloudflare remains later.

Checked on 6 October 2026 at 20:52 UTC: the new server is online at https://calm-forge-hk9rc.run.mcp-use.com/mcp. Manufact server id 9e075f18-34d7-4a71-a3e9-88868821addb, active deployment c0be2dd3-77e8-46ac-824f-9942bc265c9f, status running since 16:42 UTC. /health returned 200. /.well-known/oauth-protected-resource returned 200 and names https://balanced-lantern-65-staging.authkit.app. A call without a token returned 401. /mcp/inspector returned 404. Production variables now also include sensitive CRM_DATABASE_URL. On 6 October 2026 deployment e97b45da-8bae-408b-932c-f40e16bd821a ran crm_stats once: 122004 candidates, 117558 active, 1223 companies, and 238 orders. No candidate rows were returned. Deployment 2a078755-5753-4a37-a791-0205a69a43b1 is the running deployment and keeps that client without the startup log.

Decision DEC-2026-10-06-same-database: "getrennte Datenbank" means a new connection to the same existing MySQL database, not a second database. The old Worker, its host, and its Hyperdrive id stay untouched. That connection is configured and the count above is the check.

On 7 October 2026 Codex crm-remote was switched to https://calm-forge-hk9rc.run.mcp-use.com/mcp and the OAuth login succeeded. The old Worker entries were removed.

The old installable package candidate-search 0.1.0-beta.2 is in the local archive. It is not in this repository.

## Current architecture

```text
ChatGPT, Grok, Codex, or another MCP client
        |
        | HTTPS, WorkOS login
        v
https://calm-forge-hk9rc.run.mcp-use.com/mcp
        |
        v
cloud-crm-mcp on Manufact, TypeScript
        |
        | TLS, CRM_DATABASE_URL, Aiven project CA
        |
        v
existing MySQL database
```

Connecting does not install the skill. The shared instructions are `cloud-crm-mcp/skills/crm-kandidatensuche/SKILL.md`. `agents/openai.yaml` is only an OpenAI hint. A client that never calls `skills/list` does not receive that file. On 7 October 2026 the source started reporting `websiteUrl` https://calm-forge-hk9rc.run.mcp-use.com and a short `instructions` text that tells the client to ignore old local skill files and read `skill://crm-kandidatensuche/SKILL.md`. Deployment `2a078755` does not serve that text until the next deploy. On 7 October 2026 Grok read two old local files instead.

GitHub publishes this repository at https://github.com/dsactivi-2/JSI_MCP. The repository is public. The current branch tip is the TypeScript server under cloud-crm-mcp/. The 3.8 MB Worker bundle and the general coding skills were removed from this tip after a local copy. There are no telephone agents in this repository.

## Old Worker, kept as evidence

The read-only assessment on 4 October 2026 found Worker version 33, `0.1.0-beta.6`, with the Durable Object class `CrmMCP`, a Hyperdrive binding, and a server-managed `WORKER_API_KEY`. The local snapshot now lives only in `/Users/activi/Downloads/JSI_MCP-archiv/snapshot/worker-source/crm-pipedrive-worker/`. Do not treat it as the source of the Manufact server. `ACT-143` remains the provenance gap.

A live read on 5 October 2026 found deployment `0898fdb7-7d67-4fb6-a17e-2ef27f8743f6` at 04:13 UTC. The deployed `index.js` matches the local snapshot, SHA-256 `3afa3e173ad0cf604795407e8e923889ccf79da89235f74c4ae82c229e53378d`. Both local token variables returned HTTP 401. That bundle calls itself crm-mysql 1.1.0, caps company, assignment, and free-SQL reads at 200 rows, and accepts a token in the query string. The new server does not copy those limits or that token-in-URL behavior. It does keep the birth date in candidate search rows and the `eu_buerger` filter, by the user's decision on 6 October 2026.

## Repository map

- `cloud-crm-mcp/`: the mcp-use read server deployed on Manufact. Phase-1 tools are registered. It also serves the skill `crm-kandidatensuche` and search guide 1.2.0. It connects with TLS to the existing MySQL database when CRM_DATABASE_URL is set, using the Aiven project CA. It refuses the old Worker name and the old Hyperdrive id.
- `docs/`: current project facts, handover, roadmap, and `docs/SPEC.md`.
- GitHub: https://github.com/dsactivi-2/JSI_MCP, public since 7 October 2026. The current tree is the new server. The old plugin, Worker bundle, JavaScript workshop, and coding-skill copies are not on this branch tip.
- Local archive, this Mac only: `/Users/activi/Downloads/JSI_MCP-archiv`, commit `bc02ddb`, no GitHub remote.

## Boundaries

On this Mac, Codex `crm-remote` has the same URL and `enabled = false`. The new server has one proven count and no proven candidate, company, or order row read. Skill files and fixtures must not contain credentials, database code, candidate exports, or real personal data. Handlers enforce authorization. Prompt text does not.

WorkOS is the login for the new server. Deployment 2a078755 publishes discovery for https://balanced-lantern-65-staging.authkit.app. The advertised scopes are openid, profile, email, and offline_access. `crm_query` declares `sql:read`, and no tool handler checks the WorkOS role. `CRM_MCP_SERVER_TOKEN` remains a code fallback. The old Inspector script is in the local archive. It is not the Manufact server.

## Current verification

Run the local server checks from `cloud-crm-mcp/`:

```bash
npm test
npm run typecheck
```

These checks do not read a candidate row and do not deploy. Use the Manufact Inspector against an authorized session for initialization, schemas, authorization, and invalid input. The presence of `cloud-crm-mcp/test/evals.json` records expected behavior; it is not evidence that every scenario has been executed. The old `candidate-search` validators are not part of this repository.

## Open foundation gaps

- The count is proven. Candidate, company, and order row reads are not. Do not create a second database. Do not change the old Worker or its Hyperdrive id.
- Enforce WorkOS roles in the tool handlers. They are not enforced today.
- `crm-remote` points at the new server and is switched off in the local Codex config.
- The public `/mcp/inspector` path returned 404 on 6 October 2026 at 20:52 UTC. The Manufact dashboard Inspector is separate.
- The skill is on the server. Clients do not receive it automatically.
- `ACT-143` remains open. The archived bundle is not the new server.
- Phases 2 through 5 are included and not built.
