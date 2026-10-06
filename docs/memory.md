# Cloud CRM MCP handover

Status date: 7 October 2026

This is the handover for the next chat. Read `docs/project.md` first, then this file, then `docs/open-work.md`. Do not treat the historical audits as the current server.

## Where the work is

- Folder: `/Users/activi/Downloads/MCP Plugin 2`.
- GitHub: https://github.com/dsactivi-2/JSI_MCP. Public. Branches `main` and `codex/cloud-crm-baseline` carry the same history.
- The old package name was candidate-search, version 0.1.0-beta.2. That package is in the local archive, not in this repository.
- Product description: Cloud CRM MCP.
- Linear: https://linear.app/activi/project/lena-1333951b31fb. The title Lena was rejected on 5 October 2026. No replacement name was given. Do not invent one.
- Do not move this work into the older Candidate Search Linear project.

## What is running

The new server is TypeScript in `cloud-crm-mcp/`, built with mcp-use, hosted on Manufact.

- URL: https://calm-forge-hk9rc.run.mcp-use.com/mcp
- Manufact server id: `9e075f18-34d7-4a71-a3e9-88868821addb`
- Running deployment recorded on 6 October 2026: `2a078755-5753-4a37-a791-0205a69a43b1`
- Login: WorkOS Staging, https://balanced-lantern-65-staging.authkit.app
- User seen connected: `ds@activi.io`, role name recorded as CRM mit SQL. The server does not enforce that role.
- Database: one new connection to the same existing MySQL database. Not a second database. `CRM_DATABASE_URL` is set in Manufact and is not in Git.
- Proven count, deployment `e97b45da`, 6 October 2026: 122004 candidates, 117558 active, 1223 companies, 238 orders. No candidate row was read.
- Last HTTP check, 6 October 2026 at 21:53 UTC: `/health` 200, OAuth discovery 200, `/mcp` without a token 401, public `/mcp/inspector` 404.

The old Worker https://crm-pipedrive-worker.6f484zn9bd.workers.dev/mcp stays untouched. Its downloaded bundle was about 3.8 MB of JavaScript and now lives only in the local archive. It is evidence, not the new server.

## What the folders are

- `cloud-crm-mcp/`: the server to change.
- There are no telephone agents and no general coding-skill pack in this repository.
- Local archive, not GitHub: /Users/activi/Downloads/JSI_MCP-archiv, commit bc02ddb. It holds the old plugin, the old Worker bundle, the JavaScript workshop, and the old audits. 145 files were copied byte for byte before removal.
- `docs/`: active facts are `project.md`, `open-work.md`, `memory.md`, `setup.md`, and `changes.md`. The Cloudflare audits and the older plan are history.

## Decisions that stay

- DEC-2026-10-06-mcp-use: build with mcp-use. Manufact is the temporary host. Cloudflare is later.
- DEC-2026-10-06-same-database: new connection, same MySQL database.
- DEC-2026-10-06-phased-scope: phase 1 is the read server. Screens, scoring, writes, and ranking or photos are later phases and are not built. The scoring engine is not chosen.
- Birth date stays in candidate search rows. The `eu_buerger` filter stays. `eu_buerger: false` includes an empty citizenship. The user accepted that.
- Lists load 50 rows per page and continue with the cursor. A count returns the full number and does not stop at 50. The server adds no maximum that ends the result. Free SQL rejects `OFFSET`. The old 200-row cap is not the new server's rule.
- Do not repair or redeploy the old Worker.

## What is not done

- No proven read of a candidate, company, or order row through the new server.
- WorkOS roles are not checked in the tool handlers. Discovery does not advertise `crm:read`. `crm_query` asks for `sql:read` and can return HTTP 403.
- The skill is on the server as `SKILL.md`. `agents/openai.yaml` is only the OpenAI hint. Clients do not install it on connect. Grok did not call `skills/list`. Do not add a separate file per agent unless a host requires one.
- Local Codex `crm-remote` points at the new URL and is set to `enabled = false`.
- The three stopped chats never delivered their handovers. Do not invent their missing work.
- The repository was not cleaned up. Publishing it did not update the running server.
- Linear was not updated in this documentation pass. Its 15 issues were last confirmed in Backlog. That live check was not repeated on 7 October 2026.

## Next chat

1. Read the active docs above before editing.
2. Do not deploy. Do not restore the archived old files unless the user asks.
3. The useful server change, if the user asks, is the short connection text that tells every client to ignore old local skill files and read this server's skill.
4. A real candidate read is still the missing proof. Do not print personal data into the repository.
5. Ask for a Linear title before renaming the tracker.
