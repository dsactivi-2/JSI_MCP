# Cloud CRM MCP open work

Status date: 7 October 2026. The phase table below was decided on 6 October 2026 and was not changed on 7 October.

The Linear tracker at https://linear.app/activi/project/lena-1333951b31fb is authoritative for assignment and status. Its title Lena was rejected on 5 October 2026 and is not the product name. This file is the local roadmap. Do not place this work in the older Candidate Search project.

## Planned and not planned

This is the current cut. Ticket numbers stay in the table below.

Eight points on the new server, decision DEC-2026-10-06-phased-scope:

| Point | New server | Phase |
| --- | --- | --- |
| Birth date in the search list | Yes | 1 |
| EU-citizen filter | Yes | 1 |
| Free read-only SQL | Yes | 1; the visual console is phase 2 |
| List and describe tables | Yes | 1; the visual console is phase 2 |
| Own screens | Yes | 2 |
| Scoring | Yes, engine not chosen | 3 |
| Writes, export, import | Yes | 4 |
| Ranking, photos, biometrics | Yes | 5 |

Yes means included. It does not mean built.

Hosting decision DEC-2026-10-06-mcp-use, 6 October 2026. This replaces the framework choice in DEC-2026-10-06-hosted-stack.

The user chose mcp-use as the building kit. A note the same day named Cloudflare Containers and said Manufact was not used. Later the same day the user chose Manufact as the host for now. Cloudflare stays a later option. The product server is online, not a local process.

Checked on 6 October 2026 at 20:52 UTC: https://calm-forge-hk9rc.run.mcp-use.com/mcp is the running server. Active deployment c0be2dd3-77e8-46ac-824f-9942bc265c9f has been running since 16:42 UTC. /health returned 200. WorkOS discovery returned 200. A call without a token returned 401. /mcp/inspector returned 404. There is still no Dockerfile and no Wrangler file in cloud-crm-mcp.

Decision DEC-2026-10-06-same-database: the new server reads the same existing MySQL database through a new connection. It does not get a second database. The old Worker, its host, and its Hyperdrive id stay untouched. cloud-crm-mcp refuses that old host and that old Hyperdrive id. The phase-1 read tools are registered. The plugin skill and both search guides are served as guide version 1.2.0, without the old Worker address. CRM_DATABASE_URL is set. Deployment e97b45da proved one count: 122004 candidates, 117558 active, 1223 companies, and 238 orders. Running deployment 2a078755 has the same client.

The whole function list remains in scope. The first online server is the read server. Language filtering, follow-up pages, profession variants, and the search guide are now in the server code. The database is attached. Read tools use it when CRM_DATABASE_URL is present. Phases 2 through 5 stay included and stay behind their existing gates.

Already online and connected to MySQL:

- The hosted read-only mcp-use server is Manufact deployment 2a078755, beside the live Worker. One count on the same existing MySQL database is proven. Not the old Worker, not its Hyperdrive id, and not FastMCP.
- Reads for candidates, companies, orders, and statistics.
- `crm_beruf_report`: distinct candidate count, overlapping term groups, and top positions. The position list defaults to 15 and caps at 50. Archived status 3 stays excluded unless requested. A language breakdown is included only when a language is named. Do not default it to German or `Njemački`.
- `crm_list_tables` and `crm_describe_table`: list and describe the allowed tables. Decided yes for the new server on 6 October 2026.
- Candidate lists load 50 rows per page. The server adds no default limit that ends the result, and it does not load 2000 candidates in one response. The next page continues until no rows remain. A count returns the full number and does not stop at 50. Decided on 6 October 2026.
- `crm_query`: read-only free SQL follows the same split. A list is paged at 50. A count returns the full number. The server does not append `LIMIT 200`. It is not the normal candidate search.
- Tests with real quotas and real read queries. Synthetic Inspector cases are not the only acceptance.
- Start at ACT-141. Carry ACT-142 and ACT-144 before exposing broader modules.
- Birth date in every candidate search row, and the eu_buerger filter. false also includes an empty citizenship field.

Planned later, included on the new server, not in the first build:

Decision DEC-2026-10-06-phased-scope, 6 October 2026. These four points are Ja. They are not built.

- Phase 2, own screens: read-only UI modules, ACT-145 through ACT-149. The visual admin console, ACT-150, follows them and still waits for its security gate. The table and free-SQL tools themselves stay in the first server.
- Phase 3, scoring: ACT-151 still names TypeSafe. The engine is not chosen. The user is still checking TypeSafe and a Cloudflare model they called Clef. Core CRM search works without it.
- Phase 4, writes, export, and import: ACT-152, including the bulk actions already grouped there.
- Phase 5, ranking, photos, and biometrics: ACT-153, including the employment-decision scope already grouped there. No evidenced legal review yet, so this phase is not authorized on real photos or biometric data.
- Inspector, evaluation, and release evidence, ACT-154, stays with every phase that is actually built.
- Provenance of the downloaded bundle, ACT-143. It stays open and does not block the new server.

Not planned:

- Deploying the downloaded bundle unchanged. The new server starts from worker-source/crm-pipedrive-worker/src/index.js and keeps its candidate search behavior: exact counts, count_only, cursor pages, the eu_buerger filter, and the birth date in search rows. It must still remove SELECT * on assignments, the query-string token, and the lack of OAuth and tenant roles. The file is still a bundle, not an original TypeScript project.
- Repairing, redeploying, or replacing the live Worker before the user asks for the switch.
- Renaming the installable package `candidate-search`.
- Moving this work into the older Candidate Search Linear project.
- Inventing a replacement for the rejected title Lena.

## Who writes the first build

One session writes the new server. It starts at ACT-141 and carries ACT-142 and ACT-144 before any broader module. A second session must not edit that same server at the same time. No orchestrator is in place. The later UI modules, ACT-145 through ACT-149, are the first work that can be split, and only after the new server can read candidates, companies, orders, and statistics.

## Where the tracker lives

The tracker is a complete Linear project in the Activi team. It is not a project inside this Git repository, and it is not the older Candidate Search project. The local Linear cache read on 5 October 2026 contains the project record: name Lena, address `lena-1333951b31fb`, team key ACT, created 2026-10-05 03:54 UTC, description "Separate Cloud CRM MCP application, UI, security, and documentation project." This folder is on branch `codex/cloud-crm-baseline` and has no Git remote, so nothing here is a GitHub project. The issue rows in the table were not in that cache record and were not reconfirmed through the Linear API in this check.

## Program scope

| Issue | Workstream | Current state | Exit condition |
| --- | --- | --- | --- |
| [ACT-140](https://linear.app/activi/issue/ACT-140/deliver-the-complete-cloud-crm-mcp-application-scope) | Complete Cloud CRM MCP program | Backlog parent | All required children accepted or explicitly declined |
| [ACT-141](https://linear.app/activi/issue/ACT-141/migrate-worker-to-stateless-typescript-mcp-sdk-v2) | Read server on mcp-use | Manufact deployment 2a078755 is running. One count is proven. Candidate rows were not read. Linear text was not changed. | Real reads of candidates, companies, and orders |
| [ACT-142](https://linear.app/activi/issue/ACT-142/implement-oauth-21-tenant-isolation-and-tool-scopes) | OAuth 2.1, tenant isolation, roles/scopes | WorkOS Staging discovery is live on deployment c0be2dd3. A chat screenshot showed Manufact connected as ds@activi.io; that login was not repeated at 20:52 UTC. Roles are not enforced in tool handlers. No tenant isolation. | A missing crm:read or sql:read claim is rejected per tool, and tenants stay separated |
| [ACT-143](https://linear.app/activi/issue/ACT-143/reconcile-worker-source-provenance-and-deployable-baseline) | Worker provenance and reproducible baseline | Downloaded bundle exists; provenance open | Canonical source, lockfile, build and deployment relation verified |
| [ACT-144](https://linear.app/activi/issue/ACT-144/harden-projections-schemas-privacy-and-restricted-query) | Schemas, projections, privacy and query hardening | Audit findings open | No `SELECT *`; explicit schemas, request/response byte limits, caps, parser/allowlists and safe errors |
| [ACT-145](https://linear.app/activi/issue/ACT-145/build-profession-resolution-and-report-ui) | Profession resolution/report UI | Included, phase 2; not built | Bounded, accessible UI with explicit search-expansion consent |
| [ACT-146](https://linear.app/activi/issue/ACT-146/build-candidate-search-and-minimized-profile-ui) | Candidate search/profile UI | Included, phase 2; not built | Filters, cursors, archive scope and minimized profile verified |
| [ACT-147](https://linear.app/activi/issue/ACT-147/build-goal-specific-crm-statistics-ui) | Goal-specific statistics UI | Included, phase 2; not built | Each metric has defined semantics, source, freshness and bounds |
| [ACT-148](https://linear.app/activi/issue/ACT-148/build-safe-assignment-and-order-ui) | Assignment/order UI | Included, phase 2; not built | Explicit projection and tenant-safe bounded result UI |
| [ACT-149](https://linear.app/activi/issue/ACT-149/build-company-search-ui) | Company-search UI | Included, phase 2; not built | Explicit schema, bounded filters and accessible result UI |
| [ACT-150](https://linear.app/activi/issue/ACT-150/build-admin-only-schema-explorer-and-restricted-crm-query-console) | Admin schema explorer and `crm_query` | Included, phase 2; not built; privileged | Dedicated scope, confirmation, parser, limits, timeout, rate limit and audit |
| [ACT-151](https://linear.app/activi/issue/ACT-151/design-and-gate-typesafe-semantic-capabilities) | TypeSafe semantic capabilities | Included, phase 3; not built | Contract, privacy, calibration and mandatory human review recorded before code |
| [ACT-152](https://linear.app/activi/issue/ACT-152/decide-and-design-exports-writes-imports-and-bulk-actions) | Exports, writes, imports, bulk actions | Included, phase 4; not built | Product, permission, audit, rollback and legal design recorded before real-data work |
| [ACT-153](https://linear.app/activi/issue/ACT-153/decide-legal-and-product-boundaries-for-ranking-employment-decisions-photos-and-biometrics) | Ranking, employment decisions, photos, biometrics | Included, phase 5; not built | Included on 6 October 2026. Design and legal review still required before real photos or biometric data |
| [ACT-154](https://linear.app/activi/issue/ACT-154/add-inspector-evals-observability-release-and-documentation-gates) | Inspector, evals, observability, release and docs | Partial setup; endpoint returns 401 | Reproducible sanitized evidence and release gates pass |

## Product boundary

Normal filtering by name, age, profession, language, language level and archive
state belongs to `crm_search_kandidaten`. `crm_query` is not required for that
flow. It is included only as a separately authorized administrative fallback.

The requested broader scope is fully represented above. On 6 October 2026 the user included own screens, TypeSafe scoring, writes/export/import, and ranking/photos/biometrics on the new server. That decision does not build them and does not put them in phase 1. Phases 4 and 5 still need their design before real-data work. Linear issue text was not changed in this update.

## Dependencies and recommended order

The first four steps were set on 5 October 2026. Steps 5 through 8 were added on 6 October 2026. This order replaces the earlier plan that started by reconciling the downloaded Worker snapshot.

1. The new read-only server is online beside the live Worker (`ACT-141`) and one count on the same existing MySQL database is proven. Do not create a second database, and do not repair or redeploy the current Worker.
2. Keep the first version to candidates, companies, orders, statistics, the profession report, allowed table listing and description, candidate lists paged at 50 with no server-imposed end, exact counts that do not stop at 50, and read-only free SQL with the same split. Test it with real quotas and real read queries. Synthetic Inspector cases are not the only acceptance.
3. Carry the security foundations that this new server needs (`ACT-142`, `ACT-144`) before exposing broader modules.
4. Leave `ACT-143` as an open provenance gap for the downloaded snapshot. It does not block the new server.
5. Phase 2: build the own screens (`ACT-145` through `ACT-149`) after the new server can read the four areas above. Build the privileged query screen only after its security gate (`ACT-150`).
6. Phase 3: build scoring after the user chooses the engine (`ACT-151`). Core search must keep working without it.
7. Phase 4: build writes, export, and import (`ACT-152`) only after the permission, audit, and rollback design exists.
8. Phase 5: build ranking, photos, and biometrics (`ACT-153`) only after the design and legal review exist. Do not run that phase on real photos or biometric data before then.

## Known blockers

- The downloaded production bundle is not yet a reproducible canonical source tree.
- On 5 October 2026 at 07:17 UTC the live Worker returned HTTP 401 for an unauthenticated initialize and for both CRM_REMOTE_MCP_TOKEN and CRM_CANDIDATE_MCP_TOKEN. The tool list could not be read. A deployment at 04:13 UTC the same day updated the WORKER_API_KEY secret without changing the script bytes.
- Codex `crm-remote` points at the new Manufact server and is switched off locally with `enabled = false`. `candidate-search/.mcp.json` names that server and stores no token. `server/scripts/start-inspector.sh` still reads `CRM_CANDIDATE_MCP_TOKEN`. Which value the live Worker accepts has not been rechecked.
- The live Worker lacks reviewed OAuth 2.1 identity, tenant and scope enforcement.
- The old local Inspector script still names `CRM_CANDIDATE_MCP_TOKEN`. The live Manufact login is WorkOS, not that variable.
- The old Worker still must not be changed. The new Manufact server is deployed and its count works.
- The tracker still contains exactly ACT-140 through ACT-154, all in Backlog. No sixteenth issue was published. A question the user did not understand is not approval to add another spec.
- The new server can count CRM data. Candidate rows were not read. Codex crm-remote points at the new server and is switched off. The old Worker was not changed.
