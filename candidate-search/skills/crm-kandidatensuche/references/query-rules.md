# CRM query rules

## Result scope and tool selection

Return the requested count, names, list, profile, or summary. Do not retrieve extra profiles, statistics, contact fields, or linked records to construct a smaller answer. `crm_stats` returns candidate, company, and assignment totals; `crm_beruf_report` also returns position and language breakdowns; `crm_kandidat_profile` returns a complete profile. Use these only when that scope is requested and their output complies with privacy policy. Otherwise use an explicit-column or aggregate `SELECT` fallback after the guide and necessary schema checks. A filtered list of at most 200 rows is not a complete count.

## Archive and counting

`kandidat_status = 3` is archived; exclude it by default with `kandidat_status <> 3`. Including archived candidates requires an explicit request. This predicate also excludes NULL status; do not silently classify unknown status as active. Other requested status labels must be resolved against the actual schema.

Count unique candidates with `COUNT(DISTINCT k.kandidat_id)` when using one-to-many relations. Prefer `EXISTS` for filters on languages, experience, and education. Table row-count estimates are not exact candidate counts.

## Profession permission

Without mapping permission, use only the user's literal profession term in `position_text` / `kri_pozicija`. Do not add related jobs, automatic translations, or inferred groups. `crm_resolve_beruf` requires explicit permission. Discovery alone does not authorize a candidate query using the discovered variants: display variants and use only selected ones. Explicit permission to discover and include variants covers both actions.

Use `beruf_mapping` only after confirming table availability and mapping permission. The currently exposed `berufsgruppe_id` parameter is documented as a LIKE filter on position text, not a verified mapping ID. Do not infer an ID-based join from that parameter's name. If a mapping table is absent, use confirmed `kri_pozicija` values only.

## Language

Known levels are `A1`, `A2`, `B1`, `B2`, `C1`, and `C2`. `BEZ ZNANJA` explicitly means no knowledge. NULL, empty, not selected, and no matching language row mean unknown; keep them separate from explicit no knowledge and distinguish them if the requested breakdown needs it.

Minimum-level filtering uses listening (`kj_slusanje`). At least B1 means `IN ('B1', 'B2', 'C1', 'C2')`. Language and level must match in the same `EXISTS` / language row. If reading or writing is requested, use that verified dimension instead and name it in the result when material. Resolve language spelling without broadening the language filter.

## Age, location, and education

Use completed years with `TIMESTAMPDIFF(YEAR, kandidat_datumrodjenja, CURDATE())` only for an explicit authorized age filter. Missing, invalid, incomplete, or future birth dates are unknown and excluded from such filters. Verify the stored representation and database assessment date before SQL fallback; never calculate age by subtracting calendar years or return a birth date to answer an age-only request.

Country means residence or work location, never nationality or citizenship. Resolve location columns from the actual schema; do not substitute citizenship fields.

When both school and qualification direction are requested, both predicates must match the same education row.

## Limits and fallback

Current candidate, company, assignment, and SQL tools declare a 200-row cap; profession reports declare a 50-position cap. Respect smaller user limits. No offset or cursor is exposed by the current search schemas: do not invent pagination parameters, work around caps by exporting data, or claim a capped list is complete.

Use a single simplest sufficient `SELECT` over verified allowed relations and explicit permitted fields. Read-only syntax alone does not establish tenant authorization or field safety. The server must validate SQL, scope, functions, and output as described in [tool contracts](tool-contracts.md).
