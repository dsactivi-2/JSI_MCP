# Documentation change evidence

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
