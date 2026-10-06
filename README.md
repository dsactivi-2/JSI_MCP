# Cloud CRM MCP project

This is the GitHub repository [dsactivi-2/JSI_MCP](https://github.com/dsactivi-2/JSI_MCP).
The hosted read server is [https://calm-forge-hk9rc.run.mcp-use.com/mcp](https://calm-forge-hk9rc.run.mcp-use.com/mcp).
Database passwords, tokens, and `node_modules` are not included.

This repository contains the existing read-only `candidate-search` plugin, a
downloaded Cloudflare Worker snapshot, a TypeScript MCP server workspace, and
the approved plan for the broader Cloud CRM MCP application.

The folder name is MCP Plugin 2. The installable package remains candidate-search. The Linear tracker is https://linear.app/activi/project/lena-1333951b31fb. Its current title, Lena, was rejected on 5 October 2026 and is not the product name. Start with the [documentation index](docs/README.md), [handover](docs/memory.md),
[product specification](server/SPEC.md), and [open-work roadmap](docs/open-work.md).

## Layout

- `candidate-search/plugin.json` — portable package identity and skill discovery.
- `candidate-search/.codex-plugin/plugin.json` — Codex beta manifest and presentation metadata.
- `candidate-search/.mcp.json` — authenticated remote MCP connection for the local beta.
- `candidate-search/skills/crm-kandidatensuche/` — workflow, UI metadata, privacy rules, and tool contract.
- `candidate-search/tests/evals.json` — activation and safety evaluation cases.
- `candidate-search/mcp/crm_search_guide.{md,json}` — prepared Worker guide update; these files are not loaded or deployed by `.mcp.json`.
- `scripts/validate_package.py` — repeatable local consistency checks, with no CRM calls.
- `server/` — local workshop, MCP Inspector setup, and product specification. It is not the hosted server.
- `cloud-crm-mcp/` — hosted mcp-use read server on Manufact. Online and connected to the existing MySQL database. One count was checked on 6 October 2026.
- `worker-source/` — downloaded Worker source snapshot; not yet proven to be the canonical deployment source.
- `docs/` — current context, audits, roadmap, documentation index, and change evidence.

## Update 0.1.0-beta.2

The package follows the updated project data policy and the prepared Desktop MCP guide: distinct counts, literal profession searches unless mapping is authorized, listening-based language minima, same-record education filters, valid age calculations, and minimal field retrieval. On 6 October 2026 the new server was decided to keep the birth date in candidate search rows and the eu_buerger filter. Gender, religion, health data, ethnic origin, and the raw citizenship column stay prohibited. Both manifest versions are synchronized.

The connected MCP guide was read on 2026-10-02. It still documents citizenship, and candidate search still exposes `eu_buerger`; full profile output has not been verified. A downloaded production Worker bundle now exists under `worker-source/`, but it is not a canonical reproducible source tree. The new guide assets and tool contracts now keep the birth date and the eu_buerger filter. The new Manufact server is deployed. One count on the existing MySQL database succeeded. Candidate rows were not read. The old Worker script was not replaced. Field projection, exact count modes, output redaction, authorization, and SQL enforcement require implementation and verification on the server. The plugin cannot establish those guarantees through instructions.

## Beta authentication

The remote MCP server reads its bearer credential from the host environment. Set it before starting Codex:

```powershell
$env:CRM_REMOTE_MCP_TOKEN = Read-Host "CRM beta token"
```

The token must never be added to a URL, manifest, skill, archive, log, or Git commit. Restart Codex after changing the environment value. OAuth 2.1 account linking replaces this temporary mechanism in the final release.

## Security prerequisite

The packaged MCP URL must never contain a token, password, or API key. The beta uses `bearer_token_env_var`; the final release uses OAuth 2.1. Enforce authorization in every handler and rotate temporary credentials after testing.

## Validate

```powershell
python .\scripts\validate_package.py .\candidate-search
python "$env:USERPROFILE\.codex\skills\.system\plugin-creator\scripts\validate_plugin.py" .\candidate-search
python "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" .\candidate-search\skills\crm-kandidatensuche
```

The plugin-creator validator is optional if that system skill is not installed; the local consistency checker does not replace its full schema validation. The skill validator requires PyYAML. `tests/evals.json` contains synthetic skill and server scenarios with expected outcomes; their presence is not evidence they have been executed. Exercise skill cases with synthetic tool responses and server cases only in an authorized isolated test tenant.

## Apply the MCP update

1. Obtain the Cloudflare Worker source and use `candidate-search/mcp/crm_search_guide.md` or its structured JSON to replace the `crm_search_guide` response.
2. Implement the required input/output, SQL, tenant, and privacy protections in [tool contracts](candidate-search/skills/crm-kandidatensuche/references/tool-contracts.md). A guide-only change does not secure existing handlers.
3. Test initialization, tool schemas and annotations, positive and negative authorization, limits, and every server scenario with MCP Inspector against the isolated test deployment.
4. Deploy the tested Worker and verify the live guide and tool schemas before updating the local deployment status.

The target environment variable is `CRM_REMOTE_MCP_TOKEN`. Existing manifests
and the current Inspector wrapper still need a coordinated migration from the
older `CRM_CANDIDATE_MCP_TOKEN` name; see `docs/open-work.md`. The
[official plugin packaging documentation](https://developers.openai.com/plugins/build/plugins)
describes the portable and Codex package layouts. ChatGPT registration and
production OAuth remain separate release work.

Test the endpoint with MCP Inspector, then exercise every case in `tests/evals.json`. For ChatGPT, register the deployed `/mcp` endpoint in developer mode before packaging its generated `plugin_asdk_app...` mapping. The local Codex beta deliberately uses `.mcp.json`, because the current portable `mcp.json` loader does not support environment-backed bearer credentials.

## Current implementation versus planned scope

The deployed beta remains tool-only and primarily read-only. The new server includes eight points, split into phases in docs/open-work.md. Phase 1 is the read server. Own screens, TypeSafe scoring, writes/export/import, and ranking/photos/biometrics are included in later phases. Nothing in the roadmap may be advertised as implemented until its server tool, authorization, UI, and tests exist. Phases 4 and 5 still need their design, and a legal review that has not been evidenced, before real-data testing.
