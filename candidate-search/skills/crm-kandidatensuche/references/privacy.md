# Privacy rules

## Minimal authorized access

- Retrieve and return only fields needed for the explicit request.
- Do not include contact details, addresses, birth dates, identity documents, attachments, or internal notes by default.
- Do not expand from a candidate to linked companies, assignments, or other people unless requested.
- Prefer counts and anonymous aggregates when names are unnecessary.
- Require an explicit request and server-side authorization for sensitive fields or bulk export.
- Never place credentials, full candidate records, or unnecessary personal data in logs, errors, examples, fixtures, or tool metadata.
- Apply tenant and role checks in every MCP handler. A prompt or skill cannot grant access.
- Keep retention and deletion behavior in the CRM system of record; the plugin must not create a shadow database.

## Prohibited candidate attributes

Gender/sex, religion, health data, ethnic origin, nationality, and citizenship are prohibited by the project policy. Do not retrieve, filter, infer, rank by, return, or send these attributes to external services, even if an old schema or live guide exposes them. In particular, do not use `eu_buerger` or `kandidat_drzavljanstvo_vrsta`; EU citizenship is not residence or work location. Reject that criterion and offer a residence/work-location filter only if the user chooses it.

New server schemas, prompts, logs, audit records, and fixtures must omit prohibited attributes. Legacy imported text must be sanitized server-side before it reaches the plugin or any external evaluator. If a tool unexpectedly returns prohibited data, do not repeat it or forward it; report the policy mismatch without candidate details. Removing it from the final answer does not establish compliant retrieval.

## Dates, locations, and optional private data

Birth dates use valid complete `YYYY-MM-DD` values and cannot be in the future. Age is computed on the assessment date, not stored independently and not used for semantic match scoring. The read-only plugin cannot normalize or repair stored records.

Preserve source location text alongside structured city, country name, and ISO country code on the server. A country value describes residence or work, not citizenship.

Marital status and family information are not required, do not affect ranking, and are excluded from external evaluation. Existing access requires a confirmed purpose, lawful basis, and limited server authorization; do not request or retrieve them by default.

## Notes and future evaluators

Notes are professional, factual, business-relevant, neutral, and attributed to an author and date. Note review and rewriting are planned server features; this package never saves notes. Do not send raw notes or full profiles to TypeSafe or another evaluator. Any future adapter must first remove prohibited and unnecessary private data and enforce the approved policy server-side.

Photo review, biometric comparison, and automated employment decisions are not an approved implementation phase. They remain behind the legal and product decision gate in ACT-153 and may be rejected entirely. Photos and appearance do not contribute to professional candidate scores. Do not infer sensitive traits from photos or merge candidate records automatically.
