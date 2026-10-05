# MCP tool contracts and implementation status

The server should expose focused read-only tools rather than arbitrary database access. Existing expected tools include `crm_search_kandidaten`, `crm_kandidat_profile`, `crm_stats`, `crm_beruf_report`, `crm_resolve_beruf`, `crm_search_companies`, `crm_search_nalozi`, `crm_search_guide`, `crm_list_tables`, `crm_describe_table`, and restricted `crm_query`.

These tools are exposed by the connected server as of 2026-10-02. A downloaded production Worker bundle exists under `worker-source/`, but its canonical source, TypeScript project, dependency lock and reproducible deployment provenance are not verified. Exposure and the bundle are not evidence that the following requirements are implemented. The package's MCP connection remains `.mcp.json`; updated server guide assets are in `candidate-search/mcp/` and require an authorized Worker change and deployment.

## Required server behavior

Every handler must:

- validate structured inputs and reject unknown fields;
- use parameterized SQL and allowlisted columns, filters, tables, and sort keys;
- enforce authentication, tenant scope, and role authorization server-side;
- use a read-only database principal and bounded query timeout;
- enforce bounded request-body and response sizes before expensive parsing or database work;
- cap pagination and return stable record identifiers;
- mark read tools with `readOnlyHint: true`, `destructiveHint: false`, and `openWorldHint: false`;
- return concise `structuredContent` without secrets or unnecessary personal data;
- produce safe errors that do not reveal SQL, credentials, or candidate details.

Validate output as well as input against an explicit field allowlist. Remove prohibited candidate attributes from every result path, including full profiles and SQL fallback; reject `eu_buerger` and citizenship-based queries. Apply [privacy rules](privacy.md) before data enters tool output or a future external adapter. Prefix-only table allowlists and filtering in the assistant's final response are insufficient.

Derive tenant and role from verified authentication, never user-supplied filters or SQL. Missing, expired, revoked, or wrong-scope credentials fail closed. Keep beta credentials in the host environment and server secrets; URLs and tool arguments contain no credentials.

## Result shape and query semantics

Search/profile tools need server-side field projection and count-only modes to avoid overfetching. Until these are exposed in schemas, the skill must not invent `fields`, `count_only`, `offset`, or cursor arguments. Existing search and SQL tools declare a 200-row cap; `crm_beruf_report` declares a 50-position cap. Counts must be exact distinct aggregates, not the length of a capped list or table-size estimates.

The deployed `berufsgruppe_id` input currently means a LIKE filter on `kri_pozicija`. Do not document it as a mapping identifier without a server schema change. Mapping permission, missing-table behavior, archive defaults, listening-based minimum language levels, same-row education matching, and unknown values follow [query rules](query-rules.md).

`crm_query` must accept only a single `SELECT`, restrict accessible relations, fields, and functions, and enforce a server-side row cap, timeout, and tenant scope. Reject writes, multiple statements, injection attempts, unauthorized fields, and side-effecting functions even inside a SELECT. Use a read-only principal; a string-prefix check is not SQL validation. Parameterize handler-generated queries and use reviewed parsing/validation for the free-SQL path. It is a fallback, not the default search path.

## Planned capabilities

`get_capabilities`, `evaluate_candidate_match`, `check_possible_duplicate`, `classify_candidate_profession`, `evaluate_search_query_intent`, and `review_candidate_note` are proposed in the project plan and are not exposed in the current tool set. Do not advertise or call them. When implemented, discover actual tool availability and schemas first. `get_capabilities` must expose only safe status such as `typesafe.enabled` and `typesafe.status`, never secrets.

Core CRM queries must work without TypeSafe. Future semantic assessments cannot override authorization, privacy, deterministic CRM facts, or authorized user choices. Match score and confidence are separate; unknown data is not a negative match. Policy thresholds and weights belong in one versioned server policy module and require calibration. Disagreement between semantic evaluators requires human review, with no automatic rejection or record merge. Photos, biometrics, automated employment decisions, exports and mutations are decision-gated behind the existing decision gates; they are not an approved implementation phase. See `ACT-152` and `ACT-153`.
