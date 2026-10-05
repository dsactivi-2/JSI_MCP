# Cloud CRM MCP open work

Status date: 5 October 2026

The Linear tracker at https://linear.app/activi/project/lena-1333951b31fb is authoritative for assignment and status. Its title Lena was rejected on 5 October 2026 and is not the product name. This file is the local roadmap. Do not place this work in the older Candidate Search project.

## Planned and not planned

This is the current cut. Ticket numbers stay in the table below.

Planned for the first build:

- A new read-only server beside the live Worker, connected to the existing MySQL database.
- Reads for candidates, companies, orders, and statistics.
- Tests with real quotas and real read queries. Synthetic Inspector cases are not the only acceptance.
- Start at ACT-141. Carry ACT-142 and ACT-144 before exposing broader modules.

Planned later, not in the first build:

- Read-only UI modules, ACT-145 through ACT-149.
- The privileged query console, ACT-150, only after its security gate.
- The TypeSafe design gate, ACT-151.
- Decision gates for exports and writes, ACT-152, and for ranking, photos, and biometrics, ACT-153.
- Inspector, evaluation, and release evidence, ACT-154.
- Provenance of the downloaded bundle, ACT-143. It stays open and does not block the new server.

Not planned:

- Building the new server from the downloaded snapshot. That snapshot is `worker-source/crm-pipedrive-worker/wrangler.jsonc` plus one bundled `src/index.js` of about 3.8 MB. It has no original TypeScript project, tests, or lockfile, and it carries the known release blockers.
- Repairing, redeploying, or replacing the live Worker before the user asks for the switch.
- Exports, writes, imports, bulk actions, ranking, employment decisions, photos, and biometrics.
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
| [ACT-141](https://linear.app/activi/issue/ACT-141/migrate-worker-to-stateless-typescript-mcp-sdk-v2) | Stateless TypeScript MCP SDK v2 | Not implemented | Exact `/mcp` route, standards-compliant lifecycle, tested transport |
| [ACT-142](https://linear.app/activi/issue/ACT-142/implement-oauth-21-tenant-isolation-and-tool-scopes) | OAuth 2.1, tenant isolation, roles/scopes | Not implemented; release blocker | Negative auth matrix fails closed per request and tool |
| [ACT-143](https://linear.app/activi/issue/ACT-143/reconcile-worker-source-provenance-and-deployable-baseline) | Worker provenance and reproducible baseline | Downloaded bundle exists; provenance open | Canonical source, lockfile, build and deployment relation verified |
| [ACT-144](https://linear.app/activi/issue/ACT-144/harden-projections-schemas-privacy-and-restricted-query) | Schemas, projections, privacy and query hardening | Audit findings open | No `SELECT *`; explicit schemas, request/response byte limits, caps, parser/allowlists and safe errors |
| [ACT-145](https://linear.app/activi/issue/ACT-145/build-profession-resolution-and-report-ui) | Profession resolution/report UI | Planned | Bounded, accessible UI with explicit search-expansion consent |
| [ACT-146](https://linear.app/activi/issue/ACT-146/build-candidate-search-and-minimized-profile-ui) | Candidate search/profile UI | Planned | Filters, cursors, archive scope and minimized profile verified |
| [ACT-147](https://linear.app/activi/issue/ACT-147/build-goal-specific-crm-statistics-ui) | Goal-specific statistics UI | Planned | Each metric has defined semantics, source, freshness and bounds |
| [ACT-148](https://linear.app/activi/issue/ACT-148/build-safe-assignment-and-order-ui) | Assignment/order UI | Planned | Explicit projection and tenant-safe bounded result UI |
| [ACT-149](https://linear.app/activi/issue/ACT-149/build-company-search-ui) | Company-search UI | Planned | Explicit schema, bounded filters and accessible result UI |
| [ACT-150](https://linear.app/activi/issue/ACT-150/build-admin-only-schema-explorer-and-restricted-crm-query-console) | Admin schema explorer and `crm_query` | Planned; privileged | Dedicated scope, confirmation, parser, limits, timeout, rate limit and audit |
| [ACT-151](https://linear.app/activi/issue/ACT-151/design-and-gate-typesafe-semantic-capabilities) | TypeSafe semantic capabilities | Decision/design gate | Contract, privacy, calibration and mandatory human review approved |
| [ACT-152](https://linear.app/activi/issue/ACT-152/decide-and-design-exports-writes-imports-and-bulk-actions) | Exports, writes, imports, bulk actions | Decision gate; no implementation authority | Product, permission, audit, rollback and legal design approved |
| [ACT-153](https://linear.app/activi/issue/ACT-153/decide-legal-and-product-boundaries-for-ranking-employment-decisions-photos-and-biometrics) | Ranking, employment decisions, photos, biometrics | Legal/product gate; may be rejected | Written approval or explicit rejection before any real-data work |
| [ACT-154](https://linear.app/activi/issue/ACT-154/add-inspector-evals-observability-release-and-documentation-gates) | Inspector, evals, observability, release and docs | Partial setup; endpoint returns 401 | Reproducible sanitized evidence and release gates pass |

## Product boundary

Normal filtering by name, age, profession, language, language level and archive
state belongs to `crm_search_kandidaten`. `crm_query` is not required for that
flow. It is included only as a separately authorized administrative fallback.

The requested broader scope is fully represented above. Representation does
not authorize implementation of mutations, exports, bulk operations,
employment ranking/rejection, photos, or biometrics. Those items stay blocked
until their issue-specific gates are approved.

## Dependencies and recommended order

The order below is the current build decision from 5 October 2026. It replaces the earlier plan that started by reconciling the downloaded Worker snapshot.

1. Build a new read-only server beside the live Worker (`ACT-141`), connected to the existing MySQL database. Do not repair or redeploy the current Worker.
2. Keep the first version to candidates, companies, orders, and statistics. Test it with real quotas and real read queries. Synthetic Inspector cases are not the only acceptance.
3. Carry the security foundations that this new server needs (`ACT-142`, `ACT-144`) before exposing broader modules.
4. Leave `ACT-143` as an open provenance gap for the downloaded snapshot. It does not block the new server.
5. Build the read-only user modules (`ACT-145` through `ACT-149`) after the new server can read the four areas above.
6. Build the privileged query module only after its security gate (`ACT-150`).
7. Decide semantic and high-risk future capabilities (`ACT-151` through `ACT-153`).

## Known blockers

- The downloaded production bundle is not yet a reproducible canonical source tree.
- On 5 October 2026 at 07:17 UTC the live Worker returned HTTP 401 for an unauthenticated initialize and for both CRM_REMOTE_MCP_TOKEN and CRM_CANDIDATE_MCP_TOKEN. The tool list could not be read. A deployment at 04:13 UTC the same day updated the WORKER_API_KEY secret without changing the script bytes.
- Codex `crm-remote` reads `CRM_REMOTE_MCP_TOKEN`. `candidate-search/.mcp.json` and `server/scripts/start-inspector.sh` still read `CRM_CANDIDATE_MCP_TOKEN`. On this machine both variables are set and their values differ. Which value the live Worker accepts has not been rechecked from the reconciliation session.
- The live Worker lacks reviewed OAuth 2.1 identity, tenant and scope enforcement.
- Existing beta configuration still uses `CRM_CANDIDATE_MCP_TOKEN`; the target
  name is `CRM_REMOTE_MCP_TOKEN` and requires one coordinated migration.
- No production change or deployment is authorized by this planning phase.
- The tracker still contains exactly ACT-140 through ACT-154, all in Backlog. No sixteenth issue was published. A question the user did not understand is not approval to add another spec.
- The next build is a new server beside the live Worker. The first version reads candidates, companies, orders, and statistics. The live Worker stays untouched until that new server works and the user asks for the switch.
