# Cloud CRM MCP handover

Status date: 6 October 2026

This is the handover for the next session. Do not continue the three earlier chats. Their handovers were not delivered to this session.

## Names

- Repository folder: MCP Plugin 2.
- Installable package: candidate-search, version 0.1.0-beta.2. Do not rename it during this transition.
- Product description: Cloud CRM MCP.
- Linear tracker: https://linear.app/activi/project/lena-1333951b31fb.
- The title Lena was requested and later rejected on 5 October 2026. No replacement name was given. Do not invent one, and do not use Lena as the product or repository name.
- Do not move this work into the older Candidate Search Linear project.

## Decision

Build a new read-only server beside the live Worker. Connect that new server to the existing MySQL database. Finish the first read-only version, then switch only when the user asks. Do not repair, redeploy, or otherwise modify the current Worker.

On 6 October 2026 the user decided the product server must be online and hosted, not a local program, and must use the live MySQL database. DEC-2026-10-06-hosted-stack first chose the official TypeScript MCP SDK on a new Cloudflare Worker. The user later replaced that framework choice.

Decision DEC-2026-10-06-mcp-use: build the server with mcp-use. A same-day note named Cloudflare Containers and said Manufact was not used. Later the same day the user chose Manufact as the host for now. Cloudflare stays later. Deploy goes through mcp-use to Manufact, not to the old Worker.

Checked on 6 October 2026 at 20:52 UTC: https://calm-forge-hk9rc.run.mcp-use.com/mcp is running as deployment c0be2dd3-77e8-46ac-824f-9942bc265c9f, started 16:42 UTC. /health returned 200. Discovery returned 200 and names https://balanced-lantern-65-staging.authkit.app. A call without a token returned 401. /mcp/inspector returned 404. CRM_DATABASE_URL is now set and was not printed. Deployment e97b45da returned one count: 122004 candidates, 117558 active, 1223 companies, 238 orders. Running deployment 2a078755 keeps the same client without logging that count on startup.

Decision DEC-2026-10-06-same-database: separate infrastructure means a new connection to the same existing MySQL database, not a second database. The old Worker host and the old Hyperdrive id stay refused by cloud-crm-mcp/src/guard.ts. The phase-1 read tools are registered. The new connection is in place and one count is verified. Candidate rows were not read.

On 6 October 2026 the user chose WorkOS. Staging user ds@activi.io accepted the invitation and has the role CRM mit SQL in organization Activi. Dynamic Client Registration and Client ID Metadata Document were enabled. A screenshot in this chat showed Manufact connected as ds@activi.io. That browser login was not repeated at 20:52 UTC. WorkOS discovery does not advertise crm:read. The server does not enforce that role in tool handlers. No tenant isolation exists.

The ChatGPT plugin skill and search guides are embedded there as guide 1.2.0. The adapted evaluation list is cloud-crm-mcp/test/evals.json and is not a runtime skill. The original plugin connection still points at the old Worker because that is still the Codex door.

The first version reads candidates, companies, orders, statistics, and `crm_beruf_report`. It also lists and describes allowed tables. Candidate lists load 50 per page and do not load 2000 at once. The server adds no default limit that ends the result. A count returns the full number and does not stop at 50. Read-only `crm_query` uses that same split and does not append `LIMIT 200`. OFFSET is a separate ban: free SQL rejects it, and the next page uses the cursor. The report uses literal position text, keeps archived candidates out unless requested, and does not default its language breakdown to German. Search rows include the birth date, and the eu_buerger filter stays. Own screens, scoring, writes/export/import, and ranking/photos/biometrics are included in later phases. They are not in this first version. The scoring engine is not chosen.

## Testing decision

On 5 October 2026 the user rejected acceptance that uses only the MCP Inspector, the 39 plugin evaluation cases, and synthetic data.

- The new server is connected to the existing MySQL database and is tested with real quotas and real read queries. The spoken wording was "echte Quoten" and "echte Abfragen". It was not redefined.
- The live Worker stays connected in parallel until the user asks for the replacement.
- Committed fixtures, skill files, and screenshots still must not contain real personal data.
- "Unicode Player" is not a product, component, or requirement. The phrase came from a speech-to-text error and is ignored.

This session did not run a real CRM query and did not create a Linear issue.

## Coordination

On 5 October 2026 the user stopped the three other agents. No orchestrator is set up, and none should be set up before this handover has been checked against the live stack. Linear remains the issue tracker. It does not stop a second chat from editing the same files.

The first build stays in one session. That session writes the new read-only server, starting at ACT-141 and carrying ACT-142 and ACT-144 before broader modules. Separate worktrees are for the later UI modules, ACT-145 through ACT-149, not for the first server.

This session did not receive the three handovers, did not merge them, and did not verify the live stack.

## Confirmed state

- The live endpoint remains https://crm-pipedrive-worker.6f484zn9bd.workers.dev/mcp and must not be modified yet. On 5 October 2026 at 07:17 UTC it answered. Unauthenticated initialize returned HTTP 401. Both CRM_REMOTE_MCP_TOKEN and CRM_CANDIDATE_MCP_TOKEN also returned HTTP 401, so neither is the current Worker key. No CRM query was sent.
- worker-source/ is the behavior baseline for the new server. It is wrangler.jsonc plus one bundled index.js of about 3.8 MB, without the original TypeScript project, tests, or a lockfile. Its SHA-256 is 3afa3e173ad0cf604795407e8e923889ccf79da89235f74c4ae82c229e53378d, the same hash already recorded for the deployed script. ACT-143 stays open for how that bundle was produced. It does not block building on this file.
- The bundle names the MCP server crm-mysql 1.1.0 and registers 11 tools. Candidate search implements count_only, cursor pages up to 1000 rows, and an exact distinct count. It also filters eu_buerger and returns birth date and age. Company search, assignment search, and crm_query stay capped at 200 rows. Assignment search uses SELECT *. Auth is the shared WORKER_API_KEY, also accepted as a token query parameter. OAuth, tenant roles, and tool annotations are not in this handler.
- On 6 October 2026 the user decided the new server keeps the eu_buerger filter and returns the birth date in candidate search rows. Searching for non-EU citizens includes people with an empty citizenship field. The user accepted that. Age uses only the birth date. An empty birth date cannot be turned into an age. One-sided age bounds stay 0 and 150; an explicit from/to must use those exact completed-year bounds. Which stored dates fall in 2030 has not been read from the database. Do not copy SELECT * or the query-string token. Gender, religion, health data, ethnic origin, and the raw citizenship column stay out.
- On 6 October 2026 the user included eight points on the new server: birth date in the search list, the EU-citizen filter, free read-only SQL, list and describe tables, own screens, TypeSafe scoring, writes/export/import, and ranking/photos/biometrics. The first four are phase 1. The last four are phases 2 through 5. None of them is built. Linear issue text was not changed. Phases 4 and 5 still have no evidenced legal or permission design, so they are not authorized on real personal data, photos, or biometric data. Later the same day the user said the scoring engine is still open: TypeSafe or a Cloudflare model they called Clef. That name is not verified. Neither engine is installed.
- server/ contains the Inspector workspace, server/SPEC.md, and a local phase-1 workshop under server/src. That workshop is not connected to MySQL and is not the hosted server. The hosted server is cloud-crm-mcp on Manufact. DEC-2026-10-06-hosted-stack was replaced by DEC-2026-10-06-mcp-use and the later Manufact choice.
- The tracker is a complete Linear project in the Activi team, not a project inside this repository. A local Linear cache record from 5 October 2026 names it Lena, slug lena-1333951b31fb, team ACT. The issue list was last read earlier that day as ACT-140 through ACT-154, all in Backlog. This later check did not reconfirm comments or status through the Linear API. Do not add another umbrella issue.
- Codex crm-remote reads CRM_REMOTE_MCP_TOKEN. The plugin and Inspector script read CRM_CANDIDATE_MCP_TOKEN. Both are set on this machine, the lengths are 16 and 108, and the values differ. The live Worker rejects both.
- The deployed script is still the downloaded snapshot. Its SHA-256 is 3afa3e173ad0cf604795407e8e923889ccf79da89235f74c4ae82c229e53378d. The only newer deployment, version 0898fdb7-7d67-4fb6-a17e-2ef27f8743f6 at 2026-10-05 04:13 UTC, records an updated WORKER_API_KEY secret. It has no version tag. No second CRM Worker was created in October.
- An earlier chat reported the connected server as crm-mysql 1.1.0 with 11 tools. This check could not repeat that, because both tokens were rejected before a tool list.
- Lena: Live-Worker nur gelesen returned a chat-only handover on 6 October 2026. It changed no repository file. Two Inspector configs outside the repository point at the old Worker. Lena: to-spec gestoppt had already written an earlier handover into this file. The handover request to Lena: MCP-Bewertung abgeschlossen failed with a system error, so that chat did not return one. The older /tmp files were not used as evidence.

## Next session

1. Read this file, docs/project.md, docs/open-work.md, and server/SPEC.md.
2. The new connection and one count are done. Do not create a second database. Do not use the old Worker name or the old Hyperdrive id. Candidate rows are still unread.
3. Test that connection with one real count and one real read. Do not treat synthetic Inspector cases as the only acceptance.
4. Leave the live Worker and the Codex plugin path in place until that read works and the user asks for the switch.
5. Then enforce WorkOS roles per tool, and only after that point Codex at the new server.
6. Ask for the replacement project name before renaming the Linear title.
7. Do not start an orchestrator or a second writer on this server until the user asks.

## What was checked

- Linear, earlier on 5 October 2026: 15 issues, newest update then ACT-144 at 04:05 UTC. No new issue was created. A later check could not reconfirm this live.
- The three project chats were read. The proposed synthetic-only acceptance seam was rejected by the user.
- No real CRM query was run in this session.
- A live initialize on 5 October 2026 at 07:17 UTC reached the Worker. It returned HTTP 401 for no token and for both configured tokens. Python's default client was blocked earlier by Cloudflare error 1010 and was not used as evidence.
- The historical DOCX export was not regenerated.
- The account has 17 Workers. Since 1 October only crm-pipedrive-worker changed, and that change was the secret update above. server/src now has the local workshop. No second CRM Worker has been deployed.
