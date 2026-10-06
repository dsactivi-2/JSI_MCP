# Cloud CRM MCP application

## Status

Expanded planning scope approved on 5 October 2026. A local phase-1 workshop exists under server/src and is covered by local tests. It is not the hosted server. The hosted server is cloud-crm-mcp on Manufact at https://calm-forge-hk9rc.run.mcp-use.com/mcp, deployment c0be2dd3, checked running on 6 October 2026 at 20:52 UTC. It is not connected to MySQL. Decision DEC-2026-10-06-mcp-use selects mcp-use. Manufact is the temporary host. Decision DEC-2026-10-06-same-database means a new connection to the same existing MySQL database, not a second database. The Linear tracker is https://linear.app/activi/project/lena-1333951b31fb. Its title Lena was rejected on 5 October 2026 and is not the product name. The scope root is
[ACT-140](https://linear.app/activi/issue/ACT-140/deliver-the-complete-cloud-crm-mcp-application-scope).

## Value Proposition

Provide a modular visual companion for conversational CRM work. The first
modules cover candidate search, profiles, profession resolution, profession
reports, companies, orders, and statistics. A separate administrative module
covers schema guidance and a strictly restricted `crm_query` console. Own
screens, TypeSafe scoring, writes/export/import, and ranking, photos, and
biometrics are included in later phases of the same new server. They are not
in the first build, and they are not implemented.

### Target users

- Authorized recruiters and CRM users searching for candidates.
- Administrators and developers validating the MCP server through Inspector.

### Current pain

- Tool results are currently presented mainly as text or raw JSON.
- Search scope, result caps, cursors, and data-quality caveats are easy to miss.
- Full-profile and generic-query paths can expose more data than a visual search
  workflow needs.
- The current Worker has no MCP Apps UI resource.

### Core actions

1. Search and page through candidates with visible filters and result scope.
2. Deliberately select one candidate and load a minimized candidate profile.
3. Resolve profession wording and inspect a bounded profession report.
4. Search companies and assignments/orders in separate focused views.
5. Inspect goal-specific CRM statistics.
6. For authorized administrators only, inspect schema guidance and execute a
   constrained, audited, read-only query.

## Why an LLM

### Conversational win

Users can describe combined profession, language, age, archive, and name filters
in ordinary German, B/H/S, or English instead of locating every database field
or constructing SQL.

### What the LLM contributes

- Interprets natural-language search intent.
- Selects the narrowest suitable read-only tool.
- Explains scope, incomplete data, caps, and ambiguous profession terminology.
- Keeps the visual result connected to the surrounding conversation.

### What the LLM lacks

- Direct access to CRM data without the authenticated MCP server.
- Authority to broaden scope, bypass privacy policy, or infer missing CRM facts.
- A safe basis for exposing arbitrary SQL, hidden fields, or tenant-unscoped data.

## UI Overview

### First view

The component appears after a candidate-search tool call and shows:

- the active search filters;
- exact total count when supplied by the server;
- returned row count and page size;
- archive inclusion state;
- live-result consistency notice;
- a compact candidate table or responsive card list.

The component is not a standalone dashboard and does not fetch CRM data on load.

### Candidate result interactions

- Page forward with `next_cursor` while preserving the original filters.
- Select a candidate to request a minimized profile through
  `crm_kandidat_profile`.
- Clearly distinguish unknown values from negative or absent values.
- Show only server-allowlisted fields returned by the tool.

### Profession interactions

- Use `crm_resolve_beruf` to display bounded profession-title variants.
- Require an explicit user action before a resolved variant broadens or changes
  the candidate search.
- Use `crm_beruf_report` to show the unique candidate count, bounded top
  positions, profession groups, and a language distribution.
- The report searches literal position text with LIKE. It is not a verified
  profession ID. Archived status 3 stays excluded unless requested.
- Group counts may add up to more than the unique total, because one candidate
  can match more than one term.
- Top positions default to 15 and never exceed 50.
- A language breakdown is included only when the user names the language.
  Do not default it to German or `Njemački`.
- Present the report as a compact summary, list, or small chart, not a dashboard.

### End state

The user has a reviewable result set or minimized candidate profile and can
continue the conversation, load the next page, refine the search, resolve a
profession label, or request a profession report.

Other modules conclude with a bounded company/order result, a defined statistic,
or an administrative query result. They do not silently trigger writes, exports,
bulk actions, ranking, rejection, biometric processing, or external evaluation.

## Product Context

- **Plugin:** `candidate-search`, version `0.1.0-beta.2`.
- **MCP endpoint:**
  `https://crm-pipedrive-worker.6f484zn9bd.workers.dev/mcp`.
- **Current authentication:** shared beta bearer token. The target environment
  variable is `CRM_REMOTE_MCP_TOKEN`; existing beta files still use the older
  `CRM_CANDIDATE_MCP_TOKEN` name and require coordinated migration. No token may
  enter a URL, tool argument, UI result, log, source file, or committed
  configuration.
- **Target authentication:** OAuth 2.1 with verified subject, tenant, audience,
  role, and minimal tool scopes.
- **Current transport:** legacy Streamable HTTP through a Durable Object; legacy
  SSE is also deployed.
- **Target transport:** stateless TypeScript MCP SDK v2 on the exact `/mcp`
  route.
- **Hosting:** Cloudflare Worker.
- **Development UI:** MCP Inspector 2.9.0 and its MCP Apps sandbox.

## Planned UI Modules

### Core user modules

| Tool | UI role | Preconditions |
| --- | --- | --- |
| `crm_search_kandidaten` | Search results, scope summary, exact count, cursor pagination | Keep the `eu_buerger` filter and the birth date in search rows; minimize the other candidate fields; add output schema and annotations |
| `crm_kandidat_profile` | Deliberately loaded candidate detail | Replace `SELECT k.*` with an explicit field allowlist and authorization-aware projection |
| `crm_resolve_beruf` | Profession variants and counts | Bounded result size; no automatic expansion of a search |
| `crm_beruf_report` | Unique count, top positions, groups, language distribution | LIKE on position text; groups may overlap the unique total; top positions default 15 and cap at 50; language breakdown only when a language is named, never default German |
| `crm_search_companies` | Focused company search | Explicit output projection, tenant scope, bounded filters |
| `crm_search_nalozi` | Focused assignment/order search | Replace `SELECT *`; approve fields and authorization |
| `crm_stats` | Goal-specific summaries and small visualizations | Define exact semantics, sources, caps, and freshness |

### Restricted administrative module

| Tool | UI role | Mandatory gate |
| --- | --- | --- |
| `crm_search_guide` | Explain available schema and safe query patterns | Admin/query scope; no secrets or hidden policy data |
| `crm_list_tables` | List allowed relations | Yes on the new server; allowed relations only |
| `crm_describe_table` | Describe allowed fields | Yes on the new server; allowlisted relations only |
| `crm_query` | Execute a constrained read-only query | Yes on the new server; one read-only SELECT. A list is paged at 50. A count returns the full number and does not stop at 50. `LIMIT 200` is not appended. Not the normal candidate search |

`crm_query` is included in the product plan, but it is not the ordinary candidate
filter. Normal name, age, profession, language, level, and archive filtering uses
`crm_search_kandidaten`. The query console is a separate privileged surface.

## Current Plugin-to-Planned-UI Coverage

| Existing plugin behavior | UI v1 status | Notes |
| --- | --- | --- |
| Candidate search and filtering | Included | Primary view |
| Candidate count | Included when returned with search | Count-only requests remain useful without UI |
| Candidate profile | Included with deliberate selection | Server projection must be minimized first |
| Profession mapping/variant discovery | Included | Never expands scope silently |
| Profession report | Included | Optional scope explicitly approved for v1 |
| Language-level filtering | Included | Listening-level semantics remain server-defined |
| Cursor pagination | Included | Preserve filters across pages |
| Archived-record control | Included and visibly labelled | Archived excluded by default |
| Company search | Planned module | `ACT-149` |
| Assignment/order search | Planned module | `ACT-148`; projection hardening first |
| Generic CRM statistics | Planned goal-specific module | `ACT-147` |
| Restricted SQL fallback | Yes on the new server; lists paged at 50, counts complete | `ACT-150` remains the later visual console; never ordinary candidate filtering |
| Table/schema exploration | Yes on the new server | `crm_list_tables` and `crm_describe_table`; the visual console stays `ACT-150` |
| TypeSafe semantic toolset | Yes, phase 3 | `ACT-151`; included on 6 October 2026; not built; core search works without it |
| Exports, writes, imports, bulk actions | Yes, phase 4 | `ACT-152`; included on 6 October 2026; design still required before code |
| Automated ranking/rejection and employment recommendations | Yes, phase 5 | `ACT-153`; included with photos and biometrics; no silent automatic rejection |
| Photo or biometric processing | Yes, phase 5 | `ACT-153`; included; no evidenced legal review yet, so not authorized on real photos |

## Data Contract and Privacy

- Tools remain fully useful without a rendered component.
- The component renders only `structuredContent` covered by explicit output
  schemas.
- Tool result `_meta` may carry component-only presentation data but is not an
  authorization boundary and must not carry credentials.
- Candidate search rows include the birth date `kandidat_datumrodjenja`.
  This was decided on 6 October 2026. An age-only count does not return that date.
- Age is calculated only from that birth date, in completed years. An empty birth
  date has no age and does not match an age filter. A future birth date does not
  produce an age. If only one age bound is given, the other bound stays at the
  current handler defaults, 0 and 150. The user accepted that on 6 October 2026.
  An explicit from/to uses exactly those bounds.
- A candidate list returns 50 rows per page. The server does not add a default
  limit that ends the result and does not return 2000 candidates in one response.
  Further pages continue until no rows remain. A count returns the full number
  and does not stop at 50.
- Candidate search accepts `eu_buerger`. `true` means
  `kandidat_drzavljanstvo_vrsta LIKE 'EU%'`. `false` follows the current handler
  and also matches an empty citizenship field. On 6 October 2026 the user accepted that:
  searching for non-EU citizens includes people with no citizenship entered.
  Residence or work location remains a separate filter.
- Default candidate results still exclude email, phone, address, documents,
  internal notes, and the raw citizenship column.
- A minimized profile exposes only fields required for the authorized user goal.
- The server enforces user, tenant, role, scope, archive, row-limit, and field
  rules before returning data.
- Unknown data must not be converted into a negative match.
- Synthetic data is used for UI fixtures, screenshots, and automated tests.
- On 5 October 2026 the user rejected synthetic-only acceptance for the new server. That server is connected to the existing MySQL database and is tested with real quotas and real read queries. Committed fixtures and screenshots still use synthetic data and must not contain real personal data. This does not authorize writes or changes to the live Worker.

## MCP Apps Architecture

- Register versioned UI resources for candidate results and profession reports.
- Associate selected tools with UI resources using `_meta.ui.resourceUri`.
- Use the MCP Apps `ui/*` JSON-RPC bridge for tool input, tool results, tool
  calls, follow-up messages, and model-visible context.
- Feature-detect optional ChatGPT-only extensions and provide portable MCP Apps
  behavior first.
- Do not branch on the host product name.
- Keep the component self-contained and declare a restrictive content security
  policy.
- The UI must never receive or manage the CRM bearer token.

## Security Preconditions for Real CRM Data

1. Remove URL query-token authentication.
2. Replace shared bearer authentication with reviewed OAuth 2.1 account linking.
3. Enforce subject, tenant, role, audience, expiry, revocation, and tool scopes.
4. Keep the `eu_buerger` filter on candidate search. Do not add a free filter or default output for the raw citizenship column. Gender, religion, health data, and ethnic origin stay prohibited.
5. Replace `SELECT *` in profile and assignment paths with explicit projections.
6. Move `crm_query` behind a separate admin/query scope and harden it before UI exposure.
7. Add explicit output schemas and accurate read-only annotations.
8. Use exact route matching and validated Host and Origin allowlists.
9. Apply request/response byte limits, query timeouts, result bounds, rate limits, safe errors, and redacted
   logs.

## Testing and Acceptance

- MCP Inspector initializes successfully and lists the expected tools.
- Oversized request bodies and oversized generated responses fail safely before
  costly parsing, database work, or data exposure.
- Invalid, missing, expired, revoked, wrong-audience, wrong-tenant, and
  insufficient-scope credentials fail closed.
- Candidate search UI renders synthetic results and pagination correctly.
- Server acceptance also includes real read queries and real quotas against the connected MySQL database. Synthetic UI rendering does not replace that check.
- Candidate profile UI never renders gender, religion, health data, ethnic origin, or the raw citizenship column. The search list includes the birth date, and a profile may include that same field.
- Profession resolution never changes the active search without explicit user
  action.
- Profession report labels overlapping groups and bounded lists accurately.
- Every UI-backed tool works in clients that do not render components.
- MCP Apps sandbox and ChatGPT developer-mode tests cover light/dark theme,
  narrow/wide layouts, empty states, partial data, large result counts, errors,
  and keyboard navigation.
- The existing plugin evaluation cases are preserved, including the profession-report case, and expanded with
  transport, schema, OAuth, cursor, privacy, and UI cases.

## Later phases

Decision `DEC-2026-10-06-phased-scope`, 6 October 2026. All eight points are
included on the new server. Inclusion is not implementation. Phase-1 read
tools exist in cloud-crm-mcp and are deployed, but they have no database
connection and no proven CRM read. Phases 2 through 5 have no implementation.
The old Worker is unchanged.

Phase 1, the first build:

- Birth date in every candidate search row.
- The `eu_buerger` filter. `false` also includes an empty citizenship field.
- Read-only `crm_query`. A list is paged at 50. A count returns the full number.
- `crm_list_tables` and `crm_describe_table`.

Later phases, included and not built:

- Phase 2: own screens for the read tools (`ACT-145` through `ACT-149`). The visual admin console remains `ACT-150` and still waits for its security gate.
- Phase 3: TypeSafe scoring, including matching, duplicate hints, profession classification, search-intent evaluation, and note review (`ACT-151`). Core CRM search works without it.
- Phase 4: writes, export, and import, including the bulk actions already grouped in `ACT-152`.
- Phase 5: ranking, photos, and biometrics, including the employment-decision scope already grouped in `ACT-153`.

The earlier wording that phases 3 through 5 were only decision gates, and might be rejected, is replaced by this decision. A written legal review, permission model, audit trail, and rollback design are still not evidenced. That missing design does not take the points back out. It means phases 4 and 5 are not authorized to run on real personal data, photos, or biometric data until that design exists.

Gender, religion, health data, and ethnic origin stay prohibited in every phase. Ranking must not use them. Photos must not be used to infer them. A disagreement between a semantic score and the user still goes to a person. These phases do not add silent automatic rejection or silent record merges.
