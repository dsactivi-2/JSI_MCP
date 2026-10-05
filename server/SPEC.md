# Cloud CRM MCP application

## Status

Expanded planning scope approved on 5 October 2026. Implementation and
production authorization remain open. The Linear tracker is https://linear.app/activi/project/lena-1333951b31fb. Its title Lena was rejected on 5 October 2026 and is not the product name. The scope root is
[ACT-140](https://linear.app/activi/issue/ACT-140/deliver-the-complete-cloud-crm-mcp-application-scope).

## Value Proposition

Provide a modular visual companion for conversational CRM work. The first
modules cover candidate search, profiles, profession resolution, profession
reports, companies, orders, and statistics. A separate administrative module
covers schema guidance and a strictly restricted `crm_query` console. Planned
semantic, export, mutation, employment-decision, photo, and biometric
capabilities remain behind explicit technical, human, and legal gates.

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
  positions, profession groups, and language distribution.
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
| `crm_search_kandidaten` | Search results, scope summary, exact count, cursor pagination | Remove prohibited citizenship filtering; minimize candidate projection; add output schema and annotations |
| `crm_kandidat_profile` | Deliberately loaded candidate detail | Replace `SELECT k.*` with an explicit field allowlist and authorization-aware projection |
| `crm_resolve_beruf` | Profession variants and counts | Bounded result size; no automatic expansion of a search |
| `crm_beruf_report` | Unique count, top positions, groups, language distribution | Bounded lists; explicit semantics for overlapping groups |
| `crm_search_companies` | Focused company search | Explicit output projection, tenant scope, bounded filters |
| `crm_search_nalozi` | Focused assignment/order search | Replace `SELECT *`; approve fields and authorization |
| `crm_stats` | Goal-specific summaries and small visualizations | Define exact semantics, sources, caps, and freshness |

### Restricted administrative module

| Tool | UI role | Mandatory gate |
| --- | --- | --- |
| `crm_search_guide` | Explain available schema and safe query patterns | Admin/query scope; no secrets or hidden policy data |
| `crm_list_tables` | List allowed relations | Admin/query scope; tenant-safe metadata only |
| `crm_describe_table` | Describe allowed fields | Admin/query scope; allowlisted relations only |
| `crm_query` | Execute a constrained read-only query | Dedicated admin scope, explicit confirmation, parser/allowlists, read-only principal, limits, timeout, rate limit, and audit |

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
| Restricted SQL fallback | Planned admin-only module | `ACT-150`; never ordinary candidate filtering |
| Table/schema exploration | Planned admin-only module | `ACT-150` |
| TypeSafe semantic toolset | Planned, not exposed | `ACT-151`; external contract and policy open |
| Exports, writes, imports, bulk actions | Decision-gated | `ACT-152`; no implementation authorization yet |
| Automated ranking/rejection and employment recommendations | Legal/product decision-gated | `ACT-153`; no implementation authorization yet |
| Photo or biometric processing | Legal/product decision-gated | `ACT-153`; may be rejected entirely |

## Data Contract and Privacy

- Tools remain fully useful without a rendered component.
- The component renders only `structuredContent` covered by explicit output
  schemas.
- Tool result `_meta` may carry component-only presentation data but is not an
  authorization boundary and must not carry credentials.
- Default candidate results exclude email, phone, address, birth date,
  documents, internal notes, citizenship, and other unnecessary personal data.
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
4. Remove `eu_buerger` and citizenship-based filtering.
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
- Candidate profile UI never renders prohibited fields.
- Profession resolution never changes the active search without explicit user
  action.
- Profession report labels overlapping groups and bounded lists accurately.
- Every UI-backed tool works in clients that do not render components.
- MCP Apps sandbox and ChatGPT developer-mode tests cover light/dark theme,
  narrow/wide layouts, empty states, partial data, large result counts, errors,
  and keyboard navigation.
- All 39 existing plugin evaluation cases are preserved and expanded with
  transport, schema, OAuth, cursor, privacy, and UI cases.

## Gated Future Capabilities

The following items are recorded in the roadmap because the user requested a
complete scope. Their presence here is not permission to implement or test them
with real data:

- TypeSafe-assisted matching, duplicate detection, profession classification,
  search-intent evaluation, and note review (`ACT-151`).
- Exports, CRM writes, imports, and bulk actions (`ACT-152`).
- Automated ranking, rejection, or employment recommendations (`ACT-153`).
- Photo processing and biometric comparison (`ACT-153`).

Each requires an approved contract, minimal scopes, data minimization,
confirmation behavior, auditability, human review, and applicable legal/privacy
approval. Until those gates are satisfied, the implemented product boundary
remains read-only and non-biometric.
