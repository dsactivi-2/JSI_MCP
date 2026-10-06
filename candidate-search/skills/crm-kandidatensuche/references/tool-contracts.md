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

Validate output as well as input against an explicit field allowlist. Candidate search rows include the birth date and may be filtered with `eu_buerger`. Reject a free filter on `kandidat_drzavljanstvo_vrsta` and do not return that raw column by default. Gender, religion, health data, and ethnic origin stay prohibited on every result path, including full profiles and SQL fallback. Apply [privacy rules](privacy.md) before data enters tool output or a future external adapter. Prefix-only table allowlists and filtering in the assistant's final response are insufficient.

Derive tenant and role from verified authentication, never user-supplied filters or SQL. Missing, expired, revoked, or wrong-scope credentials fail closed. Keep beta credentials in the host environment and server secrets; URLs and tool arguments contain no credentials.

## Result shape and query semantics

Candidate search in the downloaded bundle already exposes count_only, cursor, page_size, and limit. Use those arguments. Do not invent fields or offset. The page cap is 1000, not 200. Company search and assignment search still use a 200-row cap in the downloaded handler. `crm_query` on the new server does not add its own row or person limit. `crm_beruf_report` caps its position list at 50. Counts must be the handler's exact distinct aggregate, not the length of a page or a table-size estimate.

`crm_beruf_report` is part of the new server. It matches literal `kri_pozicija` text, excludes archived status 3 by default, and returns the distinct candidate count, overlapping term groups, and top positions. The position list defaults to 15 and cannot exceed 50. Its language breakdown requires an explicit language. The current handler's silent default `Njemački` is not copied.

The deployed `berufsgruppe_id` input currently means a LIKE filter on `kri_pozicija`. Do not document it as a mapping identifier without a server schema change. Mapping permission, missing-table behavior, archive defaults, listening-based minimum language levels, same-row education matching, and unknown values follow [query rules](query-rules.md).

`crm_list_tables` and `crm_describe_table` are included on the new server and expose only allowed relations and fields. `crm_query` is also included. It must accept only a single `SELECT`, restrict accessible relations, fields, and functions, and enforce timeout and tenant scope. The server must not append `LIMIT 200` or any other default that ends the result. A list loads 50 rows per page and does not return 2000 candidates at once. A count returns the full number and does not stop at 50. Reject writes, multiple statements, injection attempts, unauthorized fields, and side-effecting functions even inside a SELECT. Use a read-only principal; a string-prefix check is not SQL validation. Parameterize handler-generated queries and use reviewed parsing/validation for the free-SQL path. It is a fallback, not the default search path.

## Planned capabilities

`get_capabilities`, `evaluate_candidate_match`, `check_possible_duplicate`, `classify_candidate_profession`, `evaluate_search_query_intent`, and `review_candidate_note` are included in phase 3 of the new server. They are not exposed by the current tool set. Do not advertise or call them until that server exposes them. When implemented, discover actual tool availability and schemas first. `get_capabilities` must expose only safe status such as `typesafe.enabled` and `typesafe.status`, never secrets.

Core CRM queries must work without TypeSafe. Semantic assessments cannot override authorization, privacy, deterministic CRM facts, or authorized user choices. Match score and confidence are separate; unknown data is not a negative match. Policy thresholds and weights belong in one versioned server policy module and require calibration. Disagreement between semantic evaluators requires human review, with no automatic rejection or record merge. Writes, export, and import are included in phase 4 (`ACT-152`). Ranking, photos, and biometrics are included in phase 5 (`ACT-153`). Neither phase is built. The current package must not call them.
