# Documentation change evidence

## 7 October 2026 — The project is published on GitHub

**Trigger:** The user supplied the empty repository https://github.com/dsactivi-2/JSI_MCP and asked for the whole project to be pushed, with a README.

**Before:** The local repository had nine commits and no Git remote. The README did not name this GitHub repository or the live server address.

**After:** `main` and `codex/cloud-crm-baseline` both point at the local history. The README names the repository and https://calm-forge-hk9rc.run.mcp-use.com/mcp. No secret file was added. The live server was not deployed again.

**Checked:** `gh repo view` showed the repository empty and public before the push, then `main` after it. Not checked: a fresh clone on another machine.

## 7 October 2026 — Codex uses the new CRM server

**Trigger:** The user asked to remove the old Codex CRM connections and install the new server.

**Before:** Codex had crm-remote and cloudworker-hyperdrive, both aimed at the old Worker. The plugin package named that old address too.

**After:** Both old Codex entries are removed. crm-remote is https://calm-forge-hk9rc.run.mcp-use.com/mcp and the OAuth login succeeded. The plugin package names that same address and no longer carries the old bearer variable. The old Worker was not changed.

**Checked:** codex mcp get showed the new address and no bearer variable. The login command reported success. Not checked: a candidate row read through Codex.


## 6 October 2026 — The Manufact server can count the existing MySQL database

**Trigger:** CRM_DATABASE_URL was saved in Manufact. The server had no MySQL client.

**Before:** Deployment c0be2dd3 was running. The read tools were registered, but no database client existed and no CRM read was proven.

**After:** cloud-crm-mcp opens MySQL only when CRM_DATABASE_URL is set, forces TLS with the Aiven project CA, and strips addresses and passwords from database errors. Pages stay at 50. Counts stay complete. Deployment e97b45da-8bae-408b-932c-f40e16bd821a ran crm_stats once: 122004 candidates, 117558 active, 1223 companies, and 238 orders. No candidate rows were read. Running deployment 2a078755-5753-4a37-a791-0205a69a43b1 has the same client without the startup log. At 21:53 UTC, /health returned 200, OAuth discovery returned 200, and /mcp without a token returned 401. The old Worker was not changed.

**Checked:** npm test and mcp-use typecheck in cloud-crm-mcp, both passing, 16 tests. Manufact deployment status running. The one count in the runtime log of e97b45da. The HTTP checks above. Not checked: candidate, company, or order rows, the shared-token fallback, or a switch of the Codex plugin path.


## 6 October 2026 — Active docs now match the running Manufact server

**Trigger:** The user asked what "mostly" left open, and then asked for the docs, checklists, and dependent wording to be updated before the next task.

**Before:** project.md, open-work.md, memory.md, and server/SPEC.md still said both that Manufact was online and that nothing had been deployed or that Manufact must not be used. They named deployment #4. The README said every tool requires crm:read.

**After:** The active docs name deployment c0be2dd3 as the running server, checked at 20:52 UTC. Discovery returned 200, /health returned 200, an unauthenticated /mcp call returned 401, and /mcp/inspector returned 404. CRM_DATABASE_URL is absent. "Getrennte Datenbank" is recorded as a new connection to the same MySQL database, not a second database. WorkOS roles are recorded as not enforced in tool handlers. Historical change entries stay as they were.

**Checked:** mcp-use whoami, servers list, deployments list, env list metadata without values, and the HTTP calls above. Not checked: a repeated Manufact browser login, the contents of a live token, a CRM query, WorkOS public signup, or a Linear update.


## 6 October 2026 — Manufact probe no longer crashes on a WorkOS token

**Trigger:** Manufact showed connection failed because server/discover returned HTTP 500.

**Before:** Deployment #4 logged a 253 ms HTTP 500 for server/discover after WorkOS discovery succeeded.

**After:** The token check no longer throws a plain error when crm:read is absent. Deployment #5 c0be2dd3-77e8-46ac-824f-9942bc265c9f is running. An unauthenticated call still returns 401. A completed Manufact login was not repeated here.

**Checked:** Deployment status running and the earlier runtime log. Not checked: the user Retry click.

## 6 October 2026 — WorkOS Staging discovery is live

**Trigger:** The user enabled Dynamic Client Registration and Client ID Metadata Document in WorkOS Staging.

**Before:** Deployment #3 was running. Both discovery addresses returned 404.

**After:** Deployment #4 2d42c626-896c-44d6-b5ff-95cedc36abeb is running. `/.well-known/oauth-protected-resource` returned 200 and names `https://balanced-lantern-65-staging.authkit.app`. A call without a token returned 401 with `WWW-Authenticate`. The WorkOS user ds@activi.io has accepted the Staging invitation and has the role CRM mit SQL. No Manufact browser login was completed in this check. No database query ran. The shared token was not sent.

**Checked:** Manufact deployment status running, the HTTP calls above, and the WorkOS user record. Not checked: a completed Manufact connect flow or CRM data.

## 6 October 2026 — OAuth-capable code deployed, discovery still off

**Trigger:** The user asked to deploy the prepared OAuth code and commit it.

**Before:** Manufact deployment 264d9053-8bbb-4738-a9aa-17d0b856e0cc was running. OAuth code existed only locally.

**After:** Deployment #3 edeadc6f-043e-4b9c-a49c-0e4345d6df7c is running at https://calm-forge-hk9rc.run.mcp-use.com/mcp. /health returned 200. A call without a token returned 401 with the text Nicht angemeldet. Both discovery addresses still returned 404. CRM_MCP_SERVER_TOKEN is still the only production variable. No OAuth issuer is set, so the live login path is unchanged. The shared token was not sent again in this check.

**Checked:** Manufact status running, plus the HTTP calls above. Not checked: a bearer initialize, a real provider, or a database query.


## 6 October 2026 — OAuth code is in the server, not deployed

**Trigger:** The user asked for OAuth 2.0 as the main login, with the shared token kept during the change.

**Before:** The public Manufact server accepts only `CRM_MCP_SERVER_TOKEN` and returns a plain 401. `/.well-known/oauth-protected-resource` returned 404.

**After:** `cloud-crm-mcp` can act as an OAuth resource server when the issuer, both endpoints, the JWKS URL, and the public resource URL are set. Discovery is served at `/.well-known/oauth-protected-resource` and `/.well-known/oauth-protected-resource/mcp`. Every tool requires `crm:read`. Free SQL also requires `sql:read`. The shared token still works. No provider is chosen, no client secret belongs in this server, and the running Manufact deployment was not updated.

**Checked:** `npm test` passed with 12 tests and `npm run typecheck` passed. Not checked: a real provider login, Manufact discovery after deploy, or a database query.


## 6 October 2026 — Manufact deploy is online

**Trigger:** The user approved the Manufact login and asked to continue.

**Before:** The Manufact device login was waiting. No public URL existed.

**After:** The server is online at https://calm-forge-hk9rc.run.mcp-use.com/mcp. Manufact server id 9e075f18-34d7-4a71-a3e9-88868821addb, deployment 264d9053-8bbb-4738-a9aa-17d0b856e0cc, status running. A call without the bearer token returned 401. A call with CRM_MCP_SERVER_TOKEN returned initialize 200 and the eleven read tools. No database URL is set. /mcp/inspector returned 404, so the Inspector is not mounted on the public server. The dashboard page is https://manufact.com/calm-forge-hk9rc.

**Checked:** Manufact build log said server stable, plus the two HTTP calls above. Not checked: a real MySQL query.


## 6 October 2026 — Manufact is the host for now

**Trigger:** The user said to use Manufact for now.

**Before:** The internet host was not settled.

**After:** Manufact is the temporary host. Cloudflare stays a later option. The server still goes online before the new database is attached. The mcp-use CLI was not logged in. A device login was started and is waiting for the user. No deploy has finished.

**Checked:** `mcp-use whoami` returned not logged in. Not checked: a finished Manufact deployment or a public URL.


## 6 October 2026 — host choice reopened

**Trigger:** The user said the host decision was not clear and had been closed on the assistant side. The server must be online, not local. The database connection comes after hosting. The mcp-use Inspector should connect to that online server.

**Before:** Active notes said Cloudflare Containers was the host and Manufact was not used. The gap before deploy was described as the database connection plus the Cloudflare Container.

**After:** mcp-use stays the building kit. The internet host is not settled. No deploy was run. The server may go online before a database URL exists. The Inspector is not connected, because there is no public address yet.

**Checked:** cloud-crm-mcp has no Dockerfile and no Wrangler file. Not checked: a Cloudflare account, a Manufact account, or a live URL.

## 6 October 2026 — eval list copied into the new server tests

**Trigger:** The user asked why the plugin is still needed and why evals.json was not copied into the new server.

**Before:** The evaluation list lived only in candidate-search/tests/evals.json. One case said the server had no pagination.

**After:** An adapted copy is cloud-crm-mcp/test/evals.json. It expects cursor pages, rejects OFFSET separately from the old 200-row cap, and is marked as a test specification. It is not served as a skill. The original plugin remains the live connection to the old Worker because the new server has no public address.

**Checked:** The adapted file is read by cloud-crm-mcp tests. It was not run against MySQL.


## 6 October 2026 — offset and the 200-row cap stay separate

**Trigger:** The user asked to keep OFFSET and the old 200-row cap as two different bans, and said the scoring engine is still being checked.

**Before:** Free SQL rejected a LIMIT above 50, but it did not reject OFFSET. Active docs named TypeSafe as the phase-3 engine.

**After:** Free SQL rejects OFFSET with its own error. A LIMIT of 200 still fails because a page has at most 50 rows, and that error does not mention OFFSET. The next page still uses the cursor. Scoring stays in phase 3, but the engine is not chosen. The user is checking TypeSafe and a Cloudflare model they called Clef. That product name is not verified, and neither engine is installed.

**Checked:** `npm test` in `cloud-crm-mcp` passed with 8 tests. Not checked: MySQL, Cloudflare, or the product named Clef.

## 6 October 2026 — plugin skill and guides embedded

**Trigger:** The user asked to put the ChatGPT plugin schemas, plans, guides, and skills into the new MCP server.

**Before:** Those files lived only in `candidate-search/`. The server tool `crm_search_guide` returned five short rules. The plugin connection still names the old Worker.

**After:** `cloud-crm-mcp/skills/crm-kandidatensuche/` serves the skill, its references, and guide version 1.2.0. mcp-use discovers one skill and seven skill files. The server also exposes `crm://guides/crm_search_guide.json` and `crm://guides/crm_search_guide.md`. The embedded copy does not contain the old Worker address. Lists stay at 50 rows per page, and counts stay complete. The original plugin files are unchanged and still describe the live connection. `evals.json` was not copied. No database URL is set and nothing was deployed.

**Checked:** `npm test` passed with 7 tests. `npm run typecheck` passed. Skill discovery returned one clean skill. Not checked: MySQL, Cloudflare Containers, or a public URL.

## 6 October 2026 — separate read server started

**Trigger:** The user said to build the MCP server and to keep its infrastructure completely separate from the old server, including a different Hyperdrive if one is needed. The pasted Server Manager page is not part of that server.

**Before:** `cloud-crm-mcp/` was a blank mcp-use app. The old workshop lived under `server/src`.

**After:** `cloud-crm-mcp` registers the phase-1 read tools, including language filtering, profession variants, the search guide, and a next page for companies and orders. It refuses the old Worker host and the old Hyperdrive id. No database URL is set, no query ran, and nothing was deployed. `npm test` passed with 5 tests. `npm run typecheck` passed.

**Checked:** `npm test` and `npm run typecheck` in `cloud-crm-mcp`. Not checked: MySQL, Cloudflare Containers, or a public URL.

## 6 October 2026 — mcp-use kit installed

**Trigger:** The user asked to install mcp-use from its getting-started page.

**Before:** The decision named mcp-use, but the repository had no mcp-use project.

**After:** `cloud-crm-mcp/` was created with `create-mcp-use-app`  template `blank`, package `mcp-use` 2.7.3, and npm install. It registers no tools. `npm run dev` was not started. `npm run deploy` was not run. That script calls `mcp-use deploy`, which is the Manufact path and is not the chosen Cloudflare host.

**Checked:** The scaffold command exited 0 and `package.json` names `mcp-use` 2.7.3. No server process and no deploy.

## 6 October 2026 — mcp-use hosted on Cloudflare Containers

**Trigger:** The user said to use the chosen kit to build the server and deploy and host it on Cloudflare.

**Before:** DEC-2026-10-06-mcp-use chose mcp-use without Manufact, but no host. The notes said a normal Worker cannot run the Docker server.

**After:** The host is Cloudflare Containers. A Worker is the front door. The mcp-use image from its Dockerfile is the container. Manufact stays out. Containers are part of the Workers Paid plan. The published included amounts are 25 GiB-hours memory, 375 vCPU-minutes, and 200 GB-hours disk per month, then usage charges. Nothing was deployed. mcp-use's own docs do not list Cloudflare. Hyperdrive access from the container was not tested.

**Sources checked:** https://developers.cloudflare.com/containers/ and https://developers.cloudflare.com/containers/platform/pricing/

**Checked:** Documentation review follows this edit. Not checked: a container deploy or a MySQL connection.

## 6 October 2026 — mcp-use without Manufact

**Trigger:** The user chose mcp-use and asked why Manufact was required.

**Before:** DEC-2026-10-06-hosted-stack chose the official TypeScript MCP SDK on a new Cloudflare Worker and rejected mcp-use because its easy host is Manufact.

**After:** Decision DEC-2026-10-06-mcp-use replaces that framework choice. mcp-use is the server framework. Manufact is not required and is not chosen. The self-host guide says to run the built server in Docker on infrastructure the project controls, with TLS, a public address, and platform-managed secrets. No host was selected. Nothing was deployed. MySQL access from outside Hyperdrive remains unchecked.

**Source checked:** https://docs.mcp-use.com/v2/typescript/server/deployment/self-hosted.md

**Checked:** Documentation review follows this edit. Not checked: a Docker build, a public deploy, or a MySQL connection.

## 6 October 2026 — mcp-use objection does not change the host

**Trigger:** The user said they are not a coder and that mcp-use would spare them from connecting and wiring the server themselves.

**Before:** DEC-2026-10-06-hosted-stack already chose the official TypeScript MCP SDK on a new Cloudflare Worker. The reason was the existing Hyperdrive door to MySQL.

**After:** The decision stays. The user does not wire either option. Manufact, the easy mcp-use host, still needs a GitHub repository, a Manufact login, and its GitHub app. This folder has no Git remote. Cloudflare is already authenticated, so the new Worker does not add an account for the user. No deploy was made.

**Checked:** `git remote` printed no remote. Documentation review follows this edit.

## 6 October 2026 — hosted server and framework choice

**Trigger:** The user said the server must be online, hosted, and connected to the live MySQL database. FastMCP was not a settled rejection. The choice among the official MCP SDK, FastMCP, and mcp-use had to be the simplest for a beginner.

**Before:** The active plan already said to connect a new server to the existing MySQL database, but the only code was a local workshop. A Lena chat had recommended against FastMCP. That recommendation was not a user decision, and it was not written into the docs.

**After:** Decision `DEC-2026-10-06-hosted-stack`. The delivered server is a new Cloudflare Worker beside the current one, using Hyperdrive to the existing MySQL database. The framework is the official TypeScript MCP SDK. FastMCP 4.0.5 stays a Python server with its own HTTP host. mcp-use stays a TypeScript framework whose easy public deploy is Manufact. Neither is chosen. The local workshop is not deployed and does not become the product. Phases 2 through 5 stay included behind their gates. The first online read server still lacks the language filter, follow-up pages for companies, orders, and free SQL, and the tools `crm_resolve_beruf` and `crm_search_guide`.

**Sources checked:** FastMCP welcome and HTTP deployment docs, the mcp-use README and Manufact deployment page, and the existing Worker Hyperdrive binding. No new Worker was created. No live database query was run.

**Checked:** Documentation review and gate after this edit. Not checked: a real deploy or a MySQL connection.

## 6 October 2026 — phase 1 local read server started

**Trigger:** The user said to start after the eight points were marked included.

**Before:** The new server was only a plan. server/ had the specification and Inspector wrapper, no application source.

**After:** server/src now contains the phase 1 read behavior: candidate search with birth date and the EU filter, 50-row pages, full counts, profession report, company and order projections, table list and describe, and read-only free SQL. A query-string token is rejected. 17 local tests pass. MySQL is not connected. Nothing was deployed, and the live Worker was not changed. Phases 2 through 5 are still not built.

**Checked:** node --test in server/. The package validator was not rerun because the installable plugin files were not part of this code change.

## 6 October 2026 — eight points included, build split into phases

**Trigger:** The user marked the four attachment rows Ja for the new server and asked for all eight points to be written back, with the build split into phases.

**Before:** Birth date, the EU-citizen filter, free read-only SQL, and list/describe tables were already Ja in phase 1. Own screens and TypeSafe were later. Writes/export/import and ranking/photos/biometrics were not planned and could still be rejected.

**After:** Decision `DEC-2026-10-06-phased-scope`. All eight points are Ja on the new server. Phase 1 remains the read server. Phase 2 is own screens, including the later admin console. Phase 3 is TypeSafe. Phase 4 is writes, export, and import. Phase 5 is ranking, photos, and biometrics. None of this is built. The live Worker was not changed. Linear issue text was not changed. Phases 4 and 5 still have no evidenced legal or permission design, so they are not authorized on real personal data, photos, or biometric data. Gender, religion, health data, and ethnic origin stay prohibited.

**Checked:** Active plan, handover, specification, package rules, and the prepared search guide. Historical audits were not rewritten.

## 6 October 2026 — pages of 50, counts stay complete

**Trigger:** The user said the new server must have no MID, including no server default. The spoken word MID is recorded as the rejected server limit. Lists must not load 2000 candidates at once. Load 50 per page. A count, such as how many matching people exist, must return the full number and must not stop at 50.

**Before:** The plan said free SQL adds no limit and returns every requested row in one response.

**After:** A candidate list on the new server loads 50 rows per page and continues until no rows remain. It does not add a default limit that ends the result and does not return 2000 rows at once. A count returns the full number. Read-only `crm_query` uses the same split and does not append `LIMIT 200`. The example "Männer" was not added as an allowed filter. No server code was written.


## 6 October 2026 — the server adds no limit of its own

**Trigger:** The user said the server must not set its own limit. This is not a limit on people. The result is names, lists, and data. The sentence ended unfinished at "es ist nicht".

**Before:** The plan said free SQL returns one limited page so one call does not dump every row.

**After:** That server-side page cap is removed. Read-only `crm_query` stays. The new server does not invent a row or person limit and does not append `LIMIT 200`. A limit applies only when the request itself contains one. The downloaded company and assignment handlers still cap at 200; that cap was not extended to free SQL. No server code was written.


## 6 October 2026 — free SQL has no fixed end

**Trigger:** The user rejected a hard end for free SQL. A response has a page limit. If more rows exist, there is another page. The result ends only when no rows remain. One call must not dump every lead.

**Before:** `DEC-2026-10-06-sql-and-schema` said `crm_query` returns at most 200 rows.

**After:** That total cap is replaced. Read-only `crm_query` stays on the new server. Each call returns one page. There is no fixed end at 200 and no single response of every matching row. The next page continues until the data ends. The current handler's automatic `LIMIT 200` is not copied as that end. No page size number was newly chosen. No server code was written.


## 6 October 2026 — free SQL and table tools are yes

**Trigger:** The user said free SQL and listing or describing tables must both be yes on the new server. Free SQL stays capped.

**Before:** `crm_query`, `crm_list_tables`, and `crm_describe_table` were deferred with the later admin console, ACT-150.

**After:** Decision `DEC-2026-10-06-sql-and-schema`. The new server includes listing and describing allowed tables, and read-only `crm_query` with at most 200 rows. Free SQL is not the normal candidate search. The visual admin console remains later. No server code was written.

**Not verified:** no live query.


## 6 October 2026 — age bounds and missing birth dates

**Trigger:** The user answered the three age cases. Point 3 is acceptable. Point 1 asked how a missing birth date can be fixed. Point 2 asked which date categories can legitimately be in 2030.

**Before:** The one-sided bounds 0 and 150 were described as a possible defect. Future dates were discussed only as birth dates.

**After:** Decision `DEC-2026-10-06-age-bounds`. A missing lower age bound stays 0 and a missing upper bound stays 150. That is not an MCP defect. An explicit age from/to uses those exact completed years from `kandidat_datumrodjenja`. An empty birth date has no age and cannot be invented by the server. A future birth date is not an age. Work dates and any license or passport dates are separate. The handler SQL names only `kandidat_datumrodjenja`, `kri_darum_od`, and `kri_datum_do`. No live count of 2030 dates was run.

**Not verified:** database contents. Both known tokens were already recorded as HTTP 401.


## 6 October 2026 — non-EU search includes empty citizenship

**Trigger:** The user asked whether a non-EU search also returns people with no citizenship entered, and said that behavior is acceptable if so.

**Before:** The plan copied the handler rule but still described the empty field as an unresolved difference from a recorded non-EU citizenship.

**After:** Decision `DEC-2026-10-06-non-eu-empty`. `eu_buerger=false` includes an empty citizenship field. The user accepted that. `eu_buerger=true` still means the stored value starts with `EU`. The raw citizenship column stays out of the default output.

**Not verified:** no live query and no new server code.


## 6 October 2026 — profession report keeps no default language

**Trigger:** The user asked to build the described profession report into the new server.

**Before:** `crm_beruf_report` was named in the plan, but the plan did not say what the new server copies. The live handler silently uses `Njemački` when no language is given.

**After:** Decision `DEC-2026-10-06-beruf-report`. The new server includes `crm_beruf_report`: literal LIKE matches on `kri_pozicija`, archived status 3 excluded unless requested, a distinct candidate count, term groups that may exceed that count, and top positions with a default of 15 and a cap of 50. A listening breakdown is returned only for a language the user named. The silent German default is not copied. This is a planning decision. No server code was written.

**Updated:** server/SPEC.md, docs/open-work.md, docs/memory.md, the skill query rules and tool contracts, and the prepared search guide.

**Not verified:** no live CRM query and no implementation of the new server.


## 6 October 2026 — birth date and EU filter stay on the new server

**Trigger:** The user corrected the comparison. Geburtsdatum in der Suchliste and EU-Bürger filtern must both be yes for the new server.

**Before:** The active plan told the new server to drop `eu_buerger` and to keep the birth date out of candidate search rows. The skill, guide, and package check enforced that prohibition.

**After:** Decision `DEC-2026-10-06-search-fields`. The new server keeps `kandidat_datumrodjenja` in candidate search rows and accepts `eu_buerger`. `true` means `kandidat_drzavljanstvo_vrsta LIKE 'EU%'`. `false` also matches NULL, matching the current handler; NULL is not a recorded non-EU citizenship. The raw citizenship column, gender, religion, health data, and ethnic origin stay out. `SELECT *` and the query-string token stay out. This is a planning decision. The new server is not implemented, and the live Worker was not changed.

**Updated:** server/SPEC.md, docs/open-work.md, docs/memory.md, docs/project.md, the candidate-search skill and guide, scripts/validate_package.py, candidate-search/tests/evals.json, and README.md. Historical audits keep their findings and now point at this decision.

**Not verified:** no server code was written, and no live CRM query was run.


## 5 October 2026 — bundle behavior against the plugin

**Trigger:** The user said the improved Cloudflare MCP base is in this folder and asked for the project documents to be filled from the plugin and that source.

**Before:** The skill told agents not to use count_only or cursor and described every search as a 200-row cap. The handover said the bundle was not the base for the new server.

**After:** The local index.js hash matches the hash already recorded for the deployed script. Its candidate search implements exact counts, count_only, and cursor pages up to 1000. The same handler still filters citizenship and returns birth date. Company, assignment, and free SQL stay capped at 200. The skill rules and the roadmap now say to build on that search behavior. The instruction not to copy the birth date and eu_buerger was superseded on 6 October 2026 by DEC-2026-10-06-search-fields above. SELECT * and the query-string token stay excluded. The eleven tool names were read from this file, not from a live tools/list call.

**Not verified in this pass:** a fresh download of the deployed script, and a live MCP initialize. Both local tokens were already recorded as HTTP 401.

## 5 October 2026 — live stack checked

**Trigger:** The user asked to compare this handover with the other agent's notes and then verify the stack live, without guessing.

**Before:** The handover said the Worker host had not been queried again and that no live check had been made. It still treated the 4 October beta.6 assessment as the newest deployment.

**After:** The live Worker answers. Its current script is the same snapshot already in worker-source. The 5 October 04:13 UTC deployment updated the WORKER_API_KEY secret and did not add a second server. Both configured tokens return HTTP 401. The three stopped-agent handovers are still not in the repository. /tmp/cloud-crm-handover-2026-10-05.md only repeats the previous handover.

**Not verified:** Linear issue status through the API, the new secret's value, and the earlier report of 11 tools.

## 5 October 2026 — one session for the first server

**Trigger:** The user stopped three agents and asked this session to record its own documents, commit them, and prepare its handover. The three agent handovers were not delivered.

**Before:** The roadmap already started the new server at ACT-141 and left ACT-143 non-blocking. It did not say that one session owns that first server, and it did not record that the stopped agents never handed over.

**After:** docs/memory.md is the handover. It says the three handovers are missing, no live stack check was made for them, and no orchestrator is set up. docs/open-work.md now says one session writes the first server, and that separate work starts only with the later UI modules.

**Not verified in this pass:** the live Worker, the Linear API, and any files the three stopped agents may have changed.

## 5 October 2026 — planned scope and tracker place

**Trigger:** The user asked for an updated overview of what is planned and what is not, and asked whether the tracker is a repository project or a complete Linear project.

**Before:** The roadmap had the build order, but it did not state the snapshot decision or separate the first build from later and excluded work. The tracker was described by URL, without saying that the folder itself has no Git project.

**After:** `docs/open-work.md` now has the planned, later, and not-planned cut, and records that the tracker is a complete Linear project in team Activi. The local cache record names it Lena at `lena-1333951b31fb`. `docs/memory.md` says the downloaded bundle is not the base for the new server. Issue status was not reconfirmed through the Linear API.

## 5 October 2026 — local roadmap checked against the later decision

**Trigger:** The user required a fresh check of the documents before any build, because another session might have changed them.

**Before:** `docs/memory.md` and `server/SPEC.md` already said to build a new read-only server on the existing MySQL database and test it with real quotas and real read queries. `docs/open-work.md` still told the next session to start by reconciling the old Worker snapshot (`ACT-143`).

**After:** The recommended order in `docs/open-work.md` now follows the later decision: start with the new server at `ACT-141`, leave the live Worker untouched, and keep `ACT-143` as an open gap that does not block that build. `docs/memory.md` now says the Linear ticket list was not reconfirmed in this later check.

**Not verified in this pass:** the live Linear project. Composio was not used. The Linear API rejected the desktop session. The open Linear window belonged to a different issue, so its contents were not read.

## 5 October 2026 — handover records real read testing

**Trigger:** The user asked for a handover after rejecting synthetic-only acceptance.

**Before:** The handover said to build a new read-only server beside the live Worker, but it did not record that the user rejected Inspector-and-synthetic-data acceptance. server/SPEC.md still said synthetic data is used for automated tests, without the later decision.

**After:**

- docs/memory.md is the handover. It now says the new server connects to the existing MySQL database and is tested with real quotas and real read queries.
- The live Worker stays connected in parallel and is not modified.
- "Unicode Player" is recorded as a speech-to-text error, not a requirement.
- server/SPEC.md keeps synthetic fixtures and screenshots, and records the real-query acceptance decision beside them.
- No Linear issue was created and no real CRM query was run.

**Not verified:** live initialize, the spoken word "Quoten" beyond the user's own wording, and any real query result.

## 5 October 2026 — one name and one transition handover

**Trigger:** The user rejected the working title Lena and asked for every project, audit, and handover document to use the same current facts.

**Before:** Active documents used Lena as the project name. The handover still said to resolve the old Worker baseline before building. The earliest audits pointed at Lena as the current plan name.

**After:**

- Active documents now call this the Cloud CRM MCP project in folder MCP Plugin 2. The package name candidate-search is unchanged.
- The Linear URL stays the tracker. Its title Lena is recorded as rejected, with no replacement invented.
- docs/memory.md is the transition handover: build the new read-only server beside the live Worker, then switch only on request.
- Earliest audits and the September plan keep their dated findings and now point at project.md and memory.md for current names.
- The historical DOCX export was not regenerated.

**Not verified in this pass:** a fresh live initialize, a new project name, and a replacement of the live Worker.
## 5 October 2026 — reconcile the three project chats

**Trigger:** Three chats in this folder were working from different slices of the same Lena effort, and one was about to publish another Linear issue.

**Before:** `docs/open-work.md` described one shared beta credential and an Inspector HTTP 401. It did not record that Codex and the plugin read different environment variable names, or that those values differ. Serena `core` still said this repository contained no Worker source.

**After:**

- Confirmed Lena still has exactly ACT-140 through ACT-154, all Backlog, with no comments. The newest issue update remains ACT-144 at 04:05 UTC.
- Stopped the `/to-spec` chat before it created a sixteenth issue. The user had said the seam question was not understood; that is not approval.
- Recorded the credential split: Codex `crm-remote` uses `CRM_REMOTE_MCP_TOKEN`; the plugin and Inspector script use `CRM_CANDIDATE_MCP_TOKEN`. Both are set and the values differ. This session did not recheck the live initialize call.
- Corrected the Serena core note: `worker-source/` is a snapshot, `server/` is the Inspector workspace plus `server/SPEC.md`, and neither is a proven deployable replacement.

**Unchanged boundary:** No live Worker change, no deployment, no token value copied between variables, and no new Linear issue.

**Not yet verified here:** DNS from this session did not resolve the Worker host, so the Inspector 401 and the `crm-mysql` 1.1.0 report remain evidence from the earlier chats, not a new live result.

## 5 October 2026 — separate Lena project and complete roadmap

**Trigger:** The user required a new project named `Lena`, explicitly separate
from the existing project, and requested every discussed function and gap be
captured in Linear and project documentation before implementation.

**Before:** Planning mixed an older candidate-search scope with the broader MCP
application. The Worker snapshot had been downloaded, but some active text still
said source was absent. The broader UI, restricted query, semantic and high-risk
capabilities had no single local roadmap. Documentation lacked a machine-readable
coverage record and handoff.

**After:**

- Created the separate Linear project `Lena` and made `ACT-140` its root.
- Moved `ACT-140` through `ACT-146` into Lena and created `ACT-147` through `ACT-154` there.
- Defined complete read-only UI scope, the privileged query console, TypeSafe
  design work and explicit decision gates for mutations and sensitive use cases.
- Added a documentation index, local roadmap, setup guide, handoff, policy,
  sources and coverage record.
- Kept dated audits historical while connecting their remediation to Lena.
- Recorded that the Worker snapshot exists but is not a reproducible canonical source.
- Recorded Inspector HTTP 401 and the unresolved token-variable migration.

**Unchanged boundary:** No live Worker modification, deployment, real-data query,
or implementation authorization was performed.

**Checks:**

- `python3 scripts/validate_package.py candidate-search`: passed; five JSON
  files, manifest/connection consistency, local references, guide invariants,
  39 evaluation definitions and common credential/contact patterns checked.
- Skill Creator `quick_validate.py`: passed with `Skill is valid!`.
- Plugin Creator validator: not run because the documented local script path is
  absent on this host.
- Documentation coverage and Markdown structure: passed; 17 topics covered and
  90 documents checked.
- Content-review receipt and final documentation gate: passed after reviewing
  project identity, roadmap, Worker boundaries, specification, security,
  historical notes, sources, coverage and verification limits.
- External Inspector behavior remains blocked by HTTP 401; behavioral cases
  remain specifications rather than executed results.
